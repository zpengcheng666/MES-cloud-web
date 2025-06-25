<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { InspectionSheetGenerateTaskDetailApi, InspectionSheetGenerateTaskDetailVO } from '@/api/qms/inspectionsheetgeneratetaskdetail'

/** 检验单生成任务明细 列表 */
defineOptions({ name: 'TaskDetail' })

const props = defineProps<{
  taskId: undefined
}>()

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetGenerateTaskDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  taskId: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (props.taskId) {
      queryParams.taskId = props.taskId
    }
    const data = await InspectionSheetGenerateTaskDetailApi.getInspectionSheetGenerateTaskDetailPage(queryParams)
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

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
