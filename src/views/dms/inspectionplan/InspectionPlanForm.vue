<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%" align-center>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-row>
        <el-col :span="12">
          <div>
            <el-form-item label="计划编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入计划编码" />
            </el-form-item>
            <el-form-item label="所属节点" prop="tree">
              <el-tree-select
                v-model="formData.tree"
                :data="treeData"
                :render-after-expand="false"
                clearable
                check-strictly
                placeholder="请选择节点"
                disabled
              />
            </el-form-item>
            <el-form-item label="设备" prop="device">
              <el-select-v2
                v-model="formData.device"
                :options="localeLedgerList"
                filterable
                clearable
                placeholder="选择设备"
                v-if="ledgerListShow"
                :disabled="getTreeType() == 2"
              />
            </el-form-item>
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="formData.enableStatus" placeholder="请选择启用状态">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="超期停机" prop="expirationShutdown">
              <el-select v-model="formData.expirationShutdown" placeholder="请选择是否超期停机">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.DMS_EXPIRATION_SHUTDOWN)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="超期天数" prop="expirationTime">
              <el-input-number v-model="formData.expirationTime" />
            </el-form-item>

            <el-form-item label="检查类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择检查类型">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.DMS_INSPECTION_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="负责角色" prop="superintendent">
              <el-select-v2
                v-model="formData.superintendent"
                :options="props.roleList"
                filterable
                clearable
                placeholder="请选择负责人"
              />
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                value-format="x"
                placeholder="选择开始时间"
              />
            </el-form-item>
            <el-form-item label="周期" prop="cornExpression">
              <CronInput v-model="formData.cornExpression" ref="cronInputRef" />
              <!-- <el-input
                v-model="formData.cornExpression"
                placeholder="请输入cron表达式"
                :disabled="true"
              /> -->
            </el-form-item>

            <el-form-item label="说明" prop="remark">
              <el-input v-model="formData.remark" type="textarea" placeholder="请输入说明" />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item label="检查内容" prop="content">
              <InspectionPlanContent v-model="formData.content" />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { InspectionPlanApi, InspectionPlanVO } from '@/api/dms/inspectionplan'
import InspectionPlanContent from './InspectionPlanContent.vue'
import CronInput from '../components/CronInput.vue'

/** 设备检查计划 表单 */
defineOptions({ name: 'InspectionPlanForm' })
const props = defineProps(['ledgerList', 'nowTree', 'roleList'])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  tree: undefined,
  device: undefined,
  enableStatus: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  superintendent: undefined,
  startTime: undefined,
  cornExpression: undefined,
  jobId: undefined,
  content: undefined,
  remark: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '计划编码不能为空', trigger: 'blur' }],
  tree: [{ required: true, message: '所属节点不能为空', trigger: 'blur' }],
  device: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '检查类型不能为空', trigger: 'blur' }],
  superintendent: [{ required: true, message: '负责角色不能为空', trigger: 'blur' }],
  expirationShutdown: [{ required: true, message: '超期停机不能为空', trigger: 'blur' }],
  expirationTime: [{ required: true, message: '超期时间不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  formLoading.value = true
  try {
    if (id) formData.value = await InspectionPlanApi.getInspectionPlan(id) // 修改时，设置数据
    initLocaleLedgerList()
    await initTree()
    cronInputRef.value.init()
  } finally {
    formLoading.value = false
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
    const data = formData.value as unknown as InspectionPlanVO
    if (formType.value === 'create') {
      await InspectionPlanApi.createInspectionPlan(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await InspectionPlanApi.updateInspectionPlan(data)
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
    code: undefined,
    tree: undefined,
    device: undefined,
    enableStatus: undefined,
    expirationShutdown: undefined,
    expirationTime: undefined,
    type: undefined,
    superintendent: undefined,
    startTime: undefined,
    cornExpression: undefined,
    jobId: undefined,
    content: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}

/********************Cron相关*******************/

const cronInputRef = ref()

/************************************树相关************************************/

import { PlanTreeApi } from '@/api/dms/plantree'

const treeData = ref()
const localeTree = ref()

async function initTree() {
  treeData.value = await PlanTreeApi.getPlanTreeObject()
  localeTree.value = props.nowTree
  if (!isBlank(localeTree.value)) {
    formData.value.tree = localeTree.value.id

    switch (getTreeType()) {
      case 1:
        {
        }
        break
      case 2:
        {
          formData.value.device = localeTree.value.deviceId
        }
        break
      case 3:
        {
          setLedgerListFilter((v) => {
            if (v.type == localeTree.value.deviceTypeId) {
              return true
            }
            return false
          })
        }
        break
    }
  }
}

function getTreeType() {
  const a = isBlank(localeTree.value?.deviceId)
  const b = isBlank(localeTree.value?.deviceTypeId)

  if (a && b) {
    return 1
  } else if (!a && b) {
    return 2
  } else if (a && !b) {
    return 3
  } else {
    return 4
  }
}

/************************************设备相关**********************************/

const localeLedgerList = ref()
const ledgerListShow = ref(false)
let ledgerListFilter = () => {
  return true
}

function initLocaleLedgerList() {
  ledgerListFilter = () => {
    return true
  }
  ledgerListShow.value = false
  localeLedgerList.value = props.ledgerList.filter(ledgerListFilter)
  ledgerListShow.value = true
}

function setLedgerListFilter(fun) {
  ledgerListFilter = fun
  ledgerListShow.value = false
  localeLedgerList.value = props.ledgerList.filter(ledgerListFilter)
  ledgerListShow.value = true
}

/***********************工具*********************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v?.trim() == '')) {
    return true
  }
  return false
}
</script>
