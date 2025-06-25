<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-10 17:23:33
 * @FilePath: /cimp-tms-web/src/views/paring/paringRepertory/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="详情" width="1200">
    <el-table :data="list" style="width: 100%; margin-top: 20px" height="500">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column :prop="column.dataIndex" :label="column.title" align="center" />
      </template>
      <el-table-column prop="settingStatus" label="对刀登记" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.paringState === 1" type="success">绑定</el-tag>
          <el-tag v-if="row.paringState === 0" type="danger">解绑</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dynamicStatus" label="动平衡登记" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.dynamicStatus === 0" type="danger">未登记</el-tag>
          <el-tag v-if="row.dynamicStatus === 1" type="success">已登记</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="paringState" label="配刀状态" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.settingStatus === 0" type="danger">未登记</el-tag>
          <el-tag v-if="row.settingStatus === 1" type="success">已登记</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </Dialog>
</template>
<script lang="ts" setup>
import { getToolParing } from '@/api/knifetool/paring/paringRepertory'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const total = ref(0)
const list = ref<any>([]) // 列表的数

const queryParams = ref({
  groupCode: undefined,
  pageNo: 1,
  pageSize: 10
})

const columns = [
  { title: '刀组编码', dataIndex: 'groupCode' },
  { title: '刀柄物码', dataIndex: 'code' },
  { title: '刀具物码', dataIndex: 'headCode' },
  { title: '当前位置', dataIndex: 'location' },
  {
    title: '配刀时间',
    width: '170px',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  }
]

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    console.log(queryParams)
    const data = await getToolParing(queryParams.value)
    console.log(data)
    list.value = data.list
    total.value = data.total
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
    queryParams.value.groupCode = row.groupCode
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
