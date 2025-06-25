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
       <el-table-column label="结算方式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.paymentControl`" :rules="formRules.paymentControl" class="mb-0px!">
            <el-select v-model="row.paymentControl" clearable filterable placeholder="请选择结算方式" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_PAYMENT_CONTROL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="付款日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.payDate`" :rules="formRules.payDate" class="mb-0px!">
            <el-date-picker
              v-model="row.payDate"
              type="date"
              value-format="x"
              placeholder="选择付款日期"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="比例" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.ratio`" class="mb-0px!" @input="cal(row, 'ratio')">
            <el-input-number
              v-model="row.ratio"
              controls-position="right"
              :min="0.00"
              :max="1.00"
              :precision="2"
              class="!w-100%"
              placeholder="请输入比例"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!" @input="cal(row, 'amount')">
            <el-input v-model="row.amount" :disabled="formType == 'detail'"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="付款方式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.method`" :rules="formRules.method" class="mb-0px!">
            <el-select v-model="row.method" clearable filterable placeholder="请选择付款方式" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_FINANCE_PAY_METHOD)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="200">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remark`" class="mb-0px!" >
            <el-input v-model="row.remark" placeholder="请输入备注" :disabled="formType == 'detail'" />
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
    <el-button @click="handleAdd" round>+ 添加付款计划</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { erpPriceMultiply } from '@/utils'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const props = defineProps<{
  contractId: string // 合同ID（主表的关联字段）
  schemes: [any]
  total: number
  formType: string
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const formRules = reactive({
  paymentControl: [{ required: true, message: '结算方式为空', trigger: 'blur' }],
  payDate: [{ required: true, message: '付款日期不能为空', trigger: 'blur' }],
  ratio: [{ required: true, message: '比例不能为空', trigger: 'blur' }],
  amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
  method: [{ required: true, message: '付款方式不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

// /** 初始化设置产品项 */
watch(
  () => props.schemes,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

// 合同金额变化
// 根据合同金额和比例计算付款金额
watch(
  () => props.total,
  (val) => {
    if (!val || formData.value.length === 0) {
      return
    }
    // 循环处理
    formData.value.forEach((item) => {
      if (item.ratio != null) {
        item.amount = erpPriceMultiply(item.ratio, props.total)
      } else {
        item.amount = undefined
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
    paymentControl: undefined,
    payDate: undefined,
    ratio: undefined,
    amount: undefined,
    method: undefined,
    remark: undefined,
  }

  row.contractId = props.contractId
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

// 修改比例 计算金额
// 修改金额 计算比例
const cal = (row, field) => {
  // 修改金额 计算比例
  if(field == 'amount'){
    // 修改单价
    if(row.amount){
        row.ratio = parseFloat(parseFloat(parseFloat(row.amount) / parseFloat(props.total)).toFixed(2))
    }
  }
  // 修改比例 计算金额
  else {
    // 修改单价
    if(row.ratio){
      row.amount = parseFloat(parseFloat(parseFloat(props.total) * parseFloat(row.ratio)).toFixed(2))
    }
  }
}

defineExpose({ validate, getData })

</script>
