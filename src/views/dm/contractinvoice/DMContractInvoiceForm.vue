<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同" prop="contractId">
            <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly :disabled="formType == 'detail'"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" :disabled="formType == 'detail'">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_CONTRACT_INVOICE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="金额" prop="amount">
            <el-input-number
              v-model="formData.amount"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
              placeholder="请输入金额"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="开具时间" prop="invoiceDate">
            <el-date-picker
              v-model="formData.invoiceDate"
              type="date"
              value-format="x"
              placeholder="选择开具时间"
              style="width:100%;"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="票据代码" prop="invoiceNumber">
            <el-input v-model="formData.invoiceNumber" placeholder="请输入票据代码" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="票据代码2" prop="invoiceNumber2">
            <el-input v-model="formData.invoiceNumber2" placeholder="请输入票据代码2" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="附件" prop="fileUrl">
            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" :formType="formType"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 合同信息 -->
    <ContentWrap>
      <el-tabs v-model="subTabsName1">
        <el-tab-pane label="合同信息" name="contract">
          <el-form v-if="!isEmpty(contractData)" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同编号" prop="contractId">
                  <el-tag>{{contractData.number}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="签约时间" prop="signingDate">
                  <el-tag>{{contractData.signingDate ? formatDate(contractData.signingDate, 'YYYY-MM-DD') : ''}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合同方" prop="contractId">
                  <el-tag>{{contractData.partyName}}</el-tag>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="签约人" prop="contact">
                  <el-tag>{{contractData.contactName}}</el-tag>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <ContentWrap>
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="合同发票详细" name="contractInvoiceDetail">
          <ContractInvoiceDetailForm ref="contractInvoiceDetailFormRef" :invoice-id="formData.id" :details="formData.invoiceDetails" :paymentList="paymentData" :form-type="formType" />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="formType != 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>

    <!-- 表单弹窗：添加/修改 -->
    <DMContractForm ref="contractRef" @getContract="getContract"/>
  </Dialog>
</template>
<script setup lang="ts">
import { ContractInvoiceApi, ContractInvoiceVO } from '@/api/ppm/contractinvoice'
import { ContractPaymentApi } from '@/api/ppm/contractpayment'

import ContractInvoiceDetailForm from './components/ContractInvoiceDetailForm.vue'
import DMContractForm from "@/views/dm/contractpayment/DMContractForm.vue";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {isEmpty} from "@/utils/is";
import {formatDate} from "@/utils/formatTime";
import {ContractApi} from "@/api/ppm/contract";

/** 购销合同发票 表单 */
defineOptions({ name: 'DMContractInvoiceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const subTabsName1 = ref('contract')
const subTabsName = ref('contractInvoiceDetail')

const formData = ref({
  id: undefined,
  contractId: undefined,
  contractName: undefined,
  businessType: '2',
  type: undefined,
  amount: undefined,
  invoiceDate: undefined,
  invoiceNumber: undefined,
  invoiceNumber2: undefined,
  fileUrl: '',
  invoiceDetails: [] as any,
})
const formRules = reactive({
  contractId: [{ required: true, message: '合同不能为空', trigger: 'change' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const contractInvoiceDetailFormRef = ref()

/** 计算总金额 */
watch(
  () => formData.value.invoiceDetails,
  (val) => {
    if (!val || val.length==0) {
      return
    }
    // 金额合计
    const amount = val.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr.amount ? curr.amount : 0), 0)
    formData.value.amount = amount ? amount : undefined
  },
  { deep: true }
)

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
      formData.value = await ContractInvoiceApi.getContractInvoice(id)
      // 获取合同信息
      contractData.value = await ContractApi.getContractById(formData.value.contractId)
      await getContractPayments()
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
  // 校验子表单
  try {
    await contractInvoiceDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'contractInvoiceDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ContractInvoiceVO
    if (formType.value === 'create') {
      await ContractInvoiceApi.createContractInvoice(data)
      message.success(t('common.createSuccess'))
    } else {
      await ContractInvoiceApi.updateContractInvoice(data)
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
    contractId: undefined,
    contractName: undefined,
    businessType: '1',
    type: undefined,
    amount: undefined,
    invoiceDate: undefined,
    invoiceNumber: undefined,
    invoiceNumber2: undefined,
    fileUrl: '',
    invoiceDetails: [] as any,
  }
  formRef.value?.resetFields()
}


/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
  contractRef.value.open()
}

/***
 * 获取合同
 * */
const contractData = ref({}) // 合同 Ref
const paymentData = ref([]) as any

const getContract = (contract) => {
  contractData.value = contract
  // 选中合同
  formData.value.contractId = contract.id
  formData.value.contractName = contract.name
  // 获取支付单据
  getContractPayments()
}
// 获取支付单据集合
const getContractPayments = async () => {
  const data = reactive({
    invoiceId: formData.value.id,
    // 合同主键
    contractId: formData.value.contractId
  })
  paymentData.value = await ContractPaymentApi.getPaymentList4InvoiceByContractId(data);
}

</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
