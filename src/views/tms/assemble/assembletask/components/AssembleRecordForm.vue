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
       <el-table-column label="成品刀具id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.toolInfoId`" :rules="formRules.toolInfoId" class="mb-0px!">
            <el-select v-model="row.toolInfoId" placeholder="请选择成品刀具id">
                <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="物料库存id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialStockId`" :rules="formRules.materialStockId" class="mb-0px!">
            <el-select v-model="row.materialStockId" placeholder="请选择物料库存id">
                <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="操作者" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.operator`" :rules="formRules.operator" class="mb-0px!">
            <el-input v-model="row.operator" placeholder="请输入操作者" />
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
    <el-button @click="handleAdd" round>+ 添加刀具装配记录</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { AssembleTaskApi } from '@/api/tms/assembletask'

const props = defineProps<{
  assembleTaskId: undefined // 刀具装配任务id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.assembleTaskId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await AssembleTaskApi.getAssembleRecordListByAssembleTaskId(val)
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
    assembleTaskId: undefined,
    toolInfoId: undefined,
    materialStockId: undefined,
    operator: undefined,
  }
  row.assembleTaskId = props.assembleTaskId
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