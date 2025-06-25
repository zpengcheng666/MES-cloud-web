<template>
  <el-container class="root">
    <el-aside width="20%" class="left">
      <taskRunLeft @select-task="handleSelectTask" :stationData="stationData" ref="leftRef" />
    </el-aside>
    <el-aside width="57%" class="main">
      <el-container class="main-body">
        <el-header class="main-top" height="65%">
          <taskRunTop ref="topRef" @select-batch-detail="handleSelectBatchDetail" :startOrEnd="startOrEnd" @switch-start-or-end="switchStartOrEnd" />
        </el-header>
        <el-header class="main-bottom" height="35%">
          <taskRunBottom ref="bottomRef" :stepList="stepList" />
        </el-header>
      </el-container>
    </el-aside>
    <el-aside width="20%" class="right"> <taskRunRight ref="rightRef" /> </el-aside>
  </el-container>

  <taskRunSetInspectionScheme ref="taskRunSetInspectionSchemeRef" />
</template>

<script setup lang="ts">
import taskRunLeft from './taskRunLeft.vue';
import taskRunRight from './taskRunRight.vue';
import taskRunTop from './taskRunTop.vue';
import taskRunBottom from './taskRunBottom.vue';
//组件
const leftRef = ref();
const topRef = ref();
const rightRef = ref();
//组件Ref

import { TerminalApi } from '@/api/mcs/terminal';
const props = defineProps(['flushMainData']);
const userData: any = inject('userData'); //用户数据
const stationData: any = inject('stationData'); //工位数据
const mapData: any = inject('mapData'); //公共map
//公共

/************************************************初始化***********************************************/

async function init() {
  await flushNetData();
  await flushData();
}

let timeOutNumber;

onMounted(async () => {
  await init();
  timeOutNumber = setInterval(async () => {
    await init();
  }, 6000);
});

onBeforeUnmount(() => {
  clearInterval(timeOutNumber);
});

/**************************************************数据刷新********************************************/

const nowStatus = ref(0); //当前状态:0初始,1已选择任务,2已选择零件
const selectTask = ref<any>(undefined); //当前选择的任务,1
const selectMcsPlanProcess = ref<any>(undefined); //当前选择任务对应的工序信息(耗时),1
const selectMcsBatchDetail = ref<any>(undefined); //当前选择任务对应的详细任务(零件)数据,1
const selectBatchDetail = ref<any>(undefined); //已选择零件数据(来自selectMcsBatchDetail中),2
//数据

//通过网络刷新可刷新的数据
async function flushNetData() {
  console.log(selectTask.value);

  nowStatus.value = mapData.value.get('nowStatus', 0);
  selectTask.value = mapData.value.get('selectTask');

  if (nowStatus.value == 0 || nowStatus.value == undefined) {
    selectTask.value = undefined;
    mapData.value.set('selectTask', undefined);
    selectMcsPlanProcess.value = undefined;
    mapData.value.set('selectMcsPlanProcess', undefined);
    selectMcsBatchDetail.value = undefined;
    mapData.value.set('selectMcsBatchDetail', undefined);
    selectBatchDetail.value = undefined;
    mapData.value.set('selectBatchDetail', undefined);
  }

  if (nowStatus.value == 1) {
    await flushSelectMcsPlanProcessData();
    await flushSelectMcsBatchDetailData();
    selectBatchDetail.value = undefined;
    mapData.value.set('selectBatchDetail', undefined);
  }

  if (nowStatus.value == 2) {
    await flushSelectMcsPlanProcessData();
    await flushSelectMcsBatchDetailData();
    await flushSelectBatchDetailData();
  }
}

//刷新当前选择任务对应的工序信息(耗时),1
async function flushSelectMcsPlanProcessData() {
  selectTask.value = mapData.value.get('selectTask');
  if (selectTask?.value?.id == undefined) {
    selectMcsPlanProcess.value = undefined;
    mapData.value.set('selectMcsPlanProcess', undefined);
    return;
  }
  selectMcsPlanProcess.value = await TerminalApi.getProcessByRecordId(selectTask.value.id);
  mapData.value.set('selectMcsPlanProcess', selectMcsPlanProcess.value);
}
//刷新当前选择任务对应的详细任务(零件)数据,1
async function flushSelectMcsBatchDetailData() {
  selectTask.value = mapData.value.get('selectTask');
  if (selectTask?.value?.id == undefined) {
    selectMcsBatchDetail.value = undefined;
    mapData.value.set('selectMcsBatchDetail', undefined);
    return;
  }
  selectMcsBatchDetail.value = await TerminalApi.getBatchDetailByRecordId(selectTask.value.id);
  mapData.value.set('selectMcsBatchDetail', selectMcsBatchDetail.value);
}
//刷新已选择零件数据(来自selectMcsBatchDetail中),2
async function flushSelectBatchDetailData() {
  selectBatchDetail.value = mapData.value.get('selectBatchDetail', undefined);
  await flushSelectMcsBatchDetailData();
  if (selectBatchDetail?.value?.barCode == undefined || selectMcsBatchDetail?.value == undefined) {
    selectBatchDetail.value = undefined;
    mapData.value.set('selectBatchDetail', undefined);
    return;
  }
  selectMcsBatchDetail.value.forEach((v) => {
    if (v.barCode == selectBatchDetail.value.barCode) {
      selectBatchDetail.value = v;
    }
  });
  mapData.value.set('selectBatchDetail', selectBatchDetail.value);
}

