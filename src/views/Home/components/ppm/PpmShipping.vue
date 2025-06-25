<template>
  <ContentWrap>
    <el-table v-loading="loading"
              ref="contractTableRef"
              :data="consignmentList"
              :stripe="true"
              :show-overflow-tooltip="true"
             >
      <el-table-column label="发货单号" align="center" prop="no" width="180"/>
      <el-table-column label="合同编号" align="center" prop="contractNo" width="180" />
      <el-table-column label="项目名" align="center" prop="projectName" width="180"/>
      <el-table-column label="项目编号" align="center" prop="projectCode" width="180"/>

      <el-table-column label="状态" align="center" width="160" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus"/>
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

defineOptions({ name: 'PpmShipping' })

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
        const data = await PpmHomeApi.getShippingPage(queryParams)
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
