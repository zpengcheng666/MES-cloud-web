<template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="项目编码" prop="projectCode">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled/>
              </el-col>
              <el-col :span="8">
                <el-button @click="generatorCode" type="primary" :disabled="formLoading||formData.projectCode">生 码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="项目类型" prop="projectType">
            <el-select v-model="formData.projectType" placeholder="请选择项目类型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROJECT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="项目预算/万" prop="budget">
            <!--<el-input-number v-model="formData.budget" placeholder="请输入项目预算(万元)" />-->
            <el-input type="number" v-model="formData.budget" placeholder="请输入项目预算(万元)" />
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="客户" prop="projectClient">
            <!--<el-input v-model="formData.projectClient" placeholder="请输入客户(之后改成下拉)" />-->
            <el-select v-model="formData.projectClient" placeholder="请选择客户">
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="客户联系人" prop="contactId">
            <el-select v-model="formData.contactId" placeholder="请选择客户联系人">
              <el-option
                v-for="item in companyContactList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="项目简述" prop="description">
        <el-input type="textarea" v-model="formData.description" placeholder="请输入项目简述" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="预计开始时间" prop="prestartTime">
            <el-date-picker
              v-model="formData.prestartTime"
              type="date"
              value-format="x"
              placeholder="选择预计开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="预计结束时间" prop="preendTime">
            <el-date-picker
              v-model="formData.preendTime"
              type="date"
              value-format="x"
              placeholder="选择预计结束时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" labelWidth="125px">
          <el-form-item label="是否需要评估" prop="needsAssessment">
            <el-select v-model="formData.needsAssessment" placeholder="请选择是否需要评估">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="formData.needsAssessment">
        <el-row :gutter="20">
          <el-col :span="6" labelWidth="125px">
            <el-form-item label="战略评估" prop="strategy">
              <el-select v-model="formData.strategy" placeholder="请选择战略评估">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" labelWidth="125px">
            <el-form-item label="技术评估" prop="technology">
              <el-select v-model="formData.technology" placeholder="请选择技术评估">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" labelWidth="125px">
            <el-form-item label="产能评估" prop="capacity">
              <el-select v-model="formData.capacity" placeholder="请选择产能评估">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" labelWidth="125px">
            <el-form-item label="成本评估" prop="cost">
              <el-select v-model="formData.cost" placeholder="请选择成本评估">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item label="项目技术材料" prop="technicalMaterialArray">
        <UploadFile :is-show-tip="false" v-model="formData.technicalMaterialArray" />
      </el-form-item>
    </el-form>
  <PmsOrderListForm ref="orderListFormRef"/>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import * as UserApi from '@/api/system/user'
// import AssessmentForm from './components/AssessmentForm.vue'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import { CompanyApi } from '@/api/ppm/company'
import { CompanyContactApi } from '@/api/ppm/companycontact'
import PmsOrderListForm from './components/PmsOrderListForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
import { OrderApi } from '@/api/pms/order'

/** 立项基本内容，因为多个地方使用，所以抽离出来 */
defineOptions({ name: 'ApprovalCreateForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const {query} = useRoute() // 查询参数
const { push, currentRoute } = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作

const userList = ref([]) // 用户列表
// const contractList = ref([])//合同列表
const companyList = ref([])//客户列表
const companyContactList = ref([])//客户联系人列表
const projectCodeCompare = ref('');
/** 子表 */
const subTabsName = ref('orderList')
const orderListFormRef = ref()

//自制订单
const selfOrder = ref();
const props = defineProps({
  sellOrder: {
    type: Object,
    default: () => {}
  },
  // orderList: {
  //   type: Array,
  //   default: () => []
  // }
})

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectCode: undefined,
  projectName: undefined,
  projectType: undefined,
  projectContract: undefined,
  budget: undefined,
  projectClient: undefined,
  description: undefined,
  prestartTime: undefined,
  preendTime: undefined,
  responsiblePerson: undefined,
  projectManager: undefined,
  needsAssessment: undefined,
  strategy: undefined,
  technology: undefined,
  capacity: undefined,
  cost: undefined,
  technicalMaterials: undefined,
  technicalMaterialArray: undefined,
  contactId: undefined,
  order:undefined,
})

