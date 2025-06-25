<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading"
              ref="detailTableRef"
              :data="list"
              :stripe="true"
              :show-overflow-tooltip="true"
              @select="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="源单类型" align="center" prop="sourceType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_SOURCE_TYPE" :value="row.sourceType" />
        </template>
      </el-table-column>

      <el-table-column label="源单类型" align="center" prop="planType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="需求物料" align="center" prop="requiredMaterialName" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="需求数量" align="center" prop="requiredQuantity" />
      <el-table-column label="需求时间" :formatter="dateFormatter2" align="center" prop="requiredDate" />
      <el-table-column label="预算单价" align="center" prop="estimatedPrice" />
      <el-table-column label="供应商" align="center" prop="supplier" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { PurchaseRequirementApi } from '@/api/ppm/purchaserequirement'
import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter2} from "@/utils/formatTime";

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
      requirementId : props.requirementId,
      isValid: 1
    }
    list.value = await PurchaseRequirementApi.getPurchaseRequirementDetailByRequirementId(params)
  } finally {
    loading.value = false
  }
}

/**
 * 实现单选行
 */
const emit = defineEmits(['getRequirement']) // 定义 success 事件，用于操作成功后的回调
// const selectionContract = ref<[]>()
const detailTableRef = ref() // 表格的 Ref
const handleSelectionChange = (selection) => {
    if (selection.length > 1) {
      //移除上一次选中行数据
      selection.shift();
    }
    //修改选中图标为未选中状态
  detailTableRef.value.clearSelection();
    //将当前选中行改为选中状态
  detailTableRef.value.toggleRowSelection(selection[0]);
    //selectionContract.value = selection[0]
    // contractTableRef.value.setCurrentRow(selection[0])
  emit('getRequirement', selection[0])
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
