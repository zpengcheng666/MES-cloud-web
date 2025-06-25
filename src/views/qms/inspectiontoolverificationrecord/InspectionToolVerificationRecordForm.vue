<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="工具名称" prop="toolName">
            <el-input v-model="formData.toolName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送检日期" prop="verificationDateBegin">
            <el-date-picker
              v-model="formData.verificationDateBegin"
              type="date"
              value-format="x"
              placeholder="选择送检时间"
              disabled
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" v-if="formData.status==1">
          <el-form-item label="实际送检日期" prop="verificationDateBeginAct">
            <el-date-picker
              v-model="formData.verificationDateBeginAct"
              type="date"
              value-format="x"
              placeholder="选择送检时间"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.status==2">
          <el-form-item label="完成日期" prop="verificationDateEnd">
            <el-date-picker
              v-model="formData.verificationDateEnd"
              type="date"
              value-format="x"
              placeholder="选择完成日期"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.status==2" >
          <el-form-item label="备注" prop="remark" >
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
          </el-form-item>
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
import { InspectionToolVerificationRecordApi, InspectionToolVerificationRecordVO } from '@/api/qms/inspectiontoolverificationrecord'
import {dateFormatter2} from "@/utils/formatTime";

/** 检验工具校准记录 表单 */
defineOptions({ name: 'InspectionToolVerificationRecordForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  toolName: undefined,
  stockId: undefined,
  toolId: undefined,
  verificationDateBegin: undefined,
  verificationDateBeginAct: undefined,
  verificationDateEnd: undefined,
  status: undefined,
  remark: undefined
})
const formRules = reactive({
  verificationDateBeginAct: [{ required: true, message: '送检时间不能为空', trigger: 'blur' }],
  verificationDateEnd: [{ required: true, message: '送检完成时间不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, status: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value = await InspectionToolVerificationRecordApi.getInspectionToolVerificationRecord(id)
  formData.value.status = status
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
    const data = formData.value as unknown as InspectionToolVerificationRecordVO
    if (formType.value === 'create') {
      await InspectionToolVerificationRecordApi.createInspectionToolVerificationRecord(data)
      message.success(t('common.createSuccess'))
    } else {
      await InspectionToolVerificationRecordApi.updateInspectionToolVerificationRecord(data)
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
    toolName: undefined,
    stockId: undefined,
    toolId: undefined,
    verificationDateBegin: undefined,
    verificationDateEnd: undefined,
    status: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
