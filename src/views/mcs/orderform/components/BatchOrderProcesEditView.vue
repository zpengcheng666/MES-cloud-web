<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编码" prop="orderId">
        <el-input disabled v-model="formData.orderNumber" />
      </el-form-item>
      <el-form-item label="批次编码" prop="batchId">
        <el-input disabled v-model="formData.batchNumber" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input disabled v-model="formData.count" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态">
          <el-option
          v-for="dict in mySimpleBatchStatus"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外协厂家" prop="aidMill">
        <el-input disabled v-model="formData.aidMill" placeholder="请输入外协厂家" />
      </el-form-item>
      <el-form-item label="预计开始时间" prop="planStartTime">
        <el-date-picker
          v-model="formData.planStartTime"
          value-format="x"
          type="datetime"
          placeholder="选择预计开始时间"
        />
      </el-form-item>
      <el-form-item label="预计结束时间" prop="planEndTime">
        <el-date-picker
          v-model="formData.planEndTime"
          type="datetime"
          value-format="x"
          placeholder="选择预计结束时间"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          value-format="x"
          type="datetime"
          placeholder="选择预计开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="datetime"
          value-format="x"
          placeholder="选择预计结束时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BatchOrderApi, BatchOrderVO } from '@/api/mcs/batchorder'
import { getIntDictOptions } from '@/utils/dict'
import {inject} from "vue";

/** 批次工序任务 表单 */
defineOptions({ name: 'BatchRecordEditView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('编辑') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  orderId: undefined,
  batchId: undefined,
  processId: undefined,
  number: undefined,
  processingUnitId: undefined,
  deviceNumber: undefined,
  procedureNum: undefined,
  status: undefined,
  planStartTime: undefined,
  planEndTime: undefined,
  count: undefined,
  preRecordId: undefined,
  startTime: undefined,
  endTime: undefined,
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref
const deviceList = ref([])
const mySimpleBatchStatus = ref(
  [
    {key: 0, label: "新建", value: 0},
    {key: 5, label: "进行中", value: 5},
    {key: 6, label: "已完成", value: 6},
  ]
)

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    formData.value = await BatchOrderApi.getBatchOrder(row.id)
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as BatchOrderVO
    await BatchOrderApi.updateBatchOrder(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    orderId: undefined,
    batchId: undefined,
    processId: undefined,
    number: undefined,
    processingUnitId: undefined,
    deviceNumber: undefined,
    procedureNum: undefined,
    status: undefined,
    planStartTime: undefined,
    planEndTime: undefined,
    count: undefined,
    preRecordId: undefined,
    startTime: undefined,
    endTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
