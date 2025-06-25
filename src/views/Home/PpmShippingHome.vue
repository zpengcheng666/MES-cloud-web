<template>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px"    v-if="checkPermi(['dm:shipping:query'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>销售金额统计</span>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <Echart :options="shippingContractAnalysisData" :height="300"/>

            </el-skeleton>
        </el-card>
    </el-col>


    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['dm:shipping:query'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>销售合同</span>
                    <el-link type="primary" :underline="false" @click="getDmContractPage">{{ t('action.more')
                        }}
                    </el-link>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>
                <PpmShippingContract/>
            </el-skeleton>
        </el-card>
    </el-col>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['dm:shipping:query'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>合同交货情况</span>
                    <el-link type="primary" :underline="false" @click="getDmContractPage">{{ t('action.more')
                        }}
                    </el-link>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>
                <PpmShippingContractExecution/>
            </el-skeleton>
        </el-card>
    </el-col>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['dm:shipping:query'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>销售发货单</span>
                    <el-link type="primary" :underline="false" @click="getConsignmentPage">{{ t('action.more') }}
                    </el-link>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <PpmShipping/>

            </el-skeleton>
        </el-card>
    </el-col>

    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px"  v-if="checkPermi(['dm:shipping:query'])">
        <el-card shadow="never" style="height: 400px">
            <template #header>
                <div class="h-3 flex justify-between">
                    <span>销售退货单</span>
                    <el-link type="primary" :underline="false" @click="getConsignmentReturnPage">{{ t('action.more') }}
                    </el-link>
                </div>
            </template>
            <el-skeleton :loading="loading" animated>

                <PpmShippingReturn/>

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
    import PpmShippingContract from './components/ppm/PpmShippingContract.vue'
    import PpmPurchaseConsignment from './components/ppm/PpmPurchaseConsignment.vue'
    import PpmConsignmentReturn from './components/ppm/PpmConsignmentReturn.vue'
    import PpmShippingContractExecution from './components/ppm/PpmShippingContractExecution.vue'
    import PpmInboundException from './components/ppm/PpmInboundException.vue'
    import PpmShipping from './components/ppm/PpmShipping.vue'
    import PpmShippingReturn from './components/ppm/PpmShippingReturn.vue'
    import { shippingContractAnalysisOptions} from './components/ppm/ppm-echarts-data'
    import { checkPermi } from '@/utils/permission';

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
        type: 2,
        applicant: undefined,
        applicationDepartment: undefined,
        applicationDate: [],
        applicationReason: undefined,
        isValid: 1,
        status: 2
    })


    /** 跳转采购需求 */
    const getRequirementPage = () => {
        router.push({path: '/ppm/purchase-requirdement'})
    }

    const getDmContractPage = () => {
        router.push({path: '/dm/dmContract'})
    }
    const getConsignmentPage = () => {
        router.push({path: '/dm/shipping'})
    }
    const getConsignmentReturnPage = () => {
        router.push({path: '/dm/shipping-return'})
    }
    const getInboundExceptionPage = () => {
        router.push({path: '/ppm/inbound-exception-handling'})
    }


    //销售统计
    const shippingContractAnalysisData = reactive < EChartsOption > (shippingContractAnalysisOptions) as EChartsOption

    const getShippingContractAnalysis = async () => {
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
                shippingContractAnalysisData,
                'xAxis.data',
                names
            )
            set(shippingContractAnalysisData, 'series', [
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
        if (checkPermi(['dm:shipping:query'])) {
            getShippingContractAnalysis();
        }

    })

</script>
