<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="number" width="150px"/>
      <el-table-column label="工序序号" align="center" prop="procedureNum" width="80px" />
      <el-table-column label="生产单元" align="center" prop="unitName" >
        <template #default="scope">
          <span v-text="scope.row.procesStatus === 2 ? scope.row.aidMill : scope.row.unitName"></span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center" prop="deviceNumber" />
      <el-table-column label="数量" align="center" prop="count" width="60px" />
      <el-table-column label="状态" align="center" prop="status" width="100px">
        <template #default="scope">
          <dict-tag :type="'mcs_batch_record_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="实际开始时间" align="center" prop="startTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="实际结束时间" align="center" prop="endTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="操作" align="center" width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm(scope.row)"
            v-hasPermi="['bpm:category:update']"
            v-if="selectOrderInfo.batchSubmitStatus === 0 || selectOrderInfo.batchSubmitStatus === 2 && scope.row.status === 0"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.count > 1 && (scope.row.status === 0 || scope.row.status === 1 || scope.row.status === 2)&& selectOrderInfo.batchSubmitStatus !== 1"
            link
            type="primary"
            @click="splitOrder(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            拆单
          </el-button>
          <el-button v-if="scope.row.status !== 0 || (scope.row.isBatch && !scope.row.preRecordId)" link type="primary" @click="openBatchDetailForm(scope.row)" v-hasPermi="['mcs:batch-order:update']">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { BatchRecordApi } from '@/api/mcs/batchRecord'
import { dateFormatter } from '@/utils/formatTime'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const openViewFun = inject("openViewFun")
const selectOrderInfo = inject("selectOrderInfo")

const props = defineProps<{
  batchId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationId: undefined,
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchRecordApi.getBatchRecordList(props.batchId)
  } finally {
    loading.value = false
  }
}

const splitOrder = (row: any) => {
  openViewFun.splitOrderCount(row)
}

const openBatchDetailForm = (row: any) => {
  openViewFun.openBatchDetail(row);
}

/** 添加/修改操作 */
const openForm = (row: any) => {
  openViewFun.openBatchRecordEdit(row);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
