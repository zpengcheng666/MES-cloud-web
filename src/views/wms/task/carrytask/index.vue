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
      <el-form-item label="任务编码" prop="taskCode">
        <el-input
          v-model="queryParams.taskCode"
          placeholder="请输入任务编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-select
          v-model="queryParams.taskStatus"
          placeholder="请选择任务状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CARRY_TASK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select
          v-model="queryParams.taskType"
          placeholder="请选择任务类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CARRY_TASK_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="AGV ID" prop="agvId">
        <el-input
          v-model="queryParams.agvId"
          placeholder="请输入AGV ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!-- <el-form-item label="库存单集合" prop="orderIds">
        <el-input
          v-model="queryParams.orderIds"
          placeholder="请输入库存单集合"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:carry-task:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:carry-task:export']"
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
          <el-tabs model-value="carrySubTask">
            <el-tab-pane label="搬运任务子表" name="carrySubTask">
              <CarrySubTaskList :parent-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="任务编码" align="center" width="180" prop="taskCode" />
      <el-table-column label="优先级" align="center" prop="priority" />
      <el-table-column label="任务状态" align="center" prop="taskStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_CARRY_TASK_STATUS" :value="scope.row.taskStatus" />
        </template>
      </el-table-column>
      <el-table-column label="任务类型" align="center" prop="taskType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_CARRY_TASK_TYPE" :value="scope.row.taskType" />
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!-- <el-table-column label="任务内容" align="center" prop="taskContent" /> -->
      <el-table-column label="任务描述" align="center" prop="taskDescription" />
      <el-table-column label="AGV ID" align="center" prop="agvId" />
      <!-- <el-table-column label="库存单集合" align="center" prop="orderIds" /> -->
      <el-table-column label="操作"  fixed="right" align="center" min-width="150px">
        <template #default="scope">
          <el-button
            link
            type="success"
            @click="dispatchCarryTask(scope.row.id)"
            v-hasPermi="['wms:carry-task:update']"
          >
            下发
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:carry-task:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:carry-task:delete']"
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
  <CarryTaskForm ref="formRef" width="1200" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CarryTaskApi, CarryTaskVO } from '@/api/wms/carrytask'
import CarryTaskForm from './CarryTaskForm.vue'
import CarrySubTaskList from './components/CarrySubTaskList.vue'

/** 搬运任务 列表 */
defineOptions({ name: 'CarryTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CarryTaskVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  taskCode: undefined,
  taskStatus: undefined,
  taskType: undefined,
  taskContent: undefined,
  taskDescription: undefined,
  agvId: undefined,
  orderIds: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CarryTaskApi.getCarryTaskPage(queryParams)
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
    await CarryTaskApi.deleteCarryTask(id)
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
    const data = await CarryTaskApi.exportCarryTask(queryParams)
    download.excel(data, '搬运任务.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 注入无感刷新页面函数
const reload = inject<() => void>('reload')

const dispatchCarryTask = async (id: number) => {
  const data = await CarryTaskApi.dispatchCarryTask(id)
  if (reload) reload()
  if(data.includes('成功'))  message.success(data)
  if(data.includes('失败'))  message.error(data)

}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
