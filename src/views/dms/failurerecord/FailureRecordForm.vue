<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备" prop="device">
        <el-select-v2
          v-model="formData.device"
          :options="props.ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          disabled
        />
      </el-form-item>

      <el-form-item label="异常编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入异常编码" disabled />
      </el-form-item>

      <el-form-item label="故障状态" prop="faultState">
        <el-select-v2
          v-model="formData.faultState"
          :options="getStrDictOptions('dms_fault_state')"
          placeholder="请输入故障状态"
          filterable
          clearable
        />
      </el-form-item>

      <el-form-item label="故障描述" prop="description">
        <el-input type="textarea" :rows="5" v-model="formData.description" disabled />
      </el-form-item>

      <el-form-item label="故障原因" prop="cause">
        <el-input
          type="textarea"
          :rows="5"
          v-model="formData.cause"
          placeholder="请输入故障原因"
          disabled
        />
      </el-form-item>

      <el-form-item label="故障时间" prop="faultTime">
        <el-date-picker
          v-model="formData.faultTime"
          type="datetime"
          value-format="x"
          placeholder="选择故障时间"
          disabled
        />
      </el-form-item>

      <el-form-item label="维修人员" prop="maintenanceBy">
        <el-select-v2
          v-model="formData.maintenanceBy"
          :options="props.userList"
          filterable
          clearable
          placeholder="请选择维修人员"
          disabled
        />
      </el-form-item>

      <el-form-item label="修复时间" prop="repairTime">
        <el-date-picker
          v-model="formData.repairTime"
          type="datetime"
          value-format="x"
          placeholder="选择修复时间"
          disabled
        />
      </el-form-item>

      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="5"
          placeholder="请输入备注"
          disabled
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FailureRecordApi, FailureRecordVO } from '@/api/dms/failurerecord'
import { getStrDictOptions } from '@/utils/dict'
/** 异常记录 表单 */
defineOptions({ name: 'FailureRecordForm' })

const props = defineProps(['ledgerList', 'userList'])
// 添加属性

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  device: undefined,
  code: undefined,
  faultState: undefined,
  description: undefined,
  cause: undefined,
  faultTime: undefined,
  maintenanceBy: undefined,
  repairTime: undefined,
  remarks: undefined
})
const formRules = reactive({})
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
      formData.value = await FailureRecordApi.getFailureRecord(id)
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
    const data = formData.value as unknown as FailureRecordVO
    if (formType.value === 'create') {
      await FailureRecordApi.createFailureRecord(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await FailureRecordApi.updateFailureRecord(data)
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
    device: undefined,
    code: undefined,
    faultState: undefined,
    description: undefined,
    cause: undefined,
    faultTime: undefined,
    maintenanceBy: undefined,
    repairTime: undefined,
    remarks: undefined
  }
  formRef.value?.resetFields()
}
</script>
