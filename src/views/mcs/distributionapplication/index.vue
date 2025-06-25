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
      <el-form-item label="申请单号" prop="applicationNumber">
        <el-input v-model="queryParams.applicationNumber" placeholder="请输入申请单号" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="申请单元" prop="processingUnitId">
        <el-select
          v-model="queryParams.processingUnitId"
          placeholder="请选择申请单元"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in unitList"
            :key="item.id"
            :label="item.unitName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择申请状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_distribution_status')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openPreForm()"
          v-hasPermi="['mcs:distribution-application:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:distribution-application:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="distributionRecord">
            <el-tab-pane label="" name="distributionRecord">
              <DistributionRecordList :application-id="scope.row.id" :showOperation="true" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="申请单号" align="center" prop="applicationNumber" />
      <el-table-column label="申请单元" align="center" prop="unitName" />
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="任务编码" align="center" prop="batchRecordNumber" />
      <el-table-column label="申请状态" align="center" prop="status" >
        <template #default="{ row }">
          <dict-tag :type="'mcs_distribution_application'" :value="row.status" />
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="creatorName" />
      <el-table-column
        label="申请时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="submitApplication(scope.row)"
            v-hasPermi="['mcs:distribution-application:update']"
            v-if="scope.row.status === 0"
          >
            提交
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:distribution-application:delete']"
            v-if="scope.row.status === 0 || scope.row.status === 3 || scope.row.status === 4"
          >
            删除
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
  <DistributionApplicationPreForm ref="formPreRef" @success="openForm" />
  <DistributionApplicationForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DistributionApplicationApi, DistributionApplicationVO } from '@/api/mcs/distributionapplication'
import DistributionApplicationPreForm from './DistributionApplicationPreForm.vue'
import DistributionApplicationForm from './DistributionApplicationForm.vue'
import DistributionRecordList from './components/DistributionRecordList.vue'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import { getIntDictOptions } from '@/utils/dict'

/** 物料配送申请 列表 */
defineOptions({ name: 'DistributionApplication' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DistributionApplicationVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationNumber: undefined,
  processingUnitId: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const unitList = ref([]);
const expandKey = ref([]);

const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) expandKey.value = [row.id];
  else expandKey.value = [];
}

const reloadExpand = () => {
  if (expandKey.value && expandKey.value.length > 0) {
    const er = expandKey.value;
    expandKey.value = [];
    setTimeout(()=>{expandKey.value = er},400)
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DistributionApplicationApi.getDistributionApplicationPage(queryParams)
    list.value = data.list
    total.value = data.total
    reloadExpand()
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
const formPreRef = ref()
const openPreForm = () => {
  formPreRef.value.open()
}
const formRef = ref()
const openForm = (data: any) => {
  formRef.value.open(data)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DistributionApplicationApi.deleteDistributionApplication(id)
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
    const data = await DistributionApplicationApi.exportDistributionApplication(queryParams)
    download.excel(data, '物料配送申请.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const submitApplication = async (row: any) => {
  await message.confirm('确认提交申请', '配送申请')
  const msg = await DistributionApplicationApi.submitApplication(row.id)
  message.success(msg)
  // 刷新列表
  await getList()
}

const getUnitList = async () => {
  unitList.value = await DistributionApplicationApi.getUnitList();
}

/** 初始化 **/
onMounted(() => {
  getList()
  getUnitList()
})
</script>
