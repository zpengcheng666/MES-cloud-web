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
          <el-table-column type="selection" width="30" label="选择" :reserve-selection="true"/>
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
        <el-tabs v-model="subTabsName" @tab-click="handleClick">
          <el-tab-pane label="项目生产" name="Production">
            <Production ref="productionRef"/>
          </el-tab-pane>
          <el-tab-pane label="项目库存" name="Inventory">
            <Inventory ref="inventoryRef" :project-id="currentRow?.id||firstProjectId" />
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
import PurchaseDetail from './components/PurchaseDetail.vue'
import Production from './components/Production.vue'
import Inventory from './components/Inventory.vue'
import { ExcuteApi } from '@/api/pms/excute'

/** pms 项目交付 */
defineOptions({ name: 'ProductAndInventory' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

/** 子表 */
const subTabsName = ref('Production')
const productionRef = ref()
const inventoryRef = ref()

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

const firstProjectId = ref('')
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ApprovalApi.getApprovalPage(queryParams)
    list.value = data.list
    firstProjectId.value = list.value[0].id;
    const projectIds =list.value.map(item=>{
      return item.id
    })

    //产品库存
    // const materialList = await ExcuteApi.getMaterialList(projectIds);
    const materialList = await ExcuteApi.getMaterialListByProjectIds(projectIds);
    const projectCodes =list.value.map(item=>{
      return item.projectCode
    })
    //进度
    const productProgressList = await ExcuteApi.getProductProgress(projectCodes);
    nextTick(()=>{
      productionRef.value.setList(productProgressList)
      inventoryRef.value.setList(materialList);
    })
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
const handleCurrentChange = async (row) => {
  if(row){
    currentRow.value = row
    const productProgressList = await ExcuteApi.getProductProgress([row.projectCode]);
    productionRef.value.setList(productProgressList)
    const materialList = await ExcuteApi.getMaterialListByProjectIds([row.id]);
    inventoryRef.value.setList(materialList);
  }
}
const handleClick = (tab,event)=>{
  console.log(tab, event)
}
const getRowKeys = (row) => {
  return row.id
}
/**
 * 左侧项目选中
 */
const handleSelectionChange = (rows)=>{
  const ids = rows.map(item=>{
    return item.id;
  })
  getProcessAndInventory(rows);
}
const getProcessAndInventory = async (rows)=>{
  const ids = rows.map(item=>{
    return item.id;
  })
  const codes = rows.map(item=>{
    return item.projectCode;
  })
  const productProgressList = await ExcuteApi.getProductProgress(codes);
  const materialList = await ExcuteApi.getMaterialListByProjectIds(ids);
  productionRef.value.setList(productProgressList)
  inventoryRef.value.setList(materialList);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
