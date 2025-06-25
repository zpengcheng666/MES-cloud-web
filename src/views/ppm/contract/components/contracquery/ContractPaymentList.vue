<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="paymentDetail">
            <el-tab-pane label="支付明细" name="paymentDetail">
              <PaymentDetailList :details="scope.row.paymentDetailDTOList"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>

      <el-table-column
        label="实际付款日期"
        align="center"
        prop="payDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="实际付款金额" align="center" prop="amount" />

      <el-table-column label="实际付款方式" align="center" prop="method" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_FINANCE_PAY_METHOD" :value="scope.row.method" />
        </template>
      </el-table-column>

      <el-table-column label="审批状态" align="center" prop="status" width="100px" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONTRACT_PAYMENT_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter2} from "@/utils/formatTime";
import PaymentDetailList from "./ContractPaymentDetailList.vue";

const props = defineProps<{
  contractId: string // 合同ID
  payments: [any]
}>()
const formData = ref([]) as any

watch(
  () => props.payments,
  async (val) => {
    console.log(111, val)
    formData.value = val
  },
  { immediate: true }
)

</script>
