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
       <el-table-column label="发起原因(新立项/修改)" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.reasonType`" :rules="formRules.reasonType" class="mb-0px!">
            <el-select v-model="row.reasonType" placeholder="请选择发起原因(新立项/修改)">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_REASON)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="类型(技术、采购、检验)" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.assessmentType`" :rules="formRules.assessmentType" class="mb-0px!">
            <el-select v-model="row.assessmentType" placeholder="请选择类型(技术、采购、检验)">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_CATEGORY)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="状态(未开启、评估中、评估结束)" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.assessmentStatus`" :rules="formRules.assessmentStatus" class="mb-0px!">
            <el-radio-group v-model="row.assessmentStatus">
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ASSESSMENT_STATUS)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="评估人" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.assessmentPerson`" :rules="formRules.assessmentPerson" class="mb-0px!">
            <el-input v-model="row.assessmentPerson" placeholder="请输入评估人" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="评估说明" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.instruction`" :rules="formRules.instruction" class="mb-0px!">
            <el-input v-model="row.instruction" placeholder="请输入评估说明" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="结论" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.conclusion`" :rules="formRules.conclusion" class="mb-0px!">
            <el-select v-model="row.conclusion" placeholder="请选择结论">
                <el-option
                  v-for="dict in getStrDictOptions(DICT_TYPE.PMS_ASSESSMENT_CONCLUSION)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.startTime`" :rules="formRules.startTime" class="mb-0px!">
            <el-date-picker
              v-model="row.startTime"
              type="date"
              value-format="x"
              placeholder="选择开始时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.endTime`" :rules="formRules.endTime" class="mb-0px!">
            <el-date-picker
              v-model="row.endTime"
              type="date"
              value-format="x"
              placeholder="选择结束时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="预计完成时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.prefinishTime`" :rules="formRules.prefinishTime" class="mb-0px!">
            <el-date-picker
              v-model="row.prefinishTime"
              type="date"
              value-format="x"
              placeholder="选择预计完成时间"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="审核人id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.auditor`" :rules="formRules.auditor" class="mb-0px!">
            <el-input v-model="row.auditor" placeholder="请输入审核人id" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.auditDate`" :rules="formRules.auditDate" class="mb-0px!">
            <el-date-picker
              v-model="row.auditDate"
              type="date"
              value-format="x"
              placeholder="选择审核日期"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="审核意见" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.auditOpinion`" :rules="formRules.auditOpinion" class="mb-0px!">
            <el-input v-model="row.auditOpinion" placeholder="请输入审核意见" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="审批结果" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.status`" :rules="formRules.status" class="mb-0px!">
            <el-radio-group v-model="row.status">
                <el-radio label="1">请选择字典生成</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="流程实例的编号" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.processInstanceId`" :rules="formRules.processInstanceId" class="mb-0px!">
            <el-input v-model="row.processInstanceId" placeholder="请输入流程实例的编号" />
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
    <el-button @click="handleAdd" round>+ 添加项目评审</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { ApprovalApi } from '@/api/pms/pmsapproval'

const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await ApprovalApi.getAssessmentListByProjectId(val)
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
    projectId: undefined,
    reasonType: undefined,
    assessmentType: undefined,
    assessmentStatus: undefined,
    assessmentPerson: undefined,
    instruction: undefined,
    conclusion: undefined,
    startTime: undefined,
    endTime: undefined,
    prefinishTime: undefined,
    auditor: undefined,
    auditDate: undefined,
    auditOpinion: undefined,
    status: undefined,
    processInstanceId: undefined,
  }
  row.projectId = props.projectId
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