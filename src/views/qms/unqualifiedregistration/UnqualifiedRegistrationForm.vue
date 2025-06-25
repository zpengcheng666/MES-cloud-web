<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="检验任务" prop="inspection_sheet_scheme_id" border>
            <el-input v-model="formData.sheetName" disabled/>
          </el-form-item>
        </el-col>
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
          <el-form-item label="负责人" prop="header" >
            <el-input v-model="formData.header" disabled/>
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
        <el-col :span="8">
          <el-form-item label="检验类型" prop="inspectionSheetType">
            <el-select v-model="formData.inspectionSheetType" disabled>
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
      </el-row>
      <el-row :gutter="20" >
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
          <el-form-item label="物料类码" prop="materialCode">
            <el-input v-model="formData.materialCode" disabled/>
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
          <el-form-item label="物料属性" prop="materialProperty"  border>
            <el-select v-model="formData.materialProperty" placeholder="请选择" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料类型" prop="materialType">
            <el-select v-model="formData.materialType" placeholder="" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料规格" prop="materialSpecification">
            <el-input v-model="formData.materialSpecification" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="物料品牌" prop="materialBrand"  border>
            <el-input v-model="formData.materialBrand" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料单位" prop="materialUnit">
            <el-input v-model="formData.materialUnit" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.inspectionSheetType == '2'">
        <el-col :span="8"  >
          <el-form-item label="工艺" prop="technologyId"  border>
            <el-input v-model="formData.technologyId" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序" prop="processId">
            <el-input v-model="formData.processId" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="缺陷描述" prop="content">
        <el-input type="textarea" v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="缺陷代码" prop="defectiveCode">
        <el-input v-model="formData.defectiveCode" placeholder="请输入缺陷代码" />
      </el-form-item>
      <el-form-item label="缺陷数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入缺陷数量" />
      </el-form-item>
      <el-form-item label="检验单方案任务ID" prop="inspectionSheetSchemeId">
        <el-input v-model="formData.inspectionSheetSchemeId" placeholder="请输入检验单方案任务ID" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { UnqualifiedRegistrationApi, UnqualifiedRegistrationVO } from '@/api/qms/unqualifiedregistration'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 不合格品登记 表单 */
defineOptions({ name: 'UnqualifiedRegistrationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  content: undefined,
  defectiveCode: undefined,
  quantity: undefined,
  inspectionSheetSchemeId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await UnqualifiedRegistrationApi.getUnqualifiedRegistration(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as UnqualifiedRegistrationVO
    if (formType.value === 'create') {
      await UnqualifiedRegistrationApi.createUnqualifiedRegistration(data)
      message.success(t('common.createSuccess'))
    } else {
      await UnqualifiedRegistrationApi.updateUnqualifiedRegistration(data)
      message.success(t('common.updateSuccess'))
    }
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
    content: undefined,
    defectiveCode: undefined,
    quantity: undefined,
    inspectionSheetSchemeId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
