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
      <el-form-item label="合同编号" prop="contractNumber">
        <el-input
          v-model="queryParams.contractNumber"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_CONTRACT_INVOICE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="开具时间" prop="invoiceDate">
        <el-date-picker
          v-model="queryParams.invoiceDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
          v-hasPermi="['ppm:contract-invoice:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:contract-invoice:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="合同编号" align="center" prop="contractNumber" />
      <el-table-column label="类型" align="center" prop="type" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_INVOICE_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>>
      <el-table-column label="金额" align="center" prop="amount" />
      <el-table-column
        label="开具时间"
        align="center"
        prop="invoiceDate"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="票据代码" align="center" prop="invoiceNumber" />
      <el-table-column label="票据代码2" align="center" prop="invoiceNumber2" />
      <el-table-column label="审批状态" align="center" prop="status" width="100px" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONTRACT_INVOICE_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['ppm:contract-invoice:query']"
          >
            详情
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:contract-invoice:update']"
            v-if="scope.row.status=='0'"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:contract-invoice:delete']"
            v-if="scope.row.status=='0'"
          >
            删除
          </el-button>
          <el-button
            link
            type="primary"
            @click="handleSubmit(scope.row)"
            v-hasPermi="['ppm:contract-invoice:update']"
            v-if="scope.row.status=='0'"
          >
            提交审核
          </el-button>

          <el-button
            link
            v-hasPermi="['ppm:contract-invoice:update']"
            type="primary"
            @click="handleProcessDetail(scope.row)"
            v-if="scope.row.status!='0'"
          >
            审批进度
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
  <DMContractInvoiceForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { ContractInvoiceApi, ContractInvoiceVO } from '@/api/ppm/contractinvoice'
import DMContractInvoiceForm from './DMContractInvoiceForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 购销合同发票 列表 */
defineOptions({ name: 'DMContractInvoice' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ContractInvoiceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  contractNumber: undefined,
  type: undefined,
  businessType: '2',
  invoiceDate: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractInvoiceApi.getContractInvoicePage(queryParams)
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
    await ContractInvoiceApi.deleteContractInvoice(id)
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
    const data = await ContractInvoiceApi.exportContractInvoice(queryParams)
    download.excel(data, '购销合同发票.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 查看审批 */
const { push } = useRouter()
const handleProcessDetail = (row: ContractInvoiceVO) => {
  push({ name: 'BpmProcessInstanceDetail', query: { id: row.processInstanceId } })
}

/** 提交审核 **/
const handleSubmit = async (row) => {
  await message.confirm(`您确定提交审核吗？`)
  await ContractInvoiceApi.submitContractInvoice(row.id, 'dm-contract-invoice-audit')
  message.success('提交审核成功！')
  await getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
