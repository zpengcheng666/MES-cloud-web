<template>
  <el-form ref="formRef" :model="formData" v-loading="formLoading" >
    <!-- 列表 -->
    <el-table :data="formData" >
      <el-table-column label="产品" align="center" prop="barCodeCheck"/>
      <el-table-column label="缺陷代码" align="center" prop="defectiveCode">
        <template #default="scope">
          <el-tag>{{ scope.row.defectiveCode }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="缺陷等级" align="center" prop="defectiveLevel" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.defectiveLevel`" :rules="formRules.defectiveLevel" class="mb-0px!" v-if="taskDefinitionKey=='Activity_1yb07mr' || taskDefinitionKey=='Activity_0t9w9z5' || taskDefinitionKey=='Activity_19c0j9s' || taskDefinitionKey=='Activity_17uqw1a' || taskDefinitionKey=='Activity_1srykdr' || taskDefinitionKey=='Activity_1afvbwk'">
            <el-select v-model="row.defectiveLevel" placeholder="请选择缺陷等级" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_DEFECTIVE_LEVEL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <dict-tag :type="DICT_TYPE.QMS_DEFECTIVE_LEVEL" :value="row.defectiveLevel" v-else />
        </template>
      </el-table-column>

      <el-table-column label="处理方式" align="center" prop="handleMethod" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.handleMethod`" :rules="formRules.handleMethod" class="mb-0px!" v-if="taskDefinitionKey=='Activity_1yb07mr' || taskDefinitionKey=='Activity_0t9w9z5' || taskDefinitionKey=='Activity_19c0j9s' || taskDefinitionKey=='Activity_17uqw1a' || taskDefinitionKey=='Activity_1srykdr' || taskDefinitionKey=='Activity_1afvbwk'">
            <el-select v-model="row.handleMethod" placeholder="请选择处理方式" >
              <el-option
                v-for="dict in handleMethodListBySourceType"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <dict-tag :type="DICT_TYPE.QMS_HANDLE_METHOD" :value="row.handleMethod" v-else />
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<script setup lang="ts">
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 检验方案 列表 */
const props = defineProps<{
  sheetSchemeId: undefined // 检测任务ID
  taskDefinitionKey: string | undefined
  sourceType: string | undefined
}>()

const formLoading = ref(false) // 列表的加载中
const formData = ref([]) as any

const formRules = reactive({
  defectiveLevel: [{required: true, message: '缺陷等级不能为空', trigger: 'change'}],
  handleMethod: [{required: true, message: '处理方式不能为空', trigger: 'change'}],
})

const formRef = ref() // 表单 Ref


const inspectionSheet = ref({}) as any
const handleMethodList = ref([]) as any

watch(
  () => props.sheetSchemeId,
  async (val) => {
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await InspectionSheetApi.getUnqualifiedMaterialDefectiveListBySchemeId(props.sheetSchemeId)
      handleMethodList.value = getIntDictOptions(DICT_TYPE.QMS_HANDLE_METHOD)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

// 根据选择的部门筛选员工清单
const handleMethodListBySourceType = computed(() => {
    // 采购收货、外协收货  （入库、退货、让步接收）
    if(props.sourceType == 1 || props.sourceType == 2){
      return handleMethodList.value.filter((u) => u.value == 3 || u.value == 5 || u.value == 7)
    }
    // 外协原料退货 (返修、报废、返工、重新采购)
    else if(props.sourceType == 3){
      return handleMethodList.value.filter((u) => u.value == 1 || u.value == 2 || u.value == 4 || u.value == 8)
    }
    // 委托加工收货 （让步接收 退货 入库）
    else if(props.sourceType == 4){
      return handleMethodList.value.filter((u) => u.value == 3 || u.value == 5 || u.value == 7)
    }
    // 销售退货 （返修、报废、返工）
    else if(props.sourceType == 5){
      return handleMethodList.value.filter((u) => u.value == 1 || u.value == 2 || u.value == 4)
    }
    // 生产加工 （返修、报废、让步接收、返工、退货、提交MRB、入库）
    else if(props.sourceType == 6){
      return handleMethodList.value.filter((u) => u.value == 1 || u.value == 2 || u.value == 3 ||  u.value == 4 || u.value == 5 || u.value == 6 || u.value == 7)
    }
    else {
      return []
    }
  }
)

const emit = defineEmits(['getCustomVariables']) // 定义 success 事件，用于操作成功后的回调
watch(
  () => formData.value,
  async (val) => {
    emit('getCustomVariables', val)
  },
  { deep: true }
)

</script>
