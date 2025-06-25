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
                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="申请人部门" prop="dept">
                      <el-input v-model="formData.dept" placeholder="请输入申请人部门" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="申请人" prop="applicant">
                      <el-input v-model="formData.applicant" placeholder="请输入申请人" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">

                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="供应商" prop="supplier">
                      <el-input v-model="formData.supplier" placeholder="请输入供应商" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="供应商编码" prop="supplyCode">
                      <el-input v-model="formData.supplyCode" placeholder="请输入供应商编码" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="联系人" prop="contact">
                      <el-input v-model="formData.contact" placeholder="请输入联系人" />
                    </el-form-item>
                  </el-col>

                  <el-col :span="12" labelWidth="125">
                    <el-form-item label="联系电话" prop="tel">
                      <el-input v-model="formData.tel" placeholder="请输入联系电话" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="24" labelWidth="125">
                    <el-form-item label="采购人" prop="purchaseAgent">
                      <el-input v-model="formData.purchaseAgent" placeholder="请输入采购人" />
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
                <el-tab-pane label="OA 采购明细" name="oaPurchaseList">
                  <OaPurchaseListForm ref="oaPurchaseListFormRef" :purchase-id="formData.id" />
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
  import { OaPurchaseApi, OaPurchaseVO } from '@/api/bpm/oapurchase'
  import OaPurchaseListForm from './components/OaPurchaseListForm.vue'
  import { useTagsViewStore } from '@/store/modules/tagsView'
  import * as DefinitionApi from '@/api/bpm/definition'
  import * as UserApi from '@/api/system/user'
  /** bpm修改 */
  import ProcessInstanceBpmnViewer from '../processInstance/detail/ProcessInstanceBpmnViewer.vue'

  /***********/

  /** OA 采购申请 表单 */
  defineOptions({ name: 'OaPurchaseCreate' })

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
    purchaseAgent: undefined,
    supplier: undefined,
    supplyCode: undefined,
    contact: undefined,
    tel: undefined,
    // status: undefined,
    // processInstanceId: undefined
  })
  const formRules = reactive({
    dept: [{ required: true, message: '申请人部门不能为空', trigger: 'blur' }],
    applicant: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
    purchaseAgent: [{ required: true, message: '采购人不能为空', trigger: 'blur' }],
    supplier: [{ required: true, message: '供应商不能为空', trigger: 'blur' }],
  })
  const formRef = ref() // 表单 Ref

  /** 子表的表单 */
  const subTabsName = ref('oaPurchaseList')
  const oaPurchaseListFormRef = ref()

  // 指定审批人
  const processDefineKey = 'boa_purchase' // 流程定义 Key
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
      await oaPurchaseListFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'oaPurchaseList'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as OaPurchaseVO
      // 拼接子表的数据
      data.oaPurchaseLists = oaPurchaseListFormRef.value.getData()
      // if (formType.value === 'create') {
      //   await OaPurchaseApi.createOaPurchase(data)
      //   message.success(t('common.createSuccess'))
      // } else {
      //   await OaPurchaseApi.updateOaPurchase(data)
      //   message.success(t('common.updateSuccess'))
      // }
      await OaPurchaseApi.createOaPurchase(data)
      message.success(t('common.createSuccess'))
      // 发送操作成功的事件
      emit('success')
      // 关闭当前 Tab
      delView(unref(currentRoute))
      // await push({ name: 'OaPurchase' })
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
      purchaseAgent: undefined,
      supplier: undefined,
      supplyCode: undefined,
      contact: undefined,
      tel: undefined,
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
      message.error('OA 采购模型未配置，请检查！')
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
