<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="设备" prop="stationId">
        <el-select-v2
          v-model="queryParams.stationId"
          :options="ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="问题类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择问题类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_problem_report_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="上报id" prop="reportId">
        <el-input
          v-model="queryParams.reportId"
          placeholder="请输入上报id"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-select-v2
          v-model="queryParams.status"
          :options="getIntDictOptions('mcs_problem_report_status')"
          filterable
          clearable
          placeholder="请选择状态"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['mcs:problem-report:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:problem-report:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备" align="center" prop="stationId">
        <template #default="scope">
          {{ getLedgerName(scope.row.stationId) }}
        </template>
      </el-table-column>
      <el-table-column label="问题类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag type="mcs_problem_report_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="上报实体" align="center" prop="entity" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag type="mcs_problem_report_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="最后内容" align="center" prop="content">
        <template #default="scope">
          {{ getLastContent(scope.row.content).value }}
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
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['mcs:problem-report:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleOK(scope.row.id)"
            v-hasPermi="['mcs:problem-report:update']"
          >
            已解决
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:problem-report:delete']"
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
  <ProblemReportForm ref="formRef" @success="getList" :ledgerList="ledgerList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProblemReportApi, ProblemReportVO } from '@/api/mcs/problemreport'
import ProblemReportForm from './ProblemReportForm.vue'

/** 问题上报 列表 */
defineOptions({ name: 'ProblemReport' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProblemReportVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  stationId: undefined,
  type: undefined,
  reportId: undefined,
  status: undefined,
  content: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProblemReportApi.getProblemReportPage(queryParams)
    list.value = data.list
    total.value = data.total
    list.value = await Promise.all(
      list.value.map(async (v) => {
        return {
          ...v,
          entity: await codeToEntity(v.type, v.reportId)
        }
      })
    )
    await getLedgerList()
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProblemReportApi.deleteProblemReport(id)
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
    const data = await ProblemReportApi.exportProblemReport(queryParams)
    download.excel(data, '问题上报.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/***********************已解决*****************************/

async function handleOK(id) {
  await ProblemReportApi.updateProblemReport({
    id: id,
    status: '2'
  } as any)
  await getList()
}

/***************************关联设备***************************/

const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    ledgerList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}
const getLedgerName = (id: string): string => {
  let str = ''
  for (let v of ledgerList.value) {
    if (v.id == id) {
      str = v.name
    }
  }
  return str
}

/*********************相关内容***************************/

import { LedgerApi } from '@/api/dms/ledger' //设备
import { BatchRecordApi } from '@/api/mcs/batchRecord' //任务
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail' //工序
import { BatchDetailApi } from '@/api/mcs/batchdetail' //物料

//将报编号转为文字
async function codeToEntity(type, id) {
  switch (type) {
    case 0: //设备
      {
        let data = await LedgerApi.getLedger(id)
        return data?.code
      }
      break
    case 1: //任务
      {
        let data = await BatchRecordApi.getBatchRecord(id)
        return data?.number
      }
      break
    case 2: //工艺
      {
        let data = await ProcessPlanDetailApi.getProcedure(id)
        return data?.procedureName
      }
      break
    case 3: //物料
      {
        let data = await BatchDetailApi.getBatchDetail(id)
        return data?.partBatchNumber
      }
      break
  }
}

//获得最后一条内容数据
function getLastContent(v) {
  let data: any[] = JSON.parse(v)
  return data[data.length - 1]
}
</script>
