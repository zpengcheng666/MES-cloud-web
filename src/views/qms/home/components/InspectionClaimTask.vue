<template>
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="检验单号" align="center" prop="sheetNo" width="200"/>
      <el-table-column label="生产单号" align="center" prop="recordNumber" width="200"/>
      <el-table-column label="物料编号" align="center" prop="materialNumber" width="180"/>
      <el-table-column label="物料名称" align="center" prop="materialName" width="100" />
      <el-table-column label="质检状态" align="center" prop="status" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_SCHEME_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="方案类型" align="center" prop="schemeType" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_SCHEME_TYPE" :value="scope.row.schemeType" />
        </template>
      </el-table-column>
      <el-table-column label="分配类型" align="center" prop="assignmentType" width="120"  >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_ASSIGNMENT_TYPE" :value="scope.row.assignmentType" />
        </template>
      </el-table-column>
      <el-table-column label="检测数量" align="center" prop="inspectionQuantity" />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click.prevent.stop="claimTask(scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:update']"
          >
            认领
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <PaginationSmall
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { InspectionHomeApi } from '@/api/qms/home'
import { InspectionSheetApi, InspectionSheetVO } from '@/api/qms/inspectionsheet'

/** 检验单 列表 */
defineOptions({ name: 'InspectionSheetTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 4,
})
const queryFormRef = ref() // 搜索的表单

/**
 * 任务认领
 * @param row
 */
const claimTask = async (id) => {
  try {
    await message.confirm('是否确认认领当前任务！！')
    await InspectionSheetApi.updateInspectionSheetSchemeClaim(id)
    message.success(t('认领成功'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionHomeApi.getInspectionClaimTaskList(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
