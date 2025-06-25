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
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="批次编码" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入批次编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备/工位" prop="equipmentId">
        <el-select filterable v-model="queryParams.equipmentId" clearable placeholder="请选择设备/工位" class="!w-240px">
          <el-option
            v-for="batch in deviceList"
            :key="batch.id"
            :label="batch.name"
            :value="batch.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料批次编号" prop="batchDetailNumber">
        <el-input
          v-model="queryParams.batchDetailNumber"
          placeholder="请输入质量编号"
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
      <el-form-item label="操作类型" prop="operationType">
        <el-select
          v-model="queryParams.operationType"
          placeholder="请选择操作类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_operation_type')"
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
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:production-records:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="设备编号" align="center" prop="deviceName" />
      <el-table-column label="生产单元" align="center" prop="unitName" />
      <el-table-column label="操作类型" align="center" prop="operationType">
        <template #default="scope">
          <DictTag :type="'mcs_operation_type'" :value="scope.row.operationType" />
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="批次编码" align="center" prop="batchNumber" />
      <el-table-column label="物料批次" align="center" prop="batchDetailNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column label="工步" align="center" prop="stepName" />
      <el-table-column
        label="操作时间"
        align="center"
        prop="operationTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作人" align="center" prop="operationName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:production-records:delete']"
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
  <ProductionRecordsForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ProductionRecordsApi, ProductionRecordsVO } from '@/api/mcs/productionrecords'
import ProductionRecordsForm from './ProductionRecordsForm.vue'
import { getIntDictOptions } from '@/utils/dict'
import DictTag from "@/components/DictTag/src/DictTag.vue";

/** 现场作业记录 列表 */
defineOptions({ name: 'ProductionRecords' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ProductionRecordsVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  orderNumber: undefined,
  batchNumber: undefined,
  equipmentId: undefined,
  batchDetailNumber: undefined,
  barCode: undefined,
  operationType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const deviceList = ref([])

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductionRecordsApi.getProductionRecordsPage(queryParams)
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
    await ProductionRecordsApi.deleteProductionRecords(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const getSelectList = async () => {
  deviceList.value = await ProductionRecordsApi.getDeviceList();
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ProductionRecordsApi.exportProductionRecords(queryParams)
    download.excel(data, '现场作业记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getSelectList()
})
</script>
