<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="刀具名称" prop="name">
        <el-input placeholder="请输入刀具名称" v-model="formData.name" disabled />
      </el-form-item>

      <el-form-item label="刀具类码" prop="code">
        <el-input placeholder="请输入刀具类码" v-model="formData.code" disabled />
      </el-form-item>

      <el-form-item label="刀具类型" prop="spec">
        <el-input placeholder="请输入通用规格" v-model="formData.spec" disabled />
      </el-form-item>

      <el-form-item label="刀具分类" prop="toolCategoryValue">
        <el-input placeholder="请输入刀具分类" v-model="formData.toolCategoryValue" disabled />
      </el-form-item>

      <el-form-item label="库存安全上限" prop="upLimit">
        <el-input-number
          placeholder="请输入库存安全上限"
          v-model="formData.upLimit"
          :step="1"
          :min="1"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="库存安全下限" prop="downLimit">
        <el-input-number
          placeholder="请输入库存安全下限"
          v-model="formData.downLimit"
          :step="1"
          :min="1"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { batchMesState, createStoreSafety } from '@/api/knifetool/store/storeSafety'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref

const formData = ref<batchMesState>({
  id: undefined,
  toolInformationId: undefined,
  code: '',
  name: '',
  spec: '',
  toolCategoryValue: '',
  upLimit: undefined,
  downLimit: undefined
})

const checkDownLimit = (_rule, value, callback) => {
  if (formData.value.upLimit)
    if (parseInt(value) >= formData.value.upLimit) {
      callback(new Error(t('store.safety.exceedingLimit')))
    } else {
      callback()
    }
}

const formRules = reactive({
  upLimit: [{ required: true, message: '请选择或输入安全上限', trigger: 'blur' }],
  downLimit: [
    { required: true, message: '请选择或输入安全下限', trigger: 'blur' },
    { required: true, validator: checkDownLimit, trigger: 'blur' }
  ]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    formLoading.value = true
    try {
      formData.value = JSON.parse(JSON.stringify(row))
    } finally {
      formLoading.value = false
    }
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
    const data = formData.value as batchMesState
    if (formType.value === 'create') {
      await createStoreSafety(data)
      message.success(t('common.createSuccess'))
    } else {
      await createStoreSafety(data)
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
    toolInformationId: undefined,
    code: '',
    name: '',
    spec: '',
    toolCategoryValue: '',
    upLimit: undefined,
    downLimit: undefined
  }
  formRef.value?.resetFields()
}
</script>
