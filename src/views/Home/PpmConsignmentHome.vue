<template>


        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>供应商退货率</span>
                        <span style="margin-top: -8px;">
                        <TimeRange @init="initTimeRange" @change="timeRangeChange" />
                    </span>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>

                    <Echart :options="processOptionsData" :height="300"/>

                </el-skeleton>
            </el-card>
        </el-col>


        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>采购质检合格率</span>
                        <span style="margin-top: -8px;">
                        <TimeRange @init="initTimeRangeA" @change="timeRangeChangeA" />
                    </span>
                    </div>


                </template>
                <el-skeleton :loading="loading" animated>

                    <Echart :options="consignmentQmsRateData" :height="300"/>

                </el-skeleton>
            </el-card>
        </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>采购金额统计</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <Echart :options="purchaseContractAnalysisData" :height="300"/>

            </el-skeleton>
        </el-card>
    </el-col>

        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"   v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>收货异常处理</span>
                        <el-link type="primary" :underline="false" @click="getInboundExceptionPage">{{ t('action.more') }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>

                    <PpmInboundException/>

                </el-skeleton>
            </el-card>
        </el-col>


        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>采购需求</span>
                        <el-link type="primary" :underline="false" @click="getRequirementPage">{{ t('action.more') }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>
                    <PpmPurchaseRequire/>
                </el-skeleton>
            </el-card>
        </el-col>

        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>采购合同</span>
                        <el-link type="primary" :underline="false" @click="getPurchaseContractPage">{{ t('action.more')
                            }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>
                    <PpmPurchaseContract/>
                </el-skeleton>
            </el-card>
        </el-col>

        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>合同收货情况</span>
                        <el-link type="primary" :underline="false" @click="getPurchaseContractPage">{{ t('action.more')
                            }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>
                    <PpmPurchaseContractExecution/>
                </el-skeleton>
            </el-card>
        </el-col>

        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>采购收货单</span>
                        <el-link type="primary" :underline="false" @click="getConsignmentPage">{{ t('action.more') }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>

                    <PpmPurchaseConsignment/>

                </el-skeleton>
            </el-card>
        </el-col>

        <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['ppm:purchase-consignment:query'])" >
            <el-card shadow="never" style="height: 400px">
                <template #header>
                    <div class="h-3 flex justify-between">
                        <span>采购退货单</span>
                        <el-link type="primary" :underline="false" @click="getConsignmentReturnPage">{{ t('action.more') }}
                        </el-link>
                    </div>
                </template>
                <el-skeleton :loading="loading" animated>

                    <PpmConsignmentReturn/>

                </el-skeleton>
            </el-card>
        </el-col>


</template>
<script lang="ts" setup>
    import {set} from 'lodash-es'
    import {EChartsOption} from 'echarts'
    import {formatTime} from '@/utils'

    import {useUserStore} from '@/store/modules/user'
    import {useWatermark} from '@/hooks/web/useWatermark'
    import {dateFormatter2} from '@/utils/formatTime'
    import {ContractApi, ContractVO} from '@/api/ppm/contract'
    import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
    import {defaultProps} from "@/utils/tree";
    import {PpmHomeApi} from "@/api/home/ppm";
    import {ElTable} from "element-plus";
    import PpmPurchaseRequire from './components/ppm/PpmPurchaseRequire.vue'
    import PpmPurchaseContract from './components/ppm/PpmPurchaseContract.vue'
    import PpmPurchaseConsignment from './components/ppm/PpmPurchaseConsignment.vue'
    import PpmConsignmentReturn from './components/ppm/PpmConsignmentReturn.vue'
    import PpmPurchaseContractExecution from './components/ppm/PpmPurchaseContractExecution.vue'
    import PpmInboundException from './components/ppm/PpmInboundException.vue'
    import { companyOptions,consignmentQmsRateOptions ,purchaseContractAnalysisOptions} from './components/ppm/ppm-echarts-data'
    import { checkPermi } from '@/utils/permission';
    import TimeRange from "@/components/TimeRange/index.vue";


    defineOptions({name: 'PpmConsignmentHome'})





    const router = useRouter() // 路由
    const {t} = useI18n()
    const userStore = useUserStore()
    const {setWatermark} = useWatermark()
    const loading = ref(true)
    const requireList = ref < ContractVO[] > ([]) // 列表的数据
    const requireTotal = ref(0) // 列表的总页数
    const queryParams = reactive({
        pageNo: 1,
        pageSize: 10,
        type: 1,
        applicant: undefined,
        applicationDepartment: undefined,
        applicationDate: [],
        applicationReason: undefined,
        isValid: 1,
        status: 2
    })

    const createTimeRange = ref()
    const initTimeRange = (val: any) => {
        createTimeRange.value = val
    }
    const timeRangeChange = (val: any) => {
        getProcessAnalysis(val)
    }


    const createTimeRangeA = ref()
    const initTimeRangeA = (val: any) => {
        createTimeRangeA.value = val
    }
    const timeRangeChangeA = (val: any) => {
        getConsignmentQmsRate(val)
    }



    /** 跳转采购需求 */
    const getRequirementPage = () => {
        router.push({path: '/ppm/purchase-requirement'})
    }

    const getPurchaseContractPage = () => {
        router.push({path: '/ppm/contract'})
    }
    const getConsignmentPage = () => {
        router.push({path: '/ppm/purchase-consignment'})
    }
    const getConsignmentReturnPage = () => {
        router.push({path: '/ppm/consignment-return'})
    }
    const getInboundExceptionPage = () => {
        router.push({path: '/ppm/inbound-exception-handling'})
    }

    //退货率
    const processOptionsData = reactive < EChartsOption > (companyOptions) as EChartsOption

    const getProcessAnalysis = async (timeRange: string[]) => {
        loading.value = true
        try {
            const data = await PpmHomeApi.getCompanyReturnRate(timeRange)
            const names = [];
            const value1 = [];
            const value2 = [];
            const value3 = [];
            for (let i = 0; i < data.length; i++) {
                names.push(data[i].companyName)
                value1.push(data[i].signedAmount)
                value2.push(data[i].rate)
                value3.push(data[i].returnAmount)
            }
            set(
                processOptionsData,
                'xAxis.data',
                names
            )
            set(processOptionsData, 'series', [
                {
                    name: '采购数量',
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
                    name: '退货数量',
                    data: value3,
                    type: 'bar',
                    yAxisIndex: 0,
                }
            ])

        } finally {
            loading.value = false
        }
    }



    //合格率
    const consignmentQmsRateData = reactive < EChartsOption > (consignmentQmsRateOptions) as EChartsOption

    const getConsignmentQmsRate = async (timeRange: string[]) => {
        loading.value = true
        try {
            const data = await PpmHomeApi.getConsignmentQmsRate(timeRange)
            const names = [];
            const value1 = [];
            const value2 = [];
            const value3 = [];
            for (let i = 0; i < data.length; i++) {
                names.push(data[i].no)
                value1.push(data[i].checkAmount)
                value2.push(data[i].rate)
                value3.push(data[i].unQuantityAmount)
            }
            set(
                consignmentQmsRateData,
                'xAxis.data',
                names
            )
            set(consignmentQmsRateData, 'series', [
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




    //采购统计
    const purchaseContractAnalysisData = reactive < EChartsOption > (purchaseContractAnalysisOptions) as EChartsOption

    const purchaseContractAnalysis = async () => {
        loading.value = true
        try {
            const data = await PpmHomeApi.getContractAnalysis(queryParams)
            const names = [];
            const value1 = [];
            const value2 = [];
            for (let i = 0; i < data.length; i++) {
                names.push(data[i].year + '-' + data[i].month)
                value1.push(data[i].price)
                value2.push(data[i].price)
            }
            set(
                purchaseContractAnalysisData,
                'xAxis.data',
                names
            )
            set(purchaseContractAnalysisData, 'series', [
                {
                    name: '金额',
                    data: value2,
                    type: 'line',
                    yAxisIndex: 0,
                    smooth: true
                }
            ])

        } finally {
            loading.value = false
        }
    }



    /** 初始化 **/
    onMounted(() => {
        loading.value = false
        if (checkPermi(['ppm:purchase-consignment:query'])){
            getProcessAnalysis(createTimeRange.value);
            getConsignmentQmsRate(createTimeRangeA.value);
            purchaseContractAnalysis();
        }

    })

</script>
