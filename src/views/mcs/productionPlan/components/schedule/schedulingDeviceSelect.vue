<template>
  <Dialog title="选择设备" v-model="dialogVisible">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="设备/工位" align="center" prop="type">
        <template #default="scope">
          <dict-tag type="dms_ledger_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="'dms_device_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="运行状态" align="center" prop="runStatus">
        <template #default="scope">
          <dict-tag type="dms_device_status_run" :value="scope.row.runStatus" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button :disabled="loading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {inject, ref} from "vue";
import {OrderFormApi} from "@/api/mcs/orderform";

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const currentOrderId = ref('');
const currentProcessId = ref('');

const tableRef = ref();
const open = async (orderId: string, processId: string) => {
  if (!sharedInfo.planSelectDevice[orderId]) sharedInfo.planSelectDevice[orderId] = {}
  if (!sharedInfo.planSelectDevice[orderId][processId]) sharedInfo.planSelectDevice[orderId][processId] = [];
  dialogVisible.value = true
  currentOrderId.value = orderId;
  currentProcessId.value = processId;
  const data = {orderId, processId}
  list.value = await OrderFormApi.getLedgersByOrderAndProcess(data);
  tableRef.value.clearSelection();
  setTimeout(() => {
    for (let device of sharedInfo.planSelectDevice[orderId][processId]) {
      let row = list.value.find(item => item.id == device.id);
      tableRef.value.toggleRowSelection(row, true);
    }
  }, 100)

}
sharedInfo.deviceSelectOpen = open

const submitForm = async () => {
  sharedInfo.planSelectDevice[currentOrderId.value][currentProcessId.value] = tableRef.value.getSelectionRows()
  dialogVisible.value = false
}

</script>

<style scoped>

</style>
