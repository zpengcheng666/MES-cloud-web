<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="来源单号" align="center" prop="recordNumber" width="120" />
      <el-table-column label="物料类型" align="center" prop="materialConfigName" width="120" />
      <el-table-column label="物料编号" align="center" prop="materialNumber" width="120" />
      <el-table-column label="批次号" align="center" prop="batchNumber" width="120" />
      <el-table-column label="数量" align="center" prop="quantity" width="80" />
      <el-table-column label="检验单来源" align="center" prop="sourceType" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_SOURCE_TYPE" :value="scope.row.sourceType" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openSheetForm(scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:create']"
            v-if="scope.row.status == 0"
          >
            生成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <PaginationSmall
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <InspectionSheetForm ref="sheetFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { InspectionHomeApi } from '@/api/qms/home'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import InspectionSheetForm from "@/views/qms/inspectionsheetgeneratetask/InspectionSheetForm.vue";

/** 检验单 列表 */
defineOptions({ name: 'InspectionSheetGenerateTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetGenerateTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 4,
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionHomeApi.getInspectionGenerateTaskList(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const sheetFormRef = ref()
const openSheetForm = (id: string) => {
  sheetFormRef.value.open(id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
