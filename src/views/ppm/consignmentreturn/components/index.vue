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
      <el-form-item label="退货单ID" prop="consignmentReturnId">
        <el-input
          v-model="queryParams.consignmentReturnId"
          placeholder="请输入退货单ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="发货单详情ID" prop="consignmentDetailId">
        <el-input
          v-model="queryParams.consignmentDetailId"
          placeholder="请输入发货单详情ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="合同订单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入合同订单ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="退货数量" prop="consignedAmount">
        <el-input
          v-model="queryParams.consignedAmount"
          placeholder="请输入退货数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库数量" prop="inboundAmount">
        <el-input
          v-model="queryParams.inboundAmount"
          placeholder="请输入入库数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="入库人" prop="inboundBy">
        <el-input
          v-model="queryParams.inboundBy"
          placeholder="请输入入库人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出库时间" prop="inboundTime">
        <el-date-picker
          v-model="queryParams.inboundTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="确认数量" prop="signedAmount">
        <el-input
          v-model="queryParams.signedAmount"
          placeholder="请输入确认数量"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="确认人" prop="signedBy">
        <el-input
          v-model="queryParams.signedBy"
          placeholder="请输入确认人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="确认日期" prop="signedTime">
        <el-date-picker
          v-model="queryParams.signedTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
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
      <el-form-item label="物料库存ID" prop="materialStockId">
        <el-input
          v-model="queryParams.materialStockId"
          placeholder="请输入物料库存ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料条码" prop="barCode">
        <el-input
          v-model="queryParams.barCode"
          placeholder="请输入物料条码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料批次号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入物料批次号"
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
          v-hasPermi="['ppm:consignment-return-detail:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:consignment-return-detail:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="退货单ID" align="center" prop="consignmentReturnId" />
      <el-table-column label="发货单详情ID" align="center" prop="consignmentDetailId" />
      <el-table-column label="合同订单ID" align="center" prop="orderId" />
      <el-table-column label="退货数量" align="center" prop="consignedAmount" />
      <el-table-column label="入库数量" align="center" prop="inboundAmount" />
      <el-table-column label="入库人" align="center" prop="inboundBy" />
      <el-table-column
        label="出库时间"
        align="center"
        prop="inboundTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="确认数量" align="center" prop="signedAmount" />
      <el-table-column label="确认人" align="center" prop="signedBy" />
      <el-table-column
        label="确认日期"
        align="center"
        prop="signedTime"
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
      <el-table-column label="物料库存ID" align="center" prop="materialStockId" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:consignment-return-detail:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['ppm:consignment-return-detail:delete']"
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
  <ConsignmentReturnDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ConsignmentReturnDetailApi, ConsignmentReturnDetailVO } from '@/api/ppm/consignmentreturndetail'
import ConsignmentReturnDetailForm from './ConsignmentReturnDetailForm.vue'

/** 销售退货单详情 列表 */
defineOptions({ name: 'ConsignmentReturnDetail' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ConsignmentReturnDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  consignmentReturnId: undefined,
  consignmentDetailId: undefined,
  orderId: undefined,
  consignedAmount: undefined,
  inboundAmount: undefined,
  inboundBy: undefined,
  inboundTime: [],
  signedAmount: undefined,
  signedBy: undefined,
  signedTime: [],
  createTime: [],
  materialStockId: undefined,
  barCode: undefined,
  batchNumber: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ConsignmentReturnDetailApi.getConsignmentReturnDetailPage(queryParams)
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
    await ConsignmentReturnDetailApi.deleteConsignmentReturnDetail(id)
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
    const data = await ConsignmentReturnDetailApi.exportConsignmentReturnDetail(queryParams)
    download.excel(data, '销售退货单详情.xls')
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