<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="物料id" prop="materialStockId">
        <el-select v-model="formData.materialStockId" placeholder="请选择物料id">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="账面数量" prop="realTotality">
        <el-input v-model="formData.realTotality" placeholder="请输入账面数量" />
      </el-form-item>
      <el-form-item label="盘点数量" prop="checkTotality">
        <el-input v-model="formData.checkTotality" placeholder="请输入盘点数量" />
      </el-form-item>
      <el-form-item label="盘点时间" prop="checkTime">
        <el-date-picker
          v-model="formData.checkTime"
          type="date"
          value-format="x"
          placeholder="选择盘点时间"
        />
      </el-form-item>
      <el-form-item label="盘点容器id" prop="checkContainerId">
        <el-select v-model="formData.checkContainerId" placeholder="请选择盘点容器id">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CheckDetailApi, CheckDetailVO } from '@/api/wms/checkdetail'

/** 库存盘点详情 表单 */
defineOptions({ name: 'CheckDetailForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialStockId: undefined,
  realTotality: undefined,
  checkTotality: undefined,
  checkTime: undefined,
  checkContainerId: undefined,
})
const formRules = reactive({
})
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
      formData.value = await CheckDetailApi.getCheckDetail(id)
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
    const data = formData.value as unknown as CheckDetailVO
    if (formType.value === 'create') {
      await CheckDetailApi.createCheckDetail(data)
      message.success(t('common.createSuccess'))
    } else {
      await CheckDetailApi.updateCheckDetail(data)
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
    materialStockId: undefined,
    realTotality: undefined,
    checkTotality: undefined,
    checkTime: undefined,
    checkContainerId: undefined,
  }
  formRef.value?.resetFields()
}
</script>