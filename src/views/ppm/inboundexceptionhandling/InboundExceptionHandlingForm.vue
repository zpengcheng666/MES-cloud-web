<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="产品表ID" prop="infoId">
        <el-input v-model="formData.infoId" placeholder="请输入产品表ID" />
      </el-form-item>
      <el-form-item label="入库单ID" prop="consignmentId">
        <el-input v-model="formData.consignmentId" placeholder="请输入入库单ID" />
      </el-form-item>
      <el-form-item label="入库单号" prop="no">
        <el-input v-model="formData.no" placeholder="请输入入库单号" />
      </el-form-item>
      <el-form-item label="应收数量" prop="consignedAmount">
        <el-input v-model="formData.consignedAmount" placeholder="请输入应收数量" />
      </el-form-item>
      <el-form-item label="实收数量" prop="signedAmount">
        <el-input v-model="formData.signedAmount" placeholder="请输入实收数量" />
      </el-form-item>
      <el-form-item label="处理人" prop="handleBy">
        <el-input v-model="formData.handleBy" placeholder="请输入处理人" />
      </el-form-item>
      <el-form-item label="处理日期" prop="handleTime">
        <el-date-picker
          v-model="formData.handleTime"
          type="date"
          value-format="x"
          placeholder="选择处理日期"
        />
      </el-form-item>
      <el-form-item label="物料类型ID" prop="materialConfigId">
        <el-input v-model="formData.materialConfigId" placeholder="请输入物料类型ID" />
      </el-form-item>
      <el-form-item label="状态  0待处理  1已处理" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态  0待处理  1已处理">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_EXCEPTION_HANDLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型 1采购收货 2外协退货 3原材料入库 4 销售退货" prop="consignmentType">
        <el-select v-model="formData.consignmentType" placeholder="请选择类型 1采购收货 2外协退货 3原材料入库 4 销售退货">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CONSIGNMENT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理结果  1入库 2退货" prop="rusultType">
        <el-select v-model="formData.rusultType" placeholder="请选择处理结果  1入库 2退货">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_EXCEPTION_HANDLE_RESULT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型 1来货不足 2收货收多 " prop="exceptionType">
        <el-select v-model="formData.exceptionType" placeholder="请选择异常类型 1来货不足 2收货收多 ">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="合同ID" prop="contratcId">
        <el-input v-model="formData.contratcId" placeholder="请输入合同ID" />
      </el-form-item>
      <el-form-item label="项目ID" prop="projectId">
        <el-input v-model="formData.projectId" placeholder="请输入项目ID" />
      </el-form-item>
      <el-form-item label="公司ID" prop="companyId">
        <el-input v-model="formData.companyId" placeholder="请输入公司ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { InboundExceptionHandlingApi, InboundExceptionHandlingVO } from '@/api/ppm/inboundexceptionhandling'

/** 入库异常处理 表单 */
defineOptions({ name: 'InboundExceptionHandlingForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  infoId: undefined,
  consignmentId: undefined,
  no: undefined,
  consignedAmount: undefined,
  signedAmount: undefined,
  handleBy: undefined,
  handleTime: undefined,
  materialConfigId: undefined,
  status: undefined,
  consignmentType: undefined,
  rusultType: undefined,
  exceptionType: undefined,
  contratcId: undefined,
  projectId: undefined,
  companyId: undefined,
})
const formRules = reactive({
  infoId: [{ required: true, message: '产品表ID不能为空', trigger: 'blur' }],
  consignmentId: [{ required: true, message: '入库单ID不能为空', trigger: 'blur' }],
  no: [{ required: true, message: '入库单号不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '应收数量不能为空', trigger: 'blur' }],
  signedAmount: [{ required: true, message: '实收数量不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料类型ID不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态  0待处理  1已处理不能为空', trigger: 'change' }],
  consignmentType: [{ required: true, message: '类型 1采购收货 2外协退货 3原材料入库 4 销售退货不能为空', trigger: 'change' }],
  exceptionType: [{ required: true, message: '异常类型 1来货不足 2收货收多 不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await InboundExceptionHandlingApi.getInboundExceptionHandling(id)
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
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as InboundExceptionHandlingVO
    if (formType.value === 'create') {
      await InboundExceptionHandlingApi.createInboundExceptionHandling(data)
      message.success(t('common.createSuccess'))
    } else {
      await InboundExceptionHandlingApi.updateInboundExceptionHandling(data)
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
    infoId: undefined,
    consignmentId: undefined,
    no: undefined,
    consignedAmount: undefined,
    signedAmount: undefined,
    handleBy: undefined,
    handleTime: undefined,
    materialConfigId: undefined,
    status: undefined,
    consignmentType: undefined,
    rusultType: undefined,
    exceptionType: undefined,
    contratcId: undefined,
    projectId: undefined,
    companyId: undefined,
  }
  formRef.value?.resetFields()
}
</script>