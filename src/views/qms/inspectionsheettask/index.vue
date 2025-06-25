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
      <el-form-item label="检验单号" prop="sheetNo">
        <el-input
          v-model="queryParams.sheetNo"
          placeholder="请输入检验单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="生产单号" prop="recordNumber">
        <el-input
          v-model="queryParams.recordNumber"
          placeholder="请输入生产单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="类型" prop="schemeType">
        <el-select
          v-model="queryParams.schemeType"
          placeholder="请选择类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="工艺" prop="technologyName">
        <el-input v-model="queryParams.technologyName" placeholder="请选择工艺" @click="openProcessForm('create')" readonly  class="!w-240px"/>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
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
      highlight-current-row
      @row-click="handleCurrentChange"
      reserve-selection
    >
      <el-table-column label="检验单号" align="center" prop="sheetNo" width="200"/>
      <el-table-column label="生产单号" align="center" prop="recordNumber" width="200"/>
      <el-table-column label="物料编号" align="center" prop="materialNumber" width="180"/>
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

<!--      <el-table-column label="是否自检" align="center" prop="selfInspection" width="120" >-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.QMS_SELF_INSPECTION" :value="scope.row.selfInspection" />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="是否首检" align="center" prop="needFirstInspection" width="120" >-->
<!--        <template #default="scope">-->
<!--          <dict-tag :type="DICT_TYPE.QMS_NEED_FIRST_INSPECTION" :value="scope.row.needFirstInspection" />-->
<!--        </template>-->
<!--      </el-table-column>-->
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
<!--      <el-table-column label="检验人员" align="center" prop="assignmentName" />-->
      <el-table-column
        label="分配日期"
        align="center"
        prop="assignmentDate"
        :formatter="dateFormatter2"
        width="120"
      />
<!--      <el-table-column label="工艺" align="center" prop="technologyId" />-->
<!--      <el-table-column label="工序" align="center" prop="processId" />-->
      <el-table-column
        label="计划检验时间"
        align="center"
        prop="planTime"
        :formatter="dateFormatter2"
        width="180px"
      />
<!--      <el-table-column-->
<!--        label="实际开始时间"-->
<!--        align="center"-->
<!--        prop="beginTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
<!--      <el-table-column-->
<!--        label="实际结束时间"-->
<!--        align="center"-->
<!--        prop="endTime"-->
<!--        :formatter="dateFormatter"-->
<!--        width="180px"-->
<!--      />-->
      <el-table-column label="检测数量" align="center" prop="inspectionQuantity" />
<!--      <el-table-column label="实际检测数量" align="center" prop="quantity" width="120" />-->
<!--      <el-table-column label="合格数量" align="center" prop="qualifiedQuantity" />-->
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click.prevent.stop="claimTask(scope.row.id)"
            v-hasPermi="['qms:inspection-sheet:update']"
          >
            认领
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

  <ProcessChooseList ref="processChooseListRef" @getProcess="getProcess"/>

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { InspectionSheetApi, InspectionSheetVO } from '@/api/qms/inspectionsheet'
import InspectionSheetSchemeMaterialList from './components/InspectionSheetSchemeMaterialList.vue'
import ProcessChooseList from "@/views/qms/inspectionscheme/components/ProcessChooseList.vue";
import {InspectionSchemeApi} from "@/api/qms/inspectionscheme";


/** 检验单 列表 */
defineOptions({ name: 'InspectionSheetTask' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  sheetNo: undefined,
  recordNumber: undefined,
  schemeType: undefined,
  technologyId: undefined,
  technologyName: undefined,
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  currentRow.value = {}
  try {
    const data = await InspectionSheetApi.getInspectionSheetTaskPage(queryParams)
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
  queryParams.technologyId = undefined
  handleQuery()
}

const processChooseListRef = ref()
const openProcessForm = (type) => {
  processChooseListRef.value.open(type)
}

const getProcess= async (process) => {
  queryParams.technologyId = process.processVersionId
  queryParams.technologyName = process.processName +'('+ process.processCode+')'
}


/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}

/**
 * 任务认领
 * @param row
 */
const claimTask = async (id) => {
  try {
    await message.confirm('是否确认认领当前任务！！')
    await InspectionSheetApi.updateInspectionSheetSchemeClaim(id)
    message.success(t('认领成功'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
