<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="180px"
    >
      <el-form-item label="刀具组码：">
        <el-input v-model="formData.groupCode" disabled />
      </el-form-item>
      <el-form-item label="刀柄物码：">
        <el-input v-model="formData.code" disabled />
      </el-form-item>
      <el-form-item label="平衡质量等级（G）：">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.balancingQuality"
          placeholder="请输入平衡质量等级（G）..."
        />
      </el-form-item>
      <el-form-item label="操作速度（n）：">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.serviceSpeed"
          placeholder="请输入操作速度（n）..."
        />
      </el-form-item>
      <el-form-item label="质量单位（kg）：" prop="weight">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.weight"
          placeholder="请输入质量单位（kg）..."
        />
      </el-form-item>
      <el-form-item label="标准值（gmm）：">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.staticUnbalance"
          placeholder="请输入标准值（gmm）..."
        />
      </el-form-item>
      <el-form-item label="动平衡转速：">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.rpm"
          placeholder="请输入动平衡转速..."
        />
      </el-form-item>
      <el-form-item label="质量等级结果（G）：">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.balancingQualityReality"
          placeholder="请输入质量等级结果（G）..."
        />
      </el-form-item>
      <el-form-item label="允许机床转速（n）：" prop="maxSpeed">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.maxSpeed"
          placeholder="请输入允许机床转速（n）..."
        />
      </el-form-item>
      <el-form-item label="结果（gmm）：" prop="gmmResult">
        <el-input
          :disabled="toolVisibleButton"
          v-model="formData.gmmResult"
          placeholder="请输入结果（gmm）..."
        />
      </el-form-item>
    </el-form>
    <template #footer v-if="!toolVisibleButton">
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { createToolBalance, UpdateVO } from '@/api/knifetool/paring/groupDynamic'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const toolVisibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<UpdateVO>({
  id: undefined,
  groupCode: '',
  code: '',
  paringId: undefined,
  balancingQuality: undefined,
  serviceSpeed: undefined,
  weight: undefined,
  staticUnbalance: undefined,
  rpm: undefined,
  balancingQualityReality: undefined,
  maxSpeed: undefined,
  gmmResult: undefined
})

const formRef = ref() // 表单 Ref
const formRules = reactive({
  weight: [{ required: true, message: '质量单位必须输入!', trigger: 'blur' }],
  maxSpeed: [{ required: true, message: '允许机床转速必须输入!', trigger: 'blur' }],
  gmmResult: [{ required: true, message: '结果必须输入!', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true

  if (type === 'details') {
    dialogTitle.value = '详情'
    toolVisibleButton.value = true
  } else {
    dialogTitle.value = '修改'
    toolVisibleButton.value = false
  }

  dialogTitle.value = type === 'details' ? '详情' : '修改'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    console.log(row)
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
    id: undefined,
    groupCode: '',
    code: '',
    paringId: undefined,
    balancingQuality: undefined,
    serviceSpeed: undefined,
    weight: undefined,
    staticUnbalance: undefined,
    rpm: undefined,
    balancingQualityReality: undefined,
    maxSpeed: undefined,
    gmmResult: undefined
  }
  formRef.value?.resetFields()
}
</script>
