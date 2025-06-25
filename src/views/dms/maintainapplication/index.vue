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
      <el-form-item label="关键设备" prop="important">
        <el-select
          v-model="queryParams.important"
          placeholder="请选择是否为关键设备"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('dms_key_equipment')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择维修类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions('dms_maintain_type1')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请输入申请状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions('dms_maintain_status')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="primary" plain @click="gotoCreate">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- 
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['dms:maintain-application:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button> -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dms:maintain-application:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备" align="center" prop="device">
        <template #default="scope">
          {{ getLedgerName(scope.row.device) }}
        </template>
      </el-table-column>
      <el-table-column label="设备编码" align="center" prop="code" />
      <el-table-column label="关键设备" align="center" prop="important">
        <template #default="scope">
          <DictTag type="dms_key_equipment" :value="scope.row.important" />
        </template>
      </el-table-column>
      <el-table-column label="维修类型" align="center" prop="type">
        <template #default="scope">
          <DictTag :type="'dms_maintain_type1'" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="期望修复时间(小时)" align="center" prop="duration" />
      <el-table-column label="申请状态" align="center" prop="status">
        <template #default="scope">
          <DictTag :type="'dms_maintain_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="applicant">
        <template #default="scope">
          {{ getUserName(scope.row.applicant) }}
        </template>
      </el-table-column>
      <el-table-column
        label="申请时间"
        align="center"
        prop="applicationTime"
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
      <el-table-column label="操作" align="center" width="200px">
        <template #default="scope">
          <el-button link type="primary" @click="handleDetail(scope.row)"> 详情 </el-button>
          <el-button link type="primary" @click="handleProcessDetail(scope.row)"> 进度 </el-button>
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dms:maintain-application:update']"
          >
            编辑
          </el-button> -->
          <!-- <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dms:maintain-application:delete']"
          >
            删除
          </el-button> -->
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
  <MaintainApplicationForm ref="formRef" @success="getList" :ledgerList="ledgerList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { MaintainApplicationApi, MaintainApplicationVO } from '@/api/dms/maintainapplication'
import MaintainApplicationForm from './MaintainApplicationForm.vue'
import { getStrDictOptions, getIntDictOptions } from '@/utils/dict'

/** 设备维修申请 列表 */
defineOptions({ name: 'MaintainApplication' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MaintainApplicationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  device: undefined,
  code: undefined,
  name: undefined,
  processingUnitNumber: undefined,
  model: undefined,
  important: undefined,
  type: undefined,
  describe1: undefined,
  duration: undefined,
  status: undefined,
  processInstanceId: undefined,
  applicant: undefined,
  applicationTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaintainApplicationApi.getMaintainApplicationPage(queryParams)
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
    await MaintainApplicationApi.deleteMaintainApplication(id)
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
    const data = await MaintainApplicationApi.exportMaintainApplication(queryParams)
    download.excel(data, '设备维修申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/***********************流程相关****************************/
import router from '@/router'

function handleDetail(row) {
  router.push({
    name: 'MaintainApplicationDetail',
    query: {
      id: row.id
    }
  })
}
function handleProcessDetail(row) {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/***********************新增************************/

function gotoCreate() {
  router.push('/dms/maintainapplication/create')
}

/************************* 获取设备信息 ***************************/

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
