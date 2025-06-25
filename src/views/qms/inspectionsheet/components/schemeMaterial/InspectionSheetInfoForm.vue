<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      v-loading="formLoading"
      :border="true"
    >
      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="检验单名称" prop="sheetName" border>
            <el-input v-model="formData.sheetName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验单编号" prop="sheetNo" >
            <el-input v-model="formData.sheetNo" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产单号" prop="recordNumber" >
            <el-input v-model="formData.recordNumber" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="方案类型" prop="schemeType"  border>
            <el-select v-model="formData.schemeType" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" v-if="formData.schemeType == '2' || formData.schemeType == '3'" >
          <el-form-item label="工艺" prop="technologyName"  border>
            <el-input v-model="formData.technologyName" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8" v-if="formData.schemeType == '2' || formData.schemeType == '3'">
          <el-form-item label="工序" prop="processName">
            <el-input v-model="formData.processName" disabled/>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20" >
        <el-col :span="8">
          <el-form-item label="分配类型" prop="assignmentType">
            <el-select v-model="formData.assignmentType" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_ASSIGNMENT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验人员" prop="assignmentName">
            <el-input v-model="formData.assignmentName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8"  >
          <el-form-item label="分配日期" prop="assignmentDate"  border>
            <el-date-picker
              el-date-picker
              v-model="formData.assignmentDate"
              clearable
              type="datetime"
              value-format="x"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="物料编号" prop="materialNumber"  border>
            <el-input v-model="formData.materialNumber" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="formData.materialName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料类型" prop="materialTypeName">
            <el-input v-model="formData.materialTypeName" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="8">
          <el-form-item label="物料规格" prop="materialSpecification">
            <el-input v-model="formData.materialSpecification" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="物料单位" prop="materialUnit">
            <el-input v-model="formData.materialUnit" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检测项目详情" name="inspectionSchemeRecord">
        <InspectionSheetRecordList ref="inspectionSheetRecordFormRef" :inspection-sheet-scheme-material-id="sheetSchemeMaterialId" :form-type="formType" :self-inspection="formData.selfInspection" :self-sheet-scheme-status="formData.selfAssignmentStatus"/>
      </el-tab-pane>
    </el-tabs>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      style="margin-top: 25px;"
    >
      <el-row :gutter="20" >
        <el-col :span="8">
          <el-form-item label="物料条码" prop="barCode">
            <el-input v-model="formData.barCode" placeholder="请选择产品"  @click="openStockForm" :disabled="formType=='detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="检验结果" prop="inspectionResult">
            <el-radio-group v-model="formData.inspectionResult" :disabled="formType=='detail'" >
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="16"  >
          <el-form-item label="测量结果" prop="content">
            <el-input type="textarea" v-model="formData.content" placeholder="请输入测量结果" :disabled="formType=='detail'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="submitForm('save')" type="primary" :disabled="formLoading" v-if="formType!='detail' && formData.schemeStatus != 3">保 存</el-button>
      <el-button @click="submitForm('submit')" type="primary" :disabled="formLoading" v-if="formType!='detail' && formData.schemeStatus != 3">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>

  </Dialog>

  <MaterialStockForm ref="materialStockRef" :material="material" @get-material="getMaterial" />
