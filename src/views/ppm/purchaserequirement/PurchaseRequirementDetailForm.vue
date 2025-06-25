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
       <el-table-column label="物料" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requiredMaterial`" :rules="formRules.requiredMaterial" class="mb-0px!">
            <el-input v-model="row.materialName" placeholder="请选择物料类型" @click="openForm(row)" readonly :disabled="formType == 'detail'" />
            <el-input v-show="false" v-model="row.requiredMaterial"/>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="单位" type="index" width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialUnit`" class="mb-0px!">
            {{row.materialUnit}}
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="项目计划" type="index" width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.projectPlanId`" class="mb-0px!">
            <el-input v-model="row.projectPlanId" placeholder="请选择项目计划" :disabled="formType == 'detail'" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="数量" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requiredQuantity`" :rules="formRules.requiredQuantity" class="mb-0px!">
            <el-input-number
              v-model="row.requiredQuantity"
              controls-position="right"
              :min="0.00"
              :precision="3"
              class="!w-100%"
              placeholder="请输入数量"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="预算单价" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.estimatedPrice`" class="mb-0px!" >
            <el-input-number
              v-model="row.estimatedPrice"
              controls-position="right"
              :min="0.01"
              :precision="2"
              class="!w-100%"
              placeholder="请输入预算单价"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="需求时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.requiredDate`" :rules="formRules.requiredDate" class="mb-0px!">
            <el-date-picker
              v-model="row.requiredDate"
              type="date"
              value-format="x"
              placeholder="选择需求时间"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.supplier`" class="mb-0px!">
            <el-input v-model="row.supplier" placeholder="请输入供应商" :disabled="formType == 'detail'" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="合计" prop="totalPrice" fixed="right" min-width="140">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.totalPrice`" class="mb-0px!">
            <el-input disabled v-model="row.totalPrice" :formatter="erpPriceInputFormatter"  />
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
    <el-button @click="handleAdd" round>+ 添加物料</el-button>
  </el-row>

  <!-- 表单弹窗：添加/修改 -->
  <MaterialconfigForm ref="configRef" @get-material-config="getMaterialConfig" />

</template>
<script setup lang="ts">
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import MaterialconfigForm from "./MaterialconfigForm.vue";

const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  requirementId: undefined
  details: [any]
  formType: string
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const formRules = reactive({
  requiredMaterial: [{ required: true, message: '物料不能为空', trigger: 'change' }],
  requiredQuantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  requiredDate: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 初始化设置产品项 */
watch(
  () => props.details,
  async (val) => {
    formData.value = val
  },
  { immediate: true }
)

watch(
  () => formData.value,
  (val) => {
    if (!val || val.length === 0) {
      return
    }
    // 循环处理
    val.forEach((item) => {
      if (item.requiredQuantity != null) {
        item.totalPrice = erpPriceMultiply(item.requiredQuantity, item.estimatedPrice ? item.estimatedPrice : 0)
      } else {
        item.totalPrice = 0
      }
    })
  },
  { deep: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: '',
    requirementId: '',
    sourceType: 1,
    requiredMaterial: undefined,
    requiredQuantity: undefined,
    requiredDate: undefined,
    estimatedPrice: undefined,
    supplier: undefined,
    totalPrice: 0
  }
  row.requirementId = props.requirementId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}


// 当前点击行
const currentRow = ref({})
/** 添加/修改操作 */
const configRef = ref() // 合同 Ref
const openForm = (row) => {
  configRef.value.open()
  currentRow.value = row
}

// 同一个物料类型只能选一次
const getMaterialConfig = (config) => {
  // 验证重复
  const mt = props.details.filter((item) => item.requiredMaterial === config.id)
  if(mt.length > 0){
    message.error(t('该产品已选择,请重新选择'))
    return
  }
  // 选中物料类型
  currentRow.value.requiredMaterial = config.id
  currentRow.value.materialName = config.materialName
  currentRow.value.materialUnit = config.materialUnit
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
