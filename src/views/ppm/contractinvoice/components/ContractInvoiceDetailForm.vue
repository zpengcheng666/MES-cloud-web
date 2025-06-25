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
      <el-table-column label="付款单据" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.paymentId`" class="mb-0px!">
            <el-select v-model="row.paymentId" clearable filterable placeholder="请选择付款单据" @change="onChangePayment($event, row)" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in paymentList"
                :key="dict.id"
                :label="dict.number"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="实际付款日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.payDate`" class="mb-0px!" disabled>
            <el-date-picker
              v-model="row.payDate"
              type="date"
              value-format="x"
              placeholder="选择实际付款日期"
              style="width:100%"
              disabled
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="实际付款金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.payAmount`" class="mb-0px!" >
            <el-input v-model="row.payAmount" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="实际付款方式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.method`" class="mb-0px!">
            <el-select v-model="row.method" clearable filterable placeholder="请选择实际付款方式" disabled >
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

      <el-table-column label="未开票金额" min-width="150" v-if="formType != 'detail'">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remainAmount`" class="mb-0px!">
            <el-input v-model="row.remainAmount" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="本次开票金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
            <el-input-number
              v-model="row.amount"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
              placeholder="请输入金额"
              :disabled="formType == 'detail'"
            />
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
    <el-button @click="handleAdd" round>+ 添加合同发票详细</el-button>
  </el-row>
</template>
<script setup lang="ts">

import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const props = defineProps<{
  invoiceId: string // 合同发票ID（主表的关联字段）
  details: [any]
  paymentList: [any]
  formType: string
}>()

const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const formRules = reactive({
  amount: [{ required: true, message: '金额不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
// /** 初始化设置产品项 */
watch(
  () => props.details,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)


/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    invoiceId: undefined,
    contractId: undefined,
    paymentId: undefined,
    amount: undefined,
  }
  row.invoiceId = props.invoiceId
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

/** 付款计划变更 */
const onChangePayment = (id, row) => {
  const payment = props.paymentList.find((item) => item.id === id)
  if (payment) {
    row.payDate = payment.payDate
    row.payAmount = payment.payAmount
    row.remainAmount = payment.remainAmount
    row.method = payment.method
  }
}

defineExpose({ validate, getData })
</script>
