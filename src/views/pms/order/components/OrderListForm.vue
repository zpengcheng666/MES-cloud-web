<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="序号" type="index" width="100" />
      <!--<el-table-column label="产品编号" min-width="180" prop="materialId"/>-->
      <!--<el-table-column label="图号/编号" min-width="120" prop="materialId"/>-->
      <!--<el-table-column label="编号" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.materialId`" :rules="formRules.materialId" class="mb-0px!">-->
            <!--<el-select v-model="row.materialId" placeholder="请选择零件/材料" :disabled="!addOrderVisible">-->
              <!--<el-option-->
                <!--v-for="item in materialList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.materialId"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="图号" min-width="200">
        <template #default="{ row, $index }">
          <!--<el-form-item :prop="`${$index}.partNumber`" :rules="formRules.partNumber" class="mb-0px!">-->
            <!--<el-select v-model="row.partNumber" placeholder="请选择零件/材料" :disabled="!addOrderVisible">-->
              <!--<el-option-->
                <!--v-for="item in productList"-->
                <!--:key="item.id"-->
                <!--:label="item.partNumber"-->
                <!--:value="item.partNumber"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item :prop="`${$index}.partNumber`" class="mb-0px!">
            <el-input v-model="row.partNumber" placeholder="请选择零件" @click="openProductForm($index)" readonly :disabled="!addOrderVisible"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input-number v-model="row.quantity" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="带料加工" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.processType`" :rules="formRules.processType" class="mb-0px!">
            <el-select v-model="row.processType" placeholder="请选择带料加工">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="原料交付时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialDeliveryTime`" :rules="formRules.materialDeliveryTime" class="mb-0px!">
            <el-date-picker
              v-model="row.materialDeliveryTime"
              type="date"
              value-format="x"
              placeholder="选择原料交付时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="成品交付时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.fproDeliveryTime`" :rules="formRules.fproDeliveryTime" class="mb-0px!">
            <el-date-picker
              v-model="row.fproDeliveryTime"
              type="date"
              value-format="x"
              placeholder="选择成品交付时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column v-if="addOrderVisible" align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row v-show="addOrderVisible" justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加项目订单表子</el-button>
  </el-row>
  <ProductForm ref="productFormRef" @getPartNumber="getPartNumber"/>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { OrderApi } from '@/api/pms/order'
import { MaterialConfigApi } from '@/api/wms/materialconfig'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import {FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
import {FeasibilityTaskApi} from "@/api/pdm/feasibilityTask";
import ProductForm from './ProductForm.vue';
import {on} from "../../../../utils/domUtils";

const props = defineProps<{
  projectOrderId: undefined // 项目订单id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const productFormRef = ref();

//控制自定义的开关
const addOrderVisible = ref(false);
//项目类型,用于区分该请求哪个零件,材料哪个接口
const projectTypeOrder = ref()

const material = ref();
//零件或材料
// const materialList = ref();
//零件产品
const productList = ref();
// const productLists = ref<any[]>([]);
//
// for (let i = 0; i < 100; i++) {
//   const row = {
//     id:i,
//     partVersionId: "d4fc524ecff44b98966a58f753c34d15",
//     partNumber: "C01341057-111",
//     partName: "CLIP, TEE",
//     partVersion: "-A",
//     productNumber: "A220",
//     reviewer: "芋道源码"+i,
//   }
//   productLists.value.push(row)
// }

//注入给ProductForm使用
provide('productList',productList);
/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectOrderId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await OrderApi.getOrderListByProjectOrderId(val)
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
    materialId: undefined,
    partNumber: undefined,
    quantity: undefined,
    processType: undefined,
    materialDeliveryTime: undefined,
    fproDeliveryTime: undefined,
    projectOrderId: undefined,
  }
  row.projectOrderId = props.projectOrderId
  formData.value.push(row)
}

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
  formData.value = data;
}
const getPartNumber = (val,index)=>{
  if(index>=0){
    formData.value[index].partNumber = val.partNumber;
  }
}
/**
 * 获取材料属性,暂时弃用
 * @param row
 */
// const getMaterial = async (row)=>{
//   material.value =await MaterialConfigApi.getMaterialConfig(row.materialId);
// }
/**
 * 从pdm那边拉取数据
 */

const fromProject =async (val)=>{
  formData.value = []
  //获取零件信息
  const data = await FeasibilityDetailApi.getProjPartBomListByProjectCode({projectCode:val,viewSelf: false})
  const data2 =await FeasibilityTaskApi.getPartListByFeasibilityTaskId({projectCode:val});
  data.push(...data2);
  formData.value = data;


}
/**
 * 来自合同
 */
const fromContract = async (val)=>{
  formData.value = []
  const data = await ContractApi.getContract(val)
  const productsList = data.products;


    productsList.forEach((item)=>{
      item.materialDeliveryTime = item.leadDate
      item.orderId = item.id
    })
  formData.value = productsList;
}

const changeAddOrderVisible = async (val)=>{
  addOrderVisible.value = val;
}
const changeSelectMaterial = async (val)=>{
  // debugger
  //采购的
  // if(projectTypeOrder.value===1){
  //   materialList.value =await MaterialConfigApi.getMaterialConfigList();
  //   materialList.value.forEach(item=>{
  //     item.name = item.materialName
  //     item.materialId = item.id;
  //   })
  // }
  //销售的
  // if(projectTypeOrder.value===2){
  //   productList.value = await FeasibilityDetailApi.getProjPartBomListByProjectCode({projectCode:val,viewSelf: false})
  const data = await FeasibilityDetailApi.getProjPartBomListByProjectCode({projectCode:val,viewSelf: false})
  const data2 =await FeasibilityTaskApi.getPartListByFeasibilityTaskId({projectCode:val});
  data.push(...data2);
  productList.value = data;
    // const itemData = await FeasibilityDetailApi.getProjPartBomListByProjectCode({projectCode:val,viewSelf: false})
    // itemData.forEach(item=>{
    //   item.materialId = item.partNumber;
    //   item.name = item.partNumber;
    // })
    // materialList.value =  itemData;
  // }
}

const openProductForm = (index)=>{
  productFormRef.value.open(index)
}


defineExpose({ validate, getData,setData,fromProject,fromContract,changeAddOrderVisible,projectTypeOrder,changeSelectMaterial })
</script>
