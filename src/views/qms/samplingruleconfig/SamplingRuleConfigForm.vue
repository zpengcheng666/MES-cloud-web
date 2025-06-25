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
          <el-form-item label="样本数字码" prop="sampleSizeCode">
            <el-select
              v-model="formData.sampleSizeCode"
              placeholder="请选择样本数字码"
              clearable
            >
              <el-option
                v-for="dict in getStrDictOptions(DICT_TYPE.QMS_SAMPLE_SIZE_CODE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检查类型" prop="samplingRuleType">
            <el-select
              v-model="formData.samplingRuleType"
              placeholder="请选择检查类型"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SAMPLING_RULE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="抽取样本数量" prop="sampleSize">
            <el-input-number v-model="formData.sampleSize" placeholder="请输入抽取样本数量"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">


          <el-form-item label="接收质量限（AQL）" prop="acceptanceQualityLimit">
            <el-input-number v-model="formData.acceptanceQualityLimit" :precision="3" :step="0.1"
                             placeholder="请输入接收质量限（AQL）"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">

          <el-form-item label="接收数（Ac）" prop="acceptNum">
            <el-input-number v-model="formData.acceptNum" placeholder="请输入接收数（Ac）"/>
          </el-form-item>


        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="拒收数（Re）" prop="rejectionNum">
            <el-input-number v-model="formData.rejectionNum" placeholder="请输入拒收数（Re）"/>
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
  import {DICT_TYPE, getIntDictOptions, getStrDictOptions} from "@/utils/dict";
  import {SamplingRuleConfigApi, SamplingRuleConfigVO} from '@/api/qms/samplingruleconfig'
  import {SamplingStandardApi} from '@/api/qms/samplingstandard'
  import {defaultProps, handleTree} from "@/utils/tree";

  /** 抽样规则（检验抽样方案） 表单 */
  defineOptions({name: 'SamplingRuleConfigForm'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    sampleSizeCode: undefined,
    sampleSize: undefined,
    samplingRuleType: undefined,
    acceptanceQualityLimit: undefined,
    acceptNum: undefined,
    rejectionNum: undefined,
  })
  const formRules = reactive({
    sampleSizeCode: [{required: true, message: '样本量字码不能为空', trigger: 'blur'}],
    sampleSize: [{required: true, message: '抽取样本数量不能为空', trigger: 'blur'}],
    samplingRuleType: [{required: true, message: '类型  1正常检查2加严检查3放宽检查不能为空', trigger: 'blur'}],
    acceptanceQualityLimit: [{required: true, message: '接收质量限（AQL）不能为空', trigger: 'blur'}],
    acceptNum: [{required: true, message: '接收数（Ac）不能为空', trigger: 'blur'}],
    rejectionNum: [{required: true, message: '拒收数（Re）不能为空', trigger: 'blur'}],
  })
  const formRef = ref() // 表单 Ref
  const standardList = ref < Tree[] > ([]) // 树形结构
  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number, standardId ? : string
  ) =>
  {
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
        formData.value = await
        SamplingRuleConfigApi.getSamplingRuleConfig(id)
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as SamplingRuleConfigVO
      if (formType.value === 'create') {
        await SamplingRuleConfigApi.createSamplingRuleConfig(data)
        message.success(t('common.createSuccess'))
      } else {
        await SamplingRuleConfigApi.updateSamplingRuleConfig(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }

  const getTree = async () => {
    const res = await SamplingStandardApi.getSamplingStandardList()

    standardList.value = []
    standardList.value.push(...handleTree(res))
  }
  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      sampleSizeCode: undefined,
      sampleSize: undefined,
      samplingRuleType: undefined,
      acceptanceQualityLimit: undefined,
      acceptNum: undefined,
      rejectionNum: undefined,
    }
    formRef.value?.resetFields()
  }
</script>
