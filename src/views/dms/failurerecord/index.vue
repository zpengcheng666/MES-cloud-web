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

      <el-form-item label="异常编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入异常编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="故障状态" prop="faultState">
        <el-select-v2
          v-model="queryParams.faultState"
          :options="getStrDictOptions('dms_fault_state')"
          placeholder="请输入故障状态"
          filterable
          clearable
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dms:failure-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备" align="center" prop="device" min-width="200px">
        <template #default="scope">
          {{ getLedgerName(scope.row.device) }}
        </template>
      </el-table-column>
      <el-table-column label="异常编码" align="center" prop="code" min-width="150px" />
      <el-table-column label="故障状态" align="center" prop="faultState">
        <template #default="scope">
          <DictTag :type="'dms_fault_state'" :value="scope.row.faultState" />
        </template>
      </el-table-column>
      <el-table-column
        label="故障时间"
        align="center"
        prop="faultTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="维修人员" align="center" prop="maintenanceBy">
        <template #default="scope">
          {{ getUserName(scope.row.maintenanceBy) }}
        </template>
      </el-table-column>
      <el-table-column
        label="修复时间"
        align="center"
        prop="repairTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="修复费用" align="center" prop="restorationCosts" />
      <el-table-column label="操作" align="center" min-width="200px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dms:failure-record:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dms:failure-record:delete']"
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
  <FailureRecordForm
    ref="formRef"
    @success="getList"
    :ledgerList="ledgerList"
    :userList="userList"
  />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FailureRecordApi, FailureRecordVO } from '@/api/dms/failurerecord'
import FailureRecordForm from './FailureRecordForm.vue'
import { getStrDictOptions } from '@/utils/dict'

/** 异常记录 列表 */
defineOptions({ name: 'FailureRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FailureRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  device: undefined,
  code: undefined,
  faultState: undefined,
  description: undefined,
  cause: undefined,
  faultTime: undefined,
  maintenanceBy: undefined,
  repairTime: undefined,
  remarks: undefined,
  createTime: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FailureRecordApi.getFailureRecordPage(queryParams)
    await getLedgerList()
    await getUserList()
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
    await FailureRecordApi.deleteFailureRecord(id)
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
    const data = await FailureRecordApi.exportFailureRecord(queryParams)
    download.excel(data, '异常记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/***************************关联设备***************************/
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

/**************************用户信息*********************************/
import * as UserApi from '@/api/system/user'
const userList = ref<any[]>([])
const getUserList = async () => {
  const data = await UserApi.getSimpleUserList()
  userList.value = []
  for (let v of data) {
    userList.value.push({
      value: String(v.id),
      label: v.nickname,
      key: String(v.id),
      ...v
    })
  }
}
const getUserName = (id: string): string => {
  let str = ''
  for (let v of userList.value) {
    if (v.id == id) {
      str = v.nickname
    }
  }
  return str
}
</script>
