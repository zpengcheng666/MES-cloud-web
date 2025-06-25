<template>
  <el-form
    ref="formRef"
    :model="formData"
    label-width="100px"
    v-loading="formLoading"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="合同编号" prop="number">
          <el-input v-model="formData.number" placeholder="请输入合同编号"  :disabled="formType == 'detail'"/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入合同名称"  :disabled="formType == 'detail'"/>
        </el-form-item>
      </el-col>


      <el-col :span="8">
        <el-form-item label="项目" prop="projectId">


          <el-select v-model="formData.projectId" placeholder="请选择项目"
                     @change="onChangeProject($event)" :disabled="formType == 'detail'">
            <el-option
                    v-for="dict in projectInfos"
                    :key="dict.id"
                    :label="dict.projectName"
                    :value="dict.id"

            />
          </el-select>


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
          <DMContractOrderForm ref="contractOrderFormRef" :contract-id="formData.id" :products="formData.products" :productList="productData" :form-type="formType" :projectOrder="projectOrder"/>
        </el-tab-pane>
        <el-tab-pane label="付款计划" name="contractPaymentScheme">
          <DMContractPaymentSchemeForm ref="contractSchemeFormRef" :contract-id="formData.id" :schemes="formData.paymentSchemes" :total="formData.totalTaxPrice" :form-type="formType"/>
        </el-tab-pane>
      </el-tabs>

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
</template>
<script lang="ts" setup>
  import { ContractApi } from '@/api/ppm/contract'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  import { CompanyApi } from '@/api/ppm/company'
  import { CompanyContactApi } from '@/api/ppm/companycontact'
  import { CompanyProductApi } from '@/api/ppm/companyproduct'
  import DMContractOrderForm from './components/DMContractOrderForm.vue'
  import DMContractPaymentSchemeForm from './components/DMContractPaymentSchemeForm.vue'
  import * as DeptApi from '@/api/system/dept'
  import { defaultProps, handleTree } from '@/utils/tree'
  import * as UserApi from "@/api/system/user";
  import { erpNumberFormatter } from "@/utils";
  import {useTagsViewStore} from "@/store/modules/tagsView";
  import { MaterialConfigApi } from '@/api/mcc/materialconfig'
  import {propTypes} from '@/utils/propTypes'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  defineOptions({ name: 'DMContractDetail' })
  const route = useRoute()
  const props = defineProps({
    id: propTypes.number.def(undefined)
  })
  const message = useMessage() // 消息弹窗
  const contractId = ref(0) // 合同主键
  const { query } = useRoute() // 查询参数
  const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号


  const projectInfos = ref([]) // 项目集合
  const projectOrder = ref() //  选中项目
  const formType = ref('detail') // 表单的类型：create - 新增；update - 修改
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formData = ref({
    id: '',
    type: '2', // 默认采购
    number: undefined,
    name: undefined,
    party: '',
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
  })

  const formRef = ref() // 表单 Ref
  /** 子表的表单 */
  const subTabsName = ref('contractOrder')
  const contractOrderFormRef = ref()
  const contractSchemeFormRef = ref()

  /** 计算 数量合计、总金额、含税总金额 */
  watch(
    () => formData.value.products,
    (val) => {
      if (!val) {
        return
      }
      // 数量合计
      const totalQuantity = val.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr.quantity ? curr.quantity : 0), 0)
      // 价格合计
      const totalPrice = val.reduce((prev, curr) => (parseFloat(prev) + parseFloat(curr.price) * curr.quantity), 0)
      // 折扣价格合计
      const totalTaxPrice = val.reduce((prev, curr) => (parseFloat(prev) + parseFloat(curr.taxPrice) * curr.quantity), 0)

      formData.value.totalQuantity = totalQuantity ? totalQuantity : 0
      formData.value.totalPrice = totalPrice  ? totalPrice : 0
      formData.value.totalTaxPrice = totalTaxPrice  ? totalTaxPrice : 0
    },
    { deep: true }
  )


  /** 打开弹窗 */
  const getContractDetail = async () => {
    formLoading.value = true
    try {
      formData.value = await ContractApi.getContract(props.id || queryId)
      formData.value.department = Number(formData.value.department)
      formData.value.selfContact = Number(formData.value.selfContact)
      // 获取选中合同方下的联系人
      contactData.value = await CompanyContactApi.getCompanyContactSimpleList(formData.value.party)

       productData.value = await  MaterialConfigApi.getMaterialConfigList()


        const order = projectInfos.value.find((item) => item.id === formData.value.projectId)

        projectOrder.value = order;
      // // 获取选中合同方下的产品
      // productData.value = await CompanyProductApi.getProductSimpleList(formData.value.party)
    } finally {
      formLoading.value = false
    }
    // 获取合同方下拉集合
    await getSimpleParty()
  }


  // 供应商下拉选项
  const partyDictData = ref([]) as any
  /** 查询列表 */
  const getSimpleParty = async () => {
    // 1 采购 3 双向
    const companyList = await CompanyApi.getCompanyListByType("2,3")
    partyDictData.value = companyList.map(d => ({ label: d.name, value: d.id }))
  }

  // 签约人下拉选项
  const contactData = ref({}) as any
  const productData = ref([]) as any
  /** 查询联系人 */
  const changeParty = async (companyId) => {
    // 获取选中合同方下的联系人
    contactData.value = await CompanyContactApi.getCompanyContactSimpleList(companyId)
    // 获取选中合同方下的产品
    productData.value = await CompanyProductApi.getProductSimpleList(companyId)
    // 清空产品清单
    formData.value.products = []
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


  /** 关闭 */
  const { delView } = useTagsViewStore() // 视图操作
  const { currentRoute } = useRouter() // 路由
  const close = () => {
    delView(unref(currentRoute))
  }

  /** 初始化 */
  onMounted(async () => {
    debugger
    const id = props.id || queryId
    if (!id) {
      message.warning('参数错误，合同不能为空！')
      close()
      return
    }
    deptList.value = handleTree(await DeptApi.getSimpleDeptList())
    userList.value = handleTree(await UserApi.getSimpleUserList())
    // 合同主键
    contractId.value = id as unknown as number
    // 获取合同方下拉集合
    await getSimpleParty()
    // 获取申请信息
    await getContractDetail()

      projectInfos.value=[];
      projectInfos.value = await DMContractApi.getProductOrderList(2);
  })
</script>
