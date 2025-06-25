<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="类CODE" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码分类CODE" />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入编码分类名称" />
      </el-form-item>
      <el-form-item label="所属服务" prop="service">
        <el-select v-model="formData.service" placeholder="请选择分类所属服务">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.MCC_SERVICE_CODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="使用地址" prop="path">
        <el-input v-model="formData.path" placeholder="请输入分类查看编码使用地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { EncodingClassificationApi, EncodingClassificationVO } from '@/api/mcc/encodingclassification'

/** 编码分类 表单 */
defineOptions({ name: 'EncodingClassificationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  service: undefined,
  path: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '编码分类CODE不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '编码分类名称不能为空', trigger: 'blur' }],
  service: [{ required: true, message: '分类所属服务不能为空', trigger: 'change' }],
  path: [{ required: true, message: '分类查看编码使用地址不能为空', trigger: 'blur' }],
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
      formData.value = await EncodingClassificationApi.getEncodingClassification(id)
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
    const data = formData.value as unknown as EncodingClassificationVO
    if (formType.value === 'create') {
      await EncodingClassificationApi.createEncodingClassification(data)
      message.success(t('common.createSuccess'))
    } else {
      await EncodingClassificationApi.updateEncodingClassification(data)
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
    code: undefined,
    name: undefined,
    service: undefined,
    path: undefined,
  }
  formRef.value?.resetFields()
}
</script>