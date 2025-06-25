<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <ContentWrap>
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="130px">
      <el-form-item label="更改单号" prop="changeCode">
        <el-input v-model="formData.changeCode" placeholder="请输入更改单号" class="!w-200px" />
      </el-form-item>
      <el-form-item label="更改原因" prop="changeReason">
        <el-select
          v-model="formData.changeReason"
          placeholder="请选择更改原因"
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESS_CHANGE_REASION)"
            :key="pr.value"
            :label="pr.label"
            :value="pr.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="更改内容" prop="changeContent">
        <el-input v-model="formData.changeContent" type="textarea" placeholder="请输入更改内容" />
      </el-form-item>
      <el-form-item label="在制品处理意见" prop="workingOpinions">
        <el-input v-model="formData.workingOpinions" type="textarea" placeholder="请输入在制品处理意见"  />
      </el-form-item>
    </el-form>
    </ContentWrap>
    <template #footer>
        <el-button @click="saveOrderItem" type="primary">保存</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>

import {
  ProcessChangeVO,
  ProcessPlanDetailApi
} from '@/api/pdm/processPlanDetail'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

defineOptions({ name: 'OrderChangeForm' });
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref(); // 表单 Ref
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  projectCode: '',
  processVersionId: '',
  changeCode: '',
  changeReason:'',
  changeContent: '',
  workingOpinions: '',
});
const formRules = reactive({
  changeCode: [{ required: true, message: '更改单号不能为空', trigger: 'blur' }],
  changeReason: [{ required: true, message: '更改原因不能为空', trigger: 'blur' }],
  changeContent: [{ required: true, message: '更改内容不能为空', trigger: 'blur' }],
  workingOpinions: [{ required: true, message: '在制品处理意见不能为空', trigger: 'blur' }],
});
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    projectCode: '',
    processVersionId: '',
    changeCode: '',
    changeReason: '',
    changeContent: '',
    workingOpinions: '',
  };
  formRef.value?.resetFields();
};

/** 打开弹窗 */
const open = async (type: string, id?: number, processVersionId, projectCode) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProcessPlanDetailApi.getProcessChangeById(id)
    } finally {
      formLoading.value = false
    }
  }
  formData.value.projectCode = projectCode;
  formData.value.processVersionId = processVersionId;
}
defineExpose({ open }); // 提供 open 方法，用于打开弹窗
/**提交*/
const emit = defineEmits(['success']);// 定义操作成功事件

const saveOrderItem = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProcessChangeVO
    if (formType.value === 'create') {
      await ProcessPlanDetailApi.saveOrderItem(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProcessPlanDetailApi.updateOrderItem(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
<style scoped>
.dialog-custom-size {
  width: 800px !important;
  height: 900px !important;
}
</style>

