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
        <el-form-item label="合同号" prop="contractId">
          <el-input v-model="formData.contractName" placeholder="请选择合同"  disabled/>
          <!--<el-select-->
            <!--v-model="formData.contractId"-->
            <!--clearable-->
            <!--filterable-->
            <!--placeholder="请选择合同"-->
            <!--class="!w-1/1"-->
            <!--disabled-->
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

    </el-row>


    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="处理方式" prop="returnType">
          <el-select v-model="formData.returnType" placeholder="请选择处理方式"   @change="changeAdd(formData.returnType)" disabled>
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.RETURN_TYPE)"
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
            disabled
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
        <el-form-item label="接收人" prop="consignedBy">
          <el-input v-model="formData.consignedBy" placeholder="请输入接收人" disabled/>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="收货人电话" prop="consignedContact">
          <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="退货日期" prop="consignedDate">
          <el-date-picker
            v-model="formData.consignedDate"
            type="date"
            value-format="x"
            placeholder="选择退货日期"
            disabled
          />
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName" v-show="returnType !=4">
    <el-tab-pane label="采购退货单详情" name="consignmentReturnDetail">
      <ConsignmentReturnDetailList ref="consignmentReturnDetailFormRef" :consignment-return-id="props.id || queryId"/>
    </el-tab-pane>
  </el-tabs>

</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {useTagsViewStore} from '@/store/modules/tagsView'
  import ConsignmentReturnDetailList from './components/ConsignmentReturnDetailList.vue'
  import * as UserApi from '@/api/system/user'
  import {ContractApi} from '@/api/ppm/contract'
  import {propTypes} from '@/utils/propTypes'
  import {ConsignmentReturnApi} from "@/api/ppm/consignmentreturn";
  import PurchaseConsignmentDetailForm from "@/views/ppm/purchaseconsignment/components/PurchaseConsignmentDetailForm.vue";
  /** 销售退货单 表单 */
  defineOptions({name: 'ConsignmentReturnDetail'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗
  const processDefineKey = 'dm-return-audit' // 流程定义 Key
  const props = defineProps({
    id: propTypes.number.def(undefined)
  })
  const { query } = useRoute() // 查询参数
  const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

  const formData = ref({
    id: undefined,
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

  const formRef = ref() // 表单 Ref
  const {delView} = useTagsViewStore() // 视图操作
  const {push, currentRoute} = useRouter() // 路由
  const contractId = ref('0');//合同
  const detailInfo = ref([]) as any
  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
  const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
  const detailLoading = ref(false) // 表单的加载中
  const returnType = ref(1)
  const shippingStatus = ref(0)
  const changeAdd = async (type) => {
    returnType.value = type
  }

  /** 子表的表单 */
  const subTabsName = ref('consignmentReturnDetail')
  const consignmentReturnDetailFormRef = ref()


  /** 获得数据 */
  const getInfo = async () => {
    detailLoading.value = true
    formData.value.id = props.id || queryId;
    try {

      formData.value = await ConsignmentReturnApi.getConsignmentReturn(props.id || queryId)


      // 加载用户列表
      userList.value = await
        UserApi.getSimpleUserList()
// 加载合同列表
      contractList.value = await
        ContractApi.getContractListByType(1)
    } finally {
      detailLoading.value = false
    }
  }
  defineExpose({open: getInfo}) // 提供 open 方法，用于打开弹窗

  /** 初始化 **/
  onMounted(() => {
    getInfo()
  })


</script>
