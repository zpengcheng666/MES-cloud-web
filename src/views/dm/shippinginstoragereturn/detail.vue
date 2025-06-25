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
        <el-form-item label="退货单编号" prop="no">
          <el-input v-model="formData.no" placeholder="请输入退货单编号" disabled/>
        </el-form-item>

      </el-col>
      <el-col :span="8">
        <el-form-item label="退货单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入退货单名称" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="项目" prop="projectId">
          <el-input v-model="formData.projectName" placeholder="请选择项目" disabled/>

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
                  disabled
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
          <el-select v-model="formData.returnType" placeholder="请选择处理方式" disabled @change="changeAdd(formData.returnType)">
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
        <el-form-item label="退货日期" prop="consignerDate">
          <el-date-picker
                  v-model="formData.consignerDate"
                  type="date"
                  value-format="x"
                  placeholder="选择退货日期"
                  disabled
          />
        </el-form-item>
      </el-col>
    </el-row>


    <el-form-item label="退换货原因" prop="returnReason">
      <el-input type="textarea" v-model="formData.returnReason" placeholder="请输入退换货原因" disabled/>
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="收货人" prop="consignedBy">



          <el-input v-model="formData.consignedBy" placeholder="请输入接收人" disabled/>
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
        <el-form-item label="收货人电话" prop="consignedContact">
          <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" disabled/>
        </el-form-item>

      </el-col>
    </el-row>

  </el-form>

  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName">
    <el-tab-pane label="委托加工入库明细" name="shippingInstorageReturnDetail">
      <ShippingInstorageReturnDetailList ref="shippingInstorageDetailFormRef" :shipping-storage-return-id="props.id || queryId"  :projectOrders="projectOrders"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {useTagsViewStore} from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import ShippingInstorageReturnDetailList from './components/ShippingInstorageReturnDetailList.vue'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import * as UserApi from '@/api/system/user'
import { propTypes } from '@/utils/propTypes'
import { ShippingInstorageReturnApi, ShippingInstorageReturnVO } from '@/api/dm/shippinginstoragereturn'
defineOptions({name: 'DMShippingInstorageReturnDetail'})


const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

const subTabsName = ref('shippingInstorageReturnDetail')
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

const projectInfos = ref([]) // 项目集合
const projectOrders = ref() //  选中项目
const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  formData.value.id = props.id || queryId ;
  try {
    formData.value = await  ShippingInstorageReturnApi.getShippingInstorageReturn(props.id || queryId)
      contractList.value = await
          DMContractApi.getContractInfoByProjectId(formData.value.projectId)

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
