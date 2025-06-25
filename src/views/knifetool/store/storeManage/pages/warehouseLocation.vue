<!--
 * @Author: hyj
 * @Description: 仓库管理
 * @Date: 2024-06-12 13:39:57
 * @LastEditTime: 2024-06-21 14:23:22
 * @FilePath: /cimp-tms-web/src/views/store/storeManage/pages/warehouseLocation.vue
-->
<template>
  <h4>仓库管理</h4>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="name">
        <el-input v-model="queryParams.name" placeholder="仓库名称" clearable @keyup.enter="handleQuery" class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" />查询
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />重置
        </el-button>
        <el-button @click="openForm('create')" type="primary" plain v-hasPermi="['system:user:create']">
          <Icon icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="name" label="仓库名称" align="center" width="180" />
      <el-table-column label="仓库类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_WAREHOUSE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column prop="location" label="位置" align="center" />
      <el-table-column prop="shelfNum" label="货架数量" align="center" />
      <el-table-column prop="storeNum" label="库存物料数量" align="center" />
      <el-table-column prop="admin" label="管理员" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row)"
            v-hasPermi="['knifetool:param-template:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"
            v-hasPermi="['knifetool:param-template:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <WarehouseForm ref="formRef" @success="updateSuccess" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getSotreLocation, deleteWarehouse } from '@/api/knifetool/store/storeManage'
import bus from '@/utils/bus'
import WarehouseForm from './WarehouseForm.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: ''
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSotreLocation(queryParams)
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

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  const params = { id: id }
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteWarehouse(params)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
    bus.emit('updateTreeNode')
  } catch { }
}

/** 初始化 */
onMounted(() => {
  getList()
})

const updateSuccess = () => {
  getList()

  bus.emit('updateTreeNode')
}
</script>

<style scoped></style>
