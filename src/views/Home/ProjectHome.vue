<template>

  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['pms:approval:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>项目进度</span>
        </div>
      </template>
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center">
          <el-table :data="projectShowList" :stripe="true" :show-overflow-tooltip="true" height="300px">
            <el-table-column label="项目名称" align="center" prop="projectName" />
            <el-table-column label="项目编码" align="center" prop="projectCode" />
            <el-table-column label="工艺进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :class="{ 'warning-border': row.schemeProcess < 100 }" :percentage="row.schemeProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': compareScheme(row) }" :percentage="row.schemeProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="工艺截止"
              align="center"
              prop="schemeTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <el-table-column label="采购进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :percentage="row.purchaseProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': comparePurchase(row) }" :percentage="row.purchaseProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="采购截止"
              align="center"
              prop="purchaseTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <el-table-column label="生产进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :percentage="row.productionProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': compareProduct(row) }" :percentage="row.productionProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="生产截止"
              align="center"
              prop="productionTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <!--<el-table-column-->
            <!--label="计划交付"-->
            <!--align="center"-->
            <!--prop="deliveryTime"-->
            <!--:formatter="dateFormatter2"-->
            <!--min-width="120px"-->
            <!--/>-->
          </el-table>
        </div>
        <el-divider />
      </el-skeleton>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['pms:approval:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.orderProcess') }}</span>
          <!--<el-link type="primary" :underline="false" @click="handleAudit2">{{ t('action.more') }}</el-link>-->
        </div>
      </template>
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center">
          <el-table :data="orderShowList" :stripe="true" :show-overflow-tooltip="true" height="300px">
            <el-table-column label="项目编码" align="center" prop="projectCode" />
            <el-table-column label="零件图号" align="center" prop="partNumber" />
            <el-table-column label="工艺进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :percentage="row.schemeProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': compareScheme(row) }" :percentage="row.schemeProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="工艺截止"
              align="center"
              prop="schemeTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <el-table-column label="采购进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :percentage="row.purchaseProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': comparePurchase(row) }" :percentage="row.purchaseProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="采购截止"
              align="center"
              prop="purchaseTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <el-table-column label="生产进度" align="center" min-width="100px">
              <template #default="{row}">
                <!--<el-progress :percentage="row.productionProcess" :stroke-width="20" text-inside :color="customColors" />-->
                <el-progress :class="{ 'warning-border': compareProduct(row) }" :percentage="row.productionProcess" :stroke-width="20" text-inside :color="customColors" />
              </template>
            </el-table-column>
            <el-table-column
              label="生产截止"
              align="center"
              prop="productionTime"
              :formatter="dateFormatter2"
              min-width="120px"
            />
            <!--<el-table-column-->
            <!--label="计划交付"-->
            <!--align="center"-->
            <!--prop="deliveryTime"-->
            <!--:formatter="dateFormatter2"-->
            <!--min-width="120px"-->
            <!--/>-->
          </el-table>
        </div>
        <el-divider />
      </el-skeleton>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['pms:approval:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.selectableScheme') }}</span>
          <el-link type="primary" :underline="false" @click="morePlan">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center">
          <el-table :data="processSchemeList" :stripe="true" :show-overflow-tooltip="true" height="300px">
            <el-table-column label="项目编码" align="center" prop="projectCode" />
            <el-table-column label="零件图号" align="center" prop="partNumber" />
            <el-table-column label="工艺" align="center" min-width="100px">
              <template #default>
                可选
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right" width="80">
              <template #default="scope">
                <el-button link type="primary" @click="openSelectProcessScheme(scope.row)">选择</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <el-divider />
      </el-skeleton>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['pms:approval:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.purchasePlan') }}</span>
          <el-link type="primary" :underline="false" @click="toPurchase">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center">
          <el-table :data="materialPurchasePlanList" :stripe="true" :show-overflow-tooltip="true" height="300px">
            <el-table-column label="项目编码" align="center" prop="projectCode" />
            <el-table-column label="零件图号" align="center" prop="partNumber" />
            <el-table-column label="采购数量" align="center" prop="purchaseAmount" />
            <!--<el-table-column label="工艺" align="center" min-width="100px">-->
            <!--<template #default>-->
            <!--可选-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column align="center" label="操作" fixed="right" width="80">
              <template #default="scope">
                <el-button link type="primary" @click="toPurchase(scope.row)">去采购</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <el-divider />
      </el-skeleton>
    </el-card>
  </el-col>
   <!--选择工艺方案-->
  <SelectProcessSchemeForm ref="processSchemeFormRef" @success="getList5"/>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { getCommonUse } from '@/api/bpm/definition'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { PlanApi } from '@/api/pms/plan'
