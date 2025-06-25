<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编码" prop="orderId">
        <el-input disabled v-model="formData.orderNumber" />
      </el-form-item>
      <el-form-item label="批次编码" prop="batchId">
        <el-input disabled v-model="formData.batchNumber" />
      </el-form-item>
      <el-form-item label="工序编号" prop="procedureNum">
        <el-input disabled v-model="formData.processId" />
      </el-form-item>
      <el-form-item label="编码" prop="number">
        <el-input disabled v-model="formData.number" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="数量" prop="count">
        <el-input disabled v-model="formData.count" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select disabled v-model="formData.status" placeholder="请选择状态">
          <el-option
          v-for="dict in getIntDictOptions('mcs_batch_record_status')"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生产单元" v-if="formData.procesStatus !== 2" prop="processingUnitId">
        <el-select v-model="formData.processingUnitId" @change="getDeviceList" placeholder="请选择生产单元">
          <el-option
            v-for="dict in unitList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" v-if="formData.procesStatus !== 2" prop="deviceNumber">
        <el-select v-model="formData.deviceIdList" multiple placeholder="请选择设备编号">
          <el-option
            v-for="dict in deviceList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="外协厂家" v-if="formData.procesStatus === 2" prop="aidMill">
        <el-input disabled v-model="formData.aidMill" placeholder="请输入外协厂家" />
      </el-form-item>
      <el-form-item label="预计开始时间" prop="planStartTime">
        <el-date-picker
          v-model="formData.planStartTime"
          value-format="x"
          type="datetime"
          placeholder="选择预计开始时间"
        />
      </el-form-item>
      <el-form-item label="预计结束时间" prop="planEndTime">
        <el-date-picker
          v-model="formData.planEndTime"
          type="datetime"
          value-format="x"
          placeholder="选择预计结束时间"
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

/** 批次工序任务 表单 */
defineOptions({ name: 'BatchRecordEditView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('编辑') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
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
const selectOrderInfo = inject("selectOrderInfo")
const formRules = reactive({})
const formRef = ref() // 表单 Ref
const unitList = ref([])
const deviceList = ref([])

/** 打开弹窗 */
const open = async (row: any) => {
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
    if (formData.value.procesStatus != 2) {
      data.deviceId = formData.value.deviceIdList.join(",")
      const deviceNumbers = [];
      for (let _deviceId of formData.value.deviceIdList) {
        const device = deviceList.value.find(item => item.id == _deviceId);
        deviceNumbers.push(device.code)
      }
      data.deviceNumber = deviceNumbers.join(",")
    }
    await BatchRecordApi.updateBatchRecord(data)
    message.success(t('common.updateSuccess'))
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
