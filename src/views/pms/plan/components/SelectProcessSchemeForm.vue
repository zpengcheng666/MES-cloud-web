<template>
  <Dialog title="选取工序" v-model="dialogVisible" width="600" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      v-loading="formLoading"
      label-width="120px"
      :inline-message="true"
    >
      <el-form-item label="工艺方案" prop="processScheme">
        <el-select v-model="formData.processScheme" placeholder="请选择工艺方案" @change="selectChange">
          <el-option
            v-for="item in processSchemeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="整单外协" prop="outsource">-->
        <!--<div v-if="formData.outsource">-->
          <!--是-->
        <!--</div>-->
        <!--<div v-else>-->
          <!--否-->
        <!--</div>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="计划类型" prop="planType">-->
        <!--<el-select v-model="formData.planType" placeholder="请选择计划类型">-->
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

      <!--<el-form-item label="物料选取" prop="materialCodeListStr">-->
        <!--<el-input v-model="formData.materialCodeListStr" :disabled="!formData.planType" readonly/>-->
      <!--</el-form-item>-->
    </el-form>
    <!--<ContentWrap title="工序表">-->
      <!--<el-table :data="processStepList">-->
        <!--<el-table-column label="工序名" align="center" prop="name" />-->
        <!--<el-table-column label="外协" align="center" prop="sourceName" />-->
      <!--</el-table>-->
    <!--</ContentWrap>-->

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

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const formRules = reactive({

 })
const formRef = ref() // 表单 Ref


//工艺方案
const processSchemeList = ref<any[]>([])
//工序
const processStepList = ref<any[]>([])
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
  planType:undefined

})

const open =async (row)=>{
  dialogVisible.value = true
  dialogTitle.value = t('action.' + 'create')
  resetForm()
  formLoading.value = true
  try {

    formData.value = Object.assign({},row,{quantity:undefined})
    formData.value.projectId = row.id;
    formData.value.id = row.planId;
    //工艺方案
    await selectProcessSchemeList();
    //工序
    // await selectProcessStepList();
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
    await PlanApi.selectProcessScheme(data)
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
  }
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processSchemeList.value = list.filter((item)=>{
    return item.type ===2&&item.status ==='5';
  })

  console.log(processSchemeList.value)
}

//选择工序
const selectProcessStepList = async ()=>{
  const params = {
    projectCode:formData.value.projectCode,
    partNumber:formData.value.partNumber,
  }
  //params.projectCode = 'PMSKEBF3';
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processStepList.value = list.filter((item)=>{
    return item.type ===3;
  })
  processStepList.value.forEach((item)=>{
    if(item.source===1){
      item.sourceName = '是'
    }else {
      item.sourceName = '否'
    }
  })
  console.log(processStepList.value)
}

const selectChange = (row)=>{
  processSchemeList.value.forEach((item)=>{
    if(item.id===row){
      formData.value.processVersionId = item.processVersionId;
    }
  })
}


const closeDialog = ()=>{
  dialogVisible.value = false
}

defineExpose({open})
</script>
