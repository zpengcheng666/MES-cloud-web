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
      <el-form-item label="退货单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入退货单名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="退货单" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入退货单"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="状态" prop="shippingStatus">
        <el-select
                v-model="queryParams.shippingStatus"
                placeholder="请选择状态"
                clearable
                class="!w-240px"
        >
          <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SHIPPING_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['dm:shipping-instorage-return:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['dm:shipping-instorage-return:export']"
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
          <el-tabs model-value="shippingInstorageReturnDetail">
            <el-tab-pane label="销售订单退货明细" name="shippingInstorageReturnDetail">
              <ShippingInstorageReturnDetailList :shipping-storage-return-id="scope.row.id" />
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-table-column>
      <el-table-column label="退货单名称" align="center" prop="name" />
      <el-table-column label="退货单" align="center" prop="no" />
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
      <el-table-column label="状态" align="center" width="160" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SHIPPING_STATUS" :value="scope.row.shippingStatus"/>
        </template>
      </el-table-column>
      <el-table-column
              label="创建日期"
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
                  v-hasPermi="['dm:shipping-instorage-return:update']"
          >
            编辑
          </el-button>
          <!--  未提交过的可提交审核-->
          <el-button
                  v-if="scope.row.status === 0"
                  v-hasPermi="['dm:shipping-instorage-return:create']"
                  link
                  type="primary"
                  @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>

          <!--  审批不通过可修改重新提交审核-->
          <el-button
                  v-if="scope.row.status === 3"
                  v-hasPermi="['dm:shipping-instorage-return:create']"
                  link
                  type="warning"
                  @click="handleSubmit(scope.row)"
          >
            重新提交审核
          </el-button>

          <!--  审批通过后库出库确认数量-->
          <!--<el-button-->
          <!--v-if="scope.row.shippingStatus === 2"-->
          <!--v-hasPermi="['dm:shipping:create']"-->
          <!--link-->
          <!--type="primary"-->
          <!--@click="openForm('update', scope.row.id,2)"-->
          <!--&gt;-->
          <!--出库-->
          <!--</el-button>-->



          <!--  只要没有出库都可作废-->
          <el-button
                  v-if="scope.row.shippingStatus <3 || scope.row.shippingStatus  ===8"
                  v-hasPermi="['dm:shipping-instorage-return:create']"
                  link
                  type="warning"
                  @click="handleCancelDm(scope.row.id)"
          >
            作废
          </el-button>


          <!--  出库完成后  填写发货信息 确认发货数量-->
          <el-button
                  v-if="scope.row.shippingStatus === 2"
                  v-hasPermi="['dm:shipping-instorage-return:create']"
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id,2)"
          >
            出库确认
          </el-button>


          <el-button
                  v-if="scope.row.shippingStatus === 1"
                  v-hasPermi="['dm:shipping-instorage-return:create']"
                  link
                  type="primary"
                  @click="handleProcessDetail(scope.row)"
          >
            审批进度
          </el-button>


          <el-button
                  v-if="scope.row.shippingStatus === 4"
                  link
                  type="primary"
                  @click="openForm('update', scope.row.id,4)"
                  v-hasPermi="['dm:shipping-instorage-return:update']"
          >
            发货确认
          </el-button>


          <el-button
                  v-if="scope.row.status === 0 "
                  link
                  type="danger"
                  @click="handleDelete(scope.row.id)"
                  v-hasPermi="['dm:shipping-instorage-return:delete']"
          >
            删除
          </el-button>



          <el-button
                  v-hasPermi="['dm:shipping-instorage-return:update']"
                  link
                  type="success"
                  @click="openDetail('detail', scope.row.id)"
          >
            详情
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
  <ShippingInstorageReturnForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ShippingInstorageReturnApi, ShippingInstorageReturnVO } from '@/api/dm/shippinginstoragereturn'
import ShippingInstorageReturnForm from './ShippingInstorageReturnForm.vue'
import ShippingInstorageReturnDetailList from './components/ShippingInstorageReturnDetailList.vue'
import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
/** 销售订单退货退货 列表 */
defineOptions({ name: 'ShippingInstorageReturn' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ShippingInstorageReturnVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  no: undefined,
  contractId: undefined,
  companyId: undefined,
  projectId: undefined,
  createTime: [],
  status: undefined,
  processInstanceId: undefined,
  fileUrl: undefined,
  shippingInstorageReturnStatus: undefined,
  consigner: undefined,
  consignerDate: [],
  consignedBy: undefined,
  consignedDate: [],
  consignedContact: undefined,
  returnType: undefined,
  returnReason: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ShippingInstorageReturnApi.getShippingInstorageReturnPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const {push} = useRouter()
/** 提交审核 **/
const handleSubmit = async (row: ShippingVO) => {
    await message.confirm(`您确定提交【${row.no}】审核吗？`)
    await ShippingInstorageReturnApi.submitShipping(row.id)
    message.success('提交审核成功！')
    await getList()
}


/** 作废按钮操作 */
const handleCancelDm = async (id: string) => {
    try {
        // 删除的二次确认
        await message.delConfirm()
        // 发起删除
        await ShippingInstorageReturnApi.cancelShipping(id)
        message.success(t('common.delSuccess'))
        // 刷新列表
        await getList()
    } catch {
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
const openForm = (type: string, id?: number,shippingStatus?:number) => {
  formRef.value.open(type, id,shippingStatus)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ShippingInstorageReturnApi.deleteShippingInstorageReturn(id)
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
    const data = await ShippingInstorageReturnApi.exportShippingInstorageReturn(queryParams)
    download.excel(data, '销售订单退货退货.xls')
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