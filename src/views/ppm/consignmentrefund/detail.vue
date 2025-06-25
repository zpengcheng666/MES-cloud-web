<template>

  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >

    <el-form-item label="退款单号" prop="no">
      <el-input v-model="formData.no" placeholder="请输入退款单号" disabled/>
    </el-form-item>

    <el-form-item label="合同" prop="contractName">
      <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" disabled/>
    </el-form-item>

    <el-form-item label="退货单" prop="consignmentReturnId">
      <el-select
        v-model="formData.consignmentReturnId"
        clearable
        placeholder="请选择退货单"
        class="!w-1/1"
        @change="getPrice(formData.consignmentReturnId)"
        disabled
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
      <el-select v-model="formData.refundType" placeholder="请选择退款方式" disabled>
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
        disabled
      />
    </el-form-item>

    <el-form-item label="退款金额" prop="refundPrice">
      <el-input-number
        v-model="formData.refundPrice"
        controls-position="right"
        :precision="2"
        class="!w-100%"
        placeholder="请输入退款金额"
        disabled
      />
    </el-form-item>
  </el-form>

</template>
<script setup lang="ts">
import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
import {ConsignmentRefundApi, ConsignmentRefundVO} from '@/api/ppm/consignmentrefund'
import {ContractApi} from '@/api/ppm/contract'
import {ConsignmentReturnApi} from '@/api/ppm/consignmentreturn'
import {propTypes} from '@/utils/propTypes'
/** 合同退款 表单 */
defineOptions({name: 'ConsignmentRefundDetail'})

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const props = defineProps({
  id: propTypes.number.def(undefined)
})
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
  contractName: [{required: true, message: '合同不能为空', trigger: 'blur'}],
  no: [{required: true, message: '退款单号不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
/** 添加/修改操作 */
const contractRef = ref() // 合同 Ref
const openForm = () => {
  contractRef.value.open()
}
const detailLoading = ref(false) // 表单的加载中
const consignmentReturnList = ref < ConsignmentReturnApi.ConsignmentReturnVO[] > ([]) //合同列表
const priceValue=ref(0);
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  formData.value.id = props.id || queryId;
  try {

    formData.value = await
      ConsignmentRefundApi.getConsignmentRefund(props.id || queryId)


    // 获取合同下的退货单
    consignmentReturnList.value = await
      ConsignmentReturnApi.getConsignmentReturnByContract(formData.value.contractId)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({open: getInfo}) // 提供 open 方法，用于打开弹窗


/** 初始化 **/
onMounted(() => {
  getInfo()
})

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
