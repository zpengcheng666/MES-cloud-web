<template>
  <div id="my-containner">
    <el-container>
      <el-header height="10vh">
        <!-- 扫码-->
        <div class="sacnCode">
          <el-image class="scanID" :src="IDPng" fit="contain" />
          <div class="scanText">ID扫码</div>
        </div>
      </el-header>
      <!-- <view>监听到的内容：{{ inputString }}</view> -->
      <!--上侧main-->
      <el-main class="top-main">
        <el-container>
          <el-aside class="aside1" width="2vw" />
          <!-- 拣选工作 -->
          <el-main>
            <div class="picker-work">
              <div class="picker-work-text"> 拣选工作出库单 </div>
              <div class="picker-work-table my-table">
                <ComponentTable
                  :table-data="outWarehouseDetailAndStockInfoList"
                  :table-column="pickerWorkColumns"
                  @row-click="chooseWarehouseDetailClick"
                  scroll-table-id="pickerWorkTableContainer"
                  height="25vh"
                />
              </div>
            </div>
          </el-main>
          <!-- 占位 -->
          <el-main>
            <div class="picker-placeholder"></div>
          </el-main>
          <!-- 拣选物料详情 -->
          <el-main>
            <div class="picker-material-detail">
              <div class="picker-material-detail-text"> 出库单物料详情 </div>
              <div class="picker-material-detail-table my-table">
                <ComponentTable
                  :table-data="materialStock"
                  :table-column="pickerMaterialDetailColumns"
                  scroll-table-id="pickerMaterialDetailTableContainer"
                  height="25vh"
                />
              </div>
            </div>
          </el-main>
          <el-aside class="aside2" width="2vw" />
        </el-container>
      </el-main>
      <!-- 占位 -->
      <el-main class="middle-main" />
      <!-- 下侧main -->
      <el-main class="bottom-main">
        <el-container>
          <el-aside class="aside3" width="2vw" />
          <el-main>
            <!-- 上部 -->
            <el-container>
              <!-- 拣选工作 -->
              <el-main>
                <div class="picker-work-stock">
                  <pickerComponentOperationArea6
                    ref="pickerWorkStockRef"
                    location="拣选工作"
                    :currentLocationCode="locationCode[0]"
                    :stockListlength="1"
                    :stockInfo="pickerAreaTrayInfo"
                    :chooseStockList="chooseStockList"
                    :chooseStockColumns="chooseStockColumns"
                    :emptyStockColumns="emptyStockColumns"
                    @btn-show="flushData"
                  />
                </div>
              </el-main>
              <!--占位-->
              <el-main><div class="bottom-main-middle-placeholder"></div></el-main>
              <el-main class="picker-material-main">
                <div class="picker-material-table my-table">
                  <ComponentTable
                    :table-data="pickerAreaMateriaInfo"
                    @row-click="choosePickStockClick"
                    @row-dblclick="chooseStockClickAndChange"
                    :table-column="chooseStockColumns"
                    height="18vh"
                    highlight-current-row
                  />
                </div>
                <div class="picker-material-btn">
                  <div class="warehouseIn" @click="openInSimpleDialog(pickerAreaTrayInfo.barCode)">
                    <el-image :src="warehouseInPng" fit="contain" />
                  </div>
                  <div class="warehouseOut" @click="openOutPickSimpleDialog">
                    <el-image :src="warehouseOutPng" fit="contain" />
                  </div>
                </div>
              </el-main>
            </el-container>
            <!-- 中部 -->
            <el-container class="bottom-container-middle-placeholder" />
            <!-- 下部 -->
            <el-container>
              <el-main>
                <div class="oprate-area-stock">
                  <pickerComponentOperationArea6
                    ref="oprateAreaStockRef"
                    location="操作区"
                    :currentLocationCode="locationCode[1]"
                    :stockListlength="1"
                    :stockInfo="oprateAreaTrayInfo"
                    :chooseStockList="chooseStockList"
                    :chooseStockColumns="chooseStockColumns"
                    :emptyStockColumns="emptyStockColumns"
                    @btn-show="flushData"
                  />
                </div>
              </el-main>
              <el-main><div class="bottom-main-middle-placeholder"></div></el-main>
              <el-main class="operate-material-main">
                <div class="operate-table-text"> 已就位 </div>
                <div class="operate-material-table my-table">
                  <ComponentTable
                    :table-data="oprateAreaMateriaInfo"
                    @row-click="chooseOperateStockClick"
                    @row-dblclick="chooseStockClickAndChange"
                    :table-column="chooseStockColumns"
                    height="15vh"
                    highlight-current-row
                  />
                </div>
                <div class="operate-material-btn">
                  <div class="warehouseIn" @click="openInSimpleDialog(oprateAreaTrayInfo.barCode)">
                    <el-image :src="warehouseInPng" fit="contain" />
                  </div>
                  <div class="warehouseOut" @click="openOutOpratenSimpleDialog">
                    <el-image :src="warehouseOutPng" fit="contain" />
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-main>
          <el-aside class="aside4" width="2vw" />
        </el-container>
      </el-main>
    </el-container>

    <SimpleDialogComponent ref="inSimpleDialogRef" title="签入物料" label="物料条码:" @simple-ok="inSimpleOK" />
    <SimpleDialogComponent ref="outSimpleDialogRef" title="签出物料" label="库位编码:" @simple-ok="outSimpleOK" />
  </div>
