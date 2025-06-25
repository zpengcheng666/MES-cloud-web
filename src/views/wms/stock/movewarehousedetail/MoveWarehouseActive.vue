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
      <el-form-item label="移库库位" prop="locationId">
        <el-select v-model="formData.locationId" @change="getDefalutWarehouse" placeholder="请选择入库库位" clearable filterable>
          <el-option
            v-for="warehouseLocation in warehouseLocationList"
            :key="warehouseLocation.id"
            :label="warehouseLocation.locationCode"
            :value="warehouseLocation.id+''"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移库仓库" prop="warehouseId">
        <el-select v-model="formData.warehouseId" :disabled="!formData.locationId" clearable filterable placeholder="请选择仓库">
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseCode+ ' - ' + warehouse.warehouseName"
            :value="warehouse.id+''"
          />
        </el-select>
      </el-form-item>

    </el-form>
<!--    <template #footer>-->
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
<!--    </template>-->
<!--  </Dialog>-->
  </ContentWrap>
</template>
<script setup lang="ts">
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import { WarehouseApi } from "@/api/wms/warehouse";
import { MaterialConfigApi, MaterialConfigVO } from "@/api/wms/materialconfig";
import { isBlank } from "@/utils/is";
import { MoveWarehouseDetailApi } from "@/api/wms/movewarehousedetail";

/** 物料收货 表单 */
defineOptions({ name: 'InWarehouseActive' })
const warehouseList = ref<any[]>([]) // 仓库列表

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  locationId: undefined,
  warehouseId: undefined,
})
const formRules = reactive({
  locationId: [{ required: true, message: '入库库位不能为空', trigger: 'blur' }],
  warehouseId: [{ required: true, message: '入库仓库不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseLocationList =ref<any[]>([]) //库位
const warehouseConfig = ref<MaterialConfigVO>() //物料类型


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    // 提交的二次确认
    await message.confirm("确认提交？")

    const data = formData.value

    await MoveWarehouseDetailApi.moveWarehouseAction(data.locationId,data.warehouseId)
    // resetForm();

    message.success("入库任务下发成功")

    dialogVisible.value = false
    // 发送操作成功的事件
    // emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
// const resetForm = () => {
//   formData.value = {
//     id: undefined,
//     locationId: undefined,
//   }
//   formRef.value?.resetFields()
// }

const getDefalutWarehouse = async () => {
  if(!isBlank(formData.value.locationId))warehouseConfig.value = await MaterialConfigApi.getDefalutWarehouse(formData.value.locationId);
  if(warehouseConfig.value == null || isBlank(warehouseConfig.value.id)){
    message.error("该库位没有设置默认仓库，请先设置默认仓库");
    return;
  }
  formData.value.warehouseId = warehouseConfig.value.defaultWarehouseId;
}

/** 获得物料类型树 */
const getWarehouseLocation = async () => {
  // 获得库位、储位、
  warehouseLocationList.value =await WarehouseLocationApi.getWarehouseLocationList()

  //加载仓库列表
  warehouseList.value = await WarehouseApi.getWarehouseList()
}
/** 初始化 **/
onMounted(() => {
  getWarehouseLocation();
})
</script>
