<template>
  <ContentWrap>
    <el-table v-loading="loading"
              ref="contractTableRef"
              :data="contractList"
              :stripe="true"
              :show-overflow-tooltip="true"
              >
      <el-table-column label="交货状态" align="center" prop="leadStatus" width="80px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_LEAD_STATUS" :value="scope.row.leadStatus" />
        </template>
      </el-table-column>
      <el-table-column label="物料" align="center" prop="materialName"  width="140px" />
      <el-table-column label="合同编号" align="center" prop="number"  width="180px" />
      <el-table-column label="合同名称" align="center" prop="name"  width="140px" />
      <el-table-column label="订单数量" align="center" prop="quantity" width="80px" />
      <el-table-column label="生产进度" align="center" prop="rate" width="80px" >
        <template #default="{row}">
          <!--<el-progress :percentage="row.schemeProcess" :stroke-width="20" text-inside :color="customColors" />-->
          <el-progress  :percentage="row.rate" :stroke-width="20" text-inside :color="customColors" />
        </template>
      </el-table-column>
      <el-table-column label="交货数量" align="center" prop="finishQuantity" width="80px" />
      <el-table-column label="生产完成数量" align="center" prop="completed" width="120px" />
      <el-table-column label="交货日期" align="center" prop="leadDate" :formatter="dateFormatter2" width="120px"/>

    </el-table>
    <!-- 分页 -->
    <PaginationSmall
            :total="contractTotal"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getPurchaseRequireList"
    />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { formatTime } from '@/utils'
import { dateFormatter2 } from '@/utils/formatTime'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {defaultProps} from "@/utils/tree";
import {PpmHomeApi} from "@/api/home/ppm";
import {ElTable} from "element-plus";
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'PpmShippingContractExecution' })

const queryParams = reactive({
    pageNo: 1,
    pageSize: 4,
    type: '2',
    number: undefined,
    name: undefined,
    party: undefined,
    contact: undefined,
    signingDate: [] as any,
    signingAddress: undefined,
    department: undefined,
    selfContact: undefined,
    vat: undefined,
    currency: undefined,
    delivery: undefined,
    contractStatus: undefined,
    status: undefined,
    purchaser: undefined,
    remark: undefined,
    createTime: [],
    creationIp: undefined,
    updatedIp: undefined,
})
const router = useRouter() // 路由
const { t } = useI18n()
const userStore = useUserStore()
const contractList = ref<ContractVO[]>([]) // 列表的数据
const contractTotal = ref(0) // 列表的总页数
const loading = ref(true)

const getPurchaseRequireList = async () => {
    loading.value = true
    try {
        const data = await PpmHomeApi.getContractShippingDetailPage(queryParams)
        contractList.value = data.list
        contractTotal.value = data.total
    } finally {
        loading.value = false
    }
}
const customColors = [
    { color: '#f5363b', percentage: 20 },
    { color: '#e6b554', percentage: 40 },
    { color: '#e6e42c', percentage: 60 },
    { color: '#534cfa', percentage: 80 },
    { color: '#20d33a', percentage: 100 },
]


/** 初始化 **/
onMounted(() => {
    getPurchaseRequireList()
})

</script>
