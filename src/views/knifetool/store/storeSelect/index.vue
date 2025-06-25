<!--
 * @Author: hyj
 * @Description: 库存查询
 * @Date: 2024-06-17 16:04:35
 * @LastEditTime: 2024-06-27 10:00:57
 * @FilePath: /cimp-tms-web/src/views/store/storeSelect/index.vue
-->
<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="toolCategoryValue">
        <formTreeSelect ref="treeValue" @tree-value="setFormTreeValue" />
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="queryParams.name" placeholder="刀具名称" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>
      <el-form-item prop="spec">
        <el-input v-model="queryParams.spec" placeholder="刀具通用规格" clearable @keyup.enter="handleQuery"
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
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column :prop="column.dataIndex" :label="column.title" :align="column.align" :width="column.width" />
      </template>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openDetail(scope.row)" v-hasPermi="['']">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import { getStoreSelect } from '@/api/knifetool/store/storeSelect'
import formTreeSelect from '@/components/store/formTreeSelect.vue'
import viewDetails from './viewDetails.vue';

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  toolCategoryValue: undefined,
  spec: undefined,
  name: undefined
})

const columns = [
  { title: '刀具类码', dataIndex: 'code', ellipsis: true, align: 'center', export: true },
  { title: '刀具名称', dataIndex: 'name', ellipsis: true, align: 'center', export: true },
  {
    title: '通用规格',
    dataIndex: 'spec',
    ellipsis: true,
    align: 'center',
    export: true,
    width: '230px'
  },
  {
    title: '刀具分类',
    dataIndex: 'toolCategoryValue',
    ellipsis: true,
    align: 'center',
    export: true
  },
  {
    title: '库存总数',
    dataIndex: 'storeCount',
    ellipsis: true,
    align: 'center',
    width: '120px',
    export: true
  },
  {
    title: '新品数量',
    dataIndex: 'storeNumNew',
    ellipsis: true,
    align: 'center',
    width: '120px',
    export: true
  },
  {
    title: '在用品数量',
    dataIndex: 'storeNumOld',
    ellipsis: true,
    align: 'center',
    width: '120px',
    export: true
  }
]

// 设置选中的刀具分类
const treeValue = ref()
const setFormTreeValue = (val) => {
  console.log(val)
  queryParams.toolCategoryValue = val
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getStoreSelect(queryParams)
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
  // 清空刀具分类的值
  treeValue.value.toolCategoryValue = undefined
  handleQuery()
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any) => {
  detailRef.value.open(data)
}

// /** 导出按钮操作 */
// const handleExport = async () => {
//   try {
//     // 导出的二次确认
//     await message.exportConfirm()
//     // 发起导出
//     exportLoading.value = true
//     const data = await OperateLogApi.exportOperateLog(queryParams)
//     download.excel(data, '操作日志.xls')
//   } catch {
//   } finally {
//     exportLoading.value = false
//   }
// }

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
