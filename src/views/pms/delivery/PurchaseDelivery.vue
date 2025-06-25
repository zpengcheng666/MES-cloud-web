<template>

  <el-row :gutter="20">
    <el-col :span="8">
      <ContentWrap>
        <!-- 搜索工作栏 -->
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
          style="margin-bottom: 20px"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="queryParams.projectName"
              placeholder="请输入项目名称"
              clearable
              @keyup.enter="handleQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <!-- 列表 -->
      <ContentWrap>
        <el-table
          v-loading="loading"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="true"
          highlight-current-row
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="selection" width="55" label="选择" :reserve-selection="true"/>
          <el-table-column label="项目编码" align="center" prop="projectCode" />
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <el-table-column label="项目预算(万元)" align="center" prop="budget" />
          <el-table-column label="项目简述" align="center" prop="description" />
        </el-table>
        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </ContentWrap>
    </el-col>
    <el-col :span="16">
      <!-- 子表的列表 -->
      <ContentWrap >
        <el-tabs v-model="subTabsName">
          <el-tab-pane label="采购交付" name="deliveryList">
            <PurchaseDeliveryList ref="deliveryListRef" :project-id="currentRow?.id" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-col>

  </el-row>



</template>

<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import PurchaseDeliveryList from './components/PurchaseDeliveryList.vue'
import { DeliveryApi } from '@/api/pms/delivery'

/** pms 项目交付 采购 */
defineOptions({ name: 'PurchaseDelivery' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<ApprovalVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectCode: undefined,
  projectName: undefined,
  status:2,
  projectStatusList:[3,4,5],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
const projectTypeShow = ref(1)//项目类型,1采购,2销售
/** 子表 */
const subTabsName = ref('deliveryList')
const deliveryListRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApprovalApi.getApprovalPage(queryParams)

    // list.value = data.list.filter((item)=>{
    //   return item.projectType === projectTypeShow.value;
    // })
    list.value = data.list;
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  queryParams.pageSize = 10
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
    const data = await ApprovalApi.exportApproval(queryParams)
    download.excel(data, 'pms 立项表,项目立项相关.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 选中行操作 */
const currentRow = ref({}) // 选中行
const handleCurrentChange = (row) => {
  currentRow.value = row
}

/**
 * 左侧项目选中
 */
const handleSelectionChange = (rows)=>{
  const ids = rows.map(item=>{
    return item.id;
  })
  getPurchase(ids);
}

// const getPurchase = async (ids)=>{
//   //获取该项目所有发货单
//   const data =await DeliveryApi.getShippingDetailByProjectId(ids);
//   const returnList = data.filter((item)=>{
//     return item.shippingType === "3"
//   })
//   deliveryListRef.value.setReturnList(returnList)
//   //获取退货单
//   const data2 =await DeliveryApi.getPurchaseConsignmentByProjectId(ids);
//   const purchaseList = data2.filter((item)=>{
//     return item.consignmentType === 1
//   })
//   deliveryListRef.value.setPurchaseList(purchaseList);
//   //const data2 = await DeliveryApi.getShippingReturnDetailByProjectId(ids);
// }
const getPurchase = async (ids)=>{
  const data =await DeliveryApi.getPurchaseByProjectId(ids);
  deliveryListRef.value.setReturnList(data)
  deliveryListRef.value.setPurchaseList(data);
}

const getRowKeys = (row) => {
  return row.id
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
