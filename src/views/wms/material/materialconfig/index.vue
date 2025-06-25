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
      <div  v-show="isExpandAll">
        <el-form-item label="物料编号" prop="materialNumber">
        <el-input
          v-model="queryParams.materialNumber"
          placeholder="请输入物料编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料类码" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料类码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物料名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="物料属性" prop="materialProperty">
        <el-select
          v-model="queryParams.materialProperty"
          placeholder="请输入物料属性（成品、毛坯、辅助材料）"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料类型" prop="materialType">
        <el-select
          v-model="queryParams.materialType"
          placeholder="请选择物料类型（零件、托盘、工装、夹具、刀具）"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料管理模式" prop="materialManage">
        <el-select
          v-model="queryParams.materialManage"
          placeholder="请输入物料管理模式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库规则" prop="materialOutRule">
        <el-select
          v-model="queryParams.materialOutRule"
          placeholder="请输入出库规则"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_OUTBOUNDRULES)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否单储位" prop="materialStorage">
        <el-select
          v-model="queryParams.materialStorage"
          placeholder="请输入是否单储位"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否为容器" prop="materialContainer">

        <el-select
          v-model="queryParams.materialContainer"
          placeholder="请输入是否为容器"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否质检" prop="materialQualityCheck">

        <el-select
          v-model="queryParams.materialQualityCheck"
          placeholder="请输入是否质检"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="存放指定容器" prop="containerConfigIds">
        <el-select
          v-model="queryParams.containerConfigIds"
          placeholder="请输入是否存储指定类型物料"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="默认存放仓库" prop="defaultWarehouseId">
        <el-select
          v-model="queryParams.defaultWarehouseId"
          placeholder="请选择默认存放仓库"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.areaCode"
            :value="warehouse.id+''"
          />
        </el-select>
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
      </div>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!-- <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['wms:material-config:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button> -->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['wms:material-config:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain @click="toggleExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
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
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
    >
<!--      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />-->
      <el-table-column  label="物料编号"  width="150px" align="center" prop="materialNumber" />
      <el-table-column label="物料类码"  align="center" prop="materialCode" />
      <el-table-column label="物料名称" width="120px" align="center" prop="materialName" />
      <!-- <el-table-column label="物料属性" align="center" prop="materialProperty" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES" :value="scope.row.materialProperty" />
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="物料类型" align="center" prop="materialType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MATERIAL_TYPE" :value="scope.row.materialType" />
        </template>
      </el-table-column> -->
      <el-table-column label="主类别" align="center" prop="materialTypeName" />
      <el-table-column label="托盘类型" align="center" prop="containerType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_CONTAINER_TYPE" :value="scope.row.containerType" />
        </template>
      </el-table-column>
      <el-table-column label="物料规格" align="center" prop="materialSpecification" />
      <el-table-column label="物料品牌" align="center" prop="materialBrand" />
      <el-table-column label="物料单位" align="center" prop="materialUnit" />
      <el-table-column label="预警库存" align="center" prop="warningStock" />
      <el-table-column label="物料管理模式" align="center" prop="materialManage" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE" :value="scope.row.materialManage" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="出库规则" align="center" prop="materialOutRule" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_MATERIAL_TYPE_OUTBOUNDRULES" :value="scope.row.materialOutRule" />
        </template>
      </el-table-column> -->
      <el-table-column label="是否单储位" align="center" prop="materialStorage" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="scope.row.materialStorage" />
        </template>
      </el-table-column>
      <el-table-column label="是否为容器" align="center" prop="materialContainer" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="scope.row.materialContainer" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否质检" align="center" prop="materialQualityCheck" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="scope.row.materialQualityCheck" />
        </template>
      </el-table-column> -->
      <el-table-column label="存放指定容器" align="center" prop="containerConfigNumbers" />
      <el-table-column label="层" align="center" prop="materialLayer" />
      <el-table-column label="排" align="center" prop="materialRow" />
      <el-table-column label="列" align="center" prop="materialCol" />
      <el-table-column label="默认存放仓库" align="center" prop="defaultWarehouseCode" />
      <!-- <el-table-column label="父物料类型" align="center" prop="materialNumberParent" /> -->
      <el-table-column label="操作" :width="240" fixed="right" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['wms:material-config:update']"
            v-if="scope.row.status=='2'"
          >
            编辑
          </el-button>
          <el-button
            link
            v-hasPermi="['wms:material-config:update']"
            type="primary"
            @click="handleProcessDetail(scope.row)"
            v-if="scope.row.status!='0'"
          >
            审批进度
          </el-button>
          <!-- <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['wms:material-config:delete']"
          >
            删除
          </el-button> -->
          <!-- <el-dropdown
            @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['wms:material-config-area:query']"
          >
            <el-button type="primary" link><Icon icon="ep:d-arrow-right" /> 更多</el-button>
            <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="handleMaterialConfigArea" v-if="checkPermi(['wms:material-config-area:query'])">
                    物料库区配置
                  </el-dropdown-item>
                </el-dropdown-menu>
            </template>
          </el-dropdown> -->
          <el-button
            link
            type="success"
            @click="handleMaterialConfigArea(scope.row.id)"
            v-hasPermi="['wms:material-config-area:query']"
          >
          物料库区配置
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
  <MaterialConfigForm ref="formRef" @success="getList" width="60%"/>
</template>

<script setup lang="ts">
import { handleTree } from '@/utils/tree'
import download from '@/utils/download'
import { MaterialConfigApi, MaterialConfigVO } from '@/api/wms/materialconfig'
import MaterialConfigForm from './MaterialConfigForm.vue'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {WarehouseApi} from "@/api/wms/warehouse";
import MaterialConfigArea from '@/views/wms/warehouse/materialconfigarea/index.vue'
const { push } = useRouter() // 路由



/** 物料类型 列表 */
defineOptions({ name: 'MaterialConfig' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<MaterialConfigVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  materialNumber: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialProperty: undefined,
  materialType: undefined,
  materialManage: undefined,
  materialOutRule: undefined,
  materialStorage: undefined,
  materialContainer: undefined,
  materialQualityCheck: undefined,
  containerConfigIds: undefined,
  defaultWarehouseId: undefined,
  areaCode: undefined,
  materialNumberParent: undefined,
  status: undefined,
  processInstanceId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const warehouseList = ref<any[]>([]) // 默认存放仓库列表
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await MaterialConfigApi.getMaterialConfigList()
    const data1 = await MaterialConfigApi.getMaterialConfigPage(queryParams)
    total.value = data1.total
    list.value = handleTree(data1.list, 'id', 'materialParentId')

    warehouseList.value = await WarehouseApi.getWarehouseList();
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
    await MaterialConfigApi.deleteMaterialConfig(id)
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
    const data = await MaterialConfigApi.exportMaterialConfig(queryParams)
    download.excel(data, '物料类型.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 展开/折叠操作 */
const isExpandAll = ref(true) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

const handleMaterialConfigArea = (id: any) => {
  // 跳转到物料储位页面
  push({name: MaterialConfigArea.name, query: { materialConfigId:id }})
}

/** '更多'操作按钮 */
const handleCommand = (command, row) => {
  switch (command) {
    case 'handleMaterialConfigArea':
    handleMaterialConfigArea(row.id)
      break
    default:
      break
  }
}

/** 查看审批 */
const handleProcessDetail = (row: any) => {
  push({ name: 'BpmProcessInstanceDetail', query: { id: row.processInstanceId } })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
