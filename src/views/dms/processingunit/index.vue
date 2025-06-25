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
      <el-form-item label="产线编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入产线编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="产线名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入产线名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-select-v2
          v-model="queryParams.enable"
          :options="getIntDictOptions(DICT_TYPE.DMS_DEVICE_TYPE_ENABLE)"
          placeholder="选择是否启用"
          clearable
          class="!w-150px"
        />
      </el-form-item>
      <el-form-item label="规格型号" prop="specification">
        <el-input
          v-model="queryParams.specification"
          placeholder="请输入规格型号"
          clearable
          @keyup.enter="handleQuery"
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
          v-hasPermi="['dms:device-type:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dms:device-type:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产线编号" align="center" prop="code" />
      <el-table-column label="产线名称" align="center" prop="name" />
      <el-table-column label="是否启用" align="center" prop="enable">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DMS_DEVICE_TYPE_ENABLE" :value="scope.row.enable" />
        </template>
      </el-table-column>
      <el-table-column label="关联类型" align="center" prop="deviceType">
        <template #default="scope">
          {{ getDeviceTypeName(scope.row.deviceType) }}
        </template>
      </el-table-column>
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="生产厂家" align="center" prop="manufacturer" />
      <el-table-column label="厂家联系人" align="center" prop="contacts" />
      <el-table-column label="操作" align="center" width="200px" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('detail', scope.row.id)">
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dms:device-type:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dms:device-type:delete']"
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
  <ProcessingUnitForm ref="formRef" @success="getList" :deviceTypeList="deviceTypeList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { DeviceTypeApi, DeviceTypeVO } from '@/api/dms/devicetype'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import ProcessingUnitForm from './ProcessingUnitForm.vue'

/** 设备产线 列表 */
defineOptions({ name: 'DeviceType' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DeviceTypeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  code: undefined,
  name: undefined,
  type: 1,
  enable: undefined,
  deviceType: undefined,
  specification: undefined,
  manufacturer: undefined,
  countryRegion: undefined,
  contacts: undefined,
  contactPhone: undefined,
  remark: undefined,
  creator: undefined,
  createTime: [],
  updater: undefined,
  updateTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DeviceTypeApi.getDeviceTypePage(queryParams)
    await getDeviceTypeList()
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
    await DeviceTypeApi.deleteDeviceType(id)
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
    const data = await DeviceTypeApi.exportDeviceType(queryParams)
    download.excel(data, '产线.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

/************** 设备类型相关 ******************/

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
</script>
