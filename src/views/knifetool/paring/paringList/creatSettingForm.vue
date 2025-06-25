<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="130px">
      <el-form-item label="刀组编码：">
        <el-input v-model="formData.groupCode" disabled />
      </el-form-item>
      <el-form-item label="刀柄物码：">
        <el-input v-model="formData.code" disabled />
      </el-form-item>
      <el-form-item label="刀具直径：" prop="diameter">
        <el-input v-model="formData.diameter" type="number" placeholder="刀具直径..."
          :disabled="formData.settingStatus === 1" />
      </el-form-item>
      <el-form-item label="刀具总长：" prop="totalLength">
        <el-input v-model="formData.totalLength" type="number" placeholder="刀具总长..."
          :disabled="formData.settingStatus === 1" />
      </el-form-item>
      <el-form-item label="刀具r角：" prop="rangle">
        <el-input v-model="formData.rangle" type="number" placeholder="刀具r角..."
          :disabled="formData.settingStatus === 1" />
        <!-- <el-upload
          v-model:file-list="fileList"
          class="upload-demo mt-20px"
          :accept="'.xml'"
          :action="uploadMacDataPath"
          multiple
          :on-error="uploadError"
          :on-exceed="handleExceed"
          :on-success="uploadSuccess"
        >
          <el-button type="primary">
            上传对刀仪数据<el-icon class="el-icon--right"><Upload /></el-icon>
          </el-button>
        </el-upload> -->
      </el-form-item>
      <el-form-item label="刀具额定寿命：" prop="toolReadLife">
        <el-input v-model="formData.toolReadLife" type="number" placeholder="额定寿命..." />
      </el-form-item>
      <el-form-item label="剩余寿命：" prop="remainLife">
        <el-input v-model="formData.remainLife" type="number" placeholder="剩余寿命..." />
      </el-form-item>
    </el-form>
    <template #footer v-if="!toolVisibleButton">
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getSettingByParingId } from '@/api/knifetool/paring/paringList'
import { createToolSetting } from '@/api/knifetool/paring/setting'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { Upload } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const toolVisibleButton = ref(false)
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  groupCode: '',
  paringId: '',
  code: '',
  diameter: '',
  totalLength: '',
  settingStatus: null,
  rangle: '',
  remainLife: '',
  toolReadLife: ''
})

const { uploadUrl, httpRequest } = useUpload()
const fileList = ref([])
const uploadMacDataPath = uploadUrl

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
  rangle: [
    {
      required: true,
      message: '刀具r角必须输入!',
      trigger: 'blur'
    }
  ],
  remainLife: [
    {
      required: true,
      message: '剩余寿命必须输入!',
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  console.log(row)
  resetForm()

  dialogTitle.value = type === 'create' ? '添加对刀信息' : '修改对刀信息'
  dialogVisible.value = true

  formData.value.groupCode = row.groupCode
  formData.value.code = row.code
  formData.value.paringId = row.id
  formData.value.settingStatus = row.settingStatus

  try {
    const data = await getSettingByParingId({ paringId: row.id })
    formData.value.diameter = data.diameter
    formData.value.totalLength = data.totalLength
    formData.value.rangle = data.rangle
    formData.value.remainLife = data.remainLife
  } finally {
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
    groupCode: '',
    paringId: '',
    code: '',
    diameter: '',
    totalLength: '',
    settingStatus: null,
    rangle: '',
    remainLife: '',
    toolReadLife: ''
  }
  formRef.value?.resetFields()
}

// 图片上传错误提示
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '图片上传失败，请您重新上传！',
    type: 'error'
  })
}

// 文件数超出提示
const handleExceed = () => {
  // ElNotification({
  //   title: '温馨提示',
  //   message: `当前最多只能上传 ${props.limit} 张图片，请移除后上传！`,
  //   type: 'warning'
  // })
}

// const emit = defineEmits<UploadEmits>()
const uploadSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
  console.log(res)
  // // 删除自身
  // const index = fileList.value.findIndex((item) => item.response?.data === res.data)
  // fileList.value.splice(index, 1)
  // uploadList.value.push({ name: res.data, url: res.data })
  // if (uploadList.value.length == uploadNumber.value) {
  //   fileList.value.push(...uploadList.value)
  //   uploadList.value = []
  //   uploadNumber.value = 0
  //   emitUpdateModelValue()
  // }
}
</script>
