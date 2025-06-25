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
      <el-form-item label="退款单号" prop="contractId">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入退款单"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同" prop="contractId">

        <el-select
          v-model="queryParams.contractId"
          clearable
          filterable
          placeholder="请选择合同"
          class="!w-240px"
        >
          <el-option
            v-for="item in contractList"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="退款方式" prop="refundType">
        <el-select
          v-model="queryParams.refundType"
          placeholder="请选择退款方式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PD_FINANCE_PAY_METHOD)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款日期" prop="refundTime">
        <el-date-picker
          v-model="queryParams.refundTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="退款状态" prop="refundStatus">
        <el-select
          v-model="queryParams.refundStatus"
          placeholder="请选择退款状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DM_REFUND_STATUS)"
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
          v-hasPermi="['dm:contract-refund:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dm:contract-refund:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="退款单号" align="center" prop="no" />
      <el-table-column label="退货单号" align="center" prop="shippingReturnNo" />
      <el-table-column label="合同编号" align="center" prop="contractNo" />
      <el-table-column label="退款方式" align="center" prop="refundType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PD_FINANCE_PAY_METHOD" :value="scope.row.refundType" />
        </template>
      </el-table-column>
      <el-table-column
        label="退款日期"
        align="center"
        prop="refundTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="退款金额" align="center" prop="refundPrice" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />

      <el-table-column label="审批状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="退款状态" align="center" prop="refundStatus"  width="100">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_REFUND_STATUS" :value="scope.row.refundStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">

          <el-button
            link
            type="success"
            @click="openInfo('update', scope.row.id)"
            v-hasPermi="['dm:contract-refund:update']"
          >
            详情
          </el-button>

          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dm:contract-refund:update']"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.status === 0"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>

          <el-button
            v-if=" scope.row.status === 3"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>
          <el-button
            v-if="scope.row.refundStatus ===1"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            审批进度
          </el-button>


          <el-button
            v-if="scope.row.refundStatus === 2"
            link
            type="primary"
            @click="handleConfirm (scope.row.id)"
            v-hasPermi="['dm:shipping:update']"
          >
            退款确认
          </el-button>

          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dm:contract-refund:delete']"
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
  <ContractRefundForm ref="formRef" @success="getList" />
  <ContractRefundInfo ref="infoRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ContractRefundApi, ContractRefundVO } from '@/api/dm/contractrefund'
import ContractRefundForm from './ContractRefundForm.vue'
import ContractRefundInfo from './ContractRefundInfo.vue'
import {ContractApi} from '@/api/ppm/contract'
/** 合同退款 列表 */
defineOptions({ name: 'ContractRefund' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ContractRefundVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shippingReturnId: undefined,
  contractId: undefined,
  refundType: undefined,
  refundStatus: undefined,
  no:undefined,
  refundTime: [],
  refundPrice: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractRefundApi.getContractRefundPage(queryParams)
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


const infoRef = ref()
const openInfo = (type: string, id?: number) => {
  infoRef.value.open(type, id)
}


/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ContractRefundApi.deleteContractRefund(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}


/** 提交审核 **/
const handleSubmit = async (row: ContractRefundVO) => {
  await message.confirm(`您确定提交【${row.no}】审核吗？`)
  await ContractRefundApi.submitContractRefund(row.id)
  message.success('提交审核成功！')
  await getList()
}
const {push} = useRouter()
/** 查看审批 */
const handleProcessDetail = (row: ContractRefundVO) => {
  push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
}

/** t退款确认按钮操作 */
const handleConfirm = async (id: string) => {
  try {
    await message.confirm(`退款确认？`)
    await ContractRefundApi.handleConfirm(id)
    message.success('确认成功！')
    // 刷新列表
    await getList()
  } catch {
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ContractRefundApi.exportContractRefund(queryParams)
    download.excel(data, '合同退款.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}


const getContract = async ()=>{
  // 加载合同列表
  contractList.value = await
    ContractApi.getContractListByType(2)
}

/** 初始化 **/
onMounted(() => {
  getList()
  getContract()
})
</script>
