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
        <el-table-column label="序号" type="index" width="100"/>
        <el-table-column label="退货产品" width="120">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.materialName`" :rules="formRules.materialName" class="mb-0px!">

              {{row.materialName}}
              <!--<el-input v-model="row.barCode" placeholder="请选择产品" />-->
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="对应发货单" type="index" width="100" >
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.shippingNo`" class="mb-0px!" @input="cal(row, 'taxRate')">
              {{row.shippingNo}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="物料编号" type="index" width="120" align="center"  v-if="props.consignmentStatus  !=2">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
              {{row.materialNumber}}
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="物料条码" type="index" width="120" align="center"  v-if="props.consignmentStatus  !=2">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.barCode`" class="mb-0px!" @input="cal(row, 'taxRate')">
              {{row.barCode}}
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

        <el-table-column label="总数量" type="index" width="80">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.quantity`" class="mb-0px!" @input="cal(row, 'taxRate')">
              {{row.quantity}}
            </el-form-item>
          </template>

        </el-table-column>
        <el-table-column label="退货数量" min-width="150">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">

              <el-input-number v-model="row.consignedAmount" placeholder="请输入退货数量"    :disabled="props.consignmentStatus !=0 || row.rowDisable ==0"/>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="签收数量" min-width="150"  v-if="props.consignmentStatus ==2">
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
              <el-input-number v-model="row.signedAmount" placeholder="请输入确认数量"/>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="60" v-if="props.consignmentStatus ===0">
          <template #default="{ $index }">
            <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="openForm" round>+ 选择外协货单详情</el-button>
  </el-row>
  <ShippingMaterialDetailStock ref="shippingMaterialStockRef" :material="material" @getStock="getStock"
                               :orderInfo="orderInfo"/>
</template>
<script setup lang="ts">
import { ContractConsignmentReturnApi } from '@/api/ppm/contractconsignmentreturn'
import ShippingMaterialDetailStock from '@/views/dm/shippingreturn/components/ShippingDetailMaterialStock.vue'
const props = defineProps<{
  consignmentReturnId: undefined, // 退货单ID（主表的关联字段）
    orderInfo: [any],
    contractId:undefined,
    consignmentStatus:undefined,
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  consignmentReturnId: [{ required: true, message: '退货单ID不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '退货数量不能为空', trigger: 'blur' }],
  materialStockId: [{ required: true, message: '物料库存ID不能为空', trigger: 'blur' }],
  barCode: [{ required: true, message: '物料条码不能为空', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料类型ID不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const material=ref()
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
      formData.value = await ContractConsignmentReturnApi.getContractConsignmentReturnDetailListByConsignmentReturnId(val)
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
    consignmentReturnId: undefined,
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
    materialConfigId: undefined,
    projectId: undefined,
    projectOrderId: undefined,
    projectPlanItemId: undefined,
    orderId: undefined,
    projectPlanId: undefined,
    status: undefined,
    infoId: undefined,
  }
  row.consignmentReturnId = props.consignmentReturnId
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

const shippingMaterialStockRef = ref()
const openForm = (type, row, confirmStatus) => {
    shippingMaterialStockRef.value.open(type)

    material.value = row;
}





const getStock = (e) => {

    if (e.length > 0) {
        e.forEach((item, index) => {

            const s = formData.value.find((item1) => item1.shippingDetailId === item.id)
            if (s === undefined) {
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
                    shippingDetailId: item.id,
                    shippingNo: item.no,
                    contractId: props.contractId,
                    materialStockId: item.materialStockId,
                    materialConfigId: item.materialConfigId,
                    materialId: item.materialId,
                    materialUnit: item.materialUnit,
                    quantity: item.consignedAmount,
                    shippingId: item.shippingId,
                    consignedAmount: item.consignedAmount,
                    inboundAmount: undefined,
                    signedAmount: undefined,
                    signedBy: undefined,
                    signedTime: undefined,
                    rowDisable: item.consignedAmount == 1 ? 0 : 1
                }

                formData.value.push(row)

            }
        })

    }
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>