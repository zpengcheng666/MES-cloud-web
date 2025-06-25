<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200" >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      v-loading="formLoading"
      :border="true"
    >
      <el-row :gutter="24" >
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
          <el-form-item label="质检状态" prop="status"  border>
            <el-select v-model="formData.status" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_SHEET_SCHEME_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
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
      </el-row>

      <el-row :gutter="20" >

        <el-col :span="8"  >
          <el-form-item label="方案类型" prop="schemeType" border>
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

        <el-col :span="8" v-if="formData.schemeType == 2 || formData.schemeType == 3 " >
          <el-form-item label="是否自检" prop="selfInspection" border>
            <el-select v-model="formData.selfInspection" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SELF_INSPECTION)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" v-if="formData.schemeType == 2 || formData.schemeType == 3 ">
          <el-form-item label="是否首检" prop="needFirstInspection" border>
            <el-select v-model="formData.needFirstInspection" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_NEED_FIRST_INSPECTION)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" v-if="formData.schemeType == 2 || formData.schemeType == 3 ">
          <el-form-item label="工艺" prop="procedureName">
            <el-input v-model="formData.procedureName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.schemeType == 2 || formData.schemeType == 3 ">
          <el-form-item label="工序" prop="processName" border>
            <el-input v-model="formData.processName" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
        <el-col :span="8" v-if="formData.assignmentType == 2">
          <el-form-item label="检验班组" prop="assignmentTeamName">
            <el-input v-model="formData.assignmentTeamName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验人员" prop="assignmentName">
            <el-input v-model="formData.assignmentName" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8"  >
          <el-form-item label="分配日期" prop="assignmentDate" border>
            <el-date-picker
              el-date-picker
              v-model="formData.assignmentDate"
              clearable
              type="datetime"
              value-format="x"
              style="width:100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>




      <el-row :gutter="20" >
        <el-col :span="8">
          <el-form-item label="计划检验时间" prop="planTime">
            <el-date-picker
              v-model="formData.planTime"
              clearable
              type="datetime"
              value-format="x"
              style="width:100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8"  >
          <el-form-item label="实际开始时间" prop="beginTime" border>
            <el-date-picker
              v-model="formData.beginTime"
              clearable
              type="datetime"
              value-format="x"
              style="width:100%"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8"  >
          <el-form-item label="实际结束时间" prop="endTime" border>
            <el-date-picker
              v-model="formData.endTime"
              clearable
              type="datetime"
              value-format="x"
              style="width:100%"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="8">
          <el-form-item label="检测数量" prop="inspectionQuantity">
            <el-input v-model="formData.inspectionQuantity" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8"  >
          <el-form-item label="实际检测数量" prop="quantity" border>
            <el-input v-model="formData.quantity" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8"  >
          <el-form-item label="合格数量" prop="qualifiedQuantity" border>
            <el-input v-model="formData.qualifiedQuantity" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检测单产品" name="inspectionSchemeItem">
        <InspectionSheetSchemeInfoList ref="inspectionSheetRecordFormRef" :inspection-sheet-scheme-id="inspectionSheetSchemeId" :formType="formType" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
<!--      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>-->
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>

  </Dialog>
</template>
<script setup lang="ts">
import {InspectionResultVO, InspectionSheetApi } from '@/api/qms/inspectionsheet'
  import InspectionSheetSchemeInfoList from './InspectionSheetSchemeMaterialList.vue'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

  /** 检验方案 表单 */
  defineOptions({name: 'InspectionSheetSchemeInfo'})

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
    status: undefined,
    planTime: undefined,
    beginTime: undefined,
    endTime: undefined,
    schemeType: undefined,
    selfInspection: undefined,
    needFirstInspection: undefined,
    procedureName: undefined,
    processName: undefined,
    assignmentType: undefined,
    assignmentTeamName: undefined,
    assignmentName: undefined,
    materialNumber: undefined,
    materialName: undefined,
    assignmentDate: undefined,
    passRule: undefined,
    inspectionResult: undefined,
    inspectionQuantity: undefined,
    quantity: undefined,
    qualifiedQuantity: undefined
  })

  const formRules = reactive({
    qualifiedQuantity: [{ required: true, message: '合格数量不能为空', trigger: 'blur' }],
    passRule: [{ required: true, message: '通过准则不能为空', trigger: 'blur' }],
    inspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  })

  const formRef = ref() // 表单 Ref

  const inspectionSheetId = ref()
  const inspectionSheetSchemeId = ref()

  /** 子表的表单 */
  const subTabsName = ref('inspectionSchemeItem')
  /** 打开弹窗 */
  const open = async (type: string, sheetId? : string, schemeId? : string) =>
  {
    subTabsName.value='inspectionSchemeItem'
    dialogVisible.value = true
    dialogTitle.value = '检验单详情'
    formType.value = type
    resetForm()
    inspectionSheetId.value = sheetId
    inspectionSheetSchemeId.value = schemeId;
    if (schemeId) {
      formLoading.value = true
      try {
        formData.value = await InspectionSheetApi.getInspectionSheetInfoBySchemeId(schemeId)
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


  const inspectionSheetRecordFormRef = ref()
  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 提交请求
    formLoading.value = true
    try {
      const data = {
        sheetId: inspectionSheetId.value,
        sheetSchemeId: inspectionSheetSchemeId.value,
        inspectionResult: formData.value.inspectionResult,
        passRule: formData.value.passRule,
        qualifiedQuantity: formData.value.qualifiedQuantity
      } as unknown as InspectionResultVO

      await InspectionSheetApi.updateInspectionSheetSchemeResult(data)
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
      status: undefined,
      planTime: undefined,
      beginTime: undefined,
      endTime: undefined,
      schemeType: undefined,
      selfInspection: undefined,
      needFirstInspection: undefined,
      procedureName: undefined,
      processName: undefined,
      assignmentType: undefined,
      assignmentTeamName: undefined,
      assignmentName: undefined,
      materialNumber: undefined,
      materialName: undefined,
      content: undefined,
      inspectionResult: undefined,
      inspectionQuantity: undefined,
      quantity: undefined,
      qualifiedQuantity: undefined

    }
    formRef.value?.resetFields()
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

