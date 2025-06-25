<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="产品编号" align="center" prop="materialNumber"  />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="单位" align="center" prop="materialUnit"  />
      <el-table-column label="采购数量" align="center" prop="consignedAmount" />
      <el-table-column label="收货数量" align="center" prop="signedAmount" />
      <el-table-column label="收货人" align="center" prop="signedBy" />
      <el-table-column
        label="签收日期"
        align="center"
        prop="signedTime"
        :formatter="dateFormatter2"
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
