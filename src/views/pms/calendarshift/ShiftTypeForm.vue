<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="班次名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入班次名称" />
      </el-form-item>

      <!--<el-form-item label="基础日历" prop="basicName">-->
        <!--<el-input v-model="formData.basicName" placeholder="请输入基础日历" readonly @click="openBasicCalendar"/>-->
      <!--</el-form-item>-->
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="班次时间" name="shiftTime">
        <ShiftTimeForm ref="shiftTimeFormRef" :type-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ShiftTypeApi, ShiftTypeVO } from '@/api/pms/calendarshift/shifttype'
import ShiftTimeForm from './components/ShiftTimeForm.vue'

/** 班次类型 表单 */
defineOptions({ name: 'ShiftTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '班次名称不能为空', trigger: 'blur' }],
  basicName: [{ required: true, message: '基础日历不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('shiftTime')
const shiftTimeFormRef = ref()

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
      formData.value = await ShiftTypeApi.getShiftType(id)
    } finally {
      formLoading.value = false
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success','openBasicCalendar']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await shiftTimeFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'shiftTime'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ShiftTypeVO
    // 拼接子表的数据
    data.shiftTimes = shiftTimeFormRef.value.getData()
    if (formType.value === 'create') {
      await ShiftTypeApi.createShiftType(data)
      message.success(t('common.createSuccess'))
    } else {
      await ShiftTypeApi.updateShiftType(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
//通知打开基础日历
const openBasicCalendar = ()=>{
  console.log('input')
  emit('openBasicCalendar')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    bcid: undefined,
    basicName: undefined,
  }
  formRef.value?.resetFields()
}
const setBasicRow = (row)=>{
  debugger
  if(row){
    formData.value.bcid = row.id;
    formData.value.basicName = row.name
  }else {
    formData.value.bcid = undefined
    formData.value.basicName = undefined
  }

}
defineExpose({ open,setBasicRow }) // 提供 open 方法，用于打开弹窗
</script>
