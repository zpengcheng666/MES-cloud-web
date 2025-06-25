<template>


      <!--<ContentWrap>-->
        <!--&lt;!&ndash; 搜索工作栏 &ndash;&gt;-->
        <!--<el-form-->
          <!--class="-mb-15px"-->
          <!--:model="queryParams"-->
          <!--ref="queryFormRef"-->
          <!--:inline="true"-->
          <!--label-width="68px"-->
        <!--&gt;-->
          <!--<el-form-item label="日历名称" prop="name">-->
            <!--<el-input-->
              <!--v-model="queryParams.name"-->
              <!--placeholder="请输入日历名称"-->
              <!--clearable-->
              <!--@keyup.enter="handleQuery"-->
              <!--class="!w-240px"-->
            <!--/>-->
          <!--</el-form-item>-->
          <!--&lt;!&ndash;<el-form-item label="开始日期" prop="startDate">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-date-picker&ndash;&gt;-->
              <!--&lt;!&ndash;v-model="queryParams.startDate"&ndash;&gt;-->
              <!--&lt;!&ndash;value-format="YYYY-MM-DD HH:mm:ss"&ndash;&gt;-->
              <!--&lt;!&ndash;type="daterange"&ndash;&gt;-->
              <!--&lt;!&ndash;start-placeholder="开始日期"&ndash;&gt;-->
              <!--&lt;!&ndash;end-placeholder="结束日期"&ndash;&gt;-->
              <!--&lt;!&ndash;:default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"&ndash;&gt;-->
              <!--&lt;!&ndash;class="!w-240px"&ndash;&gt;-->
            <!--&lt;!&ndash;/>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-form-item label="结束日期" prop="endDate">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-date-picker&ndash;&gt;-->
              <!--&lt;!&ndash;v-model="queryParams.endDate"&ndash;&gt;-->
              <!--&lt;!&ndash;value-format="YYYY-MM-DD HH:mm:ss"&ndash;&gt;-->
              <!--&lt;!&ndash;type="daterange"&ndash;&gt;-->
              <!--&lt;!&ndash;start-placeholder="开始日期"&ndash;&gt;-->
              <!--&lt;!&ndash;end-placeholder="结束日期"&ndash;&gt;-->
              <!--&lt;!&ndash;:default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"&ndash;&gt;-->
              <!--&lt;!&ndash;class="!w-240px"&ndash;&gt;-->
            <!--&lt;!&ndash;/>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-form-item>-->
            <!--<el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>-->
            <!--<el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>-->
            <!--&lt;!&ndash;<el-button&ndash;&gt;-->
              <!--&lt;!&ndash;type="primary"&ndash;&gt;-->
              <!--&lt;!&ndash;plain&ndash;&gt;-->
              <!--&lt;!&ndash;@click="openForm('create')"&ndash;&gt;-->
              <!--&lt;!&ndash;v-hasPermi="['pms:basic-calendar:create']"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;&ndash;&gt;-->
              <!--&lt;!&ndash;<Icon icon="ep:plus" class="mr-5px" /> 新增&ndash;&gt;-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-button&ndash;&gt;-->
              <!--&lt;!&ndash;type="success"&ndash;&gt;-->
              <!--&lt;!&ndash;plain&ndash;&gt;-->
              <!--&lt;!&ndash;@click="handleExport"&ndash;&gt;-->
              <!--&lt;!&ndash;:loading="exportLoading"&ndash;&gt;-->
              <!--&lt;!&ndash;v-hasPermi="['pms:basic-calendar:export']"&ndash;&gt;-->
            <!--&lt;!&ndash;&gt;&ndash;&gt;-->
              <!--&lt;!&ndash;<Icon icon="ep:download" class="mr-5px" /> 导出&ndash;&gt;-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</ContentWrap>-->

      <!-- 列表 -->
      <!--<ContentWrap>-->
        <!--<el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">-->
          <!--&lt;!&ndash;<el-table-column label="id" align="center" prop="id" />&ndash;&gt;-->
          <!--<el-table-column label="日历名称" align="center" prop="name" :min-width="100"/>-->
          <!--<el-table-column label="操作" align="center" :min-width="120">-->
            <!--<template #default="scope">-->
              <!--<el-button-->
                <!--link-->
                <!--type="primary"-->
                <!--@click="openForm('update', scope.row.id)"-->
                <!--v-hasPermi="['pms:basic-calendar:update']"-->
              <!--&gt;-->
                <!--编辑-->
              <!--</el-button>-->
              <!--<el-button-->
                <!--link-->
                <!--type="danger"-->
                <!--@click="handleDelete(scope.row.id)"-->
                <!--v-hasPermi="['pms:basic-calendar:delete']"-->
              <!--&gt;-->
                <!--删除-->
              <!--</el-button>-->
              <!--&lt;!&ndash;<el-button&ndash;&gt;-->
                <!--&lt;!&ndash;link&ndash;&gt;-->
                <!--&lt;!&ndash;type="primary"&ndash;&gt;-->
                <!--&lt;!&ndash;@click="detail(scope.row.id)"&ndash;&gt;-->
                <!--&lt;!&ndash;v-hasPermi="['pms:basic-calendar:update']"&ndash;&gt;-->
              <!--&lt;!&ndash;&gt;&ndash;&gt;-->
                <!--&lt;!&ndash;详情&ndash;&gt;-->
              <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
              <!--<el-button-->
                <!--link-->
                <!--type="primary"-->
                <!--@click="searchCalendar(scope.row.id)"-->
                <!--v-hasPermi="['pms:basic-calendar:update']"-->
              <!--&gt;-->
                <!--查看日历-->
              <!--</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
        <!--&lt;!&ndash; 分页 &ndash;&gt;-->
        <!--<Pagination-->
          <!--:total="total"-->
          <!--v-model:page="queryParams.pageNo"-->
          <!--v-model:limit="queryParams.pageSize"-->
          <!--@pagination="getList"-->
        <!--/>-->
      <!--</ContentWrap>-->


  <!-- 表单弹窗：添加/修改 -->
  <BasicCalendarForm ref="formRef" @success="getList" />
  <!-- 基础日历查看 -->
  <Calendar ref="calendarRef"/>
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { BasicCalendarApi, BasicCalendarVO } from '@/api/pms/calendar'
import BasicCalendarForm from './BasicCalendarForm.vue'
import Calendar from './components/calendar.vue'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

/** 基础日历 列表 */
defineOptions({ name: 'BasicCalendar' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<BasicCalendarVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  startDate: [],
  endDate: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await BasicCalendarApi.getBasicCalendarPage(queryParams)
    list.value = data.list
    total.value = data.total
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
const calendarRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
//查看日历
const searchCalendar = (id?: number) => {
  calendarRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BasicCalendarApi.deleteBasicCalendar(id)
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
    const data = await BasicCalendarApi.exportBasicCalendar(queryParams)
    download.excel(data, '基础日历.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}
const detail = (id)=>{
  BasicCalendarApi.getBasicCalendarTest(id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
