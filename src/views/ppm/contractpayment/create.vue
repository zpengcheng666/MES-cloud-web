<template>
<el-tabs>
  <el-tab-pane label="业务表单">
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
          <el-form-item label="实际付款日期" prop="payDate">
            <el-date-picker
              v-model="formData.payDate"
              type="date"
              value-format="x"
              placeholder="选择实际付款日期"
              style="width:100%"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际付款方式" prop="method">
            <el-select v-model="formData.method" clearable filterable placeholder="请选择实际付款方式" :disabled="formType == 'detail'">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_FINANCE_PAY_METHOD)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="付款账号" prop="financeId">
            <el-select v-model="formData.financeId" clearable filterable @change="onChangeAccount($event)" placeholder="请选择付款账号" :disabled="formType == 'detail'">
              <el-option
                v-for="dict in financeDictData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="付款凭证" prop="evidence">
            <UploadFile :is-show-tip="false" v-model="formData.evidence" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :disabled="formType == 'detail'"/>
          </el-form-item>
        </el-col>
      </el-row>

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
          <el-tab-pane label="税务信息" name="finance">
            <el-form v-if="!isEmpty(financeData)" label-width="120px">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="类型" prop="contractId">
                    <dict-tag :type="DICT_TYPE.PD_FINANCE_PAY_METHOD" :value="financeData.type" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="银行" prop="bank">
                    <el-tag>{{ financeData.bank }}</el-tag>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="电话" prop="contractId">
                    <el-tag>{{financeData.telephone}}</el-tag>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="联行号" prop="contact">
                    <el-tag>{{financeData.bankAddress}}</el-tag>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName2">
          <el-tab-pane label="付款详情" name="contractPayment">
            <ContractPaymentSchemeForm ref="contractPaymentFormRef" :contract-id="formData.contractId" :details="formData.paymentDetails" :schemeList="schemeData" :form-type="formType" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>

      <el-row>
        <el-col :span="8">
          <el-form-item label="付款金额合计" prop="amount">
            <el-input v-model="formData.amount" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-tab-pane>
  <el-tab-pane label="流程图" lazy>
    <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any" />
  </el-tab-pane>
</el-tabs>
  <!-- 表单弹窗：添加/修改 -->
  <ContractForm ref="contractRef" @getContract="getContract"/>
</template>

<script setup lang="ts">
import {ContractPaymentApi, ContractPaymentVO } from '@/api/ppm/contractpayment'
import { CompanyFinanceApi } from '@/api/ppm/companyfinance'

import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import ContractForm from "@/views/ppm/contractpayment/ContractForm.vue";
import ContractPaymentSchemeForm from "@/views/ppm/contractpayment/ContractPaymentSchemeForm.vue";
import { isEmpty } from '@/utils/is'
import {formatDate} from "@/utils/formatTime";
import {useTagsViewStore} from "@/store/modules/tagsView";
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import * as DefinitionApi from "@/api/bpm/definition";


/** 合同付款 表单 */
defineOptions({ name: 'BpmContractPaymentCreate' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const subTabsName1 = ref('contract')
const subTabsName2 = ref('contractPayment')
const contractPaymentFormRef = ref()

// 付款计划
// const paymentSchemeList = ref([])

const formData = ref({
  id: undefined,
  contractId: '',
  contractName: undefined,
  businessType: '1',
  payDate: undefined,
  amount: undefined,
  method: undefined,
  financeId: undefined,
  evidence: '',
  remark: undefined,
  paymentDetails: [] as any
})
const formRules = reactive({
  contractId: [{ required: true, message: '合同ID不能为空', trigger: 'change' }],
  payDate: [{ required: true, message: '实际付款日期不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '实际付款金额不能为空', trigger: 'blur' }],
  method: [{ required: true, message: '实际付款方式不能为空', trigger: 'change' }],
  financeId: [{ required: true, message: '付款账号不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 计算付款总金额 */
watch(
  () => formData.value.paymentDetails,
  (val) => {
    if (!val) {
      return
    }
    // 金额合计
    const amount = val.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr.amount ? curr.amount : 0), 0)
    formData.value.amount = amount ? amount : 0
  },
  { deep: true }
)


const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 验证付款计划
  if(!formData.value.paymentDetails){
    message.warning('请填写付款金额再进行提交！')
    return
  }
  // 校验子表单
  // try {
  //   console.log(contractPaymentFormRef.value)
  //   contractPaymentFormRef.value.validate()
  // } catch (e) {
  //   subTabsName2.value = 'contractPaymentScheme'
  //   return
  // }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ContractPaymentVO
    data.processKey = 'pm-contract-invoice-audit'
    await ContractPaymentApi.createAndSubmitContractPayment(data)
    message.success('发起成功')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'ContractPayment' })
  } finally {
    formLoading.value = false
  }
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
const schemeData = ref([]) as any

const getContract = (contract) => {
  contractData.value = contract
  // 选中合同
  formData.value.contractId = contract.id
  formData.value.contractName = contract.name
  // 获取选中合同的付款计划
  getContractSchemes()
  // 获取合同供应商财务信息
  getFinance(contract.party);
}

// 税务信息
const financeData = ref({}) // 合同 Ref
const financeDictData = ref([]) as any
const financeList = ref([]) as any
const getFinance = async (id) => {
  financeList.value = await CompanyFinanceApi.getCompanyFinanceByCompanyId(id)
  financeDictData.value = financeList.value.map(d => ({ label: d.accountNumber, value: d.id }))
}

/** 付款账号变更 */
const onChangeAccount = (id) => {
  financeData.value = financeList.value.find((item) => item.id === id)
}

// 获取合同付款计划集合
const getContractSchemes = async () => {
  const data = reactive({
    paymentId: formData.value.id,
    // 合同主键
    contractId: formData.value.contractId
  })
  schemeData.value = await ContractPaymentApi.getContractPaymentSchemeListByContractId(data);
}

// BPMN 数据
const bpmnXML = ref(null)

/** 初始化 */
onMounted(async () => {
  // 获取流程图
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(undefined,"pm-contract-payment-audit")
  if (processDefinitionDetail) {
    bpmnXML.value = processDefinitionDetail.bpmnXml
  }
})
</script>
