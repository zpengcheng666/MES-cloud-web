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
      
      <el-form-item label="出库单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入出库单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="出库类型" prop="outType">
        <el-select
          v-model="queryParams.outType"
          placeholder="请选择出库类型"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_OUT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库状态" prop="outState">
        <el-select
          v-model="queryParams.outState"
          placeholder="请选择出库状态"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_OUT_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库仓库" prop="warehouseId">
        <el-select
          v-model="queryParams.warehouseId"
          placeholder="请选择出库仓库"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseCode"
            :value="warehouse.id"
          />
        </el-select>
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
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-select
          v-model="queryParams.materialConfigId"
          placeholder="请选择物料编号"
          clearable
          class="!w-240px"
        >
        <el-option
              v-for="materialtype in materialConfigList"
              :key="materialtype.id"
              :label="materialtype.materialNumber"
              :value="materialtype.id+''"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="出库物料" prop="chooseStockId">
        <el-select
          v-model="queryParams.materialStockId"
          placeholder="请选择物料条码"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="materialStock in materialStockList"
            :key="materialStock.id"
            :label="materialStock.barCode"
            :value="materialStock.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="实际出库物料" prop="materialStockId">
        <el-select
          v-model="queryParams.materialStockId"
          placeholder="请选择物料条码"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="materialStock in materialStockList"
            :key="materialStock.id"
            :label="materialStock.barCode"
            :value="materialStock.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:out-warehouse-detail:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:out-warehouse-detail:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="ID" align="center" prop="id" /> -->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="创建者" align="center" prop="creator" /> -->
      <el-table-column label="出库单号" width="180" align="center" prop="orderNumber" />
      <el-table-column label="出库类型" align="center" prop="outType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_OUT_TYPE" :value="scope.row.outType" />
        </template>
      </el-table-column>
      <el-table-column label="出库状态" width="150" align="center" prop="outState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_OUT_STATE" :value="scope.row.outState" />
        </template>
      </el-table-column>
      <el-table-column label="出库仓库" align="center" prop="warehouseCode" />
      <el-table-column label="目标仓库" align="center" prop="targetWarehouseCode" />
      <el-table-column label="物料批次号"  width="170" align="center" prop="batchNumber" />
      <el-table-column label="物料编号"  width="150" align="center" prop="materialNumber" />
      <el-table-column label="选择物料"  width="150" align="center" prop="chooseBarCode" />
      <el-table-column label="实际出库物料"  width="150" align="center" prop="realBarCode" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="出库操作人" width="120" align="center" prop="operator" />
      <el-table-column
        label="操作时间"
        align="center"
        prop="operateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="签收人" width="120" align="center" prop="signer" />
      <el-table-column
        label="签收时间"
        align="center"
        prop="signTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:out-warehouse-detail:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:out-warehouse-detail:delete']"
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
  <OutWarehouseDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OutWarehouseDetailApi, OutWarehouseDetailVO } from '@/api/wms/outwarehousedetail'
import OutWarehouseDetailForm from './OutWarehouseDetailForm.vue'
import { WarehouseApi } from '@/api/wms/warehouse'
import { MaterialConfigApi } from '@/api/wms/materialconfig'
import { MaterialStockApi } from '@/api/wms/materialstock'

/** 出库详情 列表 */
defineOptions({ name: 'OutWarehouseDetail' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<OutWarehouseDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  orderNumber: undefined,
  outType: undefined,
  outState: undefined,
  warehouseId: undefined,
  targetWarehouseCode: undefined,
  batchNumber: undefined,
  materialConfigId: undefined,
  materialStockId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const warehouseList = ref<any[]>([]) // 仓库列表
const materialConfigList =ref() //物料类型
const materialStockList = ref<any[]>([]) // 仓库区域列表

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OutWarehouseDetailApi.getOutWarehouseDetailPage(queryParams)
    list.value = data.list
    total.value = data.total
    //加载仓库列表
    warehouseList.value = await WarehouseApi.getWarehouseList()
    materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
    materialStockList.value = await MaterialStockApi.getMaterialStockList()
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
    await OutWarehouseDetailApi.deleteOutWarehouseDetail(id)
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
    const data = await OutWarehouseDetailApi.exportOutWarehouseDetail(queryParams)
    download.excel(data, '出库详情.xls')
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
