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
                label-width="120px"
                v-loading="formLoading"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="退货单编号" prop="no">
                <!--<el-input v-model="formData.no" placeholder="请输入退货单编号" :disabled="consignmentStatus !=0"/>-->

                <el-row :gutter="20">
                  <el-col :span="16">
                    <el-input v-model="formData.no" placeholder="" :disabled="true"/>
                  </el-col>
                  <el-col :span="8">
                    <el-button @click="generatorCode" type="primary" >生 码</el-button>
                  </el-col>
                </el-row>
              </el-form-item>

            </el-col>
            <!--<el-col :span="8">-->
              <!--<el-form-item label="退货单名称" prop="name">-->
                <!--<el-input v-model="formData.name" placeholder="请输入退货单名称" :disabled="consignmentStatus !=0"/>-->
              <!--</el-form-item>-->
            <!--</el-col>-->

            <el-col :span="8">
              <el-form-item label="合同号" prop="contractId">
                <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>

              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理方式" prop="returnType">
                <el-select v-model="formData.returnType" placeholder="请选择处理方式" :disabled="consignmentStatus !=0"  @change="changeAdd(formData.returnType)">
                  <el-option
                          v-for="dict in getIntDictOptions(DICT_TYPE.RETURN_TYPE)"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          <!--</el-row>-->

          <!--<el-row :gutter="20">-->

            <el-col :span="8">
              <el-form-item label="退货人" prop="consigner">
                <el-input v-model="formData.consigner" placeholder="请输入退货人"/>
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
              <el-form-item label="接收人" prop="consignedBy">

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


                <!--<el-input v-model="formData.consignedBy" placeholder="请输入接收人"/>-->
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
          <el-tab-pane label="外协退货单详情" name="contractConsignmentReturnDetail">
            <ContractConsignmentReturnDetailForm ref="contractConsignmentReturnDetailFormRef" :consignment-return-id="formData.id"   :orderInfo="detailInfo"
                                                 :consignmentStatus="consignmentStatus" :contractId="contractId"/>
          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
            <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading">保存并发起流程</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="流程图预览" :lazy="true" name="second">
      <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any"/>
    </el-tab-pane>
  </el-tabs>
  <!-- 合同选择 -->
  <PPMContractChooseForOut ref="contractRef" @getContract="getContract"/>

</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {useTagsViewStore} from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import { ContractConsignmentReturnApi, ContractConsignmentReturnVO } from '@/api/ppm/contractconsignmentreturn'
import ContractConsignmentReturnDetailForm from './components/ContractConsignmentReturnDetailForm.vue'
import PPMContractChooseForOut from "../contractconsignment/components/PPMContractChooseForOut.vue"
import * as UserApi from '@/api/system/user'
import {ContractApi} from '@/api/ppm/contract'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'


defineOptions({ name: 'ContractConsignmentFormReturnCreate' })
const message = useMessage() // 消息弹窗
const {delView} = useTagsViewStore() // 视图操作
const {push, currentRoute} = useRouter() // 路由
const formDisabled = ref(0)
const subTabsName = ref('contractConsignmentReturnDetail')
const contractConsignmentReturnDetailFormRef = ref()

/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据
const detailInfo = ref([]) as any
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
    no: [{ required: true, message: '单号不能为空', trigger: 'blur' }],
    // name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    contractId: [{ required: true, message: '合同不能为空', trigger: 'blur' }],
    returnType: [{ required: true, message: '处理方式 不能为空', trigger: 'change' }],
    returnReason: [{ required: true, message: '退换货原因不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const contractId = ref('0');

const orderInfo = ref([]) as any
const consignmentStatus = ref(0)

// 指定审批人
const processDefineKey = 'pm-contract-consignment-audit' // 流程定义 Key
const startUserSelectTasks = ref([]) // 发起人需要选择审批人的用户任务列表
const startUserSelectAssignees = ref({}) // 发起人选择审批人的数据
const startUserSelectAssigneesFormRef = ref() // 发起人选择审批人的表单 Ref
const startUserSelectAssigneesFormRules = ref({}) // 发起人选择审批人的表单 Rules
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) // 合同列表



/***
 * 获取产品物码
 * */
const getContract = async (contract) => {
    // 选中合同
    formData.value.companyId=contract.party
    formData.value.contractId=contract.id
    formData.value.contractName=contract.number +'('+contract.name+')'
    contractId.value = contract.id;
    detailInfo.value=[];
    //获取合同下所有的外协发货单详细
    detailInfo.value =await ShippingApi.getShippingDetailByProject(0,contract.id,2);
}


/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
    contractRef.value.open()
}


const generatorCode=async ()=>{
    formLoading.value = true
    const data = {
        classificationCode:'OEM_MRB',
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

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
        await contractConsignmentReturnDetailFormRef.value.validate()
    } catch (e) {
        subTabsName.value = 'contractConsignmentReturnDetail'
        return
    }
    // 提交请求
    formLoading.value = true
    try {
        const data = formData.value as unknown as ContractConsignmentReturnVO
        // 拼接子表的数据
        data.purchaseConsignmentDetails = contractConsignmentReturnDetailFormRef.value.getData()
        if (formType.value === 'create') {
            await ContractConsignmentReturnApi.createContractConsignmentReturn(data)
            const update={code:data.no,status:2}
            await EncodingRuleApi.updateCode(update)
            message.success(t('common.createSuccess'))
        } else {
            await ContractConsignmentReturnApi.updateContractConsignmentReturn(data)
            message.success(t('common.updateSuccess'))
        }
        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
    } finally {
        formLoading.value = false
    }
}

const submitFormAndAudit = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
        await contractConsignmentReturnDetailFormRef.value.validate()
    } catch (e) {
        subTabsName.value = 'contractConsignmentReturnDetail'
        return
    }
    // 提交请求
    formLoading.value = true
    try {
        const data = formData.value as unknown as ContractConsignmentReturnVO
        // 拼接子表的数据
        data.purchaseConsignmentDetails = contractConsignmentReturnDetailFormRef.value.getData()
        if (formType.value === 'create') {
            await ContractConsignmentReturnApi.createContractConsignmentReturnAndSubmit(data)
            const update={code:data.no,status:2}
            await EncodingRuleApi.updateCode(update)
            message.success(t('common.createSuccess'))
        } else {
            await ContractConsignmentReturnApi.updateContractConsignmentReturnAndSubmit(data)
            message.success(t('common.updateSuccess'))
        }
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
