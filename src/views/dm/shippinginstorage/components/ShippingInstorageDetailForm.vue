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
       <el-table-column label="产品" min-width="150">
         <template #default="{ row, $index }">
           <el-form-item :prop="`${$index}.projectOrderId`" :rules="formRules.projectOrderId" class="mb-0px!">

             <el-select
                     v-model="row.projectOrderId"
                     clearable
                     filterable
                     @change="onChangeOrder($event, row)"
                     placeholder="请选择产品"
                     :disabled="props.confirmStatus !=0"
             >
               <el-option
                       v-for="item in projectOrders"
                       :key="item.id"
                       :label="item.materialName +'('+item.materialNumber+')'"
                       :value="item.id"
               />
             </el-select>


             <!--{{row.materialName}}-->
           </el-form-item>
         </template>
      </el-table-column>
      <el-table-column label="编号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" :rules="formRules.materialNumber" class="mb-0px!">

            {{row.materialNumber}}
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
      <!--<el-table-column label="项目订单" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.orderId`" :rules="formRules.orderId" class="mb-0px!">-->
            <!--<el-input v-model="row.orderId" placeholder="请输入项目订单ID" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">
            <el-input-number v-model="row.consignedAmount" placeholder="请输入数量" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="签收数量" min-width="150" v-if="props.confirmStatus ==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="请输入签收数量" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加委托加工入库明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ShippingInstorageApi } from '@/api/dm/shippinginstorage'

const props = defineProps<{
    consignmentId: undefined, // 收货单ID（主表的关联字段）
    confirmStatus:undefined,
    projectOrders: [any],
    formType: string,
    projectOrder:undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
    consignmentId: [{ required: true, message: '收货单不能为空', trigger: 'blur' }],
    projectOrderId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '发货数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const message = useMessage() // 消息弹窗
/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.consignmentId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      const  result = await ShippingInstorageApi.getShippingInstorageDetailListByShippingStorageId(val)

        formData.value = result;
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
      consignmentId: undefined,
      materialConfigId: undefined,
      materialName:undefined,
      materialNumber: undefined,
      materialUnit: undefined,
      projectId:undefined,
      projectOrderId:undefined,
      productPlanId:undefined,
      consignedAmount: undefined,
    signedAmount: undefined,
    signedBy: undefined,
    signedTime: undefined,
  }
  row.consignmentId = props.consignmentId
  formData.value.push(row)
}


/** 处理产品变更 */
const onChangeOrder = (orderId, row) => {
    const order = props.projectOrders.find((item) => item.id === orderId)

    const s = formData.value.filter((item) => item.projectOrderId === orderId)
    if (order) {
        if (s.length>1){
            message.error(t('该产品已选择,请重新选择'))
            row.materialNumber = undefined
            row.orderId = undefined
            row.materialUnit = undefined
            row.quantity = undefined
            row.finishQuantity = undefined
            row.productId= undefined
            row.productOrderId= undefined
            row.productPlanId= undefined
            return;
        }
        debugger
        row.materialNumber = order.materialNumber
        row.materialUnit = order.materialUnit
        row.consignedAmount = order.quantity
        row.materialConfigId = order.materialConfigId
        row.projectId= order.projectId
        row.projectOrderId= order.id
        row.rowDisable ==1
    }
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

defineExpose({ validate, getData })
</script>