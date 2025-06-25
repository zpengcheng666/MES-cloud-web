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
      <el-form-item label="指令编码" prop="insCode">
        <el-input v-model="formData.insCode" placeholder="请输入指令编码" />
      </el-form-item>
      <el-form-item label="物料库存" prop="materialStockId">
        <el-select-v2
          v-model="formData.materialStockId"
          :options="props.materialstockList"
          filterable
          clearable
          placeholder="选择物料库存"
        />
      </el-form-item>
      <el-form-item label="指令类型" prop="insType">
        <el-select v-model="formData.insType" placeholder="请选择指令类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_INSTRUCTION_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="指令状态" prop="insStatus">
        <el-select v-model="formData.insStatus" placeholder="请选择指令状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_INSTRUCTION_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="起始库位" prop="startLocationId">
        <el-select-v2
          v-model="formData.startLocationId"
          :options="props.warehouselocationList"
          filterable
          clearable
          placeholder="选择起始库位"
        />
      </el-form-item>
      <el-form-item label="目标库位" prop="targetLocationId">
        <el-select-v2
          v-model="formData.targetLocationId"
          :options="props.warehouselocationList"
          filterable
          clearable
          placeholder="选择目标库位"
        />
      </el-form-item>
      <el-form-item label="指令内容" prop="insContent">
        <el-input
          v-model="formData.insContent"
          type="textarea"
          :rows="3"
          placeholder="请输入指令内容"
        />
      </el-form-item>
      <el-form-item label="指令描述" prop="insDescription">
        <el-input
          v-model="formData.insDescription"
          type="textarea"
          :rows="5"
          placeholder="请输入指令描述"
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { InstructionApi, InstructionVO } from '@/api/wms/instruction'

/** 指令 表单 */
defineOptions({ name: 'InstructionForm' })

const props = defineProps(['materialstockList', 'warehouselocationList'])
// 添加属性

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  insCode: undefined,
  materialStockId: undefined,
  insType: undefined,
  insStatus: undefined,
  startLocationId: undefined,
  targetLocationId: undefined,
  insContent: undefined,
  insDescription: undefined
})
const formRules = reactive({})
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
      formData.value = await InstructionApi.getInstruction(id)
      formLoading.value = false
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
    const data = formData.value as unknown as InstructionVO
    if (formType.value === 'create') {
      await InstructionApi.createInstruction(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await InstructionApi.updateInstruction(data)
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
    insCode: undefined,
    materialStockId: undefined,
    insType: undefined,
    insStatus: undefined,
    startLocationId: undefined,
    targetLocationId: undefined,
    insContent: undefined,
    insDescription: undefined
  }
  formRef.value?.resetFields()
}
</script>
