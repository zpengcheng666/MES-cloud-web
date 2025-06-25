<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="产品" align="center" prop="materialName"  width="150px"/>
      <el-table-column label="产品物码" align="center" prop="barCode"  width="150px"/>
      <el-table-column label="产品批次" align="center" prop="batchNumber"  width="170px"/>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="发货数量" align="center" prop="consignedAmount" />
      <el-table-column label="出库数量" align="center" prop="outboundAmount" />
      <el-table-column label="出库人" align="center" prop="outboundBy" />
      <el-table-column
              label="出库日期"
              align="center"
              prop="outboundTime"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column label="确认数量" align="center" prop="signedAmount" />
      <el-table-column label="确认人" align="center" prop="signedBy" />
      <el-table-column
              label="确认日期"
              align="center"
              prop="signedTime"
              :formatter="dateFormatter"
              width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

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
