<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目" prop="projectId">
            <el-select v-model="formData.projectId" placeholder="请选择项目" @change="chooseProject" clearable>
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.projectName+'('+item.projectCode+')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目编码" prop="projectCode">
            <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否需要评估" prop="needsAssessment">
            <el-select v-model="formData.needsAssessment" placeholder="请选择是否需要评估" disabled>
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="图号" prop="partNumber">
            <el-select v-model="formData.partNumber" placeholder="请选择零件" :disabled="ordertype" filterable @change="changePartNumber" clearable>
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
          <el-form-item label="工件名称" prop="partName">
            <el-input v-model="formData.partName" placeholder="请输入工件名称" disabled />
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
          <el-form-item label="整单外协" prop="outsource">
            <el-select v-model="formData.outsource" placeholder="请选择是否整单外协">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<el-form-item label="加工状态" prop="processCondition">-->
            <!--<el-input v-model="formData.processCondition" placeholder="请输入加工状态" :disabled="ordertype"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
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
        <el-col :span="8">
          <el-form-item label="物料牌号" prop="materialNumber" v-if="formData.processType===1&&formData.outsource===1">
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
        <!--<el-col :span="8">-->
          <!--<el-form-item label="外协备料" prop="outsourcePrepareMaterial">-->
            <!--<el-select v-model="formData.outsourcePrepareMaterial" placeholder="请选择是否备料">-->
              <!--<el-option-->
                <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"-->
                <!--:key="dict.value"-->
                <!--:label="dict.label"-->
                <!--:value="dict.value"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
    </el-form>
    <el-table :data ="orderList">
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="工件名称" align="center" prop="partName" />
      <el-table-column label="数量" align="center" prop="quantity" />
    </el-table>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>


  </Dialog>
</template>
<script setup lang="ts">
import { OrderApi, OrderVO } from '@/api/pms/order'
import OrderListForm from './components/OrderListForm.vue'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import ProjectForm from './components/ProjectForm.vue';

/** 项目订单 表单 */
defineOptions({ name: 'OrderForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const projectList = ref([]);
const orderList = ref([]);
// const contractList = ref([])
const cpList = ref()//成品物料
const mpList = ref()//成品物料
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectId: undefined,
  projectCode: undefined,
  contractId: undefined,
  orderCode: undefined,
})
const checkPartNumberExist =async (rule,value,callback)=>{
  orderList.value.forEach((item=>{
    if(item.partNumber ===formData.value.partNumber){
      callback(new Error('图号已存在,请选择新图号'))
    }
  }))
  callback()
}
const checkMaterialNumber =async (rule,value,callback)=>{
  debugger
  //如果整单外协了,也带料了,但材料没选
  if(formData.value.outsoure ===1&&formData.value.processType ===1&&formData.value.materialNumber ===undefined){
    callback(new Error('带料整单外协要选择物料'))
  }
  callback()
}

const formRules = reactive({
  projectId: [{ required: true, message: '项目id不能为空', trigger: 'blur' }],
  materialNumber: [{ required: true, message: '项目id不能为空', trigger: 'blur' },{validator: checkMaterialNumber,trigger: 'blur'}],
  partNumber: [{ required: true, message: '图号不能为空', trigger: 'blur' },{validator: checkPartNumberExist,trigger: 'blur'}],
  partName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  processType: [{ required: true, message: '带料加工不能为空', trigger: 'blur' }],
  processCondition: [{ required: true, message: '加工状态不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const projectFormRef = ref()

//开关按钮
const orderCustom = ref(false)

/** 子表的表单 */
const subTabsName = ref('orderList')
const orderListFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await getProjectList();
  await getMaterialList();
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await OrderApi.getOrder(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  //不需要评审，就得先决定外协
  if(formData.value.needsAssessment ===0){
    if(formData.value.outsource === undefined){
      message.warning("请决定整单外协")
      return
    }
  }

  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as OrderVO
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
    contractId: undefined,
    orderCode: undefined,
  }
  formRef.value?.resetFields()
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
//   }
//
// },{deep: true})

// const getContractOrder =async (val)=>{
//   const data = await ContractApi.getContract(val)
//
//   const productsList = data.products;
//
//   if(formType.value === 'create'){
//     productsList.forEach((item)=>{
//       item.materialDeliveryTime = item.leadDate
//       item.orderId = item.id
//     })
//     orderListFormRef.value.setData(productsList)
//   }
//
// }
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

//物料类型列表
const getMaterialList = async ()=>{
  //成品物料
  const gzcalue = await OrderApi.getMaterialByTypeCode('GZ');
  cpList.value = await OrderApi.getMaterialByTypeCode('CP');
  cpList.value.push(...gzcalue);
  mpList.value = await OrderApi.getMaterialByTypeCode('MP');
}

const getProjectList = async ()=>{
 // const data = await ApprovalApi.getByStatusList([])
 const data = await ApprovalApi.getByProjectStatusList([0])
  projectList.value = data;
}
const chooseProject = async (row)=>{
  console.log(row,'111')
  if(row!=undefined){
    orderList.value =await OrderApi.getOrderByProjectId(row);
    projectList.value.forEach((item)=>{
      if(item.id===row){
        formData.value.projectCode = item.projectCode;
        formData.value.needsAssessment = item.needsAssessment;
        formData.value.projectName = item.projectName;
      }
    })
  }else {
    formData.value.projectCode = undefined;
    formData.value.needsAssessment = undefined;
    formData.value.projectName = undefined;
    orderList.value = [];
  }
}

const changePartNumber = (row)=>{
  if(row){
    cpList.value.forEach((item)=>{
      if(row === item.materialNumber){
        formData.value.partName = item.materialName;
      }
    })
  }else {
    formData.value.partName = undefined;
  }
}
</script>
