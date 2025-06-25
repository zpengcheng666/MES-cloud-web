<template>
  <ContentWrap>
    <el-button type="info" @click="goBack"><Icon icon="ep:back" class="mr-5px" /> 返回</el-button>
    <el-button type="primary" v-if="!sharedInfo.apsId" :loading="loading" @click="scheduling"><Icon icon="ep:plus" class="mr-5px" /> 排产</el-button>
    <el-button type="primary" v-else @click="scheduling"><Icon icon="ep:refresh" class="mr-5px" /> 重新排产</el-button>
    <el-button type="success" v-show="sharedInfo.apsId" @click="submit"><Icon icon="ep:check" class="mr-5px" /> 提交</el-button>
  </ContentWrap>
  <el-tabs type="border-card" v-model="tabIndex">
    <el-tab-pane label="排产设备">
      <scheduling-config />
    </el-tab-pane>
    <el-tab-pane label="设备负载">
      <equipment-load-diagram v-if="tabIndex === '1'" />
    </el-tab-pane>
    <el-tab-pane label="任务甘特">
      任务甘特图
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, ref} from "vue";
import SchedulingConfig from "@/views/mcs/productionPlan/components/schedule/schedulingConfig.vue";
import EquipmentLoadDiagram
  from "@/views/mcs/productionPlan/components/schedule/equipmentLoadDiagram.vue";
import {BatchOrderApsResultApi} from "@/api/mcs/batchorderapsresult";

const sharedInfo = inject("sharedInfo");
const loading = ref(false)

const tabIndex = ref('0')

const scheduling = async () => {
  loading.value = true;
  const deviceList = sharedInfo.getScheduleDeviceList();
  const planDevice = sharedInfo.getSchedulingPlanDevice();
  const strategy = sharedInfo.getSchedulingStrategy();
  const data = {deviceList,planDevice,strategy}
  sharedInfo.apsId = await BatchOrderApsResultApi.productionScheduling(data)
  loading.value = false
}

const submit = async () => {
  for (let orderId of sharedInfo.batchOrderIdList) {
    await BatchOrderApsResultApi.schedulingAdopt({id: orderId})
  }
  window.alert("未实现!临时测试")
}

const goBack = () => {
  sharedInfo.batchOrderReload();
  if (sharedInfo.partOrderReload) sharedInfo.partOrderReload();
  if (sharedInfo.processOrderReload) sharedInfo.processOrderReload()
  sharedInfo.pageName = 'orderView'
}
</script>

<style scoped>

</style>
