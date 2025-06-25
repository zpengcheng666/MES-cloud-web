<template>
  <Dialog v-model="dialogVisible" title="呼叫刀具">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="配送地址" prop="deliveryPosition">
        <el-input v-model="formData.deliveryPosition" placeholder="请输入配送地址" />
      </el-form-item>
      <p style="margin-left: 21%; font-size: 14px; font-weight: bolder"
        >剩余呼叫数量 : {{ formData.noCallQuantity }}</p
      >
      <el-form-item label="呼叫数量" prop="deliveryQuantity">
        <el-input-number
          v-model="formData.deliveryQuantity"
          :min="1"
          style="width: 100%"
          placeholder="请输入呼叫数量"
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
import { callToolDelivery } from '@/api/knifetool/toolMenuCall/toolCall'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref<{
  paringPlanId: string
  deliveryPosition: string
  deliveryQuantity?: number
  noCallQuantity: number
}>({
  paringPlanId: '', //配刀任务id
  deliveryPosition: '', //配送目的地
  deliveryQuantity: undefined, //配送数量
  noCallQuantity: 0 //未呼叫数量
})

const formRef = ref() // 表单 Ref

const callNumValidator = async (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入呼叫数量'))
  } else if (value > formData.value.noCallQuantity) {
    callback(new Error('不能超过剩余呼叫数量'))
  } else {
    callback()
  }
}
const formRules = reactive({
  deliveryPosition: [
    {
      required: true,
      message: '请输入配送地址',
      trigger: 'blur'
    }
  ],
  deliveryQuantity: [
    { validator: callNumValidator, trigger: 'blur' },
    {
      required: true,
      message: '请输入呼叫数量',
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (row: any) => {
  resetForm()

  dialogVisible.value = true

  formData.value.noCallQuantity = row.matchingQuantity - row.callsQuantity
  formData.value.paringPlanId = row.id
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
    const res = await callToolDelivery(formData.value)
    console.log(res)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    paringPlanId: '', //配刀任务id
    deliveryPosition: '', //配送目的地
    deliveryQuantity: undefined, //配送数量
    noCallQuantity: 0 //未呼叫数量
  }
  formRef.value?.resetFields()
}
</script>
