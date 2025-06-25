<template>
  <ContentWrap>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="发起原因">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_REASON" :value="detailData.reasonType" />
      </el-descriptions-item>
      <el-descriptions-item label="评估说明">
        {{ detailData.instruction }}
      </el-descriptions-item>
      <el-descriptions-item label="评估结论">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_CONCLUSION" :value="detailData.conclusion" />
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ formatDate(detailData.startTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ formatDate(detailData.endTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="预计结束时间">
        {{ formatDate(detailData.prefinishTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>

      <el-descriptions-item label="技术评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="detailData.technologyAssessmentStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="产能评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="detailData.capacityAssessmentStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="成本评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="detailData.costAssessmentStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="策略评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_STATUS" :value="detailData.strategyAssessmentStatus" />
      </el-descriptions-item>
      <el-descriptions-item label="项目预算">
        {{ detailData.budget }} 万
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table :data="detailDataChildren">
      <!--<el-table-column label="审核人" align="center" prop="auditor" />-->
      <el-table-column label="审核人" align="center" prop="username" />
      <el-table-column label="评审类型" align="center" prop="assessmentType" />
      <el-table-column label="审核建议" align="center" prop="suggestion" />
      <el-table-column
        label="审核时间"
        align="center"
        prop="auditDate"
        width="180"
        :formatter="dateFormatter2"
      />
    </el-table>
  </ContentWrap>
  <!--去掉-->
  <!--<ContentWrap title="合同订单">-->
    <!--<el-table :data="contratOrderList" show-summary :summary-method="getSummaries" border class="-mt-10px">-->
      <!--<el-table-column label="序号" type="index" align="center" width="60" />-->
      <!--<el-table-column label="产品" min-width="180" prop="materialId" />-->
      <!--<el-table-column label="数量" min-width="100" prop="quantity" />-->
      <!--<el-table-column label="单价" min-width="100" prop="price" />-->
      <!--<el-table-column label="税率" min-width="100" prop="taxRate" />-->
      <!--<el-table-column label="含税单价" min-width="100" prop="taxPrice" />-->
      <!--<el-table-column label="交货日期" min-width="150" prop="leadDate" :formatter="dateFormatter2" />-->
      <!--<el-table-column label="合计" prop="totalPrice" fixed="right" min-width="140"/>-->
      <!--<el-table-column label="含税合计" prop="totalTaxPrice" fixed="right" min-width="140"/>-->
    <!--</el-table>-->
  <!--</ContentWrap>-->

   <!--项目零件,技术评估 -->
  <div v-if="!!projectCode">
    <!--项目零件,技术评估 -->
    <div v-if="showTechnology||showTechnology2">
      <DetailTechnology ref="detailTechnologyRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey"/>
    </div>
     <!--项目零件,产能评估 -->
    <div v-if="showCapacity||showCapacity2">
      <DetailCapacity ref="detailCapacityRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey" :order-list="orderList"/>
    </div>

    <!-- 项目零件,成本评估 -->
    <div v-if="showCost||showCost2">
      <DetailCost ref="detailCostRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey" :order-list="orderList"/>
    </div>

    <!-- 项目零件,战略评估 -->
    <div v-if="showStrategy||showStrategy2">
      <DetailStrategy ref="detailStrategyRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey" :order-list="orderList"/>
    </div>

  </div>

  <!-- 项目零件,产能评估 -->
  <!--<div v-if="!!projectCode">-->
    <!--<DetailCapacity ref="detailCapacityRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey" :order-list="orderList"/>-->
  <!--</div>-->

  <!-- 项目零件,成本评估 -->
  <!--<div v-if="!!projectCode">-->
    <!--<DetailCost ref="detailCostRef" :project-code="projectCode" :assessment-id="id||queryId" :task-definition-key="taskDefinitionKey" :order-list="orderList"/>-->
  <!--</div>-->


</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { AssessmentApi} from '@/api/pms/assessment'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import DetailTechnology from './components/detailTechnology.vue'
import DetailCapacity from './components/detailCapacity.vue'
import DetailCost from './components/detailCost.vue'
import DetailStrategy from './components/detailStrategy.vue'
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'PMSAssessmentDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined),
  taskDefinitionKey:propTypes.string.def(undefined),
})
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据
const detailDataChildren = ref([])//详情数据
// const contratOrderList = ref([])//详情数据
const assessmentActive = ref('1');
const showTechnology = ref(false);//展示技术评估
const showCapacity = ref(false);//展示产能评估
const showCost = ref(false);//展示成本评估
const showStrategy = ref(false);//展示战略评估
const showTechnology2 = ref(false);//展示技术评估
const showCapacity2 = ref(false);//展示产能评估
const showCost2 = ref(false);//展示成本评估
const showStrategy2 = ref(false);//展示战略评估

const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号
// const projectCode = query.projectCode as unknown as string // 从 URL 传递过来的 id 编号
const projectCode = ref()
const orderList = ref();
const detailTechnologyRef = ref();
const detailCapacityRef = ref();
const detailCostRef = ref();
const detailStrategyRef = ref();

// provide('provideProjectCode',projectCode)

/** 获得数据 */
const getInfo = async () => {
  console.log(props.taskDefinitionKey)
  console.log(userId)

  detailLoading.value = true
  try {
    // contratOrderList.value = await AssessmentApi.getContractOrder(props.id || queryId);
    // contratOrderList.value.forEach((item)=>{
    //   if (item.quantity != null && item.price != null && item.taxRate != null && item.taxPrice != null) {
    //     item.totalPrice = erpPriceMultiply(item.price, item.quantity)
    //     item.totalTaxPrice = erpPriceMultiply(item.taxPrice, item.quantity)
    //   } else {
    //     item.totalPrice = undefined
    //     item.totalTaxPrice = undefined
    //   }
    // })

    detailData.value = await AssessmentApi.getAssessment(props.id || queryId)
    detailDataChildren.value = await AssessmentApi.getAssessmentReplenishListByAssessmentId(props.id || queryId)
    showChildDetail2(detailData.value);
  } finally {
    detailLoading.value = false
  }
}
// defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {

    if (index === 0) {
      sums[index] = "合计";
      return;
    } else if (column.property == "totalPrice"||column.property == "totalTaxPrice"||column.property == "quantity") {
      //如果是经费（正常的加减法）
      const values = data.map((item) => Number(item[column.property]));
      console.log(values);
      if (!values.every((value) => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          var sum = 0;
          if (!isNaN(value)) {
            sum = Number(Number(prev) + Number(curr)).toFixed(2);
            return sum;
          } else {
            return prev;
          }
        }, 0);
        sums[index] += " ";
      }
    }
  });
  return sums;

}

