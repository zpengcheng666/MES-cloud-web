<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="时间" prop="queryTime">
        <el-date-picker
          v-model="queryParams.queryTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="物料类型" prop="materialConfigId">
        <el-input
          v-model="queryParams.materialConfigId"
          placeholder="物料类型"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="批次号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          查看
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 信息 -->
  <ContentWrap>


    <el-row :gutter="20">
      <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24">
        <el-row :gutter="20">
          <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <el-card shadow="always" class="mb-8px box-card" align="center">
              <span><strong>检测总数</strong></span>
              <br/>
              <strong style="font-family: my-self-font">{{checkNum}}</strong>
            </el-card>
          </el-col>
          <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
            <el-card shadow="always" class="mb-8px box-card1" align="center">
              <span><strong>合格产品数</strong></span>
              <br/>
              <strong style="font-family: my-self-font">{{qualifiedNumber}}</strong>
            </el-card>
          </el-col>
          <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" align="center">
            <el-card shadow="always" class="mb-8px box-card2">
              <span ><strong>不合格产品数</strong></span>
              <br/>
              <strong style="font-family: my-self-font">{{unqualifiedNumber}}</strong>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <el-card shadow="hover" class="mb-8px">
              <template #header>
                <div class="h-3 flex justify-between">
                  <strong>批次合格率统计</strong>
                </div>
              </template>
              <el-skeleton :loading="loading" animated>
                <!--<el-select v-model="selectedParam" placeholder="选择产品" @change="updateChart">-->
                <!--<el-option-->
                <!--v-for="(param, index) in params"-->
                <!--:value="param"-->
                <!--:label="param"-->
                <!--:key="index"-->
                <!--/>-->
                <!--</el-select>-->

                <Echart :options="barOptionsData" :height="300"/>
              </el-skeleton>
            </el-card>
          </el-col>
          <el-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <el-card shadow="hover" class="mb-8px">
              <template #header>
                <div class="h-3 flex justify-between">
                  <strong>缺陷统计</strong>
                </div>
              </template>
              <el-skeleton :loading="loading" animated>
                <Echart :options="pieOptionsData" :height="300"/>
              </el-skeleton>
            </el-card>
          </el-col>

        </el-row>


      </el-col>
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" class="mb-8px">
          <template #header>
            <div class="h-3 flex justify-between">
              <strong>检测项不良率统计</strong>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <Echart :options="itemAnalysisOptionsData" :height="400"/>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>


    <el-row :gutter="20" >
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" class="mb-8px">
          <template #header>
            <div class="h-3 flex justify-between">
              <strong>报废返修数统计</strong>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <Echart :options="polarOptionsData" :height="300"/>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" class="mb-8px">
          <template #header>
            <div class="h-3 flex justify-between">
              <strong>工人生产质量统计</strong>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <Echart :options="workerOptionsData" :height="300"/>
          </el-skeleton>
        </el-card>
      </el-col>
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" class="mb-8px">
          <template #header>
            <div class="h-3 flex justify-between">
              <strong>工序质检统计</strong>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <Echart :options="processOptionsData" :height="300"/>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" >
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24">
        <el-card shadow="hover" class="mb-8px">
          <template #header>
            <div class="h-3 flex justify-between">
              <strong>检验工时统计</strong>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <Echart :options="workerHoursOptionsData" :height="300"/>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>

</template>

