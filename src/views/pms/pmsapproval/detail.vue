<template>
  <ContentWrap>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="项目编码">
        {{ detailData.projectCode }}
      </el-descriptions-item>
      <el-descriptions-item label="项目名称">
        {{ detailData.projectName }}
      </el-descriptions-item>
      <el-descriptions-item label="项目类型">
        <dict-tag :type="DICT_TYPE.PMS_PROJECT_TYPE" :value="detailData.projectType" />
      </el-descriptions-item>
      <el-descriptions-item label="是否评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_TYPE" :value="detailData.needsAssessment" />
        <!--{{ detailData.mroom }}-->
      </el-descriptions-item>
      <el-descriptions-item label="项目合同">
        {{ detailData.projectContract }}
      </el-descriptions-item>
      <el-descriptions-item label="项目预算(万元)">
        {{ detailData.budget }}
      </el-descriptions-item>
      <el-descriptions-item label="客户">
        {{ detailData.projectClient }}
      </el-descriptions-item>
      <el-descriptions-item label="项目简述">
        {{ detailData.description }}
      </el-descriptions-item>
      <el-descriptions-item label="预计开始时间">
        {{ formatDate(detailData.prestartTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="预计结束时间">
        {{ formatDate(detailData.preendTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>

      <el-descriptions-item label="负责人">
        {{ detailData.responsiblePerson }}
      </el-descriptions-item>
      <el-descriptions-item label="项目经理">
        {{ detailData.projectManager }}
      </el-descriptions-item>

      <el-descriptions-item label="战略评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_TYPE" :value="detailData.strategy" />
      </el-descriptions-item>
      <el-descriptions-item label="技术评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_TYPE" :value="detailData.technology" />
      </el-descriptions-item>
      <el-descriptions-item label="产能评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_TYPE" :value="detailData.capacity" />
      </el-descriptions-item>
      <el-descriptions-item label="成本评估">
        <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_TYPE" :value="detailData.cost" />
      </el-descriptions-item>

      <el-descriptions-item label="材料">
        {{ detailData.technicalMaterials }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <ContentWrap>
    <el-table  :data="orderData">
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
    </el-table>

  </ContentWrap>


</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { propTypes } from '@/utils/propTypes'
import { ApprovalApi} from '@/api/pms/pmsapproval'
import { OrderApi} from '@/api/pms/order'
import { dateFormatter,dateFormatter2,formatDate } from '@/utils/formatTime'

defineOptions({ name: 'PMSApprovalDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据
const orderData = ref<any[]>([]) // 详情数据

const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await ApprovalApi.getApproval(props.id || queryId)
    orderData.value = await OrderApi.getOrderByProjectId(detailData.value.id)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
