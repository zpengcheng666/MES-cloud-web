<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="会议主题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入会议主题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="会议日期" prop="mDate">
        <el-date-picker
          v-model="queryParams.mDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="参会人员" prop="staff">
        <el-input
          v-model="queryParams.staff"
          placeholder="请输入参会人员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="queryParams.startTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="queryParams.endTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="会议室" prop="mroom">
        <el-input
          v-model="queryParams.mroom"
          placeholder="请输入会议室"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button plain type="primary" @click="handleCreate()">
          <Icon class="mr-5px" icon="ep:plus" />
          会议申请
        </el-button>
        <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--@click="handleExport"-->
          <!--:loading="exportLoading"-->
          <!--v-hasPermi="['bpm:oa-meeting:export']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:download" class="mr-5px" /> 导出-->
        <!--</el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="会议主题" align="center" prop="title" />
      <!--<el-table-column label="会议日期" align="center" prop="mDate" />-->
      <el-table-column label="参会人员" align="center" prop="staff" />
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <!--<el-table-column label="开始时间" align="center" prop="startTime" />-->
      <!--<el-table-column label="结束时间" align="center" prop="endTime" />-->
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="会议室" align="center" prop="mroom" />
      <el-table-column label="描述" align="center" prop="description" />
      <!--<el-table-column label="文件" align="center" prop="document" />-->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            v-hasPermi="['bpm:oa-meeting:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['bpm:oa-meeting:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
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

</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OaMeetingApi, OaMeetingVO,OaMeetingType } from '@/api/bpm/oameeting'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** OA 会议申请 列表 */
defineOptions({ name: 'OaMeeting' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
// const router = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<OaMeetingVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  title: undefined,
  mDate: [],
  staff: undefined,
  startTime: [],
  endTime: [],
  mroom: undefined,
  description: undefined,
  document: undefined,
  createTime: [],
  // status: undefined,
  // processInstanceId: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OaMeetingApi.getOaMeetingPage(queryParams)
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


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await OaMeetingApi.exportOaMeeting(queryParams)
    download.excel(data, 'OA 会议申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 添加操作 */
const handleCreate = () => {
  // router.push({ name: 'OAPurchaseForm' })
  delView(unref(currentRoute))
  push({ name: 'OAMeetingCreate'})
}

/** 审批进度 */
const handleProcessDetail = (row) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/** 详情操作 */
const handleDetail = (row: OaMeetingType) => {
  push({
    name: 'OAMeetingDetail',
    query: {
      id: row.id
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
