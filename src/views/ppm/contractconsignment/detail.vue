<template>
  <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          v-loading="formLoading"
  >

    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="发货单编号" prop="no">
          <el-input v-model="formData.no" placeholder="请输入发货单编号" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="发货单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入发货单名称" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同编号" prop="contractName">
          <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <!--<el-form-item label="公司" prop="companyId">-->
    <!--<el-input v-model="formData.companyId" placeholder="请输入公司ID" />-->
    <!--</el-form-item>-->
    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="发货人" prop="consigner">
          <el-select
                  v-model="formData.consigner"
                  clearable
                  filterable
                  placeholder="请选择发货人员"
                  class="!w-1/1"
                  disabled
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
        <el-form-item label="发货日期" prop="consignerDate">
          <el-date-picker
                  v-model="formData.consignerDate"
                  type="date"
                  value-format="x"
                  placeholder="选择发货日期"
                  disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运方式" prop="deliveryMethod">
          <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式"  disabled>
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
    <el-row :gutter="20" >
      <el-col :span="8" >
        <el-form-item label="承运人" prop="deliveryBy">
          <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运单号" prop="deliveryNumber">
          <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运人电话" prop="deliveryContact">
          <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" >
      <el-col :span="8">
        <el-form-item label="收货人" prop="consignedBy">
          <el-input v-model="formData.consignedBy" placeholder="请输入收货人" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货日期" prop="consignedDate">
          <el-date-picker
                  v-model="formData.consignedDate"
                  type="date"
                  value-format="x"
                  placeholder="选择收货日期"
                  disabled
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人联系方式" prop="consignedContact">
          <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" disabled/>
        </el-form-item>

      </el-col>
    </el-row>
  </el-form>
  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName">
    <el-tab-pane label="外协发货单详情" name="contractConsignmentDetail">
      <ContractConsignmentDetailList ref="contractConsignmentDetailFormRef" :consignment-id="props.id || queryId"  />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {ContractConsignmentApi, ContractConsignmentVO} from '@/api/ppm/contractconsignment'
    import ContractConsignmentDetailList from './components/ContractConsignmentDetailList.vue'
    import PPMContractChooseForOut from "./components/PPMContractChooseForOut.vue"
    import {ContractApi, ContractStatusVO, ContractVO} from '@/api/ppm/contract'
    import * as UserApi from '@/api/system/user'
    import { propTypes } from '@/utils/propTypes'
defineOptions({name: 'ContractConsignmentFormDetail'})


const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const subTabsName = ref('contractConsignmentDetail')
const detailLoading = ref(false) // 表单的加载中
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
    no: [{required: true, message: '发货单编号不能为空', trigger: 'blur'}],
    name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
    contractName: [{required: true, message: '合同不能为空', trigger: 'blur'}],
    consigner: [{required: true, message: '发货人不能为空', trigger: 'blur'}],
    consignerDate: [{required: true, message: '发货日期不能为空', trigger: 'blur'}],
    status: [{required: true, message: '审批状态不能为空', trigger: 'change'}],
})
    const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

const orderInfo = ref([]) // 项目集合
const projectOrder = ref() //  选中项目
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  formData.value.id = props.id || queryId ;
  try {

      formData.value = await
          ContractConsignmentApi.getContractConsignment(props.id || queryId)

      orderInfo.value =await ContractApi.getProjectOrderListByContractId(formData._value.contractId);
      userList.value = await
          UserApi.getSimpleUserList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
