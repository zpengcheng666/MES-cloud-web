<template>
  <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
  >
    <el-tab-pane label="申请信息" name="first">
      <el-card class="box-card">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
          v-loading="formLoading"
        >

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发货单" prop="no">
                <!--<el-input v-model="formData.no" placeholder="请输入发货单"/>-->


                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input v-model="formData.no" placeholder="" :disabled="true"/>
                  </el-col>
                  <el-col :span="8">
                    <el-button @click="generatorCode" type="primary" :disabled="formDisabled != 0">生 码</el-button>
                  </el-col>
                </el-row>

              </el-form-item>

            </el-col>
            <!--<el-col :span="8">-->
              <!--<el-form-item label="发货单名称" prop="name">-->
                <!--<el-input v-model="formData.name" placeholder="请输入发货单名称" :disabled="formDisabled != 0"/>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :span="8">
              <el-form-item label="项目" prop="projectId">

                <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openForm()" />
                <!--<el-select v-model="formData.projectId" placeholder="请选择项目"-->
                           <!--@change="onChangeProject($event)"-->
                <!--&gt;-->
                  <!--<el-option-->
                          <!--v-for="dict in projectInfos"-->
                          <!--:key="dict.id"-->
                          <!--:label="dict.projectName"-->
                          <!--:value="dict.id"-->

                  <!--/>-->
                <!--</el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合同号" prop="contractId">

                <el-select
                  v-model="formData.contractId"
                  clearable
                  filterable
                  placeholder="请选择合同"
                  class="!w-1/1"
                  @change="getConstractId(formData.contractId)"
                >
                  <el-option
                    v-for="item in contractList"
                    :key="item.id"
                    :label="item.name + '('+item.number +')'"
                    :value="item.id"
                  />
                </el-select>

              </el-form-item>
            </el-col>




          </el-row>


          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="收货人电话" prop="consignedContact">
                <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式"/>
              </el-form-item>

            </el-col>

            <el-col :span="8">
              <el-form-item label="发货人" prop="consigner">
                <el-select
                  v-model="formData.consigner"
                  clearable
                  filterable
                  placeholder="请选择发货人员"
                  class="!w-1/1"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.id"
                    :label="item.nickname +'('+item.deptName+')'"
                    :value="item.id +''"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">

              <el-form-item label="收货人" prop="consignedBy">
                <el-input v-model="formData.consignedBy" placeholder="请输入收货人"/>
              </el-form-item>

            </el-col>

          </el-row>


          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发货日期" prop="consignerDate">
                <el-date-picker
                  v-model="formData.consignerDate"
                  type="date"
                  value-format="x"
                  placeholder="选择发货日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row :gutter="20">-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="承运单号" prop="deliveryNumber">-->
          <!--<el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号"/>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="承运人电话" prop="deliveryContact">-->
          <!--<el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话"/>-->
          <!--</el-form-item>-->

          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="承运方式" prop="deliveryMethod">-->
          <!--<el-input v-model="formData.deliveryMethod" placeholder="请输入承运方式"/>-->
          <!--</el-form-item>-->

          <!--</el-col>-->
          <!--</el-row>-->
          <!--<el-row :gutter="20">-->
          <!--<el-col :span="8">-->

          <!--<el-form-item label="承运人" prop="deliveryBy">-->
          <!--<el-input v-model="formData.deliveryBy" placeholder="请输入承运人"/>-->
          <!--</el-form-item>-->


          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="收货日期" prop="consignedDate">-->
          <!--<el-date-picker-->
          <!--v-model="formData.consignedDate"-->
          <!--type="date"-->
          <!--value-format="x"-->
          <!--placeholder="选择收货日期"-->
          <!--/>-->
          <!--</el-form-item>-->

          <!--</el-col>-->


          <!--</el-row>-->

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="附件" prop="fileUrl">
                <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1"/>
              </el-form-item>
            </el-col>


          </el-row>

        </el-form>

        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="销售发货明细" name="shippingDetail">

            <ShippingDetailForm ref="shippingDetailFormRef" :shipping-id="formData.id" :confirmStatus="formDisabled"
                                :contract-id="constractId" :orderInfo="orderInfo"/>
          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item>
            <el-button :disabled="formLoading" type="primary" @click="submitForm">保存</el-button>
            <el-button :disabled="formLoading" type="primary" @click="submitFormAndBpm">保存并提交审核</el-button>
          </el-form-item>
        </el-form>

      </el-card>
      <!-- 表单弹窗：添加/修改 -->
      <DMProjectChoose ref="projectRef" @getProject="getProject"/>

    </el-tab-pane>
    <el-tab-pane label="流程图预览" :lazy="true" name="second">
      <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
  import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
  import {useTagsViewStore} from '@/store/modules/tagsView'
  import * as DefinitionApi from '@/api/bpm/definition'
  import ShippingDetailForm from '../shipping/components/ShippingDetailForm.vue'
  import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
  import * as UserApi from '@/api/system/user'
  import {ContractApi} from '@/api/ppm/contract'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
  import DMProjectChoose from '../contract/components/contractquery/DMProjectChoose.vue'
  defineOptions({name: 'ShippingCreate'})

  const message = useMessage() // 消息弹窗
  const {delView} = useTagsViewStore() // 视图操作
  const {push, currentRoute} = useRouter() // 路由
  const formDisabled = ref(0)
  const subTabsName = ref('shippingDetail')
  const shippingDetailFormRef = ref()

  const projectInfos = ref([]) // 项目集合
  const projectOrder = ref() //  选中项目


  /** bpm修改 */
  const selectProcessDefinitionName = ref('');
  const activeName = ref('first')
  const bpmnXML = ref(null) // BPMN 数据

  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formData = ref({
    id: undefined,
    contractId: undefined,
    consigner: undefined,
    fileUrl: '',
    consignerDate: undefined,
    deliveryMethod: undefined,
    deliveryBy: undefined,
    deliveryNumber: undefined,
    deliveryContact: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    no: undefined,
  })
  const formRules = reactive({
    projectId: [{required: true, message: '项目不能为空', trigger: 'blur'}],
    no: [{required: true, message: '发货单不能为空', trigger: 'blur'}],
    consigner: [{required: true, message: '发货人不能为空', trigger: 'blur'}],
    consignerDate: [{required: true, message: '发货日期不能为空', trigger: 'blur'}],
  })
  const formRef = ref() // 表单 Ref
  const constractId = ref('0');


  const orderInfo = ref([]) as any


  // 指定审批人
  const processDefineKey = 'dm-receivable-audit' // 流程定义 Key
  const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
  const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
  const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
  const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
  const contractList = ref < ContractApi.ContractVO[] > ([]) // 合同列表



  const getContractId = async (id: string) => {

      if (id){

          contractId.value = id;

      } else {
          contractId.value = undefined;
      }


  }

  const onChangeProject = async (orderId) => {
      const order = projectInfos.value.find((item) => item.id === orderId)
      projectOrder.value = order;
      formData.value.products=[]

      contractList.value = await
          DMContractApi.getContractInfoByProjectId(order.projectId)
      formData.value.companyId = order.companyId;

      orderInfo.value =await DMContractApi.getProjectOrderByProjectId(order.projectId)
  }


  /** 添加/修改操作 */
  const projectRef = ref() // 合同 Ref
  const openForm = () => {
      projectRef.value.open()
  }



  const generatorCode=async ()=>{

      formLoading.value = true
      const data = {
          classificationCode:'SMS_GI',

          encodingRuleType:1,
      }

      try {
          const result = await EncodingRuleApi.createCode(data)
          formData.value.no = result
          debugger
      } finally {

          formLoading.value = false
      }


  }



  const getProject = async (project) => {
      // 选中项目
      formData.value.projectId = project.id
      formData.value.projectName = project.projectCode + '(' + project.projectName + ')'
      // projectId.value =  project.id
      // productList.value = DMContractApi.getProductOrderList(2,project.id)

      contractList.value = await
          DMContractApi.getContractInfoByProjectId(project.id)
      formData.value.companyId = project.projectClient;

      orderInfo.value =await DMContractApi.getMaterialStockByProjectId(project.id)


  }



  /** 提交表单 */
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
      await shippingDetailFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'shippingDetail'
      return
    }

    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ShippingVO
      // 拼接子表的数据
      data.shippingDetails = shippingDetailFormRef.value.getData()
      await ShippingApi.createShipping(data)
      message.success(t('common.createSuccess'))

        const update={code:data.no,status:2}
        await EncodingRuleApi.updateCode(update)

      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false

      push({name: 'Shipping', query: {id: undefined}})

    }
  }

  /** 提交表单 */
  const submitFormAndBpm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
      await shippingDetailFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'shippingDetail'
      return
    }

    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ShippingVO
      // 拼接子表的数据
      data.shippingDetails = shippingDetailFormRef.value.getData()
      await ShippingApi.createShippingAndSubmit(data)
      message.success(t('common.createSuccess'))
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {


      formLoading.value = false
    }
  }


  /** 初始化 */
  onMounted(async () => {
    const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
      undefined,
      processDefineKey
    )

      projectInfos.value=[];
      projectInfos.value = await DMContractApi.getProductOrderList(1);

    if (!processDefinitionDetail) {
      message.error('OA 请假的流程模型未配置，请检查！')
      return
    }

    bpmnXML.value = processDefinitionDetail.bpmnXml
    // 加载用户列表
    userList.value = await UserApi.getSimpleUserList()
    //constractList.value = await ContractApi.getContractListByType(2)

    startUserSelectTasks.value = processDefinitionDetail.startUserSelectTasks
    // 设置指定审批人
    if (startUserSelectTasks.value?.length > 0) {
      // 设置校验规则
      for (const userTask of startUserSelectTasks.value) {
        startUserSelectAssignees.value[userTask.id] = []
        startUserSelectAssigneesFormRules.value[userTask.id] = [
          {required: true, message: '请选择审批人', trigger: 'blur'}
        ]
      }

    }
  })
</script>
