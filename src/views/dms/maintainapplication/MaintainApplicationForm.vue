<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-form-item label="设备" prop="device">
        <el-select-v2
          v-model="formData.device"
          :options="ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          @change="setShowData"
        />
      </el-form-item>
      <el-form-item label="生产单元" prop="processingUnit">
        <el-input v-model="localeProcessingUnit.unitName" disabled />
      </el-form-item>
      <el-form-item label="规格型号" prop="deviceType">
        <el-input v-model="localeDeviceType.specification" disabled />
      </el-form-item>
      <el-form-item label="关键设备" prop="important">
        <el-select v-model="formData.important" placeholder="请选择是否为关键设备">
          <el-option
            v-for="dict in getIntDictOptions('dms_key_equipment')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修类型" prop="type">
        <el-select-v2
          v-model="formData.type"
          :options="getIntDictOptions('dms_maintain_type1')"
          filterable
          clearable
          placeholder="请选择维修类型"
        />
      </el-form-item>
      <el-form-item label="故障信息描述" prop="describe1">
        <el-input
          v-model="formData.describe1"
          type="textarea"
          :rows="5"
          placeholder="请输入故障信息描述"
        />
      </el-form-item>

      <el-form-item label="期望修复时间(小时)" prop="duration">
        <el-input-number v-model="formData.duration" />
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择申请状态" disabled>
          <el-option
            v-for="dict in getIntDictOptions('dms_maintain_status')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MaintainApplicationApi, MaintainApplicationVO } from '@/api/dms/maintainapplication'
import { getIntDictOptions } from '@/utils/dict'

/** 设备维修申请 表单 */
defineOptions({ name: 'MaintainApplicationForm' })

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
  name: undefined,
  processingUnitNumber: undefined,
  model: undefined,
  important: undefined,
  type: undefined,
  describe1: undefined,
  duration: undefined,
  status: undefined,
  processInstanceId: undefined,
  applicant: undefined,
  applicationTime: undefined
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
      formData.value = await MaintainApplicationApi.getMaintainApplication(id)
      await setShowData()
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
    const data = formData.value as unknown as MaintainApplicationVO
    if (formType.value === 'create') {
      await MaintainApplicationApi.createMaintainApplication(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaintainApplicationApi.updateMaintainApplication(data)
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
    name: undefined,
    processingUnitNumber: undefined,
    model: undefined,
    important: undefined,
    type: undefined,
    describe1: undefined,
    duration: undefined,
    status: undefined,
    processInstanceId: undefined,
    applicant: undefined,
    applicationTime: undefined
  }
  formRef.value?.resetFields()
  localeDevice.value = {}
  localeDeviceType.value = {
    specification: ''
  }
  localeProcessingUnit.value = {
    unitName: ''
  }
}

/************************* 设备信息 ***************************/

const props = defineProps(['ledgerList'])

/*********************设置显示信息*******************/

import { DeviceTypeApi } from '@/api/dms/devicetype'
import { ProcessingUnitApi } from '@/api/dms/processingunit'

const localeDevice = ref<any>({})
const localeDeviceType = ref<any>({
  specification: ''
})
const localeProcessingUnit = ref<any>({
  unitName: ''
})

const deviceType = ref()

async function setShowData() {
  if (!isBlank(formData.value.device) || !isBlank(props.ledgerList)) {
    for (const v of props.ledgerList) {
      if (v.id == formData.value.device) {
        localeDevice.value = v
        formData.value.code = v.code
        formData.value.name = v.name
        formData.value.processingUnitNumber = v.processingUnit
        deviceType.value = v.type
      }
    }
  }

  if (!isBlank(deviceType.value)) {
    localeDeviceType.value = await DeviceTypeApi.getDeviceType(deviceType.value)
  }

  if (!isBlank(formData.value.processingUnitNumber)) {
    localeProcessingUnit.value = await ProcessingUnitApi.getProcessingUnit(
      formData.value.processingUnitNumber as any
    )
  }
}

/********************工具***************************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null) {
    return true
  }
  if (typeof v?.trim == 'function' && v.trim() == '') {
    return true
  }
  return false
}
</script>
