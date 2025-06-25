<template>
  <h4>&nbsp;库区管理</h4>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <div v-show="showSearch">
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
        </el-form-item>
        <el-form-item label="仓库编码" prop="warehouseId">
          <el-select
            v-model="queryParams.warehouseId"
            placeholder="请选择仓库编码"
            clearable
            filterable
            class="!w-240px"
          >
            <el-option
              v-for="warehouse in warehouseList"
              :key="warehouse.id"
              :label="warehouse.warehouseCode"
              :value="warehouse.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="库区名称" prop="areaName">
          <el-input
            v-model="queryParams.areaName"
            placeholder="请输入库区名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="库区编码" prop="areaCode">
          <el-input
            v-model="queryParams.areaCode"
            placeholder="请输入库区编码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="库区属性" prop="areaProperty">
          <el-select
            v-model="queryParams.areaProperty"
            placeholder="请选择库区属性"
            clearable
            class="!w-240px"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_AREA_PROPERTY)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库区类型" prop="areaType">
          <el-select
            v-model="queryParams.areaType"
            placeholder="请选择库区类型"
            clearable
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

        <!-- <el-form-item label="通道" prop="areaChannels">
          <el-input
            v-model="queryParams.areaChannels"
            placeholder="请输入通道"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="组" prop="areaGroup">
          <el-input
            v-model="queryParams.areaGroup"
            placeholder="请输入组"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="层" prop="areaLayer">
          <el-input
            v-model="queryParams.areaLayer"
            placeholder="请输入层"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item label="位" prop="areaSite">
          <el-input
            v-model="queryParams.areaSite"
            placeholder="请输入位"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item> -->
        
      </div>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:warehouse-area:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:warehouse-area:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain  @click="search">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--      <el-table-column label="ID" align="center" prop="id" />-->
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="仓库编码" width="120" align="center" prop="warehouseCode" />
      <el-table-column label="库区名称" width="180" align="center" prop="areaName" />
      <el-table-column label="库区编码" width="180" align="center" prop="areaCode" />
      <el-table-column label="库区属性" width="120" align="center" prop="areaProperty">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_AREA_PROPERTY" :value="scope.row.areaProperty" />
        </template>
      </el-table-column>
      <el-table-column label="库区类型" width="120" align="center" prop="areaType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_AREA_TYPE" :value="scope.row.areaType" />
        </template>
      </el-table-column>
      <el-table-column label="库区长" align="center" prop="areaLength" />
      <el-table-column label="库区宽" align="center" prop="areaWidth" />
      <el-table-column label="库区高" align="center" prop="areaHeight" />
      <el-table-column label="库区承重" align="center" prop="areaBearing" />
      <el-table-column label="通道" align="center" prop="areaChannels" />
      <el-table-column label="组" align="center" prop="areaGroup" />
      <el-table-column label="层" align="center" prop="areaLayer" />
      <el-table-column label="位" align="center" prop="areaSite" />

      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:warehouse-area:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:warehouse-area:delete']"
          >
            删除
          </el-button>
          <el-dropdown
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['wms:warehouse-location:query', 'wms:material-config-area:query']"
          >
            <el-button type="primary" link><Icon icon="ep:d-arrow-right" /> 更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item command="handleLocation" v-if="checkPermi(['wms:warehouse-location:query'])">
                  库位展示
                </el-dropdown-item> -->
                <el-dropdown-item command="handleMaterialConfigArea" v-if="checkPermi(['wms:material-config-area:query'])">
                  物料库区配置
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  <WarehouseAreaForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { WarehouseAreaApi, WarehouseAreaVO } from '@/api/wms/warehousearea'
import { checkPermi } from '@/utils/permission'
import MaterialConfigArea from '@/views/wms/warehouse/materialconfigarea/index.vue'
import WarehouseLocation from '@/views/wms/warehouse/warehouselocation/index.vue'
import WarehouseAreaForm from './WarehouseAreaForm.vue'
import { WarehouseApi } from '@/api/wms/warehouse'
const { push } = useRouter() // 路由
const route  = useRoute() // 路由

/** 库区 列表 */
defineOptions({ name: 'WarehouseArea' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<WarehouseAreaVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  warehouseId: route.query.warehouseId,
  areaName: undefined,
  areaCode: undefined,
  areaProperty: undefined,
  areaChannels: undefined,
  areaGroup: undefined,
  areaLayer: undefined,
  areaSite: undefined,
  areaType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const warehouseList = ref<any[]>([]) // 仓库列表

const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
    val.length &&
    nextTick(() => {
      queryParams.warehouseId = treeSelectNode.id
      getList()
    })
  },
  { immediate: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WarehouseAreaApi.getWarehouseAreaPage(queryParams)
    list.value = data.list
    total.value = data.total
    //加载仓库列表
    warehouseList.value = await WarehouseApi.getWarehouseList()
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
    await WarehouseAreaApi.deleteWarehouseArea(id)
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
    const data = await WarehouseAreaApi.exportWarehouseArea(queryParams)
    download.excel(data, '库区.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
const showSearch = ref(true)
function search(){
  if(showSearch.value){
    showSearch.value = false
  }else{
    showSearch.value = true
  }

}

/** '更多'操作按钮 */
const handleCommand = (command, row) => {
  switch (command) {
    case 'handleLocation':
      handleLocation(row.id)
      break
    case 'handleMaterialConfigArea':
      handleMaterialConfigArea(row.id)
      break
    default:
      break
  }
}

const handleLocation = (id: any) => {
  // 跳转到物料储位页面
  push({name: WarehouseLocation.name, query: { warehouseAreaId:id }})
}


const handleMaterialConfigArea = (id: any) => {
  // 跳转到物料储位页面
  push({name: MaterialConfigArea.name, query: { warehouseAreaId:id }})
}

</script>
