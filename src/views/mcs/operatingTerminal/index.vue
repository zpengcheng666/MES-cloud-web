<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >
      <el-form-item label="设备/工位" prop="deviceId">
        <el-select v-model="deviceUnitId" placeholder="请选择设备/工位" class="!w-240px" @change="deviceUnitTabSelected">
          <el-option v-for="item in deviceUnitList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-tabs v-model="subTabsName" @tab-change="deviceUnitTabSelected">
    <el-tab-pane label="工序任务" name="recordPlan">
      <WorkstationRecordPlanView ref="recordPlan" />
    </el-tab-pane>
    <el-tab-pane label="零件检验" name="inspection">
      <WorkstationInspectionView ref="inspection" />
    </el-tab-pane>
    <el-tab-pane label="物料流转" name="logistics">
      <WorkstationLogisticsView ref="logistics" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import {onMounted, provide, ref, reactive} from "vue";
import {OperatingTerminalApi} from "@/api/mcs/operatingTerminal";
import WorkstationInspectionView from "./WorkstationInspectionView.vue"
import WorkstationLogisticsView from "./WorkstationLogisticsView.vue"
import WorkstationRecordPlanView from "./WorkstationRecordPlanView.vue"

/** 任务操作页 */
defineOptions({ name: 'UnitTerminal' })

const subTabsName = ref("recordPlan")
const deviceUnitId = ref()
const deviceUnitList = ref<any[]>()
const recordPlan = ref()
const inspection = ref()
const logistics = ref()
const commonFunction = reactive({})

const getDeviceList = async () => {
  deviceUnitList.value = await OperatingTerminalApi.getDeviceUnitList();
}

const deviceUnitTabSelected = () => {
  if (deviceUnitId.value) {
    switch (subTabsName.value) {
      case "recordPlan":
        recordPlan.value.deviceUnitSelected(deviceUnitId.value);
        break;
      case "inspection":
        inspection.value.deviceUnitSelected(deviceUnitId.value);
        break;
      case "logistics":
        logistics.value.deviceUnitSelected(deviceUnitId.value);
        break;
    }
  }
}

provide("commonFunction", commonFunction);
provide("deviceUnitList", deviceUnitList);

/** 初始化 **/
onMounted(() => {
  getDeviceList()
})
</script>
