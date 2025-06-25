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

      <el-table-column label="产品" width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.orderId`" :rules="formRules.orderId" class="mb-0px!">
            {{row.materialName}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="物料编号" type="index" width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialNumber}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="产品物码" width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.barCode`" class="mb-0px!">
            {{row.barCode}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="物料批次号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.batchNumber`" :rules="formRules.batchNumber" class="mb-0px!">
            {{row.batchNumber}}
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
      <el-table-column label="发货数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">
            <el-input-number v-model="row.consignedAmount" placeholder="请输入发货数量"
                             :disabled="props.confirmStatus !=0 || row.rowDisable ==0"/>
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column label="出库数量" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.inboundAmount`" :rules="formRules.inboundAmount" class="mb-0px!">-->
            <!--<el-input-number v-model="row.inboundAmount" placeholder="请输入出库数量" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="确认数量" min-width="150"  v-if="props.confirmStatus ==4">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="请输入确认数量" />
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column align="center" fixed="right" label="操作" width="60" v-if="props.confirmStatus ==0">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3" v-if="props.confirmStatus ==0">
    <el-button @click="openForm" round>+ 添加外协发货单详情</el-button>
  </el-row>

  <ProductOrderChoose ref="productOrderChooseRef" :material="material" @getStock="getStock"
                         :orderInfo="orderInfo"/>
</template>
<script setup lang="ts">
import { ContractConsignmentApi } from '@/api/ppm/contractconsignment'
import ProductOrderChoose from './ProductOrderChoose.vue'
const props = defineProps<{
  consignmentId: undefined, // 发货单ID（主表的关联字段）
    orderInfo: [any],
    confirmStatus: undefined,
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  consignmentId: [{ required: true, message: '发货单ID不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '发货数量不能为空', trigger: 'blur' }],
  materialStockId: [{ required: true, message: '物料库存ID不能为空', trigger: 'blur' }],
  barCode: [{ required: true, message: '物料条码不能为空', trigger: 'blur' }],
  // batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料类型ID不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const material = ref()
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
      formData.value = await ContractConsignmentApi.getContractConsignmentDetailListByConsignmentId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */


/** 添加/修改操作 */
const productOrderChooseRef = ref()
const openForm = (type, row, confirmStatus) => {


    if (props.orderInfo.length ==0){
        message.error("请选择合同");
        return;
    }
    productOrderChooseRef.value.open(type)

    material.value = row;
}


const getStock = (e) => {

    debugger
    if (e.length > 0) {
        e.forEach((item, index) => {

            const s = formData.value.find((item1) => item1.barCode === item.variableCode)
            if (s === undefined) {
                const row = {
                    id: undefined,
                    orderId: item.contractOrderId,
                    projectId: item.projectId,
                    projectOrderId: item.orderId,
                    projectPlanId: item.planId,
                    projectPlanItemId: item.planItemId,
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

    // const handleAdd = () => {
    //     const row = {
    //         id: undefined,
    //         consignmentId: undefined,
    //         consignedAmount: undefined,
    //         inboundAmount: undefined,
    //         inboundBy: undefined,
    //         inboundTime: undefined,
    //         signedAmount: undefined,
    //         signedBy: undefined,
    //         signedTime: undefined,
    //         materialStockId: undefined,
    //         barCode: undefined,
    //         batchNumber: undefined,
    //         materialConfigId: undefined,
    //         projectId: undefined,
    //         projectOrderId: undefined,
    //         projectPlanId: undefined,
    //         orderId: undefined,
    //     }
    //     row.consignmentId = props.consignmentId
    //     formData.value.push(row)
    // }



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