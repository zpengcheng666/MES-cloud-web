<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column
        label="实际付款日期"
        align="center"
        prop="payDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="付款计划" align="center" prop="amount" />
      <el-table-column label="结算方式" align="center" prop="paymentControl" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_PAYMENT_CONTROL" :value="scope.row.paymentControl" />
        </template>
      </el-table-column>
      <el-table-column label="付款日期" align="center" prop="payDate" :formatter="dateFormatter2" />
      <el-table-column label="比例" prop="ratio" />
      <el-table-column label="金额" prop="schemeAmount" />
      <el-table-column label="支付金额" align="center" prop="amount" />
      <el-table-column label="付款方式" align="center" prop="method" width="150" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_FINANCE_PAY_METHOD" :value="scope.row.method" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter2} from "@/utils/formatTime";

const props = defineProps<{
  contractId: string // 合同ID
  details: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.details,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
