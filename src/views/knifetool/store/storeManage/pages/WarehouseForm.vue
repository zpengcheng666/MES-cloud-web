<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="130px">
      <el-form-item label="请输入仓库名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入仓库名称" />
      </el-form-item>
      <el-form-item label="请输入位置" prop="location">
        <el-input v-model="formData.location" placeholder="请输入位置" />
      </el-form-item>
      <el-form-item label="盘点负责人" prop="chargeUserId">
        <formRecipientSelect ref="recipientRef" :value="formData.admin" placeholder="请选择盘点负责人"
          @handle-select="(val) => setFormSelectValue(val, 'admin')" />
      </el-form-item>
      <el-form-item label="仓库类型" prop="type">
        <el-radio-group v-model="formData.type" :disabled="!editOrView">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_WAREHOUSE_TYPE)" :key="dict.value"
            :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as warehouseApi from '@/api/knifetool/store/storeManage'

// defineOptions({ name: 'InfraConfigForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const editOrView = ref(false) // 是否显示
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  type: 1,
  parentId: 1,
  classification: 2,
  location: '',
  admin: ''
})
const formRules = reactive({
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  admin: [{ required: true, message: '请输入管理员', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    console.log(row)
    editOrView.value = false
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
    const data = formData.value as warehouseApi.Demo01ContactVO
    if (formType.value === 'create') {
      await warehouseApi.createWarehouse(data)
      message.success(t('common.createSuccess'))
    } else {
      await warehouseApi.updateWarehouse(data)
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
    name: '',
    type: 1,
    parentId: 1,
    classification: 2,
    location: '',
    admin: ''
  }
  formRef.value?.resetFields()
}
const setFormSelectValue = (val: string, prop: string) => {
  console.log(val)
  formData.value[prop] = val
}
</script>
