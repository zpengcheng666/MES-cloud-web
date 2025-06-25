<template>
  <Dialog title="整单外协" v-model="dialogVisible" width="600" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="120px"
      :inline-message="true"
    >
      <!--<el-form-item label="计划数量" prop="quantity">-->
        <!--<el-input v-model="formData.quantity" placeholder="请输入计划数量" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="整单外协" prop="outsourceNmae">-->
        <!--<el-input v-model="formData.outsourceNmae" placeholder="整单外协" disabled/>-->
      <!--</el-form-item>-->

      <el-form-item label="整单外协" prop="outsource">
        <el-select v-model="formData.outsource" placeholder="请选择整单外协" disabled>
          <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"
          :key="dict.value"
          :label="dict.label"
          :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="带料加工" prop="processType">
        <el-select v-model="formData.processType" placeholder="请选择带料加工" disabled>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="整单外协" prop="outsourceNmae">-->
        <!--<el-input v-model="formData.outsourceNmae" placeholder="整单外协" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="计划类型" prop="planType">-->
        <!--<el-select v-model="formData.planType" placeholder="请选择计划类型" @change="amountCompute">-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PLAN_ITEM_TYPE)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="可分配数量" prop="selectable">-->
        <!--<el-input v-model="formData.selectable" placeholder="请输入可选数量" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="工序" prop="processStep">-->
        <!--<el-select v-model="formData.processStep" placeholder="请选择工序" @change="selectStep">-->
          <!--<el-option-->
            <!--v-for="item in processStepList"-->
            <!--:key="item.id"-->
            <!--:label="item.procedureNum"-->
            <!--:value="item.procedureNum"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="计划数量" prop="quantity">
        <el-input v-model="formData.quantity" disabled/>
      </el-form-item>
      <el-form-item label="待外协" prop="outsourceNumber">
        <el-input v-model="formData.outsourceNumber" disabled/>
      </el-form-item>
      <el-form-item label="物料选取" prop="materialCodeListStr" v-if="formData.processType === 1">
        <!-- :disabled="!formData.processStep" -->
        <el-input v-model="formData.materialCodeListStr" @click="openMaterialCodeTable" readonly/>
      </el-form-item>

      <el-form-item label="采购数量" prop="purchaseAmount" v-if="formData.processType === 2">
        <el-input-number v-model="formData.purchaseAmount"/>
      </el-form-item>
    </el-form>
    <!--<ContentWrap title="工序表">-->
      <!--<el-table :data="processStepList" :height="200">-->
        <!--<el-table-column label="工序" align="center" prop="procedureNum" />-->
        <!--<el-table-column label="工序名" align="center" prop="procedureName" />-->
        <!--<el-table-column label="外协" align="center" prop="sourceName" />-->
      <!--</el-table>-->
    <!--</ContentWrap>-->

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <!--<el-button @click="test">测试</el-button>-->
    </template>
    <!-- 订单物料关系表 -->
    <!--<MaterialCodeRelationTable ref="materialCodeRelationTableRef" @success="getRelationRows"/>-->
  </Dialog>
  <!-- 订单物料关系表 -->
  <MaterialCodeRelationTable ref="materialCodeRelationTableRef" @success="getRelationRows"/>
</template>
<script setup lang="ts">
import { PlanApi } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import { RelationApi } from '@/api/pms/orderMaterialRelation'
import { ProcessPlanApi } from '@/api/pdm/processPlan'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import MaterialCodeRelationTable from './MaterialCodeRelationTable.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const props = defineProps<{
  projectPlanId: undefined // 项目计划id（主表的关联字段）
}>()

const checkQuantity =async (rule,value,callback)=>{
  if(formData.value.quantity>formData.value.selectable){
    callback(new Error('选取的物料数量多余可分配的数量,请减少选取的物料数量'))
  }
  callback()
}
const checkpurchase =async (rule,value,callback)=>{
  if(formData.value.purchaseAmount>formData.value.outsourceNumber){
    callback(new Error('采购数量不能大于要外协的数量'))
  }
  callback()
}
const formRules = reactive({
  // quantity: [{ required: true, message: '计划数量不能为空', trigger: 'blur' },{validator: checkQuantity,trigger: 'blur'}],
  // planType: [{ required: true, message: '计划类型不能为空', trigger: 'blur' }],
  // processScheme: [{ required: true, message: '工艺方案不能为空', trigger: 'blur' }],
  // materialCodeListStr: [{ required: true, message: '物料选取不能为空', trigger: 'blur' }],
  purchaseAmount: [{ required: true, message: '计划数量不能为空', trigger: 'blur' },{validator: checkpurchase,trigger: 'blur'}],
 })
