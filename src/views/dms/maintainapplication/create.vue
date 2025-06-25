<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="150px"
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

      <el-form-item>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { getIntDictOptions } from '@/utils/dict'
import { MaintainApplicationApi } from '@/api/dms/maintainapplication'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'

defineOptions({ name: 'MaintainApplicationCreate' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
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
const formRules = reactive({
  device: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
  important: [{ required: true, message: '关键设备不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '维修类型不能为空', trigger: 'blur' }],
  describe1: [{ required: true, message: '故障信息描述不能为空', trigger: 'blur' }],
  duration: [{ required: true, message: '期望修复时间不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData.value } as any
    await MaintainApplicationApi.createMaintainApplication(data)
    message.success('发起成功')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'MaintainApplication' })
  } finally {
    formLoading.value = false
  }
}

/*************************初始化********************/

const processDefineKey = 'dms_maintain_application'
onMounted(async () => {
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined as any,
    processDefineKey
  )
  if (!processDefinitionDetail) {
    message.error('MaintainApplication的流程模型未配置，请检查！')
    return
  }

  formLoading.value = true
  await getLedgerList()
  formLoading.value = false
})

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
  if (!isBlank(formData.value.device) || !isBlank(ledgerList.value)) {
    for (const v of ledgerList.value) {
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

/************************* 获取设备信息 ***************************/

import { LedgerApi } from '@/api/dms/ledger'
const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    ledgerList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}
const getLedgerName = (id: string): string => {
  let str = ''
  for (let v of ledgerList.value) {
    if (v.id == id) {
      str = v.name
    }
  }
  return str
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
