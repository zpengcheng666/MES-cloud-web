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
            <!--<el-input v-model="formData.no" placeholder="请输入退货单编号"/>-->

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
            <!--<el-input v-model="formData.name" placeholder="请输入退货单名称"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <el-col :span="8">
          <el-form-item label="合同号" prop="contractId">
            <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>
            <!--<el-select-->
              <!--v-model="formData.contractId"-->
              <!--clearable-->
              <!--filterable-->
              <!--placeholder="请选择合同"-->
              <!--class="!w-1/1"-->
              <!--@change="getContractId(formData.contractId)"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in contractList"-->
                <!--:key="item.id"-->
                <!--:label="item.name + '('+item.number +')'"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->

          </el-form-item>
        </el-col>

      <!--</el-row>-->


      <!--<el-row :gutter="20">-->
        <el-col :span="8">
          <el-form-item label="处理方式" prop="returnType">
            <el-select v-model="formData.returnType" placeholder="请选择处理方式"   @change="changeAdd(formData.returnType)" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.CONSIGNMENT_RETURN_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="退货人" prop="consigner">

            <el-select
              v-model="formData.consigner"
              clearable
              filterable
              placeholder="请选择退货人员"
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
        <el-input type="textarea" v-model="formData.returnReason" placeholder="请输入退换货原因" />
      </el-form-item>

      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="接收人" prop="consignedBy">
            <el-input v-model="formData.consignedBy" placeholder="请输入接收人" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="收货人电话" prop="consignedContact">
            <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="退货日期" prop="consignedDate">
            <el-date-picker
              v-model="formData.consignedDate"
              type="date"
              value-format="x"
              placeholder="选择退货日期"
            />
          </el-form-item>
        </el-col>

      </el-row>

      <!--<el-form-item label="备注" prop="remark">-->
      <!--<el-input v-model="formData.remark" placeholder="请输入备注"/>-->
      <!--</el-form-item>-->
    </el-form>
    <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName" v-show="returnType !=4">
          <el-tab-pane label="采购退货单详情" name="consignmentReturnDetail">
            <ConsignmentReturnDetailForm ref="consignmentReturnDetailFormRef" :consignment-return-id="formData.id"
                                         :contractId="contractId"  :detailInfo="detailInfo"   :consignment-status="formData.shippingStatus"/>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
        <el-button @click="submitForm" type="primary" :disabled="formLoading">保存</el-button>
        <el-button @click="submitFormAndAudit" type="primary" :disabled="formLoading">保存并提交审核</el-button>
        </template>

      </el-card>
      <!-- 合同选择 -->
      <PPMContractChoose ref="contractRef" @getContract="getContract"/>
    </el-tab-pane>
    <el-tab-pane label="流程图预览" :lazy="true" name="second">
      <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any"/>
    </el-tab-pane>
  </el-tabs>


</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ConsignmentReturnApi, ConsignmentReturnVO } from '@/api/ppm/consignmentreturn'
import * as DefinitionApi from '@/api/bpm/definition'
import * as UserApi from "@/api/system/user";
import {ContractApi} from "@/api/ppm/contract";
import ConsignmentReturnDetailForm from "@/views/ppm/consignmentreturn/components/ConsignmentReturnDetailForm.vue";
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import {useTagsViewStore} from "@/store/modules/tagsView";
import PPMContractChoose from "../purchaseconsignment/components/PPMContractChoose.vue"
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
/** 采购退货单 表单 */
defineOptions({ name: 'ConsignmentReturnCreate' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const processDefineKey = 'pm-return-audit' // 流程定义 Key
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  consignmentDetailId:undefined,
  no: undefined,
  name: undefined,
  contractId: undefined,
  consigner: undefined,
  consignerDate: undefined,
  consignedBy: undefined,
  consignedDate: undefined,
  consignedContact: undefined,
  returnType: undefined,
  returnReason: undefined,
  processInstanceId: undefined,
  status: undefined,
  shippingStatus: undefined,
  fileUrl: undefined,
  remark: undefined,
})
const formRules = reactive({
  no: [{ required: true, message: '退货单编号不能为空', trigger: 'blur' }],
  contractId: [{ required: true, message: '合同ID不能为空', trigger: 'blur' }],
  returnType: [{ required: true, message: '处理方式 1返修2换货3退货退款4仅退款不能为空', trigger: 'change' }],
  returnReason: [{ required: true, message: '退换货原因不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '审批状态不能为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
const {push, currentRoute} = useRouter() // 路由
const {delView} = useTagsViewStore() // 视图操作
const contractId = ref('0');//合同
const detailInfo = ref([]) as any
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

/** bpm修改 */
const selectProcessDefinitionName = ref('');
const activeName = ref('first')
const bpmnXML = ref(null) // BPMN 数据
// const shippingList = ref < ShippingApi.ShippingVO[] > ([]) //发货单列表
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表

const returnType=ref(1)
const shippingStatus = ref(0)
const changeAdd = async (type)=>{
  returnType.value = type
}

/** 子表的表单 */
const subTabsName = ref('consignmentReturnDetail')
const consignmentReturnDetailFormRef = ref()


/** 初始化 */
onMounted(async () => {
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
  userList.value = await
    UserApi.getSimpleUserList()


// // 加载发货单列表
//     shippingList.value = await
//     ShippingApi.getShippingList("0,1,2,3")


  // 加载合同列表
  contractList.value = await
    ContractApi.getContractListByType(1)

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


const generatorCode=async ()=>{
    formLoading.value = true
    const data = {
        classificationCode:'PM_MRB',
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

//合同点击事件
const getContractId = async (id: string) => {
  if (id){

    const contract = contractList.value.find((item) => item.id === id)
    formData.value.companyId=contract.party
    contractId.value = id;

    detailInfo.value =await PurchaseConsignmentApi.getConsignmentDetailByContractId(id);
  } else {
    contractId.value ='0';
  }


}






/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
    contractRef.value.open()
}




/***
 * 获取产品物码
 * */
const getContract = async (contract) => {
    debugger
    // 选中合同
    formData.value.contractId = contract.id
    formData.value.contractName = contract.number + '(' + contract.name + ')'
    formData.value.contractType = contract.contractType
    contractId.value = contract.id;
    detailInfo.value = await
        PurchaseConsignmentApi.getConsignmentDetailByContractId(contract.id);
}


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await consignmentReturnDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'consignmentReturnDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ConsignmentReturnVO
    // 拼接子表的数据
    data.shippingDetails = consignmentReturnDetailFormRef.value.getData()
    await ConsignmentReturnApi.createConsignmentReturn(data)
      const update={code:data.no,status:2}
      await EncodingRuleApi.updateCode(update)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false

    push({name: 'ConsignmentReturn', query: {id: undefined}})
  }
}

//保存并提交审核
const submitFormAndAudit = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await consignmentReturnDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'consignmentReturnDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ConsignmentReturnVO
    // 拼接子表的数据
    data.shippingDetails = consignmentReturnDetailFormRef.value.getData()
    await ConsignmentReturnApi.createConsignmentReturnAndAudit(data)
      const update={code:data.no,status:2}
      await EncodingRuleApi.updateCode(update)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false

    push({name: 'ConsignmentReturn', query: {id: undefined}})
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    consignmentDetailId:undefined,
    no: undefined,
    name: undefined,
    contractId: undefined,
    consigner: undefined,
    consignerDate: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    returnType: undefined,
    returnReason: undefined,
    processInstanceId: undefined,
    status: undefined,
    shippingStatus: undefined,
    fileUrl: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
