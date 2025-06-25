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
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column label="行号" min-width="90">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.rowNum`" :rules="formRules.rowNum" class="mb-0px!">
            <el-input-number v-model="row.rowNum" :min="1" clearable controls-position="right" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="列号" min-width="90">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.columnNum`" :rules="formRules.columnNum" class="mb-0px!">
            <el-input-number v-model="row.columnNum" :min="1" clearable controls-position="right" disabled />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="内容" min-width="160">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.contentType`" :rules="formRules.contentType" class="mb-0px!">
            <el-select v-model="row.contentType" placeholder="请选择内容" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PDM_CONTENT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
<script setup lang="ts">
import { StructureApi } from '@/api/pdm/structureDefinition'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const props = defineProps<{
  structureId: undefined // 结构id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  rowNum: [{ required: true, message: '行号不能为空', trigger: 'blur' }],
  columnNum: [{ required: true, message: '列号不能为空', trigger: 'blur' }],
  contentType: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.structureId,
  async (val) => {
    console.log(props.structureId);
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await StructureApi.getStructureExcelListByStructureId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

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
