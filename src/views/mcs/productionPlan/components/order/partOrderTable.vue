<template>
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <process-order-table :batch-id="scope.row.id" />
        </template>
      </el-table-column>

      <el-table-column label="编号" align="center" prop="batchNumber" min-width="130px"/>
      <el-table-column label="工艺规程" align="center" prop="technologyCode" />
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" min-width="180px"/>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" :formatter="dateFormatter" min-width="180px"/>
      <el-table-column label="数量" align="center" prop="count" />
      <el-table-column label="前置任务" align="center" prop="preBatchNumber">
        <template #default="scope">
          <span>{{scope.row.isParent?"":scope.row.preBatchNumber}}</span>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {inject, onMounted, ref} from 'vue';
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { BatchOrderApi } from '@/api/mcs/batchorder'
import { dateFormatter } from '@/utils/formatTime'
import ProcessOrderTable from '@/views/mcs/productionPlan/components/order/processOrderTable.vue'

const message = useMessage() // 消息弹窗
const sharedInfo = inject("sharedInfo")

const props = defineProps<{
  orderId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchOrderApi.getBatchOrderPage(props.orderId)
  } finally {
    loading.value = false
  }
}
sharedInfo.partOrderReload = getList;

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
