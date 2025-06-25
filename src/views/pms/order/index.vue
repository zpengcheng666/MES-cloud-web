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
      <el-form-item label="项目编号" prop="projectId">
        <el-select
          v-model="queryParams.projectId"
          placeholder="请选择项目编号"
          clearable
          filterable
          class="!w-240px"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="合同id" prop="contractId">-->
        <!--<el-select-->
          <!--v-model="queryParams.contractId"-->
          <!--placeholder="请选择合同id"-->
          <!--clearable-->
          <!--filterable-->
          <!--class="!w-240px"-->
        <!--&gt;-->
          <!--<el-option-->
            <!--v-for="item in contractList"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.id"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['pms:order:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['pms:order:export']"
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
      <!--<el-table-column type="expand">-->
        <!--<template #default="scope">-->
          <!--<el-tabs model-value="orderList">-->
            <!--<el-tab-pane label="项目订单表子" name="orderList">-->
              <!--<OrderListList :project-order-id="scope.row.id" />-->
            <!--</el-tab-pane>-->
          <!--</el-tabs>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="订单id" align="center" prop="id" />-->
      <!--<el-table-column label="项目编号" align="center" prop="projectId" />-->
      <!--<el-table-column label="项目编号" align="center" prop="projectName" />-->
      <!--<el-table-column label="合同id" align="center" prop="contractId" />-->
      <!--<el-table-column label="合同编码" align="center" prop="contractName" />-->
      <!--<el-table-column label="销售订单" align="center" prop="orderId" />-->
      <!--<el-table-column label="订单编码" align="center" prop="orderCode" />-->
      <!--<el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="项目编码" align="center" prop="projectCode" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <!--<el-table-column label="项目id" align="center" prop="projectId" />-->
      <el-table-column label="物料牌号" align="center" prop="materialNumber" />
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="工件名称" align="center" prop="partName" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="加工状态" align="center" prop="processCondition" />
      <el-table-column label="带料加工" align="center" prop="processType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_PROCESS_TYPE" :value="scope.row.processType" />
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ORDER_STATUS" :value="scope.row.orderStatus" />
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="orderType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PMS_ORDER_TYPE" :value="scope.row.orderType" />
        </template>
      </el-table-column>
      <el-table-column
        label="原料交付时间"
        align="center"
        prop="materialDeliveryTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="成品交付时间"
        align="center"
        prop="fproDeliveryTime"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="160px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            :disabled = "scope.row.projectId!=undefined"
            @click="handleOrder(scope.row)"
            v-hasPermi="['pms:order:update']"
          >
            处理订单
          </el-button>
          <el-button
            link
            type="primary"
            :disabled = "scope.row.orderStatus != 0"
            @click="unbind(scope.row.id)"
            v-hasPermi="['pms:order:update']"
          >
            项目解绑
          </el-button>
          <!--<el-button-->
            <!--link-->
            <!--type="primary"-->
            <!--:disabled = "scope.row.orderStatus!=0"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--@click="openForm('update', scope.row.id)"-->
            <!--v-hasPermi="['pms:order:update']"-->
          <!--&gt;-->
            <!--处理订单-->
          <!--</el-button>-->
          <!--<el-button-->
            <!--link-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.row.id)"-->
            <!--v-hasPermi="['pms:order:delete']"-->
          <!--&gt;-->
            <!--删除-->
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

  <!-- 表单弹窗：添加/修改 -->
  <OrderForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import download from '@/utils/download'
import { OrderApi, OrderVO } from '@/api/pms/order'
import OrderForm from './OrderForm.vue'
import OrderListList from './components/OrderListList.vue'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import { DICT_TYPE } from '@/utils/dict'
import { useTagsViewStore } from '@/store/modules/tagsView'
const { push, currentRoute } = useRouter() // 路由
const { query } = useRoute()
const { delView } = useTagsViewStore() // 视图操作

/** 项目订单 列表 */
defineOptions({ name: 'PmsOrder' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const projectList = ref([])//项目列表
// const contractList = ref([])//合同列表

const loading = ref(true) // 列表的加载中
const list = ref<OrderVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectId: undefined,
  contractId: undefined,
  orderId: undefined,
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OrderApi.getOrderPage(queryParams)
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
    await OrderApi.deleteOrder(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const unbind = async (id) =>{
  try {
    await message.confirm('确认解绑项目吗,解绑后订单需要重新选择项目')
    // 发起删除
    // await OrderApi.deleteOrder(id)
    await OrderApi.unbind(id);
    message.success(t('解绑成功'))
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
    const data = await OrderApi.exportOrder(queryParams)
    download.excel(data, '项目订单.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const handleOrder = (row)=>{
  // 关闭当前 Tab
  delView(unref(currentRoute))
  push({
      name:'HandleOrder',
      query:{
        id:row.id
      }
    },

  )
}

/** 初始化 **/
onMounted(async () => {
  projectList.value =  await ApprovalApi.getApprovalAll()
  // contractList.value = await ApprovalApi.getContractListAll()
  getList()
})
</script>
