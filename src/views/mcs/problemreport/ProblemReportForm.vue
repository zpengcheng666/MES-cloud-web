<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="设备" prop="stationId">
        <el-select-v2
          v-model="formData.stationId"
          :options="props.ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          disabled
        />
      </el-form-item>
      <el-form-item label="问题类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择问题类型" disabled>
          <el-option
            v-for="dict in getIntDictOptions('mcs_problem_report_type')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上报实体" prop="reportId">
        <el-input v-model="entity" placeholder="请输入上报实体" disabled />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择状态" disabled>
          <el-option
            v-for="dict in getStrDictOptions('mcs_problem_report_status')"
            :key="dict.value as any"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" prop="content">
        <ProblemReportContent v-model="formData.content" ref="contentRef" @add-report="addReport" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions } from '@/utils/dict'
import { ProblemReportApi, ProblemReportVO } from '@/api/mcs/problemreport'
import ProblemReportContent from './ProblemReportContent.vue'
const contentRef = ref()

const props = defineProps(['ledgerList'])

/** 问题上报 表单 */
defineOptions({ name: 'ProblemReportForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  stationId: undefined,
  type: undefined,
  reportId: undefined,
  status: undefined,
  content: undefined
})
const formRules = reactive({})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProblemReportApi.getProblemReport(id)
      contentRef.value.flush(formData.value.content)
      entity.value = await codeToEntity(formData.value.type, formData.value.reportId)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProblemReportVO
    if (formType.value === 'create') {
      await ProblemReportApi.createProblemReport(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProblemReportApi.updateProblemReport(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    stationId: undefined,
    type: undefined,
    reportId: undefined,
    status: undefined,
    content: undefined
  }
  formRef.value?.resetFields()
  entity.value = ''
}

/************************添加回复***********************/

function addReport() {
  formData.value.status = '3' as any //问题状态：已回复
}

/*********************上报实体***************************/

const entity = ref('')

import { LedgerApi } from '@/api/dms/ledger' //设备
import { BatchRecordApi } from '@/api/mcs/batchRecord' //任务
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail' //工序
import { BatchDetailApi } from '@/api/mcs/batchdetail' //物料

//将报编号转为文字
async function codeToEntity(type, id) {
  switch (type) {
    case 0: //设备
      {
        let data = await LedgerApi.getLedger(id)
        return data?.code
      }
      break
    case 1: //任务
      {
        let data = await BatchRecordApi.getBatchRecord(id)
        return data?.number
      }
      break
    case 2: //工艺
      {
        let data = await ProcessPlanDetailApi.getProcedure(id)
        return data?.procedureName
      }
      break
    case 3: //物料
      {
        let data = await BatchDetailApi.getBatchDetail(id)
        return data?.partBatchNumber
      }
      break
  }
}
</script>
