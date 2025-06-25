<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="退款单号" align="center" prop="no" />
      <el-table-column label="退货单号" align="center" prop="no" />
      <el-table-column label="退款方式" align="center" prop="refundType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_FINANCE_PAY_METHOD" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column
        label="退款日期"
        align="center"
        prop="refundTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="退款金额" align="center" prop="refundPrice" />
      <el-table-column label="审批状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="退款状态" align="center" prop="refundStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_REFUND_STATUS" :value="scope.row.refundStatus" />
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter2} from "@/utils/formatTime";

const props = defineProps<{
  contractId: string // 合同ID
  refunds: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.refunds,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
