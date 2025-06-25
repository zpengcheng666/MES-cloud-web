<template>
  <el-container class="myContainner">
    <el-header height="6.7vh" class="head">
      <el-row class="header-row" :gutter="20" justify="space-between" align="middle">
        <el-col :span="8" class="col">
          <el-space class="left">
            <el-image class="image" :src="workstationIcons" fit="contain" />
            <div>当前工位：{{ currentWorkstation }}</div>
          </el-space>
        </el-col>
        <el-col :span="4" class="col str"> 检验任务系统 </el-col>
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
      <InspectionRegistion
        ref="InspectionRegistionRef"
        v-if="selectButton == 2"
        :stationData="stationData"
        :userData="userData"
      />
      <!-- 工位物料 -->
      <StationMaterial
        ref="StationMaterialRef"
        v-else-if="selectButton == 3"
        :stationData="stationData"
      />
    </el-main>
    <el-footer height="15vh">
      <el-row class="bottom-row" :gutter="20" justify="space-around" align="middle" style="width: 35vw;">
        <el-col :span="8">
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
        <el-col :span="8">
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
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import workstationIcons from '@/assets/produceterminal/images/workstationIcons.png'
import operatorIcons from '@/assets/produceterminal/images/operatorIcons.png'

import InspectionRegistionBtn from '@/assets/produceterminal/images/InspectionRegistionBtn.png'
import stationMaterialBtn from '@/assets/produceterminal/images/stationMaterial.png'
import deviceInfo from '@/assets/produceterminal/images/deviceInfo.png'

import InspectionRegistion from "@/views/mcs/produceterminal/components/InspectionRegistion.vue";
import StationMaterial from "./StationMaterial.vue";
import equipmentInformation from "@/views/mcs/produceterminal/components/equipmentInformation.vue";

const InspectionRegistionRef = ref()
const StationMaterialRef = ref()
const equipmentInformationRef = ref()

/*************************本页面逻辑************************/

const selectButton = ref<any>(undefined) //当前按钮
const currentWorkstation = ref('A-0123') //当前工位
const operator = ref('张三') //操作人员

//是否存在设备
const hasDevice = ref(true)

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
  await stationInit() //工位数据
  await userInit() //用户数据
}

//初始化
async function init() {
  await flushData()
  selectButton.value = 2
}

onMounted(() => {
  init()
})


/********************工位初始化与传值****************************/
import { LedgerApi } from '@/api/dms/ledger'
// const stationId = ref('1811677611087163394')
const stationId = ref('1811697887871000578')

//工位ID
const stationData = ref<any>(undefined)
provide('stationData', stationData)
//工位数据

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
    // 工位类型为检验
    stationData.value.stationType = 'inspection'

    currentWorkstation.value = stationData.value.code
    if (stationData.value.type != 0) hasDevice.value = false
  } catch (e) {}
}

/********************用户初始化与传值****************************/
import * as UserApi from '@/api/system/user'

const userId = ref('1')
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

</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskterminal.scss');
</style>
