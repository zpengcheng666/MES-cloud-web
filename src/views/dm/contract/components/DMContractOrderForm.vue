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
      <el-table-column label="序号" type="index" align="center" width="60" />
       <el-table-column label="产品" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialId`" :rules="formRules.materialId" class="mb-0px!">

            <!--{{row.materialName}}-->
            <el-select
              v-model="row.materialId"
              clearable
              filterable
              @change="onChangeProduct($event, row)"
              placeholder="请选择产品"
              :disabled="formType == 'detail'"
            >
              <el-option
                v-for="item in productList"
                :key="item.materialConfigId"
                :label="item.materialName"
                :value="item.materialConfigId"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" type="index" width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialUnit`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialUnit}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input-number
              v-model="row.quantity"
              controls-position="right"
              :min="0.00"
              :precision="3"
              class="!w-100%"
              placeholder="请输入数量"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.price`" :rules="formRules.price" class="mb-0px!" @input="cal(row, 'price')" >
            <el-input v-model="row.price"    :disabled="formType == 'detail'"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="税率" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxRate`" :rules="formRules.taxRate" class="mb-0px!" @input="cal(row, 'taxRate')">
            <el-input-number
              v-model="row.taxRate"
              controls-position="right"
              :min="0.00"
              :precision="2"
              class="!w-100%"
              placeholder="请输入税率"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="含税单价" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taxPrice`" :rules="formRules.taxPrice" class="mb-0px!" @input="cal(row, 'taxPrice')">
            <el-input-number
              v-model="row.taxPrice"
              controls-position="right"
              :min="0.00"
              :precision="2"
              class="!w-100%"
              placeholder="请输入含税单价"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="交货日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.leadDate`" :rules="formRules.leadDate" class="mb-0px!">
            <el-date-picker
              v-model="row.leadDate"
              type="date"
              value-format="x"
              placeholder="选择交货日期"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="合计" prop="totalPrice" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalPrice`" class="mb-0px!">
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter"  />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60" v-if="formType != 'detail'">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <el-row justify="center" class="mt-3" v-if="formType != 'detail'">
    <el-button @click="handleAdd" round>+ 添加产品</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ContractApi } from '@/api/ppm/contract'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import {DMContractApi, DMContractVO} from '@/api/dm/contract'
const props = defineProps<{
  contractId: string ,// 合同ID（主表的关联字段）
  products: [any],
  productList: [any],
  formType: string,
  projectId: string,
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const formRules = reactive({
  materialId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
  taxRate: [{ required: true, message: '税率不能为空', trigger: 'blur' }],
  taxPrice: [{ required: true, message: '含税单价不能为空', trigger: 'blur' }],
  leadDate: [{ required: true, message: '交货日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const message = useMessage() // 消息弹窗
// const projectOrders = ref([])
// // /** 初始化设置产品项 */
// watch(
//   () => props.projectOrder,
//   async (val) => {
//       if (val){
//           products[0].materialId=props.projectOrder.materialConfigId
//           products[0].materialName=props.projectOrder.materialName
//           products[0].materialUnit=props.projectOrder.materialUnit
//           products[0].projectId=props.projectOrder.projectId
//           products[0].orderId=props.projectOrder.id
//          products[0].productPlanId=props.projectOrder.productPlanId
//       }
//
//     formData.value = val
//   },
//   { immediate: true }
// )/** 监听合同产品变化，计算合同产品总价 */
// /** 初始化设置产品项 */
watch(
    () => props.products,
    async (val) => {
        formData.value = val
    },
    { immediate: true }
)

watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
    // 循环处理
    val.forEach((item) => {
      if (item.quantity != null && item.price != null && item.taxRate != null && item.taxPrice != null) {
        item.totalPrice = erpPriceMultiply(item.taxPrice, item.quantity)
      } else {
        item.totalPrice = undefined
      }
    })
  },
  { deep: true }
)

// /** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//   () => props.contractId,
//   async (val) => {
//     // 1. 重置表单
//     formData.value = []
//     // 2. val 非空，则加载数据
//     if (!val) {
//       return;
//     }
//     try {
//       formLoading.value = true
//       formData.value = await ContractApi.getContractOrderListByContractId(val)
//     } finally {
//       formLoading.value = false
//     }
//   },
//   { immediate: true }
// )


//
//
// /** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//     () => props.projectId,
//     async (val) => {
//         // 1. 重置表单
//         formData.value = []
//         // 2. val 非空，则加载数据
//         if (!val) {
//             return;
//         }
//         try {
//             debugger
//             formLoading.value = true
//             //projectOrders.value =await DMContractApi.getProductOrderList(2,props.projectId)
//             //debugger
//         } finally {
//             formLoading.value = false
//         }
//     },
//     { immediate: true }
// )


/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: '',
    contractId:props.contractId,
    materialId: undefined,
      materialName: undefined,
      materialUnit: undefined,
      projectId:undefined,
      orderId:undefined,
      productPlanId:undefined,
    quantity: undefined,
    price: undefined,
    taxRate: undefined,
    taxPrice: undefined,
    leadDate: undefined,

  }
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 处理产品变更 */
const onChangeProduct = (materialConfigId, row) => {
  const product =props.productList.find((item) => item.materialConfigId === materialConfigId)
  if (product) {
    row.price = product.initPrice
    row.materialId = product.materialConfigId
    row.materialName = product.materialName
    row.projectId = product.projectId
    row.orderId = product.id
    row.quantity = product.canQuantity
    row.materialUnit = product.materialUnit
    // row.tax_rate = product.no
    // row.tax_price = product.price
    // row.lead_date = product.price
  }
}


/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

const cal = (row, field) => {
  // 修改单价
  if(field == 'price'){
    if(row.price){
      if(row.taxRate){
        row.taxPrice = parseFloat(parseFloat(parseFloat(row.price * row.taxRate) + parseFloat(row.price)).toFixed(2))
      }
      else {
        if(row.taxPrice){
          row.taxRate = parseFloat(parseFloat(parseFloat(row.taxPrice) / parseFloat(row.price) - parseFloat(1)).toFixed(2))
        }
      }
    }
  }
  // 修改税率
  else if(field == 'taxRate'){
    if(row.taxRate){
      if(row.price){
        row.taxPrice = parseFloat(parseFloat(parseFloat(row.price) * parseFloat(row.taxRate) + parseFloat(row.price)).toFixed(2))
      }
      else {
        if(row.taxPrice){
          row.price = parseFloat(parseFloat(parseFloat(row.taxPrice) / (parseFloat(1) + parseFloat(row.taxRate))).toFixed(2))

        }
      }
    }
  }
  // 修改 含税单价
  else {
    if(row.taxPrice){
      if(row.taxRate){
        row.price = parseFloat(parseFloat(parseFloat(row.taxPrice) / (parseFloat(1) + parseFloat(row.taxRate))).toFixed(2))
      }
      else {
        if(row.price){
          row.taxRate = parseFloat(parseFloat(parseFloat(row.taxPrice) / parseFloat(row.price) - parseFloat(1)).toFixed(2))
        }
      }
    }
  }
}

defineExpose({ validate, getData })
</script>
