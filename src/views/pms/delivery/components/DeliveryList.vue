<template>
  <!--<ContentWrap>-->
    <!--<el-table :data="listData">-->
      <!--<el-table-column label="产品名称" align="center" prop="productName" />-->
      <!--<el-table-column label="图号" align="center" prop="number" />-->
      <!--<el-table-column label="计量单位" align="center" prop="unit" />-->
      <!--<el-table-column label="数量" align="center" prop="quantity" />-->
      <!--<el-table-column label="备注" align="center" prop="remark" />-->
    <!--</el-table>-->
  <!--</ContentWrap>-->

  <ContentWrap>
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="发货" name="delivery">
        <el-table :data="shippingList" height="50vh">
          <!-- 子表的列表 -->
          <el-table-column type="expand">
            <template #default="scope">
                  <!--<SellListChild :shipping-id="scope.row.id" />-->
                  <SellListChild :order-id="scope.row.id" />
            </template>
          </el-table-column>
          <!--<el-table-column label="发货单位" align="center" prop="consignerDeptName"/>-->
          <!--<el-table-column label="客户" align="center" prop="companyName" />-->
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
          <!--<el-table-column label="发货人" align="center" prop="consignerName" />-->
          <!--<el-table-column label="收货人" align="center" prop="consignedBy" />-->


          <el-table-column label="项目编号" align="center" prop="projectCode" />
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="名称" align="center" prop="partName" />
          <el-table-column label="数量" align="center" prop="quantity" />
          <el-table-column label="发货数量" align="center" prop="amount" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="退回" name="return">
        <el-table :data="shippingReturnList" height="50vh">
          <!-- 子表的列表 -->
          <el-table-column type="expand">
            <template #default="scope">
              <!--<ReturnListChild :shipping-return-id="scope.row.id" />-->
              <ReturnListChild :order-id="scope.row.id" />
            </template>
          </el-table-column>
          <!--<el-table-column label="退货单位" align="center" prop="companyName" />-->

          <!--<el-table-column label="退货人" align="center" prop="consigner" />-->
          <!--&lt;!&ndash;<el-table-column label="接收人" align="center" prop="consignedBy" />&ndash;&gt;-->
          <!--<el-table-column label="接收人" align="center" prop="consignedByName" />-->
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
          <el-table-column label="图号" align="center" prop="partNumber" />
          <el-table-column label="名称" align="center" prop="partName" />
          <el-table-column label="数量" align="center" prop="quantity" />
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
import { ShippingApi } from '@/api/dm/shipping'
import { ShippingReturnApi } from '@/api/dm/shippingreturn'
import SellListChild from './sellChild/SellListChild.vue'
import ReturnListChild from './sellChild/ReturnListChild.vue'

/** pms 项目交付 销售 */
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗


const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const subTabsName = ref('delivery')
const listData = ref([])
//发货记录
const shippingList = ref([])
//退货记录
const shippingReturnList = ref([])

/** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//   () => props.projectId,
//   async (val) => {
//
//     //获取该项目所有发货单
//     const data =await DeliveryApi.getShippingDetailByProjectId(val);
//     shippingList.value = data;
//     //获取退货单
//     const data2 = await DeliveryApi.getShippingReturnDetailByProjectId(val);
//     shippingReturnList.value = data2;
//   },
//   { immediate: false }
// )
// watch(
//   () => props.projectId,
//   async (val) => {
//     console.log(val)
//     //获取该项目所有项目订单
//     const data =await ApprovalApi.getOrderListByProjectId(val)
//     const data2 =await DeliveryApi.getShippingDetailByProjectId(val)
//     console.log(await DeliveryApi.getShippingDetailByProjectId(val))
//     console.log(data2,'data2')
//     //获取所有发货单
//     const allShipping =await ShippingApi.getShippingList('2,3,4')
//     //抽取合同id
//     let contractIds = data.map((item)=>{
//       console.log(item.contractId)
//       return item.contractId;
//     })
//     //过滤发货单
//     shippingList.value =  allShipping.filter((item)=>{
//       let b = contractIds.includes(item.contractId)
//       return b;
//     })
//     //获取退货单
//     for(let i=0;i<contractIds.length;i++){
//       const shippingreturn = await ShippingReturnApi.getShippingReturnByContract(contractIds[i]);
//       if(shippingreturn!=null){
//         shippingReturnList.value.push(...shippingreturn);
//       }
//     }
//   },
//   { immediate: false }
// )
const setShippingList =async (data)=>{
  shippingList.value = data;
}
const setReturnList =async (data)=>{
  shippingReturnList.value = data;
}
defineExpose({ setShippingList,setReturnList })
</script>
