<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-03 10:10:14
 * @FilePath: /cimp-tms-web/src/views/store/storeRegister/queryOutbound.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" :title="dialogTitle" :fullscreen="true">
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="receiptNumber">
        <el-input v-model="queryParams.receiptNumber" placeholder="单据编号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item prop="date">
        <el-date-picker v-model="queryParams.date" type="daterange" value-format="YYYY-MM-DD" range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" class="!w-330px" />
      </el-form-item>
      <el-form-item prop="handover">
        <el-input v-model="queryParams.handover" placeholder="交接人员" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" />查询
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" style="width: 100%" class="mt-20px">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column v-if="column.dataIndex === 'useful'" :prop="column.dataIndex" :label="column.title"
          align="center">
          <template #default="scope">
            {{ scope.row.useful === 1 ? '个人' : '生产' }}
          </template>
        </el-table-column>

        <el-table-column v-else-if="column.dataIndex === 'createTime'" :prop="column.dataIndex" :label="column.title"
          align="center">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
      </template>
    </el-table>

    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </Dialog>
</template>
<script lang="ts" setup>
import { getOutGoodPage } from '@/api/knifetool/store/storeRegister'
import { formatDate } from '@/utils/formatTime'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const dialogTitle = ref('出库单查询')

const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  receiptNumber: '',
  date: '',
  startTime: '',
  endTime: '',
  handover: ''
})

const columns = [
  { title: '单据编号', dataIndex: 'receiptNumber', align: 'center' },
  {
    title: '出库用途',
    dataIndex: 'useful',
    align: 'center'
  },
  { title: '关联计划单号', dataIndex: 'planeNumber', align: 'center' },
  { title: '出库数量', dataIndex: 'amount', align: 'center' },
  {
    title: '出库时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  { title: '对接人员', dataIndex: 'handover', align: 'center' },
  { title: '库管人员', dataIndex: 'admin', align: 'center' }
]

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  getList()
}
defineExpose({ open })

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true

  try {
    const res = await getOutGoodPage(queryParams)
    list.value = res.list
    total.value = res.total
    console.log(res)
  } finally {
    detailLoading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  console.log(queryParams.date)
  if (queryParams.date !== null) {
    queryParams.startTime = queryParams.date[0]
    queryParams.endTime = queryParams.date[1]
  } else {
    queryParams.startTime = ''
    queryParams.endTime = ''
  }
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
</script>
