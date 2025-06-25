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
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          :row-key="getRowKeys"
        >
          <el-table-column type="selection" width="55" label="选择" :reserve-selection="true"/>
          <el-table-column label="项目编码" align="center" prop="projectCode" />
          <el-table-column label="项目名称" align="center" prop="projectName" />
          <el-table-column label="项目预算(万元)" align="center" prop="budget" />
          <!--<el-table-column label="项目简述" align="center" prop="description" />-->
          <!--<el-table-column label="操作" align="center" width="80px">-->
            <!--<template #default="scope">-->
              <!--<el-button-->
                <!--link-->
                <!--type="primary"-->
                <!--@click="openTotal(scope.row)"-->
              <!--&gt;-->
                <!--总计-->
              <!--</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
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
      <!--<PurchaseDetail ref="purchaseDetailRef" :project-id="currentRow?.id" @refresh="refreshPlanItemMaterial"/>-->
      <MaterialPurchase ref="materialPurchaseRef" @success="getList"/>
    </el-col>

  </el-row>
</template>

<script setup lang="ts">
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
  import { dateFormatter } from '@/utils/formatTime'
  import download from '@/utils/download'
  import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
  import Production from './components/Production.vue'
  import Inventory from './components/Inventory.vue'
  import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
  import PurchaseDetail from './components/PurchaseDetail.vue'
  import MaterialPurchase from './components/MaterialPurchase.vue'

  /** pms 物料采购计划 */
  defineOptions({ name: 'MaterialPurchasePlan' })

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化

  /** 子表 */
  const subTabsName = ref('PurchaseDatail')

  const loading = ref(true) // 列表的加载中
  const list = ref<ApprovalVO[]>([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const purchaseDetailRef = ref()
  const materialPurchaseRef = ref()
  // const planItemMaterial = ref<any[]>([])//物料采购计划列表(旧)
  const materialPurchase = ref<any[]>([])//物料采购计划列表(新)
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    projectCode: undefined,
    projectName: undefined,
    projectType: 2,
    status:2,
    projectStatusList:[],
    createTime: [],
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      // const data = await ApprovalApi.getApprovalPage(queryParams)
      // const data = await MaterialPurchaseApi.getApprovalPageWithPass(queryParams);
      queryParams.projectStatusList = [3,4,5];
      const data = await MaterialPurchaseApi.getApprovalPageByStatus(queryParams);
      // const data = await ApprovalApi.getApprovalPage(queryParams)
      list.value = data.list
      total.value = data.total
      const projectIds =list.value.map(item=>{
        return item.id
        // return item.projectCode
      })

      // planItemMaterial.value = await MaterialPurchaseApi.getMaterial(projectIds);

      materialPurchase.value = await MaterialPurchaseApi.getPurchaseResourceByProjectIds(projectIds);
      nextTick(()=>{
        materialPurchaseRef.value.setList(materialPurchase.value);
        // purchaseDetailRef.value.setList(planItemMaterial.value)
      })

    } finally {
      loading.value = false
    }
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    queryParams.projectType = 2
    getList()
  }

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value.resetFields()
    handleQuery()
  }

  const getRowKeys = (row) => {
    return row.id
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
    if(row){
      currentRow.value = row
    }
  }

  /**
   * 左侧项目选中
   */
const handleSelectionChange = (rows)=>{
  console.log(rows);
  const ids = rows.map(item=>{
    return item.id;
  })
  getMaterialPurchase(ids);

}
/**
 * 通过项目id查找要采购的物资
 */
const getMaterialPurchase = async (ids)=>{
  materialPurchase.value = await MaterialPurchaseApi.getPurchaseResourceByProjectIds(ids);
  materialPurchaseRef.value.setList(materialPurchase.value);
}
const refreshPlanItemMaterial= async ()=>{
  await getList();
  // await handleCurrentChange(currentRow.value)
}

  /** 初始化 **/
  onMounted(() => {
    getList()
  })

</script>
