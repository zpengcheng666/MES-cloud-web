<template>
  <el-row>
    <el-col :span="9">
      <ContentWrap>
        <ContentWrap title="设备编号">
          <!-- 搜索工作栏 -->
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="80px"
          >
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入名称"
                clearable
                @keyup.enter="handleQuery"
                class="!w-160px"
              />
              <el-button @click="handleQuery" style="margin-left: 5px"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
              <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
            </el-form-item>


            <!--<el-form-item>-->
              <!--<el-button @click="handleQuery" style="margin-left: 100px"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
              <!--<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
            <!--</el-form-item>-->
          </el-form>
        </ContentWrap>
        <ContentWrap title="日历详情">
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column label="编号" align="center" prop="code" min-width="80"/>
            <el-table-column label="名称" align="center" prop="name" min-width="150"/>
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :type="DICT_TYPE.DMS_DEVICE_STATUS" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px">
              <template #default="scope">
                <el-button link type="primary" @click="searchCalendar(scope.row)">
                  查看日历
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <Pagination
            :total="total"
            v-model:page="queryParams.pageNo"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </ContentWrap>
      </ContentWrap>

    </el-col>
    <el-col :span="15">
      <ContentWrap>
        <ContentWrap>
          <div>
            <el-row :gutter="8">
              <el-col :span="4">
                设备编号: <el-tag type="warning">{{deviceNumber}}</el-tag>
              </el-col>
              <el-col :span="1.5" :offset="12">
                <el-button @click="openBindShiftForm" type="primary" :disabled="formLoading">关联班次</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button @click="openEditDeviceCalendarForm" type="primary" :disabled="formLoading">编辑</el-button>
              </el-col>
              <el-col :span="2">
                <el-button @click="deleteDeviceCalendar" type="danger" :disabled="formLoading">删除</el-button>
              </el-col>
            </el-row>
          </div>
        </ContentWrap>
        <ContentWrap>
          <!--日历-->
          <el-calendar v-model="dateValue">
            <template #date-cell="{data}">
              <div style="width: 100%;height: 100%;text-align: center" @click="dateClick(data)" >
                <div v-if="selectDateList.indexOf(data.day) > -1" style="width: 100%;height: 100%;background-color: #d3fffd">
                  <div>
                    {{ data.day.split('-').slice(1).join('-') }}
                  </div>
                  <!--<div>-->
                  <!--{{ dateIndex.indexOf(data.day) > -1 ? dateList[dateIndex.indexOf(data.day)]?.startStr +'-'+  dateList[dateIndex.indexOf(data.day)]?.endStr: ''}}-->
                  <!--</div>-->
                  <div>
                    {{getData2(data.day)}}
                  </div>
                </div>
                <div v-else>
                  <div>
                    {{ data.day.split('-').slice(1).join('-') }}
                  </div>
                  <div>
                  <!--{{ dateIndex.indexOf(data.day) > -1 ? dateList[dateIndex.indexOf(data.day)]?.show : ''}}-->
                    {{getData2(data.day)}}
                  </div>
                </div>
              </div>
            </template>
          </el-calendar>
        </ContentWrap>
      </ContentWrap>

    </el-col>
  </el-row>

  <BindShiftTableForm ref="bindShiftTableFormRef" @search-calendar="searchCalendar"/>
  <EditDeviceCalendar ref="editDeviceCalendarRef" @search-calendar="searchCalendar"/>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { CalendarDeviceApi, CalendarDeviceVO } from '@/api/pms/calendardevice'
import { CalendarSpecialApi } from '@/api/pms/calendar/special'
import CalendarDeviceForm from './CalendarDeviceForm.vue'
import BindShiftTableForm from './components/BindShiftTableForm.vue'
import EditDeviceCalendar from './components/editDeviceCalendar.vue'
import { LedgerApi, LedgerVO } from '@/api/dms/ledger'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 设备日历,记录设备每天的可用时间 列表 */
defineOptions({ name: 'CalendarDevice' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const formLoading = ref(false) // 列表的加载中
const list = ref<CalendarDeviceVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  lintStationGroup:""
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
//设备编号
const deviceNumber = ref()
//设备信息
const deviceRow = ref()
//当前选中日期
const currentDate = ref()
//选中日期集合
const selectDateList = ref<any[]>([]);
//班次时间集合
const timeList = ref<any[]>([]);

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await LedgerApi.getLedgerPage(queryParams)
    list.value = data.list
    total.value = data.total
    getSpecialDate()
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CalendarDeviceApi.deleteCalendarDevice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CalendarDeviceApi.exportCalendarDevice(queryParams)
    download.excel(data, '设备日历,记录设备每天的可用时间.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
//查看日历,显示选中设备，显示日历班次
const dateList = ref<any[]>([])
const dateIndex = ref<any[]>([])
//基础班次信息
const shiftTimeList = ref<any[]>([]);
const searchCalendar = async (row)=>{
  await getSpecialDate()

  deviceNumber.value = row.code;
  deviceRow.value = row;
  const data = await CalendarDeviceApi.getByDeviceId(row.id);
  //查看设备的基础班次
  shiftTimeList.value = await CalendarDeviceApi.getShiftByDeviceId(row.id);
  data.forEach((item)=>{
    dateIndex.value.push(item.dateStr);
  })
  dateList.value = data;
}

const dateClick = (data)=>{
  console.log(data.day)
  currentDate.value = data.day;
  if(selectDateList.value.indexOf(data.day) > -1 ){
    let index = selectDateList.value.indexOf(data.day);
    selectDateList.value.splice(index,1);
  }else {
    selectDateList.value.push(data.day)
  }
  // console.log(row,row2)
}

const bindShiftTableFormRef = ref();
//打开关联班次表
const openBindShiftForm = ()=>{
  if(deviceRow.value){
    const data = Object.assign({},deviceRow.value)
    bindShiftTableFormRef.value.open(data)
  }else {
    message.warning('未选择设备')
  }

}

const getData = (day)=>{
  let info = '';
  const data = dateList.value.filter((item)=>{
    return item.dateStr===day;
  })
  data.forEach((item)=>{
    info = info + item.startStr + '-' + item.endStr + '\n'
  })
  return info;
}
const getData2 = (day)=>{
  let info = '';
  //常规判断
  let dayWeek = getDayOfWeek(day);
  //特殊判断
  const specialDate = specialDateList.value.filter((item)=>{
    return item.csdate===day;
  })
  if(specialDate.length==1){
    dayWeek = specialDate[0].csname;
  }
  if(dayWeek == 2){
    shiftTimeList.value.forEach((item)=>{
      info = info + item.startStr + '-' + item.endStr + '\n'
    })

    //假如设备日历编辑过了,就以编辑过的日历为准
    const data = dateList.value.filter((item)=>{
      return item.dateStr===day;
    })
    if(data.length>0){
      info = '';
      data.forEach((item)=>{
        info = info + item.startStr + '-' + item.endStr + '\n'
      })
    }
  }

  return info;
}

const editDeviceCalendarRef = ref()
const openEditDeviceCalendarForm = ()=>{
  if(deviceRow.value===null||deviceRow.value===undefined){
    message.warning('未选择设备')
    return
  }
  if(selectDateList.value.length ===0){
    message.warning('未选择日期')
    return
  }
  const dateListStr = selectDateList.value.join(",");
  const hourList = dateList.value.filter((item)=>{
    return item.dateStr===currentDate.value;
  })
  //日期,设备,时间
  const data = {
    dateList:dateListStr,
    deviceRow:deviceRow.value,
    dayHour:hourList
  }
  console.log(data)
  editDeviceCalendarRef.value.open(data)
}
const deleteDeviceCalendar = async ()=>{
  if(deviceRow.value===null||deviceRow.value===undefined){
    message.warning('未选择设备')
    return
  }
  if(selectDateList.value.length ===0){
    message.warning('未选择日期')
    return
  }
  formLoading.value = true;
  const dateListStr = selectDateList.value.join(",");
  try {
    const data = {
      deviceId:deviceRow.value.id,
      dateList:dateListStr
    }
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CalendarDeviceApi.deleteByDate(data)
    searchCalendar(deviceRow.value)
    message.success(t('common.delSuccess'))
  }finally {
    formLoading.value = false;
  }
}
//特殊日期
const specialDateList = ref<any[]>([])
const getSpecialDate = async ()=>{
  specialDateList.value = await CalendarSpecialApi.listAll()
}

//获取日期是星期几,直接返回1或2
const getDayOfWeek = (date)=>{
  let day = new Date(date);
  let weekday = day.getDay()
  if(weekday==0||weekday==6){
    //放假
    return 1;
  }else {
    //休息
    return 2;
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style scoped lang="scss">
  :deep .el-calendar-day {
    padding: 2px;
    --el-calendar-cell-width: 120px;
  }
</style>
