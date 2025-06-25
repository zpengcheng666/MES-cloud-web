<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="formData" :stripe="true" :show-overflow-tooltip="true" >
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="shippingDetail">
            <el-tab-pane label="销售发货明细" name="shippingDetail">
              <ShippingDetailList :details="scope.row.shippingDetailDTOList"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="发货单号" align="center" prop="shippingNo" width="180"/>
      <el-table-column label="发货单名称" align="center" prop="shippingName" width="180"/>
      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>
      <el-table-column label="发货人" align="center" prop="consigner" width="180"/>
      <el-table-column
              label="发货日期"
              align="center"
              prop="consignerDate"
              :formatter="dateFormatter"
              width="180px"
      />

      <el-table-column label="审批状态" align="center" width="120" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="160" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus"/>
        </template>
      </el-table-column>
      <el-table-column
              label="创建日期"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column label="承运方式" align="center" prop="deliveryMethod" width="90">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod"/>
        </template>
      </el-table-column>
      <el-table-column label="承运人" align="center" prop="deliveryBy" width="180"/>
      <el-table-column label="承运单号" align="center" prop="deliveryNumber" width="180"/>
      <el-table-column label="承运人电话" align="center" prop="deliveryContact" width="180"/>
      <el-table-column label="收货人" align="center" prop="consignedBy" width="180"/>

      <el-table-column label="收货人联系方式" align="center" prop="consignedContact" width="180"/>
      <el-table-column
              label="创建日期"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import {DICT_TYPE} from "@/utils/dict";
import { dateFormatter2 } from "@/utils/formatTime";
import ShippingDetailList from "./ShippingDetailList.vue";

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
