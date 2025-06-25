<template>
  <Dialog :rules="formRules" v-model="dialogVisible" :title="dialogTitle" width="600">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item label="文件路径" prop="vaultUrl">
        <UploadPartFile :is-show-tip="false" v-model="formData.vaultUrl" @update:modelValue="updateModelValue" :limit="1"
                      height="128px" width="128px" />
      </el-form-item>
      <el-form-item label="文件名称" prop="fileName">
        <el-input v-model="formData.fileName" clearable disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {PartAttachmentApi,PartAttachmentVO} from "@/api/pdm/part/partattachment";
import { ref, defineExpose, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import UploadPartFile from '@/components/UploadFile/src/UploadPartFile.vue';


defineOptions({ name: 'FileForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref(); // 表单 Ref
const formData = ref({
  id: '',
  datapackageBomId: '',
  fileName: '',
  fileId: '',
  vaultUrl: '',
  fileSource :'1',
  creator: '1',
  updater: '1',

});

const formRules = reactive({
  fileName: [{ required: true, message: '文件名称不能为空', trigger: 'change' }],
  vaultUrl: [{ required: true, message: '请选择上传的文件！', trigger: 'change' }],
});



/** 打开弹窗 */
const openFile = async (datapackageBomId:string) => {
  dialogVisible.value = true;
  dialogTitle.value = '选择文件';
  formData.value.datapackageBomId = datapackageBomId;
    console.log(formData.value.datapackageBomId)
};
defineExpose({ openFile }); // 提供 open 方法，用于打开弹窗

const updateModelValue = (fileName1) => {
  // 将上传的文件名设置为ncName的值
  formData.value.fileName = fileName1.split(',')[1];
  formData.value.vaultUrl = fileName1.split(',')[0];
};

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 提交请求
      formLoading.value = true;
      const data = formData.value;
      console.log(data)
      await PartAttachmentApi.saveNewFile(data);
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
