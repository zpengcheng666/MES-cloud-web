<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="申请id" prop="applicationId">
<!--        <el-select v-model="formData.applicationId" placeholder="请选择申请id">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
        <el-input v-model="formData.applicationId" placeholder="请输入资源编码" />
      </el-form-item>
      <el-form-item label="申请单元" prop="processingUnitId">
<!--        <el-select v-model="formData.processingUnitId" placeholder="请选择申请单元">-->
<!--          <el-option label="请选择字典生成" value="" />-->
<!--        </el-select>-->
        <el-input v-model="formData.processingUnitId" placeholder="请输入资源编码" />
      </el-form-item>
      <el-form-item label="资源类型" prop="resourceType">
        <el-input v-model="formData.resourceType" placeholder="请输入资源类型" />
      </el-form-item>
      <el-form-item label="资源编码" prop="resourceCode">
        <el-input v-model="formData.resourceCode" placeholder="请输入资源编码" />
      </el-form-item>
      <el-form-item label="需求数量" prop="count">
        <el-input v-model="formData.count" placeholder="请输入需求数量" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ReceiptRecordApi, ReceiptRecordVO } from '@/api/mcs/receiptrecord'

/** 生产单元签收记录 表单 */
defineOptions({ name: 'ReceiptRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  applicationId: undefined,
  processingUnitId: undefined,
  resourceType: undefined,
  resourceCode: undefined,
  count: undefined,
})
const formRules = reactive({
  applicationId: [{ required: true, message: '申请id不能为空', trigger: 'change' }],
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
      formData.value = await ReceiptRecordApi.getReceiptRecord(id)
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
    const data = formData.value as unknown as ReceiptRecordVO
    if (formType.value === 'create') {
      await ReceiptRecordApi.createReceiptRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await ReceiptRecordApi.updateReceiptRecord(data)
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
    applicationId: undefined,
    processingUnitId: undefined,
    resourceType: undefined,
    resourceCode: undefined,
    count: undefined,
  }
  formRef.value?.resetFields()
}
</script>
