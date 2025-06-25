<template>
  <ContentWrap>
    <el-button type="info" @click="goBack"><Icon icon="ep:back" class="mr-5px" /> 返回</el-button>
    <el-button type="primary" @click="getList"><Icon icon="ep:refresh" class="mr-5px" /> 刷新</el-button>
  </ContentWrap>
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
          <demand-table :orderId="scope.row.id" />
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
        <el-table-column label="订单类型" align="center" prop="orderType" min-width="90">
          <template #default="scope">
            <dict-tag :type="'mcs_order_type'" :value="scope.row.orderType" />
          </template>
        </el-table-column>
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
      <el-table-column label="操作" align="center" width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="orderIssued(scope.row)"
            v-hasPermi="['bpm:category:update']"
          >
            下发
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, ref, onMounted} from "vue";
import {OrderFormApi} from "@/api/mcs/orderform";
import { dateFormatter2 } from '@/utils/formatTime'
import DemandTable from '@/views/mcs/productionPlan/components/demand/demandTable.vue'

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

const goBack = () => {
  sharedInfo.batchOrderReload();
  sharedInfo.pageName = 'orderView'
}

const getList = async () => {
  loading.value = true
  try {
    if (sharedInfo.batchOrderIdList) {
      if (sharedInfo.batchOrderIdList.length == 0) {
        list.value = [];
      } else {
        const params = {orderIds: sharedInfo.batchOrderIdList.join(',')}
        list.value = await OrderFormApi.getListByIds(params);
      }
    }
  } finally {
    loading.value = false
  }
}
sharedInfo.batchDemandReload = getList;

const orderIssued = async (row: any) => {
  const msg = await OrderFormApi.orderIssued(row.id);
  message.success(msg);
  sharedInfo.batchOrderIdList = sharedInfo.batchOrderIdList.filter(item => item != row.id);
  await getList()
}

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
  }
  else expandKey.value = [];
}

onMounted(() => {
  getList()
})

</script>

<style scoped>

</style>
