<template>
  <el-container class="root">
    <el-aside width="16vw" class="left">
      <div class="text">零件信息</div>
      <table>
        <tr>
          <td class="key">零件图号：</td>
          <td class="value">{{ selectTask?.partNumber }}</td>
        </tr>
        <tr>
          <td class="key">零件名称：</td>
          <td class="value">{{ selectMcsPlanProcess?.part?.partName }}</td>
        </tr>
        <tr>
          <td class="key">零件版次：</td>
          <td class="value">{{ selectMcsPlanProcess?.part?.partVersion }}</td>
        </tr>
        <tr>
          <td class="key">材料类码：</td>
          <td class="value">{{ selectMcsPlanProcess?.part?.materialCode }}</td>
        </tr>
        <tr>
          <td class="key">材料名称：</td>
          <td class="value">{{ selectMcsPlanProcess?.part?.materialName }}</td>
        </tr>
        <tr>
          <td class="key">材料规格：</td>
          <td class="value">{{ selectMcsPlanProcess?.part?.materialSpecification }}</td>
        </tr>

        <tr v-if="selectBatchDetail != undefined">
          <td class="key">任务编号：</td>
          <td class="value">{{ selectBatchDetail.orderDetailNumber }}</td>
        </tr>
        <tr v-if="selectBatchDetail != undefined">
          <td class="key">物料条码：</td>
          <td class="value">{{ selectBatchDetail.barCode }}</td>
        </tr>
        <tr v-if="selectBatchDetail != undefined">
          <td class="key">批次编号：</td>
          <td class="value">{{ selectBatchDetail.partBatchNumber }}</td>
        </tr>
      </table>
      <div class="detail" @click="handleSelectBatchDetail" v-if="selectBatchDetail == undefined">
        选择零件
      </div>
    </el-aside>

    <el-main class="main">
      <div class="status block-center">
        <el-image
          fit="contain"
          :src="nowStatus.light"
          style="height: 1.5vh"
          v-if="nowStatus.light != undefined"
        />
        <div class="text">{{ nowStatus.label }}</div>
      </div>
      <div class="title">
        {{ selectTask?.number == undefined ? '空' : selectTask?.number }}
      </div>
      <div class="startAndStop block-justify">
        <el-image
          fit="contain"
          class="img"
          :src="taskRunTopStart"
          style="height: 4.5vh"
          @click="switchStartOrEnd"
          v-show="props.startOrEnd == true"
        />
        <el-image
          fit="contain"
          class="img"
          :src="taskRunTopEnd"
          style="height: 4.5vh"
          @click="switchStartOrEnd"
          v-show="props.startOrEnd == false"
        />
        <el-image
          fit="contain"
          class="img"
          :src="taskRunTopStop"
          style="height: 5vh"
          @click="handlePauseOrStart"
          v-show="pauseOrStart"
        />
        <el-image
          fit="contain"
          class="img"
          :src="taskRunTopRecover"
          style="height: 5vh"
          @click="handlePauseOrStart"
          v-show="!pauseOrStart"
        />
      </div>
    </el-main>

    <el-aside width="16.8vw" class="right">
      <div class="text">工序信息</div>
      <table>
        <tr>
          <td class="key">工序序号：</td>
          <td class="value">{{ selectMcsPlanProcess?.procedureNum }}</td>
        </tr>
        <tr>
          <td class="key">工序名称：</td>
          <td class="value">{{ selectMcsPlanProcess?.procedureName }}</td>
        </tr>
        <tr>
          <td class="key">是否检验：</td>
          <td class="value">
            {{
              selectMcsPlanProcess?.isInspect == 1
                ? '是'
                : selectMcsPlanProcess?.isInspect == 0
                  ? '否'
                  : ''
            }}
          </td>
        </tr>
        <tr>
          <td class="key">关键属性：</td>
          <td class="value">
            {{
              selectMcsPlanProcess?.procedureProperty == 1
                ? '是'
                : selectMcsPlanProcess?.procedureProperty == 0
                  ? '否'
                  : ''
            }}
          </td>
        </tr>
        <tr>
          <td class="key">准备工时：</td>
          <td class="value">{{ selectMcsPlanProcess?.preparationTime }}</td>
        </tr>
        <tr>
          <td class="key">加工工时：</td>
          <td class="value">{{ selectMcsPlanProcess?.processingTime }}</td>
        </tr>
      </table>
      <div class="detail" @click="detailDialog = true">详情</div>
    </el-aside>
  </el-container>

  <el-dialog class="taskRunTopDialog" v-model="detailDialog" width="600">
    <div class="text">工序详情</div>
    <table>
      <tr>
        <td class="key">工序序号：</td>
        <td class="value">{{ selectMcsPlanProcess?.procedureNum }}</td>
      </tr>
      <tr>
        <td class="key">工序名称：</td>
        <td class="value">{{ selectMcsPlanProcess?.procedureName }}</td>
      </tr>
      <tr>
        <td class="key">是否检验：</td>
        <td class="value">
          {{
            selectMcsPlanProcess?.isInspect == 1
              ? '是'
              : selectMcsPlanProcess?.isInspect == 0
                ? '否'
                : ''
          }}
        </td>
      </tr>
      <tr>
        <td class="key">关键属性：</td>
        <td class="value">
          {{
            selectMcsPlanProcess?.procedureProperty == 1
              ? '是'
              : selectMcsPlanProcess?.procedureProperty == 0
                ? '否'
                : ''
          }}
        </td>
      </tr>
      <tr>
        <td class="key">准备工时：</td>
        <td class="value">{{ selectMcsPlanProcess?.preparationTime }}</td>
      </tr>
      <tr>
        <td class="key">加工工时：</td>
        <td class="value">{{ selectMcsPlanProcess?.processingTime }}</td>
      </tr>
      <tr>
        <td class="key">工艺类型：</td>
        <td class="value">
          {{
            getIntDictOptions('pdm_process_type').find(
              (v) => v.value == selectMcsPlanProcess?.processType
            )?.label
          }}
        </td>
      </tr>
      <tr>
        <td class="key">工作说明：</td>
        <td class="value">{{ selectMcsPlanProcess?.description }}</td>
      </tr>
    </table>
  </el-dialog>

  <!-- 选择零件弹窗 -->
  <el-dialog class="taskRunTopStartDialog" v-model="startDialog" width="500">
    <el-form :model="partData" label-width="auto" class="form">
      <el-form-item label="物料条码" prop="barCode">
        <el-input v-model="partData.barCode" placeholder="请输入物料条码" />
      </el-form-item>
      <!-- <el-form-item label="物料批次码" prop="partBatchNumber">
        <el-input v-model="partData.partBatchNumber" placeholder="请输入物料批次码" />
      </el-form-item> -->
      <div style="color: rgb(160, 241, 243)">{{ selectBatchDetailInfo }}</div>
    </el-form>
    <template #footer>
      <div class="confirmBtn">
        <el-image class="btn" :src="confirmBtn" @click="handleStartDialogClick" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import lightGreen from '@/assets/produceterminal/images/lightGreen.png'
