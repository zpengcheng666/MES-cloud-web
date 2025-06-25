<template>
  <ContentWrap>
    <el-table v-loading="loading"
              ref="contractTableRef"
              :data="consignmentList"
              :stripe="true"
              :show-overflow-tooltip="true"
              >
      <el-table-column label="入库单号" align="center" prop="no" />
      <el-table-column label="应收数量" align="center" prop="consignedAmount" />
      <el-table-column label="实收数量" align="center" prop="signedAmount" />
      <el-table-column label="收货人" align="center" prop="creator" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_EXCEPTION_HANDLE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="consignmentType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_TYPE" :value="scope.row.consignmentType" />
        </template>
      </el-table-column>
      <el-table-column label="异常类型" align="center" prop="exceptionType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_EXCEPTION_REASON" :value="scope.row.exceptionType" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <PaginationSmall
            :total="consignmentTotal"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getPurchaseConsignmentList"
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

defineOptions({ name: 'PpmPurchaseConsignment' })

const queryParams = reactive({
    pageNo: 1,
    consignmentName: undefined,
    pageSize: 4,
    contractNo: undefined,
    contractId: undefined,
    no: undefined,
    consignedBy: undefined,
    consignedDate: [],
    consignedContact: undefined,
    consigner: undefined,
    consignerContact: undefined,
    consignerDate: [],
    deliveryMethod: undefined,
    deliveryNumber: undefined,
    deliveryBy: undefined,
    deliveryContact: undefined,
    createTime: [],
    processInstanceId: undefined,
    status: undefined,
})
const router = useRouter() // 路由
const { t } = useI18n()
const userStore = useUserStore()
const consignmentList = ref<ContractVO[]>([]) // 列表的数据
const consignmentTotal = ref(0) // 列表的总页数
const loading = ref(true)

const getPurchaseConsignmentList = async () => {
    loading.value = true
    try {
        const data = await PpmHomeApi.getInboundExceptionHandlingPage(queryParams)
        consignmentList.value = data.list
        consignmentTotal.value = data.total
    } finally {
        loading.value = false
    }
}


/** 初始化 **/
onMounted(() => {
    getPurchaseConsignmentList()
})

</script>
