<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="90px"
    >
      <el-form-item label="发货单编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入发货单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发货单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入发货单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同" prop="contractId">
        <el-input
          v-model="queryParams.contractId"
          placeholder="请输入合同"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="公司" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入公司"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="审批状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审批状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_AUDIT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="consignmentStatus">
        <el-select
          v-model="queryParams.consignmentStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SHIPPING_STATUS)"
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
          v-hasPermi="['ppm:contract-consignment:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:contract-consignment:export']"
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
          <el-tabs model-value="contractConsignmentDetail">
            <el-tab-pane label="外协发货单详情" name="contractConsignmentDetail">
              <ContractConsignmentDetailList :consignment-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!--<el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="发货单编号" align="center" prop="no" />
      <el-table-column label="发货单名称" align="center" prop="name" />
      <el-table-column label="合同" align="center" prop="contractName" />
      <el-table-column label="公司" align="center" prop="companyName" />
      <el-table-column label="发货人" align="center" prop="consigner" />
      <el-table-column
        label="发货日期"
        align="center"
        prop="consignerDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="承运方式" align="center" prop="deliveryMethod">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod" />
        </template>
      </el-table-column>
      <el-table-column label="承运人" align="center" prop="deliveryBy" />
      <el-table-column label="承运单号" align="center" prop="deliveryNumber" />
      <el-table-column label="承运人电话" align="center" prop="deliveryContact" />
      <el-table-column label="收货人" align="center" prop="consignedBy" />
      <el-table-column
        label="收货日期"
        align="center"
        prop="consignedDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="收货人联系方式" align="center" prop="consignedContact" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="审批状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="consignmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right">
        <template #default="scope">
          <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:contract-consignment:update']"
          >
            编辑
          </el-button>

          <!--  未提交过的可提交审核-->
          <el-button
                  v-if="scope.row.status === 0"
                  v-hasPermi="['ppm:contract-consignment:create']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>
          <!--  审批不通过可修改重新提交审核-->
          <el-button
                  v-if="scope.row.status === 3"
                  v-hasPermi="['ppm:contract-consignment:create']"
                  link
                  type="warning"
                  @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>



          <!--  只要没有出库都可作废-->
          <el-button
                  v-if="scope.row.shippingStatus <3 || scope.row.shippingStatus  ===8"
                  v-hasPermi="['ppm:contract-consignment:create']"
                  link
                  type="warning"
                  @click="handleCancelDm(scope.row.id)"
          >
            作废
          </el-button>


          <!--&lt;!&ndash;  出库完成后  填写发货信息 确认发货数量&ndash;&gt;-->
          <!--<el-button-->
                  <!--v-if="scope.row.consignmentStatus === 2"-->
                  <!--v-hasPermi="['ppm:contract-consignment:create']"-->
                  <!--link-->
                  <!--type="primary"-->
                  <!--@click="openForm('update', scope.row.id,2)"-->
          <!--&gt;-->
            <!--出库确认-->
          <!--</el-button>-->


          <el-button
                  v-if="scope.row.shippingStatus >0"
                  v-hasPermi="['ppm:contract-consignment:create']"
                  link
                  type="primary"
                  @click="handleProcessDetail(scope.row)"
          >
            审批进度
          </el-button>

          <el-button
                  v-if="scope.row.shippingStatus === 4"
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id,4)"
                  v-hasPermi="['ppm:contract-consignment:update']"
          >
            发货确认
          </el-button>

          <el-button
                  v-hasPermi="['ppm:contract-consignment:update']"
                  link
                  type="success"
                  @click="openDetail('detail', scope.row.id)"
          >
            详情
          </el-button>

          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:contract-consignment:delete']"
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
  <ContractConsignmentForm ref="formRef" @success="getList" />
  <ContractConsignmentDetail ref="detailRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ContractConsignmentApi, ContractConsignmentVO } from '@/api/ppm/contractconsignment'
import ContractConsignmentForm from './ContractConsignmentForm.vue'
import ContractConsignmentDetail from './ContractConsignmentDetail.vue'
import ContractConsignmentDetailList from './components/ContractConsignmentDetailList.vue'

/** 外协发货 列表 */
defineOptions({ name: 'ContractConsignment' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ContractConsignmentVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  name: undefined,
  contractId: undefined,
  companyId: undefined,
  consigner: undefined,
  consignerDate: [],
  deliveryMethod: undefined,
  deliveryBy: undefined,
  deliveryNumber: undefined,
  deliveryContact: undefined,
  consignedBy: undefined,
  consignedDate: [],
  consignedContact: undefined,
  createTime: [],
  status: undefined,
  processInstanceId: undefined,
  fileUrl: undefined,
  consignmentStatus: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ContractConsignmentApi.getContractConsignmentPage(queryParams)
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
const openForm = (type: string, id?: number,confirmStatus ? : number) => {
  formRef.value.open(type, id,confirmStatus)
}



/** 详情操作 */
const detailRef = ref()
const openDetail = (type: string, id
    ? : number
) =>
{
    detailRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ContractConsignmentApi.deleteContractConsignment(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}


/** 提交审核 **/
const handleSubmit = async (row: ContractConsignmentVO) => {
    await message.confirm(`您确定提交【${row.no}】审核吗？`)
    await ContractConsignmentApi.submitContractConsignment(row.id)
    message.success('提交审核成功！')
    await getList()
}
const { push } = useRouter()
/** 查看审批 */
const handleProcessDetail = (row: ContractConsignmentVO) => {
    push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
}


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ContractConsignmentApi.exportContractConsignment(queryParams)
    download.excel(data, '外协发货.xls')
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