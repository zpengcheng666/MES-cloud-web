<!--
 * @Author: hyj
 * @Description:对刀记录
 * @Date: 2024-07-01 14:52:29
 * @LastEditTime: 2024-07-11 14:55:00
 * @FilePath: /cimp-tms-web/src/views/paring/setting/index.vue
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
      <el-form-item prop="rfid">
        <el-input
          v-model="queryParams.rfid"
          placeholder="刀柄RFID"
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
          <el-button link type="primary" @click="openForm('details', row)"> 详情 </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', row)"
            v-hasPermi="['knifetool:param-template:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(row)"
            v-hasPermi="['knifetool:param-template:delete']"
          >
            删除
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

  <creatForm ref="formRef" @success="getList" />
  <viewDetails ref="detailRef" />
</template>

<script setup lang="ts">
import { getToolSetting, deleteSetting } from '@/api/knifetool/paring/setting'
import creatForm from './creatForm.vue'

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
  rfid: ''
})

const columns = [
  { title: '刀组编码', align: 'center', dataIndex: 'groupCode' },
  { title: '刀柄RFID', align: 'center', dataIndex: 'rfid' },
  { title: '刀具直径', align: 'center', dataIndex: 'diameter' },
  { title: '刀具总长', align: 'center', dataIndex: 'totalLength' },
  { title: '刀具悬长', align: 'center', dataIndex: '', scopedSlots: { customRender: 'xuanLong' } },
  { title: '刀具R角', align: 'center', dataIndex: 'rangle' },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  },
  { title: '创建人', align: 'center', dataIndex: 'createBy' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getToolSetting(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, row?: any) => {
  formRef.value.open(type, row)
}

/** 删除按钮操作 */
const handleDelete = async (row) => {
  console.log(row)
  const params = { id: row.id, paringId: row.paringId }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteSetting(params)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
