<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item label="编制负责人" prop="reviewer">
        <el-select v-model="formData.reviewer" placeholder="请选择编制负责人" filterable clearable class="!w-890px"
          @change="handleReviewerChange">
          <el-option v-for="rew in reviewerList" :key="rew.id" :label="rew.nickname" :value="rew.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="编制截止时间" prop="deadline">
        <el-date-picker v-model="formData.deadline" type="date" value-format="x" class="!w-1/1"
          :disabled-date="disabledDate" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>


import { ProcessTaskApi, ProcessTaskVO } from '@/api/pdm/processTask';
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import * as UserApi from "@/api/system/user";

defineOptions({ name: 'ProcessTaskForm' }); // 修改为 PascalCase

const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const formLoading = ref(false); // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref(''); // 表单的类型：create - 新增；update - 修改
const reviewerList = ref<any[]>([]);

const handleChange = (val) => {
  this.selectedDate = val;
};
const formData = ref({
  id: '',
  reviewedBy: undefined,
  reviewer: undefined,
  status: '',
  deadline: '',
  projectCode: '',
});
const formRules = reactive({
  reviewer: [{ required: true, message: '负责人未选择', trigger: 'blur' }],
  deadline: [{ required: true, message: '编制截止日期不能为空', trigger: 'change' }]
});

const disabledDate = (time) => {
  return dayjs(time).isBefore(dayjs().startOf('day'), 'day');
};

const partVersionIdArr = ref([]) // 零部件版本id数组

const formRef = ref(); // 表单 Ref
const showDatePicker = ref(false);

const getFormattedDeadline = () => {
  formattedDeadline.value = dateFormatter(formData.value.deadline);
};
const formatDeadline = (deadline: string) => {
  if (!deadline) return '';
  return dayjs(deadline).format('YYYY-MM-DD');
};

// 计算属性用于显示格式化的日期
const formattedDeadline = computed(() => {
  return formData.value.deadline ? dayjs(formData.value.deadline).format('YYYY-MM-DD') : '';
});

/** 查询负责人列表 */
const getReviewerList = async () => {
  const userList = await UserApi.getSimpleUserList();
  reviewerList.value = userList.map(user => ({ id: user.id, nickname: user.nickname }));
};

/** 修改负责人方法*/
const handleReviewerChange = (selectedId: string) => {
  const selectedOption = reviewerList.value.find(rew => rew.id === selectedId);
  if (selectedOption) {
    formData.value.reviewer = selectedOption.nickname;
    formData.value.reviewedBy = selectedId;
  }
};

/** 打开弹窗 */
const open = async (type: string, taskId?: string, partVersionIds?: string[], projectCodeStr?: string) => {
  dialogVisible.value = true;
  dialogTitle.value = "指派工艺任务";
  formType.value = type;
  resetForm();
  // 修改时，设置数据
  if (taskId) {
    formLoading.value = true;
    try {
      formData.value = await ProcessTaskApi.getProcessTask(taskId);
    } finally {
      formLoading.value = false;
    }
  }
  if (partVersionIds) {
    partVersionIdArr.value = partVersionIds
  }

  if (projectCodeStr) {
    formData.value.projectCode = projectCodeStr
  }
};

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    reviewedBy: '',
    deadline: '',
  };
  formRef.value?.resetFields();
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return; // 修改了这一行
  const valid = await formRef.value.validate();
  if (!valid) return;
  // 提交请求
  formLoading.value = true;
  try {
    const data = formData.value as unknown as ProcessTaskVO;
    if (formType.value === 'add') {
      if (partVersionIdArr.value) {
        data.partVersionIdArr = partVersionIdArr.value
        data.status = 1;
        await ProcessTaskApi.addProcessTask(data);
      }

      message.success(t('common.createSuccess'));
    } else {
      await ProcessTaskApi.updateProcessTask(data);
      message.success(t('common.updateSuccess'));
    }
    dialogVisible.value = false;
    // 发送操作成功的事件
    emit('success');
  } finally {
    formLoading.value = false;
  }
};

const updateFormattedDeadline = (value: string) => {
  formData.value.deadline = value;
  formattedDeadline.value = formatDeadline(value);
};

const openDatePicker = () => {
  showDatePicker.value = true;
};

const closeDatePicker = () => {
  showDatePicker.value = false;
};


onMounted(async () => {
  await getReviewerList();
});
</script>
