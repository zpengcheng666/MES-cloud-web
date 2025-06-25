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
      <el-form-item label="申请单号" prop="applicationNumber">
        <el-input
          v-model="queryParams.applicationNumber"
          placeholder="请输入申请单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="代理人" prop="agent">
        <el-input
          v-model="queryParams.agent"
          placeholder="请输入申请代理人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="公司组织" prop="organization">
        <el-input
          v-model="queryParams.organization"
          placeholder="请输入公司组织"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择申请状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions('macsApplicationStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['macs:access-application:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['macs:access-application:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="visitorRegion">
            <el-tab-pane label="申请人员" name="visitorRegion">
              <ApplicationVisitor :application-id="scope.row.id" @open="(row)=>openRegionForm(row,scope.row.id)"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="申请单号" align="center" prop="applicationNumber" />
      <el-table-column label="申请代理人" align="center" prop="agent" />
      <el-table-column label="公司/组织" align="center" prop="organization" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="申请状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="'macsApplicationStatus'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="申请原因/目的" align="center" prop="reason" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
<!--          <el-button
            v-if="scope.row.status === '0'"
            link
            type="danger"
            @click="handleRevoke(scope.row.id)"
            v-hasPermi="['macs:access-application:delete']"
          >
            撤销
          </el-button>-->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['macs:access-application:delete']"
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
  <AccessApplicationForm ref="formRef" @success="getList" />
  <VisitorRegion ref="regionRef"/>
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import download from '@/utils/download'
import { AccessApplicationApi, AccessApplicationVO } from '@/api/macs/accessapplication'
import AccessApplicationForm from './AccessApplicationForm.vue'
import ApplicationVisitor from './components/ApplicationVisitor.vue'
import VisitorRegion from './components/VisitorRegion.vue'
import router from "@/router";
import {useTitle} from "@/hooks/web/useTitle";

/** 通行申请 列表 */
defineOptions({ name: 'AccessApplication' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AccessApplicationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationNumber: undefined,
  agent: undefined,
  organization: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AccessApplicationApi.getAccessApplicationPage(queryParams)
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

const regionRef = ref();
const openRegionForm = (row, id) => {
  regionRef.value.open(row, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AccessApplicationApi.deleteAccessApplication(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
const handleRevoke = async (id) => {
  try {
    // 删除的二次确认
    await message.delConfirm('是否撤销所选中申请')
    // 发起删除
    await AccessApplicationApi.updateAccessApplication({ id: id, status: '3'  } as AccessApplicationVO)
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
    const data = await AccessApplicationApi.exportAccessApplication(queryParams)
    download.excel(data, '通行申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
router.afterEach(() => {
  getList()
})
</script>
