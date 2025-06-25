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
            <!--<el-col :span="8">-->
              <!--<el-form-item label="入库单名称" prop="name">-->
                <!--<el-input v-model="formData.name" placeholder="请输入入库单名称"/>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :span="8">
              <el-form-item label="入库单号" prop="no">
                <!--<el-input v-model="formData.no" placeholder="请输入入库单"/>-->

                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input v-model="formData.no" placeholder="" :disabled="true"/>
                  </el-col>
                  <el-col :span="8">
                    <el-button @click="generatorCode" type="primary"  >生 码</el-button>
                  </el-col>
                </el-row>

              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目" prop="projectId">
                <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openForm()" />
              </el-form-item>
            </el-col>
          <!--</el-row>-->

          <!--<el-row :gutter="20">-->
            <el-col :span="8">
              <el-form-item label="合同" prop="contractId">
                <el-select
                        v-model="formData.contractId"
                        clearable
                        filterable
                        placeholder="请选择合同"
                        class="!w-1/1"
                        @change="getContractId(formData.contractId)"
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
            <el-col :span="8">

              <el-form-item label="收货人" prop="consignedBy">
                <!--<el-input v-model="formData.consignedBy" placeholder="请输入收货人"/>-->

                <el-select
                        v-model="formData.consignedBy"
                        clearable
                        filterable
                        placeholder="请选择收货人员"
                        class="!w-1/1"
                >
                  <el-option
                          v-for="item in userList"
                          :key="item.id"
                          :label="item.nickname +'('+item.deptName+')'"
                          :value="item.id+''"
                  />
                </el-select>
              </el-form-item>

            </el-col>

            <el-col :span="8">
              <el-form-item label="收货日期" prop="consignedDate">
                <el-date-picker
                        v-model="formData.consignedDate"
                        type="date"
                        value-format="x"
                        placeholder="选择收货日期"
                />
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
            <el-col :span="8">

              <el-form-item label="发货人" prop="consigner">
                <el-input v-model="formData.consigner" placeholder="请输入发货人"/>
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="承运人" prop="deliveryBy">
                <el-input v-model="formData.deliveryBy" placeholder="请输入承运人"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="承运单号" prop="deliveryNumber">
                <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="承运人电话" prop="deliveryContact">
                <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="承运方式" prop="deliveryMethod">
                <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式">
                  <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.TRANSPORT_WAY)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="销售订单入库明细" name="shippingInstorageDetail">
            <ShippingInstorageDetailForm ref="shippingInstorageDetailFormRef" :consignmentIdd="formData.id"
                                         :projectOrders="projectOrders" :confirmStatus="formDisabled"/>
          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
            <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading">保存并发起流程</el-button>
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
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import ShippingInstorageDetailForm from './components/ShippingInstorageDetailForm.vue'
import {ShippingInstorageApi, ShippingInstorageVO} from '@/api/dm/shippinginstorage'
import * as UserApi from '@/api/system/user'
import {ContractApi} from '@/api/ppm/contract'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import DMProjectChoose from '@/views/dm/contract/components/contractquery/DMProjectChoose.vue'
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
defineOptions({ name: 'ShippingInstorageFormCreate' })
const message = useMessage() // 消息弹窗
const {delView} = useTagsViewStore() // 视图操作
const {push, currentRoute} = useRouter() // 路由
const formDisabled = ref(0)
const subTabsName = ref('shippingInstorageDetail')
const shippingInstorageDetailFormRef = ref()

/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
    id: undefined,
    name: undefined,
    no: undefined,
    contractId: undefined,
    companyId: undefined,
    productId: undefined,
    consigner: undefined,
    consignerDate: undefined,
    deliveryMethod: undefined,
    deliveryBy: undefined,
    deliveryNumber: undefined,
    deliveryContact: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    status: undefined,
    processInstanceId: undefined,
    fileUrl: undefined,
    shippingInstorageStatus: undefined,
})
const formRules = reactive({
    no: [{required: true, message: '入库单不能为空', trigger: 'blur'}],
    projectId: [{required: true, message: '项目不能为空', trigger: 'blur'}],
    consignedBy: [{required: true, message: '收货人不能为空', trigger: 'blur'}],
    consignedDate: [{required: true, message: '收货日期不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
const contractId = ref('0');


const orderInfo = ref([]) as any
const projectInfos = ref([]) // 项目集合
const projectOrder = ref() //  选中项目
const projectOrders = ref([]) // 项目集合
// 指定审批人
const processDefineKey = 'dm-instorage-audit' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) // 合同列表



const getProject = async (project) => {
    // 选中项目
    formData.value.projectId = project.id
    formData.value.projectName = project.projectCode + '(' + project.projectName + ')'
    // projectId.value =  project.id
    // productList.value = DMContractApi.getProductOrderList(2,project.id)

    contractList.value = await
        DMContractApi.getContractInfoByProjectId(project.id)
    formData.value.companyId = project.projectClient;

    projectOrders.value = await DMContractApi.getProductOrderList(1,project.id);

    //
    // orderInfo.value =await DMContractApi.getMaterialStockByProjectId(project.id)
    //

}


/** 添加/修改操作 */
const projectRef = ref() // 合同 Ref
const openForm = () => {
    projectRef.value.open()
}


const generatorCode=async ()=>{
    formLoading.value = true
    const data = {
        classificationCode:'ODM_MR',

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




const onChangeProject = async (orderId) => {
    const order = projectInfos.value.find((item) => item.projectId === orderId)
    projectOrder.value = order;

    contractList.value = await
        DMContractApi.getContractInfoByProjectId(order.projectId)

    formData.value.companyId = order.companyId;
}


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
        await shippingInstorageDetailFormRef.value.validate()
    } catch (e) {
        subTabsName.value = 'shippingInstorageDetail'
        return
    }
    // 提交请求
    formLoading.value = true
    try {
        const data = formData.value as unknown as ShippingInstorageVO
        // 拼接子表的数据
        data.purchaseConsignmentDetails = shippingInstorageDetailFormRef.value.getData()
        await ShippingInstorageApi.createShippingInstorageAndSubmit(data)

        const update={code:data.no,status:2}
        await EncodingRuleApi.updateCode(update)

        message.success(t('common.createSuccess'))
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
    } finally {
        formLoading.value = false
    }
}


const submitFormAndBpm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
        await shippingInstorageDetailFormRef.value.validate()
    } catch (e) {
        subTabsName.value = 'shippingDetail'
        return
    }
    // 提交请求
    formLoading.value = true
    try {
        const data = formData.value as unknown as ShippingVO
        // 拼接子表的数据
        data.shippingDetails = shippingInstorageDetailFormRef.value.getData()

        await ShippingInstorageApi.createShippingInstorageAndSubmit(data)
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
  debugger;
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
    undefined,
    processDefineKey
  )
  if (!processDefinitionDetail) {
    message.error('OA 请假的流程模型未配置，请检查！')
    return
  }

  bpmnXML.value = processDefinitionDetail.bpmnXml
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
    projectInfos.value=[];
    projectInfos.value = await DMContractApi.getProductOrderList(1);
    projectOrder.value=undefined;

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
