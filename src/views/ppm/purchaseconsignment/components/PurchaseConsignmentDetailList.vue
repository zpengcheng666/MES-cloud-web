<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品编号" align="center" prop="materialNumber"  />
      <el-table-column label="产品" align="center" prop="materialName" />
      <el-table-column label="单位" align="center" prop="materialUnit"  />
      <el-table-column label="采购数量" align="center" prop="consignedAmount" />
      <el-table-column label="收货数量" align="center" prop="signedAmount" />
      <el-table-column label="收货人" align="center" prop="signedBy" />
      <el-table-column
        label="签收日期"
        align="center"
        prop="signedTime"
        :formatter="dateFormatter"
      />
      <el-table-column label="状态" align="center" prop="consignmentStatus" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { PurchaseConsignmentApi } from '@/api/ppm/purchaseconsignment'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  consignmentId: undefined // 收货单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(props.consignmentId)
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
