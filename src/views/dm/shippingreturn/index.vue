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
      <el-form-item label="合同" prop="contractId">

        <el-select
          v-model="queryParams.contractId"
          clearable
          filterable
          placeholder="请选择合同"
          class="!w-240px"
        >
          <el-option
            v-for="item in contractList"
            :key="item.id"
            :label="item.number"
            :value="item.id"
          />
        </el-select>

        <!--<el-input-->
          <!--v-model="queryParams.contractId"-->
          <!--placeholder="请选择合同"-->
          <!--clearable-->
          <!--@keyup.enter="handleQuery"-->
          <!--class="!w-240px"-->
        <!--/>-->
      </el-form-item>

      <el-form-item label="收货日期" prop="consignedDate">
        <el-date-picker
          v-model="queryParams.consignedDate"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="处理方式" prop="returnType">
        <el-select
          v-model="queryParams.returnType"
          placeholder="请选择处理方式"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.RETURN_TYPE)"
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
          @click="openForm('create',undefined,0)"
          v-hasPermi="['dm:shipping-return:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dm:shipping-return:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- 子表的列表 -->
      <el-table-column type="expand">
        <template #default="scope">
          <el-tabs model-value="shippingReturnDetail">
            <el-tab-pane label="销售退货单详情" name="shippingReturnDetail">
              <ShippingReturnDetailList :shipping-return-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <!--<el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="退货单" align="center" prop="no"   width="150"/>
      <el-table-column label="退货单名称" align="center" prop="name"  width="120"/>
      <el-table-column label="项目" align="center" prop="projectName"  width="120"/>
      <el-table-column label="合同号" align="center" prop="contractNo"   width="120"/>
      <el-table-column label="合作方" align="center" prop="companyName" width="180"/>

      <el-table-column label="处理方式" align="center" prop="returnType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.RETURN_TYPE" :value="scope.row.returnType" />
        </template>
      </el-table-column>
      <el-table-column label="退换货原因" align="center" prop="returnReason"  width="200px"/>
      <el-table-column label="审批状态" align="center" prop="status" width="100" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DM_AUDIT_STATUS" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="退货状态" align="center" prop="consignmentStatus"  width="100">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.CONSIGNMENT_STATUS" :value="scope.row.consignmentStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="退货人" align="center" prop="consigner" />
      <el-table-column
        label="退货日期"
        align="center"
        prop="consignerDate"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="接收人" align="center" prop="consignedBy" />
      <el-table-column
        label="收货日期"
        align="center"
        prop="consignedDate"
        :formatter="dateFormatter"
        width="180px"
      />


      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="300">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="primary"
            @click="openForm('update', scope.row.id,0)"
            v-hasPermi="['dm:shipping-return:update']"
          >
            编辑
          </el-button>


          <el-button
            link
            type="success"
            @click="openDetail('detail', scope.row.id)">
            详情
          </el-button>

          <el-button
            v-if="scope.row.status === 0"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>


          <el-button
                  v-if="scope.row.status === 3"
                  v-hasPermi="['dm:shipping:create']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>



          <el-button
            v-if="scope.row.consignmentStatus === 1"
            v-hasPermi="['dm:shipping:create']"
            link
            type="primary"
            @click="handleProcessDetail(scope.row)"
          >
            审批进度
          </el-button>


          <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 3"
                  link
                  type="danger"
                  @click="handleCancel(scope.row.id)"
                  v-hasPermi="['dm:shipping-return:delete']"
          >
            作废
          </el-button>


          <!--  出库完成后  填写发货信息 确认发货数量-->
          <!--<el-button-->
            <!--v-if="scope.row.consignmentStatus === 2"-->
            <!--v-hasPermi="['dm:shipping:create']"-->
            <!--link-->
            <!--type="primary"-->
            <!--@click="openForm('update', scope.row.id,2)"-->
          <!--&gt;-->
            <!--签收-->
          <!--</el-button>-->


          <el-button
                  v-if="scope.row.status === 0 || scope.row.status === 3"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['dm:shipping-return:delete']"
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
  <ShippingReturnForm ref="formRef" @success="getList" />
  <ShippingReturnInfo ref="detailRef" @success="getList"/>
</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ShippingReturnApi, ShippingReturnVO } from '@/api/dm/shippingreturn'
import ShippingReturnForm from './ShippingReturnForm.vue'
import ShippingReturnInfo from './ShippingReturnInfo.vue'
import ShippingReturnDetailList from './components/ShippingReturnDetailList.vue'
import {ContractApi} from '@/api/ppm/contract'
/** 销售退货单 列表 */
defineOptions({ name: 'ShippingReturn' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ShippingReturnVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shippingId: undefined,
  contractId: undefined,
  consigner: undefined,
  consignerDate: [],
  consignedBy: undefined,
  consignedDate: [],
  consignedContact: undefined,
  returnType: undefined,
  returnReason: undefined,
  processInstanceId: undefined,
  status: undefined,
  consignmentStatus: undefined,
  fileUrl: undefined,
  remark: undefined,
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShippingReturnApi.getShippingReturnPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}
const {push} = useRouter()
/** 提交审核 **/
const handleSubmit = async (row: ShippingReturnVO) => {
  await message.confirm(`您确定提交【${row.no}】审核吗？`)
  await ShippingReturnApi.submitShippingReturn(row.id)
  message.success('提交审核成功！')
  await getList()
}



/** 详情操作 */
const detailRef = ref()
const openDetail = (type: string, id
  ? : number
) =>
{
  detailRef.value.open(type, id)
}


/** 查看审批 */
const handleProcessDetail = (row: ShippingReturnVO) => {
  push({name: 'BpmProcessInstanceDetail', query: {id: row.processInstanceId}})
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
const openForm = (type: string, id?: number,shippingReturnStatus?:number) => {
  formRef.value.open(type, id,shippingReturnStatus)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ShippingReturnApi.deleteShippingReturn(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 作废按钮操作 */
const handleCancel = async (id: number) => {
    try {
        // 删除的二次确认
        await message.delConfirm()
        // 发起删除
        await ShippingReturnApi.cancelShippingReturn(id)
        message.success('作废成功')
        // 刷新列表
        await getList()
    } catch {}
}





const getContract = async ()=>{
  // 加载合同列表
  contractList.value = await
    ContractApi.getContractListByType(2)
}


/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await ShippingReturnApi.exportShippingReturn(queryParams)
    download.excel(data, '销售退货单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
  getContract()
})
</script>
