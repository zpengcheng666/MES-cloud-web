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
          placeholder="请选择设备"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="超期停机" prop="expirationShutdown">
        <el-select
          v-model="queryParams.expirationShutdown"
          placeholder="请选择是否超期停机"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DMS_EXPIRATION_SHUTDOWN)"
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
      <el-form-item label="检查人" prop="createBy">
        <el-select-v2
          v-model="queryParams.createBy"
          :options="userList"
          filterable
          clearable
          placeholder="选择检查人"
          class="!w-240px"
        />
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
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
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
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!-- <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['dms:inspection-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button> -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dms:inspection-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="计划编码" align="center" prop="code" min-width="150px">
        <template #default="scope">
          {{ getInspectionPlan(scope.row.code)?.code }}
        </template>
      </el-table-column>

      <el-table-column label="记录状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INSPECTION_RECORD_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center" prop="device" min-width="200px">
        <template #default="scope">
          {{ getLedgerName(scope.row.device) }}
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

      <el-table-column label="检查类型" align="center" prop="type" min-width="100px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DMS_INSPECTION_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="检查人" align="center" prop="createBy">
        <template #default="scope">
          {{ getUserName(scope.row.createBy) }}
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
        label="结束时间"
        align="center"
        prop="endTime"
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
          <el-button
            link
            type="primary"
            @click="fillIn(scope.row)"
            :disabled="scope.row.status != 0"
          >
            填写
          </el-button>
          <el-button link type="primary" @click="openForm('detail', scope.row.id)">
            详情
          </el-button>
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dms:inspection-record:update']"
          >
            编辑
          </el-button> -->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dms:inspection-record:delete']"
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
  <InspectionRecordForm
    ref="formRef"
    @success="getList"
    :ledgerList="ledgerList"
    :userList="userList"
  />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InspectionRecordApi, InspectionRecordVO } from '@/api/dms/inspectionrecord'
import InspectionRecordForm from './InspectionRecordForm.vue'

/** 设备检查记录 列表 */
defineOptions({ name: 'InspectionRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  roles: [],
  code: undefined,
  status: undefined,
  device: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  remark: undefined,
  content: undefined,
  createBy: undefined,
  startTime: [],
  endTime: [],
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.roles = userStore.roles as any
    const data = await InspectionRecordApi.getInspectionRecordPage(queryParams)
    await getLedgerList()
    await getUserList()
    await getInspectionPlanList()
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
  queryParams.roles = userStore.roles as any
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
    await InspectionRecordApi.deleteInspectionRecord(id)
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
    const data = await InspectionRecordApi.exportInspectionRecord(queryParams)
    download.excel(data, '设备检查记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/***********************填写********************/

const { push } = useRouter() // 路由
function fillIn(data) {
  push('/dms/inspection-record-add?id=' + data.id)
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

/**********************************************计划信息***********************************/
import { InspectionPlanApi } from '@/api/dms/inspectionplan'
const inspectionplanList = ref<any[]>([])
const getInspectionPlanList = async () => {
  const data = await InspectionPlanApi.getInspectionPlanList()
  inspectionplanList.value = []
  for (let v of data) {
    inspectionplanList.value.push({
      value: v.id,
      label: v.code,
      key: v.id,
      ...v
    })
  }
}
const getInspectionPlan = (id: string): any => {
  let obj = null
  for (let v of inspectionplanList.value) {
    if (v.id == id) {
      obj = v
    }
  }
  return obj
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

/**************************角色信息*********************************/
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
</script>
