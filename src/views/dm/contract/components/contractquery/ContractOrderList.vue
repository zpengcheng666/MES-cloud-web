<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="产品" align="center" prop="productName" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="默认税率" align="center" prop="initTax" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="单价" align="center" prop="price" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="含税单价" align="center" prop="taxPrice" />
      <el-table-column label="交货日期" align="center" prop="leadDate" :formatter="dateFormatter2" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import {dateFormatter2 } from "@/utils/formatTime";

const props = defineProps<{
  contractId: string // 合同ID
  products: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.products,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
