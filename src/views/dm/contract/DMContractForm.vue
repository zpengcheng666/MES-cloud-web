<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1680" >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="number">
            <!--<el-input v-model="formData.number" placeholder="请输入合同编号"  :disabled="formType == 'detail'"/>-->


            <el-row :gutter="20">
              <el-col :span="16">
                <el-input v-model="formData.number" placeholder="" :disabled="true"/>
              </el-col>
              <el-col :span="8">
                <el-button @click="generatorCode" type="primary" :disabled="formType == 'detail'">生 码</el-button>
              </el-col>
            </el-row>


          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入合同名称"  :disabled="formType == 'detail'"/>
          </el-form-item>
        </el-col>


        <el-col :span="8">
          <el-form-item label="项目" prop="projectId">


            <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openForm()" :disabled="formType == 'detail'"/>

            <!--<el-select v-model="formData.projectId" placeholder="请选择项目"-->
                       <!--@change="onChangeProject($event)" :disabled="formType == 'detail'">-->
              <!--<el-option-->
                      <!--v-for="dict in productList"-->
                      <!--:key="dict.projectId"-->
                      <!--:label="dict.projectName"-->
                      <!--:value="dict.projectId"-->

              <!--/>-->
            <!--</el-select>-->


            <!--<el-input v-model="formData.projectId" placeholder="请输入项目ID" :disabled="formType == 'detail'" />-->
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>


        <el-col :span="8">
          <el-form-item label="签约时间" prop="signingDate">
            <el-date-picker
                    v-model="formData.signingDate"
                    type="date"
                    value-format="x"
                    placeholder="选择签约时间"
                    style="width: 100%;"
                    :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同方" prop="party">
            <el-select v-model="formData.party" placeholder="请选择合同方" @change="changeParty" :disabled="formType == 'detail'">
              <el-option
                v-for="dict in partyDictData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="签约人" prop="contact">
            <el-select v-model="formData.contact" placeholder="请选择签约人"        :disabled="formType == 'detail'">
              <el-option
                v-for="dict in contactData.contactList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"

              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="签约地点" prop="signingAddress">
            <el-input v-model="formData.signingAddress" placeholder="请输入签约地点" type="textarea"  :disabled="formType == 'detail'"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="签约部门" prop="department">
            <el-tree-select
              v-model="formData.department"
              :data="deptList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择签约部门"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="我方签约人" prop="selfContact">
            <el-select v-model="formData.selfContact" placeholder="请选择我方签约人" clearable :disabled="formType == 'detail'">
              <el-option
                v-for="(user, index) in userListByDeptId"
                :label="user.nickname"
                :value="user.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="销售员" prop="purchaser">
            <el-input v-model="formData.purchaserName" placeholder="请输入销售员" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="是否增值税" prop="vat">
            <el-select v-model="formData.vat" placeholder="请选择是否增值税"     :disabled="formType == 'detail'">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.VAT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"

              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="币种" prop="currency">
            <el-select v-model="formData.currency" placeholder="请选择币种"  :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.CURRENCY_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"

              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="交货方式" prop="delivery">
            <el-select v-model="formData.delivery" placeholder="请选择交货方式" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_CONTRACT_DELIVERY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

<!--        <el-col :span="12">-->
<!--          <el-form-item label="状态" prop="status">-->
<!--            <el-radio-group v-model="formData.status">-->
<!--              <el-radio label="1">请选择字典生成</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="产品清单" name="contractOrder">
            <DMContractOrderForm ref="contractOrderFormRef" :contract-id="formData.id" :products="formData.products" :productList="productList" :form-type="formType" :projectId="projectId"/>
          </el-tab-pane>
          <el-tab-pane label="付款计划" name="contractPaymentScheme">
            <DMContractPaymentSchemeForm ref="contractSchemeFormRef" :contract-id="formData.id" :schemes="formData.paymentSchemes" :total="formData.totalTaxPrice" :form-type="formType"/>
          </el-tab-pane>
        </el-tabs>


