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
      <el-table-column label="审核人id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.auditor`" :rules="formRules.auditor" class="mb-0px!">
            <el-input v-model="row.auditor" placeholder="请输入审核人id" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.auditDate`" :rules="formRules.auditDate" class="mb-0px!">
            <el-date-picker
              v-model="row.auditDate"
              type="date"
              value-format="x"
              placeholder="选择审核日期"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="评审类型(不是id,是普通字符串)" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.assessmentType`" :rules="formRules.assessmentType" class="mb-0px!">
            <el-input v-model="row.assessmentType" placeholder="请输入评审类型(不是id,是普通字符串)" />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加评审子表，评审补充</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { AssessmentApi } from '@/api/pms/assessment'

const props = defineProps<{
  assessmentId: undefined // 评审表id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.assessmentId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await AssessmentApi.getAssessmentReplenishListByAssessmentId(val)
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
    auditor: undefined,
    auditDate: undefined,
    assessmentType: undefined,
    assessmentId: undefined,
  }
  row.assessmentId = props.assessmentId
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