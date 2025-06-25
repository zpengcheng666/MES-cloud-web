<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <!--<el-table-column label="产品编号" align="center" prop="materialId" />-->
      <el-table-column label="产品图号" align="center" prop="partNumber" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="带料加工" align="center" prop="processType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PROCESS_TYPE" :value="scope.row.processType" />
        </template>
      </el-table-column>
      <el-table-column
        label="原料交付时间"
        align="center"
        prop="materialDeliveryTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="成品交付时间"
        align="center"
        prop="fproDeliveryTime"
        :formatter="dateFormatter2"
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
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { OrderApi } from '@/api/pms/order'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectOrderId: undefined // 项目订单id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await OrderApi.getOrderListByProjectOrderId(props.projectOrderId)
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
