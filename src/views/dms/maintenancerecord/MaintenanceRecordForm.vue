<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%" align-center>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-row>
        <el-col :span="12">
          <div>
            <el-form-item label="计划编码" prop="code">
              <el-input v-model="formData.code" placeholder="计划编码" />
            </el-form-item>
            <el-form-item label="选择设备" prop="device">
              <el-select-v2
                v-model="formData.device"
                :options="props.ledgerList"
                filterable
                clearable
                placeholder="请选择设备"
              />
            </el-form-item>
            <el-form-item label="关键设备" prop="criticalDevice">
              <el-select-v2
                v-model="formData.criticalDevice"
                :options="[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 }
                ]"
                filterable
                clearable
                placeholder="请选择是否为关键设备"
              />
            </el-form-item>

            <el-form-item label="是否超期停机" prop="expirationShutdown">
              <el-select v-model="formData.expirationShutdown" placeholder="请选择是否超期停机">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.DMS_EXPIRATION_SHUTDOWN)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="超期天数" prop="expirationTime">
              <el-input-number v-model="formData.expirationTime" />
            </el-form-item>

            <el-form-item label="保养类型" prop="type">
              <el-select-v2
                v-model="formData.type"
                :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_TYPE)"
                placeholder="请选择保养类型"
                clearable
              />
            </el-form-item>
            <el-form-item label="完成状态" prop="status">
              <el-select-v2
                v-model="formData.status"
                :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_STATUS)"
                placeholder="请选择完成状态"
                clearable
              />
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input
                :rows="4"
                type="textarea"
                v-model="formData.remarks"
                placeholder="请输入备注"
              />
            </el-form-item>

            <el-form-item label="保养人" prop="maintenanceBy">
              <el-select-v2
                v-model="formData.maintenanceBy"
                :options="props.userList"
                filterable
                clearable
                placeholder="请选择保养人"
              />
            </el-form-item>
            <el-form-item label="开始维护时间" prop="startTime">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                value-format="x"
                placeholder="选择开始维护时间"
              />
            </el-form-item>
            <el-form-item label="结束维护时间" prop="endTime">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                value-format="x"
                placeholder="选择结束维护时间"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="保养内容" prop="content">
              <MaintenanceRecordContent v-model="formData.content" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="24">
          <div>
            <el-form-item label="使用备件" prop="spareParts">
              <SparePartSelect v-model="formData.spareParts" disabled />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MaintenanceRecordApi, MaintenanceRecordVO } from '@/api/dms/maintenancerecord'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import MaintenanceRecordContent from './MaintenanceRecordContent.vue'
import SparePartSelect from '../sparepart/SparePartSelect.vue'

/** 设备保养维护记录 表单 */
defineOptions({ name: 'MaintenanceRecordForm' })

const props = defineProps(['ledgerList', 'userList'])
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  recordStatus: undefined,
  device: undefined,
  criticalDevice: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  status: undefined,
  remarks: undefined,
  content: undefined,
  maintenanceBy: undefined,
  startTime: undefined,
  endTime: undefined,
  spareParts: [] //使用备件
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
      formData.value = await MaintenanceRecordApi.getMaintenanceRecord(id)
      formData.value.spareParts = await MaintenanceRecordApi.getSparePartByRecordId(id)
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
    const data = formData.value as unknown as MaintenanceRecordVO
    if (formType.value === 'create') {
      await MaintenanceRecordApi.createMaintenanceRecord(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await MaintenanceRecordApi.updateMaintenanceRecord(data)
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
    recordStatus: undefined,
    device: undefined,
    criticalDevice: undefined,
    expirationShutdown: undefined,
    expirationTime: undefined,
    type: undefined,
    status: undefined,
    remarks: undefined,
    content: undefined,
    maintenanceBy: undefined,
    startTime: undefined,
    endTime: undefined,
    spareParts: [] //使用备件
  }
  formRef.value?.resetFields()
}
</script>
