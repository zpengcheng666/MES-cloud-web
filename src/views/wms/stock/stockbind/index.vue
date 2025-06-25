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
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-select
          v-model="queryParams.materialConfigId"
          placeholder="请选择物料编号"
          clearable
          filterable
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
      <el-form-item label="物料条码" prop="barCode">
        <el-input
          v-model="queryParams.barCode"
          placeholder="请输入物料条码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchNumber">
        <el-input
          v-model="queryParams.batchNumber"
          placeholder="请输入物料批次号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
<!--      <el-form-item label="绑定物料" prop="materialId">
        <el-select
          v-model="queryParams.materialId"
          placeholder="请选择绑定物料"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="l in list"
            :key="l.id"
            :label="l.barCode"
            :value="l.id+''"
          />
        </el-select>
      </el-form-item>-->
      <el-form-item label="绑定储位" prop="storageId">
        <el-select
          v-model="queryParams.storageId"
          filterable
          placeholder="请选择绑定储位"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="materialStorage in materialStorageList"
            :key="materialStorage.id"
            :label="materialStorage.storageCode"
            :value="materialStorage.id+''"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定库位" prop="locationId">
        <el-select
          v-model="queryParams.locationId"
          placeholder="请选择绑定库位"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="warehouseLocation in warehouseLocationList"
            :key="warehouseLocation.id"
            :label="warehouseLocation.locationCode"
            :value="warehouseLocation.id+''"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定类型" prop="bindType">
        <el-select
          v-model="queryParams.bindType"
          placeholder="请选择绑定类型"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_BIND_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库区类型" prop="warehouseAreaTypes">
        <el-select
          v-model="queryParams.warehouseAreaTypes"
          placeholder="请选择绑定类型"
          clearable
          filterable
          multiple
          disabled
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_AREA_TYPE)"
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
          v-hasPermi="['wms:material-stock:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">

      <el-table-column label="物料编号" align="center" prop="materialNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
      <el-table-column label="绑定库位" align="center" prop="locationCode" />
      <el-table-column label="总库存" align="center" prop="totality" />
      <!-- <el-table-column label="锁定库存" align="center" prop="locked" /> -->
      <!-- <el-table-column label="可用库存" align="center" prop="available" /> -->
      <el-table-column label="容器满载比例" align="center" prop="byOccupancyRatio" />
      <el-table-column label="占用比例" align="center" prop="occupancyRatio" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:stock-bind:active']"
          >
            绑定
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

  <!-- 表单弹窗：库存绑定 -->
  <StockBindForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { MaterialStockApi, MaterialStockVO } from '@/api/wms/materialstock'
import {MaterialConfigApi} from "@/api/wms/materialconfig";
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import {MaterialStorageApi} from "@/api/wms/materialstorage";
import StockBindForm from './StockBindForm.vue'
import { StockActiveApi } from '@/api/wms/stockactive';


/** 物料库存 列表 */
defineOptions({ name: 'MaterialStock' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MaterialStockVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  materialConfigId: undefined,
  barCode: undefined,
  batchNumber: undefined,
  storageId: undefined,
  locationId: undefined,
  bindType: undefined,
  warehouseAreaTypes: [2,3,4,5,9],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const materialConfigList =ref() //物料类型
const warehouseLocationList =ref() //库位
const materialStorageList =ref() //储位
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StockActiveApi.getStockBindPage(queryParams)
    list.value = data.list
    total.value = data.total

    materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
    warehouseLocationList.value =await WarehouseLocationApi.getWarehouseLocationList()
    materialStorageList.value = await MaterialStorageApi.getMaterialStorageList()
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


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await MaterialStockApi.exportMaterialStock(queryParams)
    download.excel(data, '物料库存.xls')
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
