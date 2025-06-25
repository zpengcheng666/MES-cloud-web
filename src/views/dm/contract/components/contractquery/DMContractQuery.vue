<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280" >
  <!--<ContentWrap>-->
    <!--&lt;!&ndash; 搜索工作栏 &ndash;&gt;-->
    <!--<el-form-->
      <!--class="-mb-15px"-->
      <!--:model="queryParams"-->
      <!--ref="queryFormRef"-->
      <!--:inline="true"-->
      <!--label-width="68px"-->
    <!--&gt;-->
      <!--<el-form-item label="合同编号" prop="number">-->
        <!--<el-input-->
          <!--v-model="queryParams.number"-->
          <!--placeholder="请输入合同编号"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      <!--</el-form-item>-->

      <!--<el-form-item>-->
        <!--<el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
        <!--<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
      <!--</el-form-item>-->
    <!--</el-form>-->
  <!--</ContentWrap>-->

    <!-- 列表 -->
    <ContentWrap>
      <el-tabs model-value="contract" v-if="contractData.id != null">
        <el-tab-pane label="合同信息" name="contract">
          <el-form label-width="120px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="合同编号" prop="number">
                  <el-tag>{{contractData.number}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同名称" prop="contactName">
                  <el-tag>{{contractData.name}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同方" prop="partyName">
                  <el-tag>{{contractData.partyName}}</el-tag>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="签约人" prop="contactName">
                  <el-tag>{{contractData.selfContactName}}</el-tag>
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
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

  <template v-if="contractData.id != null">
    <ContentWrap>
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="产品信息" name="contractOrder">
          <ContractOrderList :products="contractData.products" />
        </el-tab-pane>
        <el-tab-pane label="付款计划信息">
          <ContractPaymentSchemeList :schemes="contractData.paymentSchemes" />
        </el-tab-pane>
        <el-tab-pane label="发货信息">
          <ShippingList :consignments="contractData.shippings" />
        </el-tab-pane>
        <el-tab-pane label="付款信息">
          <ContractPaymentList :payments="contractData.payments" />
        </el-tab-pane>
        <el-tab-pane label="退货信息">
          <ShippingReturnList :returns="contractData.shippingReturns" />
        </el-tab-pane>
        <el-tab-pane label="退款信息">
          <ContractRefundList :refunds="contractData.contractRefunds" />
        </el-tab-pane>
        <el-tab-pane label="发票信息">
          <ContractInvoiceList :invoices="contractData.invoices" />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
  </template>
  </Dialog>
</template>

<script setup lang="ts">
import { formatDate} from '@/utils/formatTime'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import {DICT_TYPE} from "@/utils/dict";
import ContractOrderList from "./ContractOrderList.vue";
import ContractPaymentSchemeList from "./ContractPaymentSchemeList.vue";
import ContractPaymentList from "./ContractPaymentList.vue";
import ShippingList from "./ShippingList.vue";
import ShippingReturnList from "./ShippingReturnList.vue";
import ContractRefundList from "./ContractRefundList.vue";
import ContractInvoiceList from "./ContractInvoiceList.vue";

/** 购销合同 列表 */
defineOptions({ name: 'DMContractQuery' })



const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const contractData = ref<DMContractVO[]>([]) // 列表的数据
const subTabsName = ref('contractOrder')

const queryParams = reactive({
  type: '2',
  number: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
// const getList = async () => {
//   loading.value = true
//   try {
//     const data = await DMContractApi.getContractInfoByNumber(queryParams)
//     contractData.value = data
//   } finally {
//     loading.value = false
//   }
// }


/** 打开弹窗 */
const open = async (id?: string) => {
    debugger
    dialogVisible.value = true
    dialogTitle.value = '执行情况'
    subTabsName.value = 'contractOrder'
    loading.value = true
    try {
        contractData.value = await DMContractApi.getContractInfoById(id)

    } finally {
        loading.value = false
    }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


//
// /** 搜索按钮操作 */
// const handleQuery = () => {
//   subTabsName.value = 'contractOrder'
//   getList()
// }
//
// /** 重置按钮操作 */
// const resetQuery = () => {
//   queryFormRef.value.resetFields()
//   handleQuery()
// }

</script>
