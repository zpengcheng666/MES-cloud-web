<template>
  <ContentWrap>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="项目名称">
        {{ detailData.projectName }}
      </el-descriptions-item>
      <el-descriptions-item label="项目编号">
        {{ detailData.projectCode }}
      </el-descriptions-item>
      <el-descriptions-item label="图号">
        {{ detailData.partNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="工件名称">
        {{ detailData.partName }}
      </el-descriptions-item>
      <el-descriptions-item label="物料牌号">
        {{ detailData.materialNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="加工状态">
        {{ detailData.processCondition }}
      </el-descriptions-item>
      <el-descriptions-item label="计划数量">
        {{ detailData.quantity }}
      </el-descriptions-item>
      <el-descriptions-item label="外协数量">
        {{ detailData.outSourceAmount }}
      </el-descriptions-item>

      <el-descriptions-item label="订单类型">
        <dict-tag :type="DICT_TYPE.PMS_ORDER_TYPE" :value="detailData.orderType" />
      </el-descriptions-item>
      <el-descriptions-item label="带料加工">
        <dict-tag :type="DICT_TYPE.PMS_PROCESS_TYPE" :value="detailData.processType" />
      </el-descriptions-item>

      <el-descriptions-item label="采购完成时间">
        {{ formatDate(detailData.purchaseCompletionTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="工艺准备完成时间">
        {{ formatDate(detailData.processPreparationTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="生产准备完成时间">
        {{ formatDate(detailData.productionPreparationTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="入库时间">
        {{ formatDate(detailData.warehousingTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="完成检验时间">
        {{ formatDate(detailData.checkoutCompletionTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="计划交付时间">
        {{ formatDate(detailData.planDeliveryTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>

      <el-descriptions-item label="工艺方案">
        {{ detailData.processSchemeName }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 列表 -->
  <!--<ContentWrap>-->
    <!--<el-table :data="detailDataChildren">-->
      <!--<el-table-column label="图号" align="center" prop="partNumber"  width="180" />-->
      <!--<el-table-column label="数量" align="center" prop="quantity" />-->
      <!--<el-table-column label="工艺方案" align="center" prop="processSchemeName" width="180"/>-->
      <!--<el-table-column label="所需物料" align="center" min-width="180" prop="materialName" />-->
      <!--<el-table-column-->
        <!--label="工艺准备完成时间"-->
        <!--align="center"-->
        <!--prop="processPreparationTime"-->
        <!--width="150"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="生产准备完成时间"-->
        <!--align="center"-->
        <!--prop="productionPreparationTime"-->
        <!--width="150"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="采购完成时间"-->
        <!--align="center"-->
        <!--prop="purchaseCompletionTime"-->
        <!--width="150"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="入库时间"-->
        <!--align="center"-->
        <!--prop="warehousingTime"-->
        <!--width="180"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="完成检验时间"-->
        <!--align="center"-->
        <!--prop="checkoutCompletionTime"-->
        <!--width="180"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->
      <!--<el-table-column-->
        <!--label="计划交付时间"-->
        <!--align="center"-->
        <!--prop="planDeliveryTime"-->
        <!--width="180"-->
        <!--:formatter="dateFormatter2"-->
      <!--/>-->

      <!--<el-table-column label="备注" align="center" prop="remark" />-->
    <!--</el-table>-->
  <!--</ContentWrap>-->


</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { PlanApi} from '@/api/pms/plan'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

defineOptions({ name: 'PMSApprovalDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据
const detailDataChildren = ref([])//详情数据
const processSchemeList = ref<any[]>([])

const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号
const prosessParams = {
  projectCode:'',
  viewSelf:false
}
/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await PlanApi.getPlan(props.id || queryId)

    await getProcessScheme();
    processSchemeList.value.forEach(val=>{
      if(val.id===detailData.value.processScheme){
        detailData.value.processSchemeName = val.name;
      }
    })
    console.log(detailData.value)
    console.log(processSchemeList.value)
    // detailDataChildren.value = await  PlanApi.getPlanItemListByProjectPlanId(props.id || queryId)
    //TODO 处理工艺方案名字,暂时注掉
    // prosessParams.projectCode = detailData.value.projectCode;
    // processSchemeList.value = await PlanApi.getProjPartBomPlanList(prosessParams)


    // detailDataChildren.value.forEach(item=>{
    //   processSchemeList.value.forEach(val=>{
    //     if(val.id===item.processScheme){
    //       item.processSchemeName = val.name;
    //     }
    //   })
    // })


  } finally {
    detailLoading.value = false
  }
}

//获取工艺方案
const getProcessScheme =async ()=>{
  const params = {
    projectCode:detailData.value.projectCode,
    partNumber:detailData.value.partNumber,
  }
  //整个项目的工艺方案,用新接口
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processSchemeList.value = list.filter((item)=>{
    return item.type ===2;
  })
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
