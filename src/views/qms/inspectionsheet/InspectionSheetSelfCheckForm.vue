<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品" prop="materialConfigId">
            <el-input v-model="formData.materialName" placeholder="请选择库存" @click="openForm()" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料条码" prop="barCode">
            <el-input v-model="formData.barCode" placeholder="请输入物料条码" @blur="getInspectionSchemeList" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料批次号" prop="batchNumber">
            <el-input v-model="formData.batchNumber" placeholder="请填写物料批次号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产单号" prop="recordNumber">
            <el-input v-model="formData.recordNumber" placeholder="请填写生产单号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="工艺" prop="technologyName">
            <el-input v-model="formData.technologyName" placeholder="请选择工艺" @click="openProcessForm('create')" readonly>
              <template #suffix>
                <Icon
                  v-show="formData.technologyName"
                  class="del-icon"
                  icon="ep:circle-close"
                  style="cursor: pointer;"
                  @click="formData.technologyName=undefined; formData.technologyId=undefined; formData.processId=undefined; procedureValue=[];formData.schemeId=undefined;inspectionSchemeList=[];"
                />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工序" prop="processId" >
            <el-select
              v-model="formData.processId"
              clearable
              filterable
              placeholder="请选择工序"
              class="!w-1/1"
              @change="getInspectionSchemeList"
            >
              <el-option
                v-for="item in procedureValue"
                :key="item.id"
                :label="item.procedureName + '('+item.procedureNum +')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="检验方案" prop="schemeId">
            <el-select
              v-model="formData.schemeId"
              placeholder="请选择检验方案"
              clearable
            >
              <el-option
                v-for="dict in inspectionSchemeList"
                :key="dict.id"
                :label="dict.schemeName"
                :value="dict.id"
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

  <!-- 表单弹窗：添加/修改 -->
<!--  <MaterialconfigForm ref="configRef" @getMaterialConfig="getMaterialConfig"/>-->
  <MaterialStockForm ref="materialStockRef" :material="material" @get-material="getMaterial" />
  <ProcessChooseList ref="processChooseListRef" @getProcess="getProcess"/>

</template>
<script setup lang="ts">
import { InspectionSheetApi, InspectionSheetVO } from '@/api/qms/inspectionsheet'
import {InspectionSchemeApi} from "@/api/qms/inspectionscheme";
import MaterialStockForm from "@/views/qms/inspectionsheet/components/schemeMaterial/MaterialStockForm.vue";
import ProcessChooseList from "@/views/qms/inspectionscheme/components/ProcessChooseList.vue";

/** 检验单 表单 */
defineOptions({ name: 'InspectionSheetForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref({
  barCode: undefined,
  technologyId: undefined,
  technologyName: undefined,
  processId: undefined,
  materialId: undefined,
  materialName: undefined,
  materialConfigId: undefined,
  recordNumber: undefined,
  batchNumber: undefined,
  schemeId: undefined,
  schemeType: 2,
  sourceType: 7
})
const formRules = reactive({
  processId: [{ required: true, message: '工序ID不能为空', trigger: 'blur' }],
  barCode: [{ required: true, message: '物料条码不能为空', trigger: 'change' }],
  recordNumber: [{ required: true, message: '生产单号不能为空', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'change' }],
  schemeId: [{ required: true, message: '检验方案不能为空', trigger: 'change' }],
  materialConfigId: [{ required: true, message: '物料类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
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
    const data = formData.value as unknown as InspectionSheetVO
    await InspectionSheetApi.createInspectionSheetSelfCheck(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {``
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    barCode: undefined,
    technologyId: undefined,
    technologyName: undefined,
    processId: undefined,
    materialId: undefined,
    materialName: undefined,
    materialConfigId: undefined,
    recordNumber: undefined,
    batchNumber: undefined,
    schemeId: undefined,
    schemeType: 2,
    sourceType: 7
  }
  formRef.value?.resetFields()
}

// 检验方案集合
const inspectionSchemeList = ref([])

/** 选择产品 */
const material = ref()
const materialStockRef = ref()
const openForm = () => {
  materialStockRef.value.open(formData.value.materialConfigId, formData.value.barCode)
}

const getMaterial = (selectMaterial) => {
  material.value = selectMaterial
  formData.value.materialConfigId = selectMaterial.materialConfigId
  formData.value.materialId = selectMaterial.id
  formData.value.materialName = selectMaterial.materialNumber
  formData.value.barCode = selectMaterial.barCode
  formData.value.batchNumber = selectMaterial.batchNumber

  getInspectionSchemeList()
}

/**
 * 方案id和物料类型id获取检验方案集合
 */
const getInspectionSchemeList =async()=> {
  // 方案类型为空 或 物料类型为空
  if(!formData.value.processId){
    inspectionSchemeList.value = []
    return
  }
  const params = {
    schemeType: 2,
    technologyId: formData.value.technologyId,
    // barCode: formData.value.barCode,
    processId: formData.value.processId
  }
  // 修改检验
  inspectionSchemeList.value = await InspectionSchemeApi.getInspectionSchemeList4InspectionSheet(params)
}

const processChooseListRef = ref()
const openProcessForm = (type) => {
  processChooseListRef.value.open(type)
}

const procedureValue = ref();
const getProcess= async (process) => {
  procedureValue.value = undefined;
  formData.value.technologyId = process.processVersionId
  formData.value.technologyName = process.processName +'('+ process.processCode+')'
  procedureValue.value = await InspectionSchemeApi.getProcedure(process.processVersionId)
}
</script>