</template>
<script setup lang="ts">
import {InspectionResultVO, InspectionSheetApi } from '@/api/qms/inspectionsheet'
import InspectionSheetRecordList from '../schemeRecord/InspectionSheetRecordInfoList.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import MaterialStockForm from './MaterialStockForm.vue'
import UnqualifiedRegistrationListForm from "../sheetScheme/UnqualifiedRegistrationListForm.vue";

  /** 检验方案 表单 */
  defineOptions({name: 'InspectionSheetInfo'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    sheetName: undefined,
    sheetNo: undefined,
    header: undefined,
    recordNumber: undefined,
    beginTime: undefined,
    endTime: undefined,
    schemeType: undefined,
    inspectionSheetType: undefined,
    assignmentType: undefined,
    assignmentName: undefined,
    assignmentDate: undefined,
    materialConfigId: undefined,
    materialNumber: undefined,
    materialName: undefined,
    materialType: undefined,
    materialTypeName: undefined,
    materialSpecification: undefined,
    materialUnit: undefined,
    technologyId: undefined,
    processId: undefined,
    technologyName: undefined,
    processName: undefined,
    materialId: undefined,
    barCode: undefined,
    inspectionResult: undefined,
    content: undefined,
    schemeStatus: undefined,

  })
  const formRules = reactive({
    barCode: [{ required: true, message: '产品不能为空', trigger: 'change' }],
    inspectionResult: [{ required: true, message: '检验结果不能为空', trigger: 'change' }],
    content: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  })
  const formRef = ref() // 表单 Ref
  const unqualifiedFormRef = ref()

  const sheetSchemeId = ref()
  const sheetSchemeMaterialId = ref()

  /** 子表的表单 */
  const subTabsName = ref('inspectionSchemeRecord')
  /** 打开弹窗 */
  const open = async (type: string, schemeId? : string, materialId? : string) =>
  {
    subTabsName.value='inspectionSchemeRecord'
    dialogVisible.value = true
    dialogTitle.value = '检验单详情'
    formType.value = type
    resetForm()
    sheetSchemeId.value = schemeId;
    sheetSchemeMaterialId.value = materialId;
    if (schemeId) {
      formLoading.value = true
      try {
        const params = {
          sheetSchemeId : schemeId,
          sheetSchemeMaterialId: materialId
        }
        formData.value = await InspectionSheetApi.getInspectionSheetInfo(params)

      } finally {
        formLoading.value = false
        if(formData.value.materialId == null){
          formData.value.materialId = undefined
        }
        if(formData.value.barCode == null){
          formData.value.barCode = undefined
        }
        if(formData.value.inspectionResult == null){
          formData.value.inspectionResult = undefined
        }
        if(formData.value.content == null){
          formData.value.content = undefined
        }
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


  const inspectionSheetRecordFormRef = ref()
  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async (type: string) => {
    if(type === 'submit'){
      // 校验表单
      await formRef.value.validate()
      // 校验子表单
      try {
        await inspectionSheetRecordFormRef.value.validate()
      } catch (e) {
        return
      }
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = {
        sheetId: formData.value.id,
        materialId: formData.value.materialId,
        barCode: formData.value.barCode,
        inspectionResult: formData.value.inspectionResult,
        content: formData.value.content,
        sheetSchemeId: sheetSchemeId.value,
        sheetSchemeMaterialId: sheetSchemeMaterialId.value,
        records: inspectionSheetRecordFormRef.value.getData()
      } as unknown as InspectionResultVO

      // 自检任务
      if(formData.value.selfInspection == '1'){
        // 当前状态是互检
        if(formData.value.selfAssignmentStatus == 1) {
          data.records = data.records.map(r => ({id: r.id, inspectionResult: r.mutualInspectionResult, content: r.mutualContent}))
        }
        // 当前状态是专检
        else if(formData.value.selfAssignmentStatus == 3) {
          data.records = data.records.map(r => ({id: r.id, inspectionResult: r.specInspectionResult, content: r.specContent}))
        }
      }

      if(type === 'submit'){
        await InspectionSheetApi.updateInspectionSheetRecord(data)
      }
      else {
        await InspectionSheetApi.updateInspectionSheetRecordTemp(data)
      }
      message.success(t('common.createSuccess'))
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }


//保存并提交审核
const submitFormAndAudit = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await inspectionSheetRecordFormRef.value.validate()
    await unqualifiedFormRef.value.validate()
  } catch (e) {
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      sheetId: formData.value.id,
      materialId: formData.value.materialId,
      barCode: formData.value.barCode,
      inspectionResult: formData.value.inspectionResult,
      content: formData.value.content,
      sheetSchemeId: sheetSchemeId.value,
      sheetSchemeMaterialId: sheetSchemeMaterialId.value,
      records: inspectionSheetRecordFormRef.value.getData(),
      registrations: unqualifiedFormRef.value.getData()
    }

    await InspectionSheetApi.updateAndAuditInspectionSheetRecord(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      sheetName: undefined,
      sheetNo: undefined,
      header: undefined,
      recordNumber: undefined,
      beginTime: undefined,
      endTime: undefined,
      schemeType: undefined,
      inspectionSheetType: undefined,
      assignmentType: undefined,
      assignmentName: undefined,
      assignmentDate: undefined,
      materialConfigId: undefined,
      materialNumber: undefined,
      materialName: undefined,
      materialType: undefined,
      materialTypeName: undefined,
      materialSpecification: undefined,
      materialUnit: undefined,
      technologyId: undefined,
      processId: undefined,
      technologyName: undefined,
      processName: undefined,
      materialId: undefined,
      barCode: undefined,
      inspectionResult: undefined,
      content: undefined,
      schemeStatus: undefined,

    }
    formRef.value?.resetFields()
  }

/** 选择产品 */
const material = ref()
const materialStockRef = ref()
const openStockForm = () => {
  materialStockRef.value.open(formData.value.materialConfigId, formData.value.barCode)
}

const getMaterial = (selectMaterial) => {
  material.value = selectMaterial
  formData.value.materialId = selectMaterial.id
  formData.value.barCode = selectMaterial.barCode
}
</script>


<style lang="scss" scoped>

  .form-scheme {
    padding-left: 0px !important;
    padding-right: 0px !important;
    text-align: center !important;
  }
  .el-card{
    --el-card-padding : 10px  !important;
  }

</style>

