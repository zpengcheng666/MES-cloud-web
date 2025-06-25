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
          <el-form-item label="物料类型" prop="materialConfigId">
            <el-input v-model="formData.materialConfigName" placeholder="请选择物料类型" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品数量" prop="quantity">
            <el-input-number
              v-model="formData.quantity"
              placeholder="请输入产品数量"
              :min="0"
              :precision="0"
              class="!w-1/1"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料批次号" prop="batchNumber">
            <el-input v-model="formData.batchNumber" placeholder="请填写物料批次号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产单号" prop="recordNumber">
            <el-input v-model="formData.recordNumber" placeholder="请填写生产单号" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="方案类型" prop="schemeType" >
            <el-select
              v-model="formData.schemeType"
              placeholder="请选择方案类型"
              clearable
              @change="onChangeSchemeType"
              disabled
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_SCHEME_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
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

  <ProcessChooseList ref="processChooseListRef" @getProcess="getProcess"/>
</template>
<script setup lang="ts">
import { InspectionSheetApi, InspectionSheetVO } from '@/api/qms/inspectionsheet'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import * as UserApi from "@/api/system/user";
import {InspectionSchemeApi} from "@/api/qms/inspectionscheme";
import { InspectionSheetGenerateTaskApi, InspectionSheetGenerateTaskVO } from '@/api/qms/inspectionsheetgeneratetask'
import ProcessChooseList from "@/views/qms/inspectionscheme/components/ProcessChooseList.vue";

/** 检验单 表单 */
defineOptions({ name: 'InspectionSheetForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

const formData = ref({
  id: undefined,
  recordNumber: undefined,
  status: undefined,
  header: undefined,
  materialConfigId: undefined,
  schemeType: undefined,
  technologyId: undefined,
  technologyName: undefined,
  processId: undefined,
  needFirstInspection: undefined,
  quantity: undefined,
  materialConfigName: undefined,
  batchNumber: undefined,
  schemeId: undefined,
  taskId: undefined
})
const formRules = reactive({
  recordNumber: [{ required: true, message: '生产单号不能为空', trigger: 'blur' }],
  header: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '产品数量不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料类型不能为空', trigger: 'change' }],
  schemeType: [{ required: true, message: '方案类型不能为空', trigger: 'change' }],
  processId: [{ required: true, message: '工序不能为空', trigger: 'change' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'change' }],
  schemeId: [{ required: true, message: '检验方案不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('生成检验单')
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await InspectionSheetGenerateTaskApi.getInspectionSheetGenerateTask(id)
      // 获取检验方案
      await getInspectionSchemeList();
    } finally {
      formLoading.value = false
    }
  }
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
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
    await InspectionSheetApi.createInspectionSheetTask(data)
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
    recordNumber: undefined,
    status: undefined,
    header: undefined,
    materialConfigId: undefined,
    needFirstInspection: undefined,
    schemeType: undefined,
    technologyId: undefined,
    technologyName: undefined,
    processId: undefined,
    quantity: undefined,
    materialName: undefined,
    batchNumber: undefined,
    schemeId: undefined
  }
  formRef.value?.resetFields()
}

/** 修改方案类型 */
const onChangeSchemeType = () => {
  // 方案类型修改为来料
  // 清空是否需要首检
  if(formData.value.schemeType == '1' || formData.value.schemeType == '3'){
    formData.value.needFirstInspection = undefined
    formData.value.technologyId = undefined
    formData.value.technologyName = undefined
    formData.value.processId = undefined
    procedureValue.value = []
  }
  // 清空方案集合
  inspectionSchemeList.value = []
  // 修改方案类型 重新获取检验方案
  getInspectionSchemeList()
}

// 检验方案集合
const inspectionSchemeList = ref([])

/**
 * 方案id和物料类型id获取检验方案集合
 */
const getInspectionSchemeList =async()=> {
  // 方案类型为空 或 物料类型为空
  if(!formData.value.schemeType || !formData.value.materialConfigId){
    inspectionSchemeList.value = []
    return
  }

  const params = {
    schemeType: formData.value.schemeType,
    materialConfigId: formData.value.materialConfigId,
    technologyId: formData.value.technologyId,
    processId: formData.value.processId,
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
