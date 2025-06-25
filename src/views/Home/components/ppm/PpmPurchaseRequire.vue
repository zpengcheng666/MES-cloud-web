<template>
  <ContentWrap>
    <el-table v-loading="loading"
              ref="contractTableRef"
              :data="requireList"
              :stripe="true"
              :show-overflow-tooltip="true"
              >
      <el-table-column label="源单类型" align="center" prop="sourceType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_SOURCE_TYPE" :value="row.sourceType" />
        </template>
      </el-table-column>

      <el-table-column label="源单类型" align="center" prop="planType" >
        <template #default="{ row }">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE_FOR" :value="row.planType" />
        </template>
      </el-table-column>
      <el-table-column label="需求物料" align="center" prop="requiredMaterialName" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="需求数量" align="center" prop="requiredQuantity" />
      <el-table-column label="已采数量" align="center" prop="purchasedQuantity" />
      <el-table-column label="需求时间" :formatter="dateFormatter2" align="center" prop="requiredDate" />
      <el-table-column label="预算单价" align="center" prop="estimatedPrice" />
      <el-table-column label="供应商" align="center" prop="supplier" />

      <el-table-column label="采购类型" align="center" prop="type" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="申请部门" align="center" prop="applicationDepartment" />
      <el-table-column
              label="申请日期"
              align="center"
              prop="applicationDate"
              :formatter="dateFormatter2"
              width="180px"
      />
      <el-table-column label="申请理由" align="center" prop="applicationReason" />
    </el-table>
    <!-- 分页 -->
    <PaginationSmall
            :total="requireTotal"
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

defineOptions({ name: 'PpmPurchaseRequire' })

const queryParams = reactive({
    pageNo: 1,
    pageSize: 4,
    type: undefined,
    applicant: undefined,
    applicationDepartment: undefined,
    applicationDate: [],
    applicationReason: undefined,
    isValid: 1,
    status: 2
})
const router = useRouter() // 路由
const { t } = useI18n()
const userStore = useUserStore()
const requireList = ref<ContractVO[]>([]) // 列表的数据
const requireTotal = ref(0) // 列表的总页数
const loading = ref(true)

const getPurchaseRequireList = async () => {
    loading.value = true
    try {
        const data = await PpmHomeApi.getPurchaseRequirementPage(queryParams)
        requireList.value = data.list
        requireTotal.value = data.total
    } finally {
        loading.value = false
    }
}


/** 初始化 **/
onMounted(() => {
    getPurchaseRequireList()
})

</script>
