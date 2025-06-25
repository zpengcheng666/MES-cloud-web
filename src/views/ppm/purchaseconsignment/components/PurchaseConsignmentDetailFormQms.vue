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
      <el-table-column label="合同产品订单" min-width="150">
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

      <el-table-column label="物料编号" type="index" width="80">
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


      <el-table-column label="收货数量" min-width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.signedAmount`" :rules="formRules.signedAmount" class="mb-0px!">
            <el-input-number v-model="row.signedAmount" placeholder="0"
                             :disabled="props.confirmStatus !=2"/>
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column label="质检方案" min-width="130">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.schemeName`" :rules="formRules.schemeName" class="mb-0px!">
            <el-input v-model="row.schemeName"  @click="openInschemeForm(row)"/>
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
  <QmsInschemeChoose ref="qmsInschemeChooseRef" @getScheme="getScheme"/>
</template>
<script setup lang="ts">
import { PurchaseConsignmentApi } from '@/api/ppm/purchaseconsignment'
// import ShippingMaterialStock from "@/views/dm/shipping/components/ShippingMaterialStock.vue";
 import QmsInschemeChoose from "./QmsInschemeChoose.vue";

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

// const material = ref()
const props = defineProps<{
  consignmentId: undefined // 收货单ID（主表的关联字段）
  confirmStatus: undefined,
  contractId: undefined,
  orderInfo: [any]
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  consignmentId: [{ required: true, message: '收货单ID不能为空', trigger: 'blur' }],
  orderId: [{ required: true, message: '合同订单ID不能为空', trigger: 'blur' }],
  consignedAmount: [{ required: true, message: '发货数量不能为空', trigger: 'blur' }],
    schemeName: [{ required: true, message: '方案不能为空', trigger: 'change' }],
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
      formData.value = await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentIdForQms(val)
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



const qmsInschemeChooseRef =ref()


const openInschemeForm = (row) => {
    qmsInschemeChooseRef.value.open(row)
}


const getScheme = (scheme,row) => {

    const s = formData.value.find((item1) => item1.id === row.id)
    s.schemeId=scheme.id
    s.schemeName=scheme.schemeName
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
    orderId: undefined,
    consignedAmount: undefined,
    signedAmount: undefined,
    signedBy: undefined,
    signedTime: undefined,
      schemeId:undefined,
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
