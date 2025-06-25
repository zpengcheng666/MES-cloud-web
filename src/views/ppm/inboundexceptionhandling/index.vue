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

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_EXCEPTION_HANDLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="consignmentType">
        <el-select
          v-model="queryParams.consignmentType"
          placeholder="请选择类型"
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
      <el-form-item label="处理结果 " prop="rusultType">
        <el-select
          v-model="queryParams.rusultType"
          placeholder="请选择处理结果 "
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PPM_EXCEPTION_HANDLE_RESULT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型" prop="exceptionType">
        <el-select
          v-model="queryParams.exceptionType"
          placeholder="请选择异常类型"
          clearable
          class="!w-240px"
        >
          <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PPM_EXCEPTION_REASON)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <!--<el-button-->
          <!--type="primary"-->
          <!--plain-->
          <!--@click="openForm('create')"-->
          <!--v-hasPermi="['ppm:inbound-exception-handling:create']"-->
        <!--&gt;-->
          <!--<Icon icon="ep:plus" class="mr-5px" /> 新增-->
        <!--</el-button>-->
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['ppm:inbound-exception-handling:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="入库单号" align="center" prop="no" />
      <el-table-column label="应收数量" align="center" prop="consignedAmount" />
      <el-table-column label="实收数量" align="center" prop="signedAmount" />
      <el-table-column label="收货人" align="center" prop="creator" />
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="物料类型ID" align="center" prop="materialConfigId" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_EXCEPTION_HANDLE_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="consignmentType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_TYPE" :value="scope.row.consignmentType" />
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="rusultType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_EXCEPTION_HANDLE_RESULT" :value="scope.row.rusultType" />
        </template>
      </el-table-column>
      <el-table-column label="异常类型" align="center" prop="exceptionType" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PPM_EXCEPTION_REASON" :value="scope.row.exceptionType" />
        </template>
      </el-table-column>
      <el-table-column label="合同" align="center" prop="contractName" />
      <el-table-column label="项目" align="center" prop="projectName" />
      <el-table-column label="公司" align="center" prop="companyName" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            v-if=" scope.row.status === 0"
            type="primary"
            @click="inbound(scope.row.id)"
            v-hasPermi="['ppm:inbound-exception-handling:delete']"
          >
            入库
          </el-button>
          <el-button
                  link
                  v-if=" scope.row.status === 0"
                  type="danger"
                  @click="returnSheet(scope.row.id)"
                  v-hasPermi="['ppm:inbound-exception-handling:delete']"
          >
            退货
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
  <InboundExceptionHandlingForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { InboundExceptionHandlingApi, InboundExceptionHandlingVO } from '@/api/ppm/inboundexceptionhandling'
import InboundExceptionHandlingForm from './InboundExceptionHandlingForm.vue'

/** 入库异常处理 列表 */
defineOptions({ name: 'InboundExceptionHandling' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InboundExceptionHandlingVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  no: undefined,
  createTime: [],
  status: undefined,
  consignmentType: undefined,
  rusultType: undefined,
  exceptionType: undefined,
  contratcId: undefined,
  projectId: undefined,
  companyId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InboundExceptionHandlingApi.getInboundExceptionHandlingPage(queryParams)
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
const inbound = async (id: number) => {
  try {
    // 删除的二次确认
      await message.confirm('是否入库？')
    // 发起删除
    await InboundExceptionHandlingApi.inbound(id)
    message.success('确认成功')
    // 刷新列表
    await getList()
  } catch {}
}



const returnSheet = async (id: number) => {
    try {
        // 删除的二次确认
        await message.confirm('是否退货？')
        // 发起删除
        await InboundExceptionHandlingApi.returnSheet(id)
        message.success('确认成功')
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
    const data = await InboundExceptionHandlingApi.exportInboundExceptionHandling(queryParams)
    download.excel(data, '入库异常处理.xls')
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