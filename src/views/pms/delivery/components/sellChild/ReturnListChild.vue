<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" width="60" />
      <!--<el-table-column label="产品名称" align="center" prop="materialName" />-->
      <!--<el-table-column label="编号" align="center" prop="materialNumber" />-->
      <!--<el-table-column label="类码" align="center" prop="materialCode" />-->
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <!--<el-table-column label="计量单位" align="center" prop="materialUnit" />-->
      <el-table-column label="发货数量" align="center" prop="consignedAmount" />
      <el-table-column label="确认数量" align="center" prop="signedAmount" />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { ShippingReturnApi } from '@/api/dm/shippingreturn/index'
import { PurchaseConsignmentApi } from '@/api/ppm/purchaseconsignment'
import { DeliveryApi } from '@/api/pms/delivery'

/** pms 项目交付 销售明细 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  // shippingReturnId: undefined, // 项目id（主表的关联字段）
  orderId: undefined //
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    //list.value = await ShippingReturnApi.getShippingReturnDetailListByShippingReturnId(props.shippingReturnId);
    //list.value = await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(props.shippingReturnId)
    //list.value = await DeliveryApi.getShippingDetailByProjectOrderId(props.orderId)

    const data = await DeliveryApi.getPurchaseDetailByProjectOrderId(props.orderId);
    list.value = data.filter((item)=>{
      return item.consignmentType === 5
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
