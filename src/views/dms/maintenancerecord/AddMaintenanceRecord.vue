<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item label="计划编码" prop="code">
            <el-input
              v-model="planData.code"
              placeholder="请输入计划编码"
              :disabled="true"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="维护保养设备" prop="device">
            <el-select-v2
              v-model="planData.device"
              :options="ledgerList"
              filterable
              clearable
              placeholder="选择设备"
              class="!w-240px"
              :disabled="true"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="关键设备" prop="criticalDevice">
            <el-select-v2
              v-model="planData.criticalDevice"
              :options="[
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]"
              filterable
              clearable
              placeholder="请选择是否为关键设备"
              :disabled="true"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="上次计划完成状态" prop="lastStatus" label-width="130px">
            <el-select-v2
              v-model="planData.lastStatus"
              :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_STATUS)"
              placeholder="请选择上次计划完成状态"
              clearable
              :disabled="true"
              class="!w-240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="维护类型" prop="type">
            <el-select-v2
              v-model="planData.type"
              :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_TYPE)"
              placeholder="请选择维护类型"
              clearable
              :disabled="true"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="planData.startTime"
          type="datetime"
          value-format="x"
          placeholder="选择开始时间"
          :disabled="true"
        />
      </el-form-item>

      <el-form-item label="说明" prop="remark">
        <el-input
          type="textarea"
          :rows="5"
          v-model="planData.remark"
          placeholder="请输入说明"
          :disabled="true"
        />
      </el-form-item>

      <!-- --------------------------------------------------------------- -->

      <el-row>
        <el-col :span="8">
          <el-form-item label="开始维护时间" prop="startTime">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              value-format="x"
              placeholder="选择开始维护时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束维护时间" prop="endTime">
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              value-format="x"
              placeholder="选择结束维护时间"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完成状态" prop="status">
            <el-select-v2
              v-model="formData.status"
              :options="getIntDictOptions(DICT_TYPE.DMS_MAINTENANCE_STATUS)"
              placeholder="请选择完成状态"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="remarks">
        <el-input :rows="4" type="textarea" v-model="formData.remarks" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="保养内容" prop="content">
        <MaintenanceRecordContentSet
          ref="contentRef"
          v-model="formData.content"
          :tableData="planData.content"
        />
      </el-form-item>
      <el-form-item label="使用备件" prop="spareParts">
        <SparePartSelect v-model="formData.spareParts" />
      </el-form-item>
    </el-form>

    <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
    <el-button @click="resetForm">重 置</el-button>
  </ContentWrap>
</template>
<script setup lang="ts">
/** 设备保养维护记录 表单 */
defineOptions({ name: 'MaintenanceRecordForm' })
/* 路由信息 */
const route = useRoute()

import { MaintenanceRecordApi } from '@/api/dms/maintenancerecord'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import MaintenanceRecordContentSet from './MaintenanceRecordContentSet.vue'
import SparePartSelect from '../sparepart/SparePartSelect.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formLoading = ref(true) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref({
  id: undefined,
  status: undefined, //完成状态
  remarks: undefined, //备注
  content: undefined, //保养内容
  startTime: undefined, //开始维护时间
  endTime: undefined, //结束维护时间
  spareParts: [] //使用备件
})
const formRules = reactive({
  startTime: [{ required: true, message: '开始维护时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '结束维护时间不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '完成状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    await MaintenanceRecordApi.addMaintenanceRecord(data)
    message.success(t('common.createSuccess'))
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
    status: undefined, //完成状态
    remarks: undefined, //备注
    content: undefined, //保养内容
    startTime: undefined, //开始维护时间
    endTime: undefined, //结束维护时间
    spareParts: [] //使用备件
  }
  formRef.value?.resetFields()
  contentRef.value.reSet()
  formData.value.id = recordData.value.id
}

/****************************** 初始化 **************************/

import { MaintenancePlanApi } from '@/api/dms/maintenanceplan'

const planData = ref<any>({})
const recordData = ref<any>({})

const onStart = async () => {
  formLoading.value = true

  let id: any = route.query.id
  if (isBlank(id)) {
    fallBack()
  }

  await getLedgerList()

  recordData.value = await MaintenanceRecordApi.getMaintenanceRecord(id)
  if (isBlank(recordData.value)) {
    fallBack()
  }
  planData.value = await MaintenancePlanApi.getMaintenancePlan(recordData.value.code)
  if (isBlank(planData.value)) {
    fallBack()
  }

  formData.value.id = id

  formLoading.value = false
}

import { useTagsViewStore } from '@/store/modules/tagsView'
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由
function fallBack() {
  delView(unref(currentRoute))
  push('/dms/maintenance-record')
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

/****************************工具*************************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null) {
    return true
  }
  if (typeof v?.trim == 'function' && v.trim() == '') {
    return true
  }
  return false
}
</script>
