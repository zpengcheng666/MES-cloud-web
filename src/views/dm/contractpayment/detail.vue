<template>
  <el-tabs>
    <el-tab-pane label="申请信息">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="合同" prop="contractId">
              <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly disabled />
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
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际付款方式" prop="method">
              <el-select v-model="formData.method" clearable filterable placeholder="请选择实际付款方式" disabled >
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
              <el-select v-model="formData.financeId" clearable filterable @change="onChangeAccount($event)" placeholder="请选择付款账号" disabled >
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
              <UploadFile :is-show-tip="false" v-model="formData.evidence" :limit="1" :formType="'detail'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" disabled />
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
              <DMContractPaymentSchemeForm ref="contractPaymentFormRef" :contract-id="formData.contractId" :details="formData.paymentDetails" :schemeList="schemeData" :form-type="'detail'" />
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
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>

import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import DMContractPaymentSchemeForm from "./DMContractPaymentSchemeForm.vue";
import { isEmpty } from '@/utils/is'
import {formatDate} from "@/utils/formatTime";
import {useTagsViewStore} from "@/store/modules/tagsView";
import {ContractPaymentApi} from "@/api/ppm/contractpayment";
import {ContractApi} from "@/api/ppm/contract";
import { CompanyFinanceApi } from '@/api/ppm/companyfinance'


defineOptions({ name: 'DMContractPaymentDetail' })
const route = useRoute()
const props = defineProps<{ id?: number }>()
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const subTabsName1 = ref('contract')
const subTabsName2 = ref('contractPayment')

const formData = ref({
  id: undefined,
  contractId: '',
  contractName: undefined,
  payDate: undefined,
  amount: undefined,
  method: undefined,
  financeId: undefined,
  evidence: '',
  remark: undefined,
  paymentDetails: [] as any,
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


/** 关闭 */
const { delView } = useTagsViewStore() // 视图操作
const { currentRoute } = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

/***
 * 获取合同
 * */
const contractData = ref({}) // 合同 Ref
const schemeData = ref([]) as any

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

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，合同不能为空！')
    close()
    return
  }
  formData.value = await ContractPaymentApi.getContractPayment(id)
  // 获取合同信息
  contractData.value = await ContractApi.getContractById(formData.value.contractId)
  // 获取税务信息
  await getFinance(contractData.value.party)
  onChangeAccount(formData.value.financeId)
  // 获取付款计划
  await getContractSchemes()
})
</script>
