<template>
  <ContentWrap>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="expand" fixed="left" >
        <template #default="scope">
          <scheduling-process :orderId="scope.row.id" />
        </template>
      </el-table-column>
      <el-table-column label="项目号" align="center" prop="projectNumber" min-width="150" />
      <el-table-column label="加工类型" align="center" prop="procesStatus" min-width="80">
        <template #default="scope">
          <dict-tag :type="'mcs_proces_status'" :value="scope.row.procesStatus" />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" prop="orderNumber" min-width="150" />
      <el-table-column label="零件图号" align="center" prop="partNumber" min-width="240" />
      <el-table-column label="优先级" align="center" prop="priority"  width="80" />
      <el-table-column label="数量" align="center" prop="count" width="80" />
      <el-table-column label="排产状态" align="center" prop="schedulingStatus" width="90">
        <template #default="scope">
          <dict-tag :type="'mcs_scheduling_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="交付时间"
        align="center"
        prop="deliveryTime"
        :formatter="dateFormatter2"
        width="150"
      />
      <el-table-column label="负责人" align="center" prop="responsiblePersonName" min-width="110" />
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ref, inject, onMounted} from "vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {OrderFormApi} from "@/api/mcs/orderform";
import { dateFormatter2 } from '@/utils/formatTime'
import SchedulingProcess from "@/views/mcs/productionPlan/components/schedule/schedulingProcess.vue";
import {LedgerApi} from "@/api/dms/ledger";

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  sharedInfo.planSelectDevice = {}
  try {
    if (sharedInfo.orderIdList) {
      if (sharedInfo.orderIdList.length == 0) {
        list.value = [];
      } else {
        const params = {orderIds: sharedInfo.orderIdList.join(',')}
        list.value = await OrderFormApi.getListByProjectPlanId(params);
      }
    }
  } finally {
    loading.value = false
    sharedInfo.deviceNameMap = await LedgerApi.getLedgerList();
  }
}

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
  }
  else expandKey.value = [];
}

const getSchedulingPlanDevice = () => {
  return sharedInfo.planSelectDevice;
}
sharedInfo.getSchedulingPlanDevice = getSchedulingPlanDevice

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>

</style>
