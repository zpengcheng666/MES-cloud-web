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
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="关联采购申请" min-width="150" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requirementDetailNumber`" class="mb-0px!">
            <el-tooltip
              :content="row.requirementDetailNumber"
              :disabled="!row.requirementDetailNumber"
              placement="top"
              effect="dark">
              <el-input v-if="formType != 'detail'" v-model="row.requirementDetailNumber" placeholder="请选择采购申请" @click="openForm(row)" readonly>
                <template #suffix>
                  <Icon
                    v-show="row.requirementDetailNumber"
                    class="del-icon"
                    icon="ep:circle-close"
                    style="cursor: pointer;"
                    @click="row.requirementDetailNumber=undefined; row.requirementDetailId=undefined; row.productList=productList"
                  />
                </template>
              </el-input>
              <el-tag v-else>{{ row.requirementDetailNumber ? row.requirementDetailNumber : '未关联' }}</el-tag>
            </el-tooltip>
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column label="产品" min-width="250">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialId`" :rules="formRules.materialId" class="mb-0px!">
            <el-select
              v-model="row.materialId"
              clearable
              filterable
              @change="onChangeProduct($event, row)"
              placeholder="请选择产品"
              :disabled="formType == 'detail'"
            >
              <el-option
                v-for="item in row.productList"
                :key="item.id"
                :label="item.productName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">
            <el-input-number
              v-model="row.quantity"
              controls-position="right"
              :min="0.001"
              :precision="3"
              class="!w-100%"
              placeholder="请输入数量"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="默认税率" min-width="80">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.initTax`" class="mb-0px!" >
            {{row.initTax}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" min-width="80">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialUnit`" class="mb-0px!" >
            {{row.materialUnit}}
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.price`" :rules="formRules.price" class="mb-0px!" @input="cal(row, 'price')">
            <el-input v-model="row.price" :disabled="formType == 'detail'"/>
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
              :max="1.00"
              :precision="2"
              :step="0.01"
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
              :min="0.01"
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
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter" />
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

  <!-- 表单弹窗：添加/修改 -->
  <RequirementDetailChoose ref="requirementRef" @getContract="getContract"/>

</template>
<script setup lang="ts">
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import RequirementDetailChoose from "./RequirementDetailChoose.vue";

const props = defineProps<{
  contractId: string // 合同ID（主表的关联字段）
  products: [any]
  productList: [any]
  formType: string
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRules = reactive({
  materialId: [{ required: true, message: '产品不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
  taxRate: [{ required: true, message: '税率不能为空', trigger: 'blur' }],
  taxPrice: [{ required: true, message: '含税单价不能为空', trigger: 'blur' }],
  leadDate: [{ required: true, message: '交货日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

// /** 初始化设置产品项 */
watch(
  () => props.products,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

watch(
  () => props.productList,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
    // 循环处理
    formData.value.forEach((item) => {
      item.productList = val
    })
  },
  { deep: true }
)

watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
    // 循环处理
    val.forEach((item) => {
      if (item.quantity != null && item.taxPrice != null) {
        item.totalPrice = erpPriceMultiply(item.taxPrice, item.quantity)
      } else {
        item.totalPrice = undefined
      }
    })
  },
  { deep: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: '',
    contractId: '',
    materialId: undefined,
    quantity: undefined,
    price: undefined,
    taxRate: undefined,
    taxPrice: undefined,
    leadDate: undefined,
    productList: undefined
  }
  row.contractId = props.contractId
  row.productList = props.productList
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 处理产品变更 */
const onChangeProduct = (productId, row) => {
  const product = props.productList.find((item) => item.id === productId)
  const s = formData.value.filter((item) => item.orderId === row.orderId)
  if (product) {
    if(s.length > 1){
      message.error(t('该订单已选择,请重新选择'))
      row.materialId = undefined
      row.price = undefined
      row.initTax = undefined
      row.materialUnit = undefined
      return
    }
    row.price = product.initPrice
    row.initTax = product.initTax
    row.materialUnit = product.materialUnit
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

/** 采购申请 */
const requirementRef = ref() // 合同 Ref
const openForm = (row) => {
  requirementRef.value.open(row)
}

defineExpose({ validate, getData })

</script>
