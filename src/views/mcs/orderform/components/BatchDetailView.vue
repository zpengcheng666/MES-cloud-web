<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1400">
    <ContentWrap>
      <el-table :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="序号" type="index" align="center" width="55"/>
        <el-table-column label="物料批次码" align="center" prop="partBatchNumber" />
        <el-table-column label="订单详情码" align="center" prop="orderDetailNumber" />
        <el-table-column label="物料条码" align="center" prop="barCode" />
        <el-table-column v-if="rowSelect.procesStatus === 1" label="生产单元" align="center" prop="unitName" />
        <el-table-column v-if="rowSelect.procesStatus === 2" label="外协厂家" align="center" prop="aidMill" />
        <el-table-column label="状态" align="center" prop="status" width="85" >
          <template #default="scope">
            <DictTag :type="'mcs_order_detail_status'" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          align="center"
          prop="startTime"
          :formatter="dateFormatter"
          width="180"
        />
        <el-table-column
          label="结束时间"
          align="center"
          prop="endTime"
          :formatter="dateFormatter"
          width="180"
        />
        <el-table-column label="操作" align="center" width="140px">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 5"
              link
              type="primary"
              @click="openTestFormS(scope.row)"
            >
              开工
            </el-button>
            <el-button
              v-if="scope.row.status === 3"
              link
              type="primary"
              @click="openTestFormE(scope.row)"
            >
              完工
            </el-button>
            <el-button
              v-if="scope.row.status === 0 && scope.row.isBatch && selectOrderInfo.batchSubmitStatus !== 1"
              link
              type="primary"
              @click="splitDetail(scope.row)"
            >
              拆分
            </el-button>
            <el-button link type="primary" @click="stepRecordShowFun(scope.row.id)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <ContentWrap v-if="stepRecordShow">
      <el-table :data="stepRecordList" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="设备编号" align="center" prop="deviceName" />
        <el-table-column label="生产单元" align="center" prop="unitName" />
        <el-table-column label="操作类型" align="center" prop="operationType">
          <template #default="scope">
            <DictTag :type="'mcs_operation_type'" :value="scope.row.operationType" />
          </template>
        </el-table-column>
        <el-table-column label="物料批次" align="center" prop="batchDetailNumber" width="180" />
        <el-table-column label="工序" align="center" prop="processName" />
        <el-table-column label="工步" align="center" prop="stepName" />
        <el-table-column
          label="操作时间"
          align="center"
          prop="operationTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作人" align="center" prop="operationName" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="stepTotal"
        v-model:page="stepQueryParams.pageNo"
        v-model:limit="stepQueryParams.pageSize"
        @pagination="getStepRecordList"
      />
    </ContentWrap>
    <template #footer>
<!--      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>-->
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <TestForm ref="testFormRef" />
  </Dialog>
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import { BatchDetailApi, BatchDetailVO } from '@/api/mcs/batchdetail'
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { inject } from "vue";
import TestForm from '@/views/mcs/test/TestForm.vue'
import {ProductionRecordsApi} from "@/api/mcs/productionrecords";
import {f} from "vite/dist/node/types.d-jgA8ss1A";

defineOptions({ name: 'BatchDetailView' })
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('批次任务详情') // 弹窗的标题
const list = ref<BatchDetailVO[]>([]) // 列表的数据
const stepRecordList = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const stepTotal = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  batchId: undefined,
})
const stepQueryParams = reactive({
  pageNo: 1,
  pageSize: 8,
  batchId: undefined,
})
const openViewFun = inject("openViewFun");
const selectOrderInfo = inject("selectOrderInfo")
const stepRecordShow = ref(false);

let rowSelect: any = {}
const open = (row: any) => {
  dialogVisible.value = true
  rowSelect = row
  getList()
  resetStepRecord();
}

const getList = async () => {
  queryParams.batchRecordId = rowSelect.id
  const data = await BatchDetailApi.getBatchDetailPage(queryParams)
  list.value = data.list
  total.value = data.total
}

const stepRecordShowFun = async (detailId: String) => {
  stepQueryParams.batchDetailId = detailId
  stepRecordShow.value = true
  getStepRecordList()
}

const getStepRecordList = async () => {
  const data = await ProductionRecordsApi.getProductionRecordsPage(stepQueryParams)
  stepRecordList.value = data.list
  stepTotal.value = data.total
}

const resetStepRecord = () => {
  stepRecordShow.value = false;
  stepRecordList.value = []
  stepTotal.value = 0
  stepQueryParams.pageNo = 1
  stepQueryParams.pageSize = 8
  stepQueryParams.batchDetailId = undefined
}

const splitDetail = (row: any) => {
  openViewFun.splitDetail(row)
}

const testFormRef = ref();
const openTestFormS = (row: any) => {
  testFormRef.value.open("开工", 'batchRecordStart', 'batchRecordStart', {batchRecordId: row.batchRecordId, partBatchNumber: row.partBatchNumber});
}
const openTestFormE = (row: any) => {
  testFormRef.value.doFun('batchRecordEnd', {batchRecordId: row.batchRecordId, barCode: row.barCode});
}

defineExpose({ open })
</script>

