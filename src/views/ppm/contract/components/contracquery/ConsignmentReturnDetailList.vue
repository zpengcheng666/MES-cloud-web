<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="产品物码" align="center" prop="barCode" />
      <el-table-column label="产品批次" align="center" prop="batchNumber"/>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="库存数量" align="center" prop="quantity" />
      <el-table-column label="退货数量" align="center" prop="consignedAmount" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

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
