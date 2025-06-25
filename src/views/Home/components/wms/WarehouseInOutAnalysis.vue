<template>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>出入库详情</span>
                    <span style="margin-top: -8px;">
                        <TimeRange @init="initTimeRange" @change="timeRangeChange" />
                    </span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <el-table v-loading="loading"
                    ref="contractTableRef"
                    :data="warehouseInOutCountList"
                    :stripe="true"
                    :show-overflow-tooltip="true"
                    max-height="310">
        
                    <el-table-column label="仓库名称" align="center" prop="warehouseName" />
                    <el-table-column label="物料批次" align="center" prop="batchNumber" />
                    <el-table-column label="物料编码" align="center" prop="materialNumber" />
                    <el-table-column label="入库数量" align="center" prop="inTotalCount" />
                    <el-table-column label="出库数量" align="center" prop="outTotalCount" />
                    <el-table-column label="库存数量" align="center" prop="totalStockCount" />
                </el-table>

            </el-skeleton>
        </el-card>
    </el-col>


    
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>出入库统计</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <Echart :options="warehouseOccupancyRateData" :height="300"/>

            </el-skeleton>
        </el-card>
    </el-col>
  
</template>
<script  lang="ts" setup>
import {set} from 'lodash-es'
import {WmsHomeApi} from "@/api/home/wms";
import { EChartsOption } from "echarts";
import {ElTable} from "element-plus";
import { totalWarehouseOptions } from './wms-echarts-data';
import TimeRange from "@/components/TimeRange/index.vue";

defineOptions({name: 'WarehouseInOutAnalysis'})

const warehouseInOutCountList = ref<any[]>([]) // 列表的数据
const loading = ref(true)
const createTimeRange = ref()
const initTimeRange = (val: any) => {
    createTimeRange.value = val
}
const timeRangeChange = (val: any) => {
    getWarehouseInOutAnalysis(val)
}

//仓库总出入库统计
const warehouseOccupancyRateData = reactive < EChartsOption > (totalWarehouseOptions) as EChartsOption


const getWarehouseInOutAnalysis = async (timeRange: string[]) => {
    loading.value = true
    try {
        const data = await WmsHomeApi.getWarehouseInOutAnalysis(timeRange)
        warehouseInOutCountList.value = data.warehouseInOutCountList
        const totalWarehouseAnalysis = data.totalWarehouseStatisticsList


        const names = new Array<string>();
        const value1 = new Array<number>();
        const value2 = new Array<number>();
        const value3 = new Array<number>();
        for (const item of totalWarehouseAnalysis) {
            names.push(item.warehouseName)
            value1.push(item.inTotalCount)
            value2.push(item.outTotalCount)
            value3.push(item.totalStockCount)
        }

        set
        (
            warehouseOccupancyRateData,
            'xAxis.data',
            names
        )
        set
        (
            warehouseOccupancyRateData, 
            'series[0].data', 
            value1
        )
        set(
            warehouseOccupancyRateData, 
            'series[1].data', 
            value2
        )
        set(
            warehouseOccupancyRateData, 
            'series[2].data', 
            value3
        )
    } finally {
        loading.value = false
    }
}


/** 初始化 **/
onMounted(() => {
  getWarehouseInOutAnalysis(createTimeRange.value)
})

</script>
