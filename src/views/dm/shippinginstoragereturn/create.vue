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
              <el-form-item label="退货单编号" prop="no">

                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input v-model="formData.no" placeholder="" :disabled="true"/>
                  </el-col>
                  <el-col :span="8">
                    <el-button @click="generatorCode" type="primary" :disabled="shippingStatus != 0">生 码</el-button>
                  </el-col>
                </el-row>

              </el-form-item>

            </el-col>
            <!--<el-col :span="8">-->
              <!--<el-form-item label="退货单名称" prop="name">-->
                <!--<el-input v-model="formData.name" placeholder="请输入退货单名称" :disabled="shippingStatus !=0"/>-->
              <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :span="8">
              <el-form-item label="项目" prop="projectId">
                <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openForm()" />

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
                        :disabled="shippingStatus !=0"
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
              <el-form-item label="处理方式" prop="returnType">
                <el-select v-model="formData.returnType" placeholder="请选择处理方式" :disabled="shippingStatus !=0"  @change="changeAdd(formData.returnType)">
                  <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.RETURN_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item label="退货人" prop="consigner">
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
                          :value="item.id+''"
                  />
                </el-select>
              </el-form-item>

            </el-col>

            <el-col :span="8">
              <el-form-item label="退货日期" prop="consignerDate">
                <el-date-picker
                        v-model="formData.consignerDate"
                        type="date"
                        value-format="x"
                        placeholder="选择退货日期"
                />
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item label="退换货原因" prop="returnReason">
            <el-input type="textarea" v-model="formData.returnReason" placeholder="请输入退换货原因"/>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="收货人" prop="consignedBy">



                <el-input v-model="formData.consignedBy" placeholder="请输入接收人"/>
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
            <el-col :span="8">
              <el-form-item label="收货人电话" prop="consignedContact">
                <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式"/>
              </el-form-item>

            </el-col>
          </el-row>


        </el-form>

        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="委托加工退货明细" name="shippingReturnDetail">
            <ShippingInstorageReturnDetailForm ref="shippingReturnDetailFormRef" :shipping-return-id="formData.id"
                                               :projectId="projectId"  :orderInfo="detailInfo" :shippingStatus="shippingStatus"/>

          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item>
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
import ShippingInstorageReturnDetailForm from './components/ShippingInstorageReturnDetailForm.vue'
import { ShippingInstorageReturnApi, ShippingInstorageReturnVO } from '@/api/dm/shippinginstoragereturn'
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import * as UserApi from '@/api/system/user'
import {ContractApi} from '@/api/ppm/contract'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import DMProjectChoose from '@/views/dm/contract/components/contractquery/DMProjectChoose.vue'
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'


defineOptions({ name: 'ShippingInstorageReturnFormCreate' })
const message = useMessage() // 消息弹窗
const {delView} = useTagsViewStore() // 视图操作
const {push, currentRoute} = useRouter() // 路由
const formDisabled = ref(0)
const subTabsName = ref('shippingReturnDetail')
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
    shippingId: [{required: true, message: '发货单不能为空', trigger: 'blur'}],
    no: [{required: true, message: '退货单编号不能为空', trigger: 'blur'}],
    projectId: [{required: true, message: '项目不能为空', trigger: 'blur'}],
    // name: [{required: true, message: '退货单名称不能为空', trigger: 'blur'}],
    returnType: [{required: true, message: '处理方式不能为空', trigger: 'change'}],
    returnReason: [{required: true, message: '退换货原因不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
const contractId = ref('0');


const shippingStatus = ref(0)
const projectId = ref('0');//合同
const detailInfo = ref([]) as any
const projectInfos = ref([]) // 项目集合
const projectOrder = ref() //  选中项目
// 指定审批人
const processDefineKey = 'dm-instorage-return-audit' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) // 合同列表

const shippingReturnDetailFormRef = ref()


const getProject = async (project) => {
    // 选中项目
    formData.value.projectId = project.id
    formData.value.projectName = project.projectCode + '(' + project.projectName + ')'

    contractList.value = await
        DMContractApi.getContractInfoByProjectId(project.id)
    formData.value.companyId = project.projectClient;



    detailInfo.value=[];
    detailInfo.value =await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByProjectId(project.id,0,4);


}

/** 添加/修改操作 */
const projectRef = ref() // 合同 Ref
const openForm = () => {
    projectRef.value.open()
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

const submitFormAndBpm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
        await shippingReturnDetailFormRef.value.validate()
    } catch (e) {
        subTabsName.value = 'shippingDetail'
        return
    }
    // 提交请求
    formLoading.value = true
    try {
        const data = formData.value as unknown as ShippingVO
        // 拼接子表的数据
        data.shippingDetails = shippingReturnDetailFormRef.value.getData()
        await ShippingInstorageReturnApi.createShippingInstorageReturnAndSubmit(data)

        const update={code:data.no,status:2}
        await  EncodingRuleApi.updateCode(update)
        message.success(t('common.createSuccess'))
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
    } finally {
        formLoading.value = false
    }
}


const generatorCode=async ()=>{

    formLoading.value = true
    const data = {
        classificationCode:'ODM_MRB',

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
