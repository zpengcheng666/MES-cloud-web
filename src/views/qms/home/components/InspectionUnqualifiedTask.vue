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
      <el-table-column label="物料类码" align="center" prop="materialCode" width="120"/>
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
      <el-table-column label="检验类型" align="center" prop="inspectionSheetType" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_TYPE" :value="scope.row.inspectionSheetType" />
        </template>
      </el-table-column>
      <el-table-column label="检验人员" align="center" prop="assignmentName" />
      <el-table-column label="检测数量" align="center" prop="inspectionQuantity" />
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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionHomeApi.getUnqualifiedTaskList(queryParams)
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
