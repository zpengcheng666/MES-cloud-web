<template>
  <el-container>
    <el-aside width="500px">
      <ContentWrap>
        <LineStationGroupListTable @select="handleSelect" />
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
          label-width="80px"
        >
          <el-form-item label="编号" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入编号"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <!-- <el-form-item label="产线/工位组" prop="lintStationGroup">
            <el-select-v2
              v-model="queryParams.lintStationGroup"
              :options="processingUnitList"
              filterable
              clearable
              placeholder="选择所属产线/工位组"
              class="!w-240px"
            />
          </el-form-item> -->

          <el-form-item label="设备/工位" prop="type">
            <el-select-v2
              v-model="queryParams.type"
              :options="getIntDictOptions('dms_ledger_type')"
              placeholder="选择设备/工位"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select-v2
              v-model="queryParams.status"
              :options="getIntDictOptions(DICT_TYPE.DMS_DEVICE_STATUS)"
              placeholder="选择状态"
              class="!w-240px"
            />
          </el-form-item>

          <el-form-item>
            <el-button @click="handleQuery"
              ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
            >
            <el-button @click="resetQuery"
              ><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button
            >
            <el-button
              type="primary"
              plain
              @click="openForm('create')"
              v-hasPermi="['dms:ledger:create']"
            >
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
            <el-button
              type="success"
              plain
              @click="handleExport"
              :loading="exportLoading"
              v-hasPermi="['dms:ledger:export']"
            >
              <Icon icon="ep:download" class="mr-5px" /> 导出
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="编号" align="center" prop="code" />
          <el-table-column label="名称" align="center" prop="name" />
          <el-table-column label="设备/工位" align="center" prop="type">
            <template #default="scope">
              <dict-tag type="dms_ledger_type" :value="scope.row.type" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="类型" align="center" prop="equipmentStationType">
            <template #default="scope">
              {{ getDeviceTypeName(scope.row.equipmentStationType) }}
            </template>
          </el-table-column> -->
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.DMS_DEVICE_STATUS" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="运行状态" align="center" prop="runStatus">
            <template #default="scope">
              <dict-tag type="dms_device_status_run" :value="scope.row.runStatus" />
            </template>
          </el-table-column>
          <el-table-column label="负责人" align="center" prop="superintendent">
            <template #default="scope">
              {{ getUserName(scope.row.superintendent) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250px" fixed="right">
            <template #default="scope">
              <el-button link type="primary" @click="openForm('detail', scope.row.id)">
                详情
              </el-button>
              <el-button
                link
                type="primary"
                @click="openForm('update', scope.row.id)"
                v-hasPermi="['dms:ledger:update']"
              >
                编辑
              </el-button>
              <el-button link type="primary" @click="handleSetUser(scope.row.id)"> 用户 </el-button>
              <el-button link type="primary" @click="handleSetLocation(scope.row.id)">
                位置
              </el-button>
              <el-button
                link
                type="danger"
                @click="handleDelete(scope.row.id)"
                v-hasPermi="['dms:ledger:delete']"
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
  <LedgerForm
    ref="formRef"
    @success="getList"
    :deviceTypeList="deviceTypeList"
    :linestationgroupList="linestationgroupList"
    :userList="userList"
    :nowSelect="nowSelect"
    :ledgerList="ledgerList"
    :warehouseList="warehouseList"
  />

  <LedgerToUser ref="ledgerToUserRef" :userList="userList" />

  <LedgerToLocation ref="ledgerToLocationRef" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import download from '@/utils/download'
import { LedgerApi, LedgerVO } from '@/api/dms/ledger'
import LedgerForm from './LedgerForm.vue'

/** 设备台账 列表 */
defineOptions({ name: 'Ledger' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<LedgerVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  code: undefined,
  name: undefined,
  lintStationGroup: '',
  equipmentStationType: undefined,
  type: undefined,
  status: undefined,
  runStatus: undefined,
  onlineStatus: undefined,
  needMaterials: undefined,
  locationId: undefined,
  ip: undefined,
  bindEquipment: undefined,
  superintendent: undefined,
  purchaseDate: undefined,
  maintenanceDate: undefined,
  maintenanceBy: undefined,
  inspectionDate: undefined,
  inspectionBy: undefined,
  technicalParameter1: undefined,
  technicalParameter2: undefined,
  technicalParameter3: undefined,
  technicalParameter4: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await LedgerApi.getLedgerPage(queryParams)
    await getDeviceTypeList()
    await getLineStationGroupList()
    await getUserList()
    await getLedgerList()
    await getWarehouseList()
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
  queryFormRef.value.lintStationGroup = nowSelect.value?.id
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
    await LedgerApi.deleteLedger(id)
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
    const data = await LedgerApi.exportLedger(queryParams)
    download.excel(data, '设备台账.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/************** 类型相关 ******************/

import { DeviceTypeApi } from '@/api/dms/devicetype'
const deviceTypeList = ref<any[]>([])
const getDeviceTypeList = async () => {
  const data = await DeviceTypeApi.listDeviceType(0)
  deviceTypeList.value = []
  for (let v of data) {
    deviceTypeList.value.push({
      id: v.id,
      code: v.code,
      name: v.name,
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id
    })
  }
}
const getDeviceTypeName = (id: string): string => {
  let str = ''
  for (let v of deviceTypeList.value) {
    if (v.id == id) {
      str = v.name
    }
  }
  return str
}

/************** 产线/工位组 ******************/

import { LineStationGroupApi } from '@/api/dms/linestationgroup'
const linestationgroupList = ref<any[]>([])
const getLineStationGroupList = async () => {
  const data = await LineStationGroupApi.getLineStationGroupList()
  linestationgroupList.value = []
  for (let v of data) {
    linestationgroupList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
  linestationgroupList.value.push({
    value: null,
    label: '空设备',
    key: 0
  })
}
const getLineStationGroupName = (id: string): string => {
  let str = ''
  for (let v of linestationgroupList.value) {
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

/***************************左侧列表*********************************/
import LineStationGroupListTable from '../linestationgroup/LineStationGroupListTable.vue'

const nowSelect = ref<any>(undefined)

function handleSelect(data) {
  if (data != undefined && data.id == 0) {
    data.id = undefined
  }

  queryParams.lintStationGroup = data?.id
  nowSelect.value = data

  if (data == undefined) {
    queryParams.lintStationGroup = ''
  }
  getList()
}

/***********************************用户设置:LedgerToUser***********************/

import LedgerToUser from './LedgerToUser.vue'

const ledgerToUserRef = ref()
function handleSetUser(id) {
  ledgerToUserRef.value.open(id)
}

/****************************地址设置:LedgerToLocation**************************/

import LedgerToLocation from './LedgerToLocation.vue'

const ledgerToLocationRef = ref()
async function handleSetLocation(id) {
  await ledgerToLocationRef.value.open(id)
}

/***************************台账列表：设备***************************/

const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    if (v.type == 0) {
      ledgerList.value.push({
        value: v.id,
        label: v.code + ' - ' + v.name,
        key: v.id,
        ...v
      })
    }
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

/***************************仓库信息****************************/
import { WarehouseApi } from '@/api/wms/warehouse'
const warehouseList = ref<any[]>([])
const getWarehouseList = async () => {
  const data = await WarehouseApi.getWarehouseList()
  warehouseList.value = []
  for (let v of data) {
    warehouseList.value.push({
      value: v.id,
      label: v.warehouseName + ' - ' + v.warehouseCode,
      key: v.id,
      ...v
    })
  }
}
const getWarehouseLabel = (value) => {
  return warehouseList.value.find((v) => v.value == value)?.label
}
</script>

<style scoped>
.elMain {
  padding-top: 0px;
}
</style>
