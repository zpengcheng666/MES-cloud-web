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
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入编号"
          :disabled="formType == 'update'"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="产线" prop="lintStationGroup">
        <el-select-v2
          v-model="formData.lintStationGroup"
          :options="props.linestationgroupList"
          filterable
          clearable
          placeholder="选择产线"
          :disabled="props.nowSelect?.id != undefined"
        />
      </el-form-item>
      <el-form-item label="绑定仓库" prop="locationId">
        <el-select-v2
          v-model="formData.locationId"
          :options="props.warehouseList"
          filterable
          clearable
          placeholder="请选择绑定仓库"
        />
      </el-form-item>
      <el-form-item label="类型" prop="equipmentStationType">
        <el-select-v2
          v-model="formData.equipmentStationType"
          :options="props.deviceTypeList"
          filterable
          clearable
          placeholder="选择类型"
        />
      </el-form-item>
      <el-form-item label="设备/工位" prop="type">
        <el-select-v2
          v-model="formData.type"
          :options="getIntDictOptions('dms_ledger_type')"
          placeholder="选择设备/工位"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select-v2
          v-model="formData.status"
          :options="getIntDictOptions(DICT_TYPE.DMS_DEVICE_STATUS)"
          placeholder="选择状态"
        />
      </el-form-item>
      <el-form-item label="运行状态" prop="runStatus">
        <el-select-v2
          v-model="formData.runStatus"
          :options="getIntDictOptions('dms_device_status_run')"
          placeholder="选择运行状态"
        />
      </el-form-item>
      <el-form-item label="在线状态" prop="onlineStatus">
        <el-select-v2
          v-model="formData.onlineStatus"
          :options="getIntDictOptions('dms_device_status_online')"
          placeholder="选择在线状态"
        />
      </el-form-item>

      <el-form-item label="是否需料" prop="needMaterials">
        <el-switch
          v-model="formData.needMaterials"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>

      <el-form-item label="本机IP" prop="ip">
        <el-input v-model="formData.ip" placeholder="请输入本机ip" />
      </el-form-item>
      <!-- <el-form-item label="绑定设备" prop="bindEquipment">
        <el-select-v2
          v-model="formData.bindEquipment"
          :options="props.ledgerList"
          filterable
          clearable
          placeholder="请选择输入绑定设备"
        />
      </el-form-item> -->

      <el-form-item label="负责人" prop="superintendent">
        <el-select-v2
          v-model="formData.superintendent"
          :options="props.userList"
          filterable
          clearable
          placeholder="请选择负责人"
        />
      </el-form-item>
      <el-form-item label="采购日期" prop="purchaseDate">
        <el-date-picker
          v-model="formData.purchaseDate"
          type="date"
          value-format="x"
          placeholder="选择采购日期"
        />
      </el-form-item>
      <el-form-item label="参数1" prop="technicalParameter1">
        <el-input v-model="formData.technicalParameter1" placeholder="请输入参数1" />
      </el-form-item>
      <el-form-item label="参数2" prop="technicalParameter2">
        <el-input v-model="formData.technicalParameter2" placeholder="请输入参数2" />
      </el-form-item>
      <el-form-item label="参数3" prop="technicalParameter3">
        <el-input v-model="formData.technicalParameter3" placeholder="请输入参数3" />
      </el-form-item>
      <el-form-item label="参数4" prop="technicalParameter4">
        <el-input v-model="formData.technicalParameter4" placeholder="请输入参数4" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { LedgerApi, LedgerVO } from '@/api/dms/ledger'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const props = defineProps([
  'deviceTypeList',
  'linestationgroupList',
  'userList',
  'nowSelect',
  'ledgerList',
  'warehouseList'
])
//属性

/** 设备台账 表单 */
defineOptions({ name: 'LedgerForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  lintStationGroup: undefined,
  equipmentStationType: undefined,
  type: undefined,
  status: undefined,
  runStatus: undefined,
  onlineStatus: undefined,
  needMaterials: false,
  locationId: undefined,
  ip: undefined,
  bindEquipment: undefined,
  superintendent: undefined,
  purchaseDate: undefined,
  maintenanceDate: undefined,
  maintenanceBy: undefined,
  inspectionDate: undefined,
  inspectionBy: undefined,
  technicalParameter1: undefined,
  technicalParameter2: undefined,
  technicalParameter3: undefined,
  technicalParameter4: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '设备/工位不能为空', trigger: 'blur' }],
  equipmentStationType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '设备状态不能为空', trigger: 'blur' }],
  runStatus: [{ required: true, message: '运行状态不能为空', trigger: 'blur' }],
  onlineStatus: [{ required: true, message: '在线状态不能为空', trigger: 'blur' }],
  superintendent: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type

  resetForm()

  // 修改时，设置数据

  formLoading.value = true
  try {
    if (id) formData.value = await LedgerApi.getLedger(id)

    if (props.nowSelect?.id != undefined) formData.value.lintStationGroup = props.nowSelect?.id
  } finally {
    formLoading.value = false
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
    const data = formData.value as unknown as LedgerVO
    if (formType.value === 'create') {
      await LedgerApi.createLedger(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await LedgerApi.updateLedger(data)
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
    code: undefined,
    name: undefined,
    lintStationGroup: undefined,
    equipmentStationType: undefined,
    type: undefined,
    status: undefined,
    runStatus: undefined,
    onlineStatus: undefined,
    needMaterials: false,
    locationId: undefined,
    ip: undefined,
    bindEquipment: undefined,
    superintendent: undefined,
    purchaseDate: undefined,
    maintenanceDate: undefined,
    maintenanceBy: undefined,
    inspectionDate: undefined,
    inspectionBy: undefined,
    technicalParameter1: undefined,
    technicalParameter2: undefined,
    technicalParameter3: undefined,
    technicalParameter4: undefined
  }
  formRef.value?.resetFields()

  if (props.nowSelect?.id != undefined) formData.value.lintStationGroup = props.nowSelect?.id
}
</script>
