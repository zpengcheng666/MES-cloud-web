<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" :inline-message="true">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      style="margin-top: 25px;"
    >
      <el-row :gutter="20" >
        <el-col :span="8"  >
          <el-form-item label="检验结果" prop="inspectionResult">
            <el-radio-group v-model="formData.inspectionResult" :disabled="formType=='detail'" >
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" >
        <el-col :span="16"  >
          <el-form-item label="测量结果" prop="content">
            <el-input type="textarea" v-model="formData.content" placeholder="请输入测量结果" :disabled="formType=='detail'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
}>()

const formLoading = ref(false) // 列表的加载中
const formData = ref([]) as any
const formRules = reactive({
  content: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  inspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref


const validate = () => {
  alert(2)
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({validate, getData})

</script>
