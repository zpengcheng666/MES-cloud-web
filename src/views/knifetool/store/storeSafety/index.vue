<!--
 * @Author: hyj
 * @Description: 安全库存
 * @Date: 2024-06-20 10:58:45
 * @LastEditTime: 2024-07-16 16:54:16
 * @FilePath: /cimp-tms-web/src/views/store/storeSafety/index.vue
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
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="刀具名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="刀具通用规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
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
          v-if="column.dataIndex === 'upLimit'"
          :label="column.title"
          :align="column.align"
        >
          <template #default="scope">
            {{ scope.row.upLimit === null ? '未设置' : scope.row.upLimit }}
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="column.dataIndex === 'downLimit'"
          :label="column.title"
          :align="column.align"
        >
          <template #default="scope">
            {{ scope.row.downLimit === null ? '未设置' : scope.row.downLimit }}
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :prop="column.dataIndex"
          :label="column.title"
          :align="column.align"
          :width="column.width"
        />
      </template>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row)"
            v-hasPermi="['knifetool:param-template:update']"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <editSafetyForm ref="formRef" @success="updateSuccess" />
</template>

<script setup lang="ts">
import { getStoreSafety } from '@/api/knifetool/store/storeSafety'
import editSafetyForm from './editSafetyForm.vue'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  spec: undefined,
  name: undefined
})

const columns = [
  { title: '刀具类码', dataIndex: 'code', align: 'center' },
  { title: '刀具名称', dataIndex: 'name', align: 'center' },
  { title: '通用规格', dataIndex: 'spec', align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', align: 'center' },
  { title: '库存总数', dataIndex: 'storeCount', align: 'center', width: '120px' },
  {
    title: '安全库存上限',
    dataIndex: 'upLimit',
    align: 'center',
    width: '120px'
  },
  {
    title: '安全库存下限',
    dataIndex: 'downLimit',
    align: 'center',
    width: '120px'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getStoreSafety(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, row?: any) => {
  formRef.value.open(type, row)
}

/** 初始化 */
onMounted(() => {
  getList()
})

const updateSuccess = () => {
  getList()
}
</script>

<style scoped></style>
