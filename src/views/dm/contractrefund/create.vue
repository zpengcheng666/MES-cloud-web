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
        <el-form-item label="退款单号" prop="no">
          <el-input v-model="formData.no" placeholder="请输入退款单号"/>
        </el-form-item>
        <el-form-item label="合同" prop="contractName">


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


          <!--<el-input v-model="formData.contractId" placeholder="请输入合同ID" />-->
        </el-form-item>

        <el-form-item label="退货单" prop="shippingReturnId">


          <el-select
            v-model="formData.shippingReturnId"
            clearable
            placeholder="请选择退货单"
            class="!w-1/1"
            @change="getPrice(formData.shippingReturnId)"
          >
            <el-option
              v-for="item in shippingReturnList"
              :key="item.id"
              :label="item.shippingReturnName + '('+item.shippingReturnNo +')'"
              :value="item.id"
            />
          </el-select>
          <!--<el-input v-model="formData.shippingReturnId" placeholder="请输入退货单" />-->
        </el-form-item>

        <el-form-item label="退款方式" prop="refundType">
          <el-select v-model="formData.refundType" placeholder="请选择退款方式">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.PD_FINANCE_PAY_METHOD)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="退款日期" prop="refundTime">
          <el-date-picker
            v-model="formData.refundTime"
            type="date"
            value-format="x"
            placeholder="选择退款日期"
          />
        </el-form-item>
        <el-form-item label="退款金额" prop="refundPrice">


          <el-input-number
            v-model="formData.refundPrice"
            controls-position="right"
            :min="0.00"
            :precision="2"
            class="!w-100%"
            placeholder="请输入退款金额"
          />
          <!--<el-input v-model="formData.refundPrice" placeholder="请输入退款金额" />-->
        </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="submitForm" type="primary" :disabled="formLoading">保存</el-button>
          <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading">保存并提交审核</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </template>


        <!-- 表单弹窗：添加/修改 -->
        <DMContractChoose ref="contractRef" @getContract="getContract"/>


      </el-card>
    </el-tab-pane>
    <el-tab-pane label="流程图预览" :lazy="true" name="second">
      <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {ContractRefundApi, ContractRefundVO} from '@/api/dm/contractrefund'
  import {ContractApi} from '@/api/ppm/contract'
  import {ShippingReturnApi} from '@/api/dm/shippingreturn'
  import {useTagsViewStore} from '@/store/modules/tagsView'
  import * as DefinitionApi from '@/api/bpm/definition'
  import DMContractChoose from '../shipping/components/DMContractChoose.vue'
  import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
  /** 合同退款 表单 */
  defineOptions({name: 'ContractRefundCreate'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    no: undefined,
    shippingReturnId: undefined,
    contractId: undefined,
    refundType: undefined,
    refundTime: undefined,
    refundPrice: undefined,
  })
  const formRules = reactive({
    contractName: [{required: true, message: '合同不能为空', trigger: 'blur'}],
    no: [{required: true, message: '退款单号不能为空', trigger: 'blur'}],
  })
  const formRef = ref() // 表单 Ref
  /** 添加/修改操作 */
  const contractRef = ref() // 合同 Ref
  const openForm = () => {
    contractRef.value.open()
  }
  const shippingReturnList = ref < ShippingReturnApi.ShippingReturnVO[] > ([]) //合同列表
  const priceValue = ref(0);
  const processDefineKey = 'dm-refund-audit' // 流程定义 Key

  /** bpm修改 */
  const selectProcessDefinitionName = ref('');
  const activeName = ref('first')
  const bpmnXML = ref(null) // BPMN 数据



  /** 初始化 */
  onMounted(async () => {
    debugger
    const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
      undefined,
      processDefineKey
    )
    if (!processDefinitionDetail) {
      message.error('OA 请假的流程模型未配置，请检查！')
      return
    }

    bpmnXML.value = processDefinitionDetail.bpmnXml

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


  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()

    if (priceValue.value > 0 && formData.value.refundPrice > priceValue.value) {
      message.error(t('退款金额不能超过退货单的金额'))
      return;
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ContractRefundVO
      if (formType.value === 'create') {
        await ContractRefundApi.createContractRefund(data)
        message.success(t('common.createSuccess'))
      } else {
        await ContractRefundApi.updateContractRefund(data)
        message.success(t('common.updateSuccess'))
      }
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

    if (priceValue.value > 0 && formData.value.refundPrice > priceValue.value) {
      message.error(t('退款金额不能超过退货单的金额'))
      return;
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ContractRefundVO
      if (formType.value === 'create') {
        await ContractRefundApi.createContractRefundAndSubmit(data)
        message.success(t('common.createSuccess'))
      } else {
        await ContractRefundApi.updateContractRefundAndSubmit(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }


  /***
   * 获取产品物码
   * */
  const getContract = async (contract) => {
    // 选中合同
    formData.value.contractId = contract.id
    formData.value.contractName = contract.number + '(' + contract.name + ')'

    // 获取合同下的退货单
    shippingReturnList.value = await
      ShippingReturnApi.getShippingReturnByContract(contract.id)

    formData.value.shippingReturnId = undefined;
    formData.value.refundPrice = 0.00;

  }

  //获取退货单的价格
  const getPrice = async (shippingReturnId) => {

    const shippingReturn = shippingReturnList.value.find((item) => item.id === shippingReturnId)

    if (shippingReturn) {
      formData.value.refundPrice = shippingReturn.price;
    }

  }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      shippingReturnId: undefined,
      no: undefined,
      contractId: undefined,
      refundType: undefined,
      refundTime: undefined,
      refundPrice: undefined,
      contractName: undefined,
    }
    formRef.value?.resetFields()
  }
</script>