import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
import * as TaskApi from '@/api/bpm/task'
import SelectProcessSchemeForm from '@/views/pms/plan/components/SelectProcessSchemeForm.vue'

/** bpm常用审批,临时页面 */
// defineOptions({ name: 'Temp' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

const loading = ref(true) // 列表的加载中

/*****************项目进度****************/
const projectShowList = ref<any[]>([])
const getProjectProcessList = async ()=>{
  try {
    projectShowList .value = await ApprovalApi.projectProgress();
  } finally {
    loading.value = false
  }
}
const orderShowList = ref<any[]>([])
const getOrderProcessList = async ()=>{
  try {
    orderShowList .value = await ApprovalApi.orderProgress();
  } finally {
    loading.value = false
  }
}

const customColors = [
  { color: '#f5363b', percentage: 20 },
  { color: '#e6b554', percentage: 40 },
  { color: '#e6e42c', percentage: 60 },
  { color: '#534cfa', percentage: 80 },
  { color: '#20d33a', percentage: 100 },
]

const compareScheme = (row)=>{
  if(row.schemeProcess ===100){
    return false;
  }
  const timestamp = new Date().getTime();
  //超时了
  if(row.schemeTime<timestamp){
    return true;
  }
    return false;
}
const comparePurchase = (row)=>{
  if(row.purchaseProcess ===100){
    return false;
  }
  if(row.productionProcess ===100){
    return false;
  }
  const timestamp = new Date().getTime();
  //超时了
  if(row.purchaseTime<timestamp){
    return true;
  }
  return false;
}
const compareProduct = (row)=>{
  if(row.productionProcess ===100){
    return false;
  }
  const timestamp = new Date().getTime();
  //超时了
  if(row.productionTime<timestamp){
    return true;
  }
  return false;
}
/***************************************/

/********************待选任务*******************/
const processSchemeList = ref<any[]>([])
const getSchemeList =async ()=>{
  const data = await PlanApi.showProcessScheme()
  processSchemeList.value = data;
}
const processSchemeFormRef = ref();
const openSelectProcessScheme = (row)=>{
  row.planId = row.id
  processSchemeFormRef.value.open(row)
}

const morePlan = ()=>{
  push({name: 'PmsPlan'})
}

/*********************************************/
/********************毛坯采购计划*******************/
const purchaseResource = ref()
const materialPurchasePlanList = ref<any[]>([])
const getPurchseList =async ()=>{
  purchaseResource.value = await MaterialPurchaseApi.getPurchaseResourceAll()
  const data = purchaseResource.value.purchaseMaterialDOList;
  materialPurchasePlanList.value = data.filter((item)=>{
    return item.purchaseMark ===0;
  })
  console.log(materialPurchasePlanList.value)
}
const toPurchase = ()=>{
  push({name: 'MaterialPurchasePlan'})
}

/*********************************************/
/** 初始化 **/
onMounted(() => {
  getProjectProcessList()
  getOrderProcessList()
  getSchemeList()
  getPurchseList()
})
</script>

<style scoped lang="scss">
  /*:deep .el-calendar-day {*/
    /*padding: 2px;*/
    /*--el-calendar-cell-width: 100px;*/
  /*}*/
  :deep .warning-border {
    border: 3px solid #ff4d4f;
  }
</style>
