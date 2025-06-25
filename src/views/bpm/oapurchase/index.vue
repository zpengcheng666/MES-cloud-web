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
      <el-form-item label="部门" prop="dept">
        <el-input
          v-model="queryParams.dept"
          placeholder="请输入部门"
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
      <el-form-item label="采购人" prop="purchaseAgent">
        <el-input
          v-model="queryParams.purchaseAgent"
          placeholder="请输入采购人"
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
          发起采购
        </el-button>
        <!--<el-button-->
          <!--type="success"-->
          <!--plain-->
          <!--@click="handleExport"-->
          <!--:loading="exportLoading"-->
          <!--v-hasPermi="['bpm:oa-purchase:export']"-->
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
      <el-table-column label="部门" align="center" prop="dept" />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="采购人" align="center" prop="purchaseAgent" />
      <!--<el-table-column label="审批结果" align="center" prop="status" />-->
      <!--<el-table-column label="流程实例的编号" align="center" prop="processInstanceId" />-->
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
            v-hasPermi="['bpm:oa-purchase:query']"
            link
            type="primary"
            @click="handleDetail(scope.row)"
          >
            详情
          </el-button>
          <el-button
            v-hasPermi="['bpm:oa-purchase:query']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            进度
          </el-button>

          <!--<el-button-->
            <!--v-if="scope.row.result === 1"-->
            <!--v-hasPermi="['bpm:oa-purchase:create']"-->
            <!--link-->
            <!--type="danger"-->
            <!--@click="cancelPurchase(scope.row)"-->
          <!--&gt;-->
            <!--取消-->
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

</template>

<script setup lang="ts">
  import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { OaPurchaseApi, OaPurchaseVO,PurchaseVO } from '@/api/bpm/oapurchase'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { useTagsViewStore } from '@/store/modules/tagsView'

/** OA 采购申请 列表 */
defineOptions({ name: 'OaPurchase' })

const message = useMessage() // 消息弹窗
// const router = useRouter() // 路由
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中
const list = ref<OaPurchaseVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dept: undefined,
  applicant: undefined,
  purchaseAgent: undefined,
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
    const data = await OaPurchaseApi.getOaPurchasePage(queryParams)
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
    await OaPurchaseApi.deleteOaPurchase(id)
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
    const data = await OaPurchaseApi.exportOaPurchase(queryParams)
    download.excel(data, 'OA 采购申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 添加操作 */
const handleCreate = () => {
  // router.push({ name: 'OAPurchaseForm' })
  delView(unref(currentRoute))
  push({ name: 'OAPurchaseCreate'})
}

/** 详情操作 */
const handleDetail = (row: PurchaseVO) => {
  push({
    name: 'OAPurchaseDetail',
    query: {
      id: row.id
    }
  })
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
/** 取消请假操作 */
const cancelPurchase = async (row) => {
  // 二次确认
  const { value } = await ElMessageBox.prompt('请输入取消原因', '取消流程', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    inputPattern: /^[\s\S]*.*\S[\s\S]*$/, // 判断非空，且非空格
    inputErrorMessage: '取消原因不能为空'
  })
  // 发起取消
  await ProcessInstanceApi.cancelProcessInstanceByStartUser(row.id, value)
  message.success('取消成功')
  // 刷新列表
  await getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
