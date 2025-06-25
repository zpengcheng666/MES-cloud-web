<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-06-18 15:50:24
 * @FilePath: /cimp-tms-web/src/views/store/storeSelect/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" title="详情" width="1000">
    <el-descriptions :column="3" border>
      <el-descriptions-item label="刀具类码">{{ detailObj.code }}</el-descriptions-item>
      <el-descriptions-item label="刀具名称">{{ detailObj.name }}</el-descriptions-item>
      <el-descriptions-item label="通用规格">{{ detailObj.spec }}</el-descriptions-item>
      <el-descriptions-item label="刀具分类">{{
        detailObj.toolCategoryValue
      }}</el-descriptions-item>
      <el-descriptions-item label="库存个数">{{ detailObj.storeCount }}</el-descriptions-item>
      <el-descriptions-item label="新品数量">{{ detailObj.storeNumNew }}</el-descriptions-item>
      <el-descriptions-item label="在用品数量">{{ detailObj.storeNumOld }}</el-descriptions-item>
      <el-descriptions-item label="预约个数">{{ detailObj.storeCount }}</el-descriptions-item>
      <el-descriptions-item label="可用个数">{{ detailObj.storeCount }}</el-descriptions-item>
      <el-descriptions-item label="所在库位数">{{ total }}</el-descriptions-item>
    </el-descriptions>

    <el-table :data="list" style="width: 100%; margin-top: 50px">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.childrens" :border="false">
            <template v-for="iColumn in innerColumns" :key="iColumn.dataIndex">
              <el-table-column
                :label="iColumn.title"
                :prop="iColumn.dataIndex"
                :align="iColumn.align"
              />
            </template>
          </el-table>
        </template>
      </el-table-column>
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column :prop="column.dataIndex" :label="column.title" :align="column.align" />
      </template>
    </el-table>

    <Pagination
      v-if="list.length >= formData.pageSize"
      style="margin-top: 30px"
      :total="total"
      v-model:page="formData.pageNo"
      v-model:limit="formData.pageSize"
      @pagination="getList"
    />
  </Dialog>
</template>
<script lang="ts" setup>
import { getSubPage } from '@/api/knifetool/store/storeSelect'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const total = ref(0)
const list = ref<any>([]) // 列表的数

const formData = ref({
  toolInformationId: undefined,
  pageNo: 1,
  pageSize: 10
})

const columns = [
  {
    title: '仓库名称',
    dataIndex: 'storeName',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '货架名称',
    dataIndex: 'shelfName',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '货位编号',
    dataIndex: 'location',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '管理员',
    dataIndex: 'admin',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '货位库存',
    dataIndex: 'storeNumber',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '仓库位置',
    dataIndex: 'locationName',
    ellipsis: true,
    align: 'center'
  }
]
const innerColumns = [
  {
    title: '刀具物码',
    dataIndex: 'objectCode',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '盒子码',
    dataIndex: 'boxCode',
    ellipsis: true,
    align: 'center'
  }
]

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    const data = await getSubPage(formData.value)
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
    formData.value.toolInformationId = row.informationId
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
