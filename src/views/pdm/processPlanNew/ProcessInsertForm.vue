<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="900px">
    <el-form ref="formRefPlan" :model="formProcessPlan" :rules="formProcessRules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="工艺规程编号" prop="processCode">
            <el-input v-model="formProcessPlan.processCode" placeholder="请输入工艺规程编号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺规程名称" prop="processName">
            <el-input v-model="formProcessPlan.processName" placeholder="请输入工艺规程名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="加工方案码" prop="processSchemeCode">
            <el-input v-model="formProcessPlan.processSchemeCode" placeholder="请输入加工方案码" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版次" prop="processVersion">
            <el-input v-model="formProcessPlan.processVersion" placeholder="请输入版次" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px">
        <el-col :span="4">
          <el-form-item label="选择路线" />
        </el-col>
        <el-col :span="5">
          <el-table :data="dataProcessList" :border="1"
            style="max-width: 150px;max-height :200px;cursor: pointer;overflow-y: auto" highlight-current-row
            @row-click="dataRouteChange" @rowDblclick="addItem">
            <el-table-column prop="name" />
          </el-table>
        </el-col>
        <el-col :span="2">
          <div style="text-align: center">
            <el-button @click="addItem" style="width:30px;background-color:#409eff;color:#fff">&gt;&gt;</el-button>
          </div>
          <div style="text-align: center">
            <el-button @click="deleteItem" style="width:30px;background-color:#ff405d;color:#fff;">--</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <el-table :data="dataRouteListSecond" :border="1"
            style="max-width: 200px;max-height :200px;cursor: pointer;overflow-y: auto">
            <el-table-column prop="name" />
            <el-table-column :width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" @click="handleDeleteRoute($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="加工路线" prop="processRouteName">
            <el-input v-model="formProcessPlan.processRouteName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="材料编号" prop="materialNumber">
            <el-input v-model="formProcessPlan.materialNumber" disabled />
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="openNewForm('create')" class="choose">
          选择
        </el-button>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="材料名称" prop="materialName">
            <el-input v-model="formProcessPlan.materialName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料规格" prop="materialSpecification">
            <el-input v-model="formProcessPlan.materialSpecification" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="毛坯外形尺寸" prop="singleSize">
            <el-input v-model="formProcessPlan.singleSize" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="每毛坯件数" prop="groupSize">
            <el-input-number v-model="formProcessPlan.groupSize" :min="1" clearable controls-position="right"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="工作说明" prop="description">
            <el-input v-model="formProcessPlan.description" pleaceholder="请说明" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitProcessForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <MaterialInsertForm ref="MaterialInsert" @success="getMaterialInsertList" />
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { ProcessRegulationsVO } from "@/api/pdm/processPlan";
import MaterialInsertForm from './MaterialInsertForm.vue'

/** 产品数据对象 表单 */
defineOptions({ name: 'DataObjectForm' })
import { ProcessPlanApi } from "@/api/pdm/processPlan";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const dataProcessList = ref([])
const dataRouteListSecond = ref<any[]>([])
const formRefPlan = ref()
const formProcessPlan = ref({
  id: undefined,
  leftName: undefined,
  processRouteName: undefined,
  partVersionId: undefined,
  processCode: undefined,
  processName: undefined,
  processSchemeCode: '01',
  processVersion: 'A',
  property: undefined,
  description: undefined,
  processRegulations: undefined,
  processRoute: undefined,
  processRouteList: undefined,
  processingTime: undefined,
  singleQuatity: undefined,
  singleSize: undefined,
  groupSize: undefined,
  processRouteDetailDOList: undefined,
  materialId: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialNumber: undefined,
  materialSpecification: undefined,
})

const formProcessRules = reactive({
  processCode: [{ required: true, message: '工艺规程编号不能为空', trigger: 'blur' }],
  processName: [{ required: true, message: '工艺规程名称不能为空', trigger: 'blur' }],
  processRouteName: [{ required: true, message: '请选择加工路线', trigger: 'blur' }],
  materialNumber: [{ required: true, message: '请选择材料编号', trigger: 'blur' }],
  singleSize: [{ required: true, message: '毛坯外形尺寸不能为空', trigger: 'blur' }],
  groupSize: [{ required: true, message: '每毛坯件数不能为空', trigger: 'blur' }],
})

const queryParamsProcess = reactive({
  id: '',
  materialId: '',
  materialCode: '',
  materialNumber: '',
  processCode: '',
  partVersionId: '',
  projectCode: '',
  processTaskId: '',
  status: '2',
  processCondition: ''
})

/** 打开弹窗 */
const open = async (type: string, id?: number, partVersionId: string, processCode: string, projectCode: string, processTaskId: string, processCondition: string) => {
  //对话框显示
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  queryParamsProcess.partVersionId = partVersionId
  // queryParamsProcess.processCode = processCode
  queryParamsProcess.projectCode = projectCode
  queryParamsProcess.processTaskId = processTaskId
  queryParamsProcess.processCondition = processCondition
  resetProcessForm()
  await generateData()
  if (id) {
    formLoading.value = true
    try {
    } finally {
      formLoading.value = false
    }
  }
}

//选择
const MaterialInsert = ref()
const openNewForm = (type: string, id?: number) => {
  MaterialInsert.value.open(type, id)
}
const generateData = async () => {
  dataProcessList.value = await ProcessPlanApi.getProcessRouteList(null)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
/** 提交工艺方案信息 */
const submitProcessForm = async () => {
  // 校验表单
  if (!formRefPlan) return
  const valid = await formRefPlan.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    const dataProcess = formProcessPlan.value as unknown as ProcessRegulationsVO
    // dataProcess.processCode = queryParamsProcess.processCode
    dataProcess.partVersionId = queryParamsProcess.partVersionId
    dataProcess.projectCode = queryParamsProcess.projectCode
    dataProcess.processTaskId = queryParamsProcess.processTaskId
    dataProcess.processCondition = queryParamsProcess.processCondition
    if (dataProcess.id) {
      await ProcessPlanApi.updateProcess(dataProcess)
    } else {
      await ProcessPlanApi.createProcess(dataProcess)
    }
    // 更新工艺方案任务状态
    await ProcessPlanApi.updateFeasibilityTaskStatus(queryParamsProcess)
    dialogVisible.value = false
    message.success('保存成功')
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
  resetProcessForm()
}


/** 重置表单 */
const resetProcessForm = () => {
  formProcessPlan.value = {
    id: undefined,
    name: undefined,
    processRouteName: undefined,
    partVersionId: undefined,
    processCode: undefined,
    processName: undefined,
    processSchemeCode: '01',
    processVersion: 'A',
    property: undefined,
    description: undefined,
    processRegulations: undefined,
    processRoute: undefined,
    processRouteList: undefined,
    processingTime: undefined,
    singleQuatity: undefined,
    singleSize: undefined,
    groupSize: undefined,
    processRouteDetailDOList: undefined,
    materialId: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialNumber: undefined,
    materialSpecification: undefined,
  }
  formRefPlan.value?.resetFields()
  dataRouteListSecond.value = []
}

/** 监听加工路线选中事件 */
const dataRouteChange = async (val) => {
  formProcessPlan.value.leftName = val.name;
}

const addItem = async () => {
  //加工路线左→右
  dataProcessList.value.forEach((item) => {
    if (item.name === formProcessPlan.value.leftName) {
      dataRouteListSecond.value.push(item)
    }
  })
  //加工路线文本赋值
  const routeName = ref("")
  dataRouteListSecond.value.forEach(item => {
    routeName.value = routeName.value + item.name + "-"
  })
  if (routeName.value && routeName.value.lastIndexOf("-")) {
    routeName.value = routeName.value.substring(0, routeName.value.length - 1)
  }
  formProcessPlan.value.processRouteName = routeName.value
}

const deleteItem = async () => {
  dataRouteListSecond.value = []
  formProcessPlan.value.processRouteName = ''
}

/** 删除右侧加工路线 */
const handleDeleteRoute = async (index) => {
  dataRouteListSecond.value.splice(index, 1)
  //加工路线文本赋值
  const routeName = ref("")
  dataRouteListSecond.value.forEach(item => {
    routeName.value = routeName.value + item.name + "-"
  })
  if (routeName.value && routeName.value.lastIndexOf("-")) {
    routeName.value = routeName.value.substring(0, routeName.value.length - 1)
  }
  formProcessPlan.value.processRouteName = routeName.value
}

const getMaterialInsertList = async (data) => {
  formProcessPlan.value.materialCode = data.materialCode
  formProcessPlan.value.materialName = data.materialName
  formProcessPlan.value.materialNumber = data.materialNumber
  formProcessPlan.value.materialSpecification = data.materialSpecification
  formProcessPlan.value.materialId = data.id
}
</script>
<style>
.process {
  margin-left: 220px;
  /* 向右移动 */
  margin-top: 10px;
  /* 向下移动 */
}
</style>
