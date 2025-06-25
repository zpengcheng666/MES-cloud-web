<template>
  <!--<ContentWrap>-->
    <!--<el-descriptions :column="2" border>-->
      <!--<el-descriptions-item label="生产单位">-->
        <!--{{ detailData.projectCode }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="生产日期">-->
        <!--{{ formatDate(detailData.preendTime, 'YYYY-MM-DD') }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="接收单位">-->
        <!--{{ detailData.projectCode2 }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="接收日期">-->
        <!--{{ formatDate(detailData.preendTime2, 'YYYY-MM-DD') }}-->
      <!--</el-descriptions-item>-->
    <!--</el-descriptions>-->
  <!--</ContentWrap>-->

  <!-- 列表 -->
  <ContentWrap>
    <el-table :data="progressData" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目编码" align="center" prop="projectNumber" />
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="订单编码" align="center" prop="orderNumber" />
      <el-table-column label="计划成品" align="center" prop="quantity" />
      <el-table-column label="计划生产" align="center" prop="count" />
      <el-table-column label="完成数量" align="center" prop="complete" />
      <el-table-column label="完工率" align="center" min-width="100px">
        <template #default="{row}">
          <el-progress :percentage="row.progress" :stroke-width="20" text-inside :color="customColors" />
        </template>
      </el-table-column>
      <el-table-column
        label="计划交付"
        align="center"
        prop="deliveryTime"
        :formatter="dateFormatter2"
        min-width="120px"
      />
    </el-table>
  </ContentWrap>

  <!--<el-row :gutter="20">-->
    <!--<el-col :span="12">-->
      <!--<ContentWrap>-->
        <!--<el-descriptions :column="1" border>-->
          <!--<el-descriptions-item label="交接单位">-->
            <!--{{ detailData.deliveryName }}-->
          <!--</el-descriptions-item>-->
          <!--<el-descriptions-item label="交货人">-->
            <!--{{ detailData.deliveryPerson }}-->
          <!--</el-descriptions-item>-->
          <!--<el-descriptions-item label="日期">-->
            <!--{{ formatDate(detailData.preendTime2, 'YYYY-MM-DD') }}-->
          <!--</el-descriptions-item>-->
        <!--</el-descriptions>-->
      <!--</ContentWrap>-->
    <!--</el-col>-->
    <!--<el-col :span="12">-->
      <!--<ContentWrap>-->
        <!--<el-descriptions :column="1" border>-->
          <!--<el-descriptions-item label="接收单位">-->
            <!--{{ detailData.receiveName }}-->
          <!--</el-descriptions-item>-->
          <!--<el-descriptions-item label="接收人">-->
            <!--{{ detailData.receivePerson }}-->
          <!--</el-descriptions-item>-->
          <!--<el-descriptions-item label="日期">-->
            <!--{{ formatDate(detailData.preendTime2, 'YYYY-MM-DD') }}-->
          <!--</el-descriptions-item>-->
        <!--</el-descriptions>-->
      <!--</ContentWrap>-->
    <!--</el-col>-->

  <!--</el-row>-->
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2,formatDate } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { ExcuteApi } from '@/api/pms/excute'


const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const customColors = [
  { color: '#f5363b', percentage: 20 },
  { color: '#e6b554', percentage: 40 },
  { color: '#e6e42c', percentage: 60 },
  { color: '#534cfa', percentage: 80 },
  { color: '#20d33a', percentage: 100 },
]
const progressData = ref<any[]>([])

const setList = (rows)=>{
  progressData.value = rows;
}

defineExpose({ setList })
</script>
