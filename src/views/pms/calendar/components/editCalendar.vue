<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="选中日期" prop="csdate">
        <el-input v-model="formData.csdate" placeholder="请输入日期" disabled/>
      </el-form-item>

      <el-form-item label="工作日" prop="csname">
        <el-select v-model="formData.csname" placeholder="请选择是否工作">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CALENDAR_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
import { BasicCalendarApi, BasicCalendarVO } from '@/api/pms/calendar'
import { CalendarSpecialApi } from '@/api/pms/calendar/special.ts'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

/** 基础日历 编辑,用于特殊日期假期调整 */
defineOptions({ name: 'editCalendar' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
  startDate: undefined,
  endDate: undefined,
})
const formRules = reactive({
  csname: [{ required: true, message: '是否工作不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  if (row) {
    formLoading.value = true
    try {
      formData.value = row;
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
    const data = formData.value as unknown as BasicCalendarVO
    await CalendarSpecialApi.createCalendarSpecial(data)
    message.success(t('common.createSuccess'))
    // if (formType.value === 'create') {
    //   await BasicCalendarApi.createBasicCalendar(data)
    //   message.success(t('common.createSuccess'))
    // } else {
    //   await BasicCalendarApi.updateBasicCalendar(data)
    //   message.success(t('common.updateSuccess'))
    // }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success',formData.value.bcid)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  }
  formRef.value?.resetFields()
}
</script>
