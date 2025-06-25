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
                  <el-col :span="8">
                    <el-form-item label="申请人" prop="applicant" labelWidth="125px">
                      <el-input v-model="formData.applicant" placeholder="请输入申请人" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="申请人部门" prop="dept" labelWidth="125px">
                      <el-input v-model="formData.dept" placeholder="请输入申请人部门" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="申请部门领导" prop="leader" labelWidth="125px">
                      <el-input v-model="formData.leader" placeholder="请输入申请部门领导" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="仓库管理员" prop="warehouseman" labelWidth="125px">
                      <el-input v-model="formData.warehouseman" placeholder="请输入仓库管理员" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="申请原因" prop="reason" labelWidth="125px">
                      <el-input type="textarea" v-model="formData.reason" placeholder="请输入申请原因" />
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
              <!-- 子表的表单 -->
              <el-tabs v-model="subTabsName">
                <el-tab-pane label="OA 物品领用表-物品清单" name="oaSupplyList">
                  <OaSupplyListForm ref="oaSupplyListFormRef" :supply-id="formData.id" />
                </el-tab-pane>
              </el-tabs>
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
  import { OaSupplyApi, OaSupplyVO } from '@/api/bpm/oasupply'
  import OaSupplyListForm from './components/OaSupplyListForm.vue'
  import { useTagsViewStore } from '@/store/modules/tagsView'
  import * as DefinitionApi from '@/api/bpm/definition'
  import * as UserApi from '@/api/system/user'

  /** bpm修改 */
  import ProcessInstanceBpmnViewer from '../processInstance/detail/ProcessInstanceBpmnViewer.vue'

  /***********/

  /** OA 采购申请 表单 */
  defineOptions({ name: 'OASupplyCreate' })

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

  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formData = ref({
    id: undefined,
    dept: undefined,
    applicant: undefined,
    leader: undefined,
    warehouseman: undefined,
    reason: undefined,
  })
  const formRules = reactive({
    dept: [{ required: true, message: '申请人部门不能为空', trigger: 'blur' }],
    applicant: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
    leader: [{ required: true, message: '申请部门领导不能为空', trigger: 'blur' }],
  })
  const formRef = ref() // 表单 Ref

  /** 子表的表单 */
  const subTabsName = ref('oaSupplyList')
  const oaSupplyListFormRef = ref()

  // 指定审批人
  const processDefineKey = 'boa_supply' // 流程定义 Key
  const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
  const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
  const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
  const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
  const userList = ref<any[]>([]) // 用户列表


  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
      await oaSupplyListFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'oaSupplyList'
      return
    }
    // 校验指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      await startUserSelectAssigneesFormRef.value.validate()
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as OaSupplyVO
      // 拼接子表的数据
      data.oaSupplyLists = oaSupplyListFormRef.value.getData()
      // 设置指定审批人
      if (startUserSelectTasks.value?.length > 0) {
        data.startUserSelectAssignees = startUserSelectAssignees.value
      }
      await OaSupplyApi.createOaSupply(data)
      message.success(t('common.createSuccess'))
      // 发送操作成功的事件
      emit('success')
      // 关闭当前 Tab
      delView(unref(currentRoute))
      // await push({ name: 'OaSupply' })
      await push({ name: 'BpmProcessInstanceMy' })
    } finally {

      formLoading.value = false
    }
  }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      dept: undefined,
      applicant: undefined,
      supplyAgent: undefined,
      supplier: undefined,
      // status: undefined,
      // processInstanceId: undefined
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
