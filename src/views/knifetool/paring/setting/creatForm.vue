<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="刀组编码：">
        <el-input v-model="formData.groupCode" disabled />
      </el-form-item>
      <el-form-item label="刀柄物码：">
        <el-input v-model="formData.code" disabled />
      </el-form-item>
      <el-form-item label="刀具直径：" prop="diameter">
        <el-input
          type="number"
          :disabled="toolVisibleButton"
          v-model="formData.diameter"
          placeholder="刀具直径..."
        />
      </el-form-item>
      <el-form-item label="刀具总长：" prop="totalLength">
        <el-input
          type="number"
          :disabled="toolVisibleButton"
          v-model="formData.totalLength"
          placeholder="刀具总长..."
        />
      </el-form-item>
      <el-form-item label="刀具r角：" prop="rangle">
        <el-input
          type="number"
          :disabled="toolVisibleButton"
          v-model="formData.rangle"
          placeholder="刀具r角..."
        />
      </el-form-item>
    </el-form>
    <template #footer v-if="!toolVisibleButton">
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { createToolSetting, UpdateVO } from '@/api/knifetool/paring/setting'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const toolVisibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<UpdateVO>({
  id: undefined,
  paringId: undefined,
  diameter: '',
  totalLength: '',
  rangle: '',
  groupCode: '',
  rfid: '',
  code: ''
})

const formRef = ref() // 表单 Ref
const formRules = reactive({
  diameter: [
    {
      required: true,
      message: '刀具直径必须输入!',
      trigger: 'blur'
    }
  ],
  totalLength: [
    {
      required: true,
      message: '刀具总长必须输入!',
      trigger: 'blur'
    }
  ],
  rAngle: [
    {
      required: true,
      message: '刀具r角必须输入!',
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true

  if (type === 'details') {
    dialogTitle.value = '详情'
    toolVisibleButton.value = true
  } else {
    dialogTitle.value = '修改'
    toolVisibleButton.value = false
  }

  dialogTitle.value = type === 'details' ? '详情' : '修改'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    console.log(row)
    formLoading.value = true
    try {
      formData.value = JSON.parse(JSON.stringify(row))
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
    const res = await createToolSetting(formData.value)
    console.log(res)

    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    paringId: undefined,
    diameter: '',
    totalLength: '',
    rangle: '',
    groupCode: '',
    rfid: '',
    code: ''
  }
  formRef.value?.resetFields()
}
</script>
