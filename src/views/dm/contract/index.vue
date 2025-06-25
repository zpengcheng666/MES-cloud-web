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
      <!--<el-form-item label="类型" prop="type">-->
        <!--<el-select-->
          <!--v-model="queryParams.type"-->
          <!--placeholder="请选择类型"-->
          <!--clearable-->
          <!--class="!w-240px"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.PD_CONTRACT_TYPE)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="合同编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入合同名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同方" prop="party">
        <el-input
          v-model="queryParams.party"
          placeholder="请输入合同方"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="签约人" prop="contact">-->
<!--        <el-input-->
<!--          v-model="queryParams.contact"-->
<!--          placeholder="请输入签约人"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="签约时间" prop="signingDate">
        <el-date-picker
          v-model="queryParams.signingDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="签约地点" prop="signingAddress">-->
<!--        <el-input-->
<!--          v-model="queryParams.signingAddress"-->
<!--          placeholder="请输入签约地点"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="签约部门" prop="department">-->
<!--        <el-input-->
<!--          v-model="queryParams.department"-->
<!--          placeholder="请输入签约部门"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="我方签约人" prop="selfContact">-->
<!--        <el-input-->
<!--          v-model="queryParams.selfContact"-->
<!--          placeholder="请输入我方签约人"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->

<!--      <el-form-item label="交货方式" prop="delivery">-->
<!--        <el-input-->
<!--          v-model="queryParams.delivery"-->
<!--          placeholder="请输入交货方式"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--          class="!w-240px"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CONTRACT_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采购员" prop="purchaser">
        <el-input
          v-model="queryParams.purchaser"
          placeholder="请输入采购员"
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
          v-hasPermi="['ppm:contract:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:contract:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" >
      <!--<el-table-column label="类型" align="center" prop="type" >-->
        <!--<template #default="scope">-->
          <!--<dict-tag :type="DICT_TYPE.PD_CONTRACT_TYPE" :value="scope.row.type" />-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="合同编号" align="center" prop="number" />
      <el-table-column label="合同名称" align="center" prop="name"  width="200" />
      <el-table-column label="合同方" align="center" prop="partyName" width="120" />
      <el-table-column label="签约人" align="center" prop="contactName" width="120" />
      <el-table-column label="签约时间" align="center" prop="signingDate" :formatter="dateFormatter2" width="120"/>
      <el-table-column label="签约地点" align="center" prop="signingAddress" width="150" />
      <el-table-column label="签约部门" align="center" prop="departmentName" width="120" />
      <el-table-column label="我方签约人" align="center" prop="selfContactName" width="120" />
      <el-table-column label="是否增值税" align="center" prop="vat" width="80px">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.VAT_TYPE" :value="scope.row.vat" />
        </template>
      </el-table-column>
      <el-table-column label="币种" align="center" prop="currency" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CURRENCY_TYPE" :value="scope.row.currency" />
        </template>
      </el-table-column>
      <el-table-column label="交货方式" align="center" prop="delivery" width="80">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_CONTRACT_DELIVERY" :value="scope.row.delivery" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONTRACT_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="采购员" align="center" prop="purchaser" width="120" />
      <el-table-column label="备注" align="center" prop="remark" width="150" />
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('detail', scope.row.id)"
            v-hasPermi="['ppm:contract:query']"
          >
            详情
          </el-button>

          <el-button
                  link
                  type="primary"
                  @click="openContractInfoForm(scope.row.id)"
                  v-hasPermi="['ppm:contract:query']"
          >
            执行情况
          </el-button>



          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:contract:update']"
            v-if="scope.row.status=='0' && scope.row.contractStatus=='0'"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:contract:delete']"
            v-if="scope.row.status=='0'"
          >
            删除
          </el-button>

          <el-button
            link
            type="primary"
            @click="handleSubmit(scope.row)"
            v-hasPermi="['ppm:contract:update']"
            v-if="scope.row.status=='0' && scope.row.contractStatus=='0'"
          >
            提交审核
          </el-button>

          <el-button
            link
            v-hasPermi="['ppm:contract:update']"
            type="primary"
            @click="handleProcessDetail(scope.row)"
            v-if="scope.row.status!='0'"
          >
            审批进度
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleTerminate(scope.row)"
            v-hasPermi="['ppm:contract:update']"
            v-if="scope.row.status=='2' && scope.row.contractStatus=='1'"
          >
            终止
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleFinish(scope.row)"
            v-hasPermi="['ppm:contract:update']"
            v-if="scope.row.status=='2' && scope.row.contractStatus=='1'"
          >
            完成
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
  <DMContractForm ref="formRef" @success="getList" />
  <DMContractQuery ref="formQueryRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import DMContractForm from './DMContractForm.vue'
import DMContractQuery from './components/contractquery/DMContractQuery.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 购销合同 列表 */
defineOptions({ name: 'DMContract' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ContractVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  type: 2,
  number: undefined,
  name: undefined,
  party: undefined,
  contact: undefined,
  signingDate: [] as any,
  signingAddress: undefined,
  department: undefined,
  selfContact: undefined,
  vat: undefined,
  currency: undefined,
  delivery: undefined,
  status: undefined,
  purchaser: undefined,
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
    const data = await ContractApi.getContractPage(queryParams)
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
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ContractApi.deleteContract(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}



/** 添加/修改操作 */
const formQueryRef = ref()
const openContractInfoForm = (id?: string) => {
    debugger
    formQueryRef.value.open(id)
}



/** 查看审批 */
const { push } = useRouter()
const handleProcessDetail = (row: ContractVO) => {
  push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
}

/** 提交审核 **/
const handleSubmit = async (row) => {
  await message.confirm(`您确定提交【${row.name}】审核吗？`)
  debugger
  await ContractApi.submitContract(row.id,'dm-contract-audit')
  message.success('提交审核成功！')
  await getList()
}

/** 合同终止 **/
const handleTerminate = async (row) => {
  await message.confirm(`您确定终止【${row.name}】吗？`)
  const data = {
    id: row.id,
    // 已终止
    contractStatus: 2,
    type: "2"
  } as ContractStatusVO
  await ContractApi.updateContractStatus(data)
  message.success('提交终止成功！')
  await getList()
}

/** 合同完成 **/
const handleFinish = async (row) => {
  await message.confirm(`您确定完成【${row.name}】吗？`)
  const data = {
    id: row.id,
    // 已终止
    contractStatus: 4,
  } as ContractStatusVO
  await ContractApi.updateContractStatus(data)
  message.success('提交完成成功！')
  await getList()
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ContractApi.exportContract(queryParams)
    download.excel(data, '购销合同.xls')
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
