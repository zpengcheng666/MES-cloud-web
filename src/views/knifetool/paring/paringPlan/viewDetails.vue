<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-17 15:03:01
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlan/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="查看" width="1000">
    <el-descriptions class="mt-10px" title="装配任务" :column="2" border>
      <el-descriptions-item label="工单号">{{ viewData.workOrderCode }}</el-descriptions-item>
      <el-descriptions-item label="最短加工时长">{{ viewData.minimumTime }}</el-descriptions-item>
      <el-descriptions-item label="是否加急">{{
        viewData.paringPlanUrgent === 0 ? '否' : '是'
      }}</el-descriptions-item>
      <el-descriptions-item label="最晚装配时间">{{
        formatDate(viewData.paringDeadline)
      }}</el-descriptions-item>
      <!-- <a-col v-for="(item,index) in equData" :key="index"> -->
      <!-- <a-descriptions :column="2" bordered> -->
      <el-descriptions-item label="加工零件适配的设备/产线" :span="2">
        {{ viewData.equipmentName }}
      </el-descriptions-item>
      <el-descriptions-item label="刀组编码">{{ viewData.toolGroupCode }}</el-descriptions-item>
      <el-descriptions-item label="需求数量">{{ viewData.paringNum }}</el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      class="mt-30px"
      title="当前装配任务情况"
      :column="4"
      direction="vertical"
      border
    >
      <el-descriptions-item label="刀组编码">{{ viewData.toolGroupCode }}</el-descriptions-item>
      <el-descriptions-item label="需求数量">{{ viewData.paringNum }}</el-descriptions-item>
      <!-- <el-descriptions-item label="装配状态" :span="2">{{ paringTaskState }}</el-descriptions-item> -->
      <el-descriptions-item label="装配库存">{{ viewData.repertoryQuantity }}</el-descriptions-item>
      <el-descriptions-item label="锁定数量/产线">{{
        viewData.matchingQuantity
      }}</el-descriptions-item>
      <el-descriptions-item label="已配送数量">{{ viewData.distributionNum }}</el-descriptions-item>
      <el-descriptions-item label="剩余配送数量">{{
        viewData.paringNum - viewData.distributionNum
      }}</el-descriptions-item>
    </el-descriptions>
  </Dialog>
</template>
<script lang="ts" setup>
import { getEquParingPlanByWorkNum } from '@/api/knifetool/paring/paringPlan'
import { formatDate } from '@/utils/formatTime'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const viewData = ref<any>({})

const queryParams = ref({
  workOrderCode: ''
})

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    console.log(queryParams)
    const data = await getEquParingPlanByWorkNum(queryParams.value)
    console.log(data)
    viewData.value = data
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  try {
    detailLoading.value = true
    detailObj.value = row
    viewData.value = row
    // queryParams.value.workOrderCode = row.workOrderCode
    // getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
