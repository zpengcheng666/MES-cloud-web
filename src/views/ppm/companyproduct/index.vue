<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['ppm:company:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:company:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="物料名称" align="center" prop="productName" />
      <el-table-column label="初始单价" align="center" prop="initPrice" />
      <el-table-column label="初始税率" align="center" prop="initTax" />
      <el-table-column label="供货周期" align="center" prop="leadTime" />
      <el-table-column label="是否免检" align="center" prop="qualityCheck" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_PRODUCT_QUALITY_CHECK" :value="scope.row.qualityCheck" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['ppm:company:update']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:company:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:company:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <CompanyProductForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { CompanyProductApi, CompanyProductVO } from '@/api/ppm/companyproduct'
import CompanyProductForm from './CompanyProductForm.vue'
import {DICT_TYPE} from "@/utils/dict";

/** 企业产品表，用于销售和采购 列表 */
defineOptions({ name: 'CompanyProduct' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<CompanyProductVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  companyId: route.params.companyId,
  productId: undefined,
  productName: undefined,
  initPrice: undefined,
  leadTime: [],
  createTime: [],
  creationIp: undefined,
  updatedIp: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CompanyProductApi.getCompanyProductPage(queryParams)
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
  formRef.value.open(type, id, queryParams.companyId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CompanyProductApi.deleteCompanyProduct(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CompanyProductApi.exportCompanyProduct(queryParams)
    download.excel(data, '企业产品表，用于销售和采购.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
