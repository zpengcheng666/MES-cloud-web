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

      <el-table-column label="对应收货单" type="index" width="100" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignmentNo`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.consignmentNo}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="物料编号" type="index" width="120" align="center"  v-if="props.shippingStatus  !=2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialNumber}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="物料条码" type="index" width="120" align="center"  v-if="props.shippingStatus  !=2">
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

            <el-input-number v-model="row.consignedAmount" placeholder="请输入退货数量"    :disabled="props.shippingStatus !=0 || row.rowDisable ==0"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="签收数量" min-width="150"  v-if="props.shippingStatus ==2">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="请输入确认数量"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60" v-if="props.shippingStatus ===0">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="openForm" round>+ 选择销售退货单详情</el-button>
  </el-row>

  <ConsignmentDetailMaterialStock ref="shippingMaterialStockRef" :material="material" @getStock="getStock"
                               :orderInfo="orderInfo"/>
</template>
<script setup lang="ts">
    import { ShippingInstorageReturnApi } from '@/api/dm/shippinginstoragereturn'
    import ConsignmentDetailMaterialStock from './ConsignmentDetailMaterialStock.vue'
    const props = defineProps < {
        shippingReturnId: undefined, // 退货单ID（主表的关联字段）
        projectId: undefined,
        orderInfo: [any],
        shippingStatus:undefined,
    } > ()
    const formLoading = ref(false) // 表单的加载中
    const formData = ref([])
    const {t} = useI18n() // 国际化
    const message = useMessage() // 消息弹窗
    const formRules = reactive({
        shippingReturnId: [{required: true, message: '退货单ID不能为空', trigger: 'blur'}],
        orderId: [{required: true, message: '合同订单ID不能为空', trigger: 'blur'}],
        consignedAmount: [{required: true, message: '退货数量不能为空', trigger: 'blur'}],
        materialStockId: [{required: true, message: '物料库存ID不能为空', trigger: 'blur'}],
        barCode: [{required: true, message: '物料条码不能为空', trigger: 'blur'}],
        batchNumber: [{required: true, message: '物料批次号不能为空', trigger: 'blur'}],
    })
    const formRef = ref() // 表单 Ref
    const material = ref()
    /** 监听主表的关联字段的变化，加载对应的子表数据 */
    watch(
        () => props.shippingReturnId,
        async (val) => {
            // 1. 重置表单
            formData.value = []
            // 2. val 非空，则加载数据
            if (!val) {
                return;
            }
            try {
                formLoading.value = true
                formData.value = await  ShippingInstorageReturnApi.getShippingInstorageReturnDetailListByShippingStorageReturnId(val)
            } finally {
                formLoading.value = false
            }
        },
        {immediate: true}
    )


    watch(
        () => props.projectId,

        async (val) => {
            // 2. val 非空，则加载数据
            if (val =='0'){
                formData.value = []
            }

            if (!val || val =='0') {
                return;
            }
            try {

                const row = formData.value.filter((item) => item.projectId === val)
                if (row.length ==0 && formData.value.length  > 0){

                    formData.value = []
                    console.log("合同发生变化");
                }
            } finally {

            }
        },
        {immediate: true}
    )


    const shippingMaterialStockRef = ref()
    const openForm = (type, row, confirmStatus) => {
        shippingMaterialStockRef.value.open(type)

        material.value = row;
    }


    /** 删除按钮操作 */
    const handleDelete = (index) => {
        formData.value.splice(index, 1)
    }


    const getStock = (e) => {

        if (e.length > 0) {
            e.forEach((item, index) => {

                const s = formData.value.find((item1) => item1.consignmentDetailId === item.id)
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
                    //   if (order.remainingQuantity == 0){
                    //     message.error(t( item.materialName + '数量超过限制'))
                    //     return;
                    //   }
                    //   order.chooseQuantity = order.chooseQuantity+1
                    //   order.remainingQuantity = order.remainingQuantity -1
                    // }
                    formData.value.push(row)

                }
            })

        }
    }



    /** 处理产品变更 */
    const onChangeOrder = (orderId, row) => {
        const order = props.detailInfo.find((item) => item.id === orderId)

        const s = formData.value.filter((item) => item.shippingDetailId === orderId)
        if (order) {
            if (s.length>1){
                message.error(t('该产品已选择,请重新选择'))
                row.shippingDetailId =undefined;
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
                row.shippingNo = undefined
                return;
            }
            row.materialNumber = order.materialNumber
            row.materialUnit = order.materialUnit
            row.quantity = order.quantity
            row.finishQuantity = order.finishQuantity
            row.materialId = order.materialId
            row.contractId = props.contractId
            row.batchNumber = order.batchNumber
            row.barCode = order.barCode
            row.materialStockId = order.materialStockId
            row.orderId = order.orderId
            row.consignedAmount = order.consignedAmount
            row.quantity = order.consignedAmount
            row.shippingNo = order.shippingNo
            if (order.consignedAmount ===1){
                row.rowDisable =0
            }
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

    defineExpose({validate, getData})
</script>
