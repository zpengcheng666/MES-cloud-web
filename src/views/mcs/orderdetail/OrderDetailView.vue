<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="index" width="50" />
      <el-table-column label="零件编号" align="center" prop="detailNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="当前单元" align="center" prop="processingUnitName" />
      <el-table-column label="当前外协厂家" align="center" prop="aidMill" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <DictTag :type="'mcs_order_detail_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="batchDetailShow(scope.row)"
          >
            详情
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:order-detail:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <OrderDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderDetailApi, OrderDetailVO } from '@/api/mcs/orderdetail'
import OrderDetailForm from './OrderDetailForm.vue'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import { onMounted } from 'vue'

/** 生产订单详情 列表 */
defineOptions({ name: 'OrderDetailView' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OrderDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNumber: undefined,
  barCode: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const props = defineProps<{
  orderId: undefined, // 申请id（主表的关联字段）
  orderNumber: undefined
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (props.orderId) {
      queryParams.orderId = props.orderId
    }
    const data = await OrderDetailApi.getOrderDetailPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const emit = defineEmits(['batchDetailShow'])
const batchDetailShow = (row: any) => {
  row.orderNumber = props.orderNumber
  emit('batchDetailShow', row);
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OrderDetailApi.deleteOrderDetail(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OrderDetailApi.exportOrderDetail(queryParams)
    download.excel(data, '生产订单详情.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