<script setup lang="ts">
  import {dateFormatter, formatDate} from '@/utils/formatTime'
  import {AnalysisApi, AnalysisVO} from '@/api/qms/analysis'
  import {RetraceConfigApi, RetraceConfigVO} from '@/api/qms/retraceconfig'
  import {set} from 'lodash-es'
  import {EChartsOption} from 'echarts'
  import {formatTime} from '@/utils'
  import {
    pieOptions,
    barOptions,
    itemAnalysisOptions,
    polarOptions,
    workerOptions,
    processOptions,
    workerHoursOptions
  } from './echarts-data'
  import '@/assets/fonts/fonts.scss'

  /** 质量分析 图表 */
  defineOptions({name: 'QMSAnalysis'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const loading = ref(false) // 列表的加载中
  const queryParams = reactive({
    queryTime: [],
    materialConfigId: undefined,
    batchNumber: undefined
  })

  const params = ref(['产品A', '产品B', '产品C'])
  const selectedParam = ref()
  const queryFormRef = ref() // 搜索的表单
  const checkNum = ref(0)
  const unqualifiedNumber = ref(0)
  const qualifiedNumber = ref(0)
  //
  // const  updateChart = async ()=>{
  //   const  a = selectedParam.value;
  //   debugger
  // }

  //时间段内不同批次检验合格率和数量
  const barOptionsData = reactive < EChartsOption > (barOptions) as EChartsOption
  /** 时间段内不同批次检验合格率和数量 */
  const getBatchAnalysis = async () => {
    loading.value = true
    try {
      const data = await AnalysisApi.getBatchAnalysis(queryParams)
      const names = [];
      const value1 = [];
      const value2 = [];
      for (let i = 0; i < data.length; i++) {
        names.push(data[i].name)
        value1.push(data[i].batchCount)
        value2.push(data[i].passRate)
      }
      set(
        barOptionsData,
        'xAxis.data',
       names
      )
      set(barOptionsData, 'series', [
        {
          name: '产量',
          data: value1,
          type: 'bar',
          yAxisIndex: 0,
        },
        {
          name: '合格率',
          data: value2,
          type: 'line',
          yAxisIndex: 1,
            smooth: true
        }
      ])

    } finally {
      loading.value = false
    }
  }

  //时间段内不同缺陷的出现数量
  const pieOptionsData = reactive < EChartsOption > (pieOptions) as EChartsOption
  const getDefectives = async () => {
    loading.value = true
    try {
      const data = await AnalysisApi.getDefectives(queryParams)

      set(
        pieOptionsData,
        'legend.data',
        data.map((v) => t(v.name))
      )
      pieOptionsData!.series![0].data = data.map((v) => {
        return {
          name: t(v.name),
          value: v.value
        }
      })
      pieOptionsData!.series![0].name = '缺陷统计'
      set(pieOptionsData, 'title.text', '缺陷统计')

    } finally {
      loading.value = false
    }
  }

  //检测项合格率统计
  const itemAnalysisOptionsData = reactive < EChartsOption > (itemAnalysisOptions) as EChartsOption
  /** 时间段内检测项合格率统计*/
  const getItemAnalysis = async () => {
    loading.value = true
    try {
      const data = await AnalysisApi.getItemAnalysis(queryParams)
      const names = [];
      const value1 = [];
      const value2 = [];
      const value3 = [];

      let rate =0;
      for (let i = 0; i < data.length; i++) {
        names.push(data[i].name)
        value1.push(data[i].itemNumber)
          rate = rate + data[i].passRates

          if (i == data.length-1){
              value2.push(100)
          }else {
              value2.push(rate)
          }
        value3.push(data[i].unqualifiedNumber)
      }
      set(
        itemAnalysisOptionsData,
        'xAxis.data',
        names
      )
      set(itemAnalysisOptionsData, 'series', [
          {
              name: '不合格数量',
              data: value3,
              type: 'bar',
              yAxisIndex: 0,
          },
        {
          name: '累计比率',
          data: value2,
          type: 'line',
          yAxisIndex: 1,
            smooth: true
        },


      ])

    } finally {
      loading.value = false
    }
  }

  //报废返修统计
  const polarOptionsData = reactive < EChartsOption > (polarOptions) as EChartsOption

  const getScrapAndRepairAnalysis = async () => {

      loading.value = true
      try {
          const data = await AnalysisApi.getScrapAndRepair(queryParams)


          set(polarOptionsData, 'series',   [
              {
                  name: '统计信息',
                  type: 'pie',
                  radius: [30, 90],
                  center: ['50%', '50%'],
                  roseType: 'area',
                  itemStyle: {
                      borderRadius: 7
                  },
                  data: [
                      { value: data.scrapNumber, name: '报废数' },
                      { value: data.repairNumber, name: '返修数' },

                  ]
              }
          ])


      }finally {
          loading.value = false
      }

  }


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

    } finally {
      loading.value = false
    }
  }

  //工序统计
  const processOptionsData = reactive < EChartsOption > (processOptions) as EChartsOption

  const getProcessAnalysis = async () => {
      loading.value = true
      try {
          const data = await AnalysisApi.getProcessAnalysis(queryParams)
          const names = [];
          const value1 = [];
          const value2 = [];
          const value3 = [];
          for (let i = 0; i < data.length; i++) {
              names.push(data[i].processName)
              value1.push(data[i].checkNumber)
              value2.push(data[i].rate)
              value3.push(data[i].unqualifiedNumber)
          }
          set(
              processOptionsData,
              'xAxis.data',
              names
          )
          set(processOptionsData, 'series', [
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

      } finally {
          loading.value = false
      }
  }


  const getAnalysisNumber = async ()=>{
      loading.value = true
      try {
          const data = await AnalysisApi.getAnalysisNumber(queryParams)

          checkNum.value = data.checkNumber
          unqualifiedNumber.value = data.unqualifiedNumber
          qualifiedNumber.value = data.qualifiedNumber
      }finally {
          loading.value = false
      }

  }

  //工人统计
  const workerHoursOptionsData = reactive < EChartsOption > (workerHoursOptions) as EChartsOption

  const getWorkerHoursAnalysis = async () => {
    loading.value = true
    try {
      const data = await AnalysisApi.getWorkerHoursAnalysis(queryParams)

      console.log(123, data)
      const names = [];
      const value1 = [];
      const value2 = [];
      const value3 = [];

      for (let i = 0; i < data.length; i++) {
        names.push(data[i].name)
        value1.push(data[i].checkNumber)
        value2.push(data[i].workerHoursNumber)
        // value3.push(data[i].workerHoursNumber)
      }



      set(
        workerHoursOptionsData,
        'xAxis.data',
        names
      )

      set(workerHoursOptionsData, 'series', [
        {
          name: '检测数量',
          data: value1,
          type: 'bar',
          yAxisIndex: 0,
        },
        {
          name: '工时',
          data: value2,
          type: 'line',
          yAxisIndex: 1,
          smooth: true
        },



      // set(workerHoursOptionsData, 'series', [
      //   {
      //     name: '检测数量',
      //     data: value1,
      //     type: 'bar',
      //     yAxisIndex: 0,
      //   },
      //   {
      //     name: '工时',
      //     data: value2,
      //     type: 'bar',
      //     yAxisIndex: 0,
      //   }
      ])

    } finally {
      loading.value = false
    }
  }


  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getBatchAnalysis();
    getDefectives();
    getItemAnalysis();
    getAnalysisNumber();
    getProcessAnalysis();
    getScrapAndRepairAnalysis();
    getWorkerAnalysis();
    getWorkerHoursAnalysis();
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value.resetFields()
    handleQuery()
  }
  //
  /** 初始化 **/
  onMounted(() => {
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
