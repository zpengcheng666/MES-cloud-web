<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="paymentDetail">
            <el-tab-pane label="支付明细" name="paymentDetail">
              <ConsignmentDetailList :details="scope.row.detailDTOList"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="收货单号" align="center" prop="no" width="180"/>
      <el-table-column label="收货单名称" align="center" prop="name" width="180"/>
      <el-table-column label="收货人" align="center" prop="consignedBy" width="180" />
      <el-table-column
        label="收货日期"
        align="center"
        prop="consignedDate"
        :formatter="dateFormatter2"
        width="180"
      />
      <el-table-column label="状态" align="center" prop="consignmentStatus" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="承运方式" align="center" prop="deliveryMethod" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod" />
        </template>
      </el-table-column>

      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>
      <el-table-column label="发货人" align="center" prop="consigner" width="180"/>
      <el-table-column label="审批结果" align="center" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_PROCUREMENT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import { dateFormatter2 } from "@/utils/formatTime";
import ConsignmentDetailList from "./ConsignmentDetailList.vue";

const props = defineProps<{
  contractId: string // 合同ID
  consignments: [any]
}>()
const loading = ref(false)
const formData = ref([]) as any

watch(
  () => props.consignments,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

</script>