</template>

<script setup lang="ts">
/****************************引入****************************/
import IDPng from '@/assets/operatingterminal/images/ID.png';
import warehouseInPng from '@/assets/operatingterminal/images/warehouseIn.png';
import warehouseOutPng from '@/assets/operatingterminal/images/warehouseOut.png';

import useEasyLogin from '@/views/Login/components/easyLogin';
const { handleLogin } = useEasyLogin();

import $ from '@/views/wms/operatingterminal/jquery';
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal';
import ComponentTable from './components/ComponentTable.vue';
import pickerComponentOperationArea6 from './components/pickerComponentOperationArea6.vue';
import SimpleDialogComponent from './components/SimpleDialogComponent.vue';

/** 拣选工位操作终端  */
defineOptions({ name: 'PickerTerminal' });
const message = useMessage(); // 消息弹窗

/*******************************数据**************************/
const inputString = ref<string>('');
const simpleDialogRef = ref<any>(); //拣选物料弹窗
//拣选物料详情
const changeMaterialLoading = ref(false); //切换物料加载状态
// 弹窗
const inSimpleDialogRef = ref();
const outSimpleDialogRef = ref();

//仓库出库单和单上物料
const outWarehouseDetailList = ref<any[]>([]);
const outWarehouseDetailAndStockInfoList = ref<any[]>([]); //另一种形式

//选择托盘列表(本仓库中存储库区的托盘与工装)
const chooseStockList = ref<any[]>([]);

//拣选工作
const pickerAreaTrayInfo = ref<any>(); //托盘或工装物料信息
const pickerAreaMateriaInfo = ref<any>([]); //容器绑定物料列表
//操作区
const oprateAreaTrayInfo = ref<any>(); //托盘或工装物料信息
const oprateAreaMateriaInfo = ref<any>([]); //容器绑定物料列表

//拣选工作按钮是否显示
const pickerWorkStockRef = ref({
  stockwarehouseVisible: false,
  chooseStockVisible: false
});
//操作区按钮是否显示
const oprateAreaStockRef = ref({
  stockwarehouseVisible: false,
  chooseStockVisible: false
});

//表格选中数据
// const chooseStockRow = ref();
//选择出库单
const outWarehouseDetaiClick = ref();
//出库单物料详情
const materialStock = ref<any[]>([]);
//单击拣选物料
const pickerMaterialClick = ref();
const operateMaterialClick = ref();

/****************************配置信息***********************************************/

//库区编码
const areaCode = ref<string>('DXJBQ1');
//库位编码
const locationCode = ref<string[]>(['YGB#DXJBQ1#-S1', 'YGB#DXJBQ1#-S2']);

//ID扫码
const userCode = ref<string>('');

/****************************初始化***********************************************/

