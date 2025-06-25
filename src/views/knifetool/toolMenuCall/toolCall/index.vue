<!--
 * @Author: hyj
 * @Description: 呼叫刀具
 * @Date: 2024-07-23 17:22:39
 * @LastEditTime: 2024-07-25 10:26:50
 * @FilePath: /cimp-tms-web/src/views/toolMenuCall/toolCall/index.vue
-->
<template>
  <!-- <ContentWrap> -->
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="紧急呼叫任务" name="1">
      <emergencyCall ref="emergencyCallRef" />
    </el-tab-pane>
    <el-tab-pane label="发起配送" name="2">
      <initiateDelivery @init-list="initList" />
    </el-tab-pane>
    <el-tab-pane label="配送单查询" name="3">
      <deliveryOrderInquiry />
    </el-tab-pane>
  </el-tabs>
  <!-- </ContentWrap> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { deliveryOrderInquiry, emergencyCall, initiateDelivery } from './page'

const activeName = ref('1')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const emergencyCallRef = ref()
const initList = () => {
  console.log(1)
  emergencyCallRef.value.getList()
}
</script>

<style></style>
