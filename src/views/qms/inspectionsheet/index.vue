<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="检验单名称" prop="sheetName">
        <el-input
          v-model="queryParams.sheetName"
          placeholder="请输入检验单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="检验单号" prop="sheetNo">
        <el-input
          v-model="queryParams.sheetNo"
          placeholder="请输入检验单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="质检状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择质检状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="方案类型" prop="schemeType">
        <el-select
          v-model="queryParams.schemeType"
          placeholder="请选择方案类型"
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
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
          v-model="queryParams.beginTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
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
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['qms:inspection-sheet:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openSelfCheckForm('create')"
          v-hasPermi="['qms:inspection-sheet:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增自检
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
      highlight-current-row
      @row-click="handleCurrentChange"
      reserve-selection
    >
      <el-table-column label="检验单名称" align="center" prop="sheetName" width="150"/>
      <el-table-column label="检验单号" align="center" prop="sheetNo" width="150"/>
      <el-table-column label="生产单号" align="center" prop="recordNumber" width="150"/>
      <el-table-column label="物料编号" align="center" prop="materialNumber" width="150"/>
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
      <el-table-column label="分配类型" align="center" prop="assignmentType" width="120"  >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_ASSIGNMENT_TYPE" :value="scope.row.assignmentType" />
        </template>
      </el-table-column>
<!--      <el-table-column label="检验班组" align="center" prop="assignmentTeamName" width="120" />-->
      <el-table-column label="检验人员" align="center" prop="assignmentName" width="120" />
      <el-table-column
        label="分配日期"
        align="center"
        prop="assignmentDate"
        :formatter="dateFormatter"
        width="120"
      />
<!--      <el-table-column label="工艺" align="center" prop="procedureName" />-->
<!--      <el-table-column label="工序" align="center" prop="processName" />-->
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
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center"  width="200" fixed="right">
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
      <InspectionSheetSchemeMaterialList ref="materialFormRef" :inspection-sheet-scheme-id="currentRow.id" />
    </el-tabs>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InspectionSheetForm ref="formRef" @success="getList" />
  <InspectionSheetSelfCheckForm ref="formRef1" @success="getList" />

  <!-- 分配检验人员 -->
  <InspectionSheetAssignForm ref="assignFormRef" @success="getList" />
  <!-- 核验节点取消 -->
  <InspectionSheetSchemeInfo ref="schemeFormRef" @success="getList" />
  <!-- 不合格登记 -->
  <UnqualifiedRegistrationForm ref="regFormRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { InspectionSheetApi, InspectionSheetVO } from '@/api/qms/inspectionsheet'
import InspectionSheetForm from './InspectionSheetForm.vue'
import InspectionSheetSelfCheckForm from './InspectionSheetSelfCheckForm.vue'

import InspectionSheetScheme from './components/sheetScheme/InspectionSheetSchemeList.vue'
import * as UserApi from "@/api/system/user";
import InspectionSheetSchemeMaterialList
  from "@/views/qms/inspectionsheet/components/schemeMaterial/InspectionSheetSchemeMaterialList.vue";
import InspectionSheetSelfAssignForm
  from "@/views/qms/inspectionsheet/components/sheetScheme/InspectionSheetSelfAssignForm.vue";
import InspectionSheetSchemeInfo
  from "@/views/qms/inspectionsheet/components/sheetScheme/InspectionSheetSchemeInfo.vue";
import InspectionSheetAssignForm
  from "@/views/qms/inspectionsheet/components/sheetScheme/InspectionSheetAssignForm.vue";
import UnqualifiedRegistrationForm
  from "@/views/qms/inspectionsheet/components/sheetScheme/UnqualifiedRegistrationForm.vue";


/** 检验单 列表 */
defineOptions({ name: 'InspectionSheet' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionSheetVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  createTime: [],
  sheetName: undefined,
  sheetNo: undefined,
  status: undefined,
  schemeType: undefined,
  header: undefined,
  beginTime: [],
  endTime: [],
})
const queryFormRef = ref() // 搜索的表单

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

/** 添加/修改操作 */
const formRef1 = ref()
const openSelfCheckForm = (type: string, id?: number) => {
  formRef1.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await InspectionSheetApi.deleteInspectionSheet(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}

/** 分配检验人员 */
const assignFormRef = ref()
const openAssignForm = (type: string, id?: string) => {
  assignFormRef.value.open(type, id)
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

const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表


/** 初始化 **/
onMounted(async() => {
  await getList()
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
})
</script>