//总体刷新数据(包括刷新子组件数据与上层组件数据)
async function flushData() {
  // debugger;
  await props.flushMainData();
  await flushDataImpl();
  await leftRef.value.flushData();
  await topRef.value.flushData();
  await rightRef.value.flushData();
}

//通过已刷新的数据构建数据
async function flushDataImpl() {
  if (nowStatus.value == 0 || nowStatus.value == undefined || nowStatus.value == null) return;

  flushBaseStepList();
  if (nowStatus.value == 2) {
    flushStepList();
  }
  //构建工步数据

  updateStartOrEndData();
  //初始化开工(true)完工显示
}

/***************************************************总体事件***********************************************/

//选择新生产任务
async function handleSelectTask(selectTaskV, selectMcsPlanProcessV) {
  selectTask.value = selectTaskV;
  mapData.value.set('selectTask', selectTaskV);
  selectMcsPlanProcess.value = selectMcsPlanProcessV;
  mapData.value.set('selectMcsPlanProcess', selectMcsPlanProcessV);
  await flushSelectMcsBatchDetailData();
  mapData.value.set('selectBatchDetail', undefined);

  nowStatus.value = 1;
  mapData.value.set('nowStatus', nowStatus.value);

  await flushNetData();
  await flushData();
}

//选择零件
async function handleSelectBatchDetail(selectBatchDetailV) {
  selectBatchDetail.value = selectBatchDetailV;
  mapData.value.set('selectBatchDetail', selectBatchDetail.value);

  nowStatus.value = 2;
  mapData.value.set('nowStatus', nowStatus.value);

  await flushNetData();
  await flushData();
}

/***************************************************工步相关*****************************************/

const stepList = ref<any[]>([]); //工步列表数据

//构建基础工步数据,1
function flushBaseStepList() {
  stepList.value = selectMcsPlanProcess.value.stepList.map((v) => {
    return {
      number: v.stepNum,
      name: v.stepName,
      key: v.stepProperty,
      time: v.processingTime,
      status: 0, //0绿色,1红色,2黄色,3灰色
      ...v
    };
  });
}

//在基础工步数据的基础上通过选择的零件更新工步数据,2
function flushStepList() {
  stepList.value.forEach((v, i) => {
    switch (getStepStatus(selectBatchDetail.value, v.id)) {
      case 0:
        {
          v.status = 2;
        }
        break;
      case 1:
        {
          v.status = 0;
        }
        break;
      case 2:
        {
          v.status = 3;
        }
        break;
      case 3:
        {
          v.status = 1;
        }
        break;
    }
  });
}

//获得指定零件的工步状态
//0未开始,1进行中,2已完成,3异常
function getStepStatus(batchDetail, stepId) {
  let start = false;
  let end = false;
  batchDetail.recordList.forEach((v) => {
    if (v.stepId == stepId && v.operationType == 1) start = true;
    if (v.stepId == stepId && v.operationType == 2) end = true;
  });
  if (start == false && end == false) return 0;
  else if (start && end == false) return 1;
  else if (start && end) return 2;
  else return 3;
}

/**********************************************开工/完工逻辑*******************************/

const startOrEnd = ref(true); //显示开工(true)还是完工

//初始化开工(true)完工显示,2
function updateStartOrEndData() {
  if (nowStatus.value != 2) {
    startOrEnd.value = true;
    return;
  }
  let status = getComponentStatus(selectBatchDetail.value, selectMcsPlanProcess.value.stepList)?.status;
  if (status == 5 || status == 6 || status == 3) {
    startOrEnd.value = false;
  } else {
    startOrEnd.value = true;
  }
}

