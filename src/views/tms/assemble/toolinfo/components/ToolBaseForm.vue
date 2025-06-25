<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="刀具直径" prop="diameter">
        <el-input v-model="formData.diameter" placeholder="请输入刀具直径" />
      </el-form-item>
      <el-form-item label="刀具总长" prop="totalLength">
        <el-input v-model="formData.totalLength" placeholder="请输入刀具总长" />
      </el-form-item>
      <el-form-item label="刀具r角" prop="rAngle">
        <el-input v-model="formData.rAngle" placeholder="请输入刀具r角" />
      </el-form-item>
      <el-form-item label="刀具额定寿命" prop="ratedLife">
        <el-input v-model="formData.ratedLife" placeholder="请输入刀具额定寿命" />
      </el-form-item>
      <el-form-item label="剩余寿命" prop="remainLife">
        <el-input v-model="formData.remainLife" placeholder="请输入剩余寿命" />
      </el-form-item>
     </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ToolInfoApi } from '@/api/tms/toolinfo'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  diameter: undefined,
  totalLength: undefined,
  rAngle: undefined,
  ratedLife: undefined,
  remainLife: undefined,
  toolInfoId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, toolInfoId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.toolInfoId = toolInfoId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ToolInfoApi.getToolBase(id)
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
    const data = formData.value
    if (formType.value === 'create') {
      await ToolInfoApi.createToolBase(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolInfoApi.updateToolBase(data)
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
    diameter: undefined,
    totalLength: undefined,
    rAngle: undefined,
    ratedLife: undefined,
    remainLife: undefined,
    toolInfoId: undefined,
  }
  formRef.value?.resetFields()
}
</script>