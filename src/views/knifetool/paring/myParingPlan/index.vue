<!--
 * @Author: hyj
 * @Description: 我的配刀任务
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-08-02 09:13:09
 * @FilePath: /cimp-tms-web/src/views/paring/myParingPlan/index.vue
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
      <el-form-item prop="paringTaskState">
        <el-select
          v-model="queryParams.paringTaskState"
          placeholder="请选择配刀状态"
          class="!w-240px"
        >
          <el-option value="0" label="刀具准备中" />
          <el-option value="1" label="配刀进行中" />
          <el-option value="2" label="完成" />
          <el-option value="4" label="未完成" />
          <el-option value="3" label="撤销" />
        </el-select>
      </el-form-item>
      <el-form-item prop="workOrderCode">
        <el-input v-model="queryParams.workOrderCode" placeholder="请输入工单号" class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <!-- :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->

    <el-table :data="list" style="width: 100%; margin-bottom: 20px" row-key="id" border>
      <el-table-column label="序号" align="center" prop="treeIndex" />
      <el-table-column label="工单号" align="center" prop="workOrderCode" />
      <el-table-column label="最晚配刀时间" align="center" prop="paringDeadline">
        <template #default="{ row }">
          {{ formatDate(row.paringDeadline) }}
        </template>
      </el-table-column>
      <el-table-column label="最短加工时长（分钟）" align="center" prop="minimumTime" />
      <el-table-column label="刀组编码" align="center" prop="toolGroupCode" />
      <el-table-column label="需求数量" align="center" prop="paringNum" />
      <el-table-column label="刀组库存量" align="center" prop="repertoryQuantity" />
      <el-table-column label="锁定数量" align="center" prop="matchingQuantity" />
      <el-table-column label="生产计划编号" align="center" prop="projectNo" />
      <el-table-column label="零件图号" align="center" prop="partNo" />
      <el-table-column label="名称" align="center" prop="partName" />
      <!-- <el-table-column label="机床" align="center" prop="equName" /> -->
      <el-table-column label="工序名称" align="center" prop="procName" />
      <el-table-column label="状态" align="center" prop="paringTaskState" width="110px">
        <template #default="{ row }">
          <el-tag type="info" v-if="row.paringTaskState == -1">库存不足</el-tag>
          <el-tag type="warning" v-if="row.planType == 1 && row.paringTaskState == 0">
            刀具准备中
          </el-tag>
          <el-tag v-if="row.planType == 1 && row.paringTaskState == 1">配刀进行中</el-tag>
          <el-tag color="#95d475" v-if="row.planType == 1 && row.paringTaskState == 2">完成</el-tag>
          <el-tag type="danger" v-if="row.planType == 1 && row.paringTaskState == 3">撤销</el-tag>
          <el-tag type="warning" color="#f8e3c5" v-if="row.planType != 1 && row.planState != 1"
            >准备中</el-tag
          >
          <el-tag type="success" v-if="row.planType != 1 && row.planState == 1">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="装配类型" align="center" prop="planType">
        <template #default="{ row }">
          <el-tag type="warning" v-if="row.planType == 1">刀具</el-tag>
          <el-tag v-if="row.planType == 2">工装</el-tag>
          <el-tag type="success" v-if="row.planType == 3">原材料</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="工序号" align="center" prop="procNo" />
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="{ row }">
          <!-- <el-button
            v-if="row.planType == 1 && row.paringTaskState !== 3 && row.paringTaskState !== -1"
            @click="openForm(row)"
            link
            type="primary"
          > -->
          <el-button
            @click="openForm(row)"
            link
            type="primary"
          >
            配刀
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

  <assembleTool ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getToolParingPlan } from '@/api/knifetool/paring/myParingPlan'
import { formatDate } from '@/utils/formatTime'
import creatForm from './creatForm.vue'
import assembleTool from './assembleTool.vue'
import { useCache, CACHE_KEY } from '@/hooks/web/useCache'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  paringTaskState: '',
  workOrderCode: '',
  pageNo: 1,
  pageSize: 10,
  paringTaskReceiverId: '',
  paringTaskReceiver: 'admin'
})

const setIndex = (arr) => {
  return arr.map((item, i) => {
    if (item.children !== null && item.children.length > 0) {
      item.children = setIndex(item.children)
    }
    return { treeIndex: i + 1, ...item }
  })
}

/** 查询列表 */
const getList = async () => {
  const { wsCache } = useCache()
  const userInfo = wsCache.get(CACHE_KEY.USER);
  queryParams.paringTaskReceiverId = userInfo.user.id
  loading.value = true
  try {
    const data = await getToolParingPlan(queryParams)
    console.log(data)
    list.value = setIndex(data.list)
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  console.log(queryParams)
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

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
