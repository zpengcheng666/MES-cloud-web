<template>
  <el-container class="myContainner">

    <el-header height="6.7vh" class="page-header">
      <el-row class="header-row" justify="space-between" align="middle">
        <el-col :span="8"/>
        <el-col :span="8" class="header-title"> 收发货操作终端 </el-col>
        <el-col :span="8" class="login-user">
          <el-space class="right">
            <el-image class="image" :src="operatorIcons" fit="contain" />
            <div>操作人员：{{ operator }}</div>
          </el-space>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="page-main">
      <!-- 检验任务 -->
      <inOutStock
        ref="taskRunRef"
        v-if="selectButton == 1"
        :userData="userData"
      />
      <StationMaterial
        ref="StationMaterialRef"
        v-if="selectButton == 3"
        :userData="userData"
      />
      <!-- 检验任务 -->
      <div v-else-if="selectButton == 2" style="height: 78vh">
        <InspectionRegistion
          ref="InspectionRef"
          :userData="userData"
          style="height: 50px"
        />
      </div>
<!--      <el-row class="bottom-row">-->
<!--        <el-col :span="6"/>-->
<!--        <el-col :span="12">-->
<!--          <el-row class="bottom-row1" :gutter="20" justify="space-around" align="middle" >-->
<!--            <el-col :span="8">-->
<!--              <div style="text-align: center; vertical-align: middle;">-->
<!--                <el-image-->
<!--                  class="button_1"-->
<!--                  :style="setButtonCss(1)"-->
<!--                  @click="setButton(1)"-->
<!--                  :src="inoutBtn"-->
<!--                  fit="contain"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->

<!--            <el-col :span="8">-->
<!--              <div style="text-align: center">-->
<!--                <el-image-->
<!--                  class="button_2"-->
<!--                  :style="setButtonCss(2)"-->
<!--                  @click="setButton(2)"-->
<!--                  :src="inspectionBtn"-->
<!--                  fit="contain"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->

<!--            <el-col :span="8">-->
<!--              <div style="text-align: center">-->
<!--                <el-image-->
<!--                  class="button_2"-->
<!--                  :style="setButtonCss(2)"-->
<!--                  @click="setButton(2)"-->
<!--                  :src="inspectionBtn"-->
<!--                  fit="contain"-->
<!--                />-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-col>-->
<!--        <el-col :span="6"/>-->
<!--      </el-row>-->
    </el-main>

    <el-footer height="15vh">
      <el-row class="bottom-row">
        <el-col :span="6"/>
        <el-col :span="12">
          <el-row class="bottom-row1" :gutter="20" justify="space-around" align="middle" >
            <el-col :span="8">
              <div style="text-align: center;">
                <el-image
                  class="button_1"
                  :style="setButtonCss(1)"
                  @click="setButton(1)"
                  :src="inoutBtn"
                  fit="contain"
                />
              </div>
            </el-col>

            <el-col :span="8">
              <div style="text-align: center">
                <el-image
                  class="button_2"
                  :style="setButtonCss(3)"
                  @click="setButton(3)"
                  :src="stationMaterialBtn"
                  fit="contain"
                />
              </div>
            </el-col>

            <el-col :span="8">
              <div style="text-align: center">
                <el-image
                  class="button_2"
                  :style="setButtonCss(2)"
                  @click="setButton(2)"
                  :src="inspectionBtn"
                  fit="contain"
                />
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6"/>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import useEasyLogin  from '@/views/Login/components/easyLogin'

import InOutStock from './components/InOutStock.vue'
import StationMaterial from './components/StationMaterial.vue'
import inoutBtn from "@/assets/operatingterminal/inoutimage/inoutBtn.png";
import stationMaterialBtn from '@/assets/produceterminal/images/stationMaterial.png'
import inspectionBtn from "@/assets/operatingterminal/inoutimage/inspectionBtn.png";
import InspectionRegistion from "@/views/mcs/produceterminal/components/InspectionRegistion.vue";
import * as UserApi from "@/api/system/user";
import { provide } from 'vue'
import operatorIcons from "@/assets/produceterminal/images/operatorIcons.png";
import {LedgerApi} from "@/api/dms/ledger";


const { handleLogin } = useEasyLogin();

  /** 装卸工位操作  */
  defineOptions({ name: 'Consignmentandshippingterminal' })

const message = useMessage() // 消息弹窗
/****************************配置信息**************************************************/

//仓库编码
const warehouseCode = ref<string>('THJX1');
//库区编码
const areaCode = ref<string>('TEST_JX');
//库位编码
const locationCode = ref<string>(['THJX1#TEST_JX#-S1', 'THJX1#TEST_JX#-S2']);

const deviceId= ref<string>('1811679144340156418');

const locationId= ref<string>('1805175807161786369');

const userId = ref<any>();

/****************************数据列表***********************************************/

const selectButton = ref<any>(undefined) //当前按钮
const operator = ref('张三') //操作人员
const userData = ref<any>(undefined)
provide('userData', userData)
provide('locationId', locationId)
const stationData = ref<any>(undefined)
provide('stationData', stationData)

async function setButton(id) {
  if (selectButton.value == id) {
    selectButton.value = undefined
    setTimeout(() => {
      selectButton.value = id
    }, 10)
  } else {
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

//初始化
async function init() {
  selectButton.value = 1
  // 用户
  await userInit()
  // 工位
  await stationInit()
}

async function userInit() {
  try {
    userData.value = await UserApi.getUser(userId.value as any)
    operator.value = userData.value.nickname
  } catch (e) {}
}

function stationInit() {
  stationData.value = {id: locationId.value}
}

onMounted(() => {

  handleLogin({tenantName:'上海弥彧', username:'miyutech',password:'admin123'}).then((res)=>{
    userId.value = res;
    console.log("登录id",res)

    init()
  });
})

</script>

<style lang="scss" scoped>
@import url("@/assets/operatingterminal/scss/consignmentandshippingterminal.scss");
.my-input-item .el-input__inner {
  border: none !important;
  box-shadow: none !important;
}
</style>

