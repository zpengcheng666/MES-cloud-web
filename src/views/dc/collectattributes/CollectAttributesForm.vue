<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-form-item label="属性名称" prop="collectAttributesName">
        <el-input v-model="formData.collectAttributesName" placeholder="请输入采集属性名称" />
      </el-form-item>

      <el-form-item label="属性详情" prop="collectAttributesText">
        <el-input type='textarea' v-model="formData.collectAttributesText" placeholder="请输入采集属性详情" />
      </el-form-item>

      <el-form-item label="属性值" prop="collectAttributesValue">
        <el-input v-model="formData.collectAttributesValue" placeholder="请输入采集属性值名称" />
      </el-form-item>

      <el-form-item label="属性类型" prop="collectAttributesType">
        <el-select-v2
          v-model="formData.collectAttributesType"
          :options="getIntDictOptions(DICT_TYPE.DC_COLLECT_ATTRIBUTES)"
          clearable
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
import { CollectAttributesApi, CollectAttributesVO } from '@/api/dc/collectattributes'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 采集属性 表单 */
defineOptions({ name: 'CollectAttributesForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  collectAttributesName: undefined,
  collectAttributesText: undefined,
  collectAttributesValue: undefined,
  collectAttributesType: undefined
})
const formRules = reactive({
  collectAttributesName: [{ required: true, message: '采集属性名称不能为空', trigger: 'blur' }],
  collectAttributesValue: [{ required: true, message: '采集属性值名称不能为空', trigger: 'blur' }],
  collectAttributesType: [{ required: true, message: '采集属性值类型不能为空', trigger: 'blur' }],
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
      formData.value = await CollectAttributesApi.getCollectAttributes(id)
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
    const data = formData.value as unknown as CollectAttributesVO
    if (formType.value === 'create') {
      await CollectAttributesApi.createCollectAttributes(data)
      message.success(t('common.createSuccess'))
    } else {
      await CollectAttributesApi.updateCollectAttributes(data)
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
    collectAttributesName: undefined,
    collectAttributesText: undefined,
    collectAttributesValue: undefined,
    collectAttributesType: undefined
  }
  formRef.value?.resetFields()
}
</script>
