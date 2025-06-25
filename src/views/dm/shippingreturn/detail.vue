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
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="处理方式" prop="returnType">
          <el-select v-model="formData.returnType" placeholder="请选择处理方式" @change="changeAdd(formData.returnType)" disabled>
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
          <el-input v-model="formData.consigner" placeholder="请输入退货人" disabled/>
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


          <!--<el-input v-model="formData.consignedBy" placeholder="请输入接收人"/>-->
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


    <!--<el-row :gutter="20">-->
      <!--<el-col :span="8">-->
        <!--<el-form-item label="附件" prop="fileUrl">-->
          <!--<UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1"/>-->
        <!--</el-form-item>-->
      <!--</el-col>-->


    <!--</el-row>-->

    <!--<el-form-item label="备注" prop="remark">-->
    <!--<el-input v-model="formData.remark" placeholder="请输入备注"/>-->
    <!--</el-form-item>-->
  </el-form>
  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName" v-show="returnType !=4">
    <el-tab-pane label="销售退货单详情" name="shippingReturnDetail">
      <ShippingReturnDetailList ref="shippingReturnDetailFormRef" :shipping-return-id="props.id || queryId"/>
    </el-tab-pane>
  </el-tabs>

</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {ShippingReturnApi, ShippingReturnVO} from '@/api/dm/shippingreturn'
  import * as DefinitionApi from '@/api/bpm/definition'
  import {useTagsViewStore} from '@/store/modules/tagsView'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import ShippingReturnDetailList from './components/ShippingReturnDetailList.vue'
  import * as UserApi from '@/api/system/user'
  import {ContractApi} from '@/api/ppm/contract'
  import {propTypes} from '@/utils/propTypes'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  /** 销售退货单 表单 */
  defineOptions({name: 'ShippingReturnDetail'})

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
    shippingId: undefined,
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
    consignmentStatus: undefined,
    fileUrl: undefined,
    remark: undefined,
  })
  const formRules = reactive({
    shippingId: [{required: true, message: '发货单不能为空', trigger: 'blur'}],
    no: [{required: true, message: '退货单编号不能为空', trigger: 'blur'}],
    contractId: [{required: true, message: '合同不能为空', trigger: 'blur'}],
    name: [{required: true, message: '退货单名称不能为空', trigger: 'blur'}],
    returnType: [{required: true, message: '处理方式不能为空', trigger: 'change'}],
    returnReason: [{required: true, message: '退换货原因不能为空', trigger: 'blur'}],

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
  const consignmentStatus = ref(0)
  const changeAdd = async (type) => {
    returnType.value = type
  }
  const projectInfos = ref([]) // 项目集合
  const projectOrder = ref() //  选中项目
  /** 子表的表单 */
  const subTabsName = ref('shippingReturnDetail')
  const shippingReturnDetailFormRef = ref()


  /** 获得数据 */
  const getInfo = async () => {
    detailLoading.value = true
    formData.value.id = props.id || queryId;
    try {

      formData.value = await ShippingReturnApi.getShippingReturn(props.id || queryId)


        contractList.value = await
            DMContractApi.getContractInfoByProjectId(formData.value.projectId)
      // 加载用户列表
      userList.value = await
        UserApi.getSimpleUserList()
// 加载合同列表
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
