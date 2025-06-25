<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="编号" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="位置" prop="locationCode">
        <el-radio-group v-model="formData.locationCode">
          <el-radio
            v-for="dict in getStrDictOptions('macsCollectorLocation')"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联门" prop="doorId">
        <el-select v-model="formData.doorId" filterable placeholder="请选择关联门" @change="doorSelectFun">
          <el-option
            v-for="door in doorList"
            :key="door.id"
            :label="door.name"
            :value="door.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联设备" prop="deviceId">
        <el-select v-model="formData.deviceId" disabled filterable placeholder="请选择关联门">
          <el-option
            v-for="device in deviceList"
            :key="device.id"
            :label="device.name"
            :value="device.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联设备位置" prop="devicePort">
        <el-input v-model="formData.devicePort" placeholder="请输入关联设备位置" />
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择设备状态">
          <el-option
            v-for="dict in getIntDictOptions('macsCollectorStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采集设备类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择采集设备类型">
          <el-option
            v-for="dict in getIntDictOptions('macsCollectorType')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述/备注" prop="description">
        <el-input v-model="formData.description" placeholder="描述/备注" />
      </el-form-item>
      <el-form-item label="连接信息" prop="connectionInformation">
        <el-input v-model="formData.connectionInformation" placeholder="请输入连接信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { CollectorApi, CollectorVO } from '@/api/macs/collector'
import {getDeviceList} from "@/api/macs/door";

/** (通行卡,人脸,指纹)采集器 表单 */
defineOptions({ name: 'CollectorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  code: undefined,
  name: undefined,
  locationCode: undefined,
  doorId: undefined,
  deviceId: undefined,
  devicePort: undefined,
  status: undefined,
  type: undefined,
  description: undefined,
  connectionInformation: undefined,
  createBy: undefined,
  updateBy: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  locationCode: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  doorId: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  deviceId: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  devicePort: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const doorList = ref([])
const deviceList = ref([])

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
      formData.value = await CollectorApi.getCollector(id)
    } finally {
      formLoading.value = false
    }
  }
  [doorList.value, deviceList.value] = await Promise.all([CollectorApi.getDoorList(), CollectorApi.getDeviceList()]);
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
    const data = formData.value as unknown as CollectorVO
    if (formType.value === 'create') {
      await CollectorApi.createCollector(data)
      message.success(t('common.createSuccess'))
    } else {
      await CollectorApi.updateCollector(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const doorSelectFun = (value) => {
  const door = doorList.value.find((item) => item.id === value)
  formData.value.deviceId = door.deviceId;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    code: undefined,
    name: undefined,
    locationCode: undefined,
    doorId: undefined,
    deviceId: undefined,
    devicePort: undefined,
    status: undefined,
    type: undefined,
    description: undefined,
    connectionInformation: undefined,
    createBy: undefined,
    updateBy: undefined
  }
  formRef.value?.resetFields()
}
</script>
