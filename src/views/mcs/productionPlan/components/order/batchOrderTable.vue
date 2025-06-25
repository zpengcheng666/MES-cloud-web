<template>
  <ContentWrap v-show="sharedInfo.batchOrderIdList?.length > 0">
    <el-button type="primary" @click="orderScheduling"><Icon icon="ep:plus" class="mr-5px" /> 排产</el-button>
    <el-button type="primary" @click="createDemand"><Icon icon="ep:plus" class="mr-5px" /> 备料下发</el-button>
  </ContentWrap>
  <ContentWrap class="h-1/1">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      @selection-change="selectionChange"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="selection" fixed="left" width="55" :reserve-selection="true" />
      <el-table-column type="expand" fixed="left" >
        <template #default="scope">
          <part-order-table :orderId="scope.row.id" />
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
<!--      <el-table-column label="订单类型" align="center" prop="orderType" min-width="90">
        <template #default="scope">
          <dict-tag :type="'mcs_order_type'" :value="scope.row.orderType" />
        </template>
      </el-table-column>-->
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
import {ref, watch, inject, onMounted} from "vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {OrderFormApi} from "@/api/mcs/orderform";
import { dateFormatter2 } from '@/utils/formatTime'
import PartOrderTable from '@/views/mcs/productionPlan/components/order/partOrderTable.vue'

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

watch(
  () => sharedInfo.orderIdList,
  () => {
    getList()
  },
  { deep: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
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
  }
}
sharedInfo.batchOrderReload = getList;

const tableRef = ref();
const selectionChange = () => {
  sharedInfo.batchOrderIdList = tableRef.value.getSelectionRows().map(item => item.id);
}

const createDemand = async () => {
  const data = sharedInfo.batchOrderIdList
  console.log(data)
  await OrderFormApi.generateDemandByOrderIds(data);
  sharedInfo.pageName = 'demandView'
}

const orderScheduling = async () => {
  sharedInfo.pageName = 'schedulingView'
}

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
  }
  else expandKey.value = [];
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>

</style>
