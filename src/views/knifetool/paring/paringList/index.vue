<!--
 * @Author: hyj
 * @Description:装配记录
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-07-16 10:49:33
 * @FilePath: /cimp-tms-web/src/views/paring/paringList/index.vue
-->
<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="paringState">
        <el-select v-model="queryParams.paringState" class="!w-240px">
          <el-option :value="1" label="绑定" />
          <el-option :value="0" label="解绑" />
        </el-select>
      </el-form-item>

      <el-form-item prop="groupCode">
        <el-input v-model="queryParams.groupCode" placeholder="刀组编码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="queryParams.code" placeholder="刀柄物码" clearable @keyup.enter="handleQuery" class="!w-240px" />
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
    <el-table :data="list" style="width: 100%" @sort-change="sortByColumn">
      <el-table-column prop="groupCode" label="刀组编码" width="150px" align="center" fixed="left" />
      <el-table-column prop="code" label="刀柄物码" width="150px" align="center" />
      <!-- <el-table-column prop="headCode" label="刀具物码" width="150px" align="center" /> -->
      <el-table-column prop="workOrderCode" label="工单号" width="150px" align="center" />
      <el-table-column prop="paringPlanId" label="工单状态" width="" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.paringPlanId === 0" type="danger">解绑</el-tag>
          <el-tag v-if="row.paringPlanId !== 0" type="success">绑定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前位置" prop="location" width="" align="center" />
      <el-table-column label="装配时间" prop="createTime" :formatter="dateFormatter" sortable='custom' width="140px"
        align="center" />
      <el-table-column label="装配人员" prop="createBy" width="" align="center" />
      <el-table-column label="对刀登记" prop="settingStatus" width="" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.settingStatus === 0" type="danger" @click="openSettingForm('create', row)">登记</el-tag>
          <el-tag v-if="row.settingStatus === 1" type="success" @click="openSettingForm('update', row)">完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="动平衡登记" prop="dynamicStatus" width="" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.dynamicStatus === 0" type="danger" @click="openDynamicForm('create', row)">登记</el-tag>
          <el-tag v-if="row.dynamicStatus === 1" type="success" @click="openDynamicForm('update', row)">完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="装配状态" prop="paringState" width="" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.paringState === 0" type="danger">解绑</el-tag>
          <el-tag v-if="row.paringState === 1" type="success">绑定</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="生产计划编号" prop="projectNo" width="" align="center" />
      <el-table-column label="零件图号" prop="partNo" width="150px" align="center" />
      <el-table-column label="零件名称" prop="partName" width="" align="center" />
      <el-table-column label="工序名称" prop="procName" width="" align="center" />
      <el-table-column label="工序号" prop="procNo" width="" align="center" />

      <el-table-column label="操作" align="center" fixed="right" width="100px">
        <template #default="{ row }">
          <el-button link v-if="row.paringState !== 0" type="primary" @click="openUnfastenParing(row)">装配解绑</el-button>
          <br />
          <el-button link v-if="row.paringPlanId !== 0" @click="() => openUnfastenWork(row)"
            type="primary">工单解绑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <creatDynamicForm ref="dynamicFormRef" @success="getList" />
  <creatSettingForm ref="settingFormRef" @success="getList" />
  <toolUnbind ref="unbindRef" @success="getList" />
</template>

<script setup lang="ts">
import { getToolParing, unbindSubmit, unbindWorkSubmit } from '@/api/knifetool/paring/paringList'
import { dateFormatter } from '@/utils/formatTime'
import creatDynamicForm from './creatDynamicForm.vue'
import creatSettingForm from './creatSettingForm.vue'
import toolUnbind from './toolUnbind.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupCode: '',
  paringState: 1,
  code: '',
  orderColumn: '',
  orderWay: ''
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getToolParing(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
/** 排序 */
const sortByColumn = (column) => {
  queryParams.orderColumn = column.prop
  queryParams.orderWay = column.order
  getList()
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

/** 添加/修改操作动平衡数据 */
const dynamicFormRef = ref()
const openDynamicForm = (type: string, row?: any) => {
  dynamicFormRef.value.open(type, row)
}

/** 添加/修改操作动刀信息 */
const settingFormRef = ref()
const openSettingForm = (type: string, row?: any) => {
  settingFormRef.value.open(type, row)
}

// 装配解绑
const unbindRef = ref()
const openUnfastenParing = async (row) => {
  unbindRef.value.open(row)
}
// 工单解绑
const openUnfastenWork = async (row) => {
  console.log(row)
  try {
    // 删除的二次确认
    await message.delConfirm('是否确认解绑工单？')
    // 发起删除
    await unbindWorkSubmit({ id: row.id })
    message.success('解绑成功')
    // 刷新列表
    await getList()
  } catch { }
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
