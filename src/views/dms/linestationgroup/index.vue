<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="70px"
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
      <!-- <el-form-item label="产线/工位组" prop="type" label-width="90px">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择产线/工位组"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DMS_LINE_STATION_GROUP)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否启用" prop="enable">
        <el-select
          v-model="queryParams.enable"
          placeholder="请选择是否启用"
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

      <el-form-item label="所属类型" prop="affiliationDeviceType">
        <el-select-v2
          v-model="queryParams.affiliationDeviceType"
          :options="deviceTypeList"
          filterable
          clearable
          placeholder="选择所属类型"
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="location">
        <el-select-v2
          v-model="queryParams.location"
          :options="warehouseList"
          filterable
          clearable
          placeholder="请选择仓库"
          class="!w-240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['dms:line-station-group:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dms:line-station-group:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="code" min-width="120px" />
      <el-table-column label="名称" align="center" prop="name" min-width="120px" />
      <!-- <el-table-column label="产线/工位组" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DMS_LINE_STATION_GROUP" :value="scope.row.type" />
        </template>
      </el-table-column> -->
      <el-table-column label="是否启用" align="center" prop="enable" width="80px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ENABLE_STATUS" :value="scope.row.enable" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属类型" align="center" prop="affiliationDeviceType">
        <template #default="scope">
          {{ getDeviceTypeName(scope.row.affiliationDeviceType) }}
        </template>
      </el-table-column> -->

      <el-table-column label="仓库" align="center" prop="location">
        <template #default="scope">
          {{ getWarehouseLabel(scope.row.location) }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('detail', scope.row.id)">
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dms:line-station-group:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dms:line-station-group:delete']"
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
  <LineStationGroupForm
    ref="formRef"
    @success="getList"
    :deviceTypeList="deviceTypeList"
    :warehouseList="warehouseList"
  />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { LineStationGroupApi, LineStationGroupVO } from '@/api/dms/linestationgroup'
import LineStationGroupForm from './LineStationGroupForm.vue'

/** 产线/工位组 列表 */
defineOptions({ name: 'LineStationGroup' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<LineStationGroupVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  type: undefined,
  enable: undefined,
  affiliationDeviceType: undefined,
  ip: undefined,
  location: undefined,
  remark: undefined,
  creator: undefined,
  createTime: [],
  updater: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await LineStationGroupApi.getLineStationGroupPage(queryParams)
    await getDeviceTypeList()
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
    await LineStationGroupApi.deleteLineStationGroup(id)
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
    const data = await LineStationGroupApi.exportLineStationGroup(queryParams)
    download.excel(data, '产线/工位组.xls')
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
  const data = await DeviceTypeApi.listDeviceType(2)
  deviceTypeList.value = []
  for (let v of data) {
    deviceTypeList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
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
