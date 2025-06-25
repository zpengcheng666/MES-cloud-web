<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-30 15:51:34
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" title="查看">
    <el-card>
      <template #header>刀具履历</template>
      <el-row :gutter="16" style="margin-bottom: 20px">
        <el-col :span="8">
          <span style="font-size: 20px">{{ viewData.objectCode }}</span>
        </el-col>
        <el-col :span="10">
          <span style="font-size: 20px">{{ viewData.name }}</span>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" link @click="openDetail()"> 查看刀具基本信息 </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="8">
          <span>当前状态：</span>
          <span>{{ viewData.currentStatusValue }}</span>
        </el-col>
        <el-col :span="15">
          <span>当前位置：</span>
          <span>{{ viewData.currentLocationValue }}</span>
        </el-col>
      </el-row>
      <el-divider />
      <el-row :gutter="16" v-if="viewData.exceptedServiceTime !== null">
        <el-progress :percent="viewData.percentage" />
      </el-row>
      <el-row :gutter="16" style="margin-top: 10px">
        <el-col :span="8">
          <span>预计使用时间：</span>
          <span>{{ viewData.exceptedServiceTime }}</span>
          <span v-if="viewData.exceptedServiceTime !== null">分钟</span>
        </el-col>
        <el-col :span="8">
          <span>实际使用时间：</span>
          <span>{{ viewData.usageTime }}</span>
          <span v-if="viewData.usageTime !== null">分钟</span>
        </el-col>
        <el-col :span="8">
          <span>预计剩余时间：</span>
          <span>{{ viewData.percentageVal }}</span>
          <span>分钟</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mt-50px">
      <template #header>操作记录</template>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane name="1" label="入库">
          <ruku :currentRow="currentRow" />
        </el-tab-pane>
        <el-tab-pane name="2" label="出库">
          <chuku :currentRow="currentRow" />
        </el-tab-pane>
        <el-tab-pane name="3" label="配刀">
          <peidao :currentRow="currentRow" />
        </el-tab-pane>
        <el-tab-pane name="4" label="配送">
          <peisong :currentRow="currentRow" />
        </el-tab-pane>
        <el-tab-pane name="5" label="报废">
          <baofei :currentRow="currentRow" />
        </el-tab-pane>
        <el-tab-pane name="6" label="刃磨">
          <rengmo :currentRow="currentRow" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </Dialog>

  <viewToolDetails ref="viewToolDetailsRef" />
</template>
<script lang="ts" setup>
import { getDetailByParam } from '@/api/knifetool/toolDetail/toolComponentInfo'
import type { TabsPaneContext } from 'element-plus'
import ruku from './page/ruku.vue'
import chuku from './page/chuku.vue'
import peidao from './page/peidao.vue'
import peisong from './page/peisong.vue'
import baofei from './page/baofei.vue'
import rengmo from './page/rengmo.vue'
import viewToolDetails from './viewToolDetails.vue'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const viewData = ref<any>({})
const formData = ref({
  id: undefined
})
const currentRow = ref()

const activeName = ref('1')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  currentRow.value = row
  formData.value.id = row.id
  try {
    detailLoading.value = true
    const data = await getDetailByParam(formData.value)

    console.log(data)
    viewData.value = data
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 详情操作 */
const viewToolDetailsRef = ref()
const openDetail = () => {
  viewToolDetailsRef.value.open(viewData.value)
}
</script>
