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
      <el-table-column label="检测项" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inspectionItemConfigId`" :rules="formRules.inspectionItemConfigId" class="mb-0px!">


            <el-select
              v-model="row.inspectionItemConfigId"
              clearable
              filterable
              placeholder="请选择检测项"
            >
              <el-option
                v-for="item in configList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="参考值判断 " min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.referenceType`" :rules="formRules.referenceType" class="mb-0px!">

            <el-select v-model="row.referenceType" placeholder="请选择">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_REFERENCE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="技术要求（数字）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.number`" :rules="formRules.number" class="mb-0px!">
            <el-input v-model="row.number" placeholder="请输入数字" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="上限值" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.maxValue`" :rules="formRules.maxValue" class="mb-0px!">
            <el-input v-model="row.maxValue" placeholder="请输入上限值" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="下限值" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.minValue`" :rules="formRules.minValue" class="mb-0px!">
            <el-input v-model="row.minValue" placeholder="请输入下限值" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="技术要求" min-width="400">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.content`" :rules="formRules.content" class="mb-0px!">
            <el-input v-model="row.content" placeholder="请输入下限值" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="判断" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.judgement`" :rules="formRules.judgement" class="mb-0px!">
            <el-input v-model="row.judgement" placeholder="请输入判断" />
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
    <el-button @click="handleAdd" round>+ 添加检测项目详情</el-button>
  </el-row>
</template>
<script setup lang="ts">
  import { InspectionItemApi } from '@/api/qms/inspectionitem'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  defineOptions({name: 'InspectionItemDetailFormInfo'})
  const props = defineProps<{
    inspectionItemId: undefined,// 检测项目ID（主表的关联字段）
    configList:[any]
  }>()
  const formLoading = ref(false) // 表单的加载中
  const formData = ref([])
  const formRules = reactive({
    inspectionItemConfigId: [{ required: true, message: '检测项配置表ID不能为空', trigger: 'blur' }],
    inspectionItemId: [{ required: true, message: '检测项目ID不能为空', trigger: 'blur' }],
  })
  const formRef = ref() // 表单 Ref

  /** 监听主表的关联字段的变化，加载对应的子表数据 */
  watch(
    () => props.inspectionItemId,
    async (val) => {
      // 1. 重置表单
      formData.value = []
      // 2. val 非空，则加载数据
      if (!val) {
        return;
      }
      try {
        formLoading.value = true
        formData.value = await InspectionItemApi.getInspectionItemDetailListByInspectionItemId(val)
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
      inspectionItemConfigId: undefined,
      inspectionItemId: undefined,
      referenceType: undefined,
      number: undefined,
      maxValue: undefined,
      minValue: undefined,
      content: undefined,
      judgement: undefined,
    }
    row.inspectionItemId = props.inspectionItemId
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
