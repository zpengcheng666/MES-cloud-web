<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-form-item label="开始时间" prop="startTime" v-if="formType === 'state'">
        <el-date-picker
          v-model="formData.startTime"
          value-format="x"
          type="datetime"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime" v-if="formType === 'end'">
        <el-date-picker
          v-model="formData.endTime"
          type="datetime"
          value-format="x"
          placeholder="选择结束时间"
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
import { BatchRecordApi, BatchRecordVO } from '@/api/mcs/batchRecord'
import { getIntDictOptions } from '@/utils/dict'
import {inject} from "vue";

/** 表单 */
defineOptions({ name: 'RecordProcesViewForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：state - 开工；end - 完工
const formData = ref({
  id: undefined,
  orderId: undefined,
  batchId: undefined,
  processId: undefined,
  number: undefined,
  processingUnitId: undefined,
  deviceNumber: undefined,
  procedureNum: undefined,
  status: undefined,
  planStartTime: undefined,
  planEndTime: undefined,
  count: undefined,
  preRecordId: undefined,
  startTime: undefined,
  endTime: undefined,
})

const formRules = reactive({
  startTime: [{required: true, message: '开始时间不能为空', trigger: 'blur'}],
  endTime: [{required: true, message: '结束时间不能为空', trigger: 'blur'}]
})

const selectOrderInfo = inject("selectOrderInfo")
const formRef = ref() // 表单 Ref
const unitList = ref([])
const deviceList = ref([])

/** 打开弹窗 */
const open = async (type: string , row: any) => {
  formType.value = type
  if(formType.value === 'state'){
    dialogTitle.value = t('开工')
  }else if (formType.value === 'end'){
    dialogTitle.value = t('完工')
  }
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    [formData.value, unitList.value] = await Promise.all([
      BatchRecordApi.getBatchRecord(row.id),
      BatchRecordApi.getUnitListByRecordId(row.id)
    ])
  } finally {
    formLoading.value = false
  }
  if (formData.value.processingUnitId) {
    getDeviceList(formData.value.processingUnitId);
  }
  formData.value.orderNumber = selectOrderInfo.orderNumber;
  formData.value.batchNumber = selectOrderInfo.batchNumber;
  if (formData.value.deviceNumber) {
    formData.value.deviceIdList = formData.value.deviceId.split(",");
  }

}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getDeviceList = async (val: String) => {
  formData.value.deviceIdList = [];
  deviceList.value = await BatchRecordApi.getDeviceListByUnitId(val);
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as BatchRecordVO
    // data.deviceId = formData.value.deviceIdList.join(",")
    // const deviceNumbers = [];
    // for (let _deviceId of formData.value.deviceIdList) {
    //   const device = deviceList.value.find(item => item.id == _deviceId);
    //   deviceNumbers.push(device.code)
    // }
    // data.deviceNumber = deviceNumbers.join(",")

    if(formType.value === 'state'){
      await BatchRecordApi.updateStatusState(data)
      message.success(t('common.updateSuccess'))
    }else if (formType.value === 'end'){
      await BatchRecordApi.updateStatusEnd(data)
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
    orderId: undefined,
    batchId: undefined,
    processId: undefined,
    number: undefined,
    processingUnitId: undefined,
    deviceNumber: undefined,
    procedureNum: undefined,
    status: undefined,
    planStartTime: undefined,
    planEndTime: undefined,
    count: undefined,
    preRecordId: undefined,
    startTime: undefined,
    endTime: undefined,
  }
  formRef.value?.resetFields()
}
</script>
