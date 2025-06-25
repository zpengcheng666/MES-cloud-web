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
        <el-select
          v-model="formData.materialStockId"
          placeholder="请选择要呼叫的容器，直接呼叫空AGV则不用选择"
          clearable
          filterable
        >
          <el-option
            v-for="stock in materialStockContainerList"
            :key="stock.id"
            :label="stock.barCode"
            :value="stock.id + ''"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="呼叫库位" prop="locationId">
        <el-select v-model="formData.locationId" placeholder="请选择呼叫库位" clearable filterable>
          <el-option
            v-for="warehouseLocation in warehouseLocationList"
            :key="warehouseLocation.id"
            :label="warehouseLocation.locationCode"
            :value="warehouseLocation.id + ''"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!--    <template #footer>-->
    <el-button @click="submitForm" type="primary" :disabled="formLoading">呼叫托盘</el-button>
    <!--    </template>-->
    <!--  </Dialog>-->
  </ContentWrap>
</template>
<script setup lang="ts">
import { isBlank } from '@/utils/is'
import { MaterialStockApi } from '@/api/wms/materialstock'
import { WarehouseLocationApi } from '@/api/wms/warehouselocation'
import { InWarehouseDetailApi } from '@/api/wms/inwarehousedetail'
/** 物料收货 表单 */
defineOptions({ name: 'CallCarrierForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const dialogVisible = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  materialStockId: undefined,
  locationId: undefined
})

const formRules = reactive({
  materialStockId: [{ required: true, message: '物料容器不存在', trigger: 'blur' }],
  locationId: [{ required: true, message: '呼叫库位不存在', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const materialStockContainerList = ref() //储位
const warehouseLocationList = ref() //库位

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    // 提交的二次确认
    await message.confirm('确认呼叫托盘？')

    const data = formData.value

    await InWarehouseDetailApi.callTray(data)
    resetForm()

    message.success('呼叫托盘成功')

    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    materialStockId: undefined,
    locationId: undefined
  }
  formRef.value?.resetFields()
}

const getMaterialStockContainer = async () => {
  materialStockContainerList.value = await MaterialStockApi.getMaterialStockContainerList()
  warehouseLocationList.value = await WarehouseLocationApi.getWarehouseLocationList()
}

/** 初始化 **/
onMounted(() => {
  getMaterialStockContainer()
})
</script>
