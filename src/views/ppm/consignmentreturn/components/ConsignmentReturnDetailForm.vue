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
      <el-table-column label="序号" type="index" width="80"/>
      <el-table-column label="退货产品" width="200" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignmentDetailId`" :rules="formRules.consignmentDetailId" class="mb-0px!">


            {{row.barCode}}
            <!--<el-select-->
              <!--v-model="row.consignmentDetailId"-->
              <!--clearable-->
              <!--filterable-->
              <!--@change="onChangeOrder($event, row)"-->
              <!--placeholder="请选择产品"-->
              <!--:disabled="props.shippingStatus > 0"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in detailInfo"-->
                <!--:key="item.id"-->
                <!--:label="item.barCode +'('+item.materialName+')'"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->


            <!--<el-input v-model="row.barCode" placeholder="请选择产品" />-->
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="对应收货单" type="index" width="100" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignmentNo`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.consignmentNo}}
          </el-form-item>
        </template>
      </el-table-column>


      <!--<el-table-column label="批次号" type="index" width="200"  align="center" >-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.batchNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">-->
            <!--{{row.batchNumber}}-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="物料名称" type="index" width="80" align="center" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialName`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialName}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="物料编号" type="index" width="150" align="center" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
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

      <!--<el-table-column label="库存数量" type="index" width="100">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.quantity`" class="mb-0px!" @input="cal(row, 'taxRate')">-->
            <!--{{row.quantity}}-->
          <!--</el-form-item>-->
        <!--</template>-->

      <!--</el-table-column>-->
      <el-table-column label="退货数量" min-width="200">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">

            <el-input-number v-model="row.consignedAmount" placeholder="请输入退货数量" :disabled="props.shippingStatus  > 0"/>
          </el-form-item>
        </template>
      </el-table-column>

<!--      <el-table-column label="签收数量" min-width="150"  v-if="props.shippingStatus ==2">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">-->
<!--            <el-input-number v-model="row.signedAmount" placeholder="请输入确认数量"/>-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column align="center" fixed="right" label="操作" width="100" v-if="props.shippingStatus == null">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-form>
  <el-row justify="center" class="mt-3" v-if="props.shippingStatus == null">
    <el-button @click="openForm" round type="primary">+ 选择采购退货单详情</el-button>
  </el-row>

  <ConsignmentMaterialStock ref="consignmentMaterialStockRef"  @getStock="getStock"
                         :orderInfo="detailInfo"  :contractId="contractId"/>
