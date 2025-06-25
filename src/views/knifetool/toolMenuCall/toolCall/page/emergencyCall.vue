<!--
 * @Author: hyj
 * @Description: 紧急呼叫任务
 * @Date: 2024-07-24 09:29:49
 * @LastEditTime: 2024-07-25 11:28:27
 * @FilePath: /cimp-tms-web/src/views/toolMenuCall/toolCall/page/emergencyCall.vue
-->
<template>
  <ContentWrap>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="workNo">
        <el-input
          v-model="queryParams.workNo"
          placeholder="工单号"
          clearable
          @keyup.enter="handleQuery"
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
    <el-table :data="list" style="width: 100%">
      <el-table-column label="工单号" align="center" prop="workNo" />
      <el-table-column label="最晚配送日期" align="center" prop="latestDeliveryTime">
        <template #default="{ row }">
          {{ formatDate(row.latestDeliveryTime) }}
        </template>
      </el-table-column>
      <el-table-column label="刀组编码" align="center" prop="groupCode" />
      <el-table-column label="计划需求数量" align="center" prop="planQuantity" />
      <el-table-column label="实际需求数量" align="center" prop="actualQuantity" />
      <el-table-column label="缺少数量" align="center" prop="lackQuantity" />
      <el-table-column label="审核状态" align="center" prop="approveStateValue">
        <template #default="{ row }">
          <el-tag el-tag v-if="row.approveStateValue === '审核通过'" type="success">{{
            row.approveStateValue
          }}</el-tag>
          <el-tag v-if="row.approveStateValue === '已撤销'">{{ row.approveStateValue }}</el-tag>
          <el-tag el-tag v-if="row.approveStateValue === '审核不通过'" type="danger">{{
            row.approveStateValue
          }}</el-tag>
          <el-tag el-tag v-if="row.approveStateValue === '待审核'" type="warning">{{
            row.approveStateValue
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          {{ row.approveStatus }}
          <el-button
            v-if="list.length && row.approveState === 0"
            link
            type="primary"
            @click="handleUndo(row)"
          >
            撤销
          </el-button>
          <el-button
            link
            @click="openForm('update', row)"
            type="primary"
            v-if="row.approveState === 2"
          >
            编辑
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
  <createForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getToolUrgentAssignmentList, updateApproveState } from '@/api/knifetool/toolMenuCall/toolCall'
import { formatDate } from '@/utils/formatTime'
import createForm from './creatForm.vue'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  workNo: '',
  pageNo: 1,
  pageSize: 10
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getToolUrgentAssignmentList(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
defineExpose({ getList })

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
const openForm = (type: string, row?: any) => {
  formRef.value.open(type, row)
}

const handleUndo = (row) => {
  ElMessageBox.confirm('是否确认撤销该记录？')
    .then(async () => {
      const data = await updateApproveState({
        id: row.id,
        approveState: -1
      })

      if (data) {
        ElMessage({ message: '撤销成功', type: 'success' })
      } else {
        ElMessage({ message: data.msg, type: 'error' })
      }
      getList()
    })
    .catch(() => {
      // catch error
    })
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
