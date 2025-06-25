<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-08-01 15:15:04
 * @FilePath: /cimp-tms-web/src/views/storeCheck/task/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="详情" width="80%">
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
      <el-form-item prop="toolCategoryId">
        <formTreeSelect
          ref="treeValue"
          @tree-value="(val) => setFormTreeValue(val, 'toolCategoryId')"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item prop="toolSpec">
        <el-input placeholder="刀具规格" v-model="queryParams.toolSpec" class="!w-240px" />
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
    <el-table :data="list" style="width: 100%; margin-top: 20px" height="500">
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
      <el-table-column prop="createTime" label="盘点时间" align="center">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
</template>
<script lang="ts" setup>
import { getCheckPlanItemByPlanId } from '@/api/knifetool/storeCheck/task'
import formTreeSelect from '@/components/store/formTreeSelect.vue'
import { formatDate } from '@/utils/formatTime'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const list = ref<any>([]) // 列表的数

const queryParams = ref({
  toolCategoryId: '',
  toolSpec: '',
  realFlag: undefined
})

const columns = [
  { title: '刀具类码', dataIndex: 'toolCode', align: 'center' },
  { title: '刀具名称', dataIndex: 'toolName', align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', align: 'center' },
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
  }
]

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    const res = await getCheckPlanItemByPlanId({ planId: planId.value })
    console.log(res.items)

    let data = res.items
    if (queryParams.value.toolCategoryId !== '') {
      data = data.filter((item: any) => item.toolCategoryId === queryParams.value.toolCategoryId)
    }

    if (queryParams.value.toolSpec !== '') {
      data = data.filter((item: any) => {
        console.log(item.toolSpec)
        console.log(item.toolSpec?.indexOf(queryParams.value.toolSpec))
        return item.toolSpec !== null && item.toolSpec?.indexOf(queryParams.value.toolSpec) !== -1
      })
    }

    if (queryParams.value.realFlag !== undefined) {
      data = data.filter((item: any) =>
        queryParams.value.realFlag === '2'
          ? item.realCounts - item.recordCounts > 0
          : item.realCounts - item.recordCounts < 0
      )
    }

    list.value = data
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const planId = ref()
const open = async (row: any) => {
  dialogVisible.value = true
  try {
    detailLoading.value = true
    planId.value = row.id
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const treeValue = ref()
const setFormTreeValue = (val: string, prop: string) => {
  queryParams.value[prop] = val
}

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
