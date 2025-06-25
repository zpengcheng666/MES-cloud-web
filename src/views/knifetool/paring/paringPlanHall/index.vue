<!--
 * @Author: hyj
 * @Description: 装配任务大厅
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-07-18 10:47:41
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlanHall/index.vue
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
      <el-form-item prop="paringDeadline">
        <el-date-picker
          v-model="queryParams.paringDeadline"
          type="date"
          placeholder="最晚装配时间"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <template v-for="column in columns" :key="column.id">
        <el-table-column
          v-if="column.dataIndex === 'paringPlanUrgent'"
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
        >
          <template #default="{ row }">
            <el-tag v-if="row.paringPlanUrgent === 0">普通</el-tag>
            <el-tag v-if="row.paringPlanUrgent === 1" type="danger">加急</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="column.dataIndex === 'paringDeadline'"
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
        >
          <template #default="{ row }">
            {{ formatDate(row.paringDeadline) }}
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="column.dataIndex === 'paringTaskReceiver'"
          :prop="column.dataIndex"
          :label="column.title"
          align="center"
          width="100px"
        >
          <template #default="{ row }">
            <el-tag type="success" v-if="row.paringTaskState != -1">待接单</el-tag>

            <el-tooltip v-else :content="row.taskRemark">
              <el-tag type="danger">库存不足</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
      </template>

      <el-table-column label="操作" align="center" fixed="right">
        <template #default="{ row }">
          <!-- <el-button
            @click="receiving(row)"
            v-if="row.paringTaskReceiverId != -1 && row.paringTaskState !== -1"
            link
            type="primary"
          > -->
          <el-button
            @click="receiving(row)"
            link
            type="primary"
          >
            接单
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
</template>

<script setup lang="ts">
import { getToolParingPlan, handleReceiving } from '@/api/knifetool/paring/paringPlanHall'
import { formatDate } from '@/utils/formatTime'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  paringDeadline: '',
  pageNo: 1,
  pageSize: 10
})

const columns = [
  //数据列表
  { title: '序号', dataIndex: 'treeIndex', width: 50, align: 'center' },
  { title: '工单号', align: 'center', dataIndex: 'workOrderCode' },
  { title: '任务类型', align: 'center', dataIndex: 'paringPlanUrgent' },
  { title: '最晚装配时间', align: 'center', width: '170px', dataIndex: 'paringDeadline' },
  { title: '最短加工时长', align: 'center', dataIndex: 'minimumTime' },
  { title: '刀组编码', align: 'center', dataIndex: 'toolGroupCode' },
  { title: '需求数量', align: 'center', dataIndex: 'paringNum' },
  { title: '配刀库存数量', align: 'center', dataIndex: 'repertoryQuantity' },
  { title: '锁定数量', align: 'center', dataIndex: 'matchingQuantity' },
  { title: '生产计划编号', align: 'center', dataIndex: 'projectNo' },
  { title: '零件图号', align: 'center', dataIndex: 'partNo' },
  { title: '零件名称', align: 'center', dataIndex: 'partName' },
  { title: '材质', align: 'center', dataIndex: 'toolMaterial' },
  { title: '工序名称', align: 'center', dataIndex: 'procName' },
  { title: '刀具直径', align: 'center', dataIndex: 'toolDiameter' },
  { title: '刀具R角', align: 'center', dataIndex: 'toolBottomr' },
  { title: '刀组总长', align: 'center', dataIndex: 'toolClassTotal' },
  { title: '刀具悬长', align: 'center', dataIndex: 'toolHangLength' },
  { title: '装配状态', align: 'center', dataIndex: 'paringTaskReceiver' },
  { title: '工序号', align: 'center', dataIndex: 'procNo' }
]

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

const receiving = async (row) => {
  try {
    // 二次确认
    await message.confirm('是否确认接单？')
    const data = await handleReceiving({ id: row.id })
    console.log(data)

    message.success('接单成功')
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
