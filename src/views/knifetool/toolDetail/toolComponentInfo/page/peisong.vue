<!--
 * @Author: hyj
 * @Description: 入库
 * @Date: 2024-07-25 15:37:19
 * @LastEditTime: 2024-07-26 10:41:27
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/page/peisong.vue
-->
<template>
  <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
    <template v-for="column in columns" :key="column.dataIndex">
      <el-table-column
        v-if="column.dataIndex === 'deliveryRecordAddress'"
        :label="column.title"
        align="center"
        :prop="column.dataIndex"
      >
        <span>其他</span>
      </el-table-column>
      <el-table-column
        v-else-if="column.dataIndex === 'deliveryRecordReasons'"
        :label="column.title"
        align="center"
        :prop="column.dataIndex"
      >
        <span>刀具配送</span>
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
import { listToolDeliveryRecordPage } from '@/api/knifetool/toolDetail/toolComponentInfo'

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
  code: props.currentRow?.objectCode
})

const columns = [
  {
    title: '发生时间',
    dataIndex: 'createTime'
  },
  {
    title: '发生地点',
    dataIndex: 'deliveryRecordAddress'
  },
  {
    title: '办理事项',
    dataIndex: 'deliveryRecordReasons'
  },
  {
    title: '事件发起人',
    dataIndex: 'creator'
  },
  {
    title: '办理人员',
    dataIndex: 'deliveryByValue'
  },
  {
    title: '办理单号',
    dataIndex: 'deliveryNo'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await listToolDeliveryRecordPage(queryParams)
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
