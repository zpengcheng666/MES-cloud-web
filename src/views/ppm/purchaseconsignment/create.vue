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
              <el-form-item label="收货单" prop="no">
                <!--<el-input v-model="formData.no" placeholder="请输入收货单" :disabled="formDisabled != 0"/>-->

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

            <el-col :span="8">
              <el-form-item label="合同编号" prop="contractId">
                <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item  label="收货人" prop="consignedBy">
                <el-select
                  v-model="formData.consignedBy"
                  clearable
                  filterable
                  placeholder="请选择发货人员"
                  class="!w-1/1"
                  :disabled="formDisabled !=0"
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

          </el-row>


          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item label="收货人电话" prop="consignedContact">
                <el-input v-model="formData.consignedContact" placeholder="请输入收货人电话" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="发货人" prop="consigner">
                <el-input v-model="formData.consigner" placeholder="请输入发货人" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="收货单名" prop="consignmentName">
                <el-input v-model="formData.consignmentName" placeholder="请输入收货单名称" :disabled="formDisabled != 0"/>
              </el-form-item>
            </el-col>

<!--            <el-col :span="8">-->
<!--              <el-form-item label="发货人电话" prop="consignerContact">-->
<!--                <el-input v-model="formData.consignerContact" placeholder="请输入发货人电话" />-->
<!--              </el-form-item>-->
<!--            </el-col>-->

          </el-row>


          <el-row :gutter="20">

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

            <el-col :span="8">
              <el-form-item label="承运单号" prop="deliveryNumber">
                <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="承运人" prop="deliveryBy">
                <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item label="承运人电话" prop="deliveryContact">
                <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" />
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

        </el-form>

        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="采购明细" name="purchaseConsignmentDetail">
            <PurchaseConsignmentDetailForm ref="purchaseConsignmentDetailFormRef" :consignment-id="formData.id" :confirmStatus="formDisabled"
                                           :contract-id="constractId" :orderInfo="orderInfo"  :contractType="formData.contractType" :orderInfos="orderInfos"/>
          </el-tab-pane>
        </el-tabs>
        <el-form>
          <el-form-item>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">保 存</el-button>
            <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading">保存并发起流程</el-button>
          </el-form-item>
        </el-form>

      </el-card>
      <!-- 合同选择 -->
      <PPMContractChoose ref="contractRef" @getContract="getContract"/>

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
// import ShippingDetailForm from '../shipping/components/ShippingDetailForm.vue'
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import PurchaseConsignmentDetailForm from './components/PurchaseConsignmentDetailForm.vue'
import * as UserApi from '@/api/system/user'
import {ContractApi} from '@/api/ppm/contract'
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import PPMContractChoose from "./components/PPMContractChoose.vue"
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'


defineOptions({ name: 'PurchaseConsignmentForm' })
const message = useMessage() // 消息弹窗
const {delView} = useTagsViewStore() // 视图操作
const {push, currentRoute} = useRouter() // 路由
const formDisabled = ref(0)
const subTabsName = ref('purchaseConsignmentDetail')
const purchaseConsignmentDetailFormRef = ref()
const constractId = ref('0');
/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据
const orderInfos = ref([]) as any
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: undefined,
  consignmentName:undefined,
  contractId: undefined,
  companyId: undefined,
  contractNo: undefined,
  consignedBy: undefined,
  no: undefined,
  consignedDate: undefined,
  consignedContact: undefined,
  consigner: undefined,
  consignerContact: undefined,
  consignerDate: undefined,
  deliveryMethod: undefined,
  deliveryNumber: undefined,
  deliveryBy: undefined,
  deliveryContact: undefined,
  processInstanceId: undefined,
  status: undefined,
  department: undefined,
  consignmentStatus: undefined
})
const formRules = reactive({
  contractId: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
  no: [{ required: true, message: '收货单不能为空', trigger: 'blur' }],
  consignedBy: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
  consignedDate: [{ required: true, message: '收货日期不能为空', trigger: 'blur' }],
  consignmentName: [{ required: true, message: '收货单名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const contractId = ref('0');


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
  if (id) {
    contractId.value = id;
    orderInfo.value = await PurchaseConsignmentApi.getContractOrderListByContractId(id);
  } else {
    contractId.value = '0';
  }

}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await purchaseConsignmentDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'purchaseConsignmentDetail'
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseConsignmentVO
    // 拼接子表的数据
    data.purchaseConsignmentDetails = purchaseConsignmentDetailFormRef.value.getData()
    await PurchaseConsignmentApi.createPurchaseConsignmentCreate(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false

    push({name: 'PurchaseConsignment', query: {id: undefined}})

  }
}

const generatorCode=async ()=>{
    formLoading.value = true
    const data = {
        classificationCode:'PM_MR',
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

const cancel = async () => {
    if (formData.value.no && formData.value.id==undefined) {
        const data = formData.value
        const update = {code: data.no, status: 3}
        try {
            let result = await EncodingRuleApi.updateCode(update)
        } finally {
            formLoading.value = false
        }
    }
    dialogVisible.value = false

}




/***
 * 获取产品物码
 * */
const getContract = async (contract) => {
    // 选中合同
    formData.value.contractId = contract.id
    formData.value.contractName = contract.number + '(' + contract.name + ')'
    formData.value.contractType = contract.contractType
    constractId.value = contract.id;
    orderInfo.value =await PurchaseConsignmentApi.getContractOrderListByContractId(contract.id);
    orderInfos.value =await ContractApi.getProjectOrderListInByContractId(contract.id);
}

/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
    contractRef.value.open()
}



/** 提交表单 */
const submitFormAndBpm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await purchaseConsignmentDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'purchaseConsignmentDetail'
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseConsignmentVO
    // 拼接子表的数据
    data.purchaseConsignmentDetails = purchaseConsignmentDetailFormRef.value.getData()
    await PurchaseConsignmentApi.createPurchaseConsignmentCreateAndSubmit(data)
      const update={code:data.no,status:2}
      await EncodingRuleApi.updateCode(update)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {

    formLoading.value = false
    push({name: 'PurchaseConsignment', query: {id: undefined}})
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
  contractList.value = await ContractApi.getContractListByType(1)

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