<!--        <el-tabs v-model="subTabsName" class="-mt-15px -mb-10px">-->
<!--          <el-tab-pane label="产品清单" name="product">-->
<!--            <ContractProductForm-->
<!--              ref="productFormRef"-->
<!--              :products="formData.products"-->
<!--              :disabled="disabled"-->
<!--            />-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->
      </ContentWrap>

      <el-row>
        <el-col :span="8">
          <el-form-item label="数量合计" prop="totalQuantity">
            <el-input
              disabled
              v-model="formData.totalQuantity"
              :formatter="countInputFormatter"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总金额" prop="totalPrice">
            <el-input
              disabled
              v-model="formData.totalPrice"
              :formatter="priceInputFormatter"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="含税总金额" prop="totalTaxPrice">
            <el-input
              disabled
              v-model="formData.totalTaxPrice"
              :formatter="priceInputFormatter"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>


    <!-- 表单弹窗：添加/修改 -->
    <DMProjectChoose ref="projectRef" @getProject="getProject"/>


  </Dialog>
</template>
<script setup lang="ts">
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import { CompanyApi } from '@/api/ppm/company'
import { CompanyContactApi } from '@/api/ppm/companycontact'
import { CompanyProductApi } from '@/api/ppm/companyproduct'
import { MaterialConfigApi } from '@/api/wms/materialconfig'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
import DMContractOrderForm from './components/DMContractOrderForm.vue'
import DMProjectChoose from './components/contractquery/DMProjectChoose.vue'
import DMContractPaymentSchemeForm from './components/DMContractPaymentSchemeForm.vue'

import * as DeptApi from '@/api/system/dept'
import { defaultProps, handleTree } from '@/utils/tree'
import * as UserApi from "@/api/system/user";

import { useUserStore } from '@/store/modules/user'
import { erpNumberFormatter } from "@/utils";
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
/** 购销合同 表单 */
defineOptions({ name: 'DMContractForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  type: '2', // 默认销售
  number: undefined,
  name: undefined,
  party: undefined,
  contact: undefined,
  signingDate: undefined,
  signingAddress: undefined,
  department: undefined,
  selfContact: undefined,
  vat: undefined,
  currency: undefined,
  delivery: undefined,
  status: undefined,
  purchaser: '',
  purchaserName: '',
  remark: undefined,
  products: [] as any,
  totalQuantity: 0,
  totalPrice: 0,
  totalTaxPrice: 0,
  paymentSchemes: [] as any,
})
const formRules = reactive({
  type: [{ required: true, message: '类型不能为空', trigger: 'change' }],
  number: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
    projectId: [{ required: true, message: '项目不能为空', trigger: 'blur' }],
  party: [{ required: true, message: '合同方不能为空', trigger: 'blur' }],
  contact: [{ required: true, message: '签约人不能为空', trigger: 'blur' }],
  signingDate: [{ required: true, message: '签约时间不能为空', trigger: 'blur' }],
  signingAddress: [{ required: true, message: '签约地点不能为空', trigger: 'blur' }],
  department: [{ required: true, message: '签约部门不能为空', trigger: 'blur' }],
  selfContact: [{ required: true, message: '我方签约人不能为空', trigger: 'blur' }],
  vat: [{ required: true, message: '是否增值税不能为空', trigger: 'blur' }],
  currency: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
  delivery: [{ required: true, message: '交货方式不能为空', trigger: 'blur' }],
  purchaser: [{ required: true, message: '采购员不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const productList = ref([]) // 项目集合
const projectId = ref() // 项目集合
const projectOrder = ref() //  选中项目
/** 子表的表单 */
const subTabsName = ref('contractOrder')
const contractOrderFormRef = ref()



/** 计算 数量合计、总金额、含税总金额 */
watch(
    () => formData.value.products,
    (val) => {
        if (!val) {
            return
        }
        debugger
        // 数量合计
        const totalQuantity = val.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr.quantity ? curr.quantity : 0), 0)
        // 价格合计
        const totalPrice = val.reduce((prev, curr) => (parseFloat(prev) + parseFloat(curr.price) * curr.quantity), 0)
        // 含税合计
        const totalTaxPrice = val.reduce((prev, curr) => (parseFloat(prev) + parseFloat(curr.taxPrice) * curr.quantity), 0)

        formData.value.totalQuantity = totalQuantity ? totalQuantity : 0
        formData.value.totalPrice = totalPrice  ? totalPrice : 0
        formData.value.totalTaxPrice = totalTaxPrice  ? totalTaxPrice : 0
    },
    { deep: true }
)



/** 添加/修改操作 */
const projectRef = ref() // 合同 Ref
const openForm = () => {
    projectRef.value.open()
}


const generatorCode=async ()=>{

    formLoading.value = true
    const data = {
        classificationCode:'SMS_SC',
        encodingRuleType:1,
    }
    try {
        const result = await EncodingRuleApi.createCode(data)
        formData.value.number = result
        debugger
    } finally {
        formLoading.value = false
    }
}

const cancel = async () => {

    if (formData.value.number && formData.value.id==undefined) {
        const data = formData.value
        const update = {code: data.number, status: 3}
        try {
            let result = await EncodingRuleApi.updateCode(update)
        } finally {
            formLoading.value = false
        }
    }
    dialogVisible.value = false

}





/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()


  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
        debugger
        const data  =  await ContractApi.getContract(id)
      formData.value =data
      changeParty(formData.value.party)
      formData.value.department = Number(formData.value.department)
      formData.value.selfContact = Number(formData.value.selfContact)

        const order = productList.value.find((item) => item.projectId === data.projectId)

        projectOrder.value = order;
    } finally {
      formLoading.value = false
    }
  }

  // 默认新建时选中自己
  if (formType.value === 'create') {
    formData.value.purchaser = String(useUserStore().getUser.id)
    formData.value.purchaserName = useUserStore().getUser.nickname
  }
  await getPartyDict()
  // await getTree()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await contractOrderFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'contractOrder'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ContractVO
    if (formType.value === 'create') {
      await ContractApi.createContract(data)


        const update={code:data.number,status:2}
        await EncodingRuleApi.updateCode(update)
      message.success(t('common.createSuccess'))
    } else {
      await ContractApi.updateContract(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const onChangeProject = (orderId) => {
    const order = productList.value.find((item) => item.projectId === orderId)
    projectOrder.value = order;
    formData.value.products=[]
}

/***
 * 获取项目信息
 * */
const getProject = async (project) => {
    // 选中项目
    formData.value.projectId = project.id
    formData.value.projectName = project.projectCode + '(' + project.projectName + ')'
    projectId.value =  project.id
    // productList.value = DMContractApi.getProductOrderList(2,project.id)
    formData.value.products=[]



    productList.value =await DMContractApi.getProductOrderList(2,project.id)
}






/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    type: '2',
    number: undefined,
    name: undefined,
    party: undefined,
    contact: undefined,
    signingDate: undefined,
    signingAddress: undefined,
    department: undefined,
    selfContact: undefined,
    vat: undefined,
    currency: undefined,
    delivery: undefined,
    status: undefined,
    purchaser: '',
    purchaserName: '',
    remark: undefined,
    products: [],
    totalQuantity: 0,
    totalPrice: 0,
    totalTaxPrice: 0,
    paymentSchemes: [],
  }
  formRef.value?.resetFields()
}

