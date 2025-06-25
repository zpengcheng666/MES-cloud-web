<!--
 * @Author: hyj
 * @Description:紧急装配任务审批
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-07-18 15:20:58
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlanUrgent/index.vue
-->
<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="workNo">
        <el-input v-model="queryParams.workNo" placeholder="工单号" class="!w-240px" />
      </el-form-item>
      <el-form-item prop="groupCode">
        <el-input v-model="queryParams.groupCode" placeholder="刀组编码" class="!w-240px" />
      </el-form-item>
      <el-form-item prop="approveState">
        <el-select v-model="queryParams.approveState" placeholder="请选择审核状态" class="!w-240px">
          <el-option :value="0" label="待审核" />
          <el-option :value="1" label="审核通过" />
          <el-option :value="2" label="审核不通过" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="工单号" align="center" prop="workNo" />
      <el-table-column label="最晚配送日期" align="center" prop="latestDeliveryTime" />
      <el-table-column label="刀组编码" align="center" prop="groupCode" />
      <el-table-column label="计划需求数量" align="center" prop="planQuantity">
        <template #default="{ row }">
          <span v-if="row.planQuantity === null || row.planQuantity === ''">紧急呼叫</span>
          <span v-if="row.planQuantity !== null && row.planQuantity !== ''">{{
            row.planQuantity
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际需求数量" align="center" prop="actualQuantity" />
      <el-table-column label="缺少数量" align="center" prop="lackQuantity" />
      <el-table-column label="审核状态" align="center" prop="approveStateValue">
        <template #default="{ row }">
          <el-tag v-if="row.approveStateValue === '待审核'" type="warning">{{
            row.approveStateValue
          }}</el-tag>
          <el-tag v-if="row.approveStateValue === '审核通过'" type="success">{{
            row.approveStateValue
          }}</el-tag>
          <el-tag v-if="row.approveStateValue === '审核不通过'" type="danger">{{
            row.approveStateValue
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.approveState !== 0"
            link
            type="primary"
            @click="openForm('details', row)"
          >
            详情
          </el-button>
          <el-button
            v-if="row.approveState === 0"
            link
            type="primary"
            @click="openForm('update', row)"
            v-hasPermi="['knifetool:param-template:update']"
          >
            审批
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
</template>

<script setup lang="ts">
import { getToolUrgentAssignmentList } from '@/api/knifetool/paring/paringPlanUrgent'
import creatForm from './creatForm.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  workNo: '',
  groupCode: '',
  approveState: ''
})

/** 查询列表 */
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

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
