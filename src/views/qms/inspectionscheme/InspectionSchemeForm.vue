<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1280">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="方案名称" prop="schemeName">
            <el-input v-model="formData.schemeName" placeholder="请输入方案名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案编号" prop="schemeNo">
            <el-input v-model="formData.schemeNo" placeholder="请输入方案编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="方案类型" prop="schemeType">
            <el-select v-model="formData.schemeType" placeholder="请选择方案类型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="false">
        <el-col :span="8">
          <el-form-item label="检验级别" prop="inspectionLevel">
            <el-input-number v-model="formData.inspectionLevel" placeholder="请输入检验级别"/>
          </el-form-item>
        </el-col>
        <!--<el-form-item label="是否生效" prop="isEffective">-->
        <!--<el-input v-model="formData.isEffective" placeholder="请输入是否生效"/>-->
        <!--</el-form-item>-->
        <el-col :span="8">
          <el-form-item label="抽样规则" prop="samplingStandardId">

            <el-tree-select
              v-model="formData.samplingStandardId"
              :data="standardList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择抽样标准"
            />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20" v-if="false">
        <el-col :span="8">

          <el-form-item label="抽样准则" prop="samplingLimitType">

            <el-select v-model="formData.samplingLimitType" placeholder="请选择抽样准则">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SAMPLING_LIMIT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
            <!--<el-input v-model="formData.samplingLimitType" placeholder="请输入工艺ID"/>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <el-form-item label="接收质量限" prop="acceptanceQualityLimit">
            <el-input-number v-model="formData.acceptanceQualityLimit" placeholder="请输入接收质量限"  :precision="3" :step="0.1"/>
          </el-form-item>
        </el-col>
      </el-row>


        <el-row :gutter="20" v-if="false">
            <el-col :span="8">

                <el-form-item label="检验类型" prop="inspectionSheetType">
                    <el-select
                            v-model="formData.inspectionSheetType"
                            placeholder="请选择检验类型"
                            clearable
                    >
                        <el-option
                                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_TYPE)"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="检验水平" prop="inspectionLevelType">
                    <el-select
                            v-model="formData.inspectionLevelType"
                            placeholder="请选择物检验水平"
                            clearable
                    >
                        <el-option
                                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_LEVEL_TYPE)"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        />
                    </el-select>
                </el-form-item>

            </el-col>

            <el-col :span="8">
                <el-form-item label="抽样标准" prop="samplingRuleType">
                    <el-select
                            v-model="formData.samplingRuleType"
                            placeholder="请选择抽样标准"
                            clearable
                    >
                        <el-option
                                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SAMPLING_RULE_TYPE)"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                        />
                    </el-select>
                </el-form-item>

            </el-col>
        </el-row>

      <el-row :gutter="20">
        <!--<el-col :span="8">-->
        <!--<el-form-item label="物料" prop="materialConfigId">-->
        <!--<el-input v-model="formData.materialConfigId" placeholder="请输入物料类型ID" @click="openForm('create')" readonly/>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="物料编号" prop="materialNumber">
            <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" @click="openForm('create')" readonly/>
          </el-form-item>
        </el-col>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="物料类码" prop="materialCode">-->
<!--            <el-input v-model="formData.materialCode" placeholder="请输入物料类码" disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="8">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="formData.materialName" placeholder="请输入物料名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料类型" prop="materialTypeName">
            <el-input v-model="formData.materialTypeName" placeholder="" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
