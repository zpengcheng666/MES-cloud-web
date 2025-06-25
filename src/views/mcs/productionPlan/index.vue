<template>
  <el-row :gutter="20" v-show="sharedInfo.pageName === 'orderView'">
    <el-col :span="5" :xs="24">
      <ContentWrap>
        <order-aside-table />
      </ContentWrap>
    </el-col>
    <el-col :span="19" :xs="24">
      <ContentWrap>
        <batch-order-table />
      </ContentWrap>
    </el-col>
  </el-row>
  <ContentWrap v-if="sharedInfo.pageName === 'demandView'">
    <demand-order-table />
  </ContentWrap>
  <ContentWrap v-if="sharedInfo.pageName === 'schedulingView'">
    <production-scheduling />
  </ContentWrap>
  <process-order-edit ref="processOrderEditRef" @success="sharedInfo.processOrderReload" />
  <resource-sorting-material ref="materialSortingRef" @success="sharedInfo.demandReload" />
  <resource-sorting-tool ref="toolSortingRef" @success="sharedInfo.demandReload" />
  <resource-sorting-cutting ref="cuttingSortingRef" @success="sharedInfo.demandReload" />
  <scheduling-device-select ref="deviceSelectRef" @success="sharedInfo.processReload" />
</template>

<script lang="ts" setup>
import { provide, reactive } from 'vue'
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import OrderAsideTable from "@/views/mcs/productionPlan/components/orderAsideTable.vue";
import BatchOrderTable from "@/views/mcs/productionPlan/components/order/batchOrderTable.vue";
import ProcessOrderEdit from "@/views/mcs/productionPlan/components/order/processOrderEdit.vue";
import DemandOrderTable from "@/views/mcs/productionPlan/components/demand/demandOrderTable.vue";
import ResourceSortingMaterial from "@/views/mcs/productionPlan/components/demand/resourceSortingMaterial.vue";
import ResourceSortingTool from "@/views/mcs/productionPlan/components/demand/resourceSortingTool.vue";
import ResourceSortingCutting from "@/views/mcs/productionPlan/components/demand/resourceSortingCutting.vue";
import ProductionScheduling from "@/views/mcs/productionPlan/components/schedule/productionScheduling.vue";
import SchedulingDeviceSelect
  from "@/views/mcs/productionPlan/components/schedule/schedulingDeviceSelect.vue";
const message = useMessage() // 消息弹窗

const sharedInfo = reactive<any>({});
provide('sharedInfo', sharedInfo);

sharedInfo.pageName = "orderView"

const processOrderEditRef = ref();
const processOrderEditOpen = (row: any) => {
  processOrderEditRef.value.open(row)
}
sharedInfo.processOrderEditOpen = processOrderEditOpen;

const materialSortingRef = ref();
const materialSortingOpen = (row: any) => {
  materialSortingRef.value.open(row)
}
sharedInfo.materialSortingOpen = materialSortingOpen;

const toolSortingRef = ref();
const toolSortingOpen = (row: any) => {
  toolSortingRef.value.open(row)
}
sharedInfo.toolSortingOpen = toolSortingOpen;

const cuttingSortingRef = ref();
const cuttingSortingOpen = (row: any) => {
  cuttingSortingRef.value.open(row)
}
sharedInfo.cuttingSortingOpen = cuttingSortingOpen;

const deviceSelectRef = ref();
const deviceSelectOpen = (orderId: string, unitList: any[]) => {
  deviceSelectRef.value.open(orderId, unitList)
}
sharedInfo.deviceSelectOpen = deviceSelectOpen;

</script>

<style scoped>

</style>
