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
      <el-form-item label="申请码" prop="number">
        <el-input v-model="queryParams.number" placeholder="请输入申请单号" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="条码" prop="barCode">
        <el-input v-model="queryParams.barCode" placeholder="请输入条码" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions('mcs_delivery_record_status')"
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
    >
      <el-table-column label="申请码" min-width="108" align="center" prop="number" />
      <el-table-column label="配送类型" align="center" prop="type" >
        <template #default="scope">
          <dict-tag :type="'mcs_distribution_type'" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="发起单元" min-width="102" align="center" prop="unitName" />
      <el-table-column label="发起设备" min-width="102" align="center" prop="deviceName" />
      <el-table-column label="资源类码" min-width="99" align="center" prop="materialNumber" />
      <el-table-column label="资源条码" min-width="86" align="center" prop="barCode" />
      <el-table-column label="资源类型" align="center" prop="resourceType" >
        <template #default="{ row }">
          <dict-tag :type="'wms_material_type'" :value="row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="物料批次码" min-width="111" align="center" prop="batchNumber" />
      <el-table-column label="配送状态" align="center" prop="status" >
        <template #default="scope">
          <dict-Tag :type="'mcs_delivery_record_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="配送数量" align="center" prop="count" />
      <el-table-column label="任务编码" min-width="110" align="center" prop="batchRecordNumber" />
      <el-table-column label="操作" align="center" width="80px" :fixed="'right'">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 3 || scope.row.status === 5"
            link
            type="primary"
            @click="distributionRevoke(scope.row.id)"
            v-hasPermi="['mcs:batch-order:update']"
          >
            撤销
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { DistributionRecordApi, DistributionRecordVO } from '@/api/mcs/distributionrecord'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import { getIntDictOptions } from '@/utils/dict'

/** 物料配送申请 列表 */
defineOptions({ name: 'DistributionApplication' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<DistributionRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  number: undefined,
  processingUnitId: undefined,
  status: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const unitList = ref([]);

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DistributionRecordApi.getDistributionRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const distributionRevoke = async (id: number) => {
  await message.confirm("是否关闭当前配送", "撤销确认")
  const msg = await DistributionRecordApi.distributionRecordRevoke(id)
  message.success(msg);
  getList();
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
    const data = await DistributionRecordApi.exportDistributionRecord(queryParams)
    download.excel(data, '物料配送申请.xls')
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
