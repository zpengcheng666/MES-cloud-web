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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>

        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['pms:approval:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['pms:approval:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="assessment">
            <el-tab-pane label="项目评审" name="assessment">
              <AssessmentList :project-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!--<el-table-column label="立项id" align="center" prop="id" />-->
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目类型" align="center" prop="projectType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PROJECT_TYPE" :value="scope.row.projectType" />
        </template>
      </el-table-column>
      <!--<el-table-column label="项目合同" align="center" prop="projectContract" />-->
      <el-table-column label="项目预算(万元)" align="center" prop="budget" />
      <!--<el-table-column label="客户" align="center" prop="projectClient" />-->
      <!--<el-table-column label="项目简述" align="center" prop="description" />-->
      <el-table-column
        label="预计开始时间"
        align="center"
        prop="prestartTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="预计结束时间"
        align="center"
        prop="preendTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <!--<el-table-column label="负责人" align="center" prop="responsiblePerson" />-->
      <el-table-column label="负责人" align="center" prop="responsiblePersonName" />
      <!--<el-table-column label="项目经理" align="center" prop="projectManager" />-->
      <el-table-column label="项目经理" align="center" prop="projectManagerName" />
      <el-table-column label="项目技术材料" align="center" prop="technicalMaterials" />
      <!--<el-table-column label="创建者" align="center" prop="creator" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--<el-table-column label="客户联系人" align="center" prop="contactId" />-->
      <el-table-column label="客户" align="center" prop="projectClientName" />
      <el-table-column align="center" label="审批状态" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_TASK_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="420px">
        <template #default="scope">
          <el-button  link type="primary"  @click="handleCreate(scope.row)"  :disabled="!!scope.row?.status" :loading="loading1">
            <!--<Icon class="mr-5px" icon="ep:plus" />-->
            发起审批
          </el-button>
          <el-button v-if="[3,4,5].includes(scope.row?.status)"  link type="primary"  @click="handleCreate(scope.row)"  :loading="loading1">
            重新审批
          </el-button>
          <el-button  link type="primary"  @click="handleCreateAssess(scope.row.id)" :disabled="!!(scope.row?.status!=2||scope.row.orderList.length===0||scope.row.assessmentList.length>0||scope.row.needsAssessment===0)">
            <!--<Icon class="mr-5px" icon="ep:plus" />-->
            发起评审
          </el-button>
          <el-button
            v-hasPermi="['pms:approval:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            :disabled="!scope.row?.status"
            v-hasPermi="['pms:approval:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
          </el-button>
          <el-button
            :disabled="!!scope.row?.status"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['pms:approval:update']"
          >
            编辑
          </el-button>
          <el-button
            :disabled="!!scope.row?.status"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['pms:approval:delete']"
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
  <ApprovalForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import ApprovalForm from './ApprovalForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import AssessmentList from './components/AssessmentList.vue'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import { OrderApi } from '@/api/pms/order'

/** pms 立项表,项目立项相关 列表 */
defineOptions({ name: 'PmsApproval' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const loading1 = ref(false) // 列表的加载中
const list = ref<ApprovalVO[]>([]) // 列表的数据
// const assessmentList = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectCode: undefined,
  projectName: undefined,
  projectType: undefined,
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ApprovalApi.deleteApproval(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
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
/** 审批进度 */
const handleProcessDetail = (row) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ApprovalApi.exportApproval(queryParams)
    download.excel(data, 'pms立项表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 发起审批 */
// const handleCreate = (id) => {
//   delView(unref(currentRoute))
//   push({ name: 'PMSApprovalCreate',
//     query: {
//       id,
//     }})
//
// }
const handleCreate =async (row) => {
  const orderList =await OrderApi.getOrderByProjectId(row.id)
  if(orderList.length===0){
    message.warning("还未绑定订单，无法审批")
    return
  }
  loading1.value = true
  try{
    const id = await ApprovalApi.createApprovalBpm2(row);
    if(id){
      message.success("发起成功")
      getList()
    }else {
      message.error("发起失败")
    }
  }finally {
    loading1.value = false;
  }

}
// await ApprovalApi.createApprovalBpm(data)

/** 添加操作 */
const handleCreateAssess =async (id) => {
  //查询该项目的评审记录
  const assessmentList = await ApprovalApi.getAssessmentListByProjectId(id)
  if(assessmentList.length>0){
    message.info("已发起过评审")
    return
  }
  //查询该项目是否创建过订单
  const orderList = await ApprovalApi.getOrderListByProjectId(id);
  if(orderList.length===0){
    message.info("请先创建项目订单")
    return
  }
  delView(unref(currentRoute))
  push({ name: 'PMSAssessmentCreate',
    query: {
      id,
    }})

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
