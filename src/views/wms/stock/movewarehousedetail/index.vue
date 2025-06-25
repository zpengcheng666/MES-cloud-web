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
    <el-form-item label="移库单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入移库单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="移库类型" prop="moveType">
        <el-select
          v-model="queryParams.moveType"
          placeholder="请选择移库类型"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MOVE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移库状态" prop="moveState">
        <el-select
          v-model="queryParams.moveState"
          placeholder="请选择移库状态"
          clearable
          class="!w-240px"
        >
        <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MOVE_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="起始仓库" prop="startWarehouseId">
        <el-select
          v-model="queryParams.startWarehouseId"
          placeholder="请选择起始仓库"
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
      <el-form-item label="选择物料" prop="chooseStockId">
        <el-select
          v-model="queryParams.chooseStockId"
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
      <el-form-item label="实际移库物料" prop="materialStockId">
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
          v-hasPermi="['wms:move-warehouse-detail:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:move-warehouse-detail:export']"
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
      /> -->
      <el-table-column label="移库单号" width="150" align="center" prop="orderNumber" />
      <el-table-column label="移库类型" align="center" prop="moveType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MOVE_TYPE" :value="scope.row.moveType" />
        </template>
      </el-table-column>
      <el-table-column label="移库状态" width="150" align="center" prop="moveState">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MOVE_STATE" :value="scope.row.moveState" />
        </template>
      </el-table-column>
      <el-table-column label="起始仓库" align="center" prop="startWarehouseCode" />
      <el-table-column label="目标仓库" align="center" prop="targetWarehouseCode" />
      <el-table-column label="物料批次号" width="170" align="center" prop="batchNumber" />
      <el-table-column label="物料编号" width="150" align="center" prop="materialNumber" />
      <el-table-column label="选择物料" width="150" align="center" prop="chooseBarCode" />
      <el-table-column label="实际移库物料" width="150" align="center" prop="realBarCode" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="移库操作人" width="120" align="center" prop="operator" />
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
            v-hasPermi="['wms:move-warehouse-detail:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:move-warehouse-detail:delete']"
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
  <MoveWarehouseDetailForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MoveWarehouseDetailApi, MoveWarehouseDetailVO } from '@/api/wms/movewarehousedetail'
import MoveWarehouseDetailForm from './MoveWarehouseDetailForm.vue'
import { WarehouseApi } from '@/api/wms/warehouse'
import { MaterialConfigApi } from '@/api/wms/materialconfig'
import { MaterialStockApi } from '@/api/wms/materialstock'

/** 库存移动详情 列表 */
defineOptions({ name: 'MoveWarehouseDetail' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MoveWarehouseDetailVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  orderNumber: undefined,
  moveType: undefined,
  moveState: undefined,
  startWarehouseId: undefined,
  targetWarehouseId: undefined,
  batchNumber: undefined,
  materialConfigId: undefined,
  materialStockId: undefined,
  chooseStockId: undefined,
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
    const data = await MoveWarehouseDetailApi.getMoveWarehouseDetailPage(queryParams)
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
    await MoveWarehouseDetailApi.deleteMoveWarehouseDetail(id)
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
    const data = await MoveWarehouseDetailApi.exportMoveWarehouseDetail(queryParams)
    download.excel(data, '库存移动详情.xls')
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