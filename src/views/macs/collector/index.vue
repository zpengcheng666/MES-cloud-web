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
      <el-form-item label="位置" prop="locationCode">
        <el-select
          v-model="queryParams.locationCode"
          placeholder="请选择位置"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions('macsCollectorLocation')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择设备状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('macsCollectorStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['macs:collector:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['macs:collector:export']"
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
      <el-table-column label="位置" align="center" prop="locationCode">
        <template #default="scope">
          <dict-tag :type="'macsCollectorLocation'" :value="scope.row.locationCode" />
        </template>
      </el-table-column>
      <el-table-column label="doorName" align="center" prop="doorName" />
      <el-table-column label="deviceName" align="center" prop="deviceName" />
      <el-table-column label="关联设备位置" align="center" prop="devicePort" />
      <el-table-column label="设备状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="'macsCollectorStatus'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="采集设备类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="'macsCollectorType'" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="描述/备注" align="center" prop="description" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['macs:collector:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['macs:collector:delete']"
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
  <CollectorForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CollectorApi, CollectorVO } from '@/api/macs/collector'
import CollectorForm from './CollectorForm.vue'

/** (通行卡,人脸,指纹)采集器 列表 */
defineOptions({ name: 'Collector' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CollectorVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined,
  name: undefined,
  locationCode: undefined,
  status: undefined,
  type: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CollectorApi.getCollectorPage(queryParams)
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
    await CollectorApi.deleteCollector(id)
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
    const data = await CollectorApi.exportCollector(queryParams)
    download.excel(data, '(通行卡,人脸,指纹)采集器.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