onMounted(async () => {
  handleLogin({ tenantName: '上海弥彧', username: 'miyutech', password: 'admin123' } as any);
  //登录

  setInterval(async () => {
    timerData();
  }, 10000);
  timerData();
  flushData();
});

// 定时数据
const timerData = () => {
  //物料待出库单
  getOutWarehouseDetail(areaCode.value);
};

const flushData = async() => {
  //获得本仓库中存储库区的托盘与工装
  chooseDownShelfTray();
  //获取两个库位上的托盘或工装信息
  getTrayInfoByLocationCode().then(() => {
    //根据两个库位上是否存在托盘设置按钮是否显示
    showButton();
  });
}

const chooseDownShelfTray = async () => {
  //获得本仓库中存储库区的托盘与工装
  chooseStockList.value = await OperatingtTerminalApi.getMaterialStockByAreaAndAreaTypeEq1(areaCode.value);
};

//获得本仓库出库单和单上物料
const getOutWarehouseDetail = async (areaCode: any) => {
  outWarehouseDetailList.value = await OperatingtTerminalApi.getOutWarehouseDetailAndStockInfo(areaCode);
  //通过库区查询仓库出库单和单上物料
  //[{outWarehouseDetail:数据,materialStock:数据},...]

  outWarehouseDetailAndStockInfoList.value = [];
  for (let item of outWarehouseDetailList.value) {
    outWarehouseDetailAndStockInfoList.value.push({
      ...item.outWarehouseDetail,
      outTypeName: getDictLabel(DICT_TYPE.WMS_OUT_TYPE, item.outWarehouseDetail.outType),
      outStateName: getDictLabel(DICT_TYPE.WMS_OUT_STATE, item.outWarehouseDetail.outState),
      materialStock: item.materialStock
    });
  }
};

// 获取拣选库位上的托盘信息
const getTrayInfoByLocationCode = async () => {
  //获取两个库位上的托盘或工装信息
  await getMaterialStockByLocationCode(locationCode.value[0]).then((res) => {
    pickerAreaTrayInfo.value = res.trayInfo;
    pickerAreaMateriaInfo.value = res.onTrayMaterialInfo;
  });

  await getMaterialStockByLocationCode(locationCode.value[1]).then((res) => {
    oprateAreaTrayInfo.value = res.trayInfo;
    oprateAreaMateriaInfo.value = res.onTrayMaterialInfo;
  });
};

//获得指定库位绑定的托盘或工装信息
const getMaterialStockByLocationCode = async (locationCode: any) => {
  let trayInfo = undefined;
  let onTrayMaterialInfo: any = undefined;
  console.log('locationCode', locationCode);
  let materialStock = await OperatingtTerminalApi.getMaterialStockByLocationCode(locationCode);
  if (materialStock?.materialType == 'TP' || materialStock?.materialType == 'GZ') {
    trayInfo = materialStock;
    onTrayMaterialInfo = await OperatingtTerminalApi.getMaterialStockByTray(trayInfo);
  }
  return { onTrayMaterialInfo: onTrayMaterialInfo, trayInfo: trayInfo };
};

//根据两个库位上是否存在托盘设置按钮是否显示
const showButton = () => {
  if (!pickerAreaTrayInfo.value?.id && !oprateAreaTrayInfo.value?.id) {
    //上下都是空
    pickerWorkStockRef.value.chooseStockVisible = false; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = false; //上 托盘入库(上架)
    oprateAreaStockRef.value.stockwarehouseVisible = true; //下 选择托盘
    oprateAreaStockRef.value.chooseStockVisible = true; //下 托盘入库(上架)
  } else if (!pickerAreaTrayInfo.value?.id && oprateAreaTrayInfo.value?.id) {
    //下存在上空
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    oprateAreaStockRef.value.stockwarehouseVisible = true; //下 选择托盘
    oprateAreaStockRef.value.chooseStockVisible = true; //下 托盘入库(上架)
  } else if (pickerAreaTrayInfo.value?.id && oprateAreaTrayInfo.value?.id) {
    //上下都存在
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    oprateAreaStockRef.value.stockwarehouseVisible = false; //下 选择托盘
    oprateAreaStockRef.value.chooseStockVisible = false; //下 托盘入库(上架)
  } else if (pickerAreaTrayInfo.value?.id && !oprateAreaTrayInfo.value?.id) {
    //上存在下空
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    oprateAreaStockRef.value.stockwarehouseVisible = false; //下 选择托盘
    oprateAreaStockRef.value.chooseStockVisible = false; //下 托盘入库(上架)
  }
};

