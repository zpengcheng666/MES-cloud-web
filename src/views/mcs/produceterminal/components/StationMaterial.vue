<template>
  <el-container :gutter="20" class="material-container" fit="contain">
    <el-header class="material-header">
      <el-row type="flex" justify="center">
        <div class="scanText">工位物料信息</div>
      </el-row>
    </el-header>
    <el-main class="material-main">
      <el-table
        :data="listData"
        class="material-table"
        max-height="55vh"
        :header-cell-style="{
          borderBottom: '0.3vh solid rgba(37,249,254,1)',
          background: '#03375F',
          color: '#ffffff'
        }"
        :cell-style="{ borderBottom: '0.3vh solid rgb(37,249,254,1)' }"
      >
        <el-table-column label="物料编号" align="center" prop="materialNumber" />
        <el-table-column label="类型" align="center" width="150px">
          <template #default="scope">
            {{ scope.row.type.materialName }}
          </template>
        </el-table-column>
        <el-table-column label="物料条码" align="center" prop="barCode" />
        <el-table-column label="物料批次号" align="center" prop="batchNumber" />
        <el-table-column label="数量" align="center" prop="totality" width="60px" />
        <el-table-column label="生产任务号" align="center" prop="123">
          <template #default="scope">
            {{ taskMap?.[scope.row.id]?.number }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" align="center" prop="status" /> -->
        <el-table-column label="操作" align="center" min-width="70px">
          <template #default="scope">
            <el-image fit="contain" class="img" :src="printBarcodeBtn" @click="handlePrintBarcode(scope.row)" />
            <!-- <el-image fit="contain" class="img" :src="transferBtn" @click="transfer(scope.row)" /> -->
            <el-image fit="contain" class="img" :src="registerBtn" @click="putInStorage(scope.row)" v-if="taskMap?.[scope.row.id] == null" />
            <el-image fit="contain" class="img" :src="examineBtn" @click="generateInspectionOrder(scope.row)" v-if="taskMap?.[scope.row.id]" />
          </template>
        </el-table-column>
        <el-table-column label="" min-width="40px">
          <template #default="scope">
            <span v-if="readyForCarry[scope.row.barCode] != null" style="color: #e6a23c">{{readyForCarry[scope.row.barCode]?'托盘已到达':'托盘配送中' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

  <taskRunSetInspectionScheme ref="taskRunSetInspectionSchemeRef" />
</template>
<script setup lang="ts">
import { onMounted, inject } from 'vue';
import printBarcodeBtn from '@/assets/produceterminal/images/printBarcodeBtn.png'; //打印条码
import transferBtn from '@/assets/produceterminal/images/transferBtn.png'; //移交
import registerBtn from '@/assets/produceterminal/images/registerBtn.png'; //录入库
import examineBtn from '@/assets/produceterminal/images/examineBtn.png'; //检验
//图片

import { TerminalApi } from '@/api/mcs/terminal';
import { LedgerApi } from '@/api/dms/ledger';
defineOptions({ name: 'StationMaterial' });
const props = defineProps(['stationData']);
//公共

const message = useMessage(); // 消息弹窗

const listData = ref<any[]>([]); //数据列表
const taskMap = ref(); //生产任务Map

const readyForCarry = ref<any>({})

onMounted(async () => {
  await getData();
});

async function getData() {
  let locationList = (await LedgerApi.getLedgerToLocationList(props.stationData.id)).filter((v) => v.type == 0);
  listData.value = await Promise.all(
    locationList.map(async (v) => {
      return await TerminalApi.getMaterialStockListByLocationId(v.location);
    })
  );
  listData.value = listData.value.flat();

  const ids = listData.value.map((v) => v.id);
  if (ids.length == 0) {
    taskMap.value = new Map();
    return;
  }
  taskMap.value = await TerminalApi.getCurrentPlanByMaterialIds(ids);
  const barCodes = listData.value.map((v) => v.barCode);
  getMaterialCarryReadyStatus(barCodes);
}

/*******************************操作*********************/

import { ElNotification } from 'element-plus';

//入库
async function putInStorage(data) {
  let netData = {
    materialUid: data.id, //物料id
    materialConfigId: data.materialConfigId, //物料类型id
    materialNumber: data.materialNumber, //物料编号
    barCode: data.barCode, //物料条码
    batchNumber: data.batchNumber, //物料批次号
    resourceType: undefined, //资源类型
    materialManage: undefined, //物料管理模式，1：单件，2：批量
    totality: data.totality //总库存
  };
  await TerminalApi.putInStorage(props.stationData.id, [netData]);
  // message.success('录入库申请已提交:' + data.barCode)
  ElNotification({
    title: '成功',
    message: '录入库申请已提交:' + data.barCode,
    type: 'success'
  });
  await getData();
}

//移交
async function transfer(data) {
  let netData = {
    materialUid: data.id, //物料id
    materialConfigId: data.materialConfigId, //物料类型id
    materialNumber: data.materialNumber, //物料编号
    barCode: data.barCode, //物料条码
    batchNumber: data.batchNumber, //物料批次号
    resourceType: undefined, //资源类型
    materialManage: undefined, //物料管理模式，1：单件，2：批量
    totality: data.totality //总库存
  };

  await TerminalApi.transfer(props.stationData.id, [netData]);
  // message.success('移库申请已提交:' + data.barCode)
  ElNotification({
    title: '成功',
    message: '移库申请已提交:' + data.barCode,
    type: 'success'
  });
  await getData();
}

async function getMaterialCarryReadyStatus(list) {
  readyForCarry.value = await TerminalApi.getMaterialCarryReadyStatus(list)
}

//打印条码
async function handlePrintBarcode(row) {
  console.log(row);
}

import taskRunSetInspectionScheme from './taskRunSetInspectionScheme.vue';
const userData: any = inject('userData'); //用户数据
const taskRunSetInspectionSchemeRef = ref();
//生成检验单
async function generateInspectionOrder(row) {
  let task = taskMap.value?.[row.id];

  if (task != undefined && task != null) {
    let selectMcsPlanProcess = await TerminalApi.getProcessByRecordId(task.id);
    taskRunSetInspectionSchemeRef.value.open(selectMcsPlanProcess.id, task.technologyId, {
      recordId: task.id,
      barCode: row.barCode,
      userId: userData.value.id
    });
  }
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/stationMaterial.scss');
</style>
