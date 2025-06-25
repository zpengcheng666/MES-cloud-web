<template>
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <ContentWrap>
          <MaterialTypeTree @node-click="handleItemTypeClick"/>
        </ContentWrap>
      </el-col>
      <el-col :span="20" :xs="24">
        <ContentWrap>
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="方案名称" prop="schemeName">
              <el-input
                v-model="queryParams.schemeName"
                placeholder="请输入方案名称"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <el-form-item label="方案编号" prop="schemeNo">
              <el-input
                v-model="queryParams.schemeNo"
                placeholder="请输入方案编号"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
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
            <el-form-item label="物料编号" prop="materialNumber">
              <el-input
                v-model="queryParams.materialNumber"
                placeholder="请输入物料编号"
                clearable
                @keyup.enter="handleQuery"
                class="!w-240px"
              />
            </el-form-item>
            <!--<el-form-item label="检验级别" prop="inspectionLevel">-->
            <!--<el-input-->
            <!--v-model="queryParams.inspectionLevel"-->
            <!--placeholder="请输入检验级别"-->
            <!--clearable-->
            <!--@keyup.enter="handleQuery"-->
            <!--class="!w-240px"-->
            <!--/>-->
            <!--</el-form-item>-->
            <el-form-item label="是否生效" prop="isEffective">
              <el-select
                v-model="queryParams.isEffective"
                placeholder="请选择是否生效"
                clearable
                class="!w-240px"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_IS_EFFECTIVE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>

            </el-form-item>
            <el-form-item label="工艺" prop="technologyName">
              <el-input v-model="queryParams.technologyName" placeholder="请选择工艺" @click="openProcessForm('create')" readonly class="!w-240px" >
                <template #suffix>
                  <Icon
                    v-show="queryParams.technologyName"
                    class="del-icon"
                    icon="ep:circle-close"
                    style="cursor: pointer;"
                    @click="queryParams.technologyName=undefined; queryParams.technologyId=undefined; queryParams.processId=undefined; procedureValue=[];"
                  />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="工序" prop="processId">
              <el-select
                v-model="queryParams.processId"
                clearable
                filterable
                placeholder="请选择工序"
                class="!w-240px"
              >
                <el-option
                  v-for="item in procedureValue"
                  :key="item.id"
                  :label="item.procedureName + '('+item.procedureNum +')'"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <!--<el-form-item label="抽样规则" prop="samplingRuleId">-->
            <!--<el-input-->
            <!--v-model="queryParams.samplingRuleId"-->
            <!--placeholder="请输入抽样规则"-->
            <!--clearable-->
            <!--@keyup.enter="handleQuery"-->
            <!--class="!w-240px"-->
            <!--/>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button @click="handleQuery">
                <Icon icon="ep:search" class="mr-5px"/>
                搜索
              </el-button>
              <el-button @click="resetQuery">
                <Icon icon="ep:refresh" class="mr-5px"/>
                重置
              </el-button>
              <el-button
                type="primary"
                plain
                @click="openForm('create')"
                v-hasPermi="['qms:inspection-scheme:create']"
              >
                <Icon icon="ep:plus" class="mr-5px"/>
                新增
              </el-button>
              <el-button
                type="success"
                plain
                @click="handleExport"
                :loading="exportLoading"
                v-hasPermi="['qms:inspection-scheme:export']"
              >
                <Icon icon="ep:download" class="mr-5px"/>
                导出
              </el-button>
            </el-form-item>
          </el-form>
        </ContentWrap>
        <ContentWrap>
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
                    highlight-current-row
                    @row-click="handleCurrentChange"
                    reserve-selection
          >
            <!--<el-table-column label="主键" align="center" prop="id" />-->

            <el-table-column label="方案名称" align="center" prop="schemeName" width="150" />
            <el-table-column label="方案编号" align="center" prop="schemeNo" width="150" />
            <el-table-column label="方案类型" align="center" prop="schemeType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.QMS_SCHEME_TYPE" :value="scope.row.schemeType"/>
              </template>
            </el-table-column>
            <el-table-column label="物料编号" align="center" prop="materialNumber" width="150" />
            <el-table-column label="物料名称" align="center" prop="materialName" width="150" />
            <el-table-column label="物料类型" align="center" prop="materialTypeName"/>
            <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
            <el-table-column label="物料单位" align="center" prop="materialUnit"/>
            <el-table-column label="检验级别" align="center" prop="inspectionLevel" v-if="false" />
            <el-table-column label="工艺" align="center" prop="processName" width="150" />
            <el-table-column label="工序" align="center" prop="procedureName" width="150" />
            <el-table-column label="抽样标准" align="center" prop="samplingStandardName" v-if="false" />
            <el-table-column label="检验类型" align="center" prop="inspectionSheetType">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.QMS_INSPECTION_SHEET_TYPE" :value="scope.row.inspectionSheetType"/>
              </template>
            </el-table-column>
            <el-table-column label="检验水平" align="center" prop="inspectionLevelType" v-if="false" >
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE" :value="scope.row.inspectionLevelType"/>
              </template>
            </el-table-column>
            <el-table-column label="抽样规则" align="center" prop="samplingRuleType" v-if="false" >
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.QMS_SAMPLING_RULE_TYPE" :value="scope.row.samplingRuleType"/>
              </template>
            </el-table-column>

            <el-table-column label="是否生效" align="center" prop="isEffective">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.QMS_IS_EFFECTIVE" :value="scope.row.isEffective"/>
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              :formatter="dateFormatter"
              width="180px"
            />
            <el-table-column label="操作" align="center" fixed="right" width="300">
              <template #default="scope">
                <el-button
                  v-if="scope.row.isEffective == 0"
                  link
                  type="primary"
                  @click.prevent.stop="openForm('update', scope.row.id)"
                  v-hasPermi="['qms:inspection-scheme:update']"
                >
                  编辑
                </el-button>

                <el-button
                  link
                  type="primary"
                  @click.prevent.stop="openFormInfo('update', scope.row.id)"
                  v-hasPermi="['qms:inspection-scheme:update']"
                >
                  查看方案单
                </el-button>


                <el-button
                  v-if="scope.row.isEffective==0"
                  link
                  type="primary"
                  @click.prevent.stop="handleEffective(scope.row.id,1)"
                  v-hasPermi="['qms:inspection-scheme:update']"
                >
                  发布
                </el-button>

                <el-button
                  v-if="scope.row.isEffective==1"
                  link
                  type="warning"
                  @click.prevent.stop="handleEffective(scope.row.id,0)"
                  v-hasPermi="['qms:inspection-scheme:update']"
                >
                  作废
                </el-button>
                <el-button
                  link
                  type="danger"
                  @click.prevent.stop="handleDelete(scope.row.id)"
                  v-hasPermi="['qms:inspection-scheme:delete']"
                >
                  删除
                </el-button>

              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </ContentWrap>
      </el-col>
    </el-row>

  <!-- 子表的列表 -->
  <ContentWrap v-show="currentRow.id">
    <el-tabs model-value="inspectionSchemeItem">
      <!--<el-tab-pane label="检测项目详情" name="inspectionItemDetail">-->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-form-item label="检测方案:" prop="itemName">
            <el-tag type="primary">{{currentRow.schemeNo }}({{currentRow.schemeName}})</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <InspectionSchemeItemList :inspection-scheme="currentRow"/>
      <!--</el-tab-pane>-->
    </el-tabs>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InspectionSchemeForm ref="formRef" @success="getList"/>
  <InspectionSchemeInfo ref="formInfoRef" @success="getList"/>
  <ProcessChooseList ref="processChooseListRef" @getProcess="getProcess"/>
