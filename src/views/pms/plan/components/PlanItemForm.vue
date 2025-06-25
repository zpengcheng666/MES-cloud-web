<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
      <!--<el-table-column label="产品id" min-width="180" prop="materialId" />-->
      <el-table-column label="图号" min-width="180" prop="partNumber" />
       <!--<el-table-column label="产品id" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.materialId`" :rules="formRules.materialId" class="mb-0px!">-->
            <!--<el-input v-model="row.materialId" placeholder="请输入产品id" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="主计划数量" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">-->
            <!--<el-input-number v-model="row.quantity" placeholder="请输入主计划数量" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="主计划数量" min-width="150" prop="quantity"/>
      <!--<el-table-column label="工艺方案选择" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.processScheme`" :rules="formRules.processScheme" class="mb-0px!">-->
            <!--<el-select v-model="row.processScheme" placeholder="请选择项目订单编号" @click="selectList($index)" @change="selectChange(row)">-->
              <!--<el-option-->
                <!--v-for="item in processSchemeList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="物料" min-width="150" prop="materialName"/>-->
      <!--process_scheme-->
      <el-table-column label="工艺准备完成时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.processPreparationTime`" :rules="formRules.processPreparationTime" class="mb-0px!">
            <el-date-picker
              v-model="row.processPreparationTime"
              type="date"
              value-format="x"
              placeholder="选择工艺准备完成时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="采购完成时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.purchaseCompletionTime`" :rules="formRules.purchaseCompletionTime" class="mb-0px!">
            <el-date-picker
              v-model="row.purchaseCompletionTime"
              type="date"
              value-format="x"
              placeholder="选择采购完成时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="生产准备完成时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.productionPreparationTime`" :rules="formRules.productionPreparationTime" class="mb-0px!">
            <el-date-picker
              v-model="row.productionPreparationTime"
              type="date"
              value-format="x"
              placeholder="选择生产准备完成时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="入库完成时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.warehousingTime`" :rules="formRules.warehousingTime" class="mb-0px!">
            <el-date-picker
              v-model="row.warehousingTime"
              type="date"
              value-format="x"
              placeholder="选择入库时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="完成检验时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.checkoutCompletionTime`" :rules="formRules.checkoutCompletionTime" class="mb-0px!">
            <el-date-picker
              v-model="row.checkoutCompletionTime"
              type="date"
              value-format="x"
              placeholder="选择完成检验时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="计划交付时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.planDeliveryTime`" :rules="formRules.planDeliveryTime" class="mb-0px!">
            <el-date-picker
              v-model="row.planDeliveryTime"
              type="date"
              value-format="x"
              placeholder="选择计划交付时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" :rules="formRules.remark" class="mb-0px!">
            <el-input v-model="row.remark" placeholder="请输入备注" />
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" fixed="right" label="操作" width="60">-->
        <!--<template #default="{ $index }">-->
          <!--<el-button @click="handleDelete($index)" link>—</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </el-form>
  <!--<el-row justify="center" class="mt-3">-->
    <!--<el-button @click="handleAdd" round>+ 添加项目计划子表，产品计划完善</el-button>-->
  <!--</el-row>-->
</template>
<script setup lang="ts">
import { PlanApi } from '@/api/pms/plan'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

const props = defineProps<{
  projectPlanId: undefined // 项目计划id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const projectCode = ref();
const processSchemeList = ref<any[]>([])
const formRules = reactive({
  // processPreparationTime:[{type: 'date',required: true,message:'请输入工艺准备完成时间', trigger: 'blur'}],
  // productionPreparationTime:[{type: 'date',required: true,message:'请输入生产准备完成时间', trigger: 'blur'}],
  // purchaseCompletionTime:[{type: 'date',required: true,message:'请输入采购完成时间', trigger: 'blur'}],
  // warehousingTime:[{type: 'date',required: true,message:'请输入入库完成时间', trigger: 'blur'}],
  // checkoutCompletionTime:[{type: 'date',required: true,message:'请输入完成检验时间', trigger: 'blur'}],
  // planDeliveryTime:[{type: 'date',required: true,message:'请输入计划交付时间', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref

// const selectList = async (index)=>{
//   console.log('1111111111111111')
//   if(index>=0){
//     const params = {
//       projectCode:projectCode.value,
//       partNumber:formData.value[index].partNumber,
//       viewSelf:false
//     }
//     //对应图号的工艺方案
//     processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
//   }else {
//     const params = {
//       projectCode:projectCode.value,
//       viewSelf:false
//     }
//     //整个项目的工艺方案
//     processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
//   }
// }
// //选定工艺方案后,为对应物料赋值
// const selectChange = async (row)=>{
//     if(row.processScheme){
//     const data = await ProcessPlanApi.getProcess(row.processScheme);
//     //根据工艺方案的id找物料，把物料id和物料名都存上
//     row.materialId = data.materialId;
//     row.materialName = data.materialName;
//   }
// }

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectPlanId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }

    try {
      formLoading.value = true
      formData.value = await PlanApi.getPlanItemListByProjectPlanId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    projectPlanId: undefined,
    materialId: undefined,
    partNumber: undefined,
    quantity: undefined,
    processScheme: undefined,
    processPreparationTime: undefined,
    productionPreparationTime: undefined,
    purchaseCompletionTime: undefined,
    warehousingTime: undefined,
    checkoutCompletionTime: undefined,
    planDeliveryTime: undefined,
    remark: undefined,
    projectCode:undefined,
  }
  row.projectCode = projectCode.value
  row.projectPlanId = props.projectPlanId
  formData.value.push(row)
}

//监听选择的工艺方案,找到对应的物料
// watch(()=>formData.value.processScheme,async (val)=>{
//   if(val){
//     const row = await ProcessPlanApi.getProcess(val);
//     console.log(row)
//     debugger
//     //根据工艺方案的id找物料，把物料id和物料名都存上
//     formData.value.materialId = row.materialId;
//     formData.value.materialName = row.materialName;
//   }
// },{deep:true})

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

/** 设置表单值 */
const setData = (data) => {
  formData.value = data
}

defineExpose({ validate, getData,setData,projectCode })
</script>
