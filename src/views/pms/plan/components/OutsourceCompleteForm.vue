<template>
  <Dialog title="外协完成" v-model="dialogVisible" width="600" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="120px"
      :inline-message="true"
    >

      <!--<el-form-item label="整单外协" prop="outsource">-->
        <!--<el-select v-model="formData.outsource" placeholder="请选择整单外协" disabled>-->
          <!--<el-option-->
          <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"-->
          <!--:key="dict.value"-->
          <!--:label="dict.label"-->
          <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
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
      <el-form-item label="物料条码" prop="materialCode">
        <el-select v-model="formData.materialCode" placeholder="请选择物码">
          <el-option
            v-for="item in stockList"
            :key="item.id"
            :label="item.barCode"
            :value="item.barCode"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="计划数量" prop="quantity">-->
        <!--<el-input v-model="formData.quantity" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="待外协" prop="outsourceNumber">-->
        <!--<el-input v-model="formData.outsourceNumber" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="物料选取" prop="materialCodeListStr" v-if="formData.processType === 1">-->
        <!--&lt;!&ndash; :disabled="!formData.processStep" &ndash;&gt;-->
        <!--<el-input v-model="formData.materialCodeListStr" @click="openMaterialCodeTable" readonly/>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="采购数量" prop="purchaseAmount" v-if="formData.processType === 2">-->
        <!--<el-input-number v-model="formData.purchaseAmount"/>-->
      <!--</el-form-item>-->
    </el-form>
    <ContentWrap title="可选物码">
      <el-table :data="stockList" :height="150">
        <el-table-column label="物码" align="center" prop="barCode" />
        <el-table-column label="批次号" align="center" prop="batchNumber" />
        <el-table-column label="物料编号" align="center" prop="materialNumber" />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PlanApi } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import { RelationApi } from '@/api/pms/orderMaterialRelation'
import { ProcessPlanApi } from '@/api/pdm/processPlan'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import MaterialCodeRelationTable from './MaterialCodeRelationTable.vue'
import { MaterialConfigApi } from '@/api/mcc/materialconfig'

/**
 * 外协完成，整单外协确定完成用
 * 选择没被占用的成品,和按码查询成品
 *
 */
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

const stockList = ref<any[]>([])
const branch = ref()

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

//工艺方案
const processSchemeList = ref<any[]>([])
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

//index为1,外协入库,index为2外协完成
const open =async (row,index)=>{
  branch.value = index;
  dialogVisible.value = true
  resetForm()
  formLoading.value = true
  try {
    console.log(row,'123456')
    formData.value = Object.assign({},row,{materialCode:undefined})
    if(branch.value === 1){
      //工序外协
      stockList.value =await RelationApi.selectStorageMaterialCodeByRelationId(formData.value.id)
    }
    //根据关系id查询可选码,整单外协
    if(branch.value === 2){
      //stockList.value =await RelationApi.selectCompleteMaterialCodeByRelationId(formData.value.id)
      stockList.value =await RelationApi.selectCompleteMaterialCodeByRelationId2(formData.value.id,row.planId)
    }
    const materialConfigList = await MaterialConfigApi.getMaterialConfigList();
    stockList.value.forEach((val)=>{
      materialConfigList?.forEach((item)=>{
        if(val.materialConfigId === item.id){
          val.materialNumber = item.materialNumber
        }
      })
    })
  } finally {
    formLoading.value = false
  }

}

const submitForm = async () => {
  await formRef.value.validate()
  if(stockList.value.length===0){
    message.warning('没有可选择的物码')
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    dialogVisible.value = false
    //PlanApi.createPlanItem(data)
    //selectRows.value = []
    //外协入库用
    if(branch.value === 1){
      //await RelationApi.outsourceComplete(data)
      await RelationApi.outsourceInStorage(data)
    }

    //外协入库，整单外协用
    if(branch.value === 2){
      await RelationApi.outsourceComplete(data)
    }
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
  stockList.value = []
  formRef.value?.resetFields()
}

const closeDialog = ()=>{
  dialogVisible.value = false
  selectRows.value = [];
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
