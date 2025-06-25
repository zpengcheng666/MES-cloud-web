<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
    <el-form label-width="120px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="合同编号" prop="number">
            <el-tag>{{contractData.number}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同名称" prop="contactName">
            <el-tag>{{contractData.contactName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="项目名称" prop="projectId">
            <el-tag>{{contractData.projectName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合同方" prop="partyName">
            <el-tag>{{contractData.partyName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签约人" prop="contactName">
            <el-tag>{{contractData.contactName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签约时间" prop="signingDate">
            <el-tag>{{contractData.signingDate ? formatDate(contractData.signingDate, 'YYYY-MM-DD') : ''}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="签约地点" prop="signingAddress">
            <el-tag>{{contractData.signingAddress}}</el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="签约部门" prop="departmentName">
            <el-tag>{{contractData.departmentName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="我方签约人" prop="selfContactName">
            <el-tag>{{contractData.selfContactName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否增值税" prop="vat">
              <dict-tag :type="DICT_TYPE.VAT_TYPE" :value="contractData.vat" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="币种" prop="currency">
            <dict-tag :type="DICT_TYPE.CURRENCY_TYPE" :value="contractData.currency" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交货方式" prop="delivery">
            <dict-tag :type="DICT_TYPE.PD_CONTRACT_DELIVERY" :value="contractData.delivery" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="合同状态" prop="contractStatus">
            <dict-tag :type="DICT_TYPE.PD_CONTRACT_STATUS" :value="contractData.contractStatus" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="采购员" prop="purchaserName">
            <el-tag>{{contractData.purchaserName}}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="备注" prop="remark">
            <el-tag>{{contractData.remark}}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <ContentWrap>
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="产品信息" name="contractOrder">
          <ContractOrderList :products="contractData.products" />
        </el-tab-pane>
        <el-tab-pane label="付款计划信息">
          <ContractPaymentSchemeList :schemes="contractData.paymentSchemes" />
        </el-tab-pane>
        <el-tab-pane label="收货信息">
          <ConsignmentList :consignments="contractData.consignmentList" />
        </el-tab-pane>
        <el-tab-pane label="付款信息">
          <ContractPaymentList :payments="contractData.payments" />
        </el-tab-pane>
        <el-tab-pane label="退货信息">
          <ConsignmentReturnList :returns="contractData.consignmentReturnList" />
        </el-tab-pane>
        <el-tab-pane label="退款信息">
          <ConsignmentRefundList :refunds="contractData.consignmentRefundList" />
        </el-tab-pane>
        <el-tab-pane label="发票信息">
          <ContractInvoiceList :invoices="contractData.invoices" />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
  </Dialog>
</template>

<script setup lang="ts">
import { formatDate} from '@/utils/formatTime'
import {ContractApi, ContractVO} from '@/api/ppm/contract'
import {DICT_TYPE} from "@/utils/dict";
import ContractOrderList from "./ContractOrderList.vue";
import ContractPaymentSchemeList from "./ContractPaymentSchemeList.vue";
import ContractPaymentList from "./ContractPaymentList.vue";
import ConsignmentList from "./ConsignmentList.vue";
import ConsignmentReturnList from "./ConsignmentReturnList.vue";
import ConsignmentRefundList from "./ConsignmentRefundList.vue";
import ContractInvoiceList from "./ContractInvoiceList.vue";
import {DMContractApi} from "@/api/dm/contract";
import {ApprovalApi} from "@/api/pms/pmsapproval";

/** 购销合同 列表 */
defineOptions({ name: 'Contract' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const contractData = ref<ContractVO[]>([]) // 列表的数据
const projectList = ref([])
const subTabsName = ref('contractOrder')

/** 打开弹窗 */
const open = async (id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = '执行情况'
  subTabsName.value = 'contractOrder'
  loading.value = true
  try {
    contractData.value = await ContractApi.getContractInfoById(id)
    projectList.value =  await ApprovalApi.getApprovalAll()
    const projectData = projectList.value.filter((item) => item.id == contractData.value.projectId)
    contractData.value.projectName = projectData.length ? projectData[0].projectName : '未关联'

  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


</script>
