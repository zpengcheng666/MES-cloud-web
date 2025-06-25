<template>
  <!-- 前端分为上下两层 第一个ContentWrap是第一层 也是页面上面部分 -->
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="queryParams.productName" class="!w-240px" clearable placeholder="请输入产品名称"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="产品图号" prop="productNumber">
        <el-input v-model="queryParams.productNumber" class="!w-240px" clearable placeholder="请输入产品图号"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-tree-select v-model="queryParams.categoryId" :data="categoryList" :props="defaultProps" check-strictly
          default-expand-all placeholder="请输入分类" class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button v-hasPermi="['pdm:product:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button v-hasPermi="['pdm:product:export']" :loading="exportLoading" plain type="success"
          @click="handleExport">
          <Icon class="mr-5px" icon="ep:download" />
          导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="产品名称" prop="productName" />
      <el-table-column align="center" label="产品图号" prop="productNumber" />
      <el-table-column label="分类" align="center" prop="categoryName" />
      <el-table-column align="center" label="设计单位" prop="designUnit" />
      <el-table-column align="center" label="产品描述" prop="description" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :formatter="dateFormatter" align="center" label="创建时间" prop="createTime" width="180" />
      <el-table-column :width="300" align="center" label="操作">
        <template #default="scope">
          <el-button v-hasPermi="['pdm:product:update']" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['pdm:product:delete']" link type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProductForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as ProductApi from '@/api/pdm/product'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/pdm/productCategory'
import ProductForm from './ProductForm.vue'
import { defaultProps, handleTree } from "@/utils/tree";

defineOptions({ name: 'PdmProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  productName: '',
  productNumber: '',
  categoryId: undefined,
  productType: 0
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表

/** 查询产品列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductApi.getProductPage(queryParams)
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductApi.deleteProduct(id)
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
    const data = await ProductApi.exportProduct(queryParams)
    download.excel(data, '产品列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  await getList()
  // 产品分类
  const categoryData = await ProductCategoryApi.getProductCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
})
</script>
