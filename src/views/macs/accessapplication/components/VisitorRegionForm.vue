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
      <el-table-column label="访客" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.visitorName`" :rules="formRules.visitorName" class="mb-0px!">
            <el-input @click="selectVisitor(row)" readonly v-model="row.visitorName" placeholder="请选择访客" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="区域" min-width="200">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.regionIds`" :rules="formRules.regionIds" class="mb-0px!">
            <el-tree-select
              v-model="row.regionIds"
              :data="regionList"
              :props="{...defaultProps, label: 'name'}"
              multiple
              check-strictly
              placeholder="请输入区域id" />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column label="生效日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.effectiveDate`" :rules="formRules.effectiveDate" class="mb-0px!">
            <el-date-picker
              v-model="row.effectiveDate"
              type="date"
              value-format="x"
              placeholder="选择生效日期"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="失效日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.invalidDate`" :rules="formRules.invalidDate" class="mb-0px!">
            <el-date-picker
              v-model="row.invalidDate"
              type="date"
              value-format="x"
              placeholder="选择失效日期"
            />
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
    <el-button @click="handleAdd" round>+ 添加访客区域权限</el-button>
  </el-row>
  <Visitor ref="visitorRef" @success="pushVisitor" />
</template>
<script setup lang="ts">
import { AccessApplicationApi } from '@/api/macs/accessapplication'
import Visitor from './Visitor.vue'
import {defaultProps, handleTree} from '@/utils/tree'

const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    visitorId: undefined,
    visitorName: undefined,
    regionIds: [],
    regionName: undefined,
    applicationId: undefined,
    effectiveDate: undefined,
    invalidDate: undefined
  }
  formData.value.push(row)
}

const regionList = ref([])
const getRegionTree = async () => {
  const data = await AccessApplicationApi.getRegionList({});
  regionList.value = handleTree(data, 'id', 'parentId')
}
getRegionTree();

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

let selectRow = {
  visitorId: undefined,
  visitorName: undefined,
};
const visitorRef = ref();
const selectVisitor = (row) => {
  selectRow = row;
  visitorRef.value.open();
}

const pushVisitor = (row) => {
  selectRow.visitorId = row.id;
  selectRow.visitorName = row.name;
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