<!--        <el-col :span="8">-->
<!--          <el-form-item label="物料属性" prop="materialProperty">-->
<!--            <el-select v-model="formData.materialProperty" placeholder="请选择" disabled>-->
<!--              <el-option-->
<!--                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES)"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--              />-->
<!--            </el-select>-->
<!--            &lt;!&ndash;<el-input v-model="formData.materialProperty" placeholder="请输入物料属性（成品、毛坯、辅助材料）" />&ndash;&gt;-->
<!--          </el-form-item>-->
<!--        </el-col>-->

        <el-col :span="8">
          <el-form-item label="物料规格" prop="materialSpecification">
            <el-input v-model="formData.materialSpecification" placeholder="" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料单位" prop="materialUnit">
            <el-input v-model="formData.materialUnit" placeholder="" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="工艺" prop="technologyName">
            <el-input v-model="formData.technologyName" placeholder="请选择工艺" @click="openProcessForm('create')" readonly>
              <template #suffix>
                <Icon
                  v-show="formData.technologyName"
                  class="del-icon"
                  icon="ep:circle-close"
                  style="cursor: pointer;"
                  @click="formData.technologyName=undefined; formData.technologyId=undefined; formData.processId=undefined; procedureValue=[];"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序" prop="processId">
            <el-select
                    v-model="formData.processId"
                    clearable
                    filterable
                    placeholder="请选择工序"
                    class="!w-1/1"
                    @change="changeProcess"
            >
              <el-option
                      v-for="item in procedureValue"
                      :key="item.id"
                      :label="item.procedureName + '('+item.procedureNum +')'"
                      :value="item.id"
              />
            </el-select>
            <!--<el-input v-model="formData.processId" placeholder="请输入工序ID"/>-->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检验方案检测项目详情" name="inspectionSchemeItem">
        <InspectionSchemeItemForm ref="inspectionSchemeItemFormRef" :inspection-scheme-id="formData.id" :samplingLimitType="formData.samplingLimitType"/>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>


    <MaterialConfigChooseList ref="materialConfigChooseListRef" @getMaterialConfig="getMaterialConfig"/>
    <ProcessChooseList ref="processChooseListRef" @getProcess="getProcess"/>
    <SamplingRuleChoose ref="samplingRuleRef" @getSamplingRule="getSamplingRule" />

  </Dialog>
