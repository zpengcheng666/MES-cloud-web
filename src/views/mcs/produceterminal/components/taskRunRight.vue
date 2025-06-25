<template>
  <div class="root">
    <div class="body">
      <el-row justify="center" align="middle" class="head">
        <el-col :span="24">资源</el-col>
      </el-row>
      <div class="main">
        <el-scrollbar height="100%">
          <div class="block-all" v-for="(v, i) in resource" :key="i">
            <div class="block" :class="[nowSelect == v.id ? 'resourceBlockActivity' : 'resourceBlock']" @click="handleBlockClick(v.id)">
              <el-row justify="space-between" align="middle" class="row">
                <el-col :span="12" style="height: 100%">
                  <el-space style="height: 100%">
                    <el-image fit="contain" :src="getIcon(v.icon)" style="height: 4vh" />
                    <span :span="16" class="text">{{ v.name }}</span>
                  </el-space>
                </el-col>
                <el-col :span="10" style="height: 100%">
                  <el-space style="height: 100%">
                    <el-image fit="contain" :src="getStatus(v.status)?.light" style="height: 1vh" />
                    <apan class="text">{{ getStatus(v.status)?.name }}</apan>
                  </el-space>
                </el-col>
              </el-row>
            </div>
            <div v-if="nowSelect == v.id">
              <div class="block-list" v-for="(cv, ci) in v.child" :key="ci" @click="handleClickItem(v.id, ci)">
                <div class="text">
                  {{ cv.label }}
                </div>
              </div>
              <div class="block-list" v-if="nowSelect == 1">
                <div class="text">
                  自动/手动选择：
                  <el-switch
                    v-model="resource[1].child[0].onlineStatus"
                    inline-prompt
                    active-text="自动"
                    :active-value="0"
                    inactive-text="手动"
                    :inactive-value="1"
                    @change="handelDeviceOnlineStatus"
                  />
                </div>
              </div>
              <div class="block-list" v-if="nowSelect == 1">
                <div class="text">
                  是否需要配送料选择：
                  <el-switch
                    v-model="resource[1].child[0].needMaterials"
                    inline-prompt
                    active-text="需料"
                    inactive-text="不需料"
                    @change="handelDeviceNeedMaterials"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <terminalDistributionApplicationPreForm ref="terminalDistributionApplicationPreFormRef" @success="handelTerminalDistributionApplicationPreFormsucess" />
    <DistributionApplicationForm ref="DistributionApplicationFormRef" />
    <terminalBatchOrderDemandForm ref="terminalBatchOrderDemandFormRef" />
  </div>
</template>

<script setup lang="ts">
import { TerminalApi } from '@/api/mcs/terminal';
import { inject } from 'vue';
//引入

const stationData: any = inject('stationData');
const mapData: any = inject('mapData');
//公共

/********************************************刷新数据*********************************/

const nowStatus = ref(0); //当前状态:0初始,1已选择任务,2已选择零件
const selectTask = ref<any>(undefined); //当前选择的任务,1
const selectMcsPlanProcess = ref<any>(undefined); //当前选择任务对应的工序信息(耗时),1
const selectMcsBatchDetail = ref<any>(undefined); //当前选择任务对应的详细任务(零件)数据,1
const selectBatchDetail = ref<any>(undefined); //已选择零件数据(来自selectMcsBatchDetail中),2
//数据

//刷新数据
async function flushData() {
  nowStatus.value = mapData.value.get('nowStatus', 0);
  selectTask.value = mapData.value.get('selectTask');
  selectMcsPlanProcess.value = mapData.value.get('selectMcsPlanProcess');
  selectMcsBatchDetail.value = mapData.value.get('selectMcsBatchDetail');
  selectBatchDetail.value = mapData.value.get('selectBatchDetail');

  readdResourceData(); //重置资源

  setDeviceStatus(); //设置设备状态

  resource.value[1].child = [{ label: stationData.value?.name, ...stationData.value }];
  //设置设备
  resource.value[5].child = [{ label: '出库申请' }, { label: '备料申请' }];
  //添加申请资源内容

  if (nowStatus.value == undefined || nowStatus.value == 0) return;

  if (nowStatus.value == 2) {
    let step = getFirstStep(selectBatchDetail.value, selectMcsPlanProcess.value.stepList);
    if (step != null) {
      step.ncList.forEach((v) => {
        addNcData(v);
      });
    }
  }
  //设置数控程序

  const resourceType = getResourceTypeList();
  //资源类型

  selectTask.value.resourceList?.forEach((v) => {
    if (v.resourceType == 5) {
      //刀具
      if (resourceType?.some((v2) => v2.resourcesType == 2 && v2.resourcesTypeId == v.materialConfigId)) {
        resource.value[0].child.push({
          label: v.materialNumber,
          ...v
        });
      }
    } else if (v.resourceType == 3) {
      //工装
      if (resourceType?.some((v2) => v2.resourcesType == 3 && v2.resourcesTypeId == v.materialConfigId)) {
        resource.value[2].child.push({
          label: v.materialNumber,
          ...v
        });
      }
    } else if (v.resourceType == 1) {
      //零件（物料）
      resource.value[3].child.push({
        label: v.barCode,
        ...v
      });
    }
  });
  //根据资源类型，设置刀具、工装、物料

  let workstationMaterials = await LedgerApi.getLedgerToLocationList(stationData.value.id);
  workstationMaterials = await Promise.all(
    workstationMaterials.map(async (v) => {
      return await TerminalApi.getMaterialStockListByLocationId(v.location);
    })
  );
  workstationMaterials = workstationMaterials.flat();
  //获得工位物料数据
  setStatus(workstationMaterials);
  //设置状态
}
defineExpose({ flushData });

