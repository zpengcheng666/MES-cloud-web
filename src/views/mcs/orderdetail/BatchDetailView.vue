<template>
  <ContentWrap v-if="init">
    <el-table :data="listOD" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="当前单元" align="center" prop="processingUnitName" />
      <el-table-column label="当前外协厂家" align="center" prop="aidMill" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <DictTag :type="'mcs_order_detail_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
      />
    </el-table>
  </ContentWrap>
  <ContentWrap v-if="init">
    <el-table :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" align="center" width="55"/>
      <el-table-column label="物料批次编码" align="center" prop="partBatchNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="生产单元" align="center" prop="unitName" />
      <el-table-column label="外协厂家" align="center" prop="aidMill" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <DictTag :type="'mcs_order_detail_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import download from '@/utils/download'
import { BatchDetailApi, BatchDetailVO } from '@/api/mcs/batchdetail'

defineOptions({ name: 'BatchDetailView' })
const init = ref(false);
const listOD = ref([])
const list = ref<BatchDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  batchId: undefined,
})

let rowSelect:any = {}
const open = (row: any) => {
  init.value = true
  listOD.value = [row]
  rowSelect = row
  getList()
}

const getList = async () => {
  queryParams.orderDetailId = rowSelect.id
  const data = await BatchDetailApi.getBatchDetailPage(queryParams)
  list.value = data.list
  total.value = data.total
}

defineExpose({ open })
</script>

