<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="检验单名称" prop="sheetName">
        <el-input
          v-model="queryParams.sheetName"
          placeholder="请输入检验单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="检验单号" prop="sheetNo">
        <el-input
          v-model="queryParams.sheetNo"
          placeholder="请输入检验单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="来源单号" prop="recordNumber">
        <el-input
          v-model="queryParams.recordNumber"
          placeholder="请输入来源单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="检验单来源" prop="sourceType">
        <el-select
          v-model="queryParams.sourceType"
          placeholder="请选择检验单来源"
          clearable
          class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_SOURCE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_GENERATE_TASK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          @click="openForm('create')"-->
<!--          v-hasPermi="['qms:inspection-sheet-generate-task:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="TaskDetail">
            <el-tab-pane label="详情" name="TaskDetail">
              <TaskDetailList :task-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="检验单名称" align="center" prop="sheetName" />
<!--      <el-table-column label="检验单号" align="center" prop="sheetNo" />-->
      <el-table-column label="来源单号" align="center" prop="recordNumber" />
      <el-table-column label="物料类型" align="center" prop="materialConfigName" />
      <el-table-column label="物料编号" align="center" prop="materialNumber" />
      <el-table-column label="批次号" align="center" prop="batchNumber" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_GENERATE_TASK_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="检验单来源" align="center" prop="sourceType" >
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
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openSheetForm(scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:create']"
            v-if="scope.row.status == 0"
          >
            生成检验单
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['qms:inspection-sheet-generate-task:delete']"
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
  <InspectionSheetForm ref="sheetFormRef" @success="getList" />

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { InspectionSheetGenerateTaskApi, InspectionSheetGenerateTaskVO } from '@/api/qms/inspectionsheetgeneratetask'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import TaskDetailList from './TaskDetail.vue'
import InspectionSheetForm from "./InspectionSheetForm.vue";

/** 检验单 列表 */
defineOptions({ name: 'InspectionSheetGenerateTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetGenerateTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  sheetName: undefined,
  sheetNo: undefined,
  recordNumber: undefined,
  status: undefined,
  sourceType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionSheetGenerateTaskApi.getInspectionSheetGenerateTaskPage(queryParams)
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
const sheetFormRef = ref()
const openSheetForm = (id: string) => {
  sheetFormRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await InspectionSheetGenerateTaskApi.deleteInspectionSheetGenerateTask(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
