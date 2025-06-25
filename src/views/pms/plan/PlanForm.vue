<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="136px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openProjectForm" readonly :disabled="updateDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目编码" prop="projectCode">
            <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图号" prop="partNumber">
            <el-input v-model="formData.partNumber" placeholder="请输入图号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工件名称" prop="partName">
            <el-input v-model="formData.partName" placeholder="请输入工件名称" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="物料牌号" prop="materialNumber">-->
            <!--<el-input v-model="formData.materialNumber" placeholder="请输入物料牌号" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="订单类型" prop="orderType">-->
            <!--<el-select v-model="formData.orderType" placeholder="请选择订单类型" disabled>-->
              <!--<el-option-->
                <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_TYPE)"-->
                <!--:key="dict.value"-->
                <!--:label="dict.label"-->
                <!--:value="dict.value"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="计划数量" prop="quantity">-->
            <!--<el-input v-model="formData.quantity" placeholder="请输入计划数量" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="外协数量" prop="outSourceAmount">-->
            <!--<el-input v-model="formData.outSourceAmount" placeholder="请输入外协数量" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="带料加工" prop="processType">-->
            <!--<el-select v-model="formData.processType" placeholder="请选择带料加工" disabled>-->
              <!--<el-option-->
                <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"-->
                <!--:key="dict.value"-->
                <!--:label="dict.label"-->
                <!--:value="dict.value"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="加工状态" prop="processCondition">-->
            <!--<el-input v-model="formData.processCondition" placeholder="请选择加工状态" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <div v-if="formData.outsource === 0">
        <el-row>
          <el-col :span="12">
            <el-form-item label="工艺完成时间" prop="processPreparationTime">
              <el-date-picker
                v-model="formData.processPreparationTime"
                type="date"
                value-format="x"
                placeholder="选择工艺准备完成时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购完成时间" prop="purchaseCompletionTime" >
              <el-date-picker
                v-model="formData.purchaseCompletionTime"
                type="date"
                value-format="x"
                placeholder="选择采购准备完成时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产准备完成时间" prop="productionPreparationTime">
              <el-date-picker
                v-model="formData.productionPreparationTime"
                type="date"
                value-format="x"
                placeholder="选择生产准备完成时间"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="入库完成时间" prop="warehousingTime" >
              <el-date-picker
                v-model="formData.warehousingTime"
                type="date"
                value-format="x"
                placeholder="选择入库准备完成时间"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="检验完成时间" prop="checkoutCompletionTime" >
              <el-date-picker
                v-model="formData.checkoutCompletionTime"
                type="date"
                value-format="x"
                placeholder="选择检验完成时间"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="交付完成时间" prop="planDeliveryTime" >
              <el-date-picker
                v-model="formData.planDeliveryTime"
                type="date"
                value-format="x"
                placeholder="选择计划交付完成时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div v-else>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购完成时间" prop="purchaseCompletionTime" >
              <el-date-picker
                v-model="formData.purchaseCompletionTime"
                type="date"
                value-format="x"
                placeholder="选择采购准备完成时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库完成时间" prop="warehousingTime" >
              <el-date-picker
                v-model="formData.warehousingTime"
                type="date"
                value-format="x"
                placeholder="选择入库准备完成时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验完成时间" prop="checkoutCompletionTime" >
              <el-date-picker
                v-model="formData.checkoutCompletionTime"
                type="date"
                value-format="x"
                placeholder="选择检验完成时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交付完成时间" prop="planDeliveryTime" >
              <el-date-picker
                v-model="formData.planDeliveryTime"
                type="date"
                value-format="x"
                placeholder="选择计划交付完成时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>




      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="采购完成时间" prop="purchaseCompletionTime" >-->
            <!--<el-date-picker-->
              <!--v-model="formData.purchaseCompletionTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择采购准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->

        <!--<el-col :span="12">-->
          <!--<el-form-item label="入库完成时间" prop="warehousingTime" >-->
            <!--<el-date-picker-->
              <!--v-model="formData.warehousingTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择入库准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="工艺完成时间" prop="processPreparationTime" v-if="formData.outsource === 0">-->
            <!--<el-date-picker-->
              <!--v-model="formData.processPreparationTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择工艺准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="生产准备完成时间" prop="productionPreparationTime" v-if="formData.outsource === 0">-->
            <!--<el-date-picker-->
              <!--v-model="formData.productionPreparationTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择生产准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="检验完成时间" prop="checkoutCompletionTime" >-->
            <!--<el-date-picker-->
              <!--v-model="formData.checkoutCompletionTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择检验完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="交付完成时间" prop="planDeliveryTime" >-->
            <!--<el-date-picker-->
              <!--v-model="formData.planDeliveryTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="选择计划交付完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="工艺方案" prop="processScheme">-->
            <!--<el-select v-model="formData.processScheme" placeholder="请选择工艺方案" @change="selectChange" :disabled="formData.processScheme">-->
              <!--<el-option-->
                <!--v-for="item in processSchemeList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注"/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 子表的表单 -->
    <!--<el-tabs v-model="subTabsName">-->
      <!--<el-tab-pane label="项目计划明细" name="planItem">-->
        <!--<div style="margin-bottom: 20px">-->
          <!--<el-button @click="getPurchaseTime(formData.projectOrderId)" type="primary">获取采购完成时间</el-button>-->
        <!--</div>-->
        <!--<PlanItemForm ref="planItemFormRef" :project-plan-id="formData.id" />-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <ProjectForm ref="projectFormRef" :project-status = 3 @success="getProjectRow"/>
  </Dialog>
