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
      <el-form-item label="项目" prop="projectId">
        <el-select
          v-model="queryParams.projectId"
          placeholder="请选择项目"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发起原因" prop="conclusion">
        <el-select
          v-model="queryParams.reasonType"
          placeholder="请选择发起原因"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PMS_ASSESSMENT_REASON)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="状态" prop="assessmentStatus">-->
        <!--<el-select-->
          <!--v-model="queryParams.assessmentStatus"-->
          <!--placeholder="请选择状态"-->
          <!--clearable-->
          <!--class="!w-240px"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="结论" prop="conclusion">
        <el-select
          v-model="queryParams.conclusion"
          placeholder="请选择结论"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.PMS_ASSESSMENT_CONCLUSION)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--plain-->
          <!--@click="openForm('create')"-->
          <!--v-hasPermi="['pms:assessment:create']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:plus" class="mr-5px" /> 新增-->
        <!--</el-button>-->
        <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--@click="handleExport"-->
          <!--:loading="exportLoading"-->
          <!--v-hasPermi="['pms:assessment:export']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:download" class="mr-5px" /> 导出-->
        <!--</el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="assessmentReplenish">
            <el-tab-pane label="评审子表" name="assessmentReplenish">
              <AssessmentReplenishList :assessment-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>

      <el-table-column label="项目名" align="center" prop="projectName" />

      <el-table-column label="发起原因" align="center" prop="reasonType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_REASON" :value="scope.row.reasonType" />
        </template>
      </el-table-column>
      <el-table-column label="评估说明" align="center" prop="instruction" />
      <el-table-column label="结论" align="center" prop="conclusion">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_CONCLUSION" :value="scope.row.conclusion" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter2"
        width="100px"
      />
      <el-table-column
        label="预计完成时间"
        align="center"
        prop="prefinishTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
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
      <el-table-column align="center" label="审批状态" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180px">
        <template #default="scope">
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--v-hasPermi="['pms:assessment:update']"-->
          <!--&gt;-->
            <!--编辑-->
          <!--</el-button>-->
          <el-button
            v-hasPermi="['pms:assessment:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['pms:assessment:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['pms:assessment:delete']"
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
  <AssessmentForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { AssessmentApi, AssessmentVO } from '@/api/pms/assessment'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import AssessmentForm from './AssessmentForm.vue'
import AssessmentReplenishList from './components/AssessmentReplenishList.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** 项目评审 列表 */
defineOptions({ name: 'Assessment' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<AssessmentVO[]>([]) // 列表的数据
const projectList = ref([]) // 项目列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectId: undefined,
  assessmentStatus: undefined,
  conclusion: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AssessmentApi.getAssessmentPage(queryParams)
    console.log(data)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AssessmentApi.deleteAssessment(id)
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
    const data = await AssessmentApi.exportAssessment(queryParams)
    download.excel(data, '项目评审.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 详情操作 */
const handleDetail = (row) => {
  push({
    name: 'PMSAssessmentDetail',
    query: {
      id: row.id
    }
  })
}

/** 审批进度 */
const handleProcessDetail = (row) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}
const getProjectList = async ()=>{
  projectList.value =await ApprovalApi.getApprovalAll()
}
/** 初始化 **/
onMounted(() => {
  getList()
  getProjectList()
})
</script>