/***************************************************选择逻辑*****************************/

// 选中出库单
const chooseWarehouseDetailClick = (row) => {
  //单机拣选，显示详情单子
  if (row != null && row.materialStock != null) {
    //仓库出库单和单上物料(存在materialStock)
    outWarehouseDetaiClick.value = row;
    materialStock.value = []; //出库单初始化为空
    materialStock.value.push(row.materialStock);
  }
};
// 选中拣选区物料
const choosePickStockClick = (row) => {
  //容器绑定物料列表
  pickerMaterialClick.value = row;
};
// 选中操作区物料
const chooseOperateStockClick = (row) => {
  operateMaterialClick.value = row;
};

/************************************************签入签出**********************/

const currInTrayCode = ref<string>(''); //当前选择的托盘id
// 签入弹窗2
const openInSimpleDialog = (trayBarCode: string) => {
  if (!trayBarCode) {
    return;
  }
  currInTrayCode.value = trayBarCode;
  inSimpleDialogRef.value.openDialog();
};

const pickOrOprate = ref<number>(0);
// 签出弹窗3
const openOutPickSimpleDialog = () => {
  if (!pickerMaterialClick.value) {
    message.error('请先选择签出物料');
    return;
  }
  pickOrOprate.value = 1;
  outSimpleDialogRef.value.openDialog();
};
const openOutOpratenSimpleDialog = () => {
  if (!operateMaterialClick.value) {
    message.error('请先选择签出物料');
    return;
  }
  pickOrOprate.value = 2;
  outSimpleDialogRef.value.openDialog();
};

// 签入确认
const inSimpleOK = async (v1: string, v2: string) => {
  warehouseIn(v1, currInTrayCode.value);
};
// 签出确认
const outSimpleOK = async (v1: string, v2: string) => {
  if (pickOrOprate.value == 1) {
    warehouseOut(pickerMaterialClick.value.barCode, v1);
  }
  if (pickOrOprate.value == 2) {
    warehouseOut(operateMaterialClick.value.barCode, v1);
  }
  pickOrOprate.value = 0;
};

//签入
const warehouseIn = async (barCode: string, storageCode: string) => {
  const data = {
    barCode: barCode,
    storageCode: storageCode
  };
  if (await OperatingtTerminalApi.checkIn(data)) {
    message.success('签入成功');
    flushData();
  } else {
    message.error('签入失败');
  }
};
//签出
const warehouseOut = async (barCode, locationCode) => {
  const data = {
    barCode: barCode,
    locationCode: locationCode
  };
  if (await OperatingtTerminalApi.checkOut(data)) {
    message.success('签出成功');
    flushData();
  } else {
    message.error('签出失败');
  }
};

/************************************************托盘物料交换逻辑**********************/

//表格双击(托盘物料交换)
const chooseStockClickAndChange = (row) => {
  if (changeMaterialLoading.value) {
    message.warning('拣选');
    return;
  }
  changeMaterialLoading.value = true;
  changeOnTrayMaterialStorage(row.barCode)
    .then(() => {
      changeMaterialLoading.value = false;
      message.success('拣选成功');
    })
    .catch(() => {
      changeMaterialLoading.value = false;
      message.error('拣选失败');
    });
};

