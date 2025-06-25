<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
      <!--<el-table-column label="审核人id" align="center" prop="auditor" />-->
      <el-table-column label="审核人" align="center" prop="username" />
      <el-table-column label="审核建议" align="center" prop="suggestion" />
      <el-table-column
        label="审核日期"
        align="center"
        prop="auditDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="评审类型" align="center" prop="assessmentType" />
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
import { dateFormatter } from '@/utils/formatTime'
import { AssessmentApi } from '@/api/pms/assessment'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  assessmentId: undefined // 评审表id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await AssessmentApi.getAssessmentReplenishListByAssessmentId(props.assessmentId)
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