</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {InspectionSchemeApi, InspectionSchemeVO} from '@/api/qms/inspectionscheme'
  import InspectionSchemeItemForm from './components/InspectionSchemeItemForm.vue'
  import MaterialConfigChooseList from './components/MaterialConfigChooseList.vue'
  import ProcessChooseList from './components/ProcessChooseList.vue'
  import SamplingRuleChoose from './components/SamplingRuleChoose.vue'
  import {SamplingStandardApi} from '@/api/qms/samplingstandard'
  import {defaultProps, handleTree} from "@/utils/tree";

  /** 检验方案 表单 */
  defineOptions({name: 'InspectionSchemeForm'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    schemeName: undefined,
    schemeNo: undefined,
    schemeType: undefined,
    materialConfigId: undefined,
    inspectionLevel: 1,
    inspectionLevelType: 5,
    inspectionSheetType: 2,
    isEffective: undefined,
    materialNumber: undefined,
    // materialCode: undefined,
    materialName: undefined,
    // materialProperty: undefined,
    materialType: undefined,
    materialTypeName: undefined,
    materialSpecification: undefined,
    // materialBrand: undefined,
    materialUnit: undefined,
    technologyId: undefined,
    processId: undefined,
    samplingLimitType: 1,
    samplingRuleType: 1,
    acceptanceQualityLimit: 1,
    samplingStandardId: '1807613792217788417',
    isInspect: undefined,
  })
  const formRules = reactive({
    schemeName: [{required: true, message: '方案名称不能为空', trigger: 'blur'}],
    schemeNo: [{required: true, message: '方案编号不能为空', trigger: 'blur'}],
    schemeType: [{required: true, message: '方案类型 来料检验  过程检验 完工检验不能为空', trigger: 'change'}],
    materialConfigId: [{required: true, message: '物料类型不能为空', trigger: 'blur'}],
    inspectionLevel: [{required: true, message: '检验级别不能为空', trigger: 'blur'}],
    isEffective: [{required: true, message: '是否生效不能为空', trigger: 'blur'}],
    materialNumber: [{required: true, message: '物料类型不能为空', trigger: 'change'}],
    samplingStandardId: [{required: true, message: '抽样规则不能为空', trigger: 'change'}],
    samplingLimitType: [{required: true, message: '抽样准则不能为空', trigger: 'change'}],
    inspectionSheetType: [{required: true, message: '检验类型不能为空', trigger: 'change'}],
    inspectionLevelType: [{required: true, message: '抽样水平不能为空', trigger: 'change'}],
    samplingRuleType: [{required: true, message: '抽样标准不能为空', trigger: 'change'}],
  })
  const formRef = ref() // 表单 Ref
  const standardList = ref < Tree[] > ([]) // 树形结构
  /** 子表的表单 */
  const subTabsName = ref('inspectionSchemeItem')
  const inspectionSchemeItemFormRef = ref()

  const procedureValue = ref();
  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number
  ) =>
  {
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    procedureValue.value = undefined;
    resetForm()
    getTree()
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await InspectionSchemeApi.getInspectionScheme(id)
        // 工艺ID不为空 获取工序集合
        if(formData.value.technologyId){
          procedureValue.value = await InspectionSchemeApi.getProcedure(formData.value.technologyId)
        }
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗

  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
      await inspectionSchemeItemFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'inspectionSchemeItem'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as InspectionSchemeVO
      // 拼接子表的数据

      if (formType.value === 'create') {
        data.inspectionSchemeItems = inspectionSchemeItemFormRef.value.getData()
        await InspectionSchemeApi.createInspectionScheme(data)
        message.success(t('common.createSuccess'))
      } else {
        data.inspectionSchemeItems = inspectionSchemeItemFormRef.value.getData()
        await InspectionSchemeApi.updateInspectionScheme(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }

  /** 打开弹窗 */
  const materialConfigChooseListRef = ref()
  const openForm = (type, row, confirmStatus) => {
    materialConfigChooseListRef.value.open(type)
  }

  /** 打开弹窗 */
  const samplingRuleRef = ref()
  const openFormRule = (type, row, confirmStatus) => {
    samplingRuleRef.value.open(type)
  }

  const getTree = async () => {
    const res = await SamplingStandardApi.getSamplingStandardList()

    standardList.value = []
    standardList.value.push(...handleTree(res))
  }

  const processChooseListRef = ref()
  const openProcessForm = (type, row, confirmStatus) => {
      processChooseListRef.value.open(type)
  }


  /***
   * 获取产品物码
   * */
  const getMaterialConfig = async (materialConfig) => {
    // 选中产品
    formData.value.materialConfigId = materialConfig.id
    formData.value.materialName = materialConfig.materialName
    formData.value.materialNumber = materialConfig.materialNumber
    formData.value.materialTypeName = materialConfig.materialTypeName
    formData.value.materialSpecification = materialConfig.materialSpecification
    formData.value.materialUnit = materialConfig.materialUnit
  }

  const getSamplingRule = async (samplingRule) => {

    formData.value.samplingRuleId = samplingRule.id
    formData.value.samplingNo = samplingRule.samplingNo
  }



  const getProcess= async (process) => {
      procedureValue.value = undefined;
      formData.value.technologyId = process.processVersionId
      formData.value.technologyName = process.processName +'('+ process.processCode+')'


      procedureValue.value = await
          InspectionSchemeApi.getProcedure(process.processVersionId)


  }

  // 获取选中工序是否专检
  const changeProcess = (processsId) => {
    const processList = procedureValue.value.filter((item) => item.id === processsId)
    if(processList.length>0) {
      formData.value.isInspect = processList[0].isInspect
    }
  }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      schemeName: undefined,
      schemeNo: undefined,
      schemeType: undefined,
      materialConfigId: undefined,
      inspectionLevel: 1,
      inspectionLevelType: 5,
      inspectionSheetType: 2,
      isEffective: undefined,
      materialNumber: undefined,
      materialCode: undefined,
      materialName: undefined,
      materialProperty: undefined,
      materialType: undefined,
      materialTypeName: undefined,
      materialSpecification: undefined,
      materialBrand: undefined,
      materialUnit: undefined,
      technologyId: undefined,
      processId: undefined,
      samplingLimitType: 1,
      samplingRuleType: 1,
      acceptanceQualityLimit: 1,
      samplingStandardId: '1807613792217788417',
      isInspect: undefined,
    }
    formRef.value?.resetFields()
  }
</script>