// 供应商下拉选项
const partyDictData = ref([]) as any
/** 查询列表 */
const getPartyDict = async () => {
 const companyList = await CompanyApi.getCompanyListByType("2,3")
  partyDictData.value = companyList.map(d =>({label:d.name,value:d.id}) )
}

// 签约人下拉选项
const contactData = ref({}) as any
const productData = ref([]) as any
/** 查询联系人 */
const changeParty = async (companyId) => {
  // 获取选中合同方下的联系人
  contactData.value = await CompanyContactApi.getCompanyContactSimpleList(companyId)
  // 获取选中合同方下的产品
}

// const deptName = ref('')
const deptList = ref<Tree[]>([]) // 树形结构
const userList = ref<UserApi.UserVO[]>([]) // 全量用户清单

// 根据选择的部门筛选员工清单
const userListByDeptId = computed(() =>
  formData.value.department
    ? userList.value.filter((u: UserApi.UserVO) => u.deptId === formData.value.department)
    : []
)

// 格式化合计
const ERP_COUNT_DIGIT = 3
const ERP_PRICE_DIGIT = 2
const countInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_COUNT_DIGIT)
}

const priceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

// 加载部门树、用户集合
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  userList.value = handleTree(await UserApi.getSimpleUserList())
  //todo  加载产品类型为成品的产品
  //productData.value = await  MaterialConfigApi.getMaterialConfigList()
  //   productList.value=[];
  //   productList.value = await DMContractApi.getProductOrderList(2);
})
</script>
