<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <strong>紧急任务审批</strong>
        </div>
      </template>
      <el-descriptions direction="vertical" border :column="4">
        <el-descriptions-item label="工单号">{{ rowData.workNo }}</el-descriptions-item>
        <el-descriptions-item label="最晚配送日期">{{
          rowData.latestDeliveryTime
        }}</el-descriptions-item>
        <el-descriptions-item label="刀组编码">{{ rowData.groupCode }}</el-descriptions-item>
        <el-descriptions-item label="计划需求数量">{{ rowData.planQuantity }}</el-descriptions-item>
        <el-descriptions-item label="实际需求数量">{{
          rowData.actualQuantity
        }}</el-descriptions-item>
        <el-descriptions-item label="缺少数量">{{ rowData.lackQuantity }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{
          rowData.approveStateValue
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-form ref="formRef" v-loading="formLoading" :model="rowData">
      <el-card shadow="never" class="mt-20px">
        <template #header>
          <div class="card-header">
            <strong>选择审批状态</strong>
          </div>
        </template>
        <el-form-item prop="approveState">
          <el-radio-group v-model="formData.approveState" :disabled="visibleButton">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card shadow="never" class="mt-20px">
        <template #header>
          <div class="card-header">
            <strong>审核不通过原因</strong>
          </div>
        </template>
        <el-form-item prop="opinion">
          <el-input
            :disabled="visibleButton"
            v-model="formData.opinion"
            :rows="2"
            type="textarea"
            placeholder="请输入审核不通过原因"
          />
        </el-form-item>
      </el-card>
    </el-form>

    <template #footer v-if="!visibleButton">
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { updateApproveState } from '@/api/knifetool/paring/paringPlanUrgent'

const { t } = useI18n() // 国际化v
const message = useMessage() // 消息弹窗

const visibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  approveState: 1,
  opinion: ''
})
const rowData = ref<any>({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  console.log(row)

  resetForm()

  formType.value = type
  dialogVisible.value = true
  rowData.value = JSON.parse(JSON.stringify(row))

  if (type === 'details') {
    dialogTitle.value = '查看'
    visibleButton.value = true
    formData.value.approveState = row.approveState
    formData.value.opinion = row.opinion
  } else {
    dialogTitle.value = '审批'
    visibleButton.value = false
    formData.value.id = row.id
  }
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log(rowData.value)
    const res = await updateApproveState(formData.value)
    console.log(res)

    message.success('审批成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    approveState: 1,
    opinion: ''
  }
  visibleButton.value = false
  formRef.value?.resetFields()
}
</script>
