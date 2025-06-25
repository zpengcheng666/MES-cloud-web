<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData"
              ref="contractSchemeTableRef"
              class="-mt-10px">
       <el-table-column label="序号" width="60px" type="index" />
       <el-table-column label="付款计划" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.schemeId`" class="mb-0px!">
            <el-select v-model="row.schemeId" clearable filterable placeholder="请选择付款计划" @change="onChangeScheme($event, row)" :disabled="formType == 'detail'">
              <el-option
                v-for="dict in schemeList"
                :key="dict.id"
                :label="dict.number"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="结算方式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.paymentControl`" class="mb-0px!">
            <el-select v-model="row.paymentControl" clearable filterable placeholder="请选择结算方式" disabled >
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
          <el-form-item :prop="`${$index}.payDate`" class="mb-0px!">
            <el-date-picker
              v-model="row.payDate"
              type="date"
              value-format="x"
              placeholder="选择付款日期"
              disabled
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="比例" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.ratio`" class="mb-0px!">
            <el-input
              v-model="row.ratio"
              controls-position="right"
              :min="0.00"
              :max="1.00"
              :precision="2"
              class="!w-100%"
              placeholder="请输入比例"
              disabled
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.schemeAmount`" class="mb-0px!">
            <el-input v-model="row.schemeAmount" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="剩余金额" min-width="150" v-if="formType != 'detail'">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.remainAmount`" class="mb-0px!">
            <el-input v-model="row.remainAmount" disabled />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="支付金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.amount`" :rules="formRules.amount" class="mb-0px!">
            <el-input-number
              v-model="row.amount"
              controls-position="right"
              :min="0"
              :precision="2"
              class="!w-100%"
              placeholder="请输入支付金额"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>

<!--      <el-table-column label="已付金额" min-width="150">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.payAmount`" class="mb-0px!">-->
<!--            <el-input v-model="row.payAmountSum" disabled />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="付款方式" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.method`" class="mb-0px!">
            <el-select v-model="row.method" clearable filterable placeholder="请选择付款方式" disabled >
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
            <el-input v-model="row.remark" placeholder="请输入备注" disabled />
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
    <el-button @click="handleAdd" round>+ 添加计划</el-button>
  </el-row>
</template>
<script setup lang="ts">
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 购销合同 列表 */
defineOptions({ name: 'DMContractPaymentSchemeForm' })

const props = defineProps<{
  contractId: string // 合同ID（主表的关联字段）
  details: [any]
  schemeList: [any]
  formType: string
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const formRules = reactive({
  amount: [{ required: true, message: '支付金额为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
// /** 初始化设置产品项 */
watch(
  () => props.details,
  async (val) => {
    console.log(123, val)
    formData.value = val
  },
  { immediate: true }
)


//
// const emit = defineEmits(['selectScheme']) // 定义 success 事件，用于操作成功后的回调
// /**
//  * 实现单选行
//  */
// const selectionScheme = ref<ContractPaymentSchemeVO[]>()
// const contractSchemeTableRef = ref() // 表格的 Ref
// const handleSelectionChange = (selection) => {
//   // 点击复选框
//   if(selection instanceof Array){
//     // 点击复选框传数组
//     if (selection.length > 1) {
//       //移除上一次选中行数据
//       selection.shift();
//     }
//     //修改选中图标为未选中状态
//     contractSchemeTableRef.value.clearSelection();
//     //将当前选中行改为选中状态
//     contractSchemeTableRef.value.toggleRowSelection(selection[0]);
//     selectionScheme.value = selection[0]
//     contractSchemeTableRef.value.setCurrentRow(selection[0])
//     emit('selectScheme', selection[0])
//   }
//   // 点击行
//   else {
//     contractSchemeTableRef.value.clearSelection();
//     contractSchemeTableRef.value.toggleRowSelection(selection);
//     emit('selectScheme', selection)
//   }
// }

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
  }
  row.contractId = props.contractId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}


/** 付款计划变更 */
const onChangeScheme = (id, row) => {
  const scheme = props.schemeList.find((item) => item.id === id)
  if (scheme) {
    row.paymentControl = scheme.paymentControl
    row.payDate = scheme.payDate
    row.ratio = scheme.ratio
    row.schemeAmount = scheme.amount
    row.amount = 0
    row.remainAmount = scheme.remainAmount
    row.method = scheme.method
    row.remark = scheme.remark
  }
}

</script>

<style lang="scss" scoped>
/**找到表头那一行，然后把里面的复选框隐藏掉**/
::v-deep .el-table__header-wrapper .el-table__header .el-checkbox {
  display: none;
}
</style>