//托盘物料交换
const changeOnTrayMaterialStorage = async (barCode) => {
  let orderId = null;
  let type = 0;
  // 如果要分拣的物料 有待出库单 则传入待出库单的id
  if (outWarehouseDetaiClick.value && outWarehouseDetaiClick.value.chooseBarCode === barCode) {
    orderId = outWarehouseDetaiClick.value.id;
  }

  let materialInfo = ref(); //物料信息
  let trayInfo = ref(); //目标托盘或工装

  if (pickerAreaMateriaInfo.value != null) {
    for (const item of pickerAreaMateriaInfo.value) {
      //物料为拣选工作区
      if (item.barCode == barCode) {
        materialInfo.value = item;
        trayInfo.value = oprateAreaTrayInfo.value;
        type = 1;
        break;
      }
    }
  }
  if (oprateAreaMateriaInfo.value != null) {
    for (const item of oprateAreaMateriaInfo.value) {
      //物料为操作区
      if (item.barCode == barCode) {
        materialInfo.value = item;
        trayInfo.value = pickerAreaTrayInfo.value;
        type = 2;
        break;
      }
    }
  }

  if (materialInfo.value == null) {
    message.error('未找到该物料');
    return;
  }
  if (trayInfo.value == null) {
    message.error('无托盘');
    return;
  }
  if(type === 1 && orderId == null){
    message.error('请先选择出库单');
    return;
  }
  if (type === 2) {
    for (const item of outWarehouseDetailAndStockInfoList.value) {
      if(item.chooseBarCode === barCode){
        message.error('存在出库单,不能被拣选!');
        return;
      }
    }
  }
  await OperatingtTerminalApi.changeBindTray(materialInfo.value.id, trayInfo.value.id, orderId);
  await flushData();
};

/**
 * 扫描枪工具类
 */
var ScanCodeUtil = {
  keys: [], //已输入按键
  verify: function (key) {
    //验证按键是否有效
    if (key.keyCode == 13) return true;
    //Enter

    if ('0123456789'.includes(key.key)) return true;
    if ('abcdefghijklmnopqrstuvwxyz'.includes(key.key)) return true;
    if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(key.key)) return true;
    if ('-_=+[]{};:\'"\\|,.<>/?'.includes(key.key)) return true;

    return false;
  },
  execute: function (key, callback) {
    if (!this.verify(key)) return; //按键无效

    if (key.keyCode == 13) {
      //回车

      let endTime = key.timeStamp;
      let code = '';

      this.keys.reverse(); //反转数组
      for (const key of this.keys) {
        if (endTime - key.timeStamp < 100) {
          //检测按键是否有效(输入间隔短)
          endTime = key.timeStamp;
          code = key.key + code;
        } else {
          this.keys = [];
          return;
        }
      }
      this.keys = [];
      if (code) {
        callback(code);
      }
    } else {
      //非回车
      this.keys.push(key); //添加按键
    }
  },
  listen: function (callback) {
    //1.模拟聚焦使得页面可以监听到扫描事件
    let $scanCodeInput = $("<input type='text'/>");
    // setTimeout(() => {
    $('body').append($scanCodeInput);
    $scanCodeInput.focus();
    $scanCodeInput.remove();
    // }, 1000);

    //2.监听扫描事件
    $('body').keydown(function (event) {
      ScanCodeUtil.execute(event, callback);
    });
  }
};

$(function () {
  ScanCodeUtil.listen(function (code) {
    changeOnTrayMaterialStorage(code);
  });
});

/********************************列配置*******************************/
//拣选工作(列)
const pickerWorkColumns = [
  {
    prop: 'orderNumber',
    label: '出库单号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'outTypeName',
    label: '出库类型',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'outStateName',
    label: '出库状态',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'targetWarehouseCode',
    label: '目标仓库',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'chooseBarCode',
    label: '物料条码',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'quantity',
    label: '数量',
    width: '10%',
    align: 'center'
  }
];
//拣选物料详情(列)
const pickerMaterialDetailColumns = [
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'materialCode',
    label: '物料类码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '物料条码',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'materialName',
    label: '物料名称',
    width: '30%',
    align: 'center'
  }
];

//拣选物料
const chooseStockColumns = [
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '物料条码',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'totality',
    label: '数量',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'storageCode',
    label: '位置',
    width: '30%',
    align: 'center'
  }
];

//弹窗右侧
const emptyStockColumns = [
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '物料条码',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'totality',
    label: '数量',
    width: '30%',
    align: 'center'
  }
];
</script>

<style lang="scss">
@import url('@/assets/operatingterminal/scss/pickerterminal.scss');
</style>
