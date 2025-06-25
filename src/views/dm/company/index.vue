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
      <el-form-item label="公司名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="公司状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择公司状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_TYPE)"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="行业分类" prop="industryClassification">
        <el-select
          v-model="queryParams.industryClassification"
          placeholder="请选择行业分类"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_INDUSTRY_CLASSIFICATION)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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

        <el-button
          type="danger"
          plain
          @click="handleDelete(selectionList.map((item) => item.id))"
          v-hasPermi="['ppm:company:delete']"
          :disabled="selectionList.length === 0"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" @selection-change="handleSelectionChange">
      <el-table-column width="30" label="选择" type="selection" />
      <el-table-column label="名称" align="center" prop="name" width="100"/>
      <el-table-column label="统一社会信用代码" align="center" prop="usci" width="100"/>
      <el-table-column label="组织结构代码" align="center" prop="organizationCode" />
      <el-table-column label="公司状态" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_STATUS" :value="scope.row.companyStatus" />
        </template>
      </el-table-column>
      <el-table-column label="公司类型" align="center" prop="type" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="行业分类" align="center" prop="industryClassification" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_INDUSTRY_CLASSIFICATION" :value="scope.row.industryClassification" />
        </template>
      </el-table-column>
      <el-table-column label="成立时间" :formatter="dateFormatter2" align="center" prop="formed" width="120"/>
      <el-table-column label="注册资金" align="center" prop="registrationFund" width="100"/>
      <el-table-column label="供求类型" align="center" prop="supplyType" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_SUPPLY_TYPE" :value="scope.row.supplyType" v-if="scope.row.supplyType"/>
        </template>
      </el-table-column>
      <el-table-column label="纳税人资质" align="center" prop="taxpayer" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_TAXPAYER" :value="scope.row.taxpayer" v-if="scope.row.taxpayer"/>
        </template>
      </el-table-column>
      <el-table-column label="区域" align="center" prop="areaName" width="180"/>
      <el-table-column label="注册地址" align="center" prop="registrationAddress" width="150"/>
      <el-table-column label="企业规模" align="center" prop="firmSize" width="150">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_COMPANY_FIRM_SIZE" :value="scope.row.firmSize" v-if="scope.row.firmSize"/>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" prop="telephone" width="100"/>
      <el-table-column label="邮箱" align="center" prop="email" width="100"/>
      <el-table-column label="公司官网" align="center" prop="website" width="100"/>
      <el-table-column label="简介" align="center" prop="introduction" width="100"/>
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #default="scope">
          <div class="flex items-center justify-center">
            <el-button
                    link
                    type="primary"
                    @click="openForm('detail', scope.row.id)"
                    v-hasPermi="['ppm:company:query']"
            >
              详情
            </el-button>

            <el-button
                    link
                    type="primary"
                    @click="openForm('update', scope.row.id)"
                    v-hasPermi="['ppm:company:update']"
                    v-if="scope.row.status=='0'"
            >
              编辑
            </el-button>

            <el-button
                    link
                    type="danger"
                    @click="handleDelete([scope.row.id])"
                    v-hasPermi="['ppm:company:delete']"
                    v-if="scope.row.status=='0'"
            >
              删除
            </el-button>

            <el-button
                    link
                    type="primary"
                    @click="handleSubmit(scope.row)"
                    v-hasPermi="['ppm:contract-payment:update']"
                    v-if="scope.row.status=='0'"
            >
              提交审核
            </el-button>

            <el-button
                    link
                    v-hasPermi="['ppm:contract-payment:update']"
                    type="primary"
                    @click="handleProcessDetail(scope.row)"
                    v-if="scope.row.status!='0'"
            >
              审批进度
            </el-button>

            <el-dropdown
              v-hasPermi="[
                      'ppm:company:delete',
                    ]"
            >
            <el-button type="primary" link><Icon icon="ep:d-arrow-right" /> 更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link :to="'/dm/company/companycontact/' + scope.row.id">
                    <el-button link type="primary">联系人信息</el-button>
                  </router-link>
                </el-dropdown-item>

                <el-dropdown-item>
                  <router-link :to="'/dm/company/companyfinance/' + scope.row.id">
                    <el-button link type="primary">税务信息</el-button>
                  </router-link>
                </el-dropdown-item>

                <el-dropdown-item>
<!--                  <router-link :to="'/ppm/company/companyqualitycontrol/' + scope.row.id">-->
<!--                    <el-button link type="primary"><Icon icon="ep:plus" />质量控制信息</el-button>-->
                    <el-button
                      link
                      type="primary"
                      @click="openQualityControlForm(scope.row.id)"
                    >
                    质量控制信息
                    </el-button>
<!--                  </router-link>-->
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
            </el-dropdown>
          </div>
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
  <DMCompanyForm ref="formRef" @success="getList" />
  <CompanyQualityControlForm ref="qualityControlFormRef" @success="getList" />

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { CompanyApi, CompanyVO } from '@/api/ppm/company'
import DMCompanyForm from './DMCompanyForm.vue'
import CompanyQualityControlForm
  from "@/views/ppm/companyqualitycontrol/CompanyQualityControlForm.vue";

/** 供应商信息 列表 */
defineOptions({ name: 'DMCompany' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<CompanyVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  status: undefined,
  type: undefined,
  industryClassification: undefined,
  supplyType: '2,3'
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CompanyApi.getCompanyPage(queryParams)
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
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 添加/修改操作 */
const qualityControlFormRef = ref()
const openQualityControlForm = (id?: string) => {
  qualityControlFormRef.value.open(id)
}

/** 选中操作 */
const selectionList = ref<CompanyVO[]>([])
const handleSelectionChange = (rows: CompanyVO[]) => {
  selectionList.value = rows
}

/** 删除按钮操作 */
const handleDelete = async (ids: string[]) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CompanyApi.deleteCompany(ids)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}


/** 提交审核 **/
const handleSubmit = async (row) => {
    await message.confirm(`您确定提交审核吗？`)
    await CompanyApi.submitCompany(row.id, 'dm-company-audit')
    message.success('提交审核成功！')
    await getList()
}


/** 查看审批 */
const { push } = useRouter()
const handleProcessDetail = (row: CompanyVO) => {
    push({ name: 'BpmProcessInstanceDetail', query: { id: row.processInstanceId } })
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CompanyApi.exportCompany(queryParams)
    download.excel(data, '供应商信息.xls')
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
