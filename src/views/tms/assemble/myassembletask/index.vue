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
      <el-form-item label="工单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入工单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="目标位置" prop="targetLocation">
        <el-input
          v-model="queryParams.targetLocation"
          placeholder="请输入目标位置"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料类型id" prop="materialConfigId">
        <el-select
          v-model="queryParams.materialConfigId"
          placeholder="请选择物料类型id"
          clearable
          class="!w-240px"
        >
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态（启用、作废）" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态（启用、作废）"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
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
          v-hasPermi="['tms:assemble-task:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['tms:assemble-task:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="assembleRecord">
            <el-tab-pane label="刀具装配记录" name="assembleRecord">
              <AssembleRecordList :assemble-task-id="scope.row.id" :assemble-action="true" @openAssembleToolAction="handleAssemble" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="工单号" align="center" prop="orderNumber" />
      <el-table-column label="需求数量" align="center" prop="needCount" />
      <el-table-column label="目标位置" align="center" prop="targetLocationCode" />
      <el-table-column
        label="配送截止时间"
        align="center"
        prop="distributionDeadline"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="物料编号" align="center" prop="materialNumber" />
      <el-table-column label="最短加工时长" align="center" prop="minimumTime" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ASSEMBLE_TASK_STATUS" :value="scope.row.status" />
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

  <!-- 配刀  放在子组件弹出样式有问题-->
  <AssembleToolAction ref="assembleToolActionRef" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AssembleTaskApi, AssembleTaskVO } from '@/api/tms/assembletask'
import AssembleRecordList from '../assembletask/components/AssembleRecordList.vue'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import AssembleToolAction from './AssembleToolAction.vue'

/** 刀具装配任务 列表 */
defineOptions({ name: 'AssembleTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AssembleTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  operator: undefined,
  orderNumber: undefined,
  targetLocation: undefined,
  materialConfigId: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const { wsCache } = useCache()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const userId = wsCache.get(CACHE_KEY.USER).user.id
    console.log('userId', userId)
    queryParams.operator = userId
    const data = await AssembleTaskApi.getAssembleTaskPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const assembleToolActionRef = ref()
/** 配刀按钮操作 */
const handleAssemble = async (id: string) => {
  assembleToolActionRef.value.open(id)
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
    await AssembleTaskApi.deleteAssembleTask(id)
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
    const data = await AssembleTaskApi.exportAssembleTask(queryParams)
    download.excel(data, '刀具装配任务.xls')
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