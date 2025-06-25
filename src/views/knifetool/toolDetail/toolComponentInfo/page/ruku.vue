<!--
 * @Author: hyj
 * @Description: 入库
 * @Date: 2024-07-25 15:37:19
 * @LastEditTime: 2024-07-26 10:38:01
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/page/ruku.vue
-->
<template>
  <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
    <template v-for="column in columns" :key="column.dataIndex">
      <el-table-column
        v-if="column.dataIndex === 'type'"
        :label="column.title"
        align="center"
        :prop="column.dataIndex"
      >
        <template #default="{ row }">
          <span v-if="row.type === 1">新品入库</span>
          <span v-if="row.type === 2">归还入库</span>
        </template>
      </el-table-column>
      <el-table-column v-else :label="column.title" align="center" :prop="column.dataIndex" />
    </template>
  </el-table>
  <Pagination
    :total="total"
    v-model:page="queryParams.pageNo"
    v-model:limit="queryParams.pageSize"
    @pagination="getList"
  />
</template>

<script setup lang="ts">
import { getStoreInOutRecordByCodeAndTypePage } from '@/api/knifetool/toolDetail/toolComponentInfo'

const props = defineProps({
  currentRow: {
    type: Object
  }
})

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: 1,
  code: props.currentRow?.objectCode
})

const columns = [
  {
    title: '发生时间',
    dataIndex: 'time'
  },
  {
    title: '发生地点',
    dataIndex: 'location'
  },
  {
    title: '办理事项',
    dataIndex: 'type'
  },
  {
    title: '事件发起人',
    dataIndex: 'creator'
  },
  {
    title: '办理人员',
    dataIndex: 'handover'
  },
  {
    title: '办理单号',
    dataIndex: 'receiptNumber'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getStoreInOutRecordByCodeAndTypePage(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
