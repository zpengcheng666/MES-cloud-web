<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="ID" align="center" prop="id" />-->
       <!--<el-table-column label="合同订单ID" align="center" prop="orderId" />-->
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="产品物码" align="center" prop="barCode" />
      <el-table-column label="产品批次" align="center" prop="batchNumber"/>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="退货数量" align="center" prop="consignedAmount" />

    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ConsignmentReturnApi } from '@/api/ppm/consignmentreturn'

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
    list.value = await ConsignmentReturnApi.getConsignmentReturnDetailListByConsignmentReturnId(props.consignmentReturnId)
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
