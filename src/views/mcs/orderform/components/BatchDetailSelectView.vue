<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1400">
    <ContentWrap>
      <el-table ref="detailTableRef" @row-click="rowClick" row-key="id" :data="batchDetailList" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column type="selection" width="55" :selectable="selectable" />
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
      </el-table>
      <!-- 分页 -->
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { inject } from "vue";

defineOptions({ name: 'BatchDetailSelectView' })
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('批次任务详情') // 弹窗的标题
const detailTableRef = ref();

const disableIds = ref([])

const formData = inject("formData");
const batchDetailList = inject("batchDetailList");

let batchIndex = -1;
const open = (index: number) => {
  dialogVisible.value = true,
  batchIndex = index;
  disableIds.value = []
  let interval = setInterval(()=>{
    if (detailTableRef.value) {
      clearInterval(interval);
      init();
    }
  },100)
}

const init = () => {
  let batchList = formData.value.batch
  detailTableRef.value.clearSelection();
  for (let index = 0; index < batchList.length; index++ ) {
    if (index == batchIndex) {
      for (let detail of batchList[index].detailList) {
        detailTableRef.value.toggleRowSelection(detail);
      }
    } else {
      batchList[index].detailList.forEach(item => disableIds.value.push(item.id))
    }
  }
}

const submitForm = () => {
  const data = detailTableRef.value.getSelectionRows();
  formData.value.batch[batchIndex].detailList = data;
  formData.value.batch[batchIndex].count = data.length;
  dialogVisible.value = false;
}

const selectable = (row: any) => {
  return row.status != 1 && row.status != 3 && row.status != 4 && !disableIds.value.some(item => item == row.id);
}

const rowClick = (row: any) => {
  if (selectable(row))
    detailTableRef.value.toggleRowSelection(row);
}

defineExpose({ open })
</script>

