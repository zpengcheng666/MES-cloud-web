<!--
 * @Author: hyj
 * @Description: 入库
 * @Date: 2024-07-25 15:37:19
 * @LastEditTime: 2024-07-26 10:32:38
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/page/baofei.vue
-->
<template>
  <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
    <template v-for="column in columns" :key="column.dataIndex">
      <el-table-column :label="column.title" align="center" :prop="column.dataIndex" />
    </template>
  </el-table>
</template>

<script setup lang="ts">
import { history } from '@/api/knifetool/toolDetail/toolComponentInfo'

const props = defineProps({
  currentRow: {
    type: Object
  }
})

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const queryParams = reactive({
  id: props.currentRow?.id
})

const columns = [
  {
    title: '发生时间',
    dataIndex: 'occTime'
  },
  {
    title: '发生地点',
    dataIndex: 'address'
  },
  {
    title: '办理事项',
    dataIndex: 'reasons'
  },
  {
    title: '事件发起人',
    dataIndex: 'register'
  },
  {
    title: '办理人员',
    dataIndex: 'approver'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await history(queryParams)
    console.log(data)
    list.value = data.list
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
