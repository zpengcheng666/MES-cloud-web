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
      <el-table-column label="发货单产品" width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.orderId`" :rules="formRules.orderId" class="mb-0px!">
            {{row.materialName}}
            <!--<el-select-->
              <!--v-model="row.orderId"-->
              <!--clearable-->
              <!--filterable-->
              <!--@change="onChangeOrder($event, row)"-->
              <!--placeholder="请选择订单"-->
              <!--:disabled="props.confirmStatus !=0"-->
            <!--&gt;-->
              <!--<el-option-->
                <!--v-for="item in orderInfo"-->
                <!--:key="item.id"-->
                <!--:label="item.materialName +'('+item.materialNumber+')'"-->
                <!--:value="item.id"-->
              <!--/>-->
            <!--</el-select>-->


            <!--<el-input v-model="row.orderId" placeholder="请输入合同订单"  :disabled="props.confirmStatus !=0"/>-->
          </el-form-item>
        </template>
      </el-table-column>



      <el-table-column label="物料编号" type="index" width="90">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialNumber`" class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.materialNumber}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="批次号" type="index" width="180">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.batchNumber`"  class="mb-0px!" @input="cal(row, 'taxRate')">
            {{row.batchNumber}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="产品物码" width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.barCode`" class="mb-0px!">

            {{row.barCode}}
            <!--<el-input v-model="row.barCode" placeholder="请选择产品" :disabled="props.confirmStatus !=0"-->
            <!--@click="openForm('create',row)" readonly/>-->
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
      <!--<el-table-column label="类型需求总量" type="index" width="80">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.quantity`" class="mb-0px!" @input="cal(row, 'taxRate')">-->
            <!--{{row.quantity}}-->
          <!--</el-form-item>-->
        <!--</template>-->

      <!--</el-table-column>-->
      <!--<el-table-column label="已发数量" type="index" width="80">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.finishQuantity`" class="mb-0px!" @input="cal(row, 'taxRate')">-->
            <!--{{row.finishQuantity}}-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="本次发货数量" min-width="120">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.consignedAmount`" :rules="formRules.consignedAmount" class="mb-0px!">
            <el-input-number v-model="row.consignedAmount" placeholder="请输入发货数量"
                             :disabled="props.confirmStatus !=0 || row.rowDisable ==0"/>
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column label="出库数量" min-width="130" v-if="props.confirmStatus ==2">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.outboundAmount" class="mb-0px!">-->
            <!--<el-input-number v-model="row.outboundAmount" placeholder="请输入出库数量" :disabled="props.confirmStatus !=2"/>-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="确认数量" min-width="130" v-if="props.confirmStatus ==4">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="请输入确认数量" :disabled="props.confirmStatus ==4"/>
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column label="确认" min-width="150">-->
      <!--<template #default="{ row, $index }">-->
      <!--<el-form-item :prop="`${$index}.signedBy`" :rules="formRules.signedBy" class="mb-0px!">-->
      <!--<el-input v-model="row.signedBy" placeholder="请输入确认" />-->
      <!--</el-form-item>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="确认日期" min-width="150">-->
      <!--<template #default="{ row, $index }">-->
      <!--<el-form-item :prop="`${$index}.signedTime`" :rules="formRules.signedTime" class="mb-0px!">-->
      <!--<el-date-picker-->
      <!--v-model="row.signedTime"-->
      <!--type="date"-->
      <!--value-format="x"-->
      <!--placeholder="选择确认日期"-->
      <!--/>-->
      <!--</el-form-item>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column align="center" fixed="right" label="操作" width="120" v-if="props.confirmStatus ==0">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3" v-if="props.confirmStatus ==0">
    <el-button @click="openForm" round type="primary">+ 添加销售发货明细</el-button>
  </el-row>
  <ShippingMaterialStock ref="shippingMaterialStockRef" :material="material" @getStock="getStock"
                         :orderInfo="orderInfo"/>
</template>
<script setup lang="ts">
  import {ShippingApi} from '@/api/dm/shipping'
  import ShippingMaterialStock from './ShippingMaterialStock.vue'

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const material = ref()
  const props = defineProps < {
    shippingId: undefined, // 发货单ID（主表的关联字段）
    confirmStatus: undefined,
    contractId: undefined,
    orderInfo: [any]
  } > ()
  const formLoading = ref(false) // 表单的加载中
  const formData = ref([])
  const formRules = reactive({
    shippingId: [{required: true, message: '发货单ID不能为空', trigger: 'blur'}],
    barCode: [{required: true, message: '产品不能为空', trigger: 'blur'}],
    consignedAmount: [{required: true, message: '发货数量不能为空', trigger: 'blur'}],
  })
  const formRef = ref() // 表单 Ref

  /** 监听主表的关联字段的变化，加载对应的子表数据 */
  watch(
    () => props.shippingId,

    async (val) => {
      // 1. 重置表单
      formData.value = []

      // 2. val 非空，则加载数据
      if (!val) {
        return;
      }
      try {
        formLoading.value = true
        formData.value = await ShippingApi.getShippingDetailListByShippingId(val)

        // formData.value.forEach((item, index) => {
        //   const order = props.orderInfo.find((ors) => ors.barCode === item.barCode)
        //
        //   order.chooseQuantity = order.chooseQuantity+1
        //   //order.remainingQuantity = order.remainingQuantity -1
        //
        // })

      } finally {
        formLoading.value = false
      }
    },
    {immediate: true}
  )


  /** 处理产品变更 */
  const onChangeOrder = (orderId, row) => {
    const order = props.orderInfo.find((item) => item.id === orderId)
    if (order) {
      row.materialNumber = order.materialNumber
      row.materialUnit = order.materialUnit
      row.quantity = order.quantity
      row.finishQuantity = order.finishQuantity
      row.materialId = order.materialId
      row.contractId = props.contractId

    }
  }


  /** 添加/修改操作 */
  const shippingMaterialStockRef = ref()
  const openForm = (type, row, confirmStatus) => {
    shippingMaterialStockRef.value.open(type)

    material.value = row;
  }

  /***
   * 获取产品物码
   * */
  const productValue=ref([])


  const getStock = (e) => {

      debugger
    if (e.length > 0) {
      e.forEach((item, index) => {

        const s = formData.value.find((item1) => item1.barCode === item.variableCode)
        if (s === undefined) {
          const row = {
            id: undefined,
            // orderId: item.orderId,
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
            shippingId: props.shippingId,
            consignedAmount: item.quantity == 1 ? 1 : undefined,
            signedAmount: undefined,
            outboundAmount: undefined,
            signedBy: undefined,
            signedTime: undefined,
            rowDisable: item.quantity == 1 ? 0 : 1
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




    // row.barCode = e.barCode;
    // row.materialStockId = e.id;
    // row.batchNumber = e.batchNumber;
    //
    // if (e.available == 1) {
    //   row.rowDisable = 0;
    //   row.consignedAmount = 1;
    // }


  }


  /** 新增按钮操作 */
  const handleAdd = () => {
    if (props.contractId == '0') {
      console.log(props.contractId)
      message.error(t('请先选择合同'))
      return;
    }

    // const row = {
    //   id: undefined,
    //   materialNumber: undefined,
    //   batchNumber: undefined,
    //   barCode: undefined,
    //   contractId: props.contractId,
    //   materialStockId: undefined,
    //   shippingId: undefined,
    //   orderId: undefined,
    //   consignedAmount: undefined,
    //   signedAmount: undefined,
    //   outboundAmount: undefined,
    //   signedBy: undefined,
    //   signedTime: undefined,
    //   rowDisable: 1
    // }
    // row.shippingId = props.shippingId
    // formData.value.push(row)
  }

  /** 删除按钮操作 */
  const handleDelete = (index) => {

    const item = formData.value[index]

    const order = props.orderInfo.find((ors) => ors.id === item.orderId)
    if (order){
      order.chooseQuantity = order.chooseQuantity-1
      order.remainingQuantity = order.remainingQuantity +1
    }


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

  defineExpose({validate, getData})
</script>
