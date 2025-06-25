<template>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!--<el-form-item label="项目" prop="projectName">-->
        <!--<el-input v-model="formData.projectName" placeholder="请选择项目" @click="openProjectForm" readonly/>-->
      <!--</el-form-item>-->
      <!--filterable clearable-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="图号" prop="partNumber">
            <el-select v-model="formData.partNumber" placeholder="请选择零件" :disabled="ordertype" filterable>
              <el-option
                v-for="item in cpList"
                :key="item.id"
                :label="item.materialNumber"
                :value="item.materialNumber"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料牌号" prop="materialNumber">
            <el-select v-model="formData.materialNumber" placeholder="请选择物料" :disabled="ordertype">
              <el-option
                v-for="item in mpList"
                :key="item.id"
                :label="item.materialNumber"
                :value="item.materialNumber"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工件名称" prop="partName">
            <el-input v-model="formData.partName" placeholder="请输入工件名称" :disabled="ordertype"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="数量" prop="quantity">
            <el-input type="number" v-model="formData.quantity" placeholder="请输入数量" :disabled="ordertype"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="带料加工" prop="processType">
            <el-select v-model="formData.processType" placeholder="请选择带料加工" :disabled="ordertype">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加工状态" prop="processCondition">
            <el-input v-model="formData.processCondition" placeholder="请输入加工状态" :disabled="ordertype"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="原料交付时间" prop="materialDeliveryTime" >
            <el-date-picker
              v-model="formData.materialDeliveryTime"
              type="date"
              value-format="x"
              placeholder="原料交付时间"
              :disabled="ordertype"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成品交付时间" prop="fproDeliveryTime" >
            <el-date-picker
              v-model="formData.fproDeliveryTime"
              type="date"
              value-format="x"
              placeholder="成品交付时间"
              :disabled="ordertype"
            />
          </el-form-item>
        </el-col>
      </el-row>



      <!--<el-form-item label="销售订单编号" prop="orderId">-->
        <!--<el-select v-model="formData.orderId" placeholder="请选择销售订单编号">-->
          <!--<el-option label="请选择字典生成" value="" />-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="订单编码" prop="orderCode">-->
        <!--<el-input v-model="formData.orderCode" placeholder="请输入订单编码" />-->
      <!--</el-form-item>-->
      <!--<el-form-item label="项目类型" prop="orderCode">-->
        <!--<el-select v-model="formData.projectType" placeholder="" disabled>-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROJECT_TYPE)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="项目编码" prop="projectCode">-->
        <!--<el-input v-model="formData.projectCode" placeholder="" disabled/>-->
      <!--</el-form-item>-->
    </el-form>
</template>
<script setup lang="ts">
import { OrderApi, OrderVO } from '@/api/pms/order'
import OrderListForm from './components/OrderListForm.vue'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import ProjectForm from './components/ProjectForm.vue';

