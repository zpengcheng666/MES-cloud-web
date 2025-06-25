<template>
  <!-- 列表 -->
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
<!--      <el-table-column type="expand">
        <template #default="scope">
          <BatchRecordProcesView :batch-id="scope.row.id"/>
        </template>
      </el-table-column>-->

      <el-table-column label="批次编号" align="center" prop="batchNumber" />
      <el-table-column label="外协厂家" align="center" prop="aidMill" />
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="数量" align="center" prop="count" width="100px" />
      <el-table-column label="状态" align="center" prop="status" width="100px">
        <template #default="scope">
          <dict-tag :type="'mcs_batch_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="实际开始时间" align="center" prop="startTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="实际结束时间" align="center" prop="endTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="前置批次" align="center" prop="preBatchNumber">
        <template #default="scope">
          <span>{{scope.row.isParent?"":scope.row.preBatchNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="140px">
        <template #default="scope">
          <el-button
            link
            v-if="scope.row.status !== 6"
            type="primary"
            @click="handleEdit(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import {inject, onMounted, ref} from 'vue';
import { BatchOrderApi, BatchOrderVO } from '@/api/mcs/batchorder'
import { dateFormatter } from '@/utils/formatTime'
// import BatchRecordProcesView from './BatchRecordProcesView.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const openViewFun = inject("openViewFun")
const selectOrderInfo = inject("selectOrderInfo")

const props = defineProps<{
  orderId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const expandKey = ref([]);

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchOrderApi.getBatchOrderPage(props.orderId)
  } finally {
    loading.value = false
  }
}

const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
    selectOrderInfo.batchNumber = row.batchNumber
    selectOrderInfo.batchStatus = row.status
    selectOrderInfo.batchSubmitStatus = row.submitStatus
  }
  else expandKey.value = [];
}

const handleEdit = async (row: any) => {
  await openViewFun.openBatchOrderProcesEdit(row);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
