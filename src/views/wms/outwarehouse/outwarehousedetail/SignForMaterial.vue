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
    
    <el-form-item label="物料条码" prop="materialStockId">
      <el-select v-model="formData.materialStockId"  placeholder="请选择物料条码">
        <el-option
          v-for="materialStock in materialStockList"
          :key="materialStock.id"
          :label="materialStock.barCode"
          :value="materialStock.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="签收库位" prop="locationId">
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
      <el-button @click="submitForm" type="primary" :disabled="formLoading">签收物料</el-button>
<!--    </template>-->
<!--  </Dialog>-->
  </ContentWrap>
</template>
<script setup lang="ts">
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import { OutWarehouseDetailApi } from "@/api/wms/outwarehousedetail";
import { isBlank } from '@/utils/is';
import { MaterialStockApi } from "@/api/wms/materialstock";
import { StockActiveApi } from "@/api/wms/stockactive";
/** 签收物料 表单 */
defineOptions({ name: 'SignForMaterial' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const dialogVisible = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  locationId: undefined,
  materialStockId: undefined,
})

const formRules = reactive({
  materialStockId: [{ required: true, message: '物料条码不存在', trigger: 'blur' }],
  locationId: [{ required: true, message: '签收库位不存在', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseLocationList =ref() //库位
const materialStockList = ref<any[]>([]) // 物料库存列表

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    // 提交的二次确认
    await message.confirm("确认签收此物料？")

    const data = formData.value

    await StockActiveApi.SignForMaterial(data)
    resetForm();

    message.success("签收物料成功")

    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    locationId: undefined,
    materialStockId: undefined,
  }
  formRef.value?.resetFields()
}

const getList = async () => {
  warehouseLocationList.value = await WarehouseLocationApi.getWarehouseLocationList()
    // 获取物料库存列表
    materialStockList.value = await MaterialStockApi.getMaterialStockList()
}

/** 初始化 **/
onMounted(() => {
  getList();
})
</script>
