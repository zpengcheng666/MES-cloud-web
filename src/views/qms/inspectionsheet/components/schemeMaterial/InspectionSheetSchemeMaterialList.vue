<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料编号" align="center" prop="materialNumber"/>
      <el-table-column label="物料名称" align="center" prop="materialName"/>
      <el-table-column label="物料类型" align="center" prop="materialTypeName"/>
      <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
      <el-table-column label="测量结果" align="center" prop="content" />
      <el-table-column label="是否合格" align="center" prop="inspectionResult" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_RESULT" :value="scope.row.inspectionResult" />
        </template>
      </el-table-column>
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="物料批次号" align="center" prop="batchNumber" />
      <el-table-column label="处理方式" align="center" prop="handleMethod" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_HANDLE_METHOD" :value="scope.row.handleMethod" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="250" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click.prevent.stop="openInspectionSheetForm('detail', scope.row.inspectionSheetSchemeId, scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:query']"
          >
            查看
          </el-button>
          <el-button
            link
            type="primary"
            @click="openInspectionSheetForm('update', scope.row.inspectionSheetSchemeId, scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:update']"
          >
            检验单
          </el-button>
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click="openInspectionSheetMaterialForm('update', scope.row.inspectionSheetSchemeId, scope.row.id)"-->
<!--            v-hasPermi="['qms:inspection-sheet:update']"-->
<!--          >-->
<!--            检验-->
<!--          </el-button>-->
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

  <InspectionSheetInfoForm ref="inspectionSheetFormRef" @success="getList"/>
  <InspectionSheetMaterialInfoForm ref="inspectionSheetMaterialFormRef" @success="getList"/>

</template>
<script setup lang="ts">
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import {DICT_TYPE} from "@/utils/dict";
import InspectionSheetInfoForm from "./InspectionSheetInfoForm.vue";
import InspectionSheetMaterialInfoForm from "./InspectionSheetMaterialInfoForm.vue";

defineOptions({name: 'InspectionSheetSchemeMaterialList'})

const props = defineProps<{
  inspectionSheetSchemeId: undefined // 检验单方案Id
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspectionSheetSchemeId: undefined,
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.inspectionSheetSchemeId,
  (val) => {
    queryParams.inspectionSheetSchemeId = val
    handleQuery()
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionSheetApi.getInspectionSheetSchemeMaterialPage(queryParams)
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

/** 检验单检验 */
const inspectionSheetFormRef = ref()
const openInspectionSheetForm = (type: string, sheetSchemeId?: string, sheetSchemeMaterialId?: string) => {
  inspectionSheetFormRef.value.open(type, sheetSchemeId, sheetSchemeMaterialId)
}

/** 检验产品 */
const inspectionSheetMaterialFormRef = ref()
const openInspectionSheetMaterialForm = (type: string, sheetSchemeId?: string, sheetSchemeMaterialId?: string) => {
  inspectionSheetMaterialFormRef.value.open(type, sheetSchemeId, sheetSchemeMaterialId)
}
</script>
