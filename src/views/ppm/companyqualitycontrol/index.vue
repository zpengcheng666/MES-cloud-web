<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="质量管理体系" prop="qmsc">
        <el-select v-model="queryParams.qmsc" placeholder="请选择质量管理体系" class="!w-240px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_QMSC)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="专职检验" prop="inspection">-->
<!--        <el-select v-model="queryParams.inspection" placeholder="请选择是否专职检验" class="!w-240px">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_INSPECTION)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="不合格品控制" prop=" nonconformingControl">-->
<!--        <el-select v-model="queryParams.nonconformingControl" placeholder="请选择是否不合格品控制" class="!w-240px">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_NONCONFORMING_CONTROL)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="生产可追溯" prop="productionTraceability">-->
<!--        <el-select v-model="queryParams.productionTraceability" placeholder="请选择是否不合格品控制" class="!w-240px">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PRODUCTION_TRACEABILITY)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="采购质量控制" prop="purchasingControl">-->
<!--        <el-select v-model="queryParams.purchasingControl" placeholder="请选择是否采购质量控制" class="!w-240px">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PURCHASING_CONTROL)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

<!--      <el-form-item label="出厂质量控制" prop="oqc">-->
<!--        <el-select v-model="queryParams.oqc" placeholder="请选择出厂质量控制" class="!w-240px">-->
<!--          <el-option-->
<!--            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_OQC)"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->

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
      <el-table-column label="质量管理体系认证" align="center" prop="qmsc" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_QMSC" :value="scope.row.qmsc" />
        </template>
      </el-table-column>
      <el-table-column label="是否专职检验" align="center" prop="inspection" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_INSPECTION" :value="scope.row.inspection" />
        </template>
      </el-table-column>
      <el-table-column label="是否不合格品控制" align="center" prop=" nonconformingControl" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_NONCONFORMING_CONTROL" :value="scope.row.nonconformingControl" />
        </template>
      </el-table-column>
      <el-table-column label="生产可追溯" align="center" prop="productionTraceability" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PRODUCTION_TRACEABILITY" :value="scope.row.productionTraceability" />
        </template>
      </el-table-column>
      <el-table-column label="是否采购质量控制" align="center" prop="purchasingControl" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PURCHASING_CONTROL" :value="scope.row.purchasingControl" />
        </template>
      </el-table-column>
      <el-table-column label="出厂质量控制" align="center" prop="oqc" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_OQC" :value="scope.row.oqc" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['ppm:company:query']"
          >
            <Icon icon="ep:edit" />详情
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
  <CompanyQualityControlForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { CompanyQualityControlApi, CompanyQualityControlVO } from '@/api/ppm/companyqualitycontrol'
import CompanyQualityControlForm from './CompanyQualityControlForm.vue'
import {DICT_TYPE, getIntDictOptions } from "@/utils/dict";

/** 企业质量控制信息 列表 */
defineOptions({ name: 'CompanyQualityControl' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<CompanyQualityControlVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  companyId: route.params.companyId,
  qmsc: undefined,
  inspection: undefined,
  nonconformingControl: undefined,
  productionTraceability: undefined,
  purchasingControl: undefined,
  oqc: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CompanyQualityControlApi.getCompanyQualityControlPage(queryParams)
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
    await CompanyQualityControlApi.deleteCompanyQualityControl(id)
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
    const data = await CompanyQualityControlApi.exportCompanyQualityControl(queryParams)
    download.excel(data, '企业质量控制信息.xls')
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
