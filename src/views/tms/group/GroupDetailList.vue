<template>
    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="物料名称" align="center" prop="materialName" />
        <el-table-column label="物料编号" align="center" prop="materialNumber" />
        <el-table-column label="物料类别" align="center" prop="materialType" />
        <el-table-column label="物料类码" align="center" prop="materialCode" />
        <el-table-column label="型号" align="center" prop="toolModel" />
        <el-table-column label="重量" align="center" prop="toolWeight" />
        <el-table-column label="材质" align="center" prop="toolTexture" />
        <el-table-column label="涂层" align="center" prop="toolCoating" />
        <el-table-column label="刀位" align="center" prop="site" />
        <el-table-column label="数量" align="center" prop="count" />
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
import { ToolGroupDetailApi, ToolGroupDetailVO } from '@/api/tms/groupdetail'

  
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    creator: undefined
  })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  toolGroupId: undefined,
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.toolGroupId = props.toolGroupId
    const data = await ToolGroupDetailApi.getToolGroupDetailPage(queryParams)
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

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
