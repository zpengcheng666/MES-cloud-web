<template>
  <el-form ref="formRef" :model="formData" v-loading="formLoading" >
    <!-- 列表 -->
      <el-table :data="formData" >
        <el-table-column label="物料编号" align="center" prop="materialNumber" width="180px"/>
        <el-table-column label="物料名称" align="center" prop="materialName" width="120px"/>
        <el-table-column label="物料类型" align="center" prop="materialTypeName"/>
        <el-table-column label="物料规格" align="center" prop="materialSpecification"/>
        <el-table-column label="物料单位" align="center" prop="materialUnit"/>
        <el-table-column label="测量结果" align="center" prop="content" />
        <el-table-column label="是否合格" align="center" prop="inspectionResult" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.QMS_INSPECTION_RESULT" :value="scope.row.inspectionResult" />
          </template>
        </el-table-column>
        <el-table-column label="物料条码" align="center" prop="barCode" width="150px" />
        <el-table-column label="物料批次号" align="center" prop="batchNumber" width="180px" />
        <el-table-column label="处理方式" align="center" prop="handleMethod" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.QMS_HANDLE_METHOD" :value="scope.row.handleMethod" />
          </template>
        </el-table-column>
      </el-table>
  </el-form>
</template>

<script setup lang="ts">
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import { DICT_TYPE } from "@/utils/dict";

/** 检验方案 列表 */
const props = defineProps<{
  inspectionSheetSchemeId: undefined // 检测任务ID
}>()

const formLoading = ref(false) // 列表的加载中
const formData = ref([]) as any

const formRef = ref() // 表单 Ref

/** 查询列表 */
const getList = async () => {
  formLoading.value = true
  try {
    formData.value = await InspectionSheetApi.getMaterialListBySchemeId(props.inspectionSheetSchemeId)
  } finally {
    formLoading.value = false
  }
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({getData})

/** 初始化 **/
onMounted(() => {
  getList()
})

</script>
