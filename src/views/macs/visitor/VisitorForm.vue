<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="formData.avatar" placeholder="请输入头像" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择性别(0-默认未知,1-男,2-女)">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入电话" />
      </el-form-item>
      <el-form-item label="状态(1-正常,2-冻结)" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="公司/组织" prop="organization">
        <el-input v-model="formData.organization" placeholder="请输入公司/组织" />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="formData.department" placeholder="请输入部门" />
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
import { VisitorApi, VisitorVO } from '@/api/macs/visitor'

/** 申请角色 表单 */
defineOptions({ name: 'VisitorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  idCard: undefined,
  name: undefined,
  avatar: undefined,
  sex: undefined,
  phone: undefined,
  status: undefined,
  organization: undefined,
  department: undefined
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
      formData.value = await VisitorApi.getVisitor(id)
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
    const data = formData.value as unknown as VisitorVO
    if (formType.value === 'create') {
      await VisitorApi.createVisitor(data)
      message.success(t('common.createSuccess'))
    } else {
      await VisitorApi.updateVisitor(data)
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
    idCard: undefined,
    name: undefined,
    avatar: undefined,
    sex: undefined,
    phone: undefined,
    status: undefined,
    organization: undefined,
    department: undefined
  }
  formRef.value?.resetFields()
}
</script>
