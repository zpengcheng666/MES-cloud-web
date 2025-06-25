<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="计划编码" prop="code">
        <el-input v-model="inspectionrecordData.code" placeholder="请输入计划编码" disabled />
      </el-form-item>
      <el-form-item label="选择设备" prop="device">
        <el-select-v2
          v-model="inspectionrecordData.device"
          :options="ledgerList"
          filterable
          clearable
          placeholder="请选择设备"
          disabled
          v-if="!formLoading"
        />
      </el-form-item>
      <el-form-item label="检查类型" prop="type">
        <el-select v-model="inspectionrecordData.type" placeholder="请选择检查类型" disabled>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DMS_INSPECTION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- ---------------------------------------------------------------------- -->

      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              value-format="x"
              placeholder="选择开始时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              value-format="x"
              placeholder="选择结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="5" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item label="检查内容" prop="content">
        <InspectionRecordContent
          v-model="formData.content"
          :orangedata="inspectionrecordData.content"
          ref="contentRef"
        />
      </el-form-item>
    </el-form>

    <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
    <el-button @click="resetForm">重 置</el-button>
  </ContentWrap>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import InspectionRecordContent from './InspectionRecordContent.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formData = ref({
  id: undefined,
  roles: [],
  remark: undefined,
  content: undefined,
  startTime: undefined,
  endTime: undefined
})
const formRules = reactive({
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

import { InspectionRecordApi } from '@/api/dms/inspectionrecord'
/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    InspectionRecordApi.addInspectionRecord(data)
    await message.success(t('common.createSuccess'))
    fallBack()
  } finally {
    formLoading.value = false
  }
}

/**************************** 重置 ****************************/

const contentRef = ref()
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    roles: [],
    remark: undefined,
    content: undefined,
    startTime: undefined,
    endTime: undefined
  }
  formRef.value?.resetFields()
  contentRef.value.reSet()
  formData.value.id = route.query.id as any
}

/****************************** 初始化 **************************/

/* 路由信息 */
const route = useRoute()

const formLoading = ref(true) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const inspectionrecordData = ref<any>({})

const onStart = async () => {
  formLoading.value = true
  let id: any = route.query.id
  if (isBlank(id)) {
    fallBack()
  }
  inspectionrecordData.value = await InspectionRecordApi.getInspectionRecord(id)
  await getLedgerList()

  formData.value.id = id
  resetForm()
  formLoading.value = false
}

import { useTagsViewStore } from '@/store/modules/tagsView'
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由
function fallBack() {
  delView(unref(currentRoute))
  push('/dms/inspection-record')
}

onMounted(() => {
  onStart()
})

/************************* 获取设备信息 ***************************/

import { LedgerApi } from '@/api/dms/ledger'
const ledgerList = ref<any[]>([])
const getLedgerList = async () => {
  const data = await LedgerApi.getLedgerList()
  ledgerList.value = []
  for (let v of data) {
    ledgerList.value.push({
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id,
      ...v
    })
  }
}

/*****************************************工具类************************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v.trim() == '')) {
    return true
  }
  return false
}
</script>
