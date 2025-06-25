<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >

      <el-form-item label="收货单类型" prop="consignmentType">
        <el-select
          v-model="queryParams.consignmentType"
          placeholder="请选择收货单类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.CONSIGNMENT_TYPE)"
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
          @click="openForm('create')"
          v-hasPermi="['ppm:consignment-info:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:consignment-info:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="收货单号" align="center" prop="no" />
      <el-table-column label="收货单名" align="center" prop="name" />
      <el-table-column label="合同" align="center" prop="contractName" />
      <el-table-column label="合同编号" align="center" prop="contractCode" />
      <el-table-column label="项目" align="center" prop="projectCode" />
      <el-table-column label="项目名" align="center" prop="projectName" />
      <el-table-column label="物料类型" align="center" prop="materialNumber" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="单位" align="center" prop="materialUnit" />
      <el-table-column label="发货数量" align="center" prop="consignedAmount" />

      <el-table-column label="状态" align="center" prop="consignmentStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus" />
        </template>
      </el-table-column>
      <el-table-column label="收货单类型" align="center" prop="consignmentType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_TYPE" :value="scope.row.consignmentType" />
        </template>
      </el-table-column>

      <!--<el-table-column label="签收" align="center" prop="signedAmount">-->
        <!--<template #default="scope">-->
          <!--<el-input-number  :value="scope.row.signedAmount" v-if="scope.row.consignmentType === 1 || scope.row.consignmentType === 4 "/>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            v-if="scope.row.consignmentType === 1 || scope.row.consignmentType === 4 "
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['ppm:consignment-info:update']"
          >
            签收数量
          </el-button>
          <el-button
            link
            v-if="scope.row.consignmentType ===2 || scope.row.consignmentType === 3 || scope.row.consignmentType === 5 "
            type="primary"
            @click="openMaterial('update', scope.row.id)"
            v-hasPermi="['ppm:consignment-info:delete']"
          >
            签收条码
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
  <ConsignmentInfoForm ref="formRef" @success="getList" />
  <ConsignmentDetailChoose ref="detailRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ConsignmentInfoApi, ConsignmentInfoVO } from '@/api/ppm/consignmentinfo'
import ConsignmentInfoForm from './ConsignmentInfoForm.vue'
import ConsignmentDetailChoose from './components/ConsignmentDetailChoose.vue'

/** 收货产品 列表 */
defineOptions({ name: 'ConsignmentInfo' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ConsignmentInfoVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  consignmentId: undefined,
  contractId: undefined,
  orderId: undefined,
  materialId: undefined,
  consignedAmount: undefined,
  signedAmount: undefined,
  signedBy: undefined,
  signedTime: [],
  createTime: [],
  projectId: undefined,
  projectOrderId: undefined,
  projectPlanId: undefined,
  projectPlanItemId: undefined,
  consignmentStatus: undefined,
  consignmentType: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ConsignmentInfoApi.getConsignmentInfoPage(queryParams)
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
const detailRef = ref()
const openMaterial = (type: string, id?: number) => {
    detailRef.value.open(type, id)
}



/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ConsignmentInfoApi.deleteConsignmentInfo(id)
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
    const data = await ConsignmentInfoApi.exportConsignmentInfo(queryParams)
    download.excel(data, '收货产品.xls')
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