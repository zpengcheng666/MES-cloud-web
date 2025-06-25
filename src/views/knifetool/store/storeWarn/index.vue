<!--
 * @Author: hyj
 * @Description: 库存预警
 * @Date: 2024-06-17 16:04:35
 * @LastEditTime: 2024-06-21 14:24:11
 * @FilePath: /cimp-tms-web/src/views/store/storeWarn/index.vue
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
      <el-form-item prop="status">
        <el-select v-model="queryParams.status" placeholder="处理状态" style="width: 240px">
          <el-option label="未处理" :value="0" />
          <el-option label="已处理" :value="1" />
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
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column
          v-if="column.dataIndex === 'warnTime'"
          :label="column.title"
          :align="column.align"
        >
          <template #default="scope">
            {{ formatDate(scope.row.warnTime) }}
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="column.dataIndex === 'status'"
          :label="column.title"
          :align="column.align"
        >
          <template #default="scope">
            {{ scope.row.status == 0 ? '未处理' : '已处理' }}
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :prop="column.dataIndex"
          :label="column.title"
          :align="column.align"
        />
      </template>
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
import { getStoreWarn } from '@/api/knifetool/store/storeWarn'
import { formatDate } from '@/utils/formatTime'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  status: undefined
})

const columns = [
  { title: '刀具类码', dataIndex: 'code', align: 'center' },
  { title: '刀具名称', dataIndex: 'name', align: 'center' },
  { title: '通用规格', dataIndex: 'spec', align: 'center' },
  { title: '库存总数', dataIndex: 'storeCount', align: 'center', width: '120px' },
  { title: '安全库存上限', dataIndex: 'upLimit', align: 'center', width: '200px' },
  { title: '安全库存下限', dataIndex: 'downLimit', align: 'center', width: '200px' },
  { title: '预警时间', dataIndex: 'warnTime', align: 'center' },
  { title: '持续时间', dataIndex: 'takeTime', align: 'center' },
  { title: '处理状态', dataIndex: 'status', align: 'center' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getStoreWarn(queryParams)
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

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
