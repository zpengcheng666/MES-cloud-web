<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="抽样标准" prop="samplingStandardId">
            <el-tree-select
              v-model="formData.samplingStandardId"
              :data="standardList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择抽样标准"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样本数字码" prop="sampleSizeCode">
            <el-select v-model="formData.sampleSizeCode" placeholder="请选择样本数字码">
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.QMS_SAMPLE_SIZE_CODE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检验水平类型" prop="inspectionLevelType">
            <el-select v-model="formData.inspectionLevelType" placeholder="请选择检验水平类型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="批量下限值（N）" prop="minValue">
            <el-input-number v-model="formData.minValue" placeholder="请输入批量下限值（N）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批量上限值（N）" prop="maxValue">
            <el-input-number v-model="formData.maxValue" placeholder="请输入批量上限值（N）" />
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
import { SamplingRuleApi, SamplingRuleVO } from '@/api/qms/samplingrule'
import { SamplingStandardApi } from '@/api/qms/samplingstandard'
import {defaultProps, handleTree} from "@/utils/tree";
import {DICT_TYPE, getIntDictOptions, getStrDictOptions} from "@/utils/dict";

/** 抽样规则 表单 */
defineOptions({ name: 'SamplingRuleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const standardList = ref < Tree[] > ([]) // 树形结构

const formData = ref({
  id: undefined,
  samplingStandardId: '',
  sampleSizeCode: undefined,
  minValue: undefined,
  maxValue: undefined,
  inspectionLevelType: undefined,
})
const formRules = reactive({
  samplingStandardId: [{ required: true, message: '抽样标准不能为空', trigger: 'blur' }],
  sampleSizeCode: [{ required: true, message: '样本数字码不能为空', trigger: 'blur' }],
  minValue: [{ required: true, message: '下限值不能为空', trigger: 'blur' }],
  inspectionLevelType: [{ required: true, message: '检验水平类型不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, standardId ? : string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  if (standardId) {
    formData.value.samplingStandardId = standardId
  }
  getTree();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SamplingRuleApi.getSamplingRule(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getTree = async () => {
  const res = await SamplingStandardApi.getSamplingStandardList()

  standardList.value = []
  standardList.value.push(...handleTree(res))
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as SamplingRuleVO
    if (formType.value === 'create') {
      await SamplingRuleApi.createSamplingRule(data)
      message.success(t('common.createSuccess'))
    } else {
      await SamplingRuleApi.updateSamplingRule(data)
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
    samplingStandardId: '',
    sampleSizeCode: undefined,
    minValue: undefined,
    maxValue: undefined,
    inspectionLevelType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
