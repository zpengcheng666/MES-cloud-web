<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="平衡质量等级" prop="balancingQuality">
        <el-input v-model="formData.balancingQuality" placeholder="请输入平衡质量等级" />
      </el-form-item>
      <el-form-item label="操作速度" prop="serviceSpeed">
        <el-input v-model="formData.serviceSpeed" placeholder="请输入操作速度" />
      </el-form-item>
      <el-form-item label="质量单位[KG]" prop="weight">
        <el-input v-model="formData.weight" placeholder="请输入质量单位[KG]" />
      </el-form-item>
      <el-form-item label="标准值[gmm]" prop="staticUnbalance">
        <el-input v-model="formData.staticUnbalance" placeholder="请输入标准值[gmm]" />
      </el-form-item>
      <el-form-item label="动平衡转速" prop="rpm">
        <el-input v-model="formData.rpm" placeholder="请输入动平衡转速" />
      </el-form-item>
      <el-form-item label="质量等级结果" prop="balancingQualityReality">
        <el-input v-model="formData.balancingQualityReality" placeholder="请输入质量等级结果" />
      </el-form-item>
      <el-form-item label="允许机床转速" prop="maxSpeed">
        <el-input v-model="formData.maxSpeed" placeholder="请输入允许机床转速" />
      </el-form-item>
      <el-form-item label="结果[gmm]" prop="gmmResult">
        <el-input v-model="formData.gmmResult" placeholder="请输入结果[gmm]" />
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
  balancingQuality: undefined,
  serviceSpeed: undefined,
  weight: undefined,
  staticUnbalance: undefined,
  rpm: undefined,
  balancingQualityReality: undefined,
  maxSpeed: undefined,
  gmmResult: undefined,
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
      formData.value = await ToolInfoApi.getToolBalance(id)
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
      await ToolInfoApi.createToolBalance(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolInfoApi.updateToolBalance(data)
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
    balancingQuality: undefined,
    serviceSpeed: undefined,
    weight: undefined,
    staticUnbalance: undefined,
    rpm: undefined,
    balancingQualityReality: undefined,
    maxSpeed: undefined,
    gmmResult: undefined,
    toolInfoId: undefined,
  }
  formRef.value?.resetFields()
}
</script>