<template>
  <el-container class="myContainner">
    <el-header height="6.7vh" class="head">
      <el-row class="header-row" :gutter="20" justify="space-between" align="middle">
        <el-col :span="8" class="col">
          <el-space class="left">
            <el-image class="image" :src="workstationIcons" fit="contain" />
            <div>当前工位：{{ currentWorkstation }}</div>
            <el-select-v2
              @change="handleStationId"
              v-model="stationId"
              :options="ledgerList"
              filterable
              clearable
              placeholder="选择设备"
              class="!w-240px"
            />
          </el-space>
        </el-col>
        <el-col :span="4" class="col str"> 生产任务系统 </el-col>
        <el-col :span="8" class="col">
          <el-space class="right">
            <el-image class="image" :src="operatorIcons" fit="contain" />
            <div>操作人员：{{ operator }}</div>
          </el-space>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <!-- 检验任务 -->
      <taskRun
        ref="taskRunRef"
        v-if="selectButton == 1"
        :stationData="stationData"
        :userData="userData"
        :flushMainData="flushData"
      />
      <!-- 检验任务 -->
      <InspectionRegistion
        ref="InspectionRegistionRef"
        v-else-if="selectButton == 2"
        :stationData="stationData"
        :userData="userData"
      />
      <!-- 工位物料 -->
      <StationMaterial
        ref="StationMaterialRef"
        v-else-if="selectButton == 3"
        :stationData="stationData"
      />
      <!--设备信息-->
      <equipmentInformation
        ref="equipmentInformationRef"
        v-else-if="selectButton == 4"
        :stationData="stationData"
        :userData="userData"
        :deviceData="stationData"
      />
      <!--问题上报-->
      <problemReporting
        ref="problemReportingRef"
        v-else-if="selectButton == 5"
        :stationData="stationData"
        :userData="userData"
      />
    </el-main>
    <el-footer height="15vh">
      <el-row class="bottom-row" :gutter="20" justify="space-around" align="middle">
        <el-col :span="4">
          <div>
            <el-image
              class="button_1"
              :style="setButtonCss(1)"
              @click="setButton(1)"
              :src="taskRunBtn"
              fit="contain"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-image
              class="button_2"
              :style="setButtonCss(2)"
              @click="setButton(2)"
              :src="InspectionRegistionBtn"
              fit="contain"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-image
              class="button_3"
              :style="setButtonCss(3)"
              @click="setButton(3)"
              :src="stationMaterialBtn"
              fit="contain"
            />
          </div>
        </el-col>
        <el-col :span="4" v-if="hasDevice == true">
          <div>
            <el-image
              class="button_4"
              :style="setButtonCss(4)"
              @click="setButton(4)"
              :src="deviceInfo"
              fit="contain"
            />
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-image
              class="button_5"
              :style="setButtonCss(5)"
              @click="setButton(5)"
              :src="questionReport"
              fit="contain"
            />
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
//深层传递数据
import taskRunBtn from '@/assets/produceterminal/images/taskRunBtn.png'
import InspectionRegistionBtn from '@/assets/produceterminal/images/InspectionRegistionBtn.png'
import stationMaterialBtn from '@/assets/produceterminal/images/stationMaterial.png'
import questionReport from '@/assets/produceterminal/images/questionReport.png'
import deviceInfo from '@/assets/produceterminal/images/deviceInfo.png'
//底部按钮图片

import taskRun from './components/taskRun.vue'
import InspectionRegistion from './components/InspectionRegistion.vue'
import StationMaterial from './components/StationMaterial.vue'
import equipmentInformation from './components/equipmentInformation.vue'
import problemReporting from './components/problemReporting.vue'
//内容组件

import workstationIcons from '@/assets/produceterminal/images/workstationIcons.png'
import operatorIcons from '@/assets/produceterminal/images/operatorIcons.png'
//顶部图标

/*************************************REF************************/

const taskRunRef = ref()
const InspectionRegistionRef = ref()
const StationMaterialRef = ref()
const equipmentInformationRef = ref()
const problemReportingRef = ref()

/*************************本页面逻辑************************/

const selectButton = ref<any>(undefined) //当前按钮
const currentWorkstation = ref('A-0123') //当前工位
const operator = ref('张三') //操作人员

const hasDevice = ref(true)
//是否存在设备

//选择按钮逻辑，包括选择相同按钮刷新
async function setButton(id) {
  if (selectButton.value == id) {
    selectButton.value = undefined
    setTimeout(() => {
      selectButton.value = id
    }, 10)
  } else {
    // 检验
    if(id != 2){
      $('body').off('keydown')
    }
    selectButton.value = id
  }
}

//选中按钮CSS
function setButtonCss(id) {
  if (id == selectButton.value) {
    return { opacity: 1 }
  }
  return {}
}

/*******************************初始化************************************/
import { provide } from 'vue'

//刷新远程数据
async function flushData() {
  await getLedgerList()
  await stationInit() //工位数据
  await userInit() //用户数据
}

//初始化
async function init() {
  await flushData()
  selectButton.value = 1
}

onMounted(() => {
  init()
})

/********关联设备**********/

const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    ledgerList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}

async function handleStationId() {
  await stationInit() //工位数据
}

/********************工位初始化与传值****************************/
import { LedgerApi } from '@/api/dms/ledger'
import { ElNotification } from 'element-plus'

const stationId = ref('1811677611087163394')
//工位ID
const stationData = ref<any>(undefined)
provide('stationData', stationData)
//工位数据
provide('deviceData', stationData)
//设备数据

async function stationInit() {
  try {
    // stationData.value = await LedgerApi.getLedgerByIp(null)
    // if (stationData.value == null) {
    //   ElNotification({
    //     title: '成功',
    //     message: '此ip未被任何设备绑定',
    //     type: 'error'
    //   })
    //   throw new Error('此ip未被任何设备绑定')
    // }
    // stationId.value = stationData.value.id

    stationData.value = await LedgerApi.getLedger(stationId.value as any)
    currentWorkstation.value = stationData.value.code
    if (stationData.value.type != 0) hasDevice.value = false
  } catch (e) {}
}

/********************用户初始化与传值****************************/
import * as UserApi from '@/api/system/user'

const userId = ref('104')
//用户ID
const userData = ref<any>(undefined)
provide('userData', userData)
//用户数据

async function userInit() {
  try {
    userData.value = await UserApi.getUser(userId.value as any)
    operator.value = userData.value.nickname
  } catch (e) {}
}

/********************************* Map数据 *****************************/

const mapData = ref(new Map())
provide('mapData', mapData)

/***********************************其他**************************/
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskterminal.scss');
</style>