const formRef = ref() // 表单 Ref
const materialCodeRelationTableRef = ref();

//工艺方案
const processSchemeList = ref<any[]>([])
//工序
// const processStepList = ref<any[]>([])
//可加工工序
const processingProcedureList = ref<any[]>([])
const relationList = ref<any[]>([])
const selectRows = ref<any[]>([])
//工序
const step = ref();

const formData = ref({
  id: undefined,
  projectId:undefined,
  projectPlanId: undefined,
  projectCode:undefined,
  projectOrderId:undefined,
  quantity:undefined,
  partNumber: undefined,
  materialNumber:undefined,
  processScheme:undefined,
  planType:undefined,
  processStep:undefined

})

const open =async (row)=>{
  console.log(row)
  dialogVisible.value = true
  dialogTitle.value = t('action.' + 'create')
  resetForm()
  formLoading.value = true
  try {

    // formData.value = Object.assign({},row,{quantity:undefined})
    formData.value = Object.assign({},row)
    formData.value.projectId = row.id;
    formData.value.outsource = row.outsource;
    formData.value.projectPlanId = row.planId;
    //订单物料关系
    relationList.value = await RelationApi.getRelationListByOrderId(row.projectOrderId)
    let temp = 0;
    relationList.value.forEach((item)=>{
      if(item.planItemId===null||item.planItemId==undefined){
        temp++;
      }
    })
    formData.value.outsourceNumber = temp;
    console.log(row);
    formData.value.selectable = 0;
    // formData.value = await PlanApi.getPlan(id)
  } finally {
    formLoading.value = false
  }

}

const submitForm = async () => {
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    dialogVisible.value = false
    PlanApi.createPlanItem(data)
    selectRows.value = []
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
    projectId:undefined,
    projectPlanId: undefined,
    projectCode:undefined,
    projectOrderId:undefined,
    quantity:undefined,
    partNumber: undefined,
    materialNumber:undefined,
    processScheme:undefined,
    planType:undefined
  }
  formRef.value?.resetFields()
}
//选择工艺方案
const selectProcessSchemeList = async ()=>{
  const params = {
    projectCode:formData.value.projectCode,
    partNumber:formData.value.partNumber,
    // viewSelf:false
  }
  //整个项目的工艺方案
  // processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
  //用新接口
  // params.projectCode = 'XM022000801';
  // params.partNumber = 'C01342091-002';
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processSchemeList.value = list.filter((item)=>{
    return item.type ===2&&item.status ==='5';
  })
  console.log(processSchemeList.value)
}

//选择工序
// const selectProcessStepList = async ()=>{
//   const params = {
//     projectCode:formData.value.projectCode,
//     partNumber:formData.value.partNumber,
//   }
//   if(formData.value.processScheme!=null&&formData.value.processScheme!=undefined){
//     processStepList.value = await PlanApi.getProcedureListByProcessVersionId(formData.value.processScheme);
//   }
// }

// const selectChange = (row)=>{
//   console.log(row);
// }

const openMaterialCodeTable = ()=>{
  console.log(formData.value.projectOrderId)
  console.log(formData.value)
  //materialCodeRelationTableRef.value.open(formData.value.projectOrderId,selectRows.value,step.value)
  materialCodeRelationTableRef.value.open(formData.value.projectOrderId,selectRows.value)
}
//获取关系 id和物料
const getRelationRows = (rows)=>{
  selectRows.value = rows;
  formData.value.quantity = selectRows.value.length;
  const array = rows.map((row)=>{
    return row.materialCode
  })
  formData.value.materialCodeList =rows.map((row)=>{
    return row.id
  })
  formData.value.materialCodeListStr = array.join(",");
  console.log(rows,'123456')
}

const closeDialog = ()=>{
  dialogVisible.value = false
  selectRows.value = [];
}

/**
 * 计算剩余可选数量
 * @param val
 */
const amountCompute =async (val)=>{
  formData.value.selectable = await RelationApi.getSelectedAmount({projectPlanId:formData.value.projectPlanId,planType:val})
}
/**
 * 选择工序后触发
 */
const selectStep = (row)=>{
  console.log(row)
  step.value = row;
  processStepList.value.forEach((item)=>{
    if(item.procedureNum===row){
      formData.value.isOut = item.isOut;
    }
  })

}

defineExpose({open})
</script>
