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
      <el-table-column type="expand">
        <template #default="scope">
          <BatchRecordView :batch-id="scope.row.id"/>
        </template>
      </el-table-column>

      <el-table-column label="批次编号" align="center" prop="batchNumber" />
      <el-table-column label="工艺规程" align="center" prop="technologyCode" />
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
            v-if="scope.row.submitStatus === 1 && (scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 4 || scope.row.status === 5)"
            link
            type="primary"
            @click="batchSuspend(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            修改
          </el-button>
          <el-button
            v-if="scope.row.submitStatus === 2"
            link
            type="primary"
            @click="batchContinue(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            恢复
          </el-button>
          <el-button
            v-if="!scope.row.preBatchId && scope.row.status === 3 && scope.row.submitStatus === 1"
            link
            type="primary"
            @click="batchIssuance(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            下发
          </el-button>
          <el-button
            v-if="scope.row.beginProcessId && scope.row.status === 0 && scope.row.submitStatus === 0"
            link
            type="primary"
            @click="splitRevoke(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            撤销拆单
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
import BatchRecordView from './BatchRecordView.vue'

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

const splitRevoke = async (row: any) => {
  await message.exportConfirm("撤销拆单" ,'确认撤销')
  const msg = await BatchOrderApi.splitRevoke(row.id);
  message.success(msg);
  await openViewFun.getList();
}

const batchSuspend = async (row: any) => {
  await message.confirm("订单暂停" ,'确认操作')
  const msg = await BatchOrderApi.batchSuspend(row.id);
  message.success(msg);
  await openViewFun.getList();
}

const batchContinue = async (row: any) => {
  await message.confirm("订单暂停" ,'确认操作')
  const msg = await BatchOrderApi.batchContinue(row.id);
  message.success(msg);
  await openViewFun.getList();
}

const batchIssuance = async (row: any) => {
  await message.confirm("订单下发" ,'确认下发')
  const msg = await BatchOrderApi.batchIssuance(row.id);
  message.success(msg);
  await openViewFun.getList();
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
