<template>
  <el-card shadow="never" style="height: 400px">
    <template #header>
      <div class="h-3 flex justify-between">
        <span>工人生产质量统计（质检）</span>
        <span style="margin-top: -8px;">
            <TimeRange @init="initTimeRange" @change="timeRangeChange" />
        </span>
        <router-link :to="'/qms/inspection/QMSAnalysis'">
          <el-button link type="primary">{{ t('action.more') }}</el-button>
        </router-link>
      </div>
    </template>
    <el-skeleton :loading="loading" animated>
      <Echart :options="workerOptionsData" :height="300"/>
    </el-skeleton>
  </el-card>
</template>

<script setup lang="ts">
  import {AnalysisApi, AnalysisVO} from '@/api/qms/analysis'
  import {set} from 'lodash-es'
  import {EChartsOption} from 'echarts'
  import {
    pieOptions,
    barOptions,
    itemAnalysisOptions,
    polarOptions,
    workerOptions,
    processOptions,
    workerHoursOptions
  } from '@/views/qms/analysis/echarts-data'
  import '@/assets/fonts/fonts.scss'
  import TimeRange from "@/components/TimeRange/index.vue";

  /** 质量分析 图表 */
  defineOptions({name: 'QMSAnalysis'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const loading = ref(false) // 列表的加载中

  const initTimeRange = (val: any) => {
    queryParams.queryTime = val
  }
  const timeRangeChange = (val: any) => {
    queryParams.queryTime = val
    getWorkerAnalysis()
  }


  const queryParams = reactive({
    queryTime: [],
    materialConfigId: undefined,
    batchNumber: undefined
  })

  const params = ref(['产品A', '产品B', '产品C'])
  const selectedParam = ref()
  const queryFormRef = ref() // 搜索的表单

  //工人统计
  const workerOptionsData = reactive < EChartsOption > (workerOptions) as EChartsOption

  const getWorkerAnalysis = async () => {

    loading.value = true
    try {
      const data = await AnalysisApi.getWorkerAnalysis(queryParams)
      const names = [];
      const value1 = [];
      const value2 = [];
      const value3 = [];
      for (let i = 0; i < data.length; i++) {
        names.push(data[i].name)
        value1.push(data[i].qualifiedNumber)
        value2.push(data[i].rate)
        value3.push(data[i].unqualifiedNumber)
      }
      set(
        workerOptionsData,
        'xAxis.data',
        names
      )

      set(workerOptionsData, 'series', [
        {
          name: '检测数量',
          data: value1,
          type: 'bar',
          yAxisIndex: 0,
        },
        {
          name: '比率',
          data: value2,
          type: 'line',
          yAxisIndex: 1,
          smooth: true
        },
        {
          name: '不合格数量',
          data: value3,
          type: 'bar',
          yAxisIndex: 0,
        }
      ])

      // set(
      //   workerOptionsData,
      //   'xAxis.data',
      //   names
      // )
      //
      // set(workerOptionsData, 'series', [
      //   {
      //     name: '合格',
      //     data: value1,
      //     type: 'bar',
      //   },
      //   {
      //     name: '不合格',
      //     data: value2,
      //     type: 'bar',
      //   }
      // ])

    } finally {
      loading.value = false
    }
  }

  /** 初始化 **/
  onMounted(() => {
    getWorkerAnalysis()
  })
</script>
<style lang="scss" scoped>
  .box-card{
    background-color: #5470C6;
    color: #fff;
    font-size:20px;
    border-radius: 10px;
  }
  .box-card1{
    background-color: #91CC75;
    color: #fff;
    font-size:20px;
    border-radius: 10px;
  }
  .box-card2{
    background-color: #EE6666;
    color: #fff;
    font-size:20px;
    border-radius: 10px;
  }
</style>