const checkCodeExist =async (rule,value,callback)=>{
  const data = await ApprovalApi.getByProjectCode(value)
  if(formType.value === 'create'||formType.value === 'outCreate'){
    if(data!=null){
      callback(new Error('项目编码已存在,请输入新编码'))
    }
  }else {
    if(data!=null&&projectCodeCompare.value!=value){
      callback(new Error('项目编码已存在,请输入新编码'))
    }
  }
  callback()
}
const checkTime = async (rule,value,callback)=>{
  if(formData.value.prestartTime!=undefined&&formData.value.preendTime!=undefined){
    if(formData.value.prestartTime>formData.value.preendTime){
      callback(new Error('预计开始时间要早于预计结束时间'))
    }else {
      callback()
    }
  }else {
    callback()
  }
}
const formRules = reactive({
  projectCode: [{ required: true, message: '项目编码不能为空', trigger: 'blur'}, {validator: checkCodeExist,trigger: 'blur'}],
  projectName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  projectType: [{ required: true, message: '项目类型不能为空', trigger: 'blur' }],
  budget: [{ required: true, message: '项目预算不能为空', trigger: 'blur' }],
  prestartTime: [{ required: true, message: '预计开始时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
  preendTime: [{ required: true, message: '预计结束时间不能为空', trigger: 'blur' },{validator: checkTime,trigger: 'blur'}],
  needsAssessment: [{ required: true, message: '是否需要评估不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 提交表单 */
const emit = defineEmits([]) // 定义 success 事件，用于操作成功后的回调
//处理订单专用
const submit =async (type)=>{
  formType.value = 'outCreate';
  await submitForm();
  delView(currentRoute)
  push({name:'PmsOrder'})

}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  await orderListFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    formData.value.technicalMaterials = formData.value.technicalMaterialArray?.join(",");

    const data = formData.value as unknown as ApprovalVO
    // 拼接子表的数据
    data.orderLists = orderListFormRef.value.getData()
    if (formType.value === 'create') {
      //占用码
      const update={code:formData.value.projectCode,status:2}
      EncodingRuleApi.updateCode(update)
      // data.order = selfOrder.value;
      //await ApprovalApi.createApprovalWithOrder(data)
      await ApprovalApi.createApproval(data)
      message.success(t('common.createSuccess'))
    } else if(formType.value === 'outCreate'){
      //占用码
      const update={code:formData.value.projectCode,status:2}
      EncodingRuleApi.updateCode(update)
      // console.log(props.sellOrder);
      // data.order = props.sellOrder;
      //await ApprovalApi.createApprovalWithOrder(data)
      await ApprovalApi.createApproval(data)
      message.success(t('common.createSuccess'))
    } else {
      // data.order = selfOrder.value;
      await ApprovalApi.updateApproval(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    projectName: undefined,
    projectType: undefined,
    projectContract: undefined,
    budget: undefined,
    projectClient: undefined,
    description: undefined,
    prestartTime: undefined,
    preendTime: undefined,
    responsiblePerson: undefined,
    projectManager: undefined,
    needsAssessment: undefined,
    strategy: undefined,
    technology: undefined,
    capacity: undefined,
    cost: undefined,
    technicalMaterials: undefined,
    technicalMaterialArray: undefined,
    contactId: undefined,
    order:undefined,
  }
  formRef.value?.resetFields()
}
watch(() => formData.value.needsAssessment,(val) => {
  if(!val){
    formData.value.strategy = 0;
    formData.value.technology = 0;
    formData.value.capacity = 0;
    formData.value.cost = 0;
  }else {
    formData.value.strategy = 1;
    formData.value.technology = 1;
    formData.value.capacity = 1;
    formData.value.cost = 1;
  }

},{deep: true})
/**
 * 监听客户id,获取联系人列表
 */
watch(() => formData.value.projectClient,async (val) => {
  if(val!=undefined&&val!=null){
    const data = await CompanyContactApi.getCompanyContactSimpleList(val);
    companyContactList.value = data.contactList;
    //查看是否包含联系人id,不包含设置为undefined
    const b = companyContactList.value.some((item)=>{
      return item.id === formData.value.contactId;
    })
    if(!b){
      formData.value.contactId = undefined;
    }
  }
},{deep: true})

onMounted(async ()=>{
  companyList.value = await CompanyApi.getCompanySimpleList()
})

// const setOrderData = (order)=>{
//   selfOrder.value = order;
// }
const setProjectData = async (projectValue)=>{
  formData.value = projectValue;
  projectCodeCompare.value = formData.value.projectCode;
  const orderList = await OrderApi.getOrderByProjectId(projectValue.id)
  orderListFormRef.value.setData(orderList)

}
const getProjectData = ()=>{
  return formData.value;
}

const validate = async ()=>{
  await formRef.value.validate()
}

const setType = async (type)=>{
  console.log(type)
  formType.value = type;
}

//生码
const generatorCode=async ()=>{
  formLoading.value = true
  const data = {
    classificationCode:'PMS',
    encodingRuleType:1,
  }

  try {
    const result = await EncodingRuleApi.createCode(data)
    formData.value.projectCode = result
  } finally {
    formLoading.value = false
  }


}

defineExpose({ submit,submitForm,getProjectData,validate,setType,setProjectData }) // 提供 open 方法，用于打开弹窗

/**
 * 监听项目名,更新项目编码
 */
// watch(() => formData.value.projectName,async (val) => {
//   console.log(val)
//   if(val){
//     formData.value.projectCode = val+Date.now();
//   }else {
//     formData.value.projectCode = undefined;
//   }
//
// },{immediate: false})
</script>
