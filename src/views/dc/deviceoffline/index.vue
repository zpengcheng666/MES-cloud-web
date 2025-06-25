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

      <el-form-item label="设备状态" prop="deviceStatus">
        <el-select
          v-model="queryParams.deviceStatus"
          placeholder="请选择设备状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DC_DEVICE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="deviceCollect">
            <el-tab-pane label="设备产品类型" name="deviceCollect">
              <DeviceCollect :product-list="scope.row.productTypeList"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>

      <el-table-column label="设备" align="center" prop="deviceId" >
        <template #default="scope">
          {{  getLedgerName(scope.row.deviceId) }}
        </template>
      </el-table-column>

      <el-table-column label="通信状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DC_DEVICE_STATUS" :value="scope.row.deviceStatus" />
        </template>
      </el-table-column>

      <el-table-column label="通信类型" align="center" prop="commType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DC_COMM_TYPE" :value="scope.row.commType" />
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="运行日志" align="center">
        <template #default="scope">

          <el-button
            link
            type="primary"
            @click="openCollect(scope.row.id)">
            采集日志
          </el-button>

          <el-button
            link
            type="primary"
            @click="openDetail(scope.row.id)">
            错误日志
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

  <!-- 采集日志弹窗 -->
  <DeviceOfflineCollect
    ref="collectRef"
    @success="getList"
    :ledgerList="ledgerList"
  />

  <!-- 错误日志弹窗 -->
  <DeviceOfflineError
    ref="detailRef"
    @success="getList"
    :ledgerList="ledgerList"
  />

</template>



<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { DeviceApi, DeviceVO } from '@/api/dc/device'
import DeviceOfflineCollect from './DeviceOfflineCollect.vue'
import DeviceOfflineError from './DeviceOfflineError.vue'
import DeviceCollect from "@/views/dc/deviceoffline/DeviceCollect.vue";


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
  productTypeList: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceApi.getDeviceOfflinePage(queryParams)
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

/** 采集日志详情 **/
const collectRef = ref()
const openCollect = (id: number) => {
  collectRef.value.open(id)
}

/** 错误日志详情 **/
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
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
