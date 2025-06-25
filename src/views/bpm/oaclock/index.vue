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
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="打卡类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择打卡类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.BPM_OA_CLOCK_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入部门"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input
          v-model="queryParams.job"
          placeholder="请输入岗位"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="打卡时间" prop="clockTime">
        <el-date-picker
          v-model="queryParams.clockTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="打卡异常原因" prop="reason">
        <el-input
          v-model="queryParams.reason"
          placeholder="请输入打卡异常原因"
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
          打卡
        </el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--plain-->
          <!--@click="openForm('create')"-->
          <!--v-hasPermi="['bpm:oa-clock:create']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:plus" class="mr-5px" /> 新增-->
        <!--</el-button>-->
        <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--@click="handleExport"-->
          <!--:loading="exportLoading"-->
          <!--v-hasPermi="['bpm:oa-clock:export']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:download" class="mr-5px" /> 导出-->
        <!--</el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户名" align="center" prop="name" />
      <!--<el-table-column label="用户id" align="center" prop="userId" />-->
      <el-table-column label="打卡类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_OA_CLOCK_TYPE" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="打卡状态" align="center" prop="clockStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.BPM_OA_CLOCK_STATUS" :value="scope.row.clockStatus" />
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="岗位" align="center" prop="job" />
      <el-table-column
        label="打卡时间"
        align="center"
        prop="clockTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="打卡异常原因" align="center" prop="reason" />
      <!--<el-table-column-->
        <!--label="创建时间"-->
        <!--align="center"-->
        <!--prop="createTime"-->
        <!--:formatter="dateFormatter"-->
        <!--width="180px"-->
      <!--/>-->
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            v-hasPermi="['bpm:oa-clock:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['bpm:oa-clock:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
          </el-button>
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--v-hasPermi="['bpm:oa-clock:update']"-->
          <!--&gt;-->
            <!--编辑-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--link-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.row.id)"-->
            <!--v-hasPermi="['bpm:oa-clock:delete']"-->
          <!--&gt;-->
            <!--删除-->
          <!--</el-button>-->
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

  <!-- 表单弹窗：添加/修改 -->
  <!--<OaClockForm ref="formRef" @success="getList" />-->

</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OaClockApi, OaClockVO,OaClockType } from '@/api/bpm/oaclock'
import OaClockForm from './OaClockForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** OA 打卡 列表 */
defineOptions({ name: 'OaClock' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
// const router = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<OaClockVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  type: undefined,
  dept: undefined,
  job: undefined,
  clockTime: [],
  reason: undefined,
  status: undefined,
  processInstanceId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OaClockApi.getOaClockPage(queryParams)
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await OaClockApi.deleteOaClock(id)
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
    const data = await OaClockApi.exportOaClock(queryParams)
    download.excel(data, 'OA 打卡.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 添加操作 */
const handleCreate = () => {
  // router.push({ name: 'OAPurchaseForm' })
  // 关闭当前 Tab
  // delView(unref(router.currentRoute))
  // router.push({ name: 'OAClockCreate'})

  delView(unref(currentRoute))
  push({ name: 'OAClockCreate'})

}

/** 审批进度 */
const handleProcessDetail = (row) => {
  // router.push({
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: row.processInstanceId
    }
  })
}

/** 详情操作 */
const handleDetail = (row: OaClockType) => {
  // router.push({
  push({
    name: 'OAClockDetail',
    query: {
      id: row.id
    }
  })
}

/** 初始化 **/
onMounted(() => {
  getList()
  var str = localStorage.getItem('ACCESS_TOKEN');
  console.log(str);
  var str2 = JSON.parse(str);
  console.log(str2.v);
})
</script>
