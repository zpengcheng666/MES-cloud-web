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
      <el-form-item label="项目号" prop="projectNumber">
        <el-input
          v-model="queryParams.projectNumber"
          placeholder="请输入订项目号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-input
          v-model="queryParams.partNumber"
          placeholder="请输入零件图号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select
          v-model="queryParams.orderType"
          placeholder="请选择订单类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_order_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input
          v-model="queryParams.priority"
          placeholder="请输入优先级"
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
          v-hasPermi="['mcs:order-form:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:order-form:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <ContentWrap>
            <BatchOrderView v-if="scope.row.procesStatus !== 2" :orderId="scope.row.id"/>
            <BatchOrderProcesView v-if="scope.row.procesStatus === 2" :orderId="scope.row.id" :procesStatus="scope.row.procesStatus" />
          </ContentWrap>
        </template>
      </el-table-column>
      <el-table-column label="项目号" align="center" prop="projectNumber" />

      <el-table-column label="加工类型" align="center" prop="procesStatus" >
        <template #default="scope">
          <dict-tag :type="'mcs_proces_status'" :value="scope.row.procesStatus" />
        </template>
      </el-table-column>

      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="零件图号" align="center" prop="partNumber" />
      <el-table-column label="订单类型" align="center" prop="orderType" >
        <template #default="scope">
          <dict-tag :type="'mcs_order_type'" :value="scope.row.orderType" />
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="priority"  width="100px" />
      <el-table-column label="数量" align="center" prop="count" width="100px" />
      <el-table-column label="状态" align="center" prop="status" width="100px">
        <template #default="scope">
          <dict-tag :type="'mcs_order_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="接收时间"
        align="center"
        prop="receptionTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column
        label="交付时间"
        align="center"
        prop="deliveryTime"
        :formatter="dateFormatter2"
        width="180px"
      />
      <el-table-column label="负责人" align="center" prop="responsiblePersonName" />
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="scope.row.status === 0"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['mcs:order-form:update']"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.status === 0"
            link
            type="primary"
            @click="batchSubmit(scope.row)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            提交
          </el-button>
<!--          <el-button
            link
            type="danger"
            @click="handleRevoke(scope.row.id)"
            v-hasPermi="['mcs:order-form:delete']"
          >
            撤销
          </el-button>-->
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
  <OrderFormForm ref="formRef" @success="getList" />
  <SplitOrderCountView ref="splitRef" @success="getList" />
  <SplitDetailCountView ref="splitDetailRef" @success="getList" />
  <BatchDetailView ref="batchDetailRef" @success="getList" />
  <BatchRecordEditView ref="batchRecordEditRef" @success="getList" />
  <BatchOrderProcesEditView ref="batchOrderProcesEditRef" @success="getList" />
  <RecordProcesViewForm ref="recordProcesViewRef" @success="getList" />
</template>

<script setup lang="ts">
import { provide, onMounted, ref, reactive } from 'vue'
import { dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderFormApi, OrderFormVO } from '@/api/mcs/orderform'
import OrderFormForm from './OrderFormForm.vue'
import { getIntDictOptions } from '@/utils/dict'
import BatchOrderView from './components/BatchOrderView.vue'
import BatchOrderProcesView from './components/BatchOrderProcesView.vue'
import SplitOrderCountView from './components/SplitOrderCountView.vue'
import SplitDetailCountView from './components/SplitDetailCountView.vue'
import BatchDetailView from './components/BatchDetailView.vue'
import BatchRecordEditView from "./components/BatchRecordEditView.vue"
import BatchOrderProcesEditView from "./components/BatchOrderProcesEditView.vue"
import RecordProcesViewForm from "./components/RecordProcesViewForm.vue"
import {BatchOrderApi} from "@/api/mcs/batchorder";

/** 生产订单 列表 */
defineOptions({ name: 'OrderForm' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OrderFormVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNumber: undefined,
  projectNumber: undefined,
  partNumber: undefined,
  orderType: undefined,
  priority: undefined,
  issued: true,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const expandKey = ref([]);
const selectOrderInfo = reactive<any>({});

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderFormApi.getOrderFormPage(queryParams)
    list.value = data.list
    total.value = data.total
    reloadExpand()
  } finally {
    loading.value = false
  }
}

const reloadExpand = () => {
  if (expandKey.value && expandKey.value.length > 0) {
    const er = expandKey.value;
    expandKey.value = [];
    setTimeout(()=>{expandKey.value = er},400)
  }
}

const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
    selectOrderInfo.orderNumber = row.orderNumber
    selectOrderInfo.technologyId = row.technologyId
  }
  else expandKey.value = [];
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

const batchDetailRef = ref()
const openBatchDetail = (row: any) => {
  batchDetailRef.value.open(row)
}

const splitDetailRef = ref()
const splitDetail = (row: any) => {
  splitDetailRef.value.open(row);
}

const batchSubmit = async (row: any) => {
  await message.confirm("提交订单" ,'确认提交')
  const msg = await OrderFormApi.orderSubmit(row.id);
  message.success(msg);
  await openViewFun.getList();
}

/** 撤销按钮操作 */
const handleRevoke = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm("未实现")
    await getList()
  } catch {}
}

const splitRef = ref();
const splitOrderCount = (row: any, type: String) => {
  splitRef.value.open(row, type);
}

const batchRecordEditRef = ref();
const openBatchRecordEdit = (row: any) => {
  batchRecordEditRef.value.open(row)
}

const batchOrderProcesEditRef = ref();
const openBatchOrderProcesEdit = (row: any) => {
  batchOrderProcesEditRef.value.open(row)
}

const recordProcesViewRef = ref()
const openRecordProcesView = (type: string , row: any) => {
  recordProcesViewRef.value.open(type, row)
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OrderFormApi.exportOrderForm(queryParams)
    download.excel(data, '生产订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const openViewFun = {
  splitOrderCount,openBatchDetail, openBatchRecordEdit,getList,splitDetail,openRecordProcesView,openBatchOrderProcesEdit
}

provide("openViewFun", openViewFun);
provide("selectOrderInfo", selectOrderInfo);

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
