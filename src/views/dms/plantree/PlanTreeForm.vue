<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="父节点" prop="parent">
        <el-tree-select
          v-model="formData.parent"
          :data="treeData"
          :render-after-expand="false"
          clearable
          check-strictly
          placeholder="请选择父节点"
          :disabled="formType == 'update'"
        />
      </el-form-item>
      <el-form-item label="节点名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入节点名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="5" v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="radio" @change="setRadio" :disabled="formType == 'update'">
          <el-radio :label="1" :value="1">无类型</el-radio>
          <el-radio :label="2" :value="2">设备</el-radio>
          <el-radio :label="3" :value="3">设备类型</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="radio == 2" label="设备" prop="deviceId">
        <el-select-v2
          v-model="formData.deviceId"
          :options="ledgerList"
          filterable
          clearable
          placeholder="选择设备"
          :disabled="formType == 'update'"
        />
      </el-form-item>
      <el-form-item v-if="radio == 3" label="设备类型" prop="deviceTypeId">
        <el-select-v2
          v-model="formData.deviceTypeId"
          :options="deviceTypeList"
          filterable
          clearable
          placeholder="选择设备类型"
          :disabled="formType == 'update'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
/**********************************通用********************************/

import { PlanTreeApi, PlanTreeVO } from '@/api/dms/plantree'

/** 计划关联树 表单 */
defineOptions({ name: 'PlanTreeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const treeData = ref<any[]>([])

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parent: undefined,
  name: undefined,
  remark: undefined,
  deviceId: undefined,
  deviceTypeId: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '节点名不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  treeData.value = await PlanTreeApi.getPlanTreeObject()
  await getDeviceTypeList()
  await getLedgerList()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PlanTreeApi.getPlanTree(id)
      getRadio()
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
    const data = formData.value as unknown as PlanTreeVO
    if (formType.value === 'create') {
      await PlanTreeApi.createPlanTree(data)
      message.success(t('common.createSuccess'))
    } else {
      await PlanTreeApi.updatePlanTree(data)
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
    parent: undefined,
    name: undefined,
    remark: undefined,
    deviceId: undefined,
    deviceTypeId: undefined
  }
  formRef.value?.resetFields()
}

/******************按钮相关***********************/

const radio = ref(1)
function getRadio() {
  const a = isBlank(formData.value.deviceId)
  const b = isBlank(formData.value.deviceTypeId)
  if (a && b) {
    radio.value = 1
  } else if (!a && b) {
    radio.value = 2
  } else if (a && !b) {
    radio.value = 3
  } else {
    formData.value.deviceId = '' as any
    formData.value.deviceTypeId = '' as any
    radio.value = 1
  }
}
function setRadio() {
  if (radio.value == 1) {
    formData.value.deviceId = '' as any
    formData.value.deviceTypeId = '' as any
  } else if (radio.value == 2) {
    formData.value.deviceTypeId = '' as any
  } else if (radio.value == 3) {
    formData.value.deviceId = '' as any
  }
}

/************** 设备类型相关 ******************/

import { DeviceTypeApi } from '@/api/dms/devicetype'
const deviceTypeList = ref<any[]>([])
const getDeviceTypeList = async () => {
  const data = await DeviceTypeApi.listDeviceType()
  deviceTypeList.value = []
  for (let v of data) {
    deviceTypeList.value.push({
      id: v.id,
      code: v.code,
      name: v.name,
      value: v.id,
      label: v.code + ' - ' + v.name,
      key: v.id
    })
  }
}

/***************************关联设备***************************/
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

/***********************工具*********************/
function isBlank(v: any): boolean {
  if (v == undefined || v == null || (typeof v?.trim == 'function' && v?.trim() == '')) {
    return true
  }
  return false
}
</script>
