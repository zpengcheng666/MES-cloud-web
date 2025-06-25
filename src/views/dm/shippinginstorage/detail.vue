<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="入库单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入入库单名称" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入库单号" prop="no">
          <el-input v-model="formData.no" placeholder="请输入入库单" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="项目" prop="projectId">

          <el-input v-model="formData.projectName" placeholder="请选择项目"  disabled/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="合同" prop="contractId">
          <el-select
                  v-model="formData.contractId"
                  clearable
                  filterable
                  placeholder="请选择合同"
                  class="!w-1/1"
                  @change="getContractId(formData.contractId)"
                  disabled
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
    </el-row>
    <el-row :gutter="20">
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

        <el-form-item label="发货人" prop="consigner">
          <el-input v-model="formData.consigner" placeholder="请输入发货人" disabled/>
        </el-form-item>

      </el-col>
      <el-col :span="8">
        <el-form-item label="承运人" prop="deliveryBy">
          <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" disabled/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20">
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
      <el-col :span="8">
        <el-form-item label="承运方式" prop="deliveryMethod">
          <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式" disabled>
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
    <el-tab-pane label="委托加工入库明细" name="shippingInstorageDetail">
      <ShippingInstorageDetailList ref="shippingInstorageDetailFormRef" :shipping-storage-id="props.id || queryId"  :projectOrders="projectOrders"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {useTagsViewStore} from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import ShippingInstorageDetailList from './components/ShippingInstorageDetailList.vue'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import * as UserApi from '@/api/system/user'
import { propTypes } from '@/utils/propTypes'
import {ShippingInstorageApi, ShippingInstorageVO} from '@/api/dm/shippinginstorage'
defineOptions({name: 'DMShippingInstorageDetail'})


const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

const subTabsName = ref('shippingInstorageDetail')
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
    no: [{required: true, message: '入库单不能为空', trigger: 'blur'}],
    projectId: [{required: true, message: '项目不能为空', trigger: 'blur'}],
    consignedBy: [{required: true, message: '收货人不能为空', trigger: 'blur'}],
    consignedDate: [{required: true, message: '收货日期不能为空', trigger: 'blur'}],
})

const projectOrders = ref() //  选中项目
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  formData.value.id = props.id || queryId ;
  try {
    formData.value = await  ShippingInstorageApi.getShippingInstorage(props.id || queryId)
      contractList.value = await
          DMContractApi.getContractInfoByProjectId(formData.value.projectId)


      projectOrders.value = await DMContractApi.getProductOrderList(1,formData.value.projectId);


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
