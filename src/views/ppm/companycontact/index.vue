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
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="部门" prop="depart">
<!--        <el-input-->
<!--          v-model="queryParams.depart"-->
<!--          placeholder="请输入部门"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->

        <el-select
          v-model="queryParams.depart"
          placeholder="请选择部门"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in dictData.deptList"
            :key="item.id"
            :label="item.depart"
            :value="item.depart"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="职务" prop="position">

        <el-select
          v-model="queryParams.position"
          placeholder="请选择职务"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in dictData.posList"
            :key="item.id"
            :label="item.position"
            :value="item.position"
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="企业名称" align="center" prop="companyName" />
      <el-table-column label="部门" align="center" prop="depart" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="sex" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="在职状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYSTEM_JOB_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="职务" align="center" prop="position" />
      <el-table-column label="部门负责人" align="center" prop="header" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_HEADER" :value="scope.row.header" />
        </template>
      </el-table-column>
      <el-table-column label="直属上级" align="center" prop="superior" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" width="180px">
        <template #default="scope">
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
  <CompanyContactForm ref="formRef" @success="getList" @initSelect="getCompanyContactList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { CompanyContactApi, CompanyContactVO } from '@/api/ppm/companycontact'
import CompanyContactForm from './CompanyContactForm.vue'
import {DICT_TYPE } from "@/utils/dict";

/** 企业联系人 列表 */
defineOptions({ name: 'CompanyContact' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<CompanyContactVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  companyId: route.params.companyId,
  name: undefined,
  depart: undefined,
  position: undefined,
  status: undefined,
  superior: undefined,
  header: undefined,
  sex: undefined,
  phone: undefined,
  email: undefined,
  age: undefined,
  address: undefined,
  remark: undefined,
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
    const data = await CompanyContactApi.getCompanyContactPage(queryParams)
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
    await CompanyContactApi.deleteCompanyContact(id)
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
    const data = await CompanyContactApi.exportCompanyContact(queryParams)
    download.excel(data, '企业联系人.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 部门负责人、直属上级、部门、职位下拉选项
const dictData = ref({
  deptList: [] as any,
  posList: [] as any
})
/** 查询列表 */
const getCompanyContactList = async () => {
  dictData.value = await CompanyContactApi.getCompanyContactSimpleList("")
}

/** 初始化 **/
onMounted(() => {
  getList()
  getCompanyContactList()
})
</script>
