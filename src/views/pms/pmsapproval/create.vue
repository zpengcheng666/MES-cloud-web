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
                label-width="120px"
                v-loading="formLoading"
              >
                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目编码" prop="projectCode">
                      <el-input v-model="formData.projectCode" placeholder="请输入项目编码" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目名称" prop="projectName">
                      <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目类型" prop="projectType">
                      <el-select v-model="formData.projectType" placeholder="请选择项目类型">
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
                  <!--<el-col :span="8" labelWidth="125px">-->
                    <!--<el-form-item label="项目合同" prop="projectContract">-->
                      <!--<el-input v-model="formData.projectContract" placeholder="请输入项目合同" />-->
                    <!--</el-form-item>-->
                  <!--</el-col>-->
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="项目预算/万" prop="budget">
                      <el-input-number v-model="formData.budget" placeholder="请输入项目预算(万元)" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="客户" prop="projectClient">
                      <!--<el-input v-model="formData.projectClient" placeholder="请输入客户(之后改成下拉)" />-->
                      <el-select v-model="formData.projectClient" placeholder="请选择客户">
                        <el-option
                          v-for="item in companyList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="客户联系人" prop="contactId">
                      <el-select v-model="formData.contactId" placeholder="请选择客户联系人">
                        <el-option
                          v-for="item in companyContactList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-form-item label="项目简述" prop="description">
                  <el-input type="textarea" v-model="formData.description" placeholder="请输入项目简述" />
                </el-form-item>
                <el-row :gutter="20">
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="预计开始时间" prop="prestartTime">
                      <el-date-picker
                        v-model="formData.prestartTime"
                        type="date"
                        value-format="x"
                        placeholder="选择预计开始时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="预计结束时间" prop="preendTime">
                      <el-date-picker
                        v-model="formData.preendTime"
                        type="date"
                        value-format="x"
                        placeholder="选择预计结束时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8" labelWidth="125px">
                    <el-form-item label="是否需要评估" prop="needsAssessment">
                      <el-select v-model="formData.needsAssessment" placeholder="请选择是否需要评估">
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
                <div v-show="formData.needsAssessment">
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
                </div>
                <el-form-item label="项目技术材料" prop="technicalMaterialArray">
                  <UploadFile :is-show-tip="false" v-model="formData.technicalMaterialArray" />
                </el-form-item>
                <!--<el-form-item label="客户联系人" prop="contactId">-->
                  <!--<el-select v-model="formData.contactId" placeholder="请选择客户联系人">-->
                    <!--<el-option-->
                      <!--v-for="item in companyContactList"-->
                      <!--:key="item.id"-->
                      <!--:label="item.name"-->
                      <!--:value="item.id"-->
                    <!--/>-->
                  <!--</el-select>-->
                <!--</el-form-item>-->
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
              <!-- 子表的表单 -->
              <!--<el-tabs v-model="subTabsName">-->
                <!--<el-tab-pane label="项目订单表子" name="orderList">-->
                  <!--<PmsOrderListForm ref="orderListFormRef" :project-id="formData.id" />-->
                <!--</el-tab-pane>-->
              <!--</el-tabs>-->
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CompanyApi } from '@/api/ppm/company'
import { CompanyContactApi } from '@/api/ppm/companycontact'
import PmsOrderListForm from './components/PmsOrderListForm.vue'
/** bpm修改 */
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
/***********/
/** OA 会议申请 表单 */
defineOptions({ name: 'PMSApprovalCreate' })

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
/** 子表 */
const subTabsName = ref('orderList')
// const orderListFormRef = ref()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectCode: undefined,
  projectName: undefined,
  projectType: undefined,
  projectContract: undefined,
  budget: undefined,
  projectClient: undefined,
  description: undefined,
  prestartTime: undefined,
  preendTime: undefined,
  responsiblePerson: undefined,
  projectManager: undefined,
  needsAssessment: undefined,
  strategy: undefined,
  technology: undefined,
  capacity: undefined,
  cost: undefined,
  technicalMaterials: undefined,
  technicalMaterialArray: undefined,
  contactId: undefined,
})

const projectCodeCompare = ref('');

const checkCodeExist =async (rule,value,callback)=>{
  const data = await ApprovalApi.getByProjectCode(value)
    if(data!=null&&projectCodeCompare.value!=value){
      callback(new Error('项目编码已存在,请输入新编码'))
    }
  callback()
}
const checkTime = async (rule,value,callback)=>{
  if(formData.value.prestartTime!=undefined&&formData.value.preendTime!=undefined){
    if(formData.value.prestartTime>formData.value.preendTime){
      callback(new Error('预计开始时间要早于预计结束时间'))
    }else {
      callback()
    }
  }else {
    callback()
  }
}
const formRules = reactive({
  projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur' }, {validator: checkCodeExist,trigger: 'blur'}],
  projectName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  projectType: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
  budget: [{ required: true, message: '项目预算不能为空', trigger: 'blur' }],
  prestartTime: [{ required: true, message: '预计开始时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
  preendTime: [{ required: true, message: '预计结束时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
  needsAssessment: [{ required: true, message: '是否需要评估不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

// 指定审批人
const processDefineKey = 'pms_approval' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref<any[]>([]) // 用户列表

const companyList = ref([])//客户列表
const companyContactList = ref([])//客户联系人列表

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
    formData.value.technicalMaterials = formData.value.technicalMaterialArray?.join(",");
    const data = formData.value as unknown as ApprovalVO
    // 拼接子表的数据
    // data.orderLists = orderListFormRef.value.getData()
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      data.startUserSelectAssignees = startUserSelectAssignees.value
    }
    await ApprovalApi.createApprovalBpm(data)
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
    projectCode: undefined,
    projectName: undefined,
    projectType: undefined,
    projectContract: undefined,
    budget: undefined,
    projectClient: undefined,
    description: undefined,
    prestartTime: undefined,
    preendTime: undefined,
    responsiblePerson: undefined,
    projectManager: undefined,
    needsAssessment: undefined,
    strategy: undefined,
    technology: undefined,
    capacity: undefined,
    cost: undefined,
    technicalMaterials: undefined,
    technicalMaterialArray: undefined,
    contactId: undefined,
  }
  formRef.value?.resetFields()
}

watch(() => formData.value.needsAssessment,(val) => {
  if(!val){
    formData.value.strategy = 0;
    formData.value.technology = 0;
    formData.value.capacity = 0;
    formData.value.cost = 0;
  }else {
    formData.value.strategy = 1;
    formData.value.technology = 1;
    formData.value.capacity = 1;
    formData.value.cost = 1;
  }

},{deep: true})

/**
 * 监听客户id,获取联系人列表
 */
watch(() => formData.value.projectClient,async (val) => {
  if(val!=undefined&&val!=null){
    const data = await CompanyContactApi.getCompanyContactSimpleList(val);
    companyContactList.value = data.contactList;
    //查看是否包含联系人id,不包含设置为undefined
    const b = companyContactList.value.some((item)=>{
      return item.id === formData.value.contactId;
    })
    if(!b){
      formData.value.contactId = undefined;
    }
  }
},{deep: true})
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

  companyList.value = await CompanyApi.getCompanySimpleList()
  if(query.id){
    formData.value = await ApprovalApi.getApproval(query.id)
    projectCodeCompare.value = formData.value.projectCode;
    formData.value.technicalMaterialArray = formData.value.technicalMaterials?.split(",");
  }
  //物料列表获取
  // orderListFormRef.value.getMaterialList();
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
