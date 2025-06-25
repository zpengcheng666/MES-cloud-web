<template>
  <el-container :gutter="20" class="material-container" fit="contain">
    <el-header class="material-header">
      <el-row type="flex" justify="center">
        <div class="header-text">工位物料信息</div>
      </el-row>
    </el-header>
    <el-main class="material-main">
      <el-table
        :data="inStockListData"
        class="stock-table instock-table"
        max-height="55vh"
        @row-click="(row)=>handleRowClick(row, '3')"
        :header-cell-style="{
                borderTop: '0.4vh solid #5DD7D5',
                borderBottom: '0.3vh solid #48ADE4',
                background: 'transparent',
                color: '#ffffff'
              }"
        :cell-style="{ borderBottom: '0.3vh solid #48ADE4' }"
        :row-class-name="instockRowClass"
        @selection-change="handleSelectionChange"
        ref="inStockTableRef"
      >
        <el-table-column width="30" label="选择" type="selection" />
        <el-table-column label="收货单号" align="center" prop="no" />
        <el-table-column label="物料状态" align="center" prop="status" >
          <template #default="scope">
            <span v-if="readyForCarry[scope.row.barCode] != null" >{{readyForCarry[scope.row.barCode]?'托盘已到达':'托盘配送中' }}</span>
            <span v-else>{{ scope.row.status == 0 ? "待入库" : "入库中" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料编号" align="center" prop="materialNumber" />
        <el-table-column label="物料条码" align="center" prop="barCode" />
        <el-table-column label="质检结果" align="center" prop="materialStatus">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.PM_MATERIAL_STATUS, scope.row.materialStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="totality" />
      </el-table>
    </el-main>
    <el-footer class="footer1">
      <div class="confirmBtn">
        <el-image class="btn" :src="inStockBtn" @click="submit('inStock')" />
      </div>
    </el-footer>
  </el-container>

</template>
<script setup lang="ts">
import { onMounted, inject } from 'vue';
import printBarcodeBtn from '@/assets/produceterminal/images/printBarcodeBtn.png'; //打印条码
import registerBtn from '@/assets/produceterminal/images/registerBtn.png'; //录入库
import inStockBtn from "@/assets/operatingterminal/inoutimage/instockBtn.png";
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal'
import {TerminalApi} from "@/api/mcs/terminal";
import {DICT_TYPE, getDictLabel} from "@/utils/dict";
defineOptions({ name: 'StationMaterial' });

const message = useMessage(); // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中

const locationId: any = inject('locationId') //用户数据
const userData: any = inject('userData') //用户数据

// 发货列表
const inStockListData = ref<any[]>([]);
/**获取待入库集合**/
const getStockForIn = async () => {
  inStockListData.value = await OperatingtTerminalApi.getStockForIn(locationId.value)
  const barCodes = inStockListData.value.map((v) => v.barCode);
  await getMaterialCarryReadyStatus(barCodes);
}

const inStockTableRef = ref()

const handleRowClick = (row, type) => {
  inStockTableRef.value.toggleRowSelection(row)
}

const inStockSelection= ref([])
const handleSelectionChange = (val) => {
  inStockSelection.value = val;
}

// 初始化选中行
const instockRowClass = ({row, rowIndex,}) => {
  return inStockSelection.value.find(v => v.id == row.id) ? 'selected' : '';
}
/**
 * 清空选中行
 */
const resetRow  = async () => {
  inStockSelection.value = []
  inStockTableRef.value?.setCurrentRow()
}

/** 添加/修改操作 */
const formRef = ref()
const submit = async (type) =>
{
  // 未选中一行数据
  if(inStockSelection.value.length == 0){
    message.error('请选择一条数据再进行操作')
    return
  }

  // 验证待入库数据
  const list = inStockSelection.value.filter((item) => item.status != 0)
  if(list.length > 0){
    message.warning(t('所选单据状态必须都是待入库状态'))
    return
  }
  const data = inStockSelection.value.map((v) => {
    return {
      orderNumber: v.no,
      orderType: v.orderType,
      chooseStockId: v.id,
      quantity: 1,
      orderStatus: 1,
    };
  });

  // 生成入库单
  await OperatingtTerminalApi.generatorInBound(data)
  message.success(t('提交成功'))
  await getStockForIn()
  inStockSelection.value = []
  return
}

const readyForCarry = ref<any>({})
async function getMaterialCarryReadyStatus(list) {
  readyForCarry.value = await TerminalApi.getMaterialCarryReadyStatus(list)
}

// 初始化
const init = () => {
  // 初始化定时器
  initInterval()
  // 获取待入库收货单
  getStockForIn()
  // 初始化选中行
  resetRow()
}

let timer = null;
const initInterval = () => {
  // timer = setInterval(async () => {
  //   if(Object.keys(currentRowIn.value).length != 0){
  //     clearInterval(timer);
  //   }
  //   else {
  //     init();
  //   }
  // }, 20000);
}

onMounted(()=>{
  // 初始化定时器 列表数据
  init()
})

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style lang="scss" scoped>
@import url("@/assets/operatingterminal/scss/consignmentandshippingterminal.scss");
</style>
