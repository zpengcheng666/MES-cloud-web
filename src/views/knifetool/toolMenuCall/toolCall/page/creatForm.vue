<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="工单号" prop="workNo">
        <el-input v-model="formData.workNo" placeholder="请输入工单号" />
      </el-form-item>
      <el-form-item label="刀组编码" prop="groupCode">
        <el-select
          v-model="formData.groupCode"
          filterable
          style="width: 100%"
          placeholder="选择刀组编码"
        >
          <el-option v-for="item in selectGroupData" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="需求数量" prop="lackQuantity">
        <el-input
          type="number"
          v-model="formData.lackQuantity"
          :min="1"
          style="width: 100%"
          placeholder="请输入需求数量"
        />
      </el-form-item>
      <el-form-item label="最晚配送日期" prop="latestDeliveryTime">
        <el-date-picker
          v-model="formData.latestDeliveryTime"
          type="datetime"
          placeholder="请选择日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="最短加工时长" prop="miniProcessingTime">
        <el-input
          type="number"
          v-model="formData.miniProcessingTime"
          :min="1"
          style="width: 100%"
          placeholder="请输入最短加工时长（单位：分钟）"
        />
      </el-form-item>
      <el-form-item label="配送地址" prop="shippingAddress">
        <el-input v-model="formData.shippingAddress" placeholder="请输入配送地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import {
  getGroupCodeData,
  getGroupByCode,
  createToolUrgentAssignment,
  updateToolUrgentAssignment,
  getDetailByParam
} from '@/api/knifetool/toolMenuCall/toolCall'
import { formatDate } from '@/utils/formatTime'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<{
  id: string
  workNo: string
  groupCode: string
  groupId: string
  actualQuantity: string
  lackQuantity?: number
  latestDeliveryTime?: any
  miniProcessingTime?: number
  shippingAddress: string
}>({
  id: '',
  workNo: '',
  groupCode: '',
  groupId: '',
  actualQuantity: '',
  lackQuantity: undefined,
  latestDeliveryTime: null,
  miniProcessingTime: undefined,
  shippingAddress: ''
})

const formRef = ref() // 表单 Ref

const groupCodeValidator = async (_rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入刀组编码'))
  } else {
    let res = await getGroupByCode({ groupCode: value })
    if (res === null) {
      callback(new Error('未查询到此刀组编码'))
    } else {
      formData.value.groupId = res.id
      callback()
    }
  }
}

const formRules = reactive({
  workNo: [{ required: true, message: '请输入工单号', trigger: 'blur' }],
  groupCode: [
    { required: true, message: '请选择刀组编码', trigger: 'blur' },
    { validator: groupCodeValidator, trigger: 'change' }
  ],
  lackQuantity: [{ required: true, message: '请输入需求数量', trigger: 'blur' }],
  latestDeliveryTime: [{ required: true, message: '请选择最晚配送时间', trigger: 'change' }],
  miniProcessingTime: [{ required: true, message: '请输入最短加工时长', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  resetForm()
  console.log(row)
  dialogVisible.value = true
  dialogTitle.value = `${type === 'create' ? '添加' : '修改'}`
  formType.value = type
  // 修改时，设置数据
  if (row) {
    formLoading.value = true
    try {
      const data = await getDetailByParam({ id: row.id })
      console.log(data)
      formData.value = data

      console.log(formatDate(formData.value.latestDeliveryTime))
      formData.value.latestDeliveryTime = formatDate(formData.value.latestDeliveryTime)
    } finally {
      formLoading.value = false
    }
  }
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log(formData.value)

    if (formType.value === 'create') {
      const res = await createToolUrgentAssignment(formData.value)
      console.log(res)
      message.success(t('common.createSuccess'))
    } else {
      const res = await updateToolUrgentAssignment(formData.value)
      console.log(res)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    workNo: '',
    groupCode: '',
    groupId: '',
    actualQuantity: '',
    lackQuantity: undefined,
    latestDeliveryTime: null,
    miniProcessingTime: undefined,
    shippingAddress: ''
  }
  formRef.value?.resetFields()
}

/**
 * 获取所有刀组编码，下拉框使用
 * @author: hyj
 */
const selectGroupData = ref([])
const getGroupData = async () => {
  let data = await getGroupCodeData()
  selectGroupData.value = data
}

/** 初始化 */
onMounted(() => {
  getGroupData()
})
</script>
