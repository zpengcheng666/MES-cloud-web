<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="发货单编号" align="center" prop="shippingNo" />
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="产品" align="center" prop="materialName"  width="150px"/>
      <el-table-column label="产品物码" align="center" prop="barCode"  width="150px"/>
      <el-table-column label="产品批次" align="center" prop="batchNumber"  width="170px"/>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="退货数量" align="center" prop="consignedAmount" />

      <el-table-column label="签收数量" align="center" prop="signedAmount" />
      <el-table-column label="签收人" align="center" prop="signedBy" />
      <el-table-column
              label="签收日期"
              align="center"
              prop="signedTime"
              :formatter="dateFormatter"
              width="180px"
      />

      <el-table-column label="入库数量" align="center" prop="inboundAmount" />
      <el-table-column label="入库人" align="center" prop="inboundBy" />
      <el-table-column
              label="入库时间"
              align="center"
              prop="inboundTime"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ContractConsignmentReturnApi } from '@/api/ppm/contractconsignmentreturn'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  consignmentReturnId: undefined // 退货单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ContractConsignmentReturnApi.getContractConsignmentReturnDetailListByConsignmentReturnId(props.consignmentReturnId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>