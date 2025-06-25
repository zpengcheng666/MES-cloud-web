<template>
  <ContentWrap>
    <div style="height: 30px">
      <el-row :gutter="8">
        <el-col :span="1.5" :offset="20">
          <el-button @click="editCalendar" type="primary" :disabled="formLoading">编辑</el-button>
        </el-col>
        <el-col :span="2.5">
          <el-button @click="deleteCalendar" type="danger" :disabled="formLoading">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <el-calendar v-model="dateValue">
      <template #date-cell="{data}">
        <div style="width: 100%;height: 100%;text-align: center;overflow: hidden" @click="dateClick(data)" >
          <div v-if="selectDateList.indexOf(data.day) > -1" style="width: 100%;height: 100%;background-color: #d3fffd">
            <div>
              {{ data.day.split('-').slice(1).join('-') }}
            </div>
            <div>
              {{ dateIndex.indexOf(data.day) > -1 ? dateList[dateIndex.indexOf(data.day)]?.name : ''}}
            </div>
          </div>
          <div v-else>
            <div>
              {{ data.day.split('-').slice(1).join('-') }}
            </div>
            <div>
              {{ dateIndex.indexOf(data.day) > -1 ? dateList[dateIndex.indexOf(data.day)]?.name : ''}}
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </ContentWrap>



    <!--<template #footer>-->
      <!--<el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>-->
      <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
    <!--</template>-->
  <EditCalendar ref = "editCalendarRef" @success="getList"/>
</template>
<script setup lang="ts">
// import { BasicCalendarApi, BasicCalendarVO } from '@/api/pms/calendar'
// import { CalendarDetailApi } from '@/api/pms/calendar/detail.ts'
import { CalendarSpecialApi } from '@/api/pms/calendar/special.ts'
import EditCalendar from './editCalendar.vue'

/** 基础日历 表单 */
defineOptions({ name: 'Calendar' })

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
  name: [{ required: true, message: '日历名称不能为空', trigger: 'blur' }],
  startDate: [{ required: true, message: '开始日期不能为空', trigger: 'blur' }],
  endDate: [{ required: true, message: '结束日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const editCalendarRef = ref() // 表单 Ref
//基础日历id
const bcid = ref()
//当前选中日期
const currentDate = ref()
//绑定值,具体用法未知
const dateValue = ref(new Date())
//基础日历日期集合
const dateList = ref<any[]>([]);
//日期集合
const dateIndex = ref<any[]>([]);
//选中日期集合
const selectDateList = ref<any[]>([]);

const getList =async ()=>{
  dateIndex.value = []
  dateList.value = []
  const data = await CalendarSpecialApi.listAll()
  data.forEach((item)=>{
    if(item.csname==1){
      item.name = '休息'
    }
    if(item.csname==2) {
      item.name = '工作'
    }
    dateIndex.value.push(item.csdate)
  })
  dateList.value = data;
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
    if (formType.value === 'create') {
      await BasicCalendarApi.createBasicCalendar(data)
      message.success(t('common.createSuccess'))
    } else {
      await BasicCalendarApi.updateBasicCalendar(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const editCalendar = ()=>{
  if(currentDate.value==undefined){
    message.warning("未选择日期")
    return;
  }
  currentDate.value = selectDateList.value.join(",");
  const row = {
    bcid:bcid.value,
    csdate:currentDate.value
  }
  editCalendarRef.value.open(row)
}

const deleteCalendar = async ()=>{
  if(selectDateList.value.length === 0){
    message.warning('未选择日期')
    return
  }
  try {
    currentDate.value = selectDateList.value.join(",");
    // 删除的二次确认
    await message.delConfirm()
    const row = {
      bcid:bcid.value,
      csdate:currentDate.value
    }
    await CalendarSpecialApi.deleteByDate(row)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList(bcid.value)
  }catch (e) {

  }
}

const dateClick = (data)=>{
  console.log('点击了吗')
  console.log(data)
  currentDate.value = data.day;
  if(selectDateList.value.indexOf(data.day) > -1 ){
    let index = selectDateList.value.indexOf(data.day);
    selectDateList.value.splice(index,1);
  }else {
    selectDateList.value.push(data.day)
  }
  // console.log(row,row2)
}

onMounted(()=>{
  getList();
})

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    startDate: undefined,
    endDate: undefined,
  }
  currentDate.value = undefined;
  bcid.value = undefined;
  selectDateList.value = []
  formRef.value?.resetFields()
}
</script>
<style scoped lang="scss">
  :deep .el-calendar-day {
    padding: 2px;
    --el-calendar-cell-width: 100px;
  }
</style>
