<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备类型" prop="deviceTypeId">
        <el-select-v2
          v-model="formData.deviceTypeId"
          :options="props.deviceTypeList"
          filterable
          clearable
          placeholder="选择设备类型"
          :disabled="formType == 'update'"
          @change="getDeviceId(formData.deviceTypeId)"
        />
      </el-form-item>

      <el-form-item label="设备" prop="deviceId" v-if="formType == 'create'">
        <el-select-v2
          v-model="formData.deviceId"
          :options="deviceList"
          filterable
          clearable
          multiple
          placeholder="选择设备"
        />
      </el-form-item>

      <el-form-item label="设备" prop="deviceId" v-if="formType == 'update'">
        <el-select-v2
          v-model="formData.deviceId"
          :options="props.ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          :disabled="formType == 'update'"
        />
      </el-form-item>

      <el-form-item label="产品类型" prop="productTypeId">
        <el-select-v2
          v-model="formData.productTypeId"
          :options="props.productTypeList"
          filterable
          clearable
          multiple
          placeholder="选择产品类型"
        />
      </el-form-item>

      <el-form-item label="通信类型" prop="commType">
        <el-select-v2
          v-model="formData.commType"
          :options="getIntDictOptions(DICT_TYPE.DC_COMM_TYPE)"
          placeholder="选择通信类型"
          clearable
          :disabled="formType == 'update'"
          class="!w-240px"
        />
      </el-form-item>

<!--      <el-form-item label="客户端id" prop="deviceClientId" v-if="formData.commType == 1">-->
<!--        <template #label>-->
<!--          <Tooltip-->
<!--            message="mqtt通信url不可编辑 当前默认为：tcp://127.0.0.1:1883，如需修改请联系管理员"-->
<!--            title="客户端id"-->
<!--          />-->
<!--        </template>-->
<!--        <el-input v-model="formData.deviceClientId" placeholder="请输入mqtt客户端id" />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="通信url" prop="deviceUrl" v-if="formData.commType == 2">-->
<!--        <el-input v-model="formData.deviceUrl" placeholder="请输入通信url" />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="匹配标签码" prop="deviceText" v-if="formData.commType == 1">-->
<!--        <el-input v-model="formData.matchId" placeholder="请输入匹配标签码" class="!w-240px" :disabled="formData.topicId != null" />-->
<!--      </el-form-item>-->

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>


<script setup lang="ts">
import {  DICT_TYPE , getIntDictOptions} from '@/utils/dict'
import { DeviceApi, DeviceVO } from '@/api/dc/device'

/** 设备 表单 */
defineOptions({ name: 'DeviceForm' })

const props = defineProps(['productTypeList' ,'ledgerList','deviceTypeList'])
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  deviceId: [],
  deviceStatus: undefined,
  deviceText: undefined,
  productTypeId: undefined,
  deviceTypeId: undefined,
  matchId: undefined,
  topicId: undefined,
  commType: undefined,
  deviceClientId: undefined,
  deviceUrl: undefined,
})
const formRules = reactive({
  deviceTypeId: [{ required: true, message: '设备类型不能为空', trigger: 'blur' }],
  productTypeId: [{ required: true, message: '产品类型不能为空', trigger: 'blur' }],
  commType: [{ required: true, message: '通信类型不能为空', trigger: 'blur' }],
  deviceId: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
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
      formData.value = await DeviceApi.getDevice(id)
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
    const data = formData.value as unknown as DeviceVO
    if (formType.value === 'create') {
      await DeviceApi.createDevice(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceApi.updateDevice(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 获取未生成的设备 */
const deviceList = ref<any[]>([])
const getDeviceId = async(deviceTypeId) =>{
  formData.value.deviceId = []
  const data = await DeviceApi.getDeviceListByCollet(deviceTypeId)
  deviceList.value = []
  for (let v of data){
    deviceList.value.push({
      value: v.id ,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}


/** 重置表单 */
const resetForm = () => {
  formData.value = {
    deviceId: [],
    deviceStatus: undefined,
    deviceText: undefined,
    productTypeId: undefined,
    deviceTypeId: undefined,
    matchId: undefined,
    topicId: undefined,
    commType: undefined,
    deviceClientId: undefined,
    deviceUrl: undefined,
  }
  formRef.value?.resetFields()
}
</script>
