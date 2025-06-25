<template>
  <ContentWrap>
    <el-table v-loading="loading"
              ref="contractTableRef"
              :data="contractList"
              :stripe="true"
              :show-overflow-tooltip="true"
            >
      <el-table-column label="合同编号" align="center" prop="number"  width="160px" />
      <el-table-column label="合同名称" align="center" prop="name"  width="160px" />
      <el-table-column label="合同类别" align="center" prop="contractType" width="80px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="scope.row.contractType" />
        </template>
      </el-table-column>

      <el-table-column label="合同进度" align="center" prop="status" width="100px" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_PROGRESS_STATUS" :value="scope.row.contractProgressStatus" />
        </template>
      </el-table-column>

      <el-table-column label="合同方" align="center" prop="partyName" width="120px" />
      <el-table-column label="签约人" align="center" prop="contactName" width="120px" />
      <el-table-column label="签约时间" align="center" prop="signingDate" :formatter="dateFormatter2" width="120px"/>
      <el-table-column label="签约地点" align="center" prop="signingAddress" width="150px" />
      <el-table-column label="签约部门" align="center" prop="departmentName" width="120px" />
      <el-table-column label="我方签约人" align="center" prop="selfContactName" width="120px" />

      <el-table-column label="合同状态" align="center" prop="status" width="100px" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_STATUS" :value="scope.row.contractStatus" />
        </template>
      </el-table-column>
      <el-table-column label="采购员" align="center" prop="purchaserName" width="120px" />
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

defineOptions({ name: 'PpmPurchaseContract' })

const queryParams = reactive({
    pageNo: 1,
    pageSize: 4,
    type: '1',
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
        const data = await PpmHomeApi.getPurchaseContractPage(queryParams)
        contractList.value = data.list
        contractTotal.value = data.total
    } finally {
        loading.value = false
    }
}


/** 初始化 **/
onMounted(() => {
    getPurchaseRequireList()
})

</script>
