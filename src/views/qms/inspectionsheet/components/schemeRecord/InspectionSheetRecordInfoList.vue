<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" v-loading="formLoading" :inline-message="true">
    <!-- 列表 -->
      <el-table :data="formData" :span-method="objectSpanMethod" :border="true">
        <el-table-column label="检测项目" align="center" prop="inspectionItemTypeName" width="120" >
          <template #default="scope">
            <el-tag type="primary">{{scope.row.inspectionItemTypeName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检测项" align="center" prop="inspectionSchemeItemName" width="100" />
        <el-table-column label="技术要求" align="center" prop="schemeContent" width="100" />
        <el-table-column label="上限值" align="center" prop="schemeMaxValue"/>
        <el-table-column label="下限值" align="center" prop="schemeMinValue"/>
        <el-table-column label="判断方式" align="center" prop="referenceType" width="120">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.QMS_REFERENCE_TYPE" :value="scope.row.referenceType"/>
          </template>
        </el-table-column>
        <el-table-column label="测量结果" align="center" prop="content" fixed="right" >
          <template #default="{ row, $index }">
            <span v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus != 0)">{{ row.content }}</span>
            <el-form-item :prop="`${$index}.content`" :rules="formRules.content" class="mb-0px!" v-else>
              <el-input v-model="row.content" placeholder="请输入测量结果"  />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否合格" align="center" prop="inspectionResult" fixed="right" >
          <template #default="{ row, $index }">
            <dict-tag :type="DICT_TYPE.QMS_INSPECTION_RESULT" :value="row.inspectionResult" v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus != 0)" />
            <el-form-item :prop="`${$index}.inspectionResult`" :rules="formRules.inspectionResult" class="mb-0px!" v-else >
              <el-radio-group v-model="row.inspectionResult" >
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="测量结果" align="center" prop="mutualContent" v-if="selfInspection == 1 && selfSheetSchemeStatus >= 1" fixed="right" >
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.mutualContent`" :rules="formRules.mutualContent" class="mb-0px!">
              <span v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus > 1)">{{ row.mutualContent }}</span>
              <el-input v-model="row.mutualContent" placeholder="请输入测量结果" v-else />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否合格" align="center" prop="mutualInspectionResult" v-if="selfInspection == 1 && selfSheetSchemeStatus >= 1" fixed="right" >
          <template #default="{ row, $index }">
            <dict-tag :type="DICT_TYPE.QMS_INSPECTION_RESULT" :value="row.mutualInspectionResult" v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus > 1)" />
            <el-form-item :prop="`${$index}.mutualInspectionResult`" :rules="formRules.mutualInspectionResult" class="mb-0px!" v-else>
              <el-radio-group v-model="row.mutualInspectionResult">
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column label="测量结果" align="center" prop="specContent" v-if="selfInspection == 1 && selfSheetSchemeStatus >= 3" fixed="right" >
          <template #default="{ row, $index }">
            <el-form-item :prop="`${$index}.specContent`" :rules="formRules.specContent" class="mb-0px!">
              <span v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus > 3)">{{ row.specContent }}</span>
              <el-input v-model="row.specContent" placeholder="请输入测量结果" v-else />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否合格" align="center" prop="specInspectionResult" v-if="selfInspection == 1 && selfSheetSchemeStatus >= 3" fixed="right" >
          <template #default="{ row, $index }">
            <dict-tag :type="DICT_TYPE.QMS_INSPECTION_RESULT" :value="row.specInspectionResult" v-if="formType == 'detail' || (selfInspection == 1 && selfSheetSchemeStatus > 3)" />
            <el-form-item :prop="`${$index}.specInspectionResult`" :rules="formRules.specInspectionResult" class="mb-0px!" v-else >
              <el-radio-group v-model="row.specInspectionResult" >
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
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
  // inspectionSchemeId: undefined,
  inspectionSheetSchemeMaterialId: undefined // 检测项目ID（主表的关联字段）
  formType: string
  selfInspection: string
  selfSheetSchemeStatus: string
}>()

const formLoading = ref(false) // 列表的加载中
const formData = ref([]) as any
const formRules = reactive({
  content: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  inspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  mutualContent: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  mutualInspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  specContent: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  specInspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref


/** 查询列表 */
const getList = async () => {
  formLoading.value = true
  try {
    formData.value = await InspectionSheetApi.getInspectionSheetRecordListByMaterialId(props.inspectionSheetSchemeMaterialId)
  } finally {
    formLoading.value = false
  }
}

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
  if (columnIndex === 0) {
    // 当前列为0的时候不进行操作单元格
    const name = row[column.property];
    const preRow = formData.value[rowIndex - 1];
    const preValue = preRow ? preRow[column.property] : null;
    // 当前行的数据对象的name 是否和 上一行列的 name 是否相等 相等就不合并单元格
    if (name === preValue) {
      return {rowspan: 0, colspan: 0}; // 不生成单元格
    } else {
      let rowspan = 1;
      for (let i = rowIndex + 1; i < formData.value.length; i++) {
        const nextRow = formData.value[i];
        const nextValue = nextRow[column.property];
        if (nextValue === name) {
          rowspan++;
        } else {
          break;
        }
      }
      return {rowspan, colspan: 1};
    }
  }
};

const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({validate, getData})

/** 初始化 **/
onMounted(() => {
  getList()
})

</script>
