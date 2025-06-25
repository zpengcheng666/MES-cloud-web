<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="120px"
    >

      <el-form-item label="收货单号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入收货单"
          :disabled="formDisabled != 0"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="合同编号" prop="contractId">
        <el-select
          v-model="queryParams.contractId"
          clearable
          placeholder="请选择合同"
          class="!w-240px"
        >
          <el-option
            v-for="item in constractList"
            :key="item.id"
            :label="item.name + '('+item.number +')'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="收货人" prop="consignedBy">
        <el-select
          v-model="queryParams.consignedBy"
          clearable
          placeholder="请选择收货人员"
          class="!w-240px"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.nickname +'('+item.deptName+')'"
            :value="item.id+''"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发货人" prop="consigner">
        <el-input
          v-model="queryParams.consigner"
          placeholder="请输入发货人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="承运方式" prop="deliveryMethod">
        <el-select
          v-model="queryParams.deliveryMethod"
          placeholder="请选择承运方式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TRANSPORT_WAY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="承运单号" prop="deliveryNumber">
        <el-input
          v-model="queryParams.deliveryNumber"
          placeholder="请输入承运单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="承运人" prop="deliveryBy">
        <el-input
          v-model="queryParams.deliveryBy"
          placeholder="请输入承运人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="承运人电话" prop="deliveryContact">
        <el-input
          v-model="queryParams.deliveryContact"
          placeholder="请输入承运人电话"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="审批结果" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择审批结果"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_PROCUREMENT_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期" prop="createTime">
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['ppm:purchase-consignment:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:purchase-consignment:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
<!--      <el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="PurchaseConsignmentDetail">
            <el-tab-pane label="采购收货明细" name="PurchaseConsignmentDetail">
              <PurchaseConsignmentDetailList :consignment-id="scope.row.id"/>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="收货单号" align="center" prop="no" width="180"/>
      <el-table-column label="收货单名称" align="center" prop="name" width="180"/>
      <el-table-column label="合同编号" align="center" prop="contractNo" width="180" />
      <el-table-column label="收货人" align="center" prop="consignedBy" width="180" />
      <el-table-column
        label="收货日期"
        align="center"
        prop="consignedDate"
        :formatter="dateFormatter"
        width="180"
      />
<!--      <el-table-column label="收货人电话" align="center" prop="consignedContact" width="180" />-->
<!--      <el-table-column label="发货人" align="center" prop="consigner" width="180" />-->
<!--      <el-table-column label="发货人电话" align="center" prop="consignerContact" width="180" />-->
<!--      <el-table-column-->
<!--        label="发货日期"-->
<!--        align="center"-->
<!--        prop="consignerDate"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180"-->
<!--      />-->
      <el-table-column label="状态" align="center" prop="consignmentStatus" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>

      <el-table-column label="承运方式" align="center" prop="deliveryMethod" width="180">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.TRANSPORT_WAY" :value="scope.row.deliveryMethod" />
        </template>
      </el-table-column>

<!--      <el-table-column label="承运单号" align="center" prop="deliveryNumber" width="180" />-->
<!--      <el-table-column label="承运人" align="center" prop="deliveryBy" width="180" />-->
<!--      <el-table-column label="承运人电话" align="center" prop="deliveryContact" width="180" />-->
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180"
      />
      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>
      <el-table-column label="发货人" align="center" prop="consigner" width="180"/>
<!--      <el-table-column label="流程实例编号" align="center" prop="processInstanceId" />-->
      <el-table-column label="审批结果" align="center" prop="status" width="120">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_PROCUREMENT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
            v-if="scope.row.consignmentStatus === 0 || scope.row.consignmentStatus === 7"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:purchase-consignment:update']"
          >
            编辑
          </el-button>
          <!--  未提交过的可提交审核-->
          <el-button
            v-if="scope.row.consignmentStatus === 0 "
            v-hasPermi="['ppm:purchase-consignment:create']"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>

          <!--  审批不通过可修改重新提交审核-->
          <el-button
            v-if="scope.row.consignmentStatus === 7"
            v-hasPermi="['ppm:purchase-consignment:create']"
            link
            type="warning"
            @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>

          <!--  只要审批都可作废-->
          <el-button
            v-if="scope.row.consignmentStatus === 0"
            v-hasPermi="['ppm:purchase-consignment:create']"
            link
            type="warning"
            @click="handleCancelDm(scope.row.id)"
          >
            作废
          </el-button>

<!--          &lt;!&ndash; 确认收货数量&ndash;&gt;-->
<!--          <el-button-->
<!--            v-if="scope.row.consignmentStatus === 4"-->
<!--            v-hasPermi="['ppm:purchase-consignment:create']"-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openForm('update', scope.row.id,3)"-->
<!--          >-->
<!--            收货确认-->
<!--          </el-button>-->

          <el-button
            v-if="scope.row.consignmentStatus > 0"
            v-hasPermi="['ppm:purchase-consignment:create']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            审批记录
          </el-button>


          <!-- 入库确认 -->
          <el-button
            v-if="scope.row.consignmentStatus === 2"
            link
            type="primary"
            @click="openForm('update', scope.row.id,2)"
            v-hasPermi="['ppm:purchase-consignment:update']"
          >
            签收
          </el-button>


          <el-button
                  v-if="scope.row.consignmentStatus === 4"
                  link
                  type="primary"
                  @click="openQmsForm('update', scope.row.id,4)"
                  v-hasPermi="['ppm:purchase-consignment:update']"
          >
            质检
          </el-button>


          <el-button
            v-if="scope.row.consignmentStatus === 0 "
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:purchase-consignment:delete']"
          >
            删除
          </el-button>



          <el-button
            v-hasPermi="['ppm:purchase-consignment:update']"
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
  <PurchaseConsignmentForm ref="formRef" @success="getList" />
  <PurchaseConsignmentFormQms ref="qmsFormRef" @success="getList" />
  <PurchaseConsignmentInfo ref="detailRef" @success="getList"/>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import PurchaseConsignmentForm from './PurchaseConsignmentForm.vue'
import PurchaseConsignmentFormQms from './PurchaseConsignmentFormQms.vue'
import PurchaseConsignmentInfo from './PurchaseConsignmentInfo.vue'
import router from "@/router";
import {ContractApi} from "@/api/ppm/contract";
import * as UserApi from "@/api/system/user";
import PurchaseConsignmentDetailList from "@/views/ppm/purchaseconsignment/components/PurchaseConsignmentDetailList.vue";
import {CompanyApi} from "@/api/ppm/company";

/** 采购收货 列表 */
defineOptions({ name: 'PurchaseConsignment' })
const formDisabled = ref(0)
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<PurchaseConsignmentVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  consignmentName: undefined,
  pageSize: 10,
  contractNo: undefined,
  contractId: undefined,
  no: undefined,
  consignedBy: undefined,
  consignedDate: [],
  consignedContact: undefined,
  consigner: undefined,
  consignerContact: undefined,
  consignerDate: [],
  deliveryMethod: undefined,
  deliveryNumber: undefined,
  deliveryBy: undefined,
  deliveryContact: undefined,
  createTime: [],
  processInstanceId: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const constractList = ref < ContractApi.ContractVO[] > ([]) // 合同编号列表
const companyList = ref < ContractApi.ContractVO[] > ([]) //合同列表
const userList = ref<UserApi.UserVO[]>([]) // 用户清单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PurchaseConsignmentApi.getPurchaseConsignmentPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 提交审核 **/
const handleSubmit = async (row: PurchaseConsignmentVO) => {
  await message.confirm(`您确定提交【${row.no}】审核吗？`)
  await PurchaseConsignmentApi.submitPurchaseConsignment(row.id)
  message.success('提交审核成功！')
  await getList()
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
const openForm = (type: string, id?: number , confirmStatus ? : number) => {
  formRef.value.open(type, id, confirmStatus)
}

/** 添加/修改操作 */
const qmsFormRef = ref()
const openQmsForm = (type: string, id?: number , confirmStatus ? : number) => {
    qmsFormRef.value.open(type, id, confirmStatus)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PurchaseConsignmentApi.deletePurchaseConsignment(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const getContractAndUser = async ()=>{
  // 加载合同列表
  constractList.value = await
    ContractApi.getContractListByType(1)
  // 加载用户列表
  userList.value = await
    UserApi.getSimpleUserList()


  companyList.value = await CompanyApi.getCompanyListByType("1")
}

/** 作废按钮操作 */
const handleCancelDm = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PurchaseConsignmentApi.cancelPurchaseConsignment(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {
  }
}


// /** 入库确认按钮操作 */
// const handleConfirm = async (id: number) => {
//   try {
//     await message.confirm(`入库确认？`)
//     await PurchaseConsignmentApi.handleConfirm(id)
//     message.success('确认成功！')
//     // 刷新列表
//     await getList()
//   } catch {
//   }
// }


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await PurchaseConsignmentApi.exportPurchaseConsignment(queryParams)
    download.excel(data, '采购收货.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (type: string, id
  ? : number
) =>
{
  detailRef.value.open(type, id)
}

// const handleDetail = (row: PurchaseConsignmentVO) => {
//   router.push({
//     name: 'PpmPurchaseconsignmentdetailDetail',
//     query: {
//       id: row.id
//     }
//   })
// }

/** 审批进度 */
const handleProcessDetail = (row: PurchaseConsignmentVO) => {
  router.push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
  getContractAndUser()
})
</script>
