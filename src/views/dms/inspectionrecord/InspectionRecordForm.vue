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
              <el-input v-model="formData.code" placeholder="请输入计划编码" />
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

            <el-form-item label="检查类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择检查类型">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.DMS_INSPECTION_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>

            <el-form-item label="检查人" prop="createBy">
              <el-select-v2
                v-model="formData.createBy"
                :options="props.userList"
                filterable
                clearable
                placeholder="请选择检查人"
              />
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                value-format="x"
                placeholder="选择开始时间"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                value-format="x"
                placeholder="选择结束时间"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="检查内容" prop="content">
              <InspectionRecordContent :disabled="true" :orangedata="formData.content" />
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { InspectionRecordApi, InspectionRecordVO } from '@/api/dms/inspectionrecord'
import InspectionRecordContent from './InspectionRecordContent.vue'

/** 设备检查记录 表单 */
defineOptions({ name: 'InspectionRecordForm' })
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
  code: undefined,
  status: undefined,
  device: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  remark: undefined,
  content: undefined,
  createBy: undefined,
  startTime: undefined,
  endTime: undefined
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
      formData.value = await InspectionRecordApi.getInspectionRecord(id)
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
    const data = formData.value as unknown as InspectionRecordVO
    if (formType.value === 'create') {
      await InspectionRecordApi.createInspectionRecord(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await InspectionRecordApi.updateInspectionRecord(data)
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
    status: undefined,
    device: undefined,
    expirationShutdown: undefined,
    expirationTime: undefined,
    type: undefined,
    remark: undefined,
    content: undefined,
    createBy: undefined,
    startTime: undefined,
    endTime: undefined
  }
  formRef.value?.resetFields()
}
</script>
