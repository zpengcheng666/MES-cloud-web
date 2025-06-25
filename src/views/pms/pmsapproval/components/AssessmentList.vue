<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
       <el-table-column label="发起原因" align="center" prop="reasonType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_REASON" :value="scope.row.reasonType" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="assessmentType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_CATEGORY" :value="scope.row.assessmentType" />
        </template>
      </el-table-column>
      <el-table-column label="评估人" align="center" prop="assessmentPerson" />
      <el-table-column label="评估说明" align="center" prop="instruction" />
      <el-table-column label="结论" align="center" prop="conclusion">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_CONCLUSION" :value="scope.row.conclusion" />
        </template>
      </el-table-column>
      <el-table-column label="技术评估状态" align="center" prop="technologyAssessmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="scope.row.technologyAssessmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="产能评估状态" align="center" prop="capacityAssessmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="scope.row.capacityAssessmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="成本评估状态" align="center" prop="costAssessmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="scope.row.costAssessmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="策略评估状态" align="center" prop="strategyAssessmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="scope.row.strategyAssessmentStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="预计完成时间"
        align="center"
        prop="prefinishTime"
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
import { ApprovalApi } from '@/api/pms/pmsapproval'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ApprovalApi.getAssessmentListByProjectId(props.projectId)
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