/** 项目订单 表单,抽离出来的基本内容 */
defineOptions({ name: 'OrderBasic' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const projectList = ref([]);
const contractList = ref([])
const contractListShow = ref([])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectId: undefined,
  projectCode: undefined,
  materialNumber:undefined,
  partNumber:undefined,
  partName:undefined,
  quantity:undefined,
  processType:undefined,
  orderStatus:undefined,
  orderType:undefined,
  processCondition:undefined,
  materialDeliveryTime:undefined,
  fproDeliveryTime:undefined


})
const formRules = reactive({
  materialNumber: [{ required: true, message: '物料牌号不能为空', trigger: 'blur' }],
  partNumber: [{ required: true, message: '图号不能为空', trigger: 'blur' }],
  partName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  processType: [{ required: true, message: '带料加工不能为空', trigger: 'blur' }],
  processCondition: [{ required: true, message: '加工状态不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const projectFormRef = ref()
const ordertype = ref(false)

//开关按钮
const orderCustom = ref(false)

/** 子表的表单 */
const subTabsName = ref('orderList')
const orderListFormRef = ref()

const cpList = ref()
const mpList = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  //获取全部项目，改版后好像没用到
  // projectList.value = await ApprovalApi.getApprovalAll();
  //获取全部联系人
  contractList.value = await ApprovalApi.getContractListAll()
  getMaterialList()
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      //获取全部物料类型

      formData.value = await OrderApi.getOrder(id)
    } finally {
      formLoading.value = false
    }
  }
}
//物料类型列表
const getMaterialList = async ()=>{
  //成品物料
  cpList.value = await OrderApi.getMaterialByTypeCode('CP');
  //毛坯物料
  mpList.value = await OrderApi.getMaterialByTypeCode('MP');
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  //解决无法置空问题
  if(formData.value.contractId===undefined||formData.value.contractId===null){
    formData.value.contractId = '';
  }
  // 校验子表单
  try {
    await orderListFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'orderList'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OrderVO
    // 拼接子表的数据(子表有可能带id,得去掉)
    // data.orderLists = orderListFormRef.value.getData()
    const orderList = orderListFormRef.value.getData();
    orderList.forEach((item)=>{
      item.id = null;
    })
    data.orderLists = orderList;
    if (formType.value === 'create') {
      await OrderApi.createOrder(data)
      message.success(t('common.createSuccess'))
    } else {
      await OrderApi.updateOrder(data)
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
    projectId: undefined,
    projectCode: undefined,
    materialNumber:undefined,
    partNumber:undefined,
    partName:undefined,
    quantity:undefined,
    processType:undefined,
    orderStatus:undefined,//订单状态,无需填写
    orderType:undefined,//订单类型，无需填写
    processCondition:undefined,
    materialDeliveryTime:undefined,
    fproDeliveryTime:undefined
  }
  formRef.value?.resetFields()
  contractListShow.value = []
}

/**
 * 监听合同id的变化,查询合同下的id
 */
// watch(() => formData.value.contractId,(val) => {
//   if (val) {
//     //原方法,新建时，选合同拉取数据，暂时弃用
//     // getContractOrder(val)
//   }
//
// },{deep: true})

/**
 * 监听项目id,根据不同的项目类型，展示不同的合同
 */
// watch(() => formData.value.projectId,(val) => {
//   if (val) {
//     const project = projectList.value.find((item)=>{
//       return item.id===val
//     })
//     console.log(project)
//     // formData.value.contractId = null;
//     orderListFormRef.value.setData([]);
//     formData.value.projectType = project.projectType;
//     formData.value.projectCode = project.projectCode;
//     formData.value.projectName = project.projectName;
//     orderListFormRef.value.projectTypeOrder = project.projectType;
//     //TODO 查询零件或材料，在子vue中写
//     orderListFormRef.value.changeSelectMaterial(project.projectCode);
//
//     //正好自研是1，采购也是1
//     const data = contractList.value.filter((item)=>{
//       return item.type === formData.value.projectType;
//     })
//     contractListShow.value = data;
//   }
// },{deep: true})

const getContractOrder =async (val)=>{
  const data = await ContractApi.getContract(val)

  const productsList = data.products;

  if(formType.value === 'create'){
    productsList.forEach((item)=>{
      item.materialDeliveryTime = item.leadDate
      item.orderId = item.id
    })
    orderListFormRef.value.setData(productsList)
  }

}
/**
 * 打开选择项目的弹窗
 *
 */
const openProjectForm = ()=>{
  projectFormRef.value.open()
}

/**
 * 从pdm那边拉取数据
 */
const fromProject = async ()=>{
  if(!formData.value.projectCode){
    message.info("请先选择项目")
  }else {
    //通过项目编码查询加工零件
    await orderListFormRef.value.fromProject(formData.value.projectCode);
  }
}
/**
 * 来自合同
 */
const fromContract = async ()=>{
  if(!formData.value.contractId){
    message.info("请先选择合同")
  }else {
    await orderListFormRef.value.fromContract(formData.value.contractId);
  }

}
/**
 * 自定义，但是遵循类型划分
 */
const fromCustom = ()=>{
  orderListFormRef.value.changeAddOrderVisible(orderCustom.value);
}
/**
 * 关闭弹窗时要做的事
 */
const closeDialog = ()=>{
  //关闭开关
  orderCustom.value = false;
}
/**
 * 选择项目成功时返回的数据,设置项目id和项目名
 * @param row
 */
const getProjectRow = (row)=>{
  formData.value.projectId = row.id;
  // formData.value.projectName = row.projectName;
}
const getData = ()=>{
  return formData.value;
}
const setData = (data)=>{
  formData.value = data;
}
const validate = async ()=>{
  await formRef.value.validate()
}
const setOrderType = async (type)=>{
  ordertype.value = type;
}

defineExpose({ open,getData,validate,setData,setOrderType,getMaterialList }) // 提供 open 方法，用于打开弹窗
</script>
