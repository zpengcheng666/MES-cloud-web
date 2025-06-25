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
          <el-form-item label="分配日期" prop="assignmentDate" border>
            <el-date-picker
              el-date-picker
              v-model="formData.assignmentDate"
              clearable
              type="datetime"
              value-format="x"
              style="width: 100%;"
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
          <el-form-item label="物料类型" prop="materialType">
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

      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="检测数量" prop="quantity" >
            <el-input v-model="formData.quantity" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不合格数量" prop="qualifiedQuantity">
            <el-input v-model="formData.unQualifiedQuantity" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="不合格品登记" name="unqualifiedItem">
        <UnqualifiedRegistrationListForm ref="unqualifiedFormRef" :sheet-scheme-id="inspectionSheetSchemeId" />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="submitFormAndAudit()" type="primary" :disabled="formLoading" >确定并提交审核</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>

  </Dialog>
</template>
<script setup lang="ts">
  import UnqualifiedRegistrationListForm from './UnqualifiedRegistrationListForm.vue'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
  import { UnqualifiedRegistrationApi } from '@/api/qms/unqualifiedregistration'

  /** 检验方案 表单 */
  defineOptions({name: 'InspectionSheetSchemeInfo'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({})

  const formRules = reactive({
  })

  const formRef = ref() // 表单 Ref

  const inspectionSheetId = ref()
  const inspectionSheetSchemeId = ref()

  /** 子表的表单 */
  const subTabsName = ref('unqualifiedItem')
  /** 打开弹窗 */
  const open = async (type: string, sheetId? : string, schemeId? : string) =>
  {
    subTabsName.value='unqualifiedItem'
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
        // 计算不合格数量
        formData.value.unQualifiedQuantity = formData.value.quantity - formData.value.qualifiedQuantity
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


  const unqualifiedFormRef = ref()
  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验子表单
    try {
      await unqualifiedFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'unqualifiedItem'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = {
        inspectionSheetSchemeId: inspectionSheetSchemeId.value,
        registrations: unqualifiedFormRef.value.getData()
      }
      await UnqualifiedRegistrationApi.saveUnqualifiedRegistrationBatch(data)
      message.success(t('common.createSuccess'))
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }

  const submitFormAndAudit = async () => {
    // 校验子表单
    try {
      await unqualifiedFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'unqualifiedItem'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = {
        inspectionSheetSchemeId: inspectionSheetSchemeId.value,
        registrations: unqualifiedFormRef.value.getData()
      }
      await UnqualifiedRegistrationApi.saveAndAuditUnqualifiedRegistrationBatch(data)
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
    formData.value = {}
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

