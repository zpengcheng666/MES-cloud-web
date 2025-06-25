<template>

  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >

    <el-form-item label="退款单号" prop="no">
      <el-input v-model="formData.no" placeholder="请输入退款单号"  disabled/>
    </el-form-item>
    <el-form-item label="合同" prop="contractName">


      <el-input v-model="formData.contractName" placeholder="请选择合同" disabled/>

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
    <el-form-item label="合同号" prop="contractNo">

    <el-input v-model="formData.contractNo" placeholder="请选择合同" disabled/>
    </el-form-item>
    <el-form-item label="退货单" prop="shippingReturnId">


      <el-select
        v-model="formData.shippingReturnId"
        clearable
        placeholder="请选择退货单"
        class="!w-1/1"
        @change="getPrice(formData.shippingReturnId)"
        disabled
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
        :min="0.00"
        :precision="2"
        class="!w-100%"
        placeholder="请输入退款金额"
        disabled
      />
      <!--<el-input v-model="formData.refundPrice" placeholder="请输入退款金额" />-->
    </el-form-item>
  </el-form>

</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {ContractRefundApi, ContractRefundVO} from '@/api/dm/contractrefund'
  import {ContractApi} from '@/api/ppm/contract'
  import {ShippingReturnApi} from '@/api/dm/shippingreturn'
  import {propTypes} from '@/utils/propTypes'
  /** 合同退款 表单 */
  defineOptions({name: 'ContractRefundDetail'})

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
  const detailLoading = ref(false) // 表单的加载中
  const shippingReturnList = ref < ShippingReturnApi.ShippingReturnVO[] > ([]) //合同列表
  const priceValue = ref(0);
  /** 获得数据 */
  const getInfo = async () => {
    detailLoading.value = true
    formData.value.id = props.id || queryId;
    try {

      formData.value = await
        ContractRefundApi.getContractRefund(props.id || queryId)


      // 获取合同下的退货单
      shippingReturnList.value = await
        ShippingReturnApi.getShippingReturnByContract(formData.value.contractId)
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
