<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择刀具类型" clearable class="!w-240px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CATEGORY_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入编码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="接口型号" prop="interfaceModel">
        <el-input v-model="queryParams.interfaceModel" placeholder="请输入接口型号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="组装配方" prop="partsAssemblyId">
        <el-input v-model="queryParams.partsAssemblyId" placeholder="请选择组装配方" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="托盘类型" prop="workbenchTypeId">
        <el-input v-model="queryParams.workbenchTypeId" placeholder="请选择托盘类型" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable class="!w-240px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['knifetool:category:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <!-- <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['knifetool:category:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-if="refreshTable" v-loading="loading" :data="list" :default-expand-all="isExpandAll" row-key="id">
      <el-table-column label="分类名称" align="left" prop="name" />
      <el-table-column label="层级" align="center" prop="level" />
      <el-table-column label="刀具类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.KNIFETOOL_CATEGORY_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="分类编码" align="center" prop="code" />
      <!-- <el-table-column label="接口型号" align="center" prop="interfaceModel" />
      <el-table-column label="组装配方" align="center" prop="partsAssemblyId" /> -->
      <el-table-column label="托盘类型" align="center" prop="trayTypeName" />
      <el-table-column label="状态" key="state">
        <template #default="scope">
          <el-switch v-model="scope.row.state" :active-value="1" :inactive-value="0"
            @change="handleStateChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('create', undefined, scope.row.id, scope.row.type)"
            v-hasPermi="['knifetool:category:create']">
            新增
          </el-button>

          <el-button link type="primary" @click="openForm('update', scope.row.id)"
            v-hasPermi="['knifetool:category:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-hasPermi="['knifetool:category:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CategoryForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ElMessage, ElMessageBox } from 'element-plus'
import { handleTree } from '@/utils/tree'
import download from '@/utils/download'
import * as CategoryApi from '@/api/knifetool/tool/category'
import CategoryForm from './CategoryForm.vue'
import { KnifetoolStateEnum } from '@/utils/constants'

/** 刀具分类 列表 */
defineOptions({ name: 'Category' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const exportLoading = ref(false)
const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  type: undefined,
  code: undefined,
  interfaceModel: undefined,
  partsAssemblyId: undefined,
  workbenchTypeId: undefined,
  state: undefined
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CategoryApi.getCategoryList(queryParams)
    list.value = handleTree(data, 'id', 'pid')
    console.log(list.value)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, pid?: number, toolType?: number) => {
  formRef.value.open(type, id, pid, toolType)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CategoryApi.deleteCategory(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CategoryApi.exportCategory(queryParams)
    download.excel(data, '刀具分类.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 修改刀具分类状态 */
const handleStateChange = async (row: CategoryApi.CategoryVO) => {
  try {
    const count = await CategoryApi.useCount(row.id)
    const text = ref()
    if (count > 0 && row.state === 0) {
      text.value = `该分类下已有 ${count} 条刀具基础信息，是否仍然禁用该分类？`
    } else {
      text.value = `确认要 ${row.state === KnifetoolStateEnum.ENABLE ? '开启' : '禁用'} ${row.name}刀具分类吗?`
    }

    ElMessageBox.confirm(text.value, '提示')
      .then(async () => {
        const data = await CategoryApi.updateCategoryState(row.id, row.state)
        if (data) {
          ElMessage({ message: '操作成功', type: 'success' })
        } else {
          ElMessage({ message: data.msg, type: 'error' })
        }
        getList()
      })
      .catch(() => {
        // catch error
        // 取消后，进行恢复按钮
        row.state =
          row.state === KnifetoolStateEnum.ENABLE
            ? KnifetoolStateEnum.DISABLE
            : KnifetoolStateEnum.ENABLE
      })
  } catch { }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
