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
            <el-col :span="18" :offset="4" style="margin-top: 20px">
              <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
                v-loading="formLoading"
              >
                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目编码" prop="projectCode">
                      <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input v-model="formData.projectName" placeholder="请输入项目名称" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目类型" prop="projectType">
                      <el-select v-model="formData.projectType" placeholder="请选择项目类型" disabled>
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROJECT_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="6" labelWidth="125px">
                    <el-form-item label="战略评估" prop="strategy">
                      <el-select v-model="formData.strategy" placeholder="请选择战略评估" disabled>
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" labelWidth="125px">
                    <el-form-item label="技术评估" prop="technology">
                      <el-select v-model="formData.technology" placeholder="请选择技术评估" disabled>
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" labelWidth="125px">
                    <el-form-item label="产能评估" prop="capacity">
                      <el-select v-model="formData.capacity" placeholder="请选择产能评估" disabled>
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6" labelWidth="125px">
                    <el-form-item label="成本评估" prop="cost">
                      <el-select v-model="formData.cost" placeholder="请选择成本评估" disabled>
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="发起原因" prop="reasonType">
                      <el-select v-model="formData.reasonType" placeholder="请选择发起原因">
                        <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_REASON)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!--<el-col :span="8" labelWidth="125px">-->
                    <!--<el-form-item label="类型" prop="assessmentType">-->
                      <!--<el-select v-model="formData.assessmentType" placeholder="请选择类型">-->
                        <!--<el-option-->
                          <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_CATEGORY)"-->
                          <!--:key="dict.value"-->
                          <!--:label="dict.label"-->
                          <!--:value="dict.value"-->
                        <!--/>-->
                      <!--</el-select>-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <!--<el-col :span="8" labelWidth="125px">-->
                    <!--<el-form-item label="评估人" prop="assessmentPerson">-->
                      <!--<el-input v-model="formData.assessmentPerson" placeholder="请输入评估人" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                </el-row>
                <el-form-item label="评估说明" prop="instruction">
                  <el-input type="textarea" v-model="formData.instruction" placeholder="请输入评估说明" />
                </el-form-item>

                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="开始时间" prop="startTime">
                      <el-date-picker
                        v-model="formData.startTime"
                        type="date"
                        value-format="x"
                        placeholder="选择开始时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="结束时间" prop="endTime">
                      <el-date-picker
                        v-model="formData.endTime"
                        type="date"
                        value-format="x"
                        placeholder="选择结束时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="预计完成时间" prop="prefinishTime">
                      <el-date-picker
                        v-model="formData.prefinishTime"
                        type="date"
                        value-format="x"
                        placeholder="选择预计完成时间"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

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
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import { useTagsViewStore } from '@/store/modules/tagsView'
import * as UserApi from '@/api/system/user'
import * as DefinitionApi from '@/api/bpm/definition'
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AssessmentApi, AssessmentVO } from '@/api/pms/assessment'
import * as TaskApi from '@/api/bpm/task'
/** bpm修改 */
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
/***********/
/** OA 会议申请 表单 */
defineOptions({ name: 'PMSAssessmentCreate' })

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
  projectCode: undefined,
  projectName: undefined,
  projectType: undefined,
  strategy: undefined,
  technology: undefined,
  capacity: undefined,
  cost: undefined,

  reasonType:undefined,
  assessmentType:undefined,
  assessmentPerson:undefined,
  instruction:undefined,
  startTime:undefined,
  endTime:undefined,
  prefinishTime:undefined,

})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

// 指定审批人
const processDefineKey = 'pms_assessment' // 流程定义 Key
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
      formData.value = await ApprovalApi.getApproval(id)
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

    const data = formData.value as unknown as AssessmentVO
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    const id = await AssessmentApi.createAssessment(data)

    message.success(t('common.createSuccess'))
    // 发送操作成功的事件
    await updateAssessment(id)
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
    projectCode: undefined,
    projectName: undefined,
    projectType: undefined,
    strategy: undefined,
    technology: undefined,
    capacity: undefined,
    cost: undefined,

    reasonType:undefined,
    assessmentType:undefined,
    assessmentPerson:undefined,
    instruction:undefined,
    startTime:undefined,
    endTime:undefined,
    prefinishTime:undefined,

  }
  formRef.value?.resetFields()
}
const updateAssessment = async (id)=>{
  const assessment = await AssessmentApi.getAssessment(id)
  const data = await TaskApi.getTaskListByProcessInstanceId(assessment.processInstanceId);
  const processDefinitionId = data[0].processInstance.processDefinitionId;
  const bpmn = await DefinitionApi.getProcessDefinition(processDefinitionId)
  const bpmnXml = bpmn?.bpmnXml;
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(bpmnXml, "application/xml");
  const userTasks = xmlDoc.getElementsByTagName('userTask');
  console.log(userTasks);
  const map = new Map()
  for(const usertask of userTasks){
    console.log(usertask)
    const id =  usertask.getAttribute('id')
    const userId = usertask.getAttribute('flowable:candidateParam');
    console.log(id,userId);
    map.set(id,userId);
  }
  map.set('id',id);
  const paramData = Object.fromEntries(map);
  AssessmentApi.updateAuditor(paramData);
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
  if (!processDefinitionDetail) {
    message.error('PMS 立项流程模型未配置，请检查！')
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
  if(query.id){
    let data = await ApprovalApi.getApproval(query.id)
    let row = {
      projectCode: data.projectCode,
      projectName: data.projectName,
      projectType: data.projectType,
      strategy: data.strategy,
      technology: data.technology,
      capacity: data.capacity,
      cost: data.cost,
      projectId:data.id
    }
    formData.value = row
  }
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
