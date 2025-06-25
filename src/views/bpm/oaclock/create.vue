<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="formData.name" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item label="用户id" prop="userId">
      <el-input v-model="formData.userId" placeholder="请输入用户id" />
    </el-form-item>
    <el-form-item label="打卡类型" prop="type">
      <el-select v-model="formData.type" placeholder="请选择打卡类型">
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.BPM_OA_CLOCK_TYPE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="部门" prop="dept">
      <el-input v-model="formData.dept" placeholder="请输入部门" />
    </el-form-item>
    <el-form-item label="岗位" prop="job">
      <el-input v-model="formData.job" placeholder="请输入岗位" />
    </el-form-item>
    <el-form-item label="打卡时间" prop="clockTime">
      <el-date-picker
        v-model="formData.clockTime"
        type="datetime"
        value-format="x"
        placeholder="选择打卡时间"
      />
    </el-form-item>
    <el-form-item label="打卡异常原因" prop="reason">
      <el-input v-model="formData.reason" placeholder="请输入打卡异常原因" />
    </el-form-item>
  </el-form>

  <el-form-item>
    <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
  </el-form-item>
</template>
<script setup lang="ts">
import { OaClockApi, OaClockVO,OaClockType } from '@/api/bpm/oaclock'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as UserApi from '@/api/system/user'
import * as DefinitionApi from '@/api/bpm/definition'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

/** OA 会议申请 表单 */
defineOptions({ name: 'OAClockCreate' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  userId: undefined,
  type: undefined,
  dept: undefined,
  job: undefined,
  clockTime: undefined,
  reason: undefined,
  // status: undefined,
  // processInstanceId: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

// 指定审批人
const processDefineKey = 'boa_clock' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref<any[]>([]) // 用户列表

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
      formData.value = await OaClockApi.getOaClock(id)
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
  // 校验指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    await startUserSelectAssigneesFormRef.value.validate()
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OaClockVO
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    await OaClockApi.createOaClock(data)
    message.success(t('common.createSuccess'))
    // 发送操作成功的事件
    emit('success')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'OaClock' })
  } catch (e) {
    console.log(e)
  }

  finally {

    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    userId: undefined,
    type: undefined,
    dept: undefined,
    job: undefined,
    clockTime: undefined,
    reason: undefined,
    status: undefined,
    processInstanceId: undefined
  }
  formRef.value?.resetFields()
}
/** 初始化 */
onMounted(async () => {

  userList.value = await UserApi.getSimpleUserList()
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if (!processDefinitionDetail) {
    message.error('OA 打卡流程模型未配置，请检查！')
    return
  }
  startUserSelectTasks.value = processDefinitionDetail.startUserSelectTasks
  // 设置指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    // 设置校验规则
    for (const userTask of startUserSelectTasks.value) {
      startUserSelectAssignees.value[userTask.id] = []
      startUserSelectAssigneesFormRules.value[userTask.id] = [
        { required: true, message: '请选择审批人', trigger: 'blur' }
      ]
    }
  }

})
</script>
