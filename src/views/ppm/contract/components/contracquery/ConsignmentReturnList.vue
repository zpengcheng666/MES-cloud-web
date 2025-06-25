<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="returnDetail">
            <el-tab-pane label="退货明细" name="returnDetail">
              <ConsignmentReturnDetailList :details="scope.row.returnDetailDTOList"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="退货单编号" align="center" prop="consignmentReturnNo" />
      <el-table-column label="退货单名称" align="center" prop="consignmentReturnName" />
      <el-table-column label="合作方" align="center" prop="partyName" width="180"/>
      <el-table-column label="处理方式" align="center" prop="returnType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.RETURN_TYPE" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column label="退换货原因" align="center" prop="returnReason"  width="200px"/>
      <el-table-column label="审批状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="退货状态" align="center" prop="consignmentStatus" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_RETURN_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="退货人" align="center" prop="consigner" />
      <el-table-column
        label="退货日期"
        align="center"
        prop="consignerDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="接收人" align="center" prop="consignedBy" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import { dateFormatter2 } from "@/utils/formatTime";
import ConsignmentReturnDetailList from "./ConsignmentReturnDetailList.vue";

const props = defineProps<{
  contractId: string // 合同ID
  returns: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.returns,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
