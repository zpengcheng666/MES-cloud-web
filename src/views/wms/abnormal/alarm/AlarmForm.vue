<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="告警类型" prop="alarmType">
        <el-select v-model="formData.alarmType" placeholder="请选择告警类型">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警源" prop="alarmSource">
        <el-input v-model="formData.alarmSource" placeholder="请输入告警源" />
      </el-form-item>
      <el-form-item label="告警级别" prop="alarmLevel">
        <el-select v-model="formData.alarmLevel" placeholder="请选择告警级别">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_LEVEL)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="告警编号" prop="alarmNum">
        <el-input v-model="formData.alarmNum" placeholder="请输入告警编号" />
      </el-form-item>

      <el-form-item label="异常状态" prop="alarmState">
        <el-select v-model="formData.alarmState" placeholder="请选择异常状态">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_ALARM_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>      
      <el-form-item label="告警描述" prop="alarmDesc">
        <el-input type="textarea" v-model="formData.alarmDesc" placeholder="请输入告警描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AlarmApi, AlarmVO } from '@/api/wms/alarm'

/** 异常 表单 */
defineOptions({ name: 'AlarmForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  alarmType: undefined,
  alarmSource: undefined,
  alarmLevel: undefined,
  alarmNum: undefined,
  alarmDesc: undefined,
  alarmState: undefined,
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
      formData.value = await AlarmApi.getAlarm(id)
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
    const data = formData.value as unknown as AlarmVO
    if (formType.value === 'create') {
      await AlarmApi.createAlarm(data)
      message.success(t('common.createSuccess'))
    } else {
      await AlarmApi.updateAlarm(data)
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
    alarmType: undefined,
    alarmSource: undefined,
    alarmLevel: undefined,
    alarmNum: undefined,
    alarmDesc: undefined,
    alarmState: undefined,
  }
  formRef.value?.resetFields()
}
</script>