/***********************************************添加资源函数*************************************/

//重置资源函数
function readdResourceData() {
  resource.value.forEach((v) => {
    v.child = [];
  });
}

//获得资源类型函数
function getResourceTypeList() {
  if (nowStatus.value == undefined || nowStatus.value == 0) return null;

  let resourceType: any[] = [];

  selectMcsPlanProcess.value.resourceList.forEach((v) => {
    resourceType.push(v);
  });

  if (nowStatus.value == 2) {
    let step = getFirstStep(selectBatchDetail.value, selectMcsPlanProcess.value.stepList);
    if (step != null) {
      step.resourceList.forEach((v) => {
        resourceType.push(v);
      });
    }
  }

  return resourceType;
}

//将数控程序数据添加到显示数据中
function addNcData(value) {
  if (value == undefined || value == null) return;
  resource.value[4].child.push({
    label: value.ncName,
    ...value
  });
}

/*******************************************************设置状态函数**********************************/

//设置设备状态
function setDeviceStatus() {
  switch (stationData.value.runStatus) {
    case 0:
      {
        resource.value[1].status = 4;
        //加工中->加工中
      }
      break;
    case 1:
      {
        resource.value[1].status = 5;
        //空闲->空闲
      }
      break;
    case 2:
      {
        resource.value[1].status = 6;
        //停机->停机
      }
      break;
    case 3:
      {
        resource.value[1].status = 7;
        //暂停->暂停
      }
      break;
    case 4:
      {
        resource.value[1].status = 8;
        //急停->急停
      }
      break;
    case 5:
      {
        resource.value[1].status = 9;
        //报警->报警
      }
      break;
  }
}

//设置刀具、工装、物料状态
function setStatus(workstationMaterials) {
  let kniveStatus = resource.value[0].child.every((v) => workstationMaterials.some((v2) => v2.id == v.materialUid));
  resource.value[0].status = kniveStatus ? 0 : 3;
  //刀具状态

  let toolingStatus = resource.value[2].child.every((v) => workstationMaterials.some((v2) => v2.id == v.materialUid));
  resource.value[2].status = toolingStatus ? 0 : 3;
  //工装状态

  let materialsStatus = resource.value[3].child.some((v) => workstationMaterials.some((v2) => v2.id == v.materialUid));
  resource.value[3].status = materialsStatus ? 0 : 3;
  //物料状态
}

/****************************************************工具函数***********************************/

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

//获得第一个未开始的工步状态,2
/*
batchDetail:零件详细信息,stepList:工步列表
return:工步,null
*/
function getFirstStep(batchDetail, stepList) {
  if (batchDetail.status == 5) {
    //已下发状态
    return stepList.length > 0 ? stepList[0] : undefined;
  }

  if (batchDetail.status == 1 || batchDetail.status == 4) {
    //已完成和报废状态
    return null;
  }

  let step = stepList.find((v) => {
    let status = getStepStatus(batchDetail, v.id);
    if (status == 0) return true;
    return false;
  });
  //寻找第一个未开始的工步

  if (step == undefined || step == null) {
    return null;
  }

  return step;
}

/**********************************************选择/按钮逻辑************************************************/

const nowSelect = ref(undefined); //当前选择的id

//选择函数
function handleBlockClick(id) {
  if (nowSelect.value == id) {
    nowSelect.value = undefined;
  } else {
    nowSelect.value = id;
  }
}

