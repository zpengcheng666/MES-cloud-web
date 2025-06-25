<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检测工具名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入检测工具名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格" prop="spec">
            <el-input v-model="formData.spec" placeholder="请输入规格"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="测量范围" prop="measuringRange">
            <el-input v-model="formData.measuringRange" placeholder="请输入测量范围"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="准确等级" prop="accuracyLevel">
            <el-input v-model="formData.accuracyLevel" placeholder="请输入准确等级"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="制造商" prop="manufacturer">
            <el-input v-model="formData.manufacturer" placeholder="请输入制造商" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="manufacturerNumber">
            <el-input v-model="formData.manufacturerNumber" placeholder="请输入出厂编号"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料条码" prop="barCode">
            <el-input v-model="formData.barCode" placeholder="请选择产品"  @click="openStockForm" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检/校定周期" prop="verificationCycle">
            <el-input-number v-model="formData.verificationCycle" placeholder="请输入检/校定周期" class="!w-1/1" :precision="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12" v-if="formType=='update'">
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择状态" class="w-1/1">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_TOOL_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <MaterialStockForm ref="materialStockRef" :material="material" @get-material="getMaterial" />

</template>
<script setup lang="ts">
import { InspectionToolApi, InspectionToolVO } from '@/api/qms/inspectiontool'
import MaterialStockForm from './MaterialStockForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";


/** 检测工具 表单 */
defineOptions({ name: 'InspectionToolForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  barCode: undefined,
  name: undefined,
  spec: undefined,
  measuringRange: undefined,
  accuracyLevel: undefined,
  manufacturer: undefined,
  manufacturerNumber: undefined,
  verificationDate: undefined,
  verificationCycle: undefined,
  stockId: undefined,
  materialConfigId: undefined,
  status: 1,
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
      formData.value = await InspectionToolApi.getInspectionTool(id)
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
    const data = formData.value as unknown as InspectionToolVO
    if (formType.value === 'create') {
      await InspectionToolApi.createInspectionTool(data)
      message.success(t('common.createSuccess'))
    } else {
      await InspectionToolApi.updateInspectionTool(data)
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
    barCode: undefined,
    name: undefined,
    spec: undefined,
    measuringRange: undefined,
    accuracyLevel: undefined,
    manufacturer: undefined,
    manufacturerNumber: undefined,
    verificationDate: undefined,
    verificationCycle: undefined,
    stockId: undefined,
    materialConfigId: undefined,
    status: 1,
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
  formData.value.stockId = selectMaterial.id
  formData.value.barCode = selectMaterial.barCode
  formData.value.materialConfigId = selectMaterial.materialConfigId
}

</script>
