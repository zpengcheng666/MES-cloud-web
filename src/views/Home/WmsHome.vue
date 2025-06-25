<template>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"   v-if="checkPermi(['wms:occupancy:rate'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>仓库占用率</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <Echart :options="warehouseOccupancyRateData" :height="300"/>

            </el-skeleton>
        </el-card>
    </el-col>

    <WarehouseInOutAnalysis v-if="checkPermi(['wms:warehouseInOut:analysis'])" />
  
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"   v-if="checkPermi(['wms:manualIn:list'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>人工待入库</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <ManualIn />

            </el-skeleton>
        </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"   v-if="checkPermi(['wms:manualOut:list'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>人工待出库</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <ManualOut />

            </el-skeleton>
        </el-card>
    </el-col>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"   v-if="checkPermi(['wms:alarm:info'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>异常信息</span>
                    <el-link type="primary" :underline="false" @click="getAlarmPage">{{ t('action.more') }}
                    </el-link>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <Alarm />

            </el-skeleton>
        </el-card>
    </el-col>
   

</template>
<script lang="ts" setup>
    import {set} from 'lodash-es'
    import {EChartsOption} from 'echarts'
    import { WmsHomeApi } from '@/api/home/wms';
    import { warehouseOccupancyRateOptions } from './components/wms/wms-echarts-data';
    import WarehouseInOutAnalysis from './components/wms/WarehouseInOutAnalysis.vue';
    import ManualIn from './components/wms/ManualIn.vue';
    import ManualOut from './components/wms/ManualOut.vue';
    import Alarm from './components/wms/Alarm.vue';
    import { checkPermi } from '@/utils/permission';

    defineOptions({name: 'WmsHome'})
    const router = useRouter() // 路由
    const {t} = useI18n()

    const loading = ref(true)

    const getAlarmPage = () => {
        router.push({path: '/wms/abnormal/alarm'})
    }

    // 仓库占用率
    const warehouseOccupancyRateData = reactive < EChartsOption > (warehouseOccupancyRateOptions) as EChartsOption

    const getWarehouseOccupancyRate = async () => {
        loading.value = true
        try {
            const data = await WmsHomeApi.getWarehouseOccupancyRate() as Map<string, {trayOccupied: number, locationOccupied: number, total: number}>
            const names : string[] = [];
            const value1 : number[] = [];
            const value2 : number[] = [];
            for (const key of Object.keys(data)) {
                names.push(key)
                const value = data[key]
                value1.push(Math.round((value.locationOccupied/value.total)*100))
                value2.push(Math.round((value.trayOccupied/value.total)*100))
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

        } finally {
            loading.value = false
        }
    }



    /** 初始化 **/
    onMounted(() => {
        loading.value = false
        if(checkPermi(['wms:occupancy:rate'])) {
            getWarehouseOccupancyRate();
        }
    })

</script>