import terminalDistributionApplicationPreForm from '../otherComponents/terminalDistributionApplicationPreForm.vue';
const terminalDistributionApplicationPreFormRef = ref();
import DistributionApplicationForm from '../../distributionapplication/DistributionApplicationForm.vue';
const DistributionApplicationFormRef = ref();
import terminalBatchOrderDemandForm from '../otherComponents/terminalBatchOrderDemandForm.vue';
const terminalBatchOrderDemandFormRef = ref();
//点击具体item
function handleClickItem(listId, itemId) {
  if (listId == 5 && itemId == 0) {
    //出库申请
    terminalDistributionApplicationPreFormRef.value.open(stationData.value);
  } else if (listId == 5 && itemId == 1) {
    //备料申请
    terminalBatchOrderDemandFormRef.value.open(stationData.value);
  }
}
function handelTerminalDistributionApplicationPreFormsucess(data) {
  DistributionApplicationFormRef.value.open(data);
}

/***********************************************设备状态*************************************/

function handelDeviceOnlineStatus(x) {
  LedgerApi.updateLedger({
    id: resource.value[1].child[0].id,
    onlineStatus: x,
    lintStationGroup: resource.value[1].child[0].lintStationGroup
  } as any);
}

function handelDeviceNeedMaterials(x) {
  LedgerApi.updateLedger({
    id: resource.value[1].child[0].id,
    needMaterials: x,
    lintStationGroup: resource.value[1].child[0].lintStationGroup
  } as any);
}

/**************************************************数据***********************************************/

//显示数据本身
const resource = ref<any>([
  {
    id: 0, //id
    icon: 0, //图标
    name: '刀具', //图标名
    status: 0, //状态
    child: [] //子数据
  },
  {
    id: 1,
    icon: 1,
    name: '设备',
    status: 0,
    child: []
  },
  {
    id: 2,
    icon: 2,
    name: '工装',
    status: 0,
    child: []
  },
  {
    id: 3,
    icon: 3,
    name: '物料',
    status: 0,
    child: []
  },
  {
    id: 4,
    icon: 4,
    name: '数控程序',
    status: 0,
    child: []
  },
  {
    id: 5,
    icon: 3,
    name: '申请资源',
    status: 0,
    child: []
  }
]);

/*************************************************图标************************************/

import taskRunKnifeIcon from '@/assets/produceterminal/images/taskRunKnifeIcon.png'; //刀具
import taskRunDeviceIcon from '@/assets/produceterminal/images/taskRunDeviceIcon.png'; //设备
import taskRunWorkwearIcon from '@/assets/produceterminal/images/taskRunWorkwearIcon.png'; //工装
import taskRunMaterialIcon from '@/assets/produceterminal/images/taskRunMaterialIcon.png'; //物料
import taskRunControlProgramIcon from '@/assets/produceterminal/images/taskRunControlProgramIcon.png'; //数控程序

//获得图标
function getIcon(id) {
  switch (id) {
    case 0:
      return taskRunKnifeIcon; //刀具
      break;
    case 1:
      return taskRunDeviceIcon; //设备
      break;
    case 2:
      return taskRunWorkwearIcon; //工装
      break;
    case 3:
      return taskRunMaterialIcon; //物料
      break;
    case 4:
      return taskRunControlProgramIcon; //数控程序
      break;
  }
}

/**********************************************指示灯/状态*********************************************/

import lightGreen from '@/assets/produceterminal/images/lightGreen.png'; //绿
import lightRed from '@/assets/produceterminal/images/lightRed.png'; //红
import lightYellow from '@/assets/produceterminal/images/lightYellow.png'; //黄
import lightGrizzly from '@/assets/produceterminal/images/lightGrizzly.png'; //蓝
import { LedgerApi } from '@/api/dms/ledger';

//获得状态与对应指示灯
function getStatus(id) {
  switch (id) {
    case 0:
      return { name: '已就绪', light: lightGreen };
      break;
    case 1:
      return { name: '故障中', light: lightRed };
      break;
    case 2:
      return { name: '未就绪', light: lightGrizzly };
      break;
    case 3:
      return { name: '待就绪', light: lightYellow };
      break;
    /***********设备相关***************/
    case 4:
      return { name: '加工中', light: lightGreen };
    case 5:
      return { name: '空闲', light: lightGreen };
    case 6:
      return { name: '停机', light: lightGrizzly };
    case 7:
      return { name: '暂停', light: lightYellow };
    case 8:
      return { name: '急停', light: lightRed };
    case 9:
      return { name: '报警', light: lightRed };
  }
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskRunRight.scss');
</style>