</template>

<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {dateFormatter} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {InspectionSchemeApi, InspectionSchemeVO} from '@/api/qms/inspectionscheme'
  import InspectionSchemeForm from './InspectionSchemeForm.vue'
  import InspectionSchemeInfo from './InspectionSchemeInfo.vue'
  import InspectionSchemeItemList from './components/InspectionSchemeItemList.vue'
  import ProcessChooseList from "@/views/qms/inspectionscheme/components/ProcessChooseList.vue";
  import MaterialTypeTree from "./components/MaterialTypeTree.vue";


  /** 检验方案 列表 */
  defineOptions({name: 'InspectionScheme'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化

  const loading = ref(true) // 列表的加载中
  const list = ref < InspectionSchemeVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    schemeName: undefined,
    schemeNo: undefined,
    schemeType: undefined,
    materialConfigId: undefined,
    inspectionLevel: undefined,
    isEffective: undefined,
    materialNumber: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialProperty: undefined,
    materialType: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    technologyId: undefined,
    technologyName: undefined,
    processId: undefined,
    samplingRuleId: undefined,
    materialTypeId: undefined
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中
  /** 选中行操作 */
  const currentRow = ref({}) // 选中行
  const handleCurrentChange = (row) => {

    currentRow.value = row
  }
  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    currentRow.value = {}
    try {
      const data = await InspectionSchemeApi.getInspectionSchemePage(queryParams)
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
    procedureValue.value = []
    handleQuery()
  }

  const processChooseListRef = ref()
  const openProcessForm = (type, row, confirmStatus) => {
    processChooseListRef.value.open(type)
  }

  const procedureValue = ref();
  const getProcess= async (process) => {
    procedureValue.value = undefined;
    queryParams.technologyId = process.processVersionId
    queryParams.technologyName = process.processName +'('+ process.processCode+')'
    procedureValue.value = await InspectionSchemeApi.getProcedure(process.processVersionId)
  }


  /** 添加/修改操作 */
  const formRef = ref()
  const openForm = (type: string, id
    ? : number
  ) =>
  {
    formRef.value.open(type, id)
  }


  /** 添加/修改操作 */
  const formInfoRef = ref()
  const openFormInfo = (type: string, id
    ? : number
  ) =>
  {
    formInfoRef.value.open(type, id)
  }

  /** 删除按钮操作 */
  const handleDelete = async (id: number) => {
    try {
      // 删除的二次确认
      await message.delConfirm()
      // 发起删除
      await InspectionSchemeApi.deleteInspectionScheme(id)
      message.success(t('common.delSuccess'))
      // 刷新列表
      await getList()
    } catch {
    }
  }


  /** 发布按钮 */
  const handleEffective = async (id: string, type: number) => {
    try {
      if (type == 1) {
        // 发布的二次确认
        await message.confirm(`您确定发布该方案吗？`)
        // 发起生效
        await InspectionSchemeApi.submitEffective(id, type)
        message.success('发布成功，方案开始生效！')
      } else {
        // 发布的二次确认
        await message.confirm(`您确定作废该方案吗？`)
        // 发起生效
        await InspectionSchemeApi.submitEffective(id, type)
        message.success('作废成功，方案已经失效！')
      }

      // 刷新列表
      await getList()
    } catch {
    }
  }
  /** 导出按钮操作 */
  const handleExport = async () => {
    try {
      // 导出的二次确认
      await message.exportConfirm()
      // 发起导出
      exportLoading.value = true
      const data = await InspectionSchemeApi.exportInspectionScheme(queryParams)
      download.excel(data, '检验方案.xls')
    } catch {
    } finally {
      exportLoading.value = false
    }
  }

  /** 处理分类被点击 */
  const handleItemTypeClick = async (row) => {
    if (row.id=='0'){
      queryParams.materialTypeId = undefined
    } else {
      queryParams.materialTypeId = row.id
    }
    await getList()
  }

  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
