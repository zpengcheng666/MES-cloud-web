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
       <el-table-column label="检测项目" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.inspectionItemName`" :rules="formRules.inspectionItemName" class="mb-0px!">
            <el-input v-model="row.inspectionItemName" placeholder="请输入检测项目"  @click="openForm('create',row)" readonly/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="参考值判断 " min-width="100">
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

      <el-table-column label="技术要求" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.content`" :rules="formRules.content" class="mb-0px!">
            <el-input v-model="row.content" placeholder="请输入技术要求" />
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

      <el-table-column label="接收质量限" min-width="150" v-if="false" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.acceptanceQualityLimit`" :rules="formRules.acceptanceQualityLimit" class="mb-0px!">
            <el-input-number v-model="row.acceptanceQualityLimit" placeholder="请输入接收质量限"  :precision="3" :step="0.1"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="检测顺序" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.number`" :rules="formRules.number" class="mb-0px!">
            <el-input-number v-model="row.number" placeholder="请输入检测顺序" />
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
    <el-button @click="handleAdd" round>+ 添加检验方案检测项目详情</el-button>
  </el-row>
  <InspectionItemChoose ref="inspectionItemChooseRef" @getInspectionItem="getInspectionItem"  :itemInfo="itemInfo"/>

</template>
<script setup lang="ts">
import { InspectionSchemeApi } from '@/api/qms/inspectionscheme'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import InspectionItemChoose from '../../inspectionschemeitem/components/InspectionItemChoose.vue'
const props = defineProps<{
  inspectionSchemeId: undefined, // 方案ID（主表的关联字段）
  samplingLimitType:undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  inspectionSchemeId: [{ required: true, message: '方案不能为空', trigger: 'blur' }],
  inspectionItemId: [{ required: true, message: '检测项目不能为空', trigger: 'blur' }],
  number: [{ required: true, message: '检测顺序不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const itemInfo = ref({})
/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.inspectionSchemeId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await InspectionSchemeApi.getInspectionSchemeItemListByInspectionSchemeId(val)
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
    inspectionSchemeId: undefined,
    inspectionItemId: undefined,
    number: undefined,
    acceptanceQualityLimit:undefined
  }
  row.inspectionSchemeId = props.inspectionSchemeId
  formData.value.push(row)
}

/** 打开弹窗 */
const inspectionItemChooseRef = ref()
const openForm = (type, row) => {
  itemInfo.value= row
  inspectionItemChooseRef.value.open()
}

/***
 * 获取产品物码
 * */
const getInspectionItem = async (inspectionItem,row) => {
  row.inspectionItemId = inspectionItem.id
  row.inspectionItemName = inspectionItem.itemName
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
