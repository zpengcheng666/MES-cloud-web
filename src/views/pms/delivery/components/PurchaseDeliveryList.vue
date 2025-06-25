<template>
  <ContentWrap >
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="收货" name="delivery">
        <el-table :data="purchaseList" height="50vh">
          <!-- 子表的列表 -->
          <el-table-column type="expand">
            <template #default="scope">
              <PurchaseListChild :purchase-id="scope.row?.id" />
            </template>
          </el-table-column>
          <!--<el-table-column label="接收单位" align="center" prop="consignedByDeptName"/>-->
          <!--<el-table-column-->
            <!--label="发货日期"-->
            <!--align="center"-->
            <!--prop="consignerDate"-->
            <!--:formatter="dateFormatter2"-->
            <!--width="120px"-->
          <!--/>-->
          <!--<el-table-column-->
            <!--label="接收日期"-->
            <!--align="center"-->
            <!--prop="consignedDate"-->
            <!--:formatter="dateFormatter2"-->
            <!--width="120px"-->
          <!--/>-->
          <!--<el-table-column label="发货人" align="center" prop="consigner" />-->
          <!--<el-table-column label="收货人" align="center" prop="consignedByName" />-->
          <el-table-column label="项目编号" align="center" prop="projectCode" />
          <el-table-column label="物料编号" align="center" prop="materialNumber" />
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="采购数量" align="center" prop="purchaseAmount" />
          <el-table-column label="到货数量" align="center" prop="amount" />
          <el-table-column
          label="采购时间"
          align="center"
          prop="purchaseTime"
          :formatter="dateFormatter2"
          width="120px"
          />

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="退货" name="return">
        <el-table :data="purchaseReturnList" height="50vh">
          <!-- 子表的列表 -->
          <el-table-column type="expand">
            <template #default="scope">
              <PurchaseReturnListChild :return-id="scope.row?.id" />
            </template>
          </el-table-column>
          <!--<el-table-column label="退货单位" align="center" prop="consignerDeptName" />-->
          <!--<el-table-column label="退货人" align="center" prop="consignerName" />-->
          <!--<el-table-column label="接收人" align="center" prop="consignedBy" />-->
          <!--<el-table-column label="退货原因" align="center" prop="returnReason" />-->
          <!--<el-table-column-->
            <!--label="退货日期"-->
            <!--align="center"-->
            <!--prop="consignerDate"-->
            <!--:formatter="dateFormatter2"-->
            <!--width="120px"-->
          <!--/>-->
          <!--<el-table-column-->
            <!--label="收货日期"-->
            <!--align="center"-->
            <!--prop="consignedDate"-->
            <!--:formatter="dateFormatter2"-->
            <!--width="120px"-->
          <!--/>-->
          <el-table-column label="项目编号" align="center" prop="projectCode" />
          <el-table-column label="物料编号" align="center" prop="materialNumber" />
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="采购数量" align="center" prop="purchaseAmount" />
          <el-table-column label="退货数量" align="center" prop="returnAmount" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>

</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,formatDate,dateFormatter2 } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { DeliveryApi } from '@/api/pms/delivery'
import PurchaseListChild from './purchaseChild/PurchaseListChild.vue'
import PurchaseReturnListChild from './purchaseChild/PurchaseReturnListChild.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const subTabsName = ref('delivery')
const listData = ref([])

//采购收货记录
const purchaseList = ref([])
//采购退货记录
const purchaseReturnList = ref([])

/** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//   () => props.projectId,
//   async (val) => {
//     if(val){
//       purchaseList.value = await DeliveryApi.getPurchaseConsignmentByProjectId(val);
//       purchaseReturnList.value = await DeliveryApi.getConsignmentReturnByProjectId(val);
//     }
//
//   },
//   { immediate: false }
// )

const setPurchaseList =async (data)=>{
  purchaseList.value = data;
}
const setReturnList =async (data)=>{
  purchaseReturnList.value = data;
}
defineExpose({ setPurchaseList,setReturnList })
</script>
