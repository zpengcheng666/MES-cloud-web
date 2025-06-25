<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品" align="center" prop="materialName"    width="180px"/>
      <el-table-column label="物料类型码" align="center" prop="materialNumber"    width="180px"/>
      <el-table-column label="物料条码" align="center" prop="barCode"    width="180px"/>
      <el-table-column label="物料批次号" align="center" prop="batchNumber"    width="180px"/>
       <el-table-column label="发货数量" align="center" prop="consignedAmount" />
      <el-table-column label="出库数量" align="center" prop="inboundAmount" />
      <el-table-column label="出库人" align="center" prop="inboundBy" />
      <el-table-column
        label="出库时间"
        align="center"
        prop="inboundTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="确认数量" align="center" prop="signedAmount" />
      <el-table-column label="确认人" align="center" prop="signedBy" />
      <el-table-column
        label="确认日期"
        align="center"
        prop="signedTime"
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
      <!--<el-table-column label="物料库存ID" align="center" prop="materialStockId" />-->

      <!--<el-table-column label="物料类型ID" align="center" prop="materialConfigId" />-->
      <!--<el-table-column label="项目ID" align="center" prop="productId" />-->
      <!--<el-table-column label="项目订单ID" align="center" prop="productOrderId" />-->
      <!--<el-table-column label="项目子计划ID" align="center" prop="productPlanId" />-->
      <!--<el-table-column label="合同订单ID" align="center" prop="orderId" />-->
      <el-table-column label="操作" align="center" fixed="right" width="100">
        <template #default="scope">
          <el-button
                  v-if="scope.row.shippingStatus  ==3"
                  link
                  type="primary"
                  @click="handleConfirmDm(scope.row.id)"
                  v-hasPermi="['dm:shipping:update']"
          >
            确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ContractConsignmentApi } from '@/api/ppm/contractconsignment'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  consignmentId: undefined // 发货单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ContractConsignmentApi.getContractConsignmentDetailListByConsignmentId(props.consignmentId)
  } finally {
    loading.value = false
  }
}




/** 出库确认按钮操作 */
const handleConfirmDm = async (id: string) => {
    try {

        await ContractConsignmentApi.confirmShipping(id)
        message.success(t('common.delSuccess'))
        // 刷新列表
        await getList()
    } catch {
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