<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table height="50vh" :data="orderItemList" show-summary :summary-method="getSummaries" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!--<el-table-column label="单据编号" align="center" prop="contractId" />-->
      <el-table-column label="产品名称" align="center" prop="materialName" />
      <el-table-column label="产品编号" align="center" prop="materialNumber" />
      <el-table-column label="计量单位" align="center" prop="materialUnit" />
      <el-table-column label="计划数量" align="center" prop="quantity" />
      <el-table-column label="现有库存" align="center" prop="inventory" />
      <el-table-column label="库存提示" align="center" prop="inventoryInfo">
        <template #default="{row}">
          <el-text v-show="row.inventoryInfo===1" class="mx-1" type="danger">库存不足</el-text>
          <el-text v-show="row.inventoryInfo===2" class="mx-1" type="warning">库存紧张</el-text>
          <el-text v-show="row.inventoryInfo===3" class="mx-1" type="success">库存尚足</el-text>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,formatDate } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { ExcuteApi } from '@/api/pms/excute'
import { MaterialStockApi } from '@/api/wms/materialstock'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const orderItemList = ref([])


/** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//   () => props.projectId,
//   async (val) => {
//     if(val){
//
//       const data = await ExcuteApi.getMaterialList(val);
//       const materialStockList = await MaterialStockApi.getMaterialStockList();
//       data.forEach((item)=>{
//        const newMaterialStockList = materialStockList.filter(single=> item.materialId===single.materialConfigId).map(single=>single.totality);
//        console.log(newMaterialStockList);
//        let inventory =  newMaterialStockList.reduce((a,b)=>{return a+b},0)
//         console.log(inventory)
//         item.inventory = inventory
//         if(item.inventory<item.quantity){
//           item.inventoryInfo = 1//'库存不足'
//         }else if(item.quantity<10){
//           item.inventoryInfo = 2//'库存紧张'
//         }else{
//           item.inventoryInfo = 3//'库存尚足'
//         }
//       })
//       orderItemList.value = data
//
//       console.log(materialStockList);
//
//
//      // const orderList = await ApprovalApi.getOrderListByProjectId(val);
//      // const orderItemList = [];
//      // orderList.forEach((item)=>{
//      //   orderItemList.push(...item.orderItemList);
//      // })
//      // const materialList = orderItemList.map((item)=>{
//      //    return item.materialId;
//      //  })
//     }
//
//
//   },
//   { immediate: false }
// )

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {

    if (index === 0) {
      sums[index] = "合计";
      return;
    } else if (column.property ==="remainPayment") {
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
      }else {
        sums[index] = 'NaN';
      }
    }else if(column.property ==="quantity"||column.property ==="inventory"){
      //如果是经费（正常的加减法）
      const values = data.map((item) => Number(item[column.property]));
      console.log(values);
      if (!values.every((value) => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          var sum = 0;
          if (!isNaN(value)) {
            sum = Number(Number(prev) + Number(curr));
            return sum;
          } else {
            return prev;
          }
        }, 0);
        sums[index] += " ";
      }else {
        sums[index] = 'NaN';
      }
    }
  });
  return sums;

}

const setList = async (rows)=>{
  const materialStockList = await MaterialStockApi.getMaterialStockList();
  rows.forEach((item)=>{
    const newMaterialStockList = materialStockList.filter(single=> item.materialId===single.materialConfigId).map(single=>single.totality);
    console.log(newMaterialStockList);
    let inventory =  newMaterialStockList.reduce((a,b)=>{return a+b},0)
    console.log(inventory)
    item.inventory = inventory
    if(item.inventory<item.quantity){
      item.inventoryInfo = 1//'库存不足'
    }else if(item.inventory<10){
      item.inventoryInfo = 2//'库存紧张'
    }else{
      item.inventoryInfo = 3//'库存尚足'
    }
  })
  orderItemList.value = rows
}

defineExpose({ setList })
</script>