</template>
<script setup lang="ts">
import { ConsignmentReturnApi} from '@/api/ppm/consignmentreturn'
import ConsignmentMaterialStock from './ConsignmentMaterialStock.vue'
const props = defineProps < {
  consignmentReturnId: undefined, // 退货单ID（主表的关联字段）
  contractId: undefined,
  detailInfo: [any],
  shippingStatus:undefined,
} > ()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRules = reactive({
  consignmentReturnId: [{required: true, message: '退货单ID不能为空', trigger: 'blur'}],
  orderId: [{required: true, message: '合同订单ID不能为空', trigger: 'blur'}],
  consignedAmount: [{required: true, message: '退货数量不能为空', trigger: 'blur'}],
  materialStockId: [{required: true, message: '物料库存ID不能为空', trigger: 'blur'}],
  barCode: [{required: true, message: '物料条码不能为空', trigger: 'blur'}],
  batchNumber: [{required: true, message: '物料批次号不能为空', trigger: 'blur'}],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.consignmentReturnId,
  async (val) => {

    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await ConsignmentReturnApi.getConsignmentReturnDetailListByConsignmentReturnId(val)
    } finally {
      formLoading.value = false
    }
  },
  {immediate: true}
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
/** 新增按钮操作 */
const handleAdd = () => {

  if (props.contractId == '0') {
    console.log(props.contractId)
    message.error(t('请先选择合同'))
    return;
  }
  const row = {
    id: undefined,
    consignmentName: undefined,
    consignmentReturnId: undefined,
    consignmentDetailId: undefined,
    consignmentNo: undefined,
    orderId: undefined,
    consignedAmount: undefined,
    inboundAmount: undefined,
    inboundBy: undefined,
    inboundTime: undefined,
    signedAmount: undefined,
    signedBy: undefined,
    signedTime: undefined,
    materialStockId: undefined,
    barCode: undefined,
    batchNumber: undefined,
    materialId: undefined,
    materialName: undefined,
    rowDisable:1,
  }
  row.consignmentReturnId = props.consignmentReturnId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}


const consignmentMaterialStockRef = ref()
const openForm = (type, row, confirmStatus) => {
    consignmentMaterialStockRef.value.open(type,props.contractId)

}


/** 处理产品变更 */
const onChangeOrder = (orderId, row) => {
  const order = props.detailInfo.find((item) => item.id === orderId)

  const s = formData.value.filter((item) => item.consignmentDetailId === orderId)
  if (order) {
    if (s.length>1){
      message.error(t('该产品已选择,请重新选择'))
      row.consignmentDetailId =undefined;
      row.consignmentName =undefined;
      row.materialNumber = undefined
      row.materialUnit = undefined
      row.quantity = undefined
      row.finishQuantity = undefined
      row.materialId = undefined
      row.contractId = props.contractId
      row.batchNumber = undefined
      row.barCode = undefined
      row.materialStockId = undefined
      row.orderId = undefined
      row.consignedAmount = undefined
      row.quantity = undefined
      row.consignmentNo = undefined
      row.consignmentId = undefined
      row.materialConfigId = undefined
      row.consignmentName = undefined
      row.materialName = undefined
      return;
    }
    row.materialNumber = order.materialNumber
    row.materialUnit = order.materialUnit
    row.quantity = order.quantity
    row.finishQuantity = order.finishQuantity
    row.consignmentName = order.consignmentName
    row.materialId = order.materialId
    row.contractId = props.contractId
    row.batchNumber = order.batchNumber
    row.barCode = order.barCode
    row.orderId = order.orderId
    row.consignedAmount = order.consignedAmount
    row.materialStockId = order.materialStockId
    row.signedAmount = order.signedAmount
    row.consignmentNo = order.consignmentNo
    row.consignmentId = order.consignmentId
    row.materialConfigId = order.materialId
    row.consignmentName = order.consignmentName
    row.materialName = order.materialName
    if (order.consignedAmount ===1){
      row.rowDisable =0
    }
  }
}



const getStock = (e) => {

    if (e.length > 0) {
        e.forEach((item, index) => {

            const s = formData.value.find((item1) => item1.materialStockId === item.materialStockId)
            if (s === undefined) {
                debugger
                const row = {
                    id: undefined,
                    orderId: item.orderId,
                    projectId: item.projectId,
                    projectOrderId: item.projectOrderId,
                    projectPlanId: item.projectPlanId,
                    projectPlanItemId: item.projectPlanItemId,
                    materialName: item.materialName,
                    materialNumber: item.materialNumber,
                    batchNumber: item.batchNumber,
                    barCode: item.barCode,
                    consignmentDetailId: item.id,
                    consignmentNo: item.no,
                    contractId: props.contractId,
                    materialStockId: item.materialStockId,
                    materialConfigId: item.materialConfigId,
                    materialId: item.materialId,
                    materialUnit: item.materialUnit,
                    quantity: item.consignedAmount,
                    consignmentId: item.consignmentId,
                    consignedAmount: item.signedAmount,
                    inboundAmount: undefined,
                    signedAmount: undefined,
                    signedBy: undefined,
                    signedTime: undefined,
                    rowDisable: item.available == 1 ? 0 : 1
                }

                // const order = props.orderInfo.find((ors) => ors.id === item.orderId)
                // if (order){
                //     if (order.remainingQuantity == 0){
                //         message.error(t( item.materialName + '数量超过限制'))
                //         return;
                //     }
                //     order.chooseQuantity = order.chooseQuantity+1
                //     order.remainingQuantity = order.remainingQuantity -1
                // }
                formData.value.push(row)

            }
        })

    }




    // row.barCode = e.barCode;
    // row.materialStockId = e.id;
    // row.batchNumber = e.batchNumber;
    //
    // if (e.available == 1) {
    //   row.rowDisable = 0;
    //   row.consignedAmount = 1;
    // }


}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({validate, getData})
</script>
