<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-08 14:25:54
 * @FilePath: /cimp-tms-web/src/views/toolScrap/scrapManage/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="详情" width="1000">
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="toolCode">
        <formTreeSelect ref="treeValue" @tree-value="(val) => setFormTreeValue(val, 'toolCode')" />
      </el-form-item>
      <el-form-item prop="toolSpec">
        <el-input placeholder="刀具规格" v-model="queryParams.toolSpec" />
      </el-form-item>
      <el-form-item prop="realFlag">
        <el-select
          v-model="queryParams.realFlag"
          allow-clear
          placeholder="盈亏状态..."
          class="!w-240px"
        >
          <el-option label="盈" value="2" />
          <el-option label="亏" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" height="400">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column
          v-if="column.dataIndex === 'realResult'"
          :prop="column.dataIndex"
          :label="column.title"
          :align="column.align"
        >
          <template #default="{ row }">
            {{ row.realCounts - row.recordCounts }}
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
  </Dialog>
</template>
<script lang="ts" setup>
// import { getSubPage } from '@/api/store/storeSelect'
// import { getCheckPlanItemByPlanId } from '@/api/storeCheck/task'
// import formTreeSelect from '@/components/store/formTreeSelect.vue'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const list = ref<any>([]) // 列表的数

const queryParams = ref({
  planId: undefined,
  pageNo: 1,
  pageSize: 10,
  toolCode: '',
  toolSpec: '',
  realFlag: ''
})

const columns = [
  { title: '刀具类码', dataIndex: 'toolCode', align: 'center' },
  { title: '刀具名称', dataIndex: 'toolName', align: 'center' },
  { title: '刀具规格', dataIndex: 'toolSpec', align: 'center' },
  {
    title: '账面数量',
    dataIndex: 'recordCounts',
    align: 'center'
  },
  { title: '实际数量', dataIndex: 'realCounts', align: 'center' },
  {
    title: '盈亏数量',
    dataIndex: 'realResult',
    align: 'center'
  },
  { title: '盘点时间', dataIndex: 'createTime' }
]

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    console.log(queryParams)
    const data = await getCheckPlanItemByPlanId(queryParams.value)
    console.log(data.items)
    list.value = data.items
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  try {
    detailLoading.value = true
    detailObj.value = row
    queryParams.value.planId = row.id
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const treeValue = ref()
const setFormTreeValue = (val: string, prop: string) => {
  queryParams[prop] = val
  console.log(queryParams)
}
// 设置选中的刀具分类
// const treeValue = ref()
// const setFormTreeValue = (val) => {
//   // console.log(val)
//   queryParams.toolCategoryValue = val
// }

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const queryFormRef = ref() // 搜索的表单
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // 清空刀具分类的值
  treeValue.value.toolCategoryValue = undefined
  handleQuery()
}
</script>
