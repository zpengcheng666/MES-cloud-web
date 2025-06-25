<template>
  <!--  <Dialog :title="dialogTitle" v-model="dialogVisible">-->
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
    
    <!-- <el-form-item label="出库类型" prop="outTypes">
      <el-select v-model="formData.outTypes" multiple clearable placeholder="请选择出库类型">
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.WMS_OUT_TYPE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item label="出库单号" prop="orderNumber">
      <el-select v-model="formData.orderNumber" @change="changeOrderNumber(formData.orderNumber)" placeholder="请选择出库单号" clearable filterable>
        <el-option
          v-for="orderNumber in orderNumbers"
          :key="orderNumber"
          :label="orderNumber"
          :value="orderNumber"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="物料条码" prop="materialStockId">
      <el-select v-model="formData.materialStockId" :disabled="!materialStockLoading"  placeholder="请选择物料条码">
        <el-option
          v-for="outwarehousedetail in outWarehouseDetailList"
          :key="outwarehousedetail.id"
          :label="outwarehousedetail.realBarCode"
          :value="outwarehousedetail.materialStockId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="呼叫库位" prop="locationId">
      <el-select v-model="formData.locationId" placeholder="请选择绑定库位" clearable filterable>
        <el-option
          v-for="warehouseLocation in warehouseLocationList"
          :key="warehouseLocation.id"
          :label="warehouseLocation.locationCode"
          :value="warehouseLocation.id+''"
        />
      </el-select>
    </el-form-item>
    </el-form>
<!--    <template #footer>-->
      <el-button @click="submitForm" type="primary" :disabled="formLoading">呼叫物料</el-button>
<!--    </template>-->
<!--  </Dialog>-->
  </ContentWrap>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import { OutWarehouseDetailApi } from "@/api/wms/outwarehousedetail";
import { isBlank } from '@/utils/is';
/** 呼叫物料 表单 */
defineOptions({ name: 'CallMaterial' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const dialogVisible = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const materialStockLoading = ref(false) // 物料库存的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  orderNumber: undefined,
  locationId: undefined,
  materialStockId: undefined,
  outTypes: undefined,
})

const formRules = reactive({
  orderNumber: [{ required: true, message: '出库单号不存在', trigger: 'blur' }],
  materialStockId: [{ required: true, message: '物料条码不存在', trigger: 'blur' }],
  locationId: [{ required: true, message: '呼叫库位不存在', trigger: 'blur' }],
  outTypes: [{ required: true, message: '出库类型不存在', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseLocationList =ref() //库位
const orderNumbers =ref<string[]>([]) //出库详情单
const outWarehouseDetailList = ref<any[]>([]) // 物料库存列表

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    // 提交的二次确认
    await message.confirm("确认呼叫此物料？")

    const data = formData.value

    await OutWarehouseDetailApi.callMaterial(data)
    resetForm();

    message.success("呼叫物料成功")

    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    orderNumber: undefined,
    locationId: undefined,
    materialStockId: undefined,
    outTypes: undefined,
  }
  formRef.value?.resetFields()
}

const changeOrderNumber = async (orderNumber) => {
  formData.value.materialStockId = undefined
  if(isBlank(orderNumber)){
    outWarehouseDetailList.value = []
    materialStockLoading.value = false
    return;
  }
  // 只查询此出库详情单下的物料库存列表
  outWarehouseDetailList.value = await OutWarehouseDetailApi.getOutWarehouseDetailListByOrderNumber(orderNumber)
  materialStockLoading.value = true
}

const getList = async () => {
  warehouseLocationList.value = await WarehouseLocationApi.getWarehouseLocationList()
  // 获取出库详情单 出库单号列表
  orderNumbers.value =await OutWarehouseDetailApi.getOutWarehouseDetailGroupByOrderNumberList()
}

/** 初始化 **/
onMounted(() => {
  getList();
})
</script>
  