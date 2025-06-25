<template>

  <ContentWrap>

    <el-tabs
      v-model="activeName"
      type="card"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="申请信息" name="first">
        <el-card class="box-card">
          <div class="clearfix">
            <span class="el-icon-document">申请信息【{{ selectProcessDefinitionName }}】</span>
            <el-button style="float: right" type="primary" @click="selectOtherProcessDefinition">
              <Icon icon="ep:delete" /> 选择其它流程
            </el-button>
          </div>
          <el-row >
            <el-col :span="16" :offset="4" style="margin-top: 20px">
              <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
                v-loading="formLoading"
              >
                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="会议主题" prop="title">
                      <el-input v-model="formData.title" placeholder="请输入会议主题" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="开始时间" prop="startTime">
                      <el-date-picker
                        v-model="formData.startTime"
                        type="datetime"
                        value-format="x"
                        placeholder="选择开始时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                      v-model="formData.endTime"
                      type="datetime"
                      value-format="x"
                      placeholder="选择结束时间"
                    />
                  </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="16" labelWidth="125px">
                  <el-form-item label="参会人员" prop="staffArray">
                    <el-select
                      v-model="formData.staffArray"
                      multiple
                      placeholder="Select"
                    >
                      <el-option
                        v-for="item in userList"
                        :key="item.value"
                        :label="item.nickname"
                        :value="item.nickname"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="会议室" prop="mroom">
                      <el-select v-model="formData.mroom" placeholder="请输入会议主题">
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.BPM_OA_MEETING_ROOM)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>





                <el-form-item label="描述" prop="description">
                  <el-input type="textarea" v-model="formData.description" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="文件" prop="documentArray">
                  <UploadFile v-model="formData.documentArray" />
                </el-form-item>
              </el-form>

              <el-col v-if="startUserSelectTasks.length > 0">
                <el-card class="mb-10px">
                  <template #header>指定审批人</template>
                  <el-form
                    :model="startUserSelectAssignees"
                    :rules="startUserSelectAssigneesFormRules"
                    ref="startUserSelectAssigneesFormRef"
                  >
                    <el-form-item
                      v-for="userTask in startUserSelectTasks"
                      :key="userTask.id"
                      :label="`任务【${userTask.name}】`"
                      :prop="userTask.id"
                    >
                      <el-select
                        v-model="startUserSelectAssignees[userTask.id]"
                        multiple
                        placeholder="请选择审批人"
                      >
                        <el-option
                          v-for="user in userList"
                          :key="user.id"
                          :label="user.nickname"
                          :value="user.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </el-card>
              </el-col>

              <el-form-item>
                <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="流程图预览" :lazy="true" name="second">
        <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any" />
      </el-tab-pane>


    </el-tabs>
  </ContentWrap>

</template>
<script setup lang="ts">
import { OaMeetingApi, OaMeetingVO } from '@/api/bpm/oameeting'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as UserApi from '@/api/system/user'
import * as DefinitionApi from '@/api/bpm/definition'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
/** bpm修改 */
import ProcessInstanceBpmnViewer from '../processInstance/detail/ProcessInstanceBpmnViewer.vue'
/***********/
/** OA 会议申请 表单 */
defineOptions({ name: 'OAMeetingCreate' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由
const { query } = useRoute()

/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据

/***********/

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  title: undefined,
  mDate: undefined,
  staff: undefined,
  startTime: undefined,
  endTime: undefined,
  mroom: undefined,
  description: undefined,
  document: undefined,
  status: undefined,
  processInstanceId: undefined
})
const checkTime = async (rule,value,callback)=>{
  if(formData.value.startTime!=undefined&&formData.value.endTime!=undefined){
    if(formData.value.startTime>formData.value.endTime){
      callback(new Error('开始时间要早于结束时间'))
    }else {
      callback()
    }
  }else {
    callback()
  }
}
const formRules = reactive({
  title: [{ required: true, message: '会议主题不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
  endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref

// 指定审批人
const processDefineKey = 'boa_meeting' // 流程定义 Key
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
      formData.value = await OaMeetingApi.getOaMeeting(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  //处理数组数据
  if(formData.value.staffArray!=undefined){
    formData.value.staff = formData.value.staffArray.join(",")
  }
  if(formData.value.documentArray!=undefined){
    formData.value.document = formData.value.documentArray.join(",")
  }



  // 校验表单
  await formRef.value.validate()
  // 校验指定审批人
  if (startUserSelectTasks.value?.length > 0) {
    await startUserSelectAssigneesFormRef.value.validate()
  }


  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OaMeetingVO
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    await OaMeetingApi.createOaMeeting(data)
    message.success(t('common.createSuccess'))
    // 发送操作成功的事件
    emit('success')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    // await push({ name: 'OaMeeting' })
    await push({ name: 'BpmProcessInstanceMy' })
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
    title: undefined,
    mDate: undefined,
    staff: undefined,
    staffArray: undefined,
    startTime: undefined,
    endTime: undefined,
    mroom: undefined,
    description: undefined,
    document: undefined,
    status: undefined,
    processInstanceId: undefined
  }
  formRef.value?.resetFields()
}
/** 初始化 */
onMounted(async () => {
  /** bpm修改   */
  // 加载流程图
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if(query.bid){
    selectProcessDefinitionName.value = query.bname;
  }else {
    selectProcessDefinitionName.value = processDefinitionDetail.name;
  }
  // const processDefinitionDetail = await DefinitionApi.getProcessDefinition(query.bid)
  if (!processDefinitionDetail) {
    message.error('OA 物品领用流程模型未配置，请检查！')
    return
  }
  bpmnXML.value = processDefinitionDetail.bpmnXml

  /**************/
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
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
})

/** bpm修改信息  */
const selectOtherProcessDefinition = ()=>{
  // 关闭当前 Tab
  delView(unref(currentRoute))
  push({name:'BpmProcessInstanceCreate'})
}

const handleClick = (tab, event) => {

}
/***************/
</script>
