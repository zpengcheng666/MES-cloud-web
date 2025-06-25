<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="产品" align="center" prop="materialName"  width="200px"/>
      <el-table-column label="产品物码" align="center" prop="barCode"  width="200px"/>
      <el-table-column label="产品批次" align="center" prop="batchNumber"/>
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="发货数量" align="center" prop="consignedAmount" />
      <el-table-column label="出库数量" align="center" prop="outboundAmount"  width="80px"/>
      <!--<el-table-column label="出库人" align="center" prop="outboundBy" />-->
      <el-table-column label="状态" align="center" width="160" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus"/>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="出库日期"-->
      <!--align="center"-->
      <!--prop="outboundTime"-->
      <!--:formatter="dateFormatter"-->
      <!--width="180px"-->
      <!--/>-->
      <!--<el-table-column label="确认数量" align="center" prop="signedAmount" />-->
      <!--<el-table-column label="确认人" align="center" prop="signedBy" />-->
      <!--<el-table-column-->
      <!--label="确认日期"-->
      <!--align="center"-->
      <!--prop="signedTime"-->
      <!--:formatter="dateFormatter"-->
      <!--width="180px"-->
      <!--/>-->
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
import { ShippingInstorageReturnApi } from '@/api/dm/shippinginstoragereturn'
import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  shippingStorageReturnId: undefined // 收货单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ShippingInstorageReturnApi.getShippingInstorageReturnDetailListByShippingStorageReturnId(props.shippingStorageReturnId)
  } finally {
    loading.value = false
  }
}





/** 出库确认按钮操作 */
const handleConfirmDm = async (id: string) => {
    try {

        await ShippingInstorageReturnApi.confirmShipping(id)
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