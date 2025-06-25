<template>
  <el-container>
    <el-aside width="500px">
      <ContentWrap>
        <PlanTree @click="funTreeClick" @noClick="funTreeNoClick" />
      </ContentWrap>
    </el-aside>
    <el-main class="elMain">
      <ContentWrap>
        <!-- 搜索工作栏 -->
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="计划编码" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入计划编码"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="设备" prop="device">
            <el-select-v2
              v-model="queryParams.device"
              :options="ledgerList"
              filterable
              clearable
              placeholder="选择设备"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="检查类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择检查类型"
              clearable
              class="!w-240px"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.DMS_INSPECTION_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="queryParams.startTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
              class="!w-240px"
            />
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
            <el-button @click="handleQuery">
              <Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
            >
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
            >
            <el-button
              type="primary"
              plain
              @click="openForm('create')"
              v-hasPermi="['dms:inspection-plan:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
            <el-button
              type="success"
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['dms:inspection-plan:export']"
            >
              <Icon icon="ep:download" class="mr-5px" /> 导出
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="计划编码" align="center" prop="code" width="150px" />
          <el-table-column label="设备" align="center" prop="device" width="200px">
            <template #default="scope">
              {{ getLedgerName(scope.row.device) }}
            </template>
          </el-table-column>
          <el-table-column label="启用状态" align="center" prop="enableStatus">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.ENABLE_STATUS" :value="scope.row.enableStatus" />
            </template>
          </el-table-column>

          <el-table-column label="超期停机" align="center" prop="expirationShutdown">
            <template #default="scope">
              <dict-tag
                :type="DICT_TYPE.DMS_EXPIRATION_SHUTDOWN"
                :value="scope.row.expirationShutdown"
              />
            </template>
          </el-table-column>
          <el-table-column label="超期天数" align="center" prop="expirationTime" />

          <el-table-column label="检查类型" align="center" prop="type">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.DMS_INSPECTION_TYPE" :value="scope.row.type" />
            </template>
          </el-table-column>
          <el-table-column label="负责角色" align="center" prop="superintendent" width="150px">
            <template #default="scope">
              {{ getRoleName(scope.row.superintendent) }}
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"
            align="center"
            prop="startTime"
            :formatter="dateFormatter"
            width="180px"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="dateFormatter"
            width="180px"
          />
          <el-table-column label="操作" align="center" min-width="200px" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="implementationPlan(scope.row.id)">
                执行
              </el-button>
              <el-button link type="primary" @click="openForm('detail', scope.row.id)">
                详情
              </el-button>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['dms:inspection-plan:update']"
              >
                编辑
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['dms:inspection-plan:delete']"
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
    </el-main>
  </el-container>

  <!-- 表单弹窗：添加/修改 -->
  <InspectionPlanForm
    ref="formRef"
    @success="getList"
    :ledgerList="ledgerList"
    :nowTree="nowTree"
    :roleList="roleList"
  />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InspectionPlanApi, InspectionPlanVO } from '@/api/dms/inspectionplan'
import InspectionPlanForm from './InspectionPlanForm.vue'

/** 设备检查计划 列表 */
defineOptions({ name: 'InspectionPlan' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionPlanVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive<any>({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  tree: undefined,
  device: undefined,
  enableStatus: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  superintendent: undefined,
  startTime: [],
  cornExpression: undefined,
  jobId: undefined,
  content: undefined,
  remark: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionPlanApi.getInspectionPlanPage(queryParams)
    await getLedgerList()
    await getRoleList()
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
  if (type == 'create' && nowTree.value == undefined) {
    message.error('请选择所属节点')
    return
  }
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await InspectionPlanApi.deleteInspectionPlan(id)
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
    const data = await InspectionPlanApi.exportInspectionPlan(queryParams)
    download.excel(data, '设备检查计划.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/******************************树相关**************************/
import PlanTree from '../plantree/PlanTree.vue'

const nowTree = ref()

function funTreeClick(tree) {
  nowTree.value = tree
  queryParams.tree = tree.id
  getList()
}

function funTreeNoClick() {
  nowTree.value = undefined
  queryParams.tree = undefined
  getList()
}

/***************************设备相关***************************/
import { LedgerApi } from '@/api/dms/ledger'
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

/****************************执行计划*******************/

function implementationPlan(id) {
  InspectionPlanApi.reminderInspectionPlan(id)
}

/**************************角色信息*********************************/
import * as RoleApi from '@/api/system/role'
const roleList = ref<any[]>([])
const getRoleList = async () => {
  const data = await RoleApi.getSimpleRoleList()
  roleList.value = []
  for (let v of data) {
    roleList.value.push({
      value: v.code,
      label: v.name,
      key: v.code,
      ...v
    })
  }
}
const getRoleName = (id: string): string => {
  let str = ''
  for (let v of roleList.value) {
    if (v.code == id) {
      str = v.name
    }
  }
  return str
}
</script>

<style scoped>
.elMain {
  padding-top: 0px;
}
</style>
