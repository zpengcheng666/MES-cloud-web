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
      <el-form-item label="采购类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择采购类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_REQUIREMENT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-select
          v-model="queryParams.applicant"
          filterable
          class="!w-240px"
          placeholder="请选择申请人"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" prop="applicationDate">
        <el-date-picker
          v-model="queryParams.applicationDate"
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
          v-hasPermi="['ppm:purchase-requirement:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:purchase-requirement:export']"
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
          <el-tabs model-value="RequirementDetail">
            <el-tab-pane label="采购申请详情" name="RequirementDetail">
              <RequirementDetailList :requirement-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" align="center" prop="type" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_REQUIREMENT_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="申请部门" align="center" prop="applicationDepartment" />
      <el-table-column
        label="申请日期"
        align="center"
        prop="applicationDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="申请理由" align="center" prop="applicationReason" />
      <el-table-column label="审批状态" align="center" prop="status" width="100px" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PM_REQUIREMENT_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:purchase-requirement:update']"
            v-if="scope.row.status=='0'"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:purchase-requirement:delete']"
            v-if="scope.row.status=='0'"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleSubmit(scope.row)"
            v-hasPermi="['ppm:purchase-requirement:update']"
            v-if="scope.row.status=='0'"
          >
            提交审核
          </el-button>

          <el-button
            link
            v-hasPermi="['ppm:purchase-requirement:update']"
            type="primary"
            @click="handleProcessDetail(scope.row)"
            v-if="scope.row.status!='0'"
          >
            审批进度
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
  <PurchaseRequirementForm ref="formRef" @success="getList" :dept-id="useUserStore().getUser.deptId"/>
</template>

<script setup lang="ts">
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseRequirementApi, PurchaseRequirementVO } from '@/api/ppm/purchaserequirement'
import PurchaseRequirementForm from '../purchaserequirement/PurchaseRequirementForm.vue'
import RequirementDetailList from '../purchaserequirement/RequirementDetailList.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import * as UserApi from "@/api/system/user";
import { useUserStore } from '@/store/modules/user'

/** 采购申请主 列表 */
defineOptions({ name: 'PurchaseRequirement' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PurchaseRequirementVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: undefined,
  applicant: undefined,
  applicationDepartment: undefined,
  applicationDate: [],
  applicationReason: undefined,
  // 查当前部门数据
  isCurrentDept: '1'
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.applicationDepartment = useUserStore().getUser.deptId
    const data = await PurchaseRequirementApi.getPurchaseRequirementPage(queryParams)
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
    await PurchaseRequirementApi.deletePurchaseRequirement(id)
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
    queryParams.applicationDepartment = useUserStore().getUser.deptId
    const data = await PurchaseRequirementApi.exportPurchaseRequirement(queryParams)
    download.excel(data, '采购申请主.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 查看审批 */
const { push } = useRouter()
const handleProcessDetail = (row: PurchaseRequirementVO) => {
  push({ name: 'BpmProcessInstanceDetail', query: { id: row.processInstanceId } })
}

/** 提交审核 **/
const handleSubmit = async (row) => {
  await message.confirm(`您确定提交审核吗？`)
  await PurchaseRequirementApi.submitRequirement(row.id)
  message.success('提交审核成功！')
  await getList()
}


const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 获得用户列表
  const userList = await UserApi.getSimpleUserList()
  userOptions.value = userList.filter((u: UserApi.UserVO) => u.deptId === useUserStore().getUser.deptId)
})
</script>
