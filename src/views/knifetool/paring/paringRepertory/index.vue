<!--
 * @Author: hyj
 * @Description:组合动平衡
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-08-06 14:19:28
 * @FilePath: /cimp-tms-web/src/views/paring/paringRepertory/index.vue
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
      <el-form-item prop="groupCode">
        <el-input
          v-model="queryParams.groupCode"
          placeholder="刀组编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item prop="hiltCode">
        <el-input
          v-model="queryParams.hiltCode"
          placeholder="刀柄类码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item prop="hiltSpec">
        <el-input
          v-model="queryParams.hiltSpec"
          placeholder="刀柄通用规格"
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
      <template v-for="column in columns" :key="column.id">
        <el-table-column :prop="column.dataIndex" :label="column.title" align="center" />
      </template>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)"> 详情 </el-button>
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

  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import { getRepertoryPage, listVO } from '@/api/knifetool/paring/paringRepertory'
import viewDetails from './viewDetails.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive<listVO>({
  groupCode: '',
  hiltCode: '',
  hiltSpec: '',
  pageNo: 1,
  pageSize: 10
})

const columns = [
  //数据列表
  { title: '刀组编码', dataIndex: 'groupCode' },
  { title: '刀柄类码', dataIndex: 'hiltCode' },
  { title: '刀柄通用规格', dataIndex: 'hiltSpec' },
  { title: '刀具类码', dataIndex: 'headClassCode' },
  { title: '刀具通用规格', dataIndex: 'headSpec' },
  { title: '当前库存数量', dataIndex: 'count' },
  { title: '当前位置', dataIndex: 'location' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getRepertoryPage(queryParams)
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

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any) => {
  detailRef.value.open(data)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
