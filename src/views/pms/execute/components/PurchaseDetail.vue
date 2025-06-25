<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table height="50vh" :data="detailData" show-summary :summary-method="getSummaries" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="采购单名称" align="center" prop="contractName" />
      <el-table-column label="采购单编号" align="center" prop="contractNumber" />
      <el-table-column label="物料名称" align="center" prop="materialName" />
      <el-table-column label="采购数量" align="center" prop="quantity" />
      <!--<el-table-column label="签收数量" align="center" prop="signAmount" />-->
      <!--<el-table-column label="退货数量" align="center" prop="returnAmount" />-->
      <el-table-column label="实际入库数量" align="center" prop="actualAmount" />
      <el-table-column label="未入库数量" align="center" prop="remainAmount" />
      <el-table-column label="进度" align="center" width="100px">
        <template #default="{row}">
            <el-progress :percentage="row.progress" :stroke-width="20" text-inside :color="customColors" />
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2,formatDate } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import { ExcuteApi } from '@/api/pms/excute'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const detailData = ref([])
const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const percentage = ref(50);
const customColors = [
  { color: '#f5363b', percentage: 20 },
  { color: '#e6b554', percentage: 40 },
  { color: '#e6e42c', percentage: 60 },
  { color: '#534cfa', percentage: 80 },
  { color: '#20d33a', percentage: 100 },
]
/** 监听主表的关联字段的变化，加载对应的子表数据 */
// watch(
//   () => props.projectId,
//   async (val) => {
//     const ids = [val];
//    const data = await ExcuteApi.getPurchaseProgress(ids);
//
//     console.log(data)
//     detailData.value = data;
//   },
//   { immediate: false }
// )

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {

    if (index === 1) {
      sums[index] = "合计";
      return;
    } else if (column.property ==="XXX") {
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
    }else if(column.property ==="quantity"||column.property ==="signAmount"||column.property ==="actualAmount"||column.property ==="returnAmount"||column.property ==="remainAmount"){
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
const setPurchaseList = (data)=>{
  detailData.value = data;
}

defineExpose({ setPurchaseList})
</script>

