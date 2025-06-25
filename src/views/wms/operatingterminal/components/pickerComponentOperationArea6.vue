<template>
  <!--<div style="border: 1px solid red;height:40vh;width:24vw">-->
  <!--<div style="border: 1px solid red;height:45vh">-->
  <!-- 区域信息 -->
  <el-container class="area">
    <el-main class="areafont">
      {{ location }}
    </el-main>
  </el-container>

  <!-- 托盘信息和托盘下的图片按钮 -->
  <el-container class="stock">
    <el-main class="stockmain">
      <div class="stockInfo">
        <div class="stockitem" v-if="stockInfo?.barCode">
          <div><span style="margin: 0 10% 0 -10%">托盘编码:</span>{{ stockInfo.materialNumber }}</div>
          <div><span style="margin: 0 10% 0 -10%">托盘条码:</span>{{ stockInfo.barCode }}</div>
          <!-- <div><span style="margin: 0 10% 0 -10%">托盘状态:</span></div> -->
        </div>
        <div class="stockitemnone" v-else> 无托盘 </div>
      </div>
      <div class="stockbtn">
        <div class="stockimg" v-if="stockInfo?.barCode">
          <!-- 托盘入库：上架 -->
          <el-image class="warehouse" v-show="stockwarehouseVisible" @click="stockWarehouseClick" :src="upshelf" fit="contain" />
        </div>
        <div class="stockimg" v-else>
          <!-- 选择托盘：下架 -->
          <el-image class="chooseStock" v-show="chooseStockVisible" :src="downshelf" @click="openDialog(stockInfo?.id)" fit="contain" />
        </div>
      </div>
    </el-main>
  </el-container>
  <!--</div>-->

  <div class="my-dialog">
    <el-dialog v-model="dialogVisible" width="1000px" :show-close="false" destroy-on-close @close="closeDialog">
      <el-container>
        <!-- 关闭按钮 -->
        <el-header height="100px">
          <div class="closeContainer">
            <el-image :src="closeDialogPng" @click="closeDialog" fit="contain" />
          </div>
        </el-header>
        <!-- 弹窗表格加确认按钮-->
        <el-main class="my-dialog-main">
          <el-container>
            <el-aside width="8%" />
            <!-- 左边的表格 -->
            <el-aside width="45%" class="my-table">
              <ComponentTable
                class="chooseStockTable"
                :table-data="chooseStockList"
                @row-click="chooseStockClick"
                highlight-current-row
                :table-column="chooseStockColumns"
                height="320px"
              />
            </el-aside>
            <el-aside width="3%" />
            <!-- 右边的表格 -->
            <el-main width="45%">
              <div class="emptyStockText"> 物料详情 </div>
              <div class="emptyStockDetail">
                <div class="emptyStockDetailPng">
                  <el-image :src="emptyStockDetailPng" fit="contain" />
                </div>
                <div class="emptyStockDetailTable my-table">
                  <ComponentTable :table-data="stockInfoList" :table-column="emptyStockColumns" height="160px" />
                </div>
              </div>
              <div class="confirmContainer">
                <div class="confirmContect">
                  <el-image :src="confirmPng" @click="confirmChoose" fit="contain" />
                </div>
              </div>
            </el-main>
            <el-aside width="2%" />
          </el-container>
        </el-main>
        <el-footer height="100px" />
      </el-container>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/****************************************引入*****************************/
import upshelf from '@/assets/operatingterminal/images/upshelf.png'; //上架
import downshelf from '@/assets/operatingterminal/images/downshelf.png'; //下架

import confirmPng from '@/assets/operatingterminal/images/confirm.png';
import closeDialogPng from '@/assets/operatingterminal/images/closeDialog.png';
import emptyStockDetailPng from '@/assets/operatingterminal/images/emptyStockDetail.png';

import ComponentTable from './ComponentTable.vue';
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal';

/****************************************公共********************************/

/** 区域组件 */
defineOptions({ name: 'pickerComponentOperationArea6' });

//btnShow,无论是选择托盘还是托盘入库,点击后都要调用这个,用以确定按钮的显隐
const emit = defineEmits(['btnShow']);

const props = defineProps({
  currentLocationCode: {
    type: String,
    default: () => ''
  },
  //区域名称，仅用于显示
  location: {
    type: String,
    default: () => ''
  },

  //托盘或工装物料信息
  stockInfo: {
    type: Object,
    default: () => {}
  },
  //选择托盘列表(本仓库中存储库区的托盘与工装)
  chooseStockList: {
    type: Array,
    default: () => []
  },
  //弹窗左侧列配置
  chooseStockColumns: {
    type: Array,
    default: () => []
  },
  //弹窗右侧列配置
  emptyStockColumns: {
    type: Array,
    default: () => []
  },

  stockList: {
    type: Array,
    default: () => []
  },
  stockListlength: {
    type: Number,
    default: () => 4
  }
});

const message = useMessage(); // 消息弹窗

/*****************************************数据********************************/

//托盘入库按钮显示
const stockwarehouseVisible = ref<boolean>(false);
//选择托盘按钮显示
const chooseStockVisible = ref<boolean>(false);
//声明暴漏
defineExpose({ stockwarehouseVisible, chooseStockVisible });

/*****************************初始化******************************/

onMounted(() => {
  // const length = props.location.length;
  // const area = document.querySelector('.area');

  adjustSize(props.stockListlength);
});

const adjustSize = (value) => {
  if (value > 4) {
    const mainStocks = document.querySelectorAll('.main-stock');
    for (const mainStock of mainStocks) {
      mainStock.classList.remove('main-stock');
      mainStock.classList.add('main-stock2');
    }
  } else {
    const mainStocks = document.querySelectorAll('.main-stock2');
    for (const mainStock of mainStocks) {
      mainStock.classList.remove('main-stock2');
      mainStock.classList.add('main-stock');
    }
  }
};

/**********************************弹窗*******************************/

//选择托盘弹窗是否显示
const dialogVisible = ref<boolean>(false);
//弹窗里被选中的数据
const chooseStockRow = ref();
//弹窗中右侧物料列表
const stockInfoList = ref<any[]>([]);

//选择托盘按钮
const openDialog = (number) => {
  chooseStockRow.value = null;
  stockInfoList.value = [];
  dialogVisible.value = true;
};
//关闭弹窗
const closeDialog = () => {
  chooseStockRow.value = null;
  stockInfoList.value = [];
  dialogVisible.value = false;
};
//选中左侧表格
const chooseStockClick = async (row) => {
  console.log(row);
  chooseStockRow.value = row;
  stockInfoList.value = await OperatingtTerminalApi.getMaterialStockByTray(row);
};

/*********************************弹窗操作**************************/

//确认选择
const confirmChoose = async () => {
  if (chooseStockRow.value == null || chooseStockRow.value == undefined) {
    message.info('请选择托盘');
  }

  await OperatingtTerminalApi.palletUnloading(chooseStockRow.value.id, chooseStockRow.value.locationId, props.currentLocationCode);
  closeDialog();
  emit('btnShow');
  message.success('下架指令生成成功');
};

//上架
const stockWarehouseClick = async () => {
  await ElMessageBox.confirm('确定执行托盘上架操作？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  });
  await OperatingtTerminalApi.available(props.currentLocationCode);
  emit('btnShow');
  message.success('上架指令生成成功');
};
</script>

<style lang="scss">
.my-dialog {
  //弹窗样式
  .el-dialog {
    background-color: transparent;
    background-image: url('@/assets/operatingterminal/images/dialog.png');
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body,
  el-dialog__header {
    padding: 0;
  }
}
</style>
