<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="父类型id" prop="parentId">
        <el-input v-model="formData.parentId" placeholder="请输入父类型id" />
      </el-form-item>
      <el-form-item label="状态  1 预生成 2 已使用  3释放" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态  1 预生成 2 已使用  3释放">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.MCC_RECORD_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编码规则ID" prop="encodingRuleId">
        <el-input v-model="formData.encodingRuleId" placeholder="请输入编码规则ID" />
      </el-form-item>
      <el-form-item label="编码分类ID" prop="classificationId">
        <el-input v-model="formData.classificationId" placeholder="请输入编码分类ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CodeRecordApi, CodeRecordVO } from '@/api/mcc/coderecord'

/** 编码记录 表单 */
defineOptions({ name: 'CodeRecordForm' })

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
  parentId: undefined,
  status: undefined,
  encodingRuleId: undefined,
  classificationId: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  parentId: [{ required: true, message: '父类型id不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态  1 预生成 2 已使用  3释放不能为空', trigger: 'change' }],
  encodingRuleId: [{ required: true, message: '编码规则ID不能为空', trigger: 'blur' }],
  classificationId: [{ required: true, message: '编码分类ID不能为空', trigger: 'blur' }],
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
      formData.value = await CodeRecordApi.getCodeRecord(id)
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
    const data = formData.value as unknown as CodeRecordVO
    if (formType.value === 'create') {
      await CodeRecordApi.createCodeRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await CodeRecordApi.updateCodeRecord(data)
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
    parentId: undefined,
    status: undefined,
    encodingRuleId: undefined,
    classificationId: undefined,
  }
  formRef.value?.resetFields()
}
</script>