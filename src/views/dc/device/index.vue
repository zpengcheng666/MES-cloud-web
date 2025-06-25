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
      <el-form-item label="设备" prop="deviceId">
        <el-select-v2
          v-model="queryParams.deviceId"
          :options="ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          class="!w-240px"
        />
      </el-form-item>

<!--      <el-form-item label="启用状态" prop="deviceStatus">-->
<!--        <el-select-->
<!--          v-model="queryParams.deviceStatus"-->
<!--          placeholder="请选择启用状态"-->
<!--          clearable-->
<!--          class="!w-240px"-->
<!--        >-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.DC_DEVICE_STATUS)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

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

      <el-form-item label="通信类型" prop="commType">
        <el-select
          v-model="queryParams.commType"
          placeholder="请选择通信类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DC_COMM_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

<!--      <el-form-item label="设备分组" prop="deviceTypeId">-->
<!--        <el-select-v2-->
<!--          v-model="queryParams.deviceTypeId"-->
<!--          :options="deviceTypeList"-->
<!--          filterable-->
<!--          clearable-->
<!--          placeholder="选择设备分组"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['dc:device:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dc:device:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备" align="center" prop="deviceId" >
        <template #default="scope">
          {{ getLedgerName(scope.row.deviceId) }}
        </template>
      </el-table-column>
      <el-table-column label="通信类型" align="center" prop="commType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DC_COMM_TYPE" :value="scope.row.commType" />
        </template>
      </el-table-column>
<!--      <el-table-column label="启用状态" align="center" prop="deviceStatus">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.DC_DEVICE_STATUS" :value="scope.row.deviceStatus" />-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="通信编码" align="center" prop="topicId" />-->

<!--      <el-table-column label="启用状态" align="center" prop="deviceStatus">-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.DC_DEVICE_STATUS" :value="scope.row.deviceStatus" />-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">

          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dc:device:update']"
          >
            编辑
          </el-button>

          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)">
            详情
          </el-button>

          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dc:device:delete']"
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
  <DeviceForm
    ref="formRef"
    @success="getList"
    :productTypeList = "productTypeList"
    :ledgerList="ledgerList"
    :device-type-list="deviceTypeList"
  />

  <!-- 详情弹窗 -->
  <DeviceDetail
    ref="detailRef"
    @success="getList"
    :productTypeList = "productTypeList"
    :ledgerList="ledgerList"
  />

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DeviceApi, DeviceVO } from '@/api/dc/device'
import DeviceForm from './DeviceForm.vue'
import DeviceDetail from './DeviceDetail.vue'

/** 设备 列表 */
defineOptions({ name: 'Device' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DeviceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 20,
  deviceId: undefined,
  deviceStatus: undefined,
  productTypeId: undefined,
  deviceTypeId: undefined,
  createTime: [],
  commType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceApi.getDevicePage(queryParams)
    await getDeviceTypeList()
    await getLedgerList()
    await getProductTypeList()
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

/** 详情操作 **/
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}


/** 删除按钮操作 */
const handleDelete = async (id: number ) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DeviceApi.deleteDevice(id )
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
    const data = await DeviceApi.exportDevice(queryParams)
    download.excel(data, '设备.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/************************* 获取产品类型信息 ***************************/
import { ProductTypeApi } from '@/api/dc/producttype'
const productTypeList = ref<any[]>([])
const getProductTypeList = async () => {
  const data = await ProductTypeApi.getProductTypeList()
  productTypeList.value = []
  for (let v of data){
    productTypeList.value.push({
      value: v.id ,
      label: v.productTypeName ,
      key: v.id,
      ...v
    })
  }
}

/************************* 获取设备类型信息 ***************************/
const deviceTypeList = ref<any[]>([])
const getDeviceTypeList = async () =>{
  const data = await DeviceApi.getDeviceTypeList()
  deviceTypeList.value = []
  for (let v of data){
    deviceTypeList.value.push({
      value: v.id ,
      label: v.name ,
      key: v.id,
      ...v
    })
  }
}

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
      str = v.code + ' - ' + v.name
    }
  }
  return str
}


/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
