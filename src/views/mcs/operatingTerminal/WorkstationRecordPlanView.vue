<template>
  <ContentWrap>
    <el-table
      :data="batchRecordList"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <ContentWrap>
            <BatchDetailView :batchRecordId="scope.row.id" />
          </ContentWrap>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" align="center" prop="number"/>
      <el-table-column label="零件图号" align="center" prop="partNumber"/>
      <el-table-column label="工艺" align="center" prop="technologyCode" />
      <el-table-column label="工序号" align="center" prop="processNumber" />
      <el-table-column label="数量" align="center" prop="count"/>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="'mcs_batch_record_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="实际开始时间" align="center" prop="startTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="实际结束时间" align="center" prop="endTime" :formatter="dateFormatter" width="180px"/>
      <el-table-column label="操作" align="center" width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="scope"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
  <DetailStartView ref="detailStartRef" @success="reset" />
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import {OperatingTerminalApi} from "@/api/mcs/operatingTerminal";
import { dateFormatter } from '@/utils/formatTime'
import BatchDetailView from './components/BatchDetailView.vue'
import DetailStartView from './components/DetailStartView.vue'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'WorkstationRecordPlanView' })

const message = useMessage() // 消息弹窗
const loading = ref(true) // 列表的加载中
const commonFunction = inject("commonFunction")
const deviceUnitList = inject("deviceUnitList")
const deviceId = ref("")
const batchRecordList = ref<any[]>()
const expandKey = ref([]);

const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) expandKey.value = [row.id];
  else expandKey.value = [];
}

const deviceUnitSelected = async (val) => {
  deviceId.value = val;
  batchRecordList.value = await OperatingTerminalApi.getBatchRecordPlan(val);
}
defineExpose({deviceUnitSelected})

const reset = async () => {
  await deviceUnitSelected(deviceId.value);
}

const detailStartRef = ref();
const openTestFormS = (row: any) => {
  let data: any = {
    batchRecordId: row.batchRecordId,
    partBatchNumber: row.partBatchNumber,
    operatorId: useUserStore().getUser.id,
  }
  const device = deviceUnitList.value.find(item => item.id == deviceId.value)
  if (device.type == 2) {
    data.unitNumber = device.code;
  } else {
    data.deviceNumber = device.code;
  }
  console.log(data)
  detailStartRef.value.open(data);
}
const openTestFormE = (row: any) => {
  // testFormRef.value.doFun('batchRecordEnd', {batchRecordId: row.batchRecordId, qualityNumber: row.qualityNumber});
}
commonFunction.batchDetailStart = openTestFormS;
commonFunction.batchDetailEnd = openTestFormE;

</script>
