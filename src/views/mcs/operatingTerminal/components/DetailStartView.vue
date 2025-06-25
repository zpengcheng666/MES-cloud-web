<template>
  <Dialog title="工件选择" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="质量编号" prop="qualityNumber">
        <el-input v-model="formData.qualityNumber" placeholder="请输入质量编号" />
      </el-form-item>
      <el-form-item label="物料条码" prop="barCode">
        <el-input v-model="formData.barCode" placeholder="请输入物料条码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {TerminalApi} from "@/api/mcs/terminal";

defineOptions({ name: 'BatchDetailView' })

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData: any = ref({
  batchRecordId: undefined,
  partBatchNumber: undefined,
  operatorId: undefined,
  time: undefined,
  qualityNumber: undefined,
  barCode: undefined
})
const formRules = ref({
  qualityNumber: [{ required: true, message: '质量编号必填', trigger: 'change' }],
  barCode: [{ required: true, message: '物料条码必填', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (data: any) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  formData.value = data;
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const formRef = ref();
const submitForm = async () => {
  // 校验表单
  const valid = await formRef.value?.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    data.time = new Date().getTime()
    await TerminalApi.batchRecordStart(data)
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    batchRecordId: undefined,
    partBatchNumber: undefined,
    operatorId: undefined,
    time: undefined,
    qualityNumber: undefined,
    barCode: undefined
  }
  formRef.value?.resetFields()
}
</script>

<style scoped>

</style>
