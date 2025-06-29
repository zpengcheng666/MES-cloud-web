<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="文件名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入文件名称" />
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-radio-group v-model="formData.fileType">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FILE_TYPE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formData.fileType===2" label="excel列表起始行" prop="startRow">
        <el-input-number v-model="formData.startRow" :min="1" clearable controls-position="right" />
      </el-form-item>
      <!-- 子表的表单 -->
      <el-tabs v-model="subTabsName" v-if="formData.fileType===2">
        <el-tab-pane label="excel规则详情" name="structureExcel">
          <StructureExcelForm ref="structureExcelFormRef" :structure-id="formData.id" />
        </el-tab-pane>
      </el-tabs>
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
import StructureExcelForm from "@/views/pdm/structureDefinition/StructureExcelForm.vue";

/** PDM 数据包结构-文件 表单 */
defineOptions({ name: 'FileForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const parentAbsolutePath = ref('')//上级绝对路径
const formData = ref({
  id: undefined,
  parentId: undefined,
  type: undefined,
  name: undefined,
  compressType: 'zip',
  designUnit: '',
  status: undefined,
  fileType: undefined,
  dirPath: '',
  absolutePath: '',
  startRow: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '文件名称不能为空', trigger: 'blur' }],
  fileType: [{ required: true, message: '文件类型不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** excel子表的表单 */
const subTabsName = ref('structureExcel')
const structureExcelFormRef = ref()

/** 打开弹窗 */
const open = async (operateType: string, parentId: number, type: number, absolutePath: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + operateType)
  formType.value = operateType
  resetForm()
  // 新增子级结构时，设置数据
  formLoading.value = true
  try {
    formData.value.parentId = parentId;
    formData.value.type = type;
    parentAbsolutePath.value = absolutePath;
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
  if(formData.value.fileType===2) {//excel
    // 校验excel子表单
    try {
      await structureExcelFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'structureExcel'
      return
    }
  }
  // 提交请求
  formLoading.value = true
  try {
    formData.value.dirPath = parentAbsolutePath.value;
    let suffix = '';
    if(formData.value.fileType===0) {
      suffix = "CATPart";
    } else if(formData.value.fileType===1) {
      suffix = "pdf";
    } else if(formData.value.fileType===2) {
      suffix = "xlsx";
    } else {
      suffix = "xml";
    }
    formData.value.absolutePath = parentAbsolutePath.value+"\\"+formData.value.name+"."+suffix;
    const data = formData.value as unknown as StructureApi.StructureVO
    if(formData.value.fileType===2) {
      // 拼接excel子表的数据
      data.structureExcels = structureExcelFormRef.value.getData()
    }
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
    compressType: 'zip',
    designUnit: '',
    status: CommonStatusEnum.ENABLE,
    fileType: undefined,
    dirPath: '',
    absolutePath: '',
    startRow: undefined
  }
  formRef.value?.resetFields()
}

</script>
