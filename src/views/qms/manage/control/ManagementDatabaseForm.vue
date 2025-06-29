<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="附件" prop="fileUrl">
        <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :formType="formType" :is-show-preview="true"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="formType!='detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ManagementDatabaseApi, ManagementDatabaseVO } from '@/api/qms/managementdatabase'

/** 质量管理资料库 表单 */
defineOptions({ name: 'ManagementDatabaseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  treeId: undefined,
  type: 4,
  fileUrl: undefined,
  remark: undefined,
  status: undefined,
  processInstanceId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, treeId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ManagementDatabaseApi.getManagementDatabase(id)
    } finally {
      formLoading.value = false
    }
  }else {
    formData.value.treeId = treeId
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
    const data = formData.value as unknown as ManagementDatabaseVO
    if (formType.value === 'create') {

      console.log(111, data)
      await ManagementDatabaseApi.createManagementDatabase(data)
      message.success(t('common.createSuccess'))
    } else {
      await ManagementDatabaseApi.updateManagementDatabase(data)
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
    treeId: undefined,
    type: 4,
    fileUrl: undefined,
    remark: undefined,
    status: undefined,
    processInstanceId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
