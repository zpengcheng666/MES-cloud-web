<!--
 * @Author: hyj
 * @Description: 入库
 * @Date: 2024-07-25 15:37:19
 * @LastEditTime: 2024-07-26 10:44:21
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/page/rengmo.vue
-->
<template>
  <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
    <template v-for="column in columns" :key="column.dataIndex">
      <el-table-column :label="column.title" align="center" :prop="column.dataIndex" />
    </template>
    <el-table-column label="刃磨状态" align="center" prop="flag">
      <template #default="{ row }">
        <el-tag :type="row.flag === 0 ? 'danger' : row.flag === 1 ? 'success' : 'warning'">
          {{ row.flag === 0 ? '已准备' : row.flag === 1 ? '刃磨完成' : '刃磨失败' }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
  <Pagination
    :total="total"
    v-model:page="queryParams.pageNo"
    v-model:limit="queryParams.pageSize"
    @pagination="getList"
  />
</template>

<script setup lang="ts">
import { listToolCutterGrindingByPage } from '@/api/knifetool/toolDetail/toolComponentInfo'

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
  toolCode: props.currentRow?.objectCode
})

const columns = [
  { title: '刀具物码', dataIndex: 'toolCode', align: 'center' },
  { title: '刃磨次数', dataIndex: 'times', align: 'center' },
  { title: '通用规格', dataIndex: 'toolModel', align: 'center' },
  { title: '更新时间', dataIndex: 'updateTime', align: 'center' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await listToolCutterGrindingByPage(queryParams)
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
