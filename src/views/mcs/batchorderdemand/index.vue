<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="订单编号" prop="orderId">
        <el-select remote :remote-method="getOrderList" v-model="queryParams.orderId" filterable clearable @change="getBatchList" placeholder="请选择订单编号" class="!w-240px">
          <el-option
            v-for="order in orderList"
            :key="order.id"
            :label="order.orderNumber"
            :value="order.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资源类型" prop="resourceType">
        <el-select
          v-model="queryParams.resourceType"
          placeholder="请选择资源类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getStrDictOptions('wms_material_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资源编码" prop="resourceTypeCode">
        <el-input
          v-model="queryParams.resourceTypeCode"
          placeholder="请输入资源编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="齐备情况" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择齐备情况"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_ready_status')"
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
          @click="openForm()"
          v-hasPermi="['mcs:batch-order-demand:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:batch-order-demand:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" :stripe="true" :show-overflow-tooltip="true" :expand-row-keys="expandKey" @expand-change="expandChange">
      <el-table-column type="expand">
        <template #default="scope">
          <ContentWrap>
            <demand-record-view :demandId="scope.row.id" :demandStatus="scope.row.status"/>
          </ContentWrap>
        </template>
      </el-table-column>
      <el-table-column label="批次订单编码" align="center" prop="orderNumber" width="180" />
      <el-table-column label="资源类型" align="center" prop="resourceType" width="90" >
        <template #default="scope">
          <DictTag :type="'wms_material_type'" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="资源编码" align="center" prop="resourceTypeCode" />
      <el-table-column label="需求类型" align="center" prop="requirementType" >
        <template #default="{ row }">
          <dict-tag :type="'mcs_requirement_type'" :value="row.requirementType" />
        </template>
      </el-table-column>
      <el-table-column label="需求数量" align="center" prop="total" width="100" />
      <el-table-column label="齐备状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <DictTag :type="'mcs_ready_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="确认人" align="center" prop="confirmedByName" />
      <el-table-column
        label="确认时间"
        align="center"
        prop="confirmedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openResourceSortingView(scope.row)"
            v-hasPermi="['mcs:order-form:update']"
            v-if="scope.row.status === 0 || scope.row.status === 1"
          >
            分拣
          </el-button>
          <el-button
            link
            type="primary"
            @click="completeConfirm(scope.row)"
            v-hasPermi="['mcs:order-form:update']"
            v-if="scope.row.status === 1 || scope.row.status === 2"
          >
            齐备确认
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:order-form:delete']"
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
  <BatchOrderDemandForm ref="formRef" @success="getList" />
  <material-resource-sorting-view ref="mResourceSortingRef" @success="getList"/>
  <cutting-resource-sorting-view ref="cResourceSortingRef" @success="getList"/>
  <tool-resource-sorting-view ref="tResourceSortingRef" @success="getList"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { BatchOrderDemandApi, BatchOrderDemandVO } from '@/api/mcs/batchorderdemand'
import BatchOrderDemandForm from './components/BatchOrderDemandForm.vue'
import { getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import MaterialResourceSortingView from "@/views/mcs/batchorderdemand/components/MaterialResourceSortingView.vue";
import CuttingResourceSortingView from "@/views/mcs/batchorderdemand/components/CuttingResourceSortingView.vue";
import ToolResourceSortingView from "@/views/mcs/batchorderdemand/components/ToolResourceSortingView.vue";
import DemandRecordView from "@/views/mcs/batchorderdemand/components/DemandRecordView.vue";
import {provide, ref} from "vue";

/** 批次订单需求 列表 */
defineOptions({ name: 'BatchOrderDemand' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BatchOrderDemandVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderId: undefined,
  batchId: undefined,
  resourceType: undefined,
  resourceCode: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const orderList = ref([])
const batchList = ref([])
const demandInfo = reactive({})

provide("demandInfo", demandInfo)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BatchOrderDemandApi.getBatchOrderDemandPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
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
const openForm = () => {
  formRef.value.open()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BatchOrderDemandApi.deleteBatchOrderDemand(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const getOrderList = async (query) => {
  if (query)
    orderList.value = await BatchOrderDemandApi.getOrderList({orderNumber: query});
}

const getBatchList = async () => {
  queryParams.batchId = null;
  batchList.value = await BatchOrderDemandApi.getBatchList({'orderId': queryParams.orderId});
}

const completeConfirm = async (row: any) => {
  await message.confirm("是否提交备料信息", "齐备确认");
  const data = await BatchOrderDemandApi.demandCompleteConfirm(row.id)
  message.success("操作成功")
  await getList();
}

const mResourceSortingRef = ref();
const tResourceSortingRef = ref();
const cResourceSortingRef = ref();
const openResourceSortingView = (row: any) => {
  if (row.resourceType == 'GJ') {
    mResourceSortingRef.value.open(row);
  } else if (row.resourceType == 'GZ') {
    tResourceSortingRef.value.open(row);
  } else if (row.resourceType == 'DJ') {
    cResourceSortingRef.value.open(row);
  }
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await BatchOrderDemandApi.exportBatchOrderDemand(queryParams)
    download.excel(data, '批次订单需求.xls')
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
