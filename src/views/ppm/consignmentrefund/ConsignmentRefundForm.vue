<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="退款单号" prop="no">
        <el-input v-model="formData.no" placeholder="请输入退款单号" />
      </el-form-item>

      <el-form-item label="合同" prop="contractName">
        <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>
      </el-form-item>

      <el-form-item label="退货单" prop="consignmentReturnId">
        <el-select
          v-model="formData.consignmentReturnId"
          clearable
          placeholder="请选择退货单"
          class="!w-1/1"
          @change="getPrice(formData.consignmentReturnId)"
        >
          <el-option
            v-for="item in consignmentReturnList"
            :key="item.id"
            :label="item.consignmentReturnName + '('+item.consignmentReturnNo +')'"
            :value="item.id"
          />
        </el-select>
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
          :precision="2"
          class="!w-100%"
          placeholder="请输入退款金额"
        />
      </el-form-item>

    </el-form>


    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">保存</el-button>
      <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading">保存并提交审核</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>


    <!-- 表单弹窗：添加/修改 -->
    <PPMContractChoose ref="contractRef" @getContract="getContract"/>


  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ConsignmentRefundApi, ConsignmentRefundVO } from '@/api/ppm/consignmentrefund'
import {ConsignmentReturnApi} from "@/api/ppm/consignmentreturn";
import {ContractRefundApi, ContractRefundVO} from "@/api/dm/contractrefund";
import PPMContractChoose from "../purchaseconsignment/components/PPMContractChoose.vue"

/** 采购退款单 表单 */
defineOptions({ name: 'ConsignmentRefundForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  no: undefined,
  consignmentReturnId: undefined,
  contractId: undefined,
  refundType: undefined,
  refundTime: undefined,
  refundPrice: undefined,
  status: undefined,
  processInstanceId: undefined,
  refundStatus: undefined,
})
const formRules = reactive({
  no: [{ required: true, message: '采购退款单号不能为空', trigger: 'blur' }],
  contractId: [{ required: true, message: '合同不能为空', trigger: 'blur' }],
    contractName: [{ required: true, message: '合同不能为空', trigger: 'blur' }],
    refundPrice: [{ required: true, message: '退款金额不能为空', trigger: 'blur' }],
    refundType: [{required: true, message: '退款方式不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref

/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
  contractRef.value.open()
}
const consignmentReturnList = ref < ConsignmentReturnApi.ConsignmentReturnVO[] > ([]) //合同列表
const  priceValue=ref(0);

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  consignmentReturnList.value=[]
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ConsignmentRefundApi.getConsignmentRefund(id)

      if (formData.value.contractId){
        // 获取合同下的退货单
        consignmentReturnList.value = await
        ConsignmentReturnApi.getConsignmentReturnByContract(formData.value.contractId)
        const consignmentReturn = consignmentReturnList.value.find((item) => item.id === formData.value.consignmentReturnId)

        priceValue.value= consignmentReturn.price
      }

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

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ConsignmentRefundVO
    if (formType.value === 'create') {
      await ConsignmentRefundApi.createConsignmentRefund(data)
      message.success(t('common.createSuccess'))
    } else {
      await ConsignmentRefundApi.updateConsignmentRefund(data)
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

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ConsignmentRefundVO
    if (formType.value === 'create') {
      await ConsignmentRefundApi.createConsignmentRefundAndSubmit(data)
      message.success(t('common.createSuccess'))
    } else {
      await ConsignmentRefundApi.updateConsignmentRefundAndSubmit(data)
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
  consignmentReturnList.value = await
    ConsignmentReturnApi.getConsignmentReturnByContract(contract.id)

  formData.value.consignmentReturnId = undefined;
  formData.value.refundPrice = null;

}

//获取退货单的价格
const getPrice = async (consignmentReturnId) => {

  const consignmentReturn = consignmentReturnList.value.find((item) => item.id === consignmentReturnId)

  if (consignmentReturn){
    formData.value.refundPrice = consignmentReturn.price;
  }

}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    no: undefined,
    consignmentReturnId: undefined,
    contractId: undefined,
    refundType: undefined,
    refundTime: undefined,
    refundPrice: undefined,
    status: undefined,
    processInstanceId: undefined,
    refundStatus: undefined,
    contractName: undefined,
  }
  formRef.value?.resetFields()
}
</script>
