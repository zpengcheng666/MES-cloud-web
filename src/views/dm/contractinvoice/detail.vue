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
            <el-form-item label="类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择类型" disabled >
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
                disabled
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
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="票据代码" prop="invoiceNumber">
              <el-input v-model="formData.invoiceNumber" placeholder="请输入票据代码" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="票据代码2" prop="invoiceNumber2">
              <el-input v-model="formData.invoiceNumber2" placeholder="请输入票据代码2" disabled />
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
          </el-tabs>
        </ContentWrap>

        <!-- 子表的表单 -->
        <ContentWrap>
          <el-tabs v-model="subTabsName">
            <el-tab-pane label="合同发票详细" name="contractInvoiceDetail">
              <ContractInvoiceDetailForm ref="contractInvoiceDetailFormRef" :invoice-id="formData.id" :details="formData.invoiceDetails" :paymentList="paymentData" :form-type="'detail'" />
            </el-tab-pane>
          </el-tabs>
        </ContentWrap>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ContractInvoiceApi } from '@/api/ppm/contractinvoice'
import { ContractPaymentApi } from '@/api/ppm/contractpayment'
import {ContractApi} from "@/api/ppm/contract";
import ContractInvoiceDetailForm from './components/ContractInvoiceDetailForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useTagsViewStore} from "@/store/modules/tagsView";
import {isEmpty} from "@/utils/is";
import {formatDate} from "@/utils/formatTime";

defineOptions({ name: 'DMBpmContractInvoiceDetail' })
const route = useRoute()
const props = defineProps<{ id?: number }>()
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const subTabsName1 = ref('contract')
const subTabsName = ref('contractInvoiceDetail')
const contractInvoiceDetailFormRef = ref()

const formData = ref({
  id: undefined,
  contractId: '',
  contractName: undefined,
  businessType: '1',
  type: undefined,
  amount: undefined,
  invoiceDate: undefined,
  invoiceNumber: undefined,
  invoiceNumber2: undefined,
  invoiceDetails: [] as any,
})

const formRef = ref() // 表单 Ref

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
const paymentData = ref([]) as any

// 获取支付单据集合
const getContractPayments = async () => {
  const data = reactive({
    invoiceId: formData.value.id,
    // 合同主键
    contractId: formData.value.contractId
  })
  paymentData.value = await ContractPaymentApi.getPaymentList4InvoiceByContractId(data);
}

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，合同不能为空！')
    close()
    return
  }
  formData.value = await ContractInvoiceApi.getContractInvoice(id)
  // 获取合同信息
  contractData.value = await ContractApi.getContractById(formData.value.contractId)
  // 获取付款数据
  await getContractPayments()
})
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