import lightRed from '@/assets/produceterminal/images/lightRed.png'
import lightYellow from '@/assets/produceterminal/images/lightYellow.png'
import lightGrizzly from '@/assets/produceterminal/images/lightGrizzly.png'
//指示灯图片
import taskRunTopStart from '@/assets/produceterminal/images/taskRunTopStart.png' //开工
import taskRunTopEnd from '@/assets/produceterminal/images/taskRunTopEnd.png' //完工
import taskRunTopStop from '@/assets/produceterminal/images/taskRunTopStop.png' //暂停
import taskRunTopRecover from '@/assets/produceterminal/images/taskRunTopRecover.png' //恢复
//文字图片
import confirmBtn from '@/assets/produceterminal/images/confirmBtn.png'
//确认按钮图片

import { getIntDictOptions } from '@/utils/dict'
import { inject } from 'vue'
import { TerminalApi } from '@/api/mcs/terminal'
//公共

const emit = defineEmits(['selectBatchDetail', 'switchStartOrEnd'])
const props = defineProps(['startOrEnd'])
const detailDialog = ref(false) //详细信息弹窗是否显示
const userData: any = inject('userData') //用户数据
const stationData: any = inject('stationData') //工位数据
const mapData: any = inject('mapData')
//总体

/************************数据刷新****************************/

const selectTask = ref() //当前选择的任务
const selectMcsPlanProcess = ref() //当前选择任务对应的工序信息
const selectMcsBatchDetail = ref() //详细任务(零件)数据

async function flushData() {
  setStatusByStationData()
  await flushPauseOrStart()

  let status = mapData.value.get('nowStatus')
  if (status == undefined || status == 0) return
  selectTask.value = mapData.value.get('selectTask')
  selectMcsPlanProcess.value = mapData.value.get('selectMcsPlanProcess')
  selectMcsBatchDetail.value = mapData.value.get('selectMcsBatchDetail')

  selectBatchDetail.value = mapData.value.get('selectBatchDetail', undefined)
  selectBatchDetailInfo.value = ''
}
defineExpose({ flushData })

/*************************选择零件***************************/

const startDialog = ref(false) //是否开启选择零件弹窗
const partData = ref({
  barCode: undefined //物料条码
})
//已选择零件数据
const selectBatchDetail = ref() //已选择零件数据
const selectBatchDetailInfo = ref('') //警告信息

//选择零件按钮
function handleSelectBatchDetail() {
  startDialog.value = true
  selectBatchDetailInfo.value = ''
}

