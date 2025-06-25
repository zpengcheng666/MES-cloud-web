<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-form-item label="发起原因" prop="reasonType" :disabled="modeVisible">
        <el-select v-model="formData.reasonType" placeholder="请选择发起原因(新立项/修改)">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_REASON)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="assessmentType">
        <el-select v-model="formData.assessmentType" placeholder="请选择类型" :disabled="modeVisible">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_CATEGORY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="评估人" prop="assessmentPerson">
        <el-input v-model="formData.assessmentPerson" placeholder="请输入评估人" :disabled="modeVisible"/>
      </el-form-item>
      <el-form-item label="评估说明" prop="instruction">
        <el-input v-model="formData.instruction" placeholder="请输入评估说明" :disabled="modeVisible"/>
      </el-form-item>
      <el-form-item label="结论" prop="conclusion">
        <el-select v-model="formData.conclusion" placeholder="请选择结论" :disabled="modeVisible">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PMS_ASSESSMENT_CONCLUSION)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          :disabled="modeVisible"
          v-model="formData.startTime"
          type="date"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          :disabled="modeVisible"
          v-model="formData.endTime"
          type="date"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="预计完成时间" prop="prefinishTime">
        <el-date-picker
          :disabled="modeVisible"
          v-model="formData.prefinishTime"
          type="date"
          value-format="x"
          placeholder="选择预计完成时间"
        />
      </el-form-item>

      <el-form-item label="技术评估状态" prop="technologyAssessmentStatus">
        <el-select v-model="formData.technologyAssessmentStatus" placeholder="请选择技术评估状态" :disabled="modeVisible">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产能评估状态" prop="capacityAssessmentStatus">
        <el-select v-model="formData.capacityAssessmentStatus" placeholder="请选择产能评估状态" :disabled="modeVisible">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成本评估状态" prop="costAssessmentStatus">
        <el-select v-model="formData.costAssessmentStatus" placeholder="请选择成本评估状态" :disabled="modeVisible">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="策略评估状态" prop="strategyAssessmentStatus">
        <el-select v-model="formData.strategyAssessmentStatus" placeholder="请选择成本评估状态" :disabled="modeVisible">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName" :disabled="modeVisible">
      <el-tab-pane label="评审子表，评审补充" name="assessmentReplenish">
        <AssessmentReplenishForm ref="assessmentReplenishFormRef" :assessment-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer v-if="!modeVisible">
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AssessmentApi, AssessmentVO } from '@/api/pms/assessment'
import AssessmentReplenishForm from './components/AssessmentReplenishForm.vue'

/** 项目评审 表单 */
defineOptions({ name: 'AssessmentForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const modeVisible = ref(false);
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectId: undefined,
  reasonType: undefined,
  assessmentType: undefined,
  assessmentStatus: undefined,
  assessmentPerson: undefined,
  instruction: undefined,
  conclusion: undefined,
  startTime: undefined,
  endTime: undefined,
  prefinishTime: undefined,
  auditor: undefined,
  auditDate: undefined,
  auditOpinion: undefined,
  processInstanceId: undefined,
  status: undefined,
  technologyAssessmentStatus: undefined,
  capacityAssessmentStatus: undefined,
  costAssessmentStatus: undefined,
  strategyAssessmentStatus: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('assessmentReplenish')
const assessmentReplenishFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  modeVisible.value = false;
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  if (type==='detail') {
    modeVisible.value = true;
  }
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AssessmentApi.getAssessment(id)
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
  // 校验子表单
  try {
    await assessmentReplenishFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'assessmentReplenish'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AssessmentVO
    // 拼接子表的数据
    data.assessmentReplenishs = assessmentReplenishFormRef.value.getData()
    if (formType.value === 'create') {
      await AssessmentApi.createAssessment(data)
      message.success(t('common.createSuccess'))
    } else {
      await AssessmentApi.updateAssessment(data)
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
    projectId: undefined,
    reasonType: undefined,
    assessmentType: undefined,
    assessmentStatus: undefined,
    assessmentPerson: undefined,
    instruction: undefined,
    conclusion: undefined,
    startTime: undefined,
    endTime: undefined,
    prefinishTime: undefined,
    auditor: undefined,
    auditDate: undefined,
    auditOpinion: undefined,
    processInstanceId: undefined,
    status: undefined,
    technologyAssessmentStatus: undefined,
    capacityAssessmentStatus: undefined,
    costAssessmentStatus: undefined,
    strategyAssessmentStatus: undefined,
  }
  formRef.value?.resetFields()
}
</script>
