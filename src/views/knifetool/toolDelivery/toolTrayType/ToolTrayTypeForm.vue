<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="类型名称" prop="trayTypeName">
        <el-input v-model="formData.trayTypeName" placeholder="请输入托盘类型名称" />
      </el-form-item>
      <el-form-item label="类型编码" prop="trayTypeNumber">
        <el-input v-model="formData.trayTypeNumber" placeholder="请输入托盘类型编码" />
      </el-form-item>
      <el-form-item label="材料" prop="material">
        <el-input v-model="formData.material" placeholder="请输入材料" />
      </el-form-item>
      <el-form-item label="通用性" prop="commonUse">
        <el-input v-model="formData.commonUse" placeholder="请输入通用性" />
      </el-form-item>
      <el-form-item label="重量(Kg)" prop="weight">
        <el-input-number :min="0.00" :precision="2" :step="0.1" :max="99" v-model="formData.weight" placeholder="请输入重量"
          style="width:50%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'

/** 刀具托盘类型 表单 */
defineOptions({ name: 'ToolTrayTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  trayTypeName: undefined,
  trayTypeNumber: undefined,
  trayTypeCount: undefined,
  material: undefined,
  commonUse: undefined,
  weight: undefined,
  createId: undefined,
  updateId: undefined
})
const formRules = reactive({
  trayTypeName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
  trayTypeNumber: [{ required: true, message: '类型编码不能为空', trigger: 'blur' }],
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
      formData.value = await ToolTrayTypeApi.getToolTrayType(id)
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
    const data = formData.value as unknown as ToolTrayTypeApi.ToolTrayTypeVO
    if (formType.value === 'create') {
      await ToolTrayTypeApi.createToolTrayType(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolTrayTypeApi.updateToolTrayType(data)
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
    trayTypeName: undefined,
    trayTypeNumber: undefined,
    trayTypeCount: undefined,
    material: undefined,
    commonUse: undefined,
    weight: undefined,
    createId: undefined,
    updateId: undefined
  }
  formRef.value?.resetFields()
}
</script>