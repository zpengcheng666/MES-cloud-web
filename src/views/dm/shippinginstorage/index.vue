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
      <el-form-item label="入库单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入入库单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库单" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入入库单"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同" prop="contractId">
        <!--<el-input-->
          <!--v-model="queryParams.contractId"-->
          <!--placeholder="请输入合同"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->


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
                  :label="item.number+'('+item.name+')'"
                  :value="item.id"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="公司" prop="companyId">
        <!--<el-input-->
          <!--v-model="queryParams.companyId"-->
          <!--placeholder="请输入公司"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->

        <el-select
                v-model="queryParams.companyId"
                clearable
                filterable
                placeholder="请选择合作方"
                class="!w-240px"
        >
          <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目" prop="projectId">


        <el-select
                v-model="queryParams.projectId"
                clearable
                filterable
                placeholder="请选择项目"
                class="!w-240px"
        >
          <el-option
                  v-for="item in projectInfos"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId"
          />

        </el-select>
        <!--<el-input-->
          <!--v-model="queryParams.productId"-->
          <!--placeholder="请输入项目"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
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

      <el-form-item label="状态" prop="consignmentStatus">
        <el-select
          v-model="queryParams.consignmentStatus"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CONSIGNMENT_STATUS)"
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
          v-hasPermi="['dm:shipping-instorage:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dm:shipping-instorage:export']"
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
          <el-tabs model-value="shippingInstorageDetail">
            <el-tab-pane label="销售订单入库明细" name="shippingInstorageDetail">
              <ShippingInstorageDetailList :shipping-storage-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="入库单名称" align="center" prop="name" width="160"/>
      <el-table-column label="入库单号" align="center" prop="no" width="120"/>
      <el-table-column label="项目" align="center" prop="projectName" width="120"/>
      <el-table-column label="合同" align="center" prop="contractName" width="120"/>
      <el-table-column label="公司" align="center" prop="companyName" width="120"/>

      <el-table-column label="发货人" align="center" prop="consigner" />
      <el-table-column
        label="发货日期"
        align="center"
        prop="consignerDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="承运方式" align="center" prop="deliveryMethod" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod" />
        </template>
      </el-table-column>
      <el-table-column label="承运人" align="center" prop="deliveryBy" />

      <el-table-column label="承运单号" align="center" prop="deliveryNumber" />
      <el-table-column label="收货人" align="center" prop="consignedBy" />
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
      <el-table-column label="审批状态" align="center" prop="status"  width="120">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" prop="consignmentStatus" width="160">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
                  v-if="scope.row.consignmentStatus === 0 || scope.row.consignmentStatus === 7"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['dm:shipping-instorage:update']"
          >
            编辑
          </el-button>

          <!--  未提交过的可提交审核-->
          <el-button
                  v-if="scope.row.consignmentStatus === 0 "
                  v-hasPermi="['dm:shipping-instorage:update']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>


          <el-button
                  v-if="scope.row.consignmentStatus >0"
                  v-hasPermi="['dm:shipping:create']"
                  link
                  type="primary"
                  @click="handleProcessDetail(scope.row)"
          >
            审批记录
          </el-button>

          <!--  未提交过的可提交审核-->
          <el-button
                  v-if="scope.row.consignmentStatus ===7 "
                  v-hasPermi="['dm:shipping-instorage:update']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>


          <el-button
                  v-if="scope.row.consignmentStatus <2 || scope.row.consignmentStatus ==7 "
                  v-hasPermi="['dm:shipping-instorage:update']"
                  link
                  type="primary"
                  @click="handleCancelDm(scope.row.id)"
          >
            作废
          </el-button>


          <!--&lt;!&ndash; 入库确认 &ndash;&gt;-->
          <!--<el-button-->
                  <!--v-if="scope.row.consignmentStatus === 2"-->
                  <!--link-->
                  <!--type="primary"-->
                  <!--@click="openForm('update', scope.row.id,scope.row.consignmentStatus)"-->
                  <!--v-hasPermi="['ppm:purchase-consignment:update']"-->
          <!--&gt;-->
            <!--签收-->
          <!--</el-button>-->

          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dm:shipping-instorage:delete']"
            v-if="scope.row.consignmentStatus === 0 || scope.row.consignmentStatus === 7"
          >
            删除
          </el-button>


          <el-button
                  v-hasPermi="['dm:shipping:update']"
                  link
                  type="success"
                  @click="openDetail('detail', scope.row.id)"
          >
            详情
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
  <ShippingInstorageForm ref="formRef" @success="getList" />
  <ShippingInstorageInfo ref="detailRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ShippingInstorageApi, ShippingInstorageVO } from '@/api/dm/shippinginstorage'
import ShippingInstorageForm from './ShippingInstorageForm.vue'
import ShippingInstorageInfo from './ShippingInstorageInfo.vue'
import ShippingInstorageDetailList from './components/ShippingInstorageDetailList.vue'
import {ContractApi} from '@/api/ppm/contract'
import {CompanyApi} from '@/api/ppm/company'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
/** 销售订单入库 列表 */
defineOptions({ name: 'ShippingInstorage' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ShippingInstorageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  no: undefined,
  contractId: undefined,
  companyId: undefined,
  productId: undefined,
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
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
const companyList = ref  ([]) //公司列表
const projectInfos = ref([]) // 项目集合
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShippingInstorageApi.getShippingInstoragePage(queryParams)
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


const {push} = useRouter()
/** 查看审批 */
const handleProcessDetail = (row: ShippingVO) => {
    push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
}


/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number, confirmStatus ? : number) => {
  formRef.value.open(type, id,confirmStatus)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ShippingInstorageApi.deleteShippingInstorage(id)
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
    const data = await ShippingInstorageApi.exportShippingInstorage(queryParams)
    download.excel(data, '销售订单入库.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}


/** 提交审核 **/
const handleSubmit = async (row: PurchaseConsignmentVO) => {
    await message.confirm(`您确定提交【${row.no}】审核吗？`)
    await ShippingInstorageApi.submitShippingInstorage(row.id)
    message.success('提交审核成功！')
    await getList()
}



/** 详情操作 */
const detailRef = ref()
const openDetail = (type: string, id
    ? : number
) =>
{
    detailRef.value.open(type, id)
}



/** 作废按钮操作 */
const handleCancelDm = async (id: string) => {
    try {
        // 删除的二次确认
        await message.delConfirm()
        // 发起删除
        await ShippingInstorageApi.cancelShippingInstorage(id)
        message.success(t('common.delSuccess'))
        // 刷新列表
        await getList()
    } catch {
    }
}


const getContractAndUser = async ()=>{
    // 加载合同列表
    contractList.value = await
        ContractApi.getContractListByType(2)
    // 加载用户列表
    companyList.value = await CompanyApi.getCompanyListByType("2,3")

    projectInfos.value = await DMContractApi.getProductOrderList(1);
}



/** 初始化 **/
onMounted(() => {
  getList()
    getContractAndUser()
})
</script>