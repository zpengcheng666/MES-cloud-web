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

        <!--<el-input-->
        <!--v-model="queryParams.contractId"-->
        <!--placeholder="请选择合同"-->
        <!--clearable-->
        <!--@keyup.enter="handleQuery"-->
        <!--class="!w-240px"-->
        <!--/>-->
      </el-form-item>

      <el-form-item label="收货日期" prop="consignedDate">
        <el-date-picker
                v-model="queryParams.consignedDate"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
                class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="处理方式" prop="returnType">
        <el-select
                v-model="queryParams.returnType"
                placeholder="请选择处理方式"
                clearable
                class="!w-240px"
        >
          <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.RETURN_TYPE)"
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
          @click="openForm('create',undefined,0)"
          v-hasPermi="['ppm:contract-consignment-return:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:contract-consignment-return:export']"
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
          <el-tabs model-value="contractConsignmentReturnDetail">
            <el-tab-pane label="外协退货单详情" name="contractConsignmentReturnDetail">
              <ContractConsignmentReturnDetailList :consignment-return-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="退货单" align="center" prop="no"   width="150"/>
      <el-table-column label="退货单名称" align="center" prop="name"  width="120"/>
      <el-table-column label="项目" align="center" prop="projectName"  width="120"/>
      <el-table-column label="合同号" align="center" prop="contractNo"   width="120"/>
      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>

      <el-table-column label="处理方式" align="center" prop="returnType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.RETURN_TYPE" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column label="退换货原因" align="center" prop="returnReason"  width="200px"/>
      <el-table-column label="审批状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="退货状态" align="center" prop="consignmentStatus"  width="100">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="退货人" align="center" prop="consigner" />
      <el-table-column
              label="退货日期"
              align="center"
              prop="consignerDate"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column label="接收人" align="center" prop="consignedBy" />
      <el-table-column
              label="收货日期"
              align="center"
              prop="consignedDate"
              :formatter="dateFormatter"
              width="180px"
      />


      <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
      />
      <el-table-column label="操作"  align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="primary"
            @click="openForm('update', scope.row.id,0)"
            v-hasPermi="['ppm:contract-consignment-return:update']"
          >
            编辑
          </el-button>
          <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:contract-consignment-return:delete']"
          >
            删除
          </el-button>

          <el-button
                  link
                  type="danger"
                  @click="handleCancel(scope.row.id)"
                  v-hasPermi="['ppm:contract-consignment-return:delete']"
          >
            作废
          </el-button>

          <el-button
                  v-if="scope.row.status === 0"
                  v-hasPermi="['ppm:contract-consignment-return:create']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>


          <el-button
                  v-if="scope.row.consignmentStatus === 1"
                  link
                  type="primary"
                  @click="handleProcessDetail(scope.row)"
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
  <ContractConsignmentReturnForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ContractConsignmentReturnApi, ContractConsignmentReturnVO } from '@/api/ppm/contractconsignmentreturn'
import ContractConsignmentReturnForm from './ContractConsignmentReturnForm.vue'
import ContractConsignmentReturnDetailList from './components/ContractConsignmentReturnDetailList.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {ContractApi} from '@/api/ppm/contract'
/** 外协退货 列表 */
defineOptions({ name: 'ContractConsignmentReturn' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const {push} = useRouter()
const loading = ref(true) // 列表的加载中
const list = ref<ContractConsignmentReturnVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  no: undefined,
  contractId: undefined,
  companyId: undefined,
  projectId: undefined,
  createTime: [],
  status: undefined,
  processInstanceId: undefined,
  fileUrl: undefined,
  returnStatus: undefined,
  consigner: undefined,
  consignerDate: [],
  consignedBy: undefined,
  consignedDate: [],
  consignedContact: undefined,
  returnType: undefined,
  returnReason: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表


/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractConsignmentReturnApi.getContractConsignmentReturnPage(queryParams)
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
const openForm = (type: string, id?: number,consignmentStatus?:number) => {
  formRef.value.open(type, id,consignmentStatus)
}

/** 提交审核 **/
const handleSubmit = async (row: ContractConsignmentReturnVO) => {
    await message.confirm(`您确定提交【${row.no}】审核吗？`)
    await ContractConsignmentReturnApi.submitContractConsignmentReturn(row.id)
    message.success('提交审核成功！')
    await getList()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ContractConsignmentReturnApi.deleteContractConsignmentReturn(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 作废按钮操作 */
const handleCancel = async (id: number) => {
    try {
        // 删除的二次确认
        await message.delConfirm()
        // 发起删除
        await ContractConsignmentReturnApi.cancelContractConsignmentReturn(id)
        message.success('作废成功')
        // 刷新列表
        await getList()
    } catch {}
}



const getContract = async ()=>{
    // 加载合同列表
    contractList.value = await
        ContractApi.getContractListByType(2)
}



/** 查看审批 */
const handleProcessDetail = (row: ContractConsignmentReturnVO) => {
    push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
}


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ContractConsignmentReturnApi.exportContractConsignmentReturn(queryParams)
    download.excel(data, '外协退货.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
    getContract()
})
</script>