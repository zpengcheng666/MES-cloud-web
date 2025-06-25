<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="托盘编码" prop="trayNumber">
        <el-input v-model="queryParams.trayNumber" placeholder="请输入托盘编码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="托盘类型" prop="trayTypeId">
        <el-select v-model="queryParams.trayTypeId" filterable placeholder="请选择托盘类型" style="width: 240px">
          <el-option v-for="item in typeSelect" :key="item.id" :label="item.trayTypeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="托盘状态" prop="trayStatus">
        <el-select v-model="queryParams.trayStatus" placeholder="请选择状态" clearable class="!w-240px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
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
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['knifetool:tool-tray:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['knifetool:tool-tray:export']">
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
      <el-table-column label="托盘类型编码" align="center" prop="trayNumber" />
      <el-table-column label="托盘库内位置" align="center" prop="trayLocationName" />
      <el-table-column label="托盘类型" align="center" prop="trayTypeName" />
      <el-table-column label="状态" align="center" prop="trayStatus">
        <template #default="scope">
          <el-switch v-model="scope.row.trayStatus" :active-value="1" :inactive-value="0"
            @change="handleStateChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['knifetool:tool-tray:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['knifetool:tool-tray:delete']">
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
  <ToolTrayForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ToolTrayApi from '@/api/knifetool/toolDelivery/tray'
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'
import { KnifetoolStateEnum } from '@/utils/constants'
import ToolTrayForm from './ToolTrayForm.vue'

/** 刀具托盘 列表 */
defineOptions({ name: 'ToolTray' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ToolTrayApi.ToolTrayVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const typeSelect = ref<any>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  trayNumber: undefined,
  trayLocation: undefined,
  trayTypeId: undefined,
  trayTypeName: undefined,
  trayStatus: undefined,
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
    const data = await ToolTrayApi.getToolTrayPage(queryParams)
    list.value = data.list
    total.value = data.total
    console.log(list.value)
  } finally {
    loading.value = false
  }
}

/** 查询托盘类型列表 */
const getTypeList = async () => {
  loading.value = true
  try {
    typeSelect.value = await ToolTrayTypeApi.getToolTrayTypeList()
    console.log(typeSelect.value)
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
    await ToolTrayApi.deleteToolTray(id)
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
    const data = await ToolTrayApi.exportToolTray(queryParams)
    download.excel(data, '刀具托盘.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改托盘状态 */
const handleStateChange = async (row: any) => {
  try {
    // 修改状态的二次确认
    const text = row.trayStatus === KnifetoolStateEnum.ENABLE ? '开启' : '禁用'
    await message.confirm('确认要"' + text + '""' + row.trayNumber + '"刀具托盘吗?')
    console.log(row.trayStatus);
    // 发起修改状态
    await ToolTrayApi.updateToolTrayState(row.id, row.trayStatus)

    // 刷新列表
    await getList()
  } catch {
    // 取消后，进行恢复按钮
    row.state =
      row.state === KnifetoolStateEnum.ENABLE
        ? KnifetoolStateEnum.DISABLE
        : KnifetoolStateEnum.ENABLE
  }

  ToolTrayApi.updateToolTrayState(row.id, row.trayStatus).then(() => {
    // 刷新列表
    getList()
  }).catch(() => {
    message.error("修改失败")
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
  getTypeList()
})
</script>