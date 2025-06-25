<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000" @close="closeDialog">
    <!-- 列表 -->
    <ContentWrap>
      <el-table height="50vh" :data="detailData" v-loading="loading" show-summary :summary-method="getSummaries" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="采购单编号" align="center" prop="contractId" />
        <el-table-column
          label="采购日期"
          align="center"
          prop="purchaseTime"
          :formatter="dateFormatter2"
          width="120px"
        />
        <el-table-column label="币种" align="center" prop="currency" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.CURRENCY_TYPE" :value="scope.row.currency" />
          </template>
        </el-table-column>
        <el-table-column label="采购数量" align="center" prop="quantity" />
        <el-table-column label="已入库数量" align="center" prop="signAmount" />
        <el-table-column label="已入库总额" align="center" prop="signTotalPrice" />
        <el-table-column label="未入库数量" align="center" prop="remainAmount" />
        <el-table-column label="未入库总额" align="center" width="90px" prop="unSignTotalPrice" />
        <el-table-column label="总额" align="center" width="90px" prop="totalPrice" />
        <el-table-column label="应付带税总额" align="center" width="90px" prop="taxTotalPrice" />
        <el-table-column label="实付总额" align="center" width="90px" prop="payment" />
        <el-table-column label="剩余总额" align="center" width="90px" prop="remainPayment" />
      </el-table>
    </ContentWrap>
  </Dialog>

</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2,formatDate } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

const loading = ref(true) // 列表的加载中
const detailData = ref([])
const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.projectId,
  async (val) => {
    console.log(val)
   const data = await ApprovalApi.getPurchaseDetail(val)
    console.log(data)
    detailData.value = data;
  },
  { immediate: false }
)

/** 打开弹窗 */
const open = async (id) => {
  loading.value = true
  dialogVisible.value = true
  const data = await ApprovalApi.getPurchaseDetail(id)
  detailData.value = data;
  loading.value = false
}

const closeDialog = ()=>{
  detailData.value = []
}
const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {

    if (index === 2) {
      sums[index] = "合计";
      return;
    } else if (column.property === "totalPrice"||column.property ==="taxTotalPrice"||column.property ==="signTotalPrice"||column.property ==="unSignTotalPrice"||column.property ==="payment"||column.property ==="remainPayment") {
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
    }else if(column.property ==="quantity"||column.property ==="signAmount"||column.property ==="remainAmount"){
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

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
