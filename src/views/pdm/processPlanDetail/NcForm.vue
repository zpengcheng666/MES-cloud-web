<template>
  <Dialog :rules="formRules" v-model="dialogVisible" :title="dialogTitle" width="600">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item label="程序文件" prop="ncUrl">
        <UploadNcFile :is-show-tip="false" v-model="formData.ncUrl" @update:modelValue="updateModelValue" :limit="1"
          height="128px" width="128px" />
      </el-form-item>
      <el-form-item label="程序名称" prop="ncName">
        <el-input v-model="formData.ncName" clearable disabled />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail';
import UploadNcFile from "@/components/UploadFile/src/UploadNcFile.vue";
import { ref, defineExpose, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'NcForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref(); // 表单 Ref
// const ncName = ref('');
const formData = ref({
  id: undefined,
  ncName: undefined,
  ncUrl: undefined,
  stepId: '',
  procedureId: '',
  processVersionId: '',
});

const formRules = reactive({
  ncName: [{ required: true, message: '程序名称不能为空', trigger: 'change' }],
  ncUrl: [{ required: true, message: '请选择上传的文件！', trigger: 'change' }],
});



/** 打开弹窗 */
const openNc = async (processVersionId: string, procedureId: string, stepId: string) => {
  dialogVisible.value = true;
  dialogTitle.value = '选择程序文件';
  formData.value.processVersionId = processVersionId;
  formData.value.procedureId = procedureId;
  formData.value.stepId = stepId;
};
defineExpose({ openNc }); // 提供 open 方法，用于打开弹窗

const updateModelValue = (fileName) => {
  // 将上传的文件名设置为ncName的值
  formData.value.ncName = fileName.split(',')[1];
  formData.value.ncUrl = fileName.split(',')[0];
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 提交请求
      formLoading.value = true;
      const data = formData.value;
      await ProcessPlanDetailApi.saveNc(data);
      dialogVisible.value = false;
      // 发送操作成功的事件
      emit('success');
      formLoading.value = false;
      resetForm();
    }
  });
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    ncName: undefined,
    ncUrl: undefined,
    stepId: undefined,
    procedureId: undefined,
    processVersionId: undefined,
  };
  formRef.value?.resetFields();
};
</script>
