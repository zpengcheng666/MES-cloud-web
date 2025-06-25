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
      <el-form-item label="工具名称" prop="toolName">
        <el-input
          v-model="queryParams.toolName"
          placeholder="请输入工具名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="送检日期" prop="verificationDateBegin">
        <el-date-picker
          v-model="queryParams.verificationDateBegin"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="送检日期"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="实际送检日期" prop="verificationDateBeginAct">
        <el-date-picker
          v-model="queryParams.verificationDateBeginAct"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="实际送检日期"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="送检完成时间" prop="verificationDateEnd">
        <el-date-picker
          v-model="queryParams.verificationDateEnd"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="送检完成时间"
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_TOOL_VERIFICATION_STATUS)"
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
<!--          v-hasPermi="['qms:inspection-tool-verification-record:create']"-->
<!--        >-->
<!--          <Icon icon="ep:plus" class="mr-5px" /> 新增-->
<!--        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['qms:inspection-tool-verification-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="工具名称" align="center" prop="toolName" />
      <el-table-column
        label="送检日期"
        align="center"
        prop="verificationDateBegin"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="实际送检时间"
        align="center"
        prop="verificationDateBeginAct"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="完成时间"
        align="center"
        prop="verificationDateEnd"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="送检结果" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_TOOL_VERIFICATION_STATUS" :value="scope.row.status" />
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
            @click="openForm('update', scope.row.id, 1)"
            v-hasPermi="['qms:inspection-tool-verification-record:update']"
            v-if="scope.row.status==0"
          >
            送检
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id, 2)"
            v-hasPermi="['qms:inspection-tool-verification-record:update']"
            v-else-if="scope.row.status==1"
          >
            完成
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
  <InspectionToolVerificationRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { InspectionToolVerificationRecordApi, InspectionToolVerificationRecordVO } from '@/api/qms/inspectiontoolverificationrecord'
import InspectionToolVerificationRecordForm from './InspectionToolVerificationRecordForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 检验工具校准记录 列表 */
defineOptions({ name: 'InspectionToolVerificationRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionToolVerificationRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  toolName: undefined,
  verificationDateBegin: undefined,
  verificationDateBeginAct: undefined,
  verificationDateBegin: [],
  verificationDateEnd: undefined,
  verificationDateEnd: [],
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionToolVerificationRecordApi.getInspectionToolVerificationRecordPage(queryParams)
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
const openForm = (type: string, id?: number, status: number) => {
  formRef.value.open(type, id, status)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await InspectionToolVerificationRecordApi.deleteInspectionToolVerificationRecord(id)
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
    const data = await InspectionToolVerificationRecordApi.exportInspectionToolVerificationRecord(queryParams)
    download.excel(data, '检验工具校准记录.xls')
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
