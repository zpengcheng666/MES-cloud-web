<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-form-item label="刀组编码：">
        <el-input v-model="formData.groupCode" disabled />
      </el-form-item>
      <el-form-item label="刀柄物码：">
        <el-input v-model="formData.code" disabled />
      </el-form-item>
      <el-form-item label="平衡质量等级（G）：">
        <el-input
          v-model="formData.balancingQuality"
          type="number"
          placeholder="请输入平衡质量等级（G）..."
        />
      </el-form-item>
      <el-form-item label="操作速度（n）：">
        <el-input
          v-model="formData.serviceSpeed"
          type="number"
          placeholder="请输入操作速度（n）..."
        />
      </el-form-item>
      <el-form-item label="质量单位（kg）：" prop="weight">
        <el-input v-model="formData.weight" type="number" placeholder="请输入质量单位（kg）..." />
      </el-form-item>
      <el-form-item label="标准值（gmm）：">
        <el-input
          v-model="formData.staticUnbalance"
          type="number"
          placeholder="请输入标准值（gmm）..."
        />
      </el-form-item>
      <el-form-item label="动平衡转速：">
        <el-input v-model="formData.rpm" type="number" placeholder="请输入动平衡转速..." />
      </el-form-item>
      <el-form-item label="质量等级结果（G）：">
        <el-input
          v-model="formData.balancingQualityReality"
          type="number"
          placeholder="请输入质量等级结果（G）..."
        />
      </el-form-item>
      <el-form-item label="允许机床转速（n）：" prop="maxSpeed">
        <el-input
          v-model="formData.maxSpeed"
          type="number"
          placeholder="请输入允许机床转速（n）..."
        />
      </el-form-item>
      <el-form-item label="结果（gmm）：" prop="gmmResult">
        <el-input v-model="formData.gmmResult" type="number" placeholder="请输入结果（gmm）..." />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import {
  getDynamicByParingId,
  getSettingByParingId,
  createToolBalance
} from '@/api/knifetool/paring/paringList'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  groupCode: '',
  paringId: '',
  code: '',
  balancingQuality: '',
  serviceSpeed: '',
  weight: '',
  staticUnbalance: '',
  rpm: '',
  balancingQualityReality: '',
  maxSpeed: '',
  gmmResult: ''
})

const formRef = ref() // 表单 Ref
const formRules = reactive({
  weight: [
    {
      required: true,
      message: '质量单位必须输入!',
      trigger: 'blur'
    }
  ],
  maxSpeed: [
    {
      required: true,
      message: '允许机床转速必须输入!',
      trigger: 'blur'
    }
  ],
  gmmResult: [
    {
      required: true,
      message: '结果必须输入!',
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  resetForm()

  console.log(row)
  dialogTitle.value = type === 'create' ? '添加动平衡信息' : '修改动平衡信息'
  dialogVisible.value = true

  formData.value.groupCode = row.groupCode
  formData.value.code = row.code
  formData.value.paringId = row.id

  try {
    const data = await getDynamicByParingId({ paringId: row.id })

    if (data !== null) {
      formData.value.balancingQuality = data.balancingQuality
      formData.value.serviceSpeed = data.serviceSpeed
      formData.value.weight = data.weight
      formData.value.staticUnbalance = data.staticUnbalance
      formData.value.rpm = data.rpm
      formData.value.balancingQualityReality = data.balancingQualityReality
      formData.value.maxSpeed = data.maxSpeed
      formData.value.gmmResult = data.gmmResult
    }
  } catch {}
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
    console.log(formData.value)
    const res = await createToolBalance(formData.value)
    console.log(res)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    groupCode: '',
    paringId: '',
    code: '',
    balancingQuality: '',
    serviceSpeed: '',
    weight: '',
    staticUnbalance: '',
    rpm: '',
    balancingQualityReality: '',
    maxSpeed: '',
    gmmResult: ''
  }
  formRef.value?.resetFields()
}
</script>