</template>
<script setup lang="ts">
import { PlanApi, PlanVO } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import PlanItemForm from './components/PlanItemForm.vue'
import { ContractApi } from '@/api/ppm/contract'
import ProjectForm from './components/ProjectForm.vue';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

/** 项目计划 表单 */
defineOptions({ name: 'PlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  projectOrderId: undefined,
  remark: undefined,
  status: undefined,
  processInstanceId: undefined,
})
const formRules = reactive({
  purchaseCompletionTime: [{ required: true, message: '采购完成时间不能为空', trigger: 'blur' }],
  warehousingTime: [{required: true, message: '入库完成时间不能为空', trigger: 'blur'}],
  processPreparationTime: [{required: true, message: '工艺完成时间不能为空', trigger: 'blur'}],
  productionPreparationTime: [{required: true, message: '生产准备完成时间不能为空', trigger: 'blur'}],
  checkoutCompletionTime: [{required: true, message: '检验完成时间不能为空', trigger: 'blur'}],
  planDeliveryTime: [{required: true, message: '交付完成时间不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref
const projectFormRef = ref()

//项目订单
const projectOrderList = ref([])

/** 子表的表单 */
const subTabsName = ref('planItem')
const planItemFormRef = ref()
//工艺方案
const processSchemeList = ref<any[]>([])

const updateDisabled = ref(true)

/** 打开弹窗 */
const open = async (row) => {
  // projectOrderList.value =  await OrderApi.getAll()
  dialogVisible.value = true
  //updateDisabled.value = false
  dialogTitle.value = t('action.' + 'create')
  formType.value = 'create'
  resetForm()
  //console.log(row)
  //initData(row)
  // 修改时，设置数据
  if (row?.planId) {
    dialogTitle.value = t('action.' + 'update')
    formType.value = 'update'
    formLoading.value = true
    try {
      updateDisabled.value = true
      formData.value = await PlanApi.getPlan(row?.planId)
      getProcessScheme();
    } finally {
      formLoading.value = false
    }
  }
  initData(row)
}
const initData = (row)=>{
  formData.value.partNumber = row.partNumber;
  formData.value.partName = row.partName;
  formData.value.projectName = row.projectName;
  formData.value.projectCode = row.projectCode;
  formData.value.projectOrderId = row.projectOrderId;
  formData.value.outsource = row.outsource;
}


defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // debugger
  // console.log(formData)
  // 校验表单

  await formRef.value.validate()
  // 校验子表单
  // try {
  //   await planItemFormRef.value.validate()
  // } catch (e) {
  //   subTabsName.value = 'planItem'
  //   return
  // }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PlanVO
    // 拼接子表的数据
    // data.planItems = planItemFormRef.value.getData()
    if (formType.value === 'create') {
      await PlanApi.createPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlanApi.updatePlan(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
    dialogVisible.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectOrderId: undefined,
    remark: undefined,
    status: undefined,
    processInstanceId: undefined,
    partNumber: undefined,
    partName: undefined,
    projectName: undefined,
    projectCode: undefined,

  }
  processSchemeList.value = [];
  formRef.value?.resetFields()
}


/**
 * 根据订单id获得具体的订单
 */
const getOrderList =async (val)=>{
  const data =await OrderApi.getOrderListByProjectOrderId(val);
}

const setProjectCode = async (val)=>{
  const row =   await OrderApi.getOrder(val);
  // planItemFormRef.value.projectCode = row.projectCode;
  // planItemFormRef.value.selectList(-1);
}

/**
 * 获取采购完成时间
 * @param id,项目订单id
 */
const getPurchaseTime = async (id)=>{
  if(id===undefined){
    message.warning("请先选择订单")
    return
  }
  const rows = projectOrderList.value.filter(val=>{
    return val.id === id;
  })
  const row = rows[0];
  console.log(row)
  const projectId = row.projectId;
  //根据id查询合同
  let ids = [1];
  const contractList =  await ContractApi.getContractListByType(ids);

  const contractData = contractList.filter((val)=>{
    // return val.projectId === projectId;
    return true;
  })

  const contractProduct = [];
  for(let i=0;i<contractData.length;i++){
   const rows = await ContractApi.getContractOrderListByContractId(contractData[i].id)
    contractProduct.push(...rows);
  }


  //给时间赋值
  // const data = planItemFormRef.value.getData()
  // data.forEach((item=>{
  //   contractProduct.forEach((val)=>{
  //     if(item.materialId ===val.materialId){
  //       // item.purchaseCompletionTime = val.leadDate>item.purchaseCompletionTime?val.leadDate:item.purchaseCompletionTime;
  //       if(item.purchaseCompletionTime!=undefined){
  //         item.purchaseCompletionTime = val.leadDate>item.purchaseCompletionTime?val.leadDate:item.purchaseCompletionTime;
  //       }else {
  //         item.purchaseCompletionTime = val.leadDate;
  //       }
  //
  //     }
  //   })
  // }))
  // planItemFormRef.value.setData(data)
}

/**
 * 打开选择项目的弹窗
 *
 */
const openProjectForm = ()=>{
  projectFormRef.value.open()
}
/**
 * 选择项目成功时返回的数据,设置项目id和项目名
 * @param row
 */
const getProjectRow = (row)=>{
  const orderList = row.orderList;
  const order = orderList[0];
  console.log(order);
  formData.value.projectId = row.id;
  formData.value.projectName = row.projectName;
  formData.value.projectCode = row.projectCode;
  formData.value.responsiblePerson = row.responsiblePerson;
  formData.value.projectOrderId = order?.id;
  formData.value.partNumber = order?.partNumber;
  formData.value.partName = order?.partName;
  formData.value.materialNumber = order?.materialNumber;
  formData.value.orderType = order?.orderType;
  formData.value.quantity = order?.quantity;
  formData.value.outSourceAmount = order?.outSourceAmount;
  formData.value.stepOutSourceAmount = order?.stepOutSourceAmount;
  formData.value.processType = order?.processType;
  formData.value.processCondition = order?.processCondition;
  getProcessScheme()
}
//获取工艺方案
const getProcessScheme =async ()=>{
  const params = {
    projectCode:formData.value.projectCode,
    partNumber:formData.value.partNumber,
  }
  //整个项目的工艺方案,用新接口
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processSchemeList.value = list.filter((item)=>{
    return item.type ===2;
  })
}
</script>
