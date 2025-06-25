<template>
  <ContentWrap>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="排产设备" name="device">
        <scheduling-device />
      </el-collapse-item>
      <el-collapse-item title="指定设备" name="planDevice">
        <scheduling-plan-device />
      </el-collapse-item>
      <el-collapse-item title="排产策略" name="strategy">
        <scheduling-strategy />
      </el-collapse-item>
    </el-collapse>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {inject, ref} from "vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import SchedulingDevice from "@/views/mcs/productionPlan/components/schedule/schedulingDevice.vue";
import SchedulingPlanDevice
  from "@/views/mcs/productionPlan/components/schedule/schedulingPlanDevice.vue";
import SchedulingStrategy
  from "@/views/mcs/productionPlan/components/schedule/schedulingStrategy.vue";

const sharedInfo = inject("sharedInfo");
const activeName = ref("device")

</script>

<style scoped>

</style>
