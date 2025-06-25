<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-08-02 15:12:11
 * @FilePath: /cimp-tms-web/src/views/storeCheck/task/index.vue
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
      <el-form-item prop="storeMenutreeId">
        <formStoreSelect
          ref="formStoreSelectRef"
          @handle-select="(val) => setFormSelectValue(val, 'storeMenutreeId')"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item prop="latestCheckTime">
        <el-date-picker
          class="!w-240px"
          v-model="queryParams.latestCheckTime"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="最晚提交日期"
        />
      </el-form-item>
      <el-form-item prop="planFlag">
        <el-select
          v-model="queryParams.planFlag"
          allow-clear
          placeholder="请选择任务状态..."
          class="!w-240px"
        >
          <el-option label="未开始" value="0" />
          <el-option label="已开始" value="1" />
          <el-option label="已完成" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="仓库名称" align="center" prop="storeMenutreeName" />
      <el-table-column label="计划名称" align="center" prop="planName" />
      <el-table-column label="最晚提交时间" align="center" prop="latestCheckTime">
        <template #default="{ row }">
          {{ formatDate(row.latestCheckTime, 'YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" prop="planFlag">
        <template #default="{ row }">
          <el-tag v-if="row.planFlag === 0" style="color: dodgerblue">未开始</el-tag>
          <el-tag v-if="row.planFlag === 1" style="color: orange">已开始</el-tag>
          <el-tag v-if="row.planFlag === 2" style="color: green">已完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            v-if="scope.row.planFlag === 2"
            link
            type="primary"
            @click="openDetail(scope.row)"
          >
            查看详情
          </el-button>
          <el-button v-else link type="primary" @click="openForm(scope.row)"> 开始盘点 </el-button>
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

  <checkForm ref="formRef" @success="getList" />
  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import { getCheckPlan, taskVO } from '@/api/knifetool/storeCheck/task'
import formStoreSelect from '@/components/store/formStoreSelect.vue'
import { formatDate } from '@/utils/formatTime'
import checkForm from './checkForm.vue'
import viewDetails from './viewDetails.vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive<taskVO>({
  pageNo: 1,
  pageSize: 10,
  chargeUserId: userStore.getUser.id,
  storeMenutreeId: undefined,
  latestCheckTime: '',
  planFlag: ''
})

const formStoreSelectRef = ref()
const setFormSelectValue = (val: string, prop: string) => {
  queryParams[prop] = val
  console.log(queryParams)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    console.log(queryParams)
    const data = await getCheckPlan(queryParams)
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
  formStoreSelectRef.value.setValueUndefined()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (row: any) => {
  formRef.value.open(row)
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
