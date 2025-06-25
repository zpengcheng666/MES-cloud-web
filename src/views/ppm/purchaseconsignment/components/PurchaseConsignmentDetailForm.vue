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
      <el-table-column label="合同产品订单" min-width="150" v-if="props.contractType !=2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.orderId`" :rules="formRules.orderId" class="mb-0px!">

            <el-select
              v-model="row.orderId"
              clearable
              filterable
              @change="onChangeOrder($event, row)"
              placeholder="请选择订单"
              :disabled="props.confirmStatus !=0"
            >
              <el-option
                v-for="item in orderInfo"
                :key="item.id"
                :label="item.materialName +'('+item.materialNumber+')'"
                :value="item.id"
              />
            </el-select>


            <!--<el-input v-model="row.orderId" placeholder="请输入合同订单"  :disabled="props.confirmStatus !=0"/>-->
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="产品" width="130"  v-if="props.contractType==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.projectOrderId`" :rules="formRules.projectOrderId" class="mb-0px!">
            {{row.materialName}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="产品物码" width="180" v-if="props.contractType ==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.barCode`" class="mb-0px!">
            {{row.barCode}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="物料批次号" min-width="150" v-if="props.contractType==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.batchNumber`" :rules="formRules.batchNumber" class="mb-0px!">
            {{row.batchNumber}}
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="物料编号" type="index" width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialNumber}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="单位" type="index" width="80">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialUnit`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialUnit}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="本次采购数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">
            <el-input-number v-model="row.consignedAmount" placeholder="请输入采购数量" :disabled="props.confirmStatus !=0 || row.rowDisable ==0"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="收货数量" min-width="130" v-if="props.confirmStatus ==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="0"
                             :disabled="props.confirmStatus !=2 "/>
          </el-form-item>
        </template>
      </el-table-column>

      <!--<el-table-column label="签收数量" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">-->
            <!--<el-input-number v-model="row.signedAmount" placeholder="请输入签收数量" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" fixed="right" label="操作" width="60" v-if="props.confirmStatus ==0">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3" v-if="props.confirmStatus ==0">
    <el-button @click="handleAdd" round  v-if="props.contractType !=2">+ 添加收货明细</el-button>
    <el-button @click="openForm" round v-if="props.contractType ==2">+ 选择收货明细</el-button>
  </el-row>
<!--  <ShippingMaterialStock ref="shippingMaterialStockRef" :material="material" @getStock="getStock"/>-->
  <ProductOrderChoose ref="productOrderChooseRef" :material="material" @getStock="getStock"
                      :orderInfo="orderInfos" v-if="props.contractType ===2"/>
</template>
<script setup lang="ts">
import { PurchaseConsignmentApi } from '@/api/ppm/purchaseconsignment'
 import ProductOrderChoose from "@/views/ppm/contractconsignment/components/ProductOrderChoose.vue";

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// const material = ref()
const props = defineProps<{
  consignmentId: undefined ,// 收货单ID（主表的关联字段）
  confirmStatus: undefined,
  contractId: undefined,
  orderInfo: [any],
  orderInfos: [any],
    contractType:undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  consignmentId: [{ required: true, message: '收货单ID不能为空', trigger: 'blur' }],
  orderId: [{ required: true, message: '合同订单ID不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '发货数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

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
      formData.value = await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

watch(
  () => props.contractId,

  async (val) => {
    // 2. val 非空，则加载数据
    if (val =='0'){
      formData.value = []
    }
    if (!val || val =='0') {

      return;
    }
    try {

      const row = formData.value.filter((item) => item.contractId === val)
      if (row.length ==0 && formData.value.length  > 0){

        formData.value = []
        console.log("合同发生变化");
      }
    } finally {

    }
  },
  {immediate: true}
)

/** 处理产品变更 */
const onChangeOrder = (orderId, row) => {
  const order = props.orderInfo.find((item) => item.id === orderId)

  const s = formData.value.filter((item) => item.orderId === orderId)
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
    row.materialName = order.materialName
    row.materialUnit = order.materialUnit
    row.consignedAmount = order.quantity
    row.finishQuantity = order.finishQuantity
    row.materialConfigId = order.materialConfigId
      row.projectId= order.projectId
      row.projectOrderId= order.orderId
      row.projectPlanId= order.projectPlanId
      row.projectPlanItemId= order.projectPlanItemId
      row.contractId= order.contractId
      row.rowDisable ==1
    // row.tax_rate = product.no
    // row.tax_price = product.price
    // row.lead_date = product.price
  }
}

const productOrderChooseRef = ref()
const openForm = (type, row, confirmStatus) => {


    if (props.orderInfo.length ==0){
        message.error("请选择合同");
        return;
    }
    productOrderChooseRef.value.open(type)

}


const getStock = (e) => {

    debugger
    if (e.length > 0) {
        e.forEach((item, index) => {

            const s = formData.value.find((item1) => item1.barCode === item.variableCode)
            if (s === undefined) {
                const row = {
                    id: undefined,
                    orderId:item.id,
                    projectOrderId: item.orderId,
                    projectId: item.projectId,
                    projectPlanId: item.planId,
                    projectPlanItemId: item.planItemId,
                    materialConfigId: item.materialConfigId,
                    materialName: item.materialName,
                    materialNumber: item.materialNumber,
                    batchNumber: item.batchNumber,
                    barCode: item.variableCode,
                    contractId: props.contractId,
                    materialStockId: item.materialStockId,
                    materialConfigId: item.materialConfigId,
                    materialUnit: item.materialUnit,
                    quantity: item.quantity,
                    consignmentId: props.consignmentId,
                    consignedAmount: item.quantity == 1 ? 1 : undefined,
                    signedAmount: undefined,
                    outboundAmount: undefined,
                    signedBy: undefined,
                    signedTime: undefined,
                    rowDisable: item.quantity == 1 ? 0 : 1
                }

                formData.value.push(row)

            }
        })

    }
}


/** 新增按钮操作 */
const handleAdd = () => {

  if (props.contractId == '0') {
    console.log(props.contractId)
    message.error(t('请先选择合同'))
    return;
  }

  const row = {
    id: undefined,
    consignmentId: undefined,
    materialNumber: undefined,
    materialConfig: undefined,
    orderId: undefined,
    consignedAmount: undefined,
    signedAmount: undefined,
    signedBy: undefined,
    signedTime: undefined,
  }
  row.consignmentId = props.consignmentId
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

defineExpose({ validate, getData })
</script>
