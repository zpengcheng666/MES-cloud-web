<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      @row-click="handleCurrentChange"
      reserve-selection
    >
      <el-table-column label="物料编号" align="center" prop="materialNumber"/>
      <el-table-column label="物料名称" align="center" prop="materialName" width="100" />
      <el-table-column label="质检状态" align="center" prop="status" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_SCHEME_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="方案类型" align="center" prop="schemeType" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_SCHEME_TYPE" :value="scope.row.schemeType" />
        </template>
      </el-table-column>
      <el-table-column label="检验类型" align="center" prop="inspectionSheetType" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_TYPE" :value="scope.row.inspectionSheetType" />
        </template>
      </el-table-column>
      <el-table-column label="是否自检" align="center" prop="selfInspection" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_SELF_INSPECTION" :value="scope.row.selfInspection" />
        </template>
      </el-table-column>
      <el-table-column label="是否首检" align="center" prop="needFirstInspection" width="120" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_NEED_FIRST_INSPECTION" :value="scope.row.needFirstInspection" />
        </template>
      </el-table-column>
<!--      <el-table-column label="检验水平" align="center" prop="inspectionLevelType" width="150" >-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE" :value="scope.row.inspectionLevelType" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="检查级别" align="center" prop="samplingRuleType" width="120" >-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.QMS_SAMPLING_RULE_TYPE" :value="scope.row.samplingRuleType" />-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="分配类型" align="center" prop="assignmentType" width="120"  >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_ASSIGNMENT_TYPE" :value="scope.row.assignmentType" />
        </template>
      </el-table-column>
      <el-table-column label="检验班组" align="center" prop="assignmentTeamName" width="120" />
      <el-table-column label="检验人员" align="center" prop="assignmentName" width="120" />
      <el-table-column
        label="分配日期"
        align="center"
        prop="assignmentDate"
        :formatter="dateFormatter"
        width="120"
      />
      <el-table-column label="工艺" align="center" prop="procedureName" />
      <el-table-column label="工序" align="center" prop="processName" />
      <el-table-column
        label="计划检验时间"
        align="center"
        prop="planTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="实际开始时间"
        align="center"
        prop="beginTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="实际结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="检测数量" align="center" prop="inspectionQuantity" />
      <el-table-column label="实际检测数量" align="center" prop="quantity" width="120" />
      <el-table-column label="合格数量" align="center" prop="qualifiedQuantity" />
      <el-table-column label="操作" align="center"  width="300" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click.prevent.stop="openSchemeForm('detail', scope.row.inspectionSheetId, scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:query']"
          >
            查看
          </el-button>
          <el-button
            link
            type="primary"
            @click.prevent.stop="openAssignForm('update', scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:update']"
            v-if="scope.row.selfInspection != 1 && (scope.row.status == 0 || scope.row.status == 1)"
          >
            分配质检
          </el-button>

          <!-- 目前自检任务自动分配互检人员为部门负责人，此处不做分配操作了 -->
<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click.prevent.stop="openSelfAssignForm('update', scope.row.id)"-->
<!--            v-hasPermi="['qms:inspection-sheet:update']"-->
<!--            v-if="scope.row.selfInspection == 1 && scope.row.status == 3"-->
<!--          >-->
            <!-- 检验任务为自检且检验任务状态为已完成 -->
<!--            分配质检-->
<!--          </el-button>-->

<!--          <el-button-->
<!--            link-->
<!--            type="primary"-->
<!--            @click.prevent.stop="openSchemeForm('update', scope.row.inspectionSheetId, scope.row.id)"-->
<!--            v-hasPermi="['qms:inspection-sheet:update']"-->
<!--          >-->
<!--            核验-->
<!--          </el-button>-->

          <el-button
            link
            type="primary"
            @click.prevent.stop="openRegForm('update', scope.row.inspectionSheetId, scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:update']"
            v-if="scope.row.status=='3' && scope.row.processStatus!='1' && scope.row.processStatus!='2' "
          >
            不合格登记
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

  <!-- 子表的列表 -->
  <ContentWrap v-show="currentRow.id">
    <el-tabs model-value="inspectionSchemeItem">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="检验单产品:" prop="itemName">
            <el-tag type="primary">{{currentRow.materialNumber }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <InspectionSheetSchemeMaterialList ref="formRef" :inspection-sheet-scheme-id="currentRow.id" />
    </el-tabs>
  </ContentWrap>

  <!-- 分配检验人员 -->
  <InspectionSheetAssignForm ref="assignFormRef" @success="getList" />
  <!-- 自检完成 分配检验人员 -->
  <InspectionSheetSelfAssignForm ref="selfAssignFormRef" @success="getList" />
  <!-- 核验节点取消 -->
  <InspectionSheetSchemeInfo ref="schemeFormRef" @success="getList" />
  <!-- 不合格登记 -->
  <UnqualifiedRegistrationForm ref="regFormRef" @success="getList" />

</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import InspectionSheetSchemeMaterialList from '../schemeMaterial/InspectionSheetSchemeMaterialList.vue'
import InspectionSheetAssignForm from './InspectionSheetAssignForm.vue'
import InspectionSheetSelfAssignForm from './InspectionSheetSelfAssignForm.vue'
import InspectionSheetSchemeInfo from './InspectionSheetSchemeInfo.vue'
import UnqualifiedRegistrationForm from './UnqualifiedRegistrationForm.vue'


import {DICT_TYPE} from "@/utils/dict";

defineOptions({name: 'InspectionSheetScheme'})

const props = defineProps<{
  inspectionSheetId: undefined // 检验单Id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspectionSheetId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.inspectionSheetId,
  (val) => {
    queryParams.inspectionSheetId = val
    handleQuery()
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  currentRow.value = {}
  try {
    const data = await InspectionSheetApi.getInspectionSheetSchemePage(queryParams)
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

/** 分配检验人员 */
const assignFormRef = ref()
const openAssignForm = (type: string, id?: string) => {
  assignFormRef.value.open(type, id)
}

/** 自检完成 分配检验人员 */
const selfAssignFormRef = ref()
const openSelfAssignForm = (type: string, id?: string) => {
  selfAssignFormRef.value.open(type, id)
}

/** 检验任务检验 */
const schemeFormRef = ref()
const openSchemeForm = (type: string, sheetId?: number, sheetSchemeId?: number) => {
  schemeFormRef.value.open(type, sheetId, sheetSchemeId)
}

/** 不合格登记 */
const regFormRef = ref()
const openRegForm = (type: string, sheetId?: number, sheetSchemeId?: number) => {
  regFormRef.value.open(type, sheetId, sheetSchemeId)
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}

</script>
