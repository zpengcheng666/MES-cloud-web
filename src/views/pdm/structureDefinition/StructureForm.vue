<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="结构名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入结构名称" />
      </el-form-item>
      <el-form-item label="压缩包方式" prop="compressType">
        <el-input v-model="formData.compressType" placeholder="zip" disabled />
      </el-form-item>
      <el-form-item label="编制单位" prop="designUnit">
        <el-input v-model="formData.designUnit" placeholder="沈飞民机" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {StructureApi} from "@/api/pdm/structureDefinition";
import { CommonStatusEnum } from '@/utils/constants'

/** PDM 数据包结构 表单 */
defineOptions({ name: 'StructureForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  parentId: undefined,
  type: undefined,
  name: undefined,
  compressType: '厂家名称+年月日.zip',
  designUnit: '',
  status: undefined,
  fileType: undefined,
  dirPath: '',
  absolutePath: '',
  excelJson: '',
  xmlJson: ''
})
const formRules = reactive({
  name: [{ required: true, message: '结构名称不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (operateType: string, parentId: number, type: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + operateType)
  formType.value = operateType
  resetForm()
  // 新增子级结构时，设置数据
  formLoading.value = true
  try {
    formData.value.parentId = parentId;
    formData.value.type = type;
  } finally {
    formLoading.value = false
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
    formData.value.dirPath = '';
    formData.value.absolutePath = formData.value.name;
    const data = formData.value as unknown as StructureApi.StructureVO
    if (formType.value === 'create') {
      await StructureApi.createStructure(data)
      message.success(t('common.createSuccess'))
    } else {
      await StructureApi.updateStructure(data)
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
    name: undefined,
    compressType: '厂家名称+年月日.zip',
    designUnit: '',
    status: CommonStatusEnum.ENABLE,
    fileType: undefined,
    dirPath: '',
    absolutePath: '',
    excelJson: '',
    xmlJson: ''
  }
  formRef.value?.resetFields()
}

</script>
