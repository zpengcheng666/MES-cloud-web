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

      <el-table-column label="接收质量限（AQL）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.acceptanceQualityLimit`" :rules="formRules.acceptanceQualityLimit" class="mb-0px!">
            <el-input-number v-model="row.acceptanceQualityLimit" placeholder="请输入接收质量限（AQL）" />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="接收数（Ac）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.acceptNum`" :rules="formRules.acceptNum" class="mb-0px!">
            <el-input-number v-model="row.acceptNum" placeholder="请输入接收数（Ac）" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="拒收数（Re）" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.rejectionNum`" :rules="formRules.rejectionNum" class="mb-0px!">
            <el-input-number v-model="row.rejectionNum" placeholder="请输入拒收数（Re）" />
          </el-form-item>
        </template>
      </el-table-column>


      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加AQL信息</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { InspectionSchemeApi } from '@/api/qms/inspectionscheme'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import InspectionItemChoose from '../../inspectionschemeitem/components/InspectionItemChoose.vue'
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  acceptanceQualityLimit: [{ required: true, message: 'AQL不能为空', trigger: 'blur' }],
  acceptNum: [{ required: true, message: 'Ac不能为空', trigger: 'blur' }],
  rejectionNum: [{ required: true, message: 'Re不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const itemInfo = ref({})

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    acceptanceQualityLimit: undefined,
    acceptNum: undefined,
    rejectionNum: undefined,
  }
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
