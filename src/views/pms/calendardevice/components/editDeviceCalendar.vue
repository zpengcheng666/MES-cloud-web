<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="选中日期" prop="dateList">
        <el-input v-model="formData.dateList" placeholder="请输入日期" disabled/>
      </el-form-item>
      <el-form-item label="选中设备" prop="code">
        <el-input v-model="formData.code" placeholder="请输入设备" disabled/>
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="班次时间" name="shiftTime">
        <ShiftTimeForm ref="shiftTimeFormRef"/>
      </el-tab-pane>
    </el-tabs>
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
import ShiftTimeForm from '../../calendarshift/components/ShiftTimeForm.vue'
import {CalendarDeviceApi} from "@/api/pms/calendardevice";

/** 设备日历 编辑 */
defineOptions({ name: 'editDeviceCalendar' })

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

/** 子表的表单 */
const subTabsName = ref('shiftTime')
const shiftTimeFormRef = ref()
const deviceRow = ref()
/** 打开弹窗 */
const open = async (row) => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  if (row) {
    formLoading.value = true
    try {
      deviceRow.value = row.deviceRow;
      formData.value.dateList = row.dateList;
      formData.value.code = row.deviceRow.code;
      formData.value.deviceId = row.deviceRow.id;
      const hourList = row.dayHour;
      const hourArray = []
      hourList.forEach((item)=>{
        const hourRow = {
          startTime: item.startStr,
          endTime: item.endStr,
        }
        hourArray.push(hourRow);
      })
      nextTick(()=>{
        shiftTimeFormRef.value.setData(hourArray)
      })
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
  const data = formData.value;
  const timeList = shiftTimeFormRef.value.getData()
  data.timeList = timeList;
  // 提交请求
  formLoading.value = true
  try {
    await CalendarDeviceApi.updateCalendarDeviceByTime(data)
    // 发送操作成功的事件
    emit('searchCalendar',deviceRow.value)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false

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
    dateList:undefined,
    code:undefined,
    deviceId:undefined
  }
  deviceRow.value = []
  formRef.value?.resetFields()
}
</script>
