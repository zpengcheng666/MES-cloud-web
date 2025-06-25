<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="检验单任务ID" prop="taskId">
        <el-input v-model="formData.taskId" placeholder="请输入检验单任务ID" />
      </el-form-item>
      <el-form-item label="物料ID" prop="materialId">
        <el-input v-model="formData.materialId" placeholder="请输入物料ID" />
      </el-form-item>
      <el-form-item label="物料类型ID" prop="materialConfigId">
        <el-input v-model="formData.materialConfigId" placeholder="请输入物料类型ID" />
      </el-form-item>
      <el-form-item label="物料条码" prop="barCode">
        <el-input v-model="formData.barCode" placeholder="请输入物料条码" />
      </el-form-item>
      <el-form-item label="物料批次号" prop="batchNumber">
        <el-input v-model="formData.batchNumber" placeholder="请输入物料批次号" />
      </el-form-item>
      <el-form-item label="状态 0 未生成 1 已生成" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { InspectionSheetGenerateTaskDetailApi, InspectionSheetGenerateTaskDetailVO } from '@/api/qms/inspectionsheetgeneratetaskdetail'

/** 检验单生成任务明细 表单 */
defineOptions({ name: 'InspectionSheetGenerateTaskDetailForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskId: undefined,
  materialId: undefined,
  materialConfigId: undefined,
  barCode: undefined,
  batchNumber: undefined,
  status: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await InspectionSheetGenerateTaskDetailApi.getInspectionSheetGenerateTaskDetail(id)
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as unknown as InspectionSheetGenerateTaskDetailVO
    if (formType.value === 'create') {
      await InspectionSheetGenerateTaskDetailApi.createInspectionSheetGenerateTaskDetail(data)
      message.success(t('common.createSuccess'))
    } else {
      await InspectionSheetGenerateTaskDetailApi.updateInspectionSheetGenerateTaskDetail(data)
      message.success(t('common.updateSuccess'))
    }
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
    taskId: undefined,
    materialId: undefined,
    materialConfigId: undefined,
    barCode: undefined,
    batchNumber: undefined,
    status: undefined,
  }
  formRef.value?.resetFields()
}
</script>
