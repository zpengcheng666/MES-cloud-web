<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
       <el-form-item label="物料库存id（配刀库存）" prop="materialStockId">
        <el-input v-model="formData.materialStockId" placeholder="请输入物料库存id（配刀库存）" />
      </el-form-item>
      <el-form-item label="刀位" prop="site">
        <el-input v-model="formData.site" placeholder="请输入刀位" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input v-model="formData.count" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="类型（装、卸）" prop="type">
        <el-select v-model="formData.type" placeholder="请选择类型（装、卸）">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作者(预留)" prop="operator">
        <el-input v-model="formData.operator" placeholder="请输入操作者(预留)" />
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
  toolInfoId: undefined,
  materialStockId: undefined,
  site: undefined,
  count: undefined,
  type: undefined,
  operator: undefined,
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
      formData.value = await ToolInfoApi.getAssembleRecord(id)
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
      await ToolInfoApi.createAssembleRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolInfoApi.updateAssembleRecord(data)
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
    toolInfoId: undefined,
    materialStockId: undefined,
    site: undefined,
    count: undefined,
    type: undefined,
    operator: undefined,
  }
  formRef.value?.resetFields()
}
</script>