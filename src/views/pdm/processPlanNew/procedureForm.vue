<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" class="dialog-custom-size">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工序序号" prop="procedureNum">
            <el-input v-model="formData.procedureNum" placeholder="请输入工序序号" class="!w-200px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序名称" prop="procedureName">
            <el-select
              v-model="formData.procedureName"
              filterable
              clearable
              class="!w-200px"
            >
              <el-option
                v-for="na in procedureList"
                :key="na.name"
                :label="na.name"
                :value="na.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="准备工时(min)" prop="preparationTime" >
            <el-input-number v-model="formData.preparationTime" :min="0" clearable controls-position="right" class="!w-200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加工工时(min)" prop="processingTime">
            <el-input-number v-model="formData.processingTime" :min="0" clearable controls-position="right" class="!w-200px"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否专检" prop="isInspect">
            <el-radio-group v-model="formData.isInspect" class="!w-200px">
              <el-radio v-for="is in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISINSPECT)" :key="is.value"
                        :label="is.value">
                {{ is.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关重属性" prop="procedureProperty">
            <el-select
              v-model="formData.procedureProperty"
              placeholder="请选择关重属性"
              clearable
              class="!w-200px"
            >
              <el-option
                v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                :key="pr.value"
                :label="pr.label"
                :value="pr.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否外委" prop="isOut">
            <el-radio-group v-model="formData.isOut">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作说明" prop="description">
        <iframe id="BlMarkdownEditor" ref="IframeRef"  :src="src" width="100%" height="300px" style="border: none"></iframe>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>

import {ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import {ProcessRouteApi, ProcessRouteVO} from '@/api/pdm/processRoute'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import { ref, defineExpose,reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {ProcessPlanApi} from "@/api/pdm/processPlan";
const VITE_BASE_EDITOR_URL = import.meta.env.VITE_BASE_EDITOR_URL
const src = ref(VITE_BASE_EDITOR_URL)

defineOptions({ name: 'ProcedureForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const procedureList = ref<any[]>([]); //获取工序列表
const procedureNum = ref('') //补加工时的当前工序号
const procedureNumNext = ref('') //补加工时的补加工后工序号
const formRef = ref(); // 表单 Ref
const IframeRef = ref() //ifrmae 的ref
const formData = ref({
  processVersionId: '',
  procedureNum: '',
  name:'',
  procedureName: '',
  isInspect: '',
  preparationTime: '',
  processingTime: '',
  procedureProperty: '',
  description: '',
  isOut: '',
});
const formRules = reactive({
  procedureNum:[{ required: true, message: '工序序号不能为空', trigger: 'blur'}],
  procedureName: [{ required: true, message: '工序名称不能为空', trigger: 'blur' }],
  procedureProperty: [{ required: true, message: '关重属性不能为空', trigger: 'blur' }],
  isInspect: [{ required: true, message: '请选择是否专检！', trigger: 'blur' }],
  isOut:[{ required: true, message: '请选择是否外委！', trigger: 'blur' }]
  });

/** 查询工序列表，只做获取name用 */
const getProcedureList = async () => {
  procedureList.value = await ProcessPlanApi.getProcessRouteList(null)
};
/** 重置表单 */
const resetForm = () => {
  const processVersionId = formData.value.processVersionId;
  formData.value = {
    processVersionId: '',
    procedureNum: '',
    procedureName: '',
    isInspect: '',
    preparationTime: '',
    processingTime: '',
    description: '',
    descriptionPreview: '',

  };
  formData.value.processVersionId = processVersionId;
  formRef.value?.resetFields();
};

/** 打开弹窗 */
const open = async (processVersionId, procedureNumS?: string, procedureNumNextS?: string) => {
  dialogVisible.value = true
  dialogTitle.value = "添加工序"
  formData.value.processVersionId = processVersionId;
  // 补加工时传值
  procedureNum.value = procedureNumS
  procedureNumNext.value = procedureNumNextS
  resetForm()
}

const receivedContent = ref()
const receivedContentHtmls = ref()

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'description') {
    receivedContent.value = data.data;
    console.log(receivedContent.value)
    // 更新表单字段
    if (formData.value) {
      formData.value.description = receivedContent.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else if (data.type == 'contentHtml') {
    receivedContentHtmls.value = data.data;
    // 更新表单字段
    if (formData.value) {
      formData.value.descriptionPreview = receivedContentHtmls.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else {
    console.warn('Unknown message type:', data.type);
  }

}, false);



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
    formData.value.description =  receivedContent.value
    formData.value.descriptionPreview = receivedContentHtmls.value
    // 校验工序号(补加工工艺编制时)
    if(procedureNum.value && procedureNumNext.value) {
      if(procedureNumNext.value) {
        if(parseInt(data.procedureNum)<parseInt(procedureNum.value) || parseInt(data.procedureNum)>=parseInt(procedureNumNext.value)) {
          //当前工序号≤工序号＜补加工后工序号
          message.error('工序号必须在当前工序号与补加工后工序号之间')
          return
        }
      } else {//最后一道工序
        if(parseInt(data.procedureNum)<parseInt(processForm.value.procedureNum)) {
          message.error('工序号必须≥当前工序号')
          return
        }
      }
    }
    const procedureId = await ProcessPlanDetailApi.addProcedure(data);
    message.success(t('common.createSuccess'));
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success', procedureId, data.procedureNum, data.procedureName);
  } finally {
    formLoading.value = false;
  }
};
onMounted(async () => {
  await getProcedureList();
});
</script>
<style scoped>.dialog-custom-size {
  width: 800px !important;
  height: 900px !important;
}
</style>
