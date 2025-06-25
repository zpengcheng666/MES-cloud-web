<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
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
            <el-select v-model="formData.returnType" placeholder="请选择处理方式"    disabled>
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
          <!--<el-form-item label="附件" prop="fileUrl" >-->
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
        <ShippingReturnDetailList ref="shippingReturnDetailFormRef" :shipping-return-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <!--<template #footer>-->
      <!--<el-button @click="submitForm" type="primary" :disabled="formLoading">保存</el-button>-->
      <!--<el-button @click="submitFormAndAudit" type="primary" :disabled="formLoading">保存并提交审核</el-button>-->
      <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--</template>-->
  </Dialog>
</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {ShippingReturnApi, ShippingReturnVO} from '@/api/dm/shippingreturn'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import ShippingReturnDetailList from './components/ShippingReturnDetailList.vue'
  import * as UserApi from '@/api/system/user'
  import {ContractApi} from '@/api/ppm/contract'

  /** 销售退货单 表单 */
  defineOptions({name: 'ShippingReturnInfo'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
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

  const consignmentStatus = ref(0)
  const contractId = ref('0');//合同
  const detailInfo = ref([]) as any
  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

  // const shippingList = ref < ShippingApi.ShippingVO[] > ([]) //发货单列表
  const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表

  const returnType=ref(1)

  const changeAdd = async (type)=>{
    returnType.value = type
  }

  /** 子表的表单 */
  const subTabsName = ref('shippingReturnDetail')
  const shippingReturnDetailFormRef = ref()

  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number,shippingReturnStatus? : number
  ) =>
  {
    formData.value.id=id;
    dialogVisible.value = true
    consignmentStatus.value = shippingReturnStatus
    dialogTitle.value = t('action.' + type)
    formType.value = type

    if (id) {
      formLoading.value = true
      try {
        formData.value = await
        ShippingReturnApi.getShippingReturn(id)

        contractId.value = formData._value.contractId;
        returnType.value=formData._value.returnType;
        detailInfo.value =await ShippingApi.getShippingDetailByContractId(formData._value.contractId);
      } finally {
        formLoading.value = false
      }
    }


    // 加载用户列表
    userList.value = await
    UserApi.getSimpleUserList()


    // 加载合同列表
    contractList.value = await
    ContractApi.getContractListByType(2)
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗






</script>
