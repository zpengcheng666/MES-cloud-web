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
      <el-form-item label="申请编码" prop="applicationNumber">
        <el-input
          v-model="queryParams.applicationNumber"
          placeholder="请输入组名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="生产单元" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入组名"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="资源类型" prop="resourceType">
        <el-select v-model="queryParams.resourceType" placeholder="请选择资源类型" class="!w-240px">
          <el-option v-for="dict in getIntDictOptions('wms_material_type')"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资源编码" prop="resourceCode">
        <el-input
          v-model="queryParams.resourceCode"
          placeholder="请输入资源编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
<!--        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['mcs:receipt-record:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['mcs:receipt-record:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="申请编码" align="center" prop="applicationNumber" />
      <el-table-column label="生产单元" align="center" prop="unitName" />
      <el-table-column label="资源类型" align="center" prop="resourceType">
        <template #default="scope">
          <DictTag :type="'wms_material_type'" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="物料类码" align="center" prop="resourceTypeCode" />
      <el-table-column label="物料批次" align="center" prop="batchNumber" />
      <el-table-column label="物料条码" align="center" prop="barCode" />
      <el-table-column label="批量" align="center" prop="batch" >
        <template #default="scope">
          <span>{{scope.row.batch?'是':'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求数量" align="center" prop="count" />
      <el-table-column label="签收人" align="center" prop="creatorName" />
      <el-table-column
        label="签收时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:receipt-record:delete']"
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
  <ReceiptRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ReceiptRecordApi, ReceiptRecordVO } from '@/api/mcs/receiptrecord'
import ReceiptRecordForm from './ReceiptRecordForm.vue'
import {getIntDictOptions} from '@/utils/dict'

/** 生产单元签收记录 列表 */
defineOptions({ name: 'ReceiptRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ReceiptRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationId: undefined,
  processingUnitId: undefined,
  resourceType: undefined,
  resourceCode: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ReceiptRecordApi.getReceiptRecordPage(queryParams)
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
    await ReceiptRecordApi.deleteReceiptRecord(id)
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
    const data = await ReceiptRecordApi.exportReceiptRecord(queryParams)
    download.excel(data, '生产单元签收记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
