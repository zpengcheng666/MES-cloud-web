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
        <el-table-column label="类型" align="center" >
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
        <el-table-column label="操作" align="center" min-width="70px">
          <template #default="scope">
            <el-image fit="contain" class="img" :src="printBarcodeBtn" @click="handlePrintBarcode(scope.row)" />
            <el-image fit="contain" class="img" :src="registerBtn" @click="putInStorage(scope.row)" v-if="!taskMap?.[scope.row.id]" />
          </template>
        </el-table-column>
        <el-table-column label="" min-width="40px">
          <template #default="scope">
            <span v-if="readyForCarry[scope.row.barCode]" style="color: #e6a23c">{{ readyForCarry[scope.row.barCode] ? '托盘已到达' : '托盘配送中' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>

</template>
<script setup lang="ts">
import { onMounted, inject } from 'vue';
import printBarcodeBtn from '@/assets/produceterminal/images/printBarcodeBtn.png'; //打印条码
import registerBtn from '@/assets/produceterminal/images/registerBtn.png'; //录入库
import { TerminalApi } from '@/api/mcs/terminal';
import { QmsTerminalApi } from '@/api/qms/terminal';
defineOptions({ name: 'StationMaterial' });
const props = defineProps(['stationData']);
//公共

const message = useMessage(); // 消息弹窗

const listData = ref<any[]>([]); //数据列表
const taskMap = ref(); //生产任务Map

const readyForCarry = reactive<any>({});

onMounted(async () => {
  await getData();
});

async function getData() {
  listData.value = await TerminalApi.getMaterialStockListByLocationId('1844915931329081346');

  const ids = listData.value.map((v) => v.id);
  if (ids.length == 0) {
    taskMap.value = new Map();
    return;
  }
  taskMap.value = await TerminalApi.getCurrentPlanByMaterialIds(ids);

  const barCodes = listData.value.map((v) => v.barCode);
  await getMaterialCarryReadyStatus(barCodes);
}

import { ElNotification } from 'element-plus';
//入库
async function putInStorage(data) {
  const orderData = {
    materialUid: data.id, //物料id
    materialConfigId: data.materialConfigId, //物料类型id
    materialNumber: data.materialNumber, //物料编号
    barCode: data.barCode, //物料条码
    batchNumber: data.batchNumber, //物料批次号
    totality: data.totality //总库存
  }
  await QmsTerminalApi.putInStorage(orderData);
  ElNotification({
    title: '成功',
    message: '录入库申请已提交:' + data.barCode,
    type: 'success'
  });
  await getData();
}


async function getMaterialCarryReadyStatus(list) {
  readyForCarry.value = TerminalApi.getMaterialCarryReadyStatus(list);
}

//打印条码
async function handlePrintBarcode(row) {
  console.log(row);
}

const userData: any = inject('userData'); //用户数据
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/stationMaterial.scss');
</style>
