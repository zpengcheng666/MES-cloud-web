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
        <el-form-item label="收货单" prop="no">
          <el-input v-model="formData.no" placeholder="请输入收货单" disabled/>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="合同编号" prop="contractId">
          <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" disabled/>
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

    </el-row>


    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="收货人电话" prop="consignedContact">
          <el-input v-model="formData.consignedContact" placeholder="请输入收货人电话" disabled/>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="发货人" prop="consigner">
          <el-input v-model="formData.consigner" placeholder="请输入发货人" disabled/>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="收货单名" prop="consignmentName">
          <el-input v-model="formData.consignmentName" placeholder="请输入收货单名称" :disabled="formDisabled != 0"/>
        </el-form-item>
      </el-col>

<!--      <el-col :span="8">-->
<!--        <el-form-item label="发货人电话" prop="consignerContact">-->
<!--          <el-input v-model="formData.consignerContact" placeholder="请输入发货人电话" disabled/>-->
<!--        </el-form-item>-->
<!--      </el-col>-->

    </el-row>


    <el-row :gutter="20">

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

      <el-col :span="8">
        <el-form-item label="承运单号" prop="deliveryNumber">
          <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号"  disabled />
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
        <el-form-item label="承运人电话" prop="deliveryContact">
          <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" disabled/>
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


    </el-row>

  </el-form>

  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName">
    <el-tab-pane label="采购明细" name="purchaseConsignmentDetail">
      <PurchaseConsignmentDetailList :consignment-id=" props.id || queryId" />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
import {useTagsViewStore} from '@/store/modules/tagsView'
import * as DefinitionApi from '@/api/bpm/definition'
import PurchaseConsignmentDetailList from '../purchaseconsignment/components/PurchaseConsignmentDetailList.vue'
import * as UserApi from '@/api/system/user'
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import { propTypes } from '@/utils/propTypes'
defineOptions({name: 'PurchaseConsignmentDetail'})


const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const subTabsName = ref('purchaseConsignmentDetail')
const detailLoading = ref(false) // 表单的加载中
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
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  formData.value.id = props.id || queryId ;
  try {

    formData.value = await PurchaseConsignmentApi.getPurchaseConsignment(props.id || queryId)
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
