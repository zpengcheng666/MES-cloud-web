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
      <el-form-item label="申请人部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入申请人部门"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="applicant">
        <el-input
          v-model="queryParams.applicant"
          placeholder="请输入申请人"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="申请部门领导" prop="leader">
        <el-input
          v-model="queryParams.leader"
          placeholder="请输入申请部门领导"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="仓库管理员" prop="warehouseman">
        <el-input
          v-model="queryParams.warehouseman"
          placeholder="请输入仓库管理员"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="申请原因" prop="reason">
        <el-input
          v-model="queryParams.reason"
          placeholder="请输入申请原因"
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
          物品领用
        </el-button>
        <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--@click="handleExport"-->
          <!--:loading="exportLoading"-->
          <!--v-hasPermi="['bpm:oa-supply:export']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:download" class="mr-5px" /> 导出-->
        <!--</el-button>-->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="请假表单主键" align="center" prop="id" />
      <el-table-column label="申请人部门" align="center" prop="dept" />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="申请部门领导" align="center" prop="leader" />
      <el-table-column label="仓库管理员" align="center" prop="warehouseman" />
      <el-table-column label="申请原因" align="center" prop="reason" />
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
            v-hasPermi="['bpm:oa-supply:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['bpm:oa-supply:query']"
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

  <!-- 表单弹窗：添加/修改 -->
  <!--<OaSupplyForm ref="formRef" @success="getList" />-->
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OaSupplyApi, OaSupplyVO,SupplyType } from '@/api/bpm/oasupply'
// import OaSupplyForm from './OaSupplyForm.vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** OA 物品领用 列表 */
defineOptions({ name: 'OaSupply' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
// const router = useRouter() // 路由
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<OaSupplyVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dept: undefined,
  applicant: undefined,
  leader: undefined,
  warehouseman: undefined,
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
    const data = await OaSupplyApi.getOaSupplyPage(queryParams)
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
    await OaSupplyApi.deleteOaSupply(id)
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
    const data = await OaSupplyApi.exportOaSupply(queryParams)
    download.excel(data, 'OA 物品领用.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
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

/** 添加操作 */
const handleCreate = () => {
  delView(unref(currentRoute))
  push({ name: 'OASupplyCreate'})
}

/** 详情操作 */
const handleDetail = (row: SupplyType) => {
  push({
    name: 'OASupplyDetail',
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
