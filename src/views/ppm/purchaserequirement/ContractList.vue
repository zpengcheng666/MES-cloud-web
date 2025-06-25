<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="合同编号" align="center" prop="number" />
      <el-table-column label="合同名称" align="center" prop="name"  />
      <el-table-column label="合同类别" align="center" prop="contractType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="scope.row.contractType" />
        </template>
      </el-table-column>
      <el-table-column label="合同方" align="center" prop="partyName" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="审批状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONTRACT_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import {DICT_TYPE} from "@/utils/dict";

const props = defineProps<{
  requirementDetailId: undefined // 采购申请明细id
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ContractApi.getContractOrderListByRequirementDetailId(props.requirementDetailId);
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
