<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="80%" align-center>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-row>
        <el-col :span="12">
          <div>
            <el-form-item label="计划编码" prop="code">
              <el-input v-model="formData.code" placeholder="请输入计划编码" />
            </el-form-item>
            <el-form-item label="设备" prop="device">
              <el-select-v2
                v-model="formData.device"
                :options="localeLedgerList"
                filterable
                clearable
                placeholder="选择设备"
                v-if="isShow"
                :disabled="getTreeType() == 2"
              />
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
            <el-form-item label="关键设备" prop="criticalDevice">
              <el-select-v2
                v-model="formData.criticalDevice"
                :options="[
                  { label: '是', value: 1 },
                  { label: '否', value: 0 }
                ]"
                filterable
                clearable
                placeholder="请选择是否为关键设备"
              />
            </el-form-item>
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select-v2
                v-model="formData.enableStatus"
                :options="getIntDictOptions(DICT_TYPE.ENABLE_STATUS)"
                placeholder="请选择启用状态"
                clearable
              />
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

            <el-form-item label="维护类型" prop="type">
              <el-select-v2
                v-model="formData.type"
                :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_TYPE)"
                placeholder="请选择维护类型"
                clearable
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
              <el-input
                type="textarea"
                :rows="5"
                v-model="formData.remark"
                placeholder="请输入说明"
              />
            </el-form-item>
            <el-form-item label="负责角色" prop="superintendent">
              <el-select-v2
                v-model="formData.superintendent"
                :options="props.roleList"
                filterable
                clearable
                placeholder="请选择负责角色"
              />
            </el-form-item>

            <el-form-item label="最后一次保养时间" prop="lastTime">
              <el-date-picker
                v-model="formData.lastTime"
                type="datetime"
                value-format="x"
                placeholder="选择最后一次保养时间"
                disabled
              />
            </el-form-item>

            <el-form-item label="上一次完成状态" prop="lastStatus">
              <el-select-v2
                v-model="formData.lastStatus"
                :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_STATUS)"
                placeholder="请选择上一次完成状态"
                clearable
                disabled
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <el-form-item prop="content">
              <MaintenancePlanContent v-model="formData.content" />
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
import { MaintenancePlanApi, MaintenancePlanVO } from '@/api/dms/maintenanceplan'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import MaintenancePlanContent from './MaintenancePlanContent.vue'
import { PlanTreeApi } from '@/api/dms/plantree'
import CronInput from '../components/CronInput.vue'

/** 设备保养维护计划 表单 */
defineOptions({ name: 'MaintenancePlanForm' })

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
  criticalDevice: undefined,
  enableStatus: undefined,
  expirationShutdown: undefined,
  expirationTime: undefined,
  type: undefined,
  startTime: undefined,
  cornExpression: undefined,
  jobId: undefined,
  content: undefined,
  remark: undefined,
  superintendent: undefined,
  lastTime: undefined,
  lastStatus: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '计划编码不能为空', trigger: 'blur' }],
  tree: [{ required: true, message: '所属节点不能为空', trigger: 'blur' }],
  device: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
  criticalDevice: [{ required: true, message: '关键设备不能为空', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '维护类型不能为空', trigger: 'blur' }],
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

  // 修改时，设置数据

  formLoading.value = true
  try {
    if (id) formData.value = await MaintenancePlanApi.getMaintenancePlan(id)
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

  if (cronInputRef.value.checkDay() == false) {
    try {
      await message.confirm('请注意:周期中存在29,30,31天数,某些月份中这些天数不存在', '提醒')
    } catch (e) {
      return
    }
  }

  // 提交请求
  formLoading.value = true

  try {
    const data = formData.value as unknown as MaintenancePlanVO
    if (formType.value === 'create') {
      await MaintenancePlanApi.createMaintenancePlan(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await MaintenancePlanApi.updateMaintenancePlan(data)
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
    criticalDevice: undefined,
    enableStatus: undefined,
    expirationShutdown: undefined,
    expirationTime: undefined,
    type: undefined,
    startTime: undefined,
    cornExpression: undefined,
    jobId: undefined,
    content: undefined,
    remark: undefined,
    superintendent: undefined,
    lastTime: undefined,
    lastStatus: undefined
  }
  formRef.value?.resetFields()
}

/****************************树相关*********************/
const treeData = ref<any[]>([])
const selectTree = ref()
function getTreeType() {
  const a = isBlank(selectTree.value?.deviceId)
  const b = isBlank(selectTree.value?.deviceTypeId)

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

const isShow = ref(false)

async function initTree() {
  treeData.value = await PlanTreeApi.getPlanTreeObject()
  selectTree.value = props.nowTree

  isShow.value = false

  filter = () => {
    return true
  }
  getLocaleLedgerList()

  if (!isBlank(selectTree.value)) {
    formData.value.tree = selectTree.value.id

    switch (getTreeType()) {
      case 1:
        {
        }
        break
      case 2:
        {
          formData.value.device = selectTree.value.deviceId
        }
        break
      case 3:
        {
          filter = (v) => {
            if (v.type == selectTree.value.deviceTypeId) {
              return true
            }
            return false
          }
          getLocaleLedgerList()
        }
        break
    }
  }

  isShow.value = true
}

/********************Cron相关*******************/

const cronInputRef = ref()

/*********************设备列表相关*****************/

const localeLedgerList = ref<any[]>([])
function getLocaleLedgerList() {
  localeLedgerList.value = props.ledgerList.filter(filter)
}
let filter: any = () => {
  return true
}

/***********************工具*********************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v?.trim() == '')) {
    return true
  }
  return false
}
</script>
