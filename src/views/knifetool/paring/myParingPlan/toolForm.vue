<template>
  <Dialog v-model="dialogVisible" title="添加对刀信息" width="800px">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="150px">
      <el-form-item label="刀具组码：">
        <el-input v-model="formData.groupCode" disabled />
      </el-form-item>
      <el-form-item label="刀柄物码：">
        <el-input v-model="formData.code" disabled />
      </el-form-item>
      <el-form-item label="刀具额定寿命：" prop="toolRatedLife">
        <el-input v-model="formData.toolRatedLife" type="number" disabled />
      </el-form-item>
      <el-form-item label="刀具直径：" prop="diameter">
        <el-input v-model="formData.diameter" type="number" placeholder="刀具直径..." @change="checkDiameter" />
      </el-form-item>
      <el-form-item label="刀具总长：" prop="totalLength">
        <el-input v-model="formData.totalLength" type="number" placeholder="刀具总长..." @change="checkTotalLength" />
      </el-form-item>
      <el-form-item label="刀具r角：" prop="rangle">
        <el-input v-model="formData.rangle" type="number" placeholder="刀具r角..." />

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
      <el-form-item label="剩余寿命：" prop="remainLife">
        <el-input v-model="formData.remainLife" type="number" placeholder="剩余寿命..." />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getSettingByParingId, createToolSetting } from '@/api/knifetool/paring/myParingPlan'
import { ElNotification } from 'element-plus'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { Upload } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const { uploadUrl, httpRequest } = useUpload()
const uploadMacDataPath = uploadUrl
const fileList = ref([])

const formData = ref<{
  groupCode?: string
  paringId: string
  code: string
  diameter: string
  totalLength: string
  remainLife: string
  rangle: string,
  toolRatedLife: string
}>({
  groupCode: '',
  paringId: '',
  code: '',
  diameter: '',
  totalLength: '',
  remainLife: '',
  rangle: '',
  toolRatedLife: ''
})

const formRules = reactive({
  //动平衡验证
  weight: [
    {
      required: true,
      message: '质量单位必须输入!',
      trigger: 'blur'
    }
  ],
  maxSpeed: [
    {
      required: true,
      message: '允许机床转速必须输入!',
      trigger: 'blur'
    }
  ],
  gmmResult: [
    {
      required: true,
      message: '结果必须输入!',
      trigger: 'blur'
    }
  ],
  remainLife: [{ required: true, message: '剩余寿命不得为空！', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  resetForm()

  formData.value.paringId = row.paringId
  formData.value.groupCode = row.groupCode
  formData.value.code = row.code
  formData.value.toolRatedLife = row.toolRatedLife
  formData.value.remainLife = row.toolRatedLife
  try {
    const data = await getSettingByParingId({ paringId: row.paringId })
    console.log(data)

    if (data != null) {
      formData.value.diameter = data.diameter
      formData.value.totalLength = data.totalLength
      formData.value.rangle = data.rangle
      formData.value.remainLife = data.remainLife
    }
  } finally {
    formLoading.value = false
  }
  dialogVisible.value = true
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
// const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
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
    message.success('操作成功')
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    paringId: '',
    code: '',
    diameter: '',
    totalLength: '',
    remainLife: '',
    rangle: '',
    toolRatedLife: ''
  }
  formRef.value?.resetFields()
}

// 图片上传错误提示
const uploadError = () => {
  ElNotification({
    title: '温馨提示',
    message: '文件上传失败，请您重新上传！',
    type: 'error'
  })
}

// 文件数超出提示
const handleExceed = () => {
  // ElNotification({
  //   title: '温馨提示',
  //   message: `当前最多只能上传 ${props.limit} 个文件，请移除后上传！`,
  //   type: 'warning'
  // })
}

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

const checkDiameter = () => {
  // if (
  //   formData.value.diameter != null &&
  //   this.tooltipData.diameterDownLimit != null &&
  //   parseFloat(formData.value.diameter) < parseFloat(this.tooltipData.diameterDownLimit)
  // ) {
  //   this.$notification.error({
  //     message: '请注意，刀具直径已低于直径下限'
  //   })
  // }
  // if (
  //   formData.value.diameter != null &&
  //   this.tooltipData.diameterUpLimit != null &&
  //   parseFloat(formData.value.diameter) > parseFloat(this.tooltipData.diameterUpLimit)
  // ) {
  //   this.$notification.error({
  //     message: '请注意，刀具直径已高于直径上限'
  //   })
}

const checkTotalLength = () => {
  //   if (
  //     formData.value.totalLength != null &&
  //     this.tooltipData.totalDownLimit != null &&
  //     parseFloat(formData.value.totalLength) < parseFloat(this.tooltipData.totalDownLimit)
  //   ) {
  //     this.$notification.error({
  //       message: '请注意，刀具总长已低于总长下限'
  //     })
  //   }
  //   if (
  //     formData.value.totalLength != null &&
  //     this.tooltipData.totalUpLimit != null &&
  //     parseFloat(formData.value.totalLength) > parseFloat(this.tooltipData.totalUpLimit)
  //   ) {
  //     this.$notification.error({
  //       message: '请注意，刀具总长已高于总长上限'
  //     })
  //   }
  // }
}
</script>
