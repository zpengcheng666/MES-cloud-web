<template>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="distributionRecord">
            <el-tab-pane label="" name="distributionRecord">
              <DistributionRecordList :application-id="scope.row.id" :showOperation="false" />
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

const props = defineProps<{
  id: String
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (props.id) {
      queryParams.id = props.id
    }
    const data = await DistributionApplicationApi.getDistributionApplicationPage(queryParams)
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

const getUnitList = async () => {
  unitList.value = await DistributionApplicationApi.getUnitList();
}

/** 初始化 **/
onMounted(() => {
  getList()
  getUnitList()
})
</script>