//切换开工/完工事件
async function switchStartOrEnd() {
  if (nowStatus.value != 2) return;

  let status = getComponentStatus(selectBatchDetail.value, selectMcsPlanProcess.value.stepList);
  if (status?.status == 1) return;
  switch (status?.status) {
    case 0:
      {
        await batchRecor(true, selectTask.value, selectBatchDetail.value, status?.step); //任务开工
      }
      break;
    case 4:
      {
        await stepPlanEvent(1, selectTask.value, selectBatchDetail.value, status?.step); //工步开工
      }
      break;
    case 5:
      {
        await stepPlanEvent(2, selectTask.value, selectBatchDetail.value, status?.step); //工步完工
      }
      break;
    case 6:
    case 3:
      {
        await batchRecor(false, selectTask.value, selectBatchDetail.value, status?.step); //任务完工
        taskRunSetInspectionSchemeRef.value.open(selectMcsPlanProcess.value.id, selectTask.value.technologyId, {
          recordId: selectTask.value.id,
          barCode: selectBatchDetail.value.barCode,
          userId: userData.value.id
        }); //开启选择检验方案弹窗
        nowStatus.value = 1;
        mapData.value.set('nowStatus', nowStatus.value);
      }
      break;
  }

  await flushNetData();
  await flushData();
}

//获得零件的工步状态,2
/*
batchDetail:零件详细信息,stepList:工步列表

status:
  0未开始,给出第一个工步
  1已完成
  3加工中但没有工步(沒有工部)
  4给出未开始工步
  5给出进行中工步
  6给出进行中工步,是最后一个工步
*/
function getComponentStatus(batchDetail, stepList) {
  if (batchDetail.status == 5) {
    //已下发状态
    return { status: 0, step: stepList.length > 0 ? stepList[0] : undefined };
  }

  if (batchDetail.status == 1 || batchDetail.status == 4) {
    //已完成和报废状态
    return { status: 1 };
  }

  let step = stepList.find((v) => {
    let status = getStepStatus(batchDetail, v.id);
    if (status == 0 || status == 1) return true;
    return false;
  });
  //寻找第一个未开始和进行中的工步

  if (step == undefined || step == null) {
    //未找到,数据不一致,异常状态
    return { status: 3 };
  }

  let status = getStepStatus(batchDetail, step.id);
  //第一个未开始和进行中的工步的状态

  if (status == 0) {
    //未开始
    return { status: 4, step };
  } else if (status == 1) {
    //进行中
    if (stepList[stepList.length - 1].id != step.id) {
      return { status: 5, step };
    } else {
      return { status: 6, step };
    }
  }
}

/***********************************************开工/完工网络操作*************************************/

//任务开工/完工操作,task:任务,batchDetail:零件数据
async function batchRecor(startOrEnd, task, batchDetail, setp) {
  let data = {
    batchRecordId: task.id, //批次编码(任务ID)
    barCode: batchDetail.barCode, //零件物料条码
    deviceUnitId: stationData.value.id, //生产单元(产线/工位)编码
    operatorId: userData.value.id, //操作者

    batchDetailId: setp?.id == undefined ? undefined : batchDetail.id, //批次零件id
    deviceId: stationData.value.id, //设备id
    stepId: setp?.id, //工步id
    totality: 1 //数量
  };

  if (startOrEnd) {
    await TerminalApi.batchRecordStart(data);
  } else {
    await TerminalApi.batchRecordEnd(data);
  }
}

//工步开工/完工操作,type:类型,task:任务,batchDetail:零件数据,setp:工步数据
async function stepPlanEvent(type, task, batchDetail, setp) {
  let data = {
    batchRecordId: task.id, //批次工序任务id
    batchDetailId: batchDetail.id, //批次零件id
    deviceId: stationData.value.id, //设备id
    operationType: type, //操作类型  1开工 2完工
    operatorId: userData.value.id, //操作者

    stepId: setp.id, //工步id
    totality: 1 //数量
  };

  await TerminalApi.stepPlanEvent(data);
}

/************************************************说明********************************************/
/*

指示灯

绿色:已开工工步
黄色:待开工工步
红色:异常
灰色:完成/其他工步



map数据

nowStatus               当前状态:0初始,1已选择任务,2已选择零件
selectTask              当前选择的任务,1
selectMcsPlanProcess    当前选择任务对应的工序信息,1
selectMcsBatchDetail    当前选择任务对应的详细任务(零件)数据,1
selectBatchDetail       已选择零件数据(来自selectMcsBatchDetail中),2



零件status

int MCS_ORDER_DETAIL_NEW = 0;//新建(看不见)
int MCS_ORDER_DETAIL_RESCINDED = 2;//已撤销(看不见)

int MCS_BATCH_DETAIL_ISSUED = 5;//已下发
int MCS_ORDER_DETAIL_ONGOING = 3;//加工中
int MCS_ORDER_DETAIL_COMPLETED = 1;//已完成
int MCS_ORDER_DETAIL_SCRAP = 4;//报废

*/

/*****************************************选择检验方案弹窗***********************/
import taskRunSetInspectionScheme from './taskRunSetInspectionScheme.vue';
import { debug } from 'console';

const taskRunSetInspectionSchemeRef = ref();
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskRun.scss');
</style>
