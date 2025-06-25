<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="类型名称" prop="trayTypeName">
        <el-input v-model="queryParams.trayTypeName" placeholder="请输入托盘类型名称" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="类型编码" prop="trayTypeNumber">
        <el-input v-model="queryParams.trayTypeNumber" placeholder="请输入托盘类型编码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
          start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['knifetool:tool-tray-type:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['knifetool:tool-tray-type:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" width="60" align="center">
        <template #default="scope">
          {{ (queryParams.pageNo - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="托盘类型名称" align="center" prop="trayTypeName" />
      <el-table-column label="托盘类型编码" align="center" prop="trayTypeNumber" />
      <el-table-column label="数量" align="center" prop="trayTypeCount" />
      <el-table-column label="材料" align="center" prop="material" />
      <el-table-column label="通用性" align="center" prop="commonUse" />
      <el-table-column label="重量" align="center" prop="weight" />
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['knifetool:tool-tray-type:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['knifetool:tool-tray-type:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ToolTrayTypeForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'
import ToolTrayTypeForm from './ToolTrayTypeForm.vue'

/** 刀具托盘类型 列表 */
defineOptions({ name: 'ToolTrayType' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ToolTrayTypeApi.ToolTrayTypeVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  trayTypeName: undefined,
  trayTypeNumber: undefined,
  trayTypeCount: undefined,
  material: undefined,
  commonUse: undefined,
  weight: undefined,
  createId: undefined,
  createTime: [],
  updateId: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolTrayTypeApi.getToolTrayTypePage(queryParams)
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
    await ToolTrayTypeApi.deleteToolTrayType(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ToolTrayTypeApi.exportToolTrayType(queryParams)
    download.excel(data, '刀具托盘类型.xls')
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