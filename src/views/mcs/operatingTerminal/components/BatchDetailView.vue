<template>
  <ContentWrap>
    <el-table :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" align="center" width="55"/>
      <el-table-column label="物料批次码" align="center" prop="partBatchNumber" />
      <el-table-column label="订单详情码" align="center" prop="orderDetailNumber" />
      <el-table-column label="质量编号" align="center" prop="qualityNumber" />
      <el-table-column label="生产单元" align="center" prop="unitName" />
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
          <el-button link type="primary" @click="openStepView(scope.row)">
            工步
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

</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import { BatchDetailApi, BatchDetailVO } from '@/api/mcs/batchdetail'
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, onMounted} from "vue";

defineOptions({ name: 'BatchDetailView' })
const commonFunction = inject<any>("commonFunction")
const list = ref<BatchDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  batchId: undefined,
})

const props = defineProps<{
  batchRecordId: undefined // 访客申请id（主表的关联字段）
}>()

const getList = async () => {
  queryParams.batchRecordId = props.batchRecordId
  const data = await BatchDetailApi.getBatchDetailPage(queryParams)
  list.value = data.list
  total.value = data.total
}

const openTestFormS = (row: any) => {
  commonFunction.batchDetailStart(row);
}
const openTestFormE = (row: any) => {
  commonFunction.batchDetailEnd(row);
}

const openStepView = (row: any) => {

}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

