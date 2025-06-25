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

      <el-table-column label="产品" min-width="150" v-if="selfInspection!='1'" >
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.schemeMaterialId`" :rules="formRules.schemeMaterialId" class="mb-0px!">
            <el-select v-model="row.schemeMaterialId" placeholder="请选择不合格产品" >
              <el-option
                v-for="dict in unqualifiedMaterialData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="缺陷代码" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.defectiveCode`" :rules="formRules.defectiveCode" class="mb-0px!">
            <el-select v-model="row.defectiveCode" multiple placeholder="请选择缺陷代码">
              <el-option
                v-for="dict in defectiveCodeData"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="缺陷等级" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.defectiveLevel`" :rules="formRules.defectiveLevel" class="mb-0px!">
            <el-select v-model="row.defectiveLevel" placeholder="请选择缺陷等级">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_DEFECTIVE_LEVEL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>

<!--      <el-table-column label="不合格数 " min-width="100">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.quantity`" :rules="formRules.quantity" class="mb-0px!">-->
<!--            <el-input-number v-model="row.quantity" :min="0" :precision="0" class="!w-1/1" placeholder="请输入不合格数" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="缺陷描述" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.content`" :rules="formRules.content" class="mb-0px!">
            <el-input v-model="row.content" placeholder="请输入缺陷描述" />
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
    <el-button @click="handleAdd" round>+ 添加不合格记录</el-button>
  </el-row>

</template>
<script setup lang="ts">
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import { DefectiveCodeApi } from '@/api/qms/defectivecode'
import { UnqualifiedRegistrationApi } from '@/api/qms/unqualifiedregistration'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  sheetSchemeId: undefined, // 方案ID（主表的关联字段）
  selfInspection: undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  inspectionSheetSchemeId: [{ required: true, message: '方案不能为空', trigger: 'blur' }],
  defectiveCode: [{ required: true, message: '缺陷代码不能为空', trigger: 'change' }],
  defectiveLevel: [{required: true, message: '缺陷等级不能为空', trigger: 'change'}],
  // quantity: [{ required: true, message: '不合格数量不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
  schemeMaterialId: [{ required: true, message: '不合格产品不能为空', trigger: 'change' }],
})

const formRef = ref() // 表单 Ref
/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.sheetSchemeId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await UnqualifiedRegistrationApi.getUnqualifiedRegistrationListBySheetSchemeId(props.sheetSchemeId)
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
    defectiveCode: [],
    quantity: undefined,
    content: undefined,
    schemeMaterialId: undefined
  }
  row.inspectionSheetSchemeId = props.sheetSchemeId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 处理产品变更 */
// const changeMaterial = (row) => {
//   const ms = formData.value.find((item) => item.schemeMaterialId === row.schemeMaterialId)
//   if(ms){
//     message.error(t('该产品已选择,请重新选择'))
//     row.schemeMaterialId = undefined
//     return
//   }
// }

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

// 缺陷代码下拉选项
const defectiveCodeData = ref([]) as any
/** 查询列表 */
const getDefectiveCode = async () => {
  const list = await DefectiveCodeApi.getDefectiveCodeList()
  defectiveCodeData.value = list.map(d => ({ label: d.name, value: d.id }))
}

// 不合格品下拉选项
const unqualifiedMaterialData = ref([]) as any
/** 查询列表 */
const getUnqualifiedMaterial = async () => {
  const list = await InspectionSheetApi.getUnqualifiedMaterialListBySchemeId(props.sheetSchemeId)
  unqualifiedMaterialData.value = list.map(d => ({ label: d.barCodeCheck, value: d.id }))
}


defineExpose({ validate, getData })

/** 初始化 **/
onMounted(async () => {
  await getDefectiveCode()
  await getUnqualifiedMaterial()
})
</script>
