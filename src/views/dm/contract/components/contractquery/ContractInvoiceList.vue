<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="类型" align="center" prop="type" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_INVOICE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="amount" />

      <el-table-column
              label="开具时间"
              align="center"
              prop="invoiceDate"
              :formatter="dateFormatter2"
              width="180px"
      />
      <el-table-column label="票据代码" align="center" prop="invoiceNumber" />
      <el-table-column label="票据代码2" align="center" prop="invoiceNumber2" />
      <el-table-column label="审批状态" align="center" prop="taxRate" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONTRACT_INVOICE_AUDIT_STATUS" :value="scope.row.status" />
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
  invoices: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.invoices,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