const showChildDetail2 = (row)=>{
  // const userIdStr = userId.toString()
  if(row.technologyAuditor===userId){
    showTechnology2.value = true;
  }
  if(row.capacityAuditor===userId){
    showCapacity2.value = true;
  }
  if(row.costAuditor===userId){
    showCost2.value = true;
  }
  if(row.strategyAuditor===userId){
    showStrategy2.value = true;
  }
  // rows.forEach(item=>{
  //   if(item.assessmentType==='技术评估'&&userIdStr===item.auditor){
  //     showTechnology2.value = true;
  //   }
  //   if(item.assessmentType==='产能评估'&&userIdStr===item.auditor){
  //     showCapacity2.value = true;
  //   }
  //   if(item.assessmentType==='成本评估'&&userIdStr===item.auditor){
  //     showCost2.value = true;
  //   }
  //   if(item.assessmentType==='战略评估'&&userIdStr===item.auditor){
  //     showStrategy2.value = true;
  //   }
  //
  // })
}

const showChildDetail = ()=>{
  if(props.taskDefinitionKey==='Activity_0ipck9y'){
    showTechnology.value = true;
  }
  if(props.taskDefinitionKey==='Activity_04bad3q'){
    showCapacity.value = true;
  }
  if(props.taskDefinitionKey==="Activity_1u6c3vu"){
    showCost.value = true;
  }
  if(props.taskDefinitionKey==="Activity_113e2mt"){
    showStrategy.value = true;
  }
}

/** 初始化 **/
onMounted(async () => {
  const queryId = query.id as unknown as number
  const assessment = await AssessmentApi.getAssessment(props.id||queryId);
  console.log(assessment)
  projectCode.value = assessment.projectCode;
  orderList.value = await AssessmentApi.getOrderByAssessmentId(props.id||queryId);
  getInfo()
  showChildDetail()
})
onBeforeUnmount(()=>{
  console.log(props.taskDefinitionKey)
  console.log('卸载了')
  // if(props.taskDefinitionKey==='Activity_0ipck9y'){
  if(showTechnology.value){
    console.log('技术提交')
    detailTechnologyRef.value.submit()
    // showTechnology.value = false
  }
  // if(props.taskDefinitionKey==='Activity_04bad3q'){
  if(showCapacity.value){
    console.log('产能提交')
    detailCapacityRef.value.submit()
  }

  // if(props.taskDefinitionKey==="Activity_1u6c3vu"){
  if(showCost.value){
    console.log('成本提交')
    detailCostRef.value.submit()
  }
})
</script>
