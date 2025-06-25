<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="序号" type="index" width="60" />-->
      <!--<el-table-column label="产品名称" align="center" prop="materialName" />-->
      <!--<el-table-column label="编号" align="center" prop="materialNumber" />-->
      <!--<el-table-column label="类码" align="center" prop="materialCode" />-->
      <!--<el-table-column label="计量单位" align="center" prop="materialUnit" />-->
      <!--<el-table-column label="发货数量" align="center" prop="consignedAmount" />-->
      <!--<el-table-column label="确认数量" align="center" prop="signedAmount" />-->
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="发货数量" align="center" prop="consignedAmount" />
      <el-table-column label="确认数量" align="center" prop="signedAmount" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { PurchaseConsignmentApi } from '@/api/ppm/purchaseconsignment/index'
import { DeliveryApi } from '@/api/pms/delivery'


/** pms 项目交付 销售明细 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  purchaseId: undefined //
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    //list.value = await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(props.purchaseId);
    const data = await DeliveryApi.getPurchaseDetailByPurchaseId(props.purchaseId)
    list.value = data.filter((item)=>{
      return item.consignmentType === 1||item.consignmentType===2;
    })
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