//选择零件确认按钮
async function handleStartDialogClick() {
  if (selectMcsBatchDetail.value == undefined) {
    //零件信息为空
    startDialog.value = false
    return
  }
  if (
    partData.value.barCode == undefined ||
    partData.value.barCode == null ||
    partData.value.barCode == ''
  ) {
    //条码为空
    selectBatchDetailInfo.value = '条码为空，请重新输入'
    return
  }

  let batchDetail = selectMcsBatchDetail.value.find((v) => v.barCode == partData.value.barCode)
  //从零件列表获得对应零件数据
  if (batchDetail != undefined && batchDetail != null) {
    //零件列表中存在对应数据

    if (batchDetail.status == 1 || batchDetail.status == 4) {
      selectBatchDetailInfo.value = '零件已完成,请重新选择'
      return
    }
    emit('selectBatchDetail', batchDetail)

    startDialog.value = false
    partData.value = {
      barCode: undefined //物料条码
    }
    flushData()
    return
  }

  let resource = selectTask.value.resourceList.find((v) => v.barCode == partData.value.barCode)
  if (resource == undefined || resource == null) {
    selectBatchDetailInfo.value = '条码不存在，请重新输入'
    return
  }
  //查找条码数据是否有效

  batchDetail = selectMcsBatchDetail.value.find((v) => v.barCode == null)
  if (batchDetail == undefined || batchDetail == null) {
    selectBatchDetailInfo.value = '无可用零件'
    return
  }
  batchDetail.barCode = partData.value.barCode
  emit('selectBatchDetail', batchDetail)
  startDialog.value = false
  partData.value = {
    barCode: undefined //物料条码
  }
  flushData()
  //选取一个空条码零件
}

/**************************开工/完工*******************/

function switchStartOrEnd() {
  emit('switchStartOrEnd')
}

/***************************暂停/开始*******************/

const pauseOrStart = ref(true) //目前状态:暂停/开始

//刷新数据
async function flushPauseOrStart() {
  let data = await TerminalApi.getWorkstationPause(stationData.value.id)
  pauseOrStart.value = !data
}

//获得请求数据
function setPauseOrStartData(type) {
  let selectBatchDetail = mapData.value.get('selectBatchDetail', undefined)
  let batchDetailId
  if (selectBatchDetail?.id == undefined) {
    batchDetailId = undefined
  } else {
    batchDetailId = selectBatchDetail?.id
  }

  return {
    batchDetailId: batchDetailId, //批次零件id
    deviceId: stationData.value.id, //设备id
    operationType: type, //操作类型  //3暂停 4恢复
    operatorId: userData.value.id, //操作者
    time: new Date().getTime() //操作时间
  }
}

//点击按钮
async function handlePauseOrStart() {
  let data
  if (pauseOrStart.value == true) {
    data = setPauseOrStartData(3)
  } else {
    data = setPauseOrStartData(4)
  }
  await TerminalApi.stepWorkstationEvent(data)
  pauseOrStart.value = !pauseOrStart.value
}

/**************************状态*************************/

const nowStatus: any = ref({ light: lightGrizzly, label: '-' })
function setStatusByStationData() {
  switch (stationData.value.runStatus) {
    case 0:
      {
        nowStatus.value = { light: lightGreen, label: '加工中' }
      }
      break //加工中
    case 1:
      {
        nowStatus.value = { light: lightGrizzly, label: '空闲' }
      }
      break //空闲
    case 2:
      {
        nowStatus.value = { light: lightGrizzly, label: '停机' }
      }
      break //停机
    case 3:
      {
        nowStatus.value = { light: lightYellow, label: '暂停' }
      }
      break //暂停
    case 4:
      {
        nowStatus.value = { light: lightRed, label: '急停' }
      }
      break //急停
    case 5:
      {
        nowStatus.value = { light: lightRed, label: '报警' }
      }
      break //报警
  }
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskRunTop.scss');
</style>

<style lang="scss">
.taskRunTopDialog {
  --el-dialog-bg-color: transparent;
  background-image: url(../../../../assets/produceterminal/images/taskRunDetailBackground.png);
  background-size: 100% 100%;

  height: 40vh;
}
.taskRunTopDialog :deep(*) {
  background-color: transparent;
}
.taskRunTopDialog {
  .el-dialog__header {
    display: none;
  }
  .text {
    text-align: center;
    color: rgb(37, 249, 254);
    font-size: 2.5vh;
    margin-top: 2vh;
  }
  table {
    margin: 3vh auto 0px auto;

    .key {
      color: white;
      font-size: 2vh;
      font-weight: 500;
    }
    .value {
      color: white;
      font-size: 2vh;
      font-weight: 500;
    }
  }
}

/**********************开工完工************************/
.taskRunTopStartDialog {
  --el-dialog-bg-color: transparent;
  background-image: url(../../../../assets/produceterminal/images/taskRunDetailBackground.png);
  background-size: 100% 100%;

  height: 30vh;
}

.taskRunTopStartDialog :deep(*) {
  background-color: transparent;
}

.taskRunTopStartDialog {
  .el-dialog__header {
    display: none;
  }

  .form {
    width: 70%;
    margin: 5vh auto 0px auto;
  }

  .btn:hover {
    background: #15bc83;
    box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.5);
    opacity: 0.8;
    cursor: pointer;
  }

  .btn {
    height: 3vh;
    margin-right: 5vw;
  }

  .el-input__wrapper {
    background-color: transparent;
    border: 2px solid #01e0fc !important;
    box-shadow: none !important;
  }

  .el-input__inner {
    color: #76f0ee;
    font-size: large;
    outline: none;
    border-color: transparent;
    background: transparent !important;
  }

  .el-form-item__label {
    font-size: 0.9vw;
    color: #76f0ee;
  }
}
</style>
