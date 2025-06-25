<template>
  <el-row>
    <el-col :span="12">
      <el-container class="container1">
        <el-header class="header1">
          <div class="taskText">收货信息</div>
        </el-header>
        <el-main class="main1">
          <el-table
            :data="consignmentListData"
            class="stock-table"
            max-height="55vh"
            highlight-current-row
            :header-cell-style="{
              borderTop: '0.4vh solid #5DD7D5',
              borderBottom: '0.3vh solid #48ADE4',
              background: 'transparent',
              color: '#ffffff'
            }"
            :cell-style="{ borderBottom: '0.3vh solid #48ADE4' }"
            ref="inTableRef"
          >
            <el-table-column label="收货单号" align="center" prop="no" width="250"/>
            <el-table-column label="物料类型" align="center" prop="materialName" />
            <el-table-column label="数量" align="center" prop="consignedAmount" />
            <el-table-column label="单据类型" align="center" prop="consignmentType" >
              <template #default="scope">
                {{ getDictLabel(DICT_TYPE.CONSIGNMENT_TYPE, scope.row.consignmentType) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="consignmentStatus" >
              <template #default="scope">
                {{ getDictLabel(DICT_TYPE.CONSIGNMENT_STATUS, scope.row.consignmentStatus) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template #default="scope">
                <div class="shouhuoBtn" @click.stop="submit('in', scope.row)" v-show="scope.row.consignmentStatus==undefined || scope.row.consignmentStatus == '2'"></div>
                <div class="fahuoBtn" @click.stop="submit('in', scope.row)" v-show="scope.row.consignmentStatus == '10'"></div>
<!--                <div class="rukuBtn" @click.stop="submit('in', scope.row)" v-show="currentRowIn.consignmentStatus == '10'"></div>-->
              </template>
            </el-table-column>
          </el-table>
        </el-main>
<!--        <el-footer class="footer1">-->
<!--          <div class="confirmBtn">-->
<!--            <el-image class="btn" :src="receiveBtn" @click="submit('in')" v-show="currentRowIn.consignmentStatus==undefined || currentRowIn.consignmentStatus == '2'"/>-->
<!--            <el-image class="btn" :src="outBtn" @click="submit('in')" v-show="currentRowIn.consignmentStatus == '10'"/>-->
<!--          </div>-->
<!--        </el-footer>-->
      </el-container>
    </el-col>
    <el-col :span="12">
      <el-container class="container2">
        <el-header class="header1">
          <div class="taskText">发货信息</div>
        </el-header>
        <el-main class="main1">
          <el-table
            :data="shippingListData"
            class="stock-table"
            max-height="55vh"
            highlight-current-row
            :header-cell-style="{
              borderTop: '0.4vh solid #5DD7D5',
              borderBottom: '0.3vh solid #48ADE4',
              background: 'transparent',
              color: '#ffffff'
            }"
            :cell-style="{ borderBottom: '0.3vh solid #48ADE4' }"
            ref="outTableRef"
          >
            <el-table-column label="发货单号" align="center" prop="materialNumber" width="200" />
            <el-table-column label="物料类型" align="center" prop="materialName" />
            <el-table-column label="数量" align="center" prop="consignedAmount" />
            <el-table-column label="单据类型" align="center" prop="shippingType">
              <template #default="scope">
                {{ getDictLabel(DICT_TYPE.SHIPPING_TYPE, scope.row.shippingType) }}
              </template>
            </el-table-column>
            <el-table-column label="单据状态" align="center" prop="shippingStatus">
              <template #default="scope">
                {{ scope.row.outStatus == '1' ? '待出库' : '待发货' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
              <template #default="scope">
                <div class="fahuoBtn" @click.stop="submit('out', scope.row)" v-show="scope.row.outStatus == undefined || scope.row.outStatus == '2'"></div>
                <div class="chukuBtn" @click.stop="submit('out', scope.row)" v-show="scope.row.outStatus == '1'"></div>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
<!--        <el-footer class="footer1">-->
<!--          <div class="confirmBtn">-->
<!--            <el-image class="btn" :src="outBtn" @click="submit('out')" v-show="currentRowIn.outStatus == undefined || currentRowIn.outStatus == '2'"/>-->
<!--            <el-image class="btn" :src="outStockBtn" @click="submit('out')" v-show="currentRowIn.outStatus == '1'"/>-->
<!--          </div>-->
<!--        </el-footer>-->
      </el-container>
    </el-col>
  </el-row>
  <!-- 表单弹窗：添加/修改 -->
  <InOutStockDialog ref="formRef" @success="init" />
</template>
<script setup lang="ts">
import { inject } from 'vue'
import inStockBtn from "@/assets/operatingterminal/inoutimage/instockBtn.png";
import receiveBtn from "@/assets/operatingterminal/inoutimage/receiveBtn.png";
import outBtn from "@/assets/operatingterminal/inoutimage/outBtn.png";
import outStockBtn from "@/assets/operatingterminal/inoutimage/outStockBtn.png";
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal'
import {DICT_TYPE, getDictLabel} from "@/utils/dict";
import InOutStockDialog from './InOutStockDialog.vue'
import {TerminalApi} from "@/api/mcs/terminal";

defineOptions({ name: 'InOutStock' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中

const formData = ref<any>({
  records: [],
  result: [],
  barCode: undefined
})

const locationId: any = inject('locationId') //用户数据
const userData: any = inject('userData') //用户数据

// 收货列表
const consignmentListData = ref<any[]>([]);
/** 获取待签收的收货单 */
const getSignConsignmentInfo = async () => {
  consignmentListData.value = await OperatingtTerminalApi.getSignConsignmentInfo();
}

// 发货列表
const shippingListData = ref<any[]>([]);
/**获取待签收的收货单**/
const getSignShippingInfo = async () => {
  shippingListData.value = await OperatingtTerminalApi.getSignShippingInfo();
}

const inTableRef = ref()
const outTableRef = ref()

/** 添加/修改操作 */
const formRef = ref()
const submit = async (type, row) =>
{
  // 收货
  if(type == 'in'){
    // 退货
    if(row.consignmentStatus == '10'){
      const data = {
        consignmentInfoId: row.id,
      }
      // 退货
      await OperatingtTerminalApi.returnConsignment(data)
      message.success(t('退货成功'))
      // 刷新列表
      await getSignConsignmentInfo()
      return
    }

    // 待签收 扫码、数量
    formRef.value.open("in", locationId.value, row.consignmentType, row.id, row.consignedAmount)
  }
  // 发货
  else if (type == 'out') {
    // 出库
    if(row.outStatus == '1'){
      const data = {
        shippingInfoId: row.id,
        locationId: locationId.value,
      }
      // 条码签收
      await OperatingtTerminalApi.generatorOutBound(data)
      message.success(t('出库成功'))
      // 刷新发货列表
      await getSignShippingInfo()
      return
    }
    // 扫码
    formRef.value.open("out", locationId.value, '2', row.id, row.consignedAmount)
  }
  // 入库
  // else if (type == 'inStock'){
  //
  //   // 验证待入库数据
  //   const list = inStockSelection.value.filter((item) => item.status != 0)
  //   if(list.length > 0){
  //     message.warning(t('所选单据状态必须都是待入库状态'))
  //     return
  //   }
  //
  //   const data = inStockSelection.value.map((v) => {
  //     return {
  //       orderNumber: v.no,
  //       orderType: v.orderType,
  //       chooseStockId: v.id,
  //       quantity: 1,
  //       orderStatus: 1,
  //     };
  //   });
  //
  //   // 生成入库单
  //   await OperatingtTerminalApi.generatorInBound(data)
  //   message.success(t('提交成功'))
  //   await getStockForIn()
  //   inStockSelection.value = []
  //   return
  // }
}

// 初始化
const init = () => {
  // 初始化定时器
  initInterval()
  // 获取待签收的收货单
  getSignConsignmentInfo()
  // 获取待签收的收货单
  getSignShippingInfo()
  // 获取待入库收货单
  // getStockForIn()
  // 初始化选中行
  // resetRow()
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
