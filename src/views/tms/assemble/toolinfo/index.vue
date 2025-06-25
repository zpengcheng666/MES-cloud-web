<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="daterange"
          start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" />
      </el-form-item>
      <el-form-item label="RFID" prop="materialStockId">
        <el-input v-model="queryParams.materialStockId" placeholder="请输入RFID" class="!w-240px" />
      </el-form-item>
      <el-form-item label="刀具编号" prop="materialConfigId">
        <el-input v-model="queryParams.materialConfigId" placeholder="请输入刀具编号"  class="!w-240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.ASSEMBLE_STATUS)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      <!-- <el-form-item label="刀具装配任务id" prop="assembleTaskId">
        <el-input v-model="queryParams.assembleTaskId" placeholder="请输入刀具装配任务id" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['tms:tool-info:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['tms:tool-info:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" highlight-current-row
      @current-change="handleCurrentChange">
      <!-- <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <!-- <el-table-column label="物料id" align="center" prop="materialStockId" /> -->
      <el-table-column label="RFID" align="center" prop="barCode" />
      <el-table-column label="刀具编号" width="150" align="center" prop="materialNumber" />
      <el-table-column label="刀具名称" align="center" prop="materialName" />
      <el-table-column label="所在托盘" width="150" align="center" prop="storageCode" />
      <el-table-column label="所在库位" width="150" align="center" prop="rootLocationCode" />
      <!-- <el-table-column label="物料类型id（冗余）" align="center" prop="materialConfigId" /> -->
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ASSEMBLE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="刀具装配任务id" align="center" prop="assembleTaskId" /> -->
      
      <el-table-column fixed="right" width="150" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:tool-info:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['tms:tool-info:delete']">
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
  <ToolInfoForm ref="formRef" @success="getList" />
  <!-- 子表的列表 -->
  <ContentWrap v-show="currentRow.id">
    <el-tabs model-value="assembleRecord">
      <el-tab-pane label="刀具装配记录" name="assembleRecord">
        <AssembleRecordList :tool-info-id="currentRow.id" />
      </el-tab-pane>
      <el-tab-pane label="刀具动平衡" name="toolBalance">
        <ToolBalanceList :tool-info-id="currentRow.id" />
      </el-tab-pane>
      <el-tab-pane label="对刀数据" name="toolBase">
        <ToolBaseList :tool-info-id="currentRow.id" />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { ToolInfoApi, ToolInfoVO } from '@/api/tms/toolinfo'
import ToolInfoForm from './ToolInfoForm.vue'
import ToolBalanceList from './components/ToolBalanceList.vue'
import ToolBaseList from './components/ToolBaseList.vue'
import AssembleRecordList from './components/AssembleRecordList.vue'

/** 刀组信息 列表 */
defineOptions({ name: 'ToolInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ToolInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  materialStockId: undefined,
  materialConfigId: undefined,
  status: undefined,
  assembleTaskId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolInfoApi.getToolInfoPage(queryParams)
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
    await ToolInfoApi.deleteToolInfo(id)
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
    const data = await ToolInfoApi.exportToolInfo(queryParams)
    download.excel(data, '刀组信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
