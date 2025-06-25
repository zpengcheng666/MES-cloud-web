<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-form-item label="车牌号" prop="registerPlate">
        <el-input v-model="formData.registerPlate" placeholder="请输入车牌号"/>
      </el-form-item>
      <el-form-item label="剩余扣款次数" prop="numberTimes">
        <el-input v-model="formData.numberTimes"/>
      </el-form-item>
      <el-form-item label="客户电话" prop="phoneNumber">
        <el-input v-model="formData.phoneNumber"/>
      </el-form-item>
      <el-form-item label="账户余额" prop="balance">
        <el-input v-model="formData.balance"/>
      </el-form-item>
      <el-form-item label="证件类型" prop="identiType">
        <el-input v-model="formData.identiType"/>
      </el-form-item>
      <el-form-item label="客户类型" prop="clientType">
        <el-input v-model="formData.clientType"/>
      </el-form-item>
      <el-form-item label="通行证类型" prop="passTypeName">
        <el-input v-model="formData.passTypeName"/>
      </el-form-item>
      <el-form-item label="证件编号" prop="identiNumber">
        <el-input v-model="formData.identiNumber"/>
      </el-form-item>
      <el-form-item label="客户编号" prop="clientNo">
        <el-input v-model="formData.clientNo"/>
      </el-form-item>
      <el-form-item label="客户邮箱" prop="email">
        <el-input v-model="formData.email"/>
      </el-form-item>
      <el-form-item label="到期时间" prop="deadline">
        <el-input v-model="formData.deadline"/>
      </el-form-item>
      <el-form-item label="车位类型" prop="parkingSpaceType">
        <el-input v-model="formData.parkingSpaceType"/>
      </el-form-item>
      <el-form-item label="车辆类型" prop="carTypeName">
        <el-input v-model="formData.carTypeName"/>
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input v-model="formData.clientName"/>
      </el-form-item>
      <el-form-item label="客户住址" prop="address">
        <el-input v-model="formData.address"/>
      </el-form-item>
      <el-form-item label="客户性别" prop="sex">
        <el-input v-model="formData.sex"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BrakeApi, BrakeVO } from '@/api/es/brake'

/** 旧厂车牌数据 表单 */
defineOptions({ name: 'BrakeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  registerPlate: undefined,
  numberTimes: undefined,
  phoneNumber: undefined,
  balance: undefined,
  identiType: undefined,
  clientType: undefined,
  passTypeName: undefined,
  identiNumber: undefined,
  clientNo: undefined,
  email: undefined,
  deadline: undefined,
  parkingSpaceType: undefined,
  carTypeName: undefined,
  clientName: undefined,
  address: undefined,
  sex: undefined,
})
const formRules = reactive({
  registerPlate: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
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
      formData.value = await BrakeApi.getBrake(id)
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
    const data = formData.value as unknown as BrakeVO
    if (formType.value === 'create') {
      await BrakeApi.createBrake(data)
      message.success(t('common.createSuccess'))
    } else {
      await BrakeApi.updateBrake(data)
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
    registerPlate: undefined,
    numberTimes: undefined,
    phoneNumber: undefined,
    balance: undefined,
    identiType: undefined,
    clientType: undefined,
    passTypeName: undefined,
    identiNumber: undefined,
    clientNo: undefined,
    email: undefined,
    deadline: undefined,
    parkingSpaceType: undefined,
    carTypeName: undefined,
    clientName: undefined,
    address: undefined,
    sex: undefined,
  }
  formRef.value?.resetFields()
}
</script>
