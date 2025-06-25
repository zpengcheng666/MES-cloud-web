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
      <el-form-item label="项目编码" prop="projectCode">
        <el-input
          v-model="queryParams.projectCode"
          placeholder="请输入项目编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select
          v-model="queryParams.projectType"
          placeholder="请选择项目类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROJECT_TYPE)"
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
      <el-form-item label="项目状态" prop="projectStatus">
        <el-select
          v-model="queryParams.projectStatus"
          placeholder="请选择项目状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROJECT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="立项id" align="center" prop="id" />-->
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目类型" align="center" prop="projectType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PROJECT_TYPE" :value="scope.row.projectType" />
        </template>
      </el-table-column>
      <el-table-column label="项目来源" align="center" prop="projectClientName" />
      <!--<el-table-column label="项目合同" align="center" prop="projectContract" />-->
      <el-table-column label="项目预算(万元)" align="center" prop="budget" />
      <!--<el-table-column label="客户" align="center" prop="projectClient" />-->
      <!--<el-table-column label="项目简述" align="center" prop="description" />-->
      <el-table-column
        label="预计开始时间"
        align="center"
        prop="prestartTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="预计结束时间"
        align="center"
        prop="preendTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column label="负责人" align="center" prop="responsiblePersonName" />
      <el-table-column label="项目经理" align="center" prop="projectManagerName" />
      <el-table-column label="项目状态" width="100px" align="center" prop="projectStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PROJECT_STATUS" :value="scope.row.projectStatus" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="180px">
        <template #default="scope">
          <el-button
            v-hasPermi="['pms:approval:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>

          <el-button
            v-hasPermi="['pms:approval:update']"
            link
            type="primary"
            @click="handleClose(scope.row)"
          >
            项目结算关闭
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
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { ContractApi, ContractVO } from '@/api/ppm/contract'

/** pms 项目验收 */
defineOptions({ name: 'PmsAcceptance' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<ApprovalVO[]>([]) // 列表的数据
// const assessmentList = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectCode: undefined,
  projectName: undefined,
  projectType: undefined,
  projectStatus: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApprovalApi.getApprovalPage(queryParams)
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


/** 详情操作 */
const handleDetail =async (row) => {
  push({
    name: 'PMSApprovalDetail',
    query: {
      id: row.id
    }
  })
}

/** 项目结算关闭 */
const handleClose =async (row) => {
  await ApprovalApi.projectClose({id:row.id})
  resetQuery()
}

const getContract =async ()=>{
 const data = await ContractApi.getContractPage({pageNo:1});
 console.log(data.list)
}

/** 初始化 **/
onMounted(async () => {
  getList()
})
</script>
