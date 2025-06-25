<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" >
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="125px"
    >
      <el-form-item label="项目号" prop="projectCode">
        <el-select :disabled="isEdit" v-model="formData.projectCode" filterable @change="getPartList('1')" clearable placeholder="请选择项目">
          <el-option
            v-for="project in projectList"
            :key="project.projectCode"
            :label="project.projectCode"
            :value="project.projectCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-select :disabled="isEdit" v-model="formData.partNumber" filterable @change="getTechnologyList('1')" clearable placeholder="请选择零件图号" >
          <el-option
            v-for="part in partList"
            :key="part.partNumber"
            :label="part.partNumber"
            :value="part.partNumber"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工艺规程" prop="processVersionId">
        <el-select :disabled="isEdit" v-model="formData.processVersionId" filterable @change="getProcedureList('1')" clearable placeholder="请选择工艺规程" >
          <el-option
            v-for="technology in technologyList"
            :key="technology.processVersionId"
            :label="technology.name"
            :value="technology.processVersionId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="当前工序号" prop="procedureId">
        <el-select :disabled="isEdit" v-model="formData.procedureId" filterable @change="changeProcedure()" clearable placeholder="请选择工序号" >
          <el-option
            v-for="procedure in procedureList"
            :key="procedure.id"
            :label="procedure.procedureNum"
            :value="procedure.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isNext" label="补加工后工序号" prop="procedureNumNext">
        <el-input v-model="formData.procedureNumNext" placeholder="请输入补加工后工序号" disabled />
      </el-form-item>
      <el-form-item label="补加工工艺编号" prop="processCodeSupplement">
        <el-input v-model="formData.processCodeSupplement" placeholder="请输入补加工工艺编号" />
      </el-form-item>
      <el-form-item label="工作说明" prop="description">
        <el-input v-model="formData.description" type="textarea" placeholder="请输入工作说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {ProcessSupplementApi, ProcessSupplementVO} from '@/api/pdm/processSupplement'
import {OrderFormApi} from "@/api/mcs/orderform";
import {ProcessPlanApi} from "@/api/pdm/processPlan";
import {InspectionSchemeApi} from "@/api/qms/inspectionscheme";
defineOptions({ name: 'ProcessSupplementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const projectList = ref<any[]>([]);
const partList = ref<any[]>([]);
const technologyList = ref<any[]>([]);
const procedureList = ref<any[]>([]);
const isNext = ref(true); // 是否显示补加工后工序
const isEdit = ref(false);
const formData = ref({
  id: '',
  projectCode: '',
  partNumber: '',
  processVersionId: '',
  procedureId: '',
  procedureNum: '',
  procedureIdNext: '',
  procedureNumNext: '',
  processCodeSupplement: '',
  description: '',
})
const formRules = reactive({
  projectCode: [{ required: true, message: '项目号不能为空', trigger: 'blur' }],
  partNumber: [{ required: true, message: '零件图号不能为空', trigger: 'blur' }],
  processVersionId: [{ required: true, message: '工艺规程不能为空', trigger: 'blur' }],
  procedureId: [{ required: true, message: '当前工序号不能为空', trigger: 'blur' }],
  procedureNumNext: [{ required: true, message: '补加工后工序号不能为空', trigger: 'blur' }],
  processCodeSupplement: [{ required: true, message: '补加工工艺编号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  isEdit.value = false
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    isEdit.value = true
    try {
      formData.value = await ProcessSupplementApi.getProcessSupplement(id)
    } finally {
      formLoading.value = false
    }
  }
  await getProjectList();
  await getPartList();
  await getTechnologyList();
  await getProcedureList();
  if(type === 'update') {
    if(formData.value.procedureIdNext === '') {
      isNext.value = false;
    } else {
      isNext.value = true
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    projectCode: '',
    partNumber: '',
    processVersionId: '',
    procedureId: '',
    procedureNum: '',
    procedureIdNext: '',
    procedureNumNext: '',
    processCodeSupplement: '',
    description: '',
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProcessSupplementVO
    if (formType.value === 'create') {
      await ProcessSupplementApi.createProcessSupplement(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProcessSupplementApi.updateProcessSupplement(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
/** 项目号列表 */
const getProjectList = async () => {
  projectList.value = await OrderFormApi.getProjectList();
}
/** 零件图号列表 */
const getPartList = async (type) => {
  if(type) {
    formData.value.partNumber = null;
    formData.value.processVersionId = null;
    formData.value.procedureId = null;
  }
  const projectId = projectList.value.find(item => item.projectCode == formData.value.projectCode).id
  partList.value = await OrderFormApi.getPartListByProcessPlanDetailId(projectId);
}
/** 工艺规程列表 */
const getTechnologyList = async (type) => {
  if(type) {
    formData.value.processVersionId = null;
    formData.value.procedureId = null;
  }
  const params = {
    projectCode: formData.value.projectCode,
    partNumber: formData.value.partNumber
  }
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  technologyList.value = list.filter((item)=>{
    return item.type ===2;
  })
}
/** 工序列表 */
const getProcedureList = async (type) => {
  if(type) {
    formData.value.procedureId = null;
  }
  const list = await InspectionSchemeApi.getProcedure(formData.value.processVersionId)
  // 过滤05-来料检验工序
  procedureList.value = list.filter((item)=>{
    return item.procedureNum !=='05'
  })
}
/** 切换当前工序自动计算补加工后工序（排除最后一步工序） */
const changeProcedure = async () => {
  procedureList.value.forEach((item, index)=>{
    if(formData.value.procedureId === item.id) {
      formData.value.procedureNum = item.procedureNum
      if(procedureList.value.length === index+1) {
        isNext.value = false;
        formData.value.procedureIdNext = ''
        formData.value.procedureNumNext = ''
      } else {
        isNext.value = true
        formData.value.procedureIdNext = procedureList.value[index+1].id
        formData.value.procedureNumNext = procedureList.value[index+1].procedureNum
      }
    }
  })
}
</script>

<style scoped>

</style>
