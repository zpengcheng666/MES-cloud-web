<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" class="dialog-custom-size">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工步序号" prop="stepNum">
            <el-input-number v-model="formData.stepNum" :min="1" placeholder="请输入工步序号" class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工步名称" prop="stepName">
            <el-input v-model="formData.stepName" placeholder="请输入工步名称" class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="关重属性" prop="stepProperty">
            <el-select v-model="formData.stepProperty" placeholder="请选择关重属性" clearable class="!w-200px">
              <el-option v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)" :key="pr.value"
                :label="pr.label" :value="pr.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工时(min)" prop="processingTime">
            <el-input v-model="formData.processingTime" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="showProcessType === 1 || showProcessType === 2">
        <el-col :span="12">
          <el-form-item label="装炉温度(℃)" prop="furnaceTemperature">
            <el-input v-model="formData.furnaceTemperature" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加热温度(℃)" prop="heatTemperature">
            <el-input v-model="formData.heatTemperature" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="showProcessType === 1 || showProcessType === 2">
        <el-col :span="12">
          <el-form-item label="升温时间(min)" prop="heatUpTime">
            <el-input v-model="formData.heatUpTime" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保温时间(min)" prop="keepHeatTime">
            <el-input v-model="formData.keepHeatTime" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="showProcessType === 1 || showProcessType === 2">
        <el-col :span="12">
          <el-form-item label="冷却介质" prop="coolingMedium">
            <el-input v-model="formData.coolingMedium" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="冷却温度(℃)" prop="coolingTemperature">
            <el-input v-model="formData.coolingTemperature" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="showProcessType === 1 || showProcessType === 2">
        <el-col :span="12">
          <el-form-item label="冷却时间(s)" prop="coolingTime">
            <el-input v-model="formData.coolingTime" clearable class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="showProcessType === 2" label="槽号" prop="slotNumber">
            <el-select v-model="formData.slotNumber" multiple placeholder="请选择">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_STEP_SLOT_NUMBER)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作说明" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入工作说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>

import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import { ref, defineExpose, reactive } from 'vue';
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useI18n } from 'vue-i18n';


defineOptions({ name: 'StepForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const showProcessType = ref(''); // 控制工艺类型输入框的显示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref(); // 表单 Ref
const formData = ref({
  processVersionId: '',
  procedureId: '',
  stepNum: '',
  stepName: '',
  stepProperty: '',
  description: '',
  slotNumber: [],
  furnaceTemperature: '',
  heatTemperature: '',
  heatUpTime: '',
  keepHeatTime: '',
  coolingMedium: '',
  coolingTemperature: '',
  coolingTime: '',
  processingTime: '',
});
const formRules = reactive({
  stepNum: [{ required: true, message: '工步序号不能为空', trigger: 'blur' }],
  stepName: [{ required: true, message: '工步名称不能为空', trigger: 'change' }],
  stepProperty: [{ required: true, message: '关重属性不能为空', trigger: 'change' }],
  processingTime: [{ required: true, message: '工时不能为空', trigger: 'change' }],
  slotNumber: [{ required: true, message: '槽号不能为空', trigger: 'change' }],
  furnaceTemperature: [{ required: true, message: '装炉温度不能为空', trigger: 'change' }],
  heatTemperature: [{ required: true, message: '加热温度不能为空', trigger: 'change' }],
  heatUpTime: [{ required: true, message: '升温时间不能为空', trigger: 'change' }],
  keepHeatTime: [{ required: true, message: '保温时间不能为空', trigger: 'change' }],
  coolingMedium: [{ required: true, message: '冷却介质不能为空', trigger: 'change' }],
  coolingTemperature: [{ required: true, message: '冷却温度不能为空', trigger: 'change' }],
  coolingTime: [{ required: true, message: '冷却时间不能为空', trigger: 'change' }],
});
/** 重置表单 */
const resetForm = () => {
  const processVersionId = formData.value.processVersionId;
  const procedureId = formData.value.procedureId;
  formData.value = {
    processVersionId: '',
    procedureId: '',
    stepNum: '',
    stepName: '',
    stepProperty: '',
    description: '',
    slotNumber: [],
    furnaceTemperature: '',
    heatTemperature: '',
    heatUpTime: '',
    keepHeatTime: '',
    coolingMedium: '',
    coolingTemperature: '',
    coolingTime: '',
    processingTime: '',
  };
  formData.value.processVersionId = processVersionId;
  formData.value.procedureId = procedureId;
  formRef.value?.resetFields();
};

const queryParamsProcess = reactive({
  processVersionId: '',
  procedureId: '',
  projectCode: '',
  partVersionId: '',
  stepNumber: '',
  status: '2'
})

/** 打开弹窗 */
const open = async (processVersionId, procedureId, processType, projectCode, partVersionId) => {
  dialogVisible.value = true
  dialogTitle.value = "添加工步"
  formData.value.processVersionId = processVersionId;
  formData.value.procedureId = procedureId;
  showProcessType.value = processType;
  queryParamsProcess.processVersionId = processVersionId;
  queryParamsProcess.procedureId = procedureId;
  queryParamsProcess.projectCode = projectCode;
  queryParamsProcess.partVersionId = partVersionId;
  resetForm()
}
defineExpose({ open }); // 提供 open 方法，用于打开弹窗
/**提交*/
const emit = defineEmits(['success']);// 定义操作成功事件
const submitForm = async () => {
  try {
    formLoading.value = true;
    const valid = await formRef.value.validate();
    if (!valid) {
      formLoading.value = false;
      return;
    }
    const data = formData.value as unknown as ProcessPlanDetailVO;
    await ProcessPlanDetailApi.addStep(data);
    // 更新工艺详细设计任务状态
    await ProcessPlanDetailApi.updateProcessDetailTaskStatus(queryParamsProcess)
    message.success(t('common.createSuccess'));
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};
</script>
<style scoped>
.dialog-custom-size {
  width: 800px !important;
  height: 900px !important;
}
</style>
