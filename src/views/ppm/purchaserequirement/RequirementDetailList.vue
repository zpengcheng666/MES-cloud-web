<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="ContractDetail">
            <el-tab-pane label="合同详情" name="ContractDetail">
              <ContractList :requirement-detail-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>

      <el-table-column label="源单类型" align="center" prop="sourceType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_SOURCE_TYPE" :value="row.sourceType" />
        </template>
      </el-table-column>

      <el-table-column label="采购类型" align="center" prop="planType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="number" />
      <el-table-column label="项目编号" align="center" prop="projectCode" />
      <el-table-column label="项目名" align="center" prop="projectName" />
      <el-table-column label="需求物料" align="center" prop="requiredMaterialName" />
      <el-table-column label="物料编号" align="center" prop="materialNumber" />
      <el-table-column label="需求数量" align="center" prop="requiredQuantity" />
      <el-table-column label="需求时间" :formatter="dateFormatter2" align="center" prop="requiredDate" />
      <el-table-column label="已采购数量" align="center" prop="purchasedQuantity" />
      <el-table-column label="预算单价" align="center" prop="estimatedPrice" />
      <el-table-column label="供应商" align="center" prop="supplier" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { PurchaseRequirementApi } from '@/api/ppm/purchaserequirement'
import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter2} from "@/utils/formatTime";
import ContractList from './ContractList.vue'

const props = defineProps<{
  requirementId: undefined // 退货单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = {
      requirementId : props.requirementId
    }
    list.value = await PurchaseRequirementApi.getPurchaseRequirementDetailByRequirementId(params)
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
