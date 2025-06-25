<!--
 * @Author: hyj
 * @Description:装配任务
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-07-17 15:04:04
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlan/index.vue
-->
<template>
  <div>装配任务</div>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="workOrderCode">
        <el-input
          v-model="queryParams.workOrderCode"
          placeholder="工单号"
          clearable
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item prop="paringTaskState">
        <el-select
          v-model="queryParams.paringTaskState"
          placeholder="请选择装配状态"
          class="!w-240px"
        >
          <el-option value="0" label="刀具准备中" />
          <el-option value="1" label="装配进行中" />
          <el-option value="2" label="完成" />
          <el-option value="3" label="撤销" />
        </el-select>
      </el-form-item>

      <el-form-item prop="paringDeadline">
        <el-date-picker
          v-model="queryParams.paringDeadline"
          type="date"
          placeholder="最晚装配时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item prop="toolGroupCode">
        <el-input
          v-model="queryParams.toolGroupCode"
          placeholder="刀组编码"
          clearable
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
        <el-button
          @click="openForm('create')"
          type="primary"
          plain
          v-hasPermi="['system:user:create']"
        >
          <Icon icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table
      :data="list"
      style="width: 100%"
      border
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="任务类型" prop="paringPlanUrgent" align="center" width="150px">
        <template #default="{ row }">
          <el-tag v-if="row.paringPlanUrgent == 0">普通</el-tag>
          <el-tag type="danger" v-if="row.paringPlanUrgent == 1">加急</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工单号" prop="workOrderCode" align="center" />
      <el-table-column label="最晚装配时间" prop="paringDeadline" align="center">
        <template #default="{ row }">
          {{ formatDate(row.paringDeadline) }}
        </template>
      </el-table-column>
      <el-table-column label="刀组编码" prop="toolGroupCode" align="center" />
      <el-table-column label="需求数量" prop="paringNum" align="center" />
      <el-table-column label="已装配数量" prop="matchingQuantity" align="center" />
      <el-table-column label="装配库存" prop="repertoryQuantity" align="center" />
      <el-table-column label="锁定数量" prop="matchingQuantity" align="center" />
      <el-table-column label="装配状态" prop="paringTaskState" align="center" width="120px">
        <template #default="{ row }">
          <el-tag type="info" v-if="row.paringTaskState == -1">库存不足</el-tag>
          <el-tag type="warning" v-if="row.paringTaskState == 0">刀具准备中</el-tag>
          <el-tag v-if="row.paringTaskState == 1">装配进行中</el-tag>
          <el-tag type="success" v-if="row.paringTaskState == 2">完成</el-tag>
          <el-tag type="danger" v-if="row.paringTaskState == 3">撤销</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已配送数量" prop="distributionNum" align="center" />
      <el-table-column label="生产计划编号" align="center" prop="projectNo" />
      <el-table-column label="零件图号" align="center" prop="partNo" />
      <el-table-column label="零件名称" align="center" prop="partName" />
      <el-table-column label="工序名称" align="center" prop="procName" />
      <el-table-column label="工序号" align="center" prop="procNo">
        <template #default="{ row }">
          <strong>
            {{ row.procNo }}
          </strong>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200px">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)"> 详情 </el-button>
          <el-button
            v-if="row.paringPlanUrgent !== 1 && row.paringTaskState === 0"
            link
            type="primary"
            @click="openForm('update', row)"
            v-hasPermi="['knifetool:param-template:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(row)"
            v-hasPermi="['knifetool:param-template:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <creatForm ref="formRef" @success="getList" />
  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import { getToolParingPlan, deleteToolParingPlan } from '@/api/knifetool/paring/paringPlan'
import viewDetails from './viewDetails.vue'
import creatForm from './creatForm.vue'
import { formatDate } from '@/utils/formatTime'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  paringTaskReceiver: 'paringPlan',
  workOrderCode: '',
  paringTaskState: '',
  paringDeadline: '',
  toolGroupCode: ''
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getToolParingPlan(queryParams)
    console.log(data)
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

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any) => {
  detailRef.value.open(data)
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, row?: any) => {
  formRef.value.open(type, row)
}

/** 删除按钮操作 */
const handleDelete = async (row) => {
  console.log(row)

  const params = { id: row.id }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteToolParingPlan(params)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
