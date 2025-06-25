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
      <el-form-item label="访客姓名" prop="name">
        <el-input v-model="formData.name"  />
      </el-form-item>
      <el-form-item label="签退时间" prop="visitorCancelTime">
        <el-date-picker
          v-model="formData.visitorCancelTime"
          type="date"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="访问状态" prop="status">
        <el-select-v2
          v-model="formData.status"
          :options="getIntDictOptions(DICT_TYPE.ES_STATUS)"
          clearable
        />
      </el-form-item>
      <el-form-item label="访客车牌" prop="licenseNo">
        <el-input v-model="formData.licenseNo"  />
      </el-form-item>
      <el-form-item label="访客单位" prop="company">
        <el-input v-model="formData.company"  />
      </el-form-item>
      <el-form-item label="来访目的" prop="cause">
        <el-input v-model="formData.cause" />
      </el-form-item>
      <el-form-item label="同行人数" prop="followCount">
        <el-input v-model="formData.followCount"  />
      </el-form-item>
      <el-form-item label="开始时间" prop="planBeginTime">
        <el-date-picker
          v-model="formData.planBeginTime"
          type="date"
          value-format="x"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="planEndTime">
        <el-date-picker
          v-model="formData.planEndTime"
          type="date"
          value-format="x"
        />
      </el-form-item>
<!--      <el-form-item label="签到时间" prop="visitorRecordTime">-->
<!--        <el-date-picker-->
<!--          v-model="formData.visitorRecordTime"-->
<!--          type="date"-->
<!--          value-format="x"-->
<!--          placeholder="选择签到时间"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="访客签到码" prop="visitorCheckCode">-->
<!--        <el-input v-model="formData.visitorCheckCode" placeholder="请输入访客签到码" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="被访人tpId" prop="visitTpId">-->
<!--        <el-input v-model="formData.visitTpId" placeholder="请输入被访人tpId" />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="设备SN" prop="deviceSn">-->
<!--        <el-input v-model="formData.deviceSn" placeholder="请输入设备SN" />-->
<!--      </el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { VisitApi, VisitVO } from '@/api/es/visit'

/** 访客记录 表单 */
defineOptions({ name: 'VisitForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  visitRecordId: undefined,
  name: undefined,
  visitorCancelTime: undefined,
  status: undefined,
  company: undefined,
  cause: undefined,
  followCount: undefined,
  planBeginTime: undefined,
  planEndTime: undefined,
  visitorRecordTime: undefined,
  visitorCheckCode: undefined,
  visitTpId: undefined,
  deviceSn: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '访客姓名不能为空', trigger: 'blur' }],
  planBeginTime: [{ required: true, message: '计划开始时间不能为空', trigger: 'blur' }],
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
      formData.value = await VisitApi.getVisit(id)
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
    const data = formData.value as unknown as VisitVO
    if (formType.value === 'create') {
      await VisitApi.createVisit(data)
      message.success(t('common.createSuccess'))
    } else {
      await VisitApi.updateVisit(data)
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
    visitRecordId: undefined,
    name: undefined,
    visitorCancelTime: undefined,
    status: undefined,
    company: undefined,
    cause: undefined,
    followCount: undefined,
    planBeginTime: undefined,
    planEndTime: undefined,
    visitorRecordTime: undefined,
    visitorCheckCode: undefined,
    visitTpId: undefined,
    deviceSn: undefined,
  }
  formRef.value?.resetFields()
}
</script>
