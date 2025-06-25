<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="评估结果" prop="isPass">
        <el-radio-group v-model="formData.isPass" @change="selectedIsPass">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FEASIBILITY_RESULT)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isView" label="不通过原因" prop="reason">
        <el-input v-model="formData.reason" placeholder="请输入不通过原因" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-show="isOperatorSave" :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {FeasibilityDetailApi, FeasibilityResultVO} from "@/api/pdm/feasibilityDetail";

defineOptions({ name: 'FeasibilityResultForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const isOperatorSave = ref(false) // 是否可操作保存
const isView = ref(false) // 不通过原因显隐
const formData = ref({
  id: undefined,
  isPass: undefined,
  reason: undefined,
  projectCode: undefined,
  partVersionId: undefined,
})
const formRules = reactive({
  isPass: [{ required: true, message: '评估结果不能为空', trigger: 'blur' }],
  reason: [{ required: true, message: '不通过原因不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

const queryParamsResult = reactive({
  projectCode: '',
  partVersionId: '',
  status: '2'
})

/** 打开弹窗 */
const open = async (type: string, isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '评估结果'
  formType.value = type
  isOperatorSave.value = isOperator;
  queryParamsResult.projectCode = projectCode
  queryParamsResult.partVersionId = partVersionId
  resetForm()
  // 修改时，设置数据
  if ( type=== 'update') {
    formLoading.value = true
    try {
      formData.value = await FeasibilityDetailApi.getFeasibilityResultInfo(queryParamsResult)
      if(formData.value.isPass=='0') {
        isView.value = false;
      } else {
        isView.value = true;
      }
    } finally {
      formLoading.value = false
    }
  } else {
    formData.value.projectCode = projectCode
    formData.value.partVersionId = partVersionId
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    isPass: undefined,
    reason: undefined,
    projectCode: undefined,
    partVersionId: undefined,
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FeasibilityResultVO
    if (formType.value === 'create') {
      await FeasibilityDetailApi.createFeasibilityResult(data)
      message.success(t('common.createSuccess'))
    } else {
      await FeasibilityDetailApi.updateFeasibilityResult(data)
      message.success(t('common.updateSuccess'))
    }
    // 更新技术评估任务状态
    await FeasibilityDetailApi.updateFeasibilityTaskStatus(queryParamsResult)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const selectedIsPass = async (val) => {
  if(val=='0') {
    isView.value = false;
  } else {
    isView.value = true;
  }
}
</script>
