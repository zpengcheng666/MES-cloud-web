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
      <el-form-item label="同步" prop="automatic">
        <el-select-v2
          v-model="formData.automatic"
          :options="getIntDictOptions(DICT_TYPE.ES_AUTOMATIC)"
          clearable
          placeholder="请选择同步状态"
        />
      </el-form-item>

      <el-form-item label="周期(天)" prop="cycle" v-if="formData.automatic == 1">
        <el-input v-model="formData.cycle" placeholder="请输入自动同步周期" type="number" oninput="value=value.replace(/\D/g,'')" />
      </el-form-item>

      <el-form-item label="互通方式" prop="sync">
        <el-select-v2
          v-model="formData.sync"
          :options="getIntDictOptions(DICT_TYPE.ES_SYNC)"
          clearable
          placeholder="请选择互通方式"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { BrakeSyncApi, BrakeSyncVO } from '@/api/es/brakesync'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 旧厂车牌数据 表单 */
defineOptions({ name: 'BrakeSyncForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  automatic: undefined,
  cycle: undefined,
  sync: undefined
})
const formRules = reactive({
  automatic: [{ required: true, message: '自动同步状态不能为空', trigger: 'blur' }],
  cycle: [{ required: true, message: '周期不能为空', trigger: 'blur' }],
  sync: [{ required: true, message: '同步方式不能为空', trigger: 'blur' }],
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
      formData.value = await BrakeSyncApi.getBrakeSync(id)
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
  if(formData.value.cycle == 0 ){
    message.error("天数不可为0")
    formLoading.value = false
  }
  else if(formData.value.cycle > 31 ){
    message.error("天数不可大于每个月最大天数")
    formLoading.value = false
  }else {
    try {
      const data = formData.value as unknown as BrakeSyncVO
      if (formType.value === 'create') {
        await BrakeSyncApi.updateBrakeSync(data)
        message.success(t('common.createSuccess'))
      } else {
        await BrakeSyncApi.updateBrakeSync(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    automatic: undefined,
    cycle: undefined,
    sync: undefined
  }
  formRef.value?.resetFields()
}
</script>
