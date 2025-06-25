<template>
  <div id="myContainner">
    <el-container>
      <el-header height="10vh">
        <!-- 扫码-->
        <div class="sacnCode">
          <el-image class="scanID" :src="IDPng" fit="contain" />
          <div class="scanText">ID扫码</div>
        </div>
      </el-header>

      <el-main>
        <!-- main上部 -->
        <el-container class="top-main">
          <el-aside width="2vw" height="35vh" />
          <el-main>
            <el-container class="top-main-container">
              <el-main class="material-in-position">
                <div class="material-in-position-text"> 装卸任务 </div>
                <div class="material-in-position-table my-table">
                  <ComponentTable
                    v-show="processTaskList"
                    :table-data="processTaskList"
                    :table-column="processTaskListColumns"
                    @row-click="getBatchDetailByRecordId"
                    scroll-table-id="loadMaterialInPositionTableContainer"
                    height="30vh"
                  />
                </div>
              </el-main>
              <el-main class="picker-material-detail">
                <div class="picker-material-detail-text"> 工序物料详情 </div>
                <div class="picker-material-detail-table my-table">
                  <ComponentTable
                    :table-data="processTaskMaterialList"
                    :table-column="pickerMaterialDetailColumns"
                    @row-click="loadAndUnload"
                    scroll-table-id="loadPickerMaterialDetailTableContainer"
                    height="30vh"
                  />
                </div>
              </el-main>
            </el-container>
          </el-main>
          <el-aside width="2vw" height="35vh" />
        </el-container>
        <!-- main中部占位 -->
        <el-container class="middle-main" />
        <!-- main下部 -->
        <el-container class="bottom-main">
          <el-aside width="2vw" height="50vh" />
          <el-container>
            <!-- 左下侧托盘操作 -->
            <el-main class="stock-main">
              <el-container class="stock-main-picker">
                <el-main class="picker-work-stock">
                  <ComponentOperationArea6
                    ref="pickerWorkStockRef"
                    location="拣选"
                    :stockListlength="1"
                    :areaCode="areaCode"
                    :stockInfo="pickerAreaTrayInfo"
                    :currentLocationCode="locationCode[0]"
                    :chooseStockColumns="chooseStockColumns"
                    :emptyStockColumns="emptyStockColumns"
                    @btn-show="showButton"
                  />
                </el-main>
              </el-container>
              <el-container class="stock-main-install-position">
                <el-main class="install-position-stock">
                  <ComponentOperationArea6
                    ref="installPositionStockRef"
                    location="安装位置"
                    :stockListlength="1"
                    :areaCode="areaCode"
                    :stockInfo="oprateAreaTrayInfo"
                    :currentLocationCode="locationCode[1]"
                    :chooseStockColumns="chooseStockColumns"
                    :emptyStockColumns="emptyStockColumns"
                    @btn-show="showButton"
                  />
                </el-main>
              </el-container>
            </el-main>
            <!-- 右下侧装卸操作 -->
            <el-main class="load-task-operate">
              <el-container>
                <el-main class="load-task-operate-text-main">
                  <div class="load-task-operate-text"> 装卸任务操作 </div>
                </el-main>
              </el-container>
              <el-container>
                <el-main class="load-task-operate-input-main">
                  <div class="load-task-operate-input my-input">
                    <el-form ref="formRef" :model="formData" class="form-style" label-width="100px">
                      <el-form-item label="生产任务单号" prop="processTaskNumber">
                        <el-input v-model="formData.processTaskNumber" placeholder="请输入" class="my-input-item" readonly />
                      </el-form-item>
                      <el-form-item label="工艺规程名称" prop="processName">
                        <el-input v-model="formData.processName" placeholder="请输入" class="my-input-item" readonly />
                      </el-form-item>
                      <el-form-item label="工艺版本" prop="technologyCode">
                        <el-input v-model="formData.technologyCode" placeholder="请输入" class="my-input-item" readonly />
                      </el-form-item>
                      <el-form-item label="工序名称" prop="processTaskName">
                        <el-input v-model="formData.processTaskName" placeholder="请输入" class="my-input-item" readonly />
                      </el-form-item>

                      <el-form-item label="物料条码" prop="materialBarCode">
                        <el-input v-model="formData.materialBarCode" placeholder="请输入" class="my-input-item" :readonly="mterialBarCodeReadonly" />
                      </el-form-item>
                      <el-form-item label="工装条码" prop="toolingBarCode">
                        <el-input
                          v-model="formData.toolingBarCode"
                          @input="handleMaterialNumberChange"
                          placeholder="请输入"
                          class="my-input-item"
                          :readonly="targetBarCodeReadonly"
                        />
                      </el-form-item>
                      <el-form-item label="工装位号" prop="toolingPosition" v-if="toolingPositionHas">
                        <el-input v-model="formData.toolingPosition" placeholder="请输入" class="my-input-item" />
                      </el-form-item>
                    </el-form>
                  </div>
                  <!--
                  <div class="my-input" v-show="showQuantityInput" style="width: 5vw; position: absolute; top: 59%; right: 5%">
                    <el-form ref="formRef" :model="formData" class="form-style" label-position="top">
                      <el-form-item prop="toolingBarCode">
                        <el-input v-model="formData.installUnloadQuantity" @change="checkQuantity" placeholder="装卸数量" class="my-input-item" />
                      </el-form-item>
                    </el-form>
                  </div>
                  -->
                </el-main>
              </el-container>
              <el-container>
                <el-main class="load-task-operate-btn-main">
                  <div class="start-work-btn-bg">
                    <el-image :src="loadStartWorkPng" v-show="!showStartOREndDialog" @click="startSubmit" fit="contain" />
                  </div>
                  <div class="end-work-btn-bg" v-show="showStartOREndDialog" @click="endSubmit">
                    <el-image :src="loadEndWorkPng" fit="contain" />
                  </div>
                  <div class="check-file-btn-bg">
                    <el-image :src="loadCheckFilePng" @click="downloadCheckFile" fit="contain" />
                  </div>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
          <el-aside width="2vw" height="50vh" />
        </el-container>
      </el-main>
      <el-footer height="4vh" />
    </el-container>
  </div>
</template>

<script setup lang="ts">
/*******************************引入**************************/

import ComponentOperationArea6 from './components/loadandunloadComponentOperationArea6.vue';
import ComponentTable from './components/ComponentTable.vue';

import useEasyLogin from '@/views/Login/components/easyLogin';
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal';
import { MaterialConfigApi } from '@/api/wms/materialconfig';
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import * as loadandunloadUtils from './loadandunloadUtils';

import IDPng from '@/assets/operatingterminal/images/ID.png';
import loadStartWorkPng from '@/assets/operatingterminal/images/loadStartWork.png';
import loadEndWorkPng from '@/assets/operatingterminal/images/loadEndWork.png';
import loadCheckFilePng from '@/assets/operatingterminal/images/loadCheckFile.png';

/**********************************公共***************************/

const { handleLogin } = useEasyLogin();
const message = useMessage(); // 消息弹窗

/** 装卸工位操作  */
defineOptions({ name: 'LoadAndUnloadTerminal' });

/****************************配置数据**************************************************/

//仓库编码
const warehouseCode = ref<string>('YGB');
//库区编码
const areaCode = ref<string>('DXJBQ1');
//库位编码
const locationCode = ref<string[]>(['YGB#DXJBQ1#-S1', 'YGB#DXJBQ1#-S2']);

//设备id
const deviceId = ref<string>('1861588280927195137');
//用户id
const userId = ref<any>();

import { LedgerApi } from '@/api/dms/ledger';
import { WarehouseAreaApi } from '@/api/wms/warehousearea';
//获得配置数据
async function getConfig() {
  //根据ip获得设备
  // let stationData = await LedgerApi.getLedgerByIp(null);
  // if (stationData == null) {
  //   ElNotification({
  //     title: '成功',
  //     message: '此ip未被任何设备绑定',
  //     type: 'error'
  //   });
  //   throw new Error('此ip未被任何设备绑定');
  // }
  // deviceId.value = stationData.id;

  //设备库位对应,仅物料库位(type=0)
  let ledgerToLocation = (await LedgerApi.getLedgerToLocationList(deviceId.value)).filter((v) => v.type == 0);
  if (ledgerToLocation.length < 2) {
    throw new Error('设备对应库位不足');
  }
  //库位id列表
  let locationIds = ledgerToLocation.map((v) => v.location);
  //通过库位id列表查询库位信息
  let locationDatas = await OperatingtTerminalApi.getWarehouseLocationListByIds(locationIds);
  //排序库位
  locationDatas.sort((a, b) => a.site - b.site);
  //库位编码列表
  let locationCodes = locationDatas.map((v) => v.locationCode);
  //设置库位编码
  locationCode.value[0] = locationCodes[0];
  locationCode.value[1] = locationCodes[1];

  //获得库区数据
  let areaData = await WarehouseAreaApi.getWarehouseArea(locationDatas[0].warehouseAreaId);
  //设置库区编码
  areaCode.value = areaData.areaCode;
}

/****************************数据***********************************************/

/*
 * 左侧数据
 */

//选择托盘列表(本仓库中存储库区的托盘与工装)
const chooseStockList = ref<any[]>([]);

//工序任务列表
const processTaskList = ref<any[]>([]);
//工序物料详情列表
const processTaskMaterialList = ref();

//选择的工序物料任务(物料详情)
const chooseProcessMaterial = ref<any>();
/*
McsBatchDetailDTO,批次零件任务
  processTask:McsBatchRecordDTO,批次任务
    processInfo:McsPlanProcessDTO,工序
*/

/*
 * 托盘数据
 */

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
const installPositionStockRef = ref({
  stockwarehouseVisible: false,
  chooseStockVisible: false
});

/*
 * 表单数据
 */

const mterialBarCodeReadonly = ref<boolean>(false);
//物料条码是否只读
const targetBarCodeReadonly = ref<boolean>(false);
//工装条码是否只读
const toolingPositionHas = ref<boolean>(false);
//工装位号是否存在

const showStartOREndDialog = ref<boolean>(false);
//显示开工还是完工,true:完工

const formData = ref({
  processTaskNumber: null, //生产任务单号
  processName: null, //工艺规程名称
  technologyCode: null, //工艺规程号
  partVersion: null, //版本
  processTaskName: null, //工序名称

  materialBarCode: null, //物料条码
  toolingBarCode: null, //工装条码(托盘/托盘上的工装)
  toolingPosition: null, //工装位号

  installUnloadQuantity: null //装卸数量
});
//表单内容

/*
 * 其他数据
 */

const showQuantityInput = ref<boolean>(false);
//是否显示装饰数量
const materialTotality = ref<number>();
//当前物料的总数量

// const bindMaterialNumberList = ref<any[]>(['1', '2']);
//工序任务指定的工件编号
// const bindMaterialClampNumberList = ref<any[]>(['1', '2']);
//工序任务指定的工装编号

/***************************************************初始化*********************************************/

onMounted(async () => {
  userId.value = await handleLogin({ tenantName: '上海弥彧', username: 'miyutech', password: 'admin123' } as any);

  // await getConfig();

  flushData();

  setInterval(async () => {
    flushData();
  }, 50000);
});

async function flushData() {
  //通过设备Id获取工序任务
  getProcessTaskByDeviceId(deviceId.value);

  //获取两个库位上的托盘或工装信息
  let data = await getMaterialStockByLocationCode(locationCode.value[0]);
  pickerAreaTrayInfo.value = data.trayInfo;
  pickerAreaMateriaInfo.value = data.onTrayMaterialInfo;
  data = await getMaterialStockByLocationCode(locationCode.value[1]);
  console.log(data);
  oprateAreaTrayInfo.value = data.trayInfo;
  oprateAreaMateriaInfo.value = data.onTrayMaterialInfo;

  //根据两个库位上是否存在托盘设置按钮是否显示
  showButton();
}

//通过设备Id获取工序任务
const getProcessTaskByDeviceId = async (deviceId: string) => {
  let process = await OperatingtTerminalApi.getProcessTaskByDeviceId(deviceId); //通过设备Id获取工序任务
  for (const pro of process) {
    pro.processInfo = await OperatingtTerminalApi.getProcessByRecordId(pro.id); //根据批次任务id 获取工序详情
    pro.procedureName = pro.processInfo.procedureName; //工序名称(加工路线)
    pro.statusName = getDictLabel('mcs_batch_record_status', pro.status);
  }
  processTaskList.value = process;
};

//获得指定库位绑定的托盘或工装信息
const getMaterialStockByLocationCode = async (locationCode: any) => {
  let trayInfo = undefined;
  let onTrayMaterialInfo: any = undefined;

  let materialStock = await OperatingtTerminalApi.getMaterialStockByLocationCode(locationCode);
  if (materialStock?.materialType == 'TP' || materialStock?.materialType == 'GZ') {
    materialStock.materialTypeName = getDictLabel(DICT_TYPE.WMS_MATERIAL_TYPE, materialStock.materialType);
    //获得物料类型名称

    trayInfo = materialStock;
    onTrayMaterialInfo = await OperatingtTerminalApi.getMaterialStockByTray(trayInfo);
    //获得绑定在此容器上的物料

    if (onTrayMaterialInfo != null) {
      for (const item of onTrayMaterialInfo) {
        item.materialTypeName = getDictLabel(DICT_TYPE.WMS_MATERIAL_TYPE, item.materialType);
        //获取物料类型名称
      }
    }
  }
  return { onTrayMaterialInfo: onTrayMaterialInfo, trayInfo: trayInfo };
};

//根据两个库位上是否存在托盘设置按钮是否显示
const showButton = () => {
  if (!pickerAreaTrayInfo.value?.id && !oprateAreaTrayInfo.value?.id) {
    //上下都是空
    pickerWorkStockRef.value.chooseStockVisible = false; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = false; //上 托盘入库(上架)
    installPositionStockRef.value.stockwarehouseVisible = true; //下 选择托盘
    installPositionStockRef.value.chooseStockVisible = true; //下 托盘入库(上架)
  } else if (!pickerAreaTrayInfo.value?.id && oprateAreaTrayInfo.value?.id) {
    //下存在上空
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    installPositionStockRef.value.stockwarehouseVisible = true; //下 选择托盘
    installPositionStockRef.value.chooseStockVisible = true; //下 托盘入库(上架)
  } else if (pickerAreaTrayInfo.value?.id && oprateAreaTrayInfo.value?.id) {
    //上下都存在
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    installPositionStockRef.value.stockwarehouseVisible = false; //下 选择托盘
    installPositionStockRef.value.chooseStockVisible = false; //下 托盘入库(上架)
  } else if (pickerAreaTrayInfo.value?.id && !oprateAreaTrayInfo.value?.id) {
    //上存在下空
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    installPositionStockRef.value.stockwarehouseVisible = false; //下 选择托盘
    installPositionStockRef.value.chooseStockVisible = false; //下 托盘入库(上架)
  }

  //存在进行中任务
  if (!verificationProcessTaskListAllStatusNot2()) {
    installPositionStockRef.value.chooseStockVisible = false; //下 托盘入库(上架)
  }
};

//校验工序任务的status是否全部不为2(没有进行中任务)
function verificationProcessTaskListAllStatusNot2() {
  return processTaskList.value.every((v) => v.status != 2);
}

/*******************************************表格操作************************************/

//装卸任务点击
//根据任务(批次)id 查询详细任务(零件)
const getBatchDetailByRecordId = async (row) => {
  resetFormData();
  //根据任务(批次)id 查询详细任务(零件)
  let processTaskMaterialListLocal = await OperatingtTerminalApi.getBatchDetailByRecordId(row.id);
  if (processTaskMaterialListLocal == null || processTaskMaterialListLocal.length != 1) {
    throw new Error('详细任务(零件)不是1个');
  }
  let material = processTaskMaterialListLocal[0];
  material.processTask = row;
  material.materialCode = row.processInfo.part.materialCode; //材料类码
  material.materialDesg = row.processInfo.part.materialDesg; //材料牌号
  material.materialName = row.processInfo.part.materialName; //材料名称
  material.statusName = getDictLabel('mcs_order_detail_status', material.status);

  //根据任务(批次)id,工位/产线id 查询物料需求:McsBatchResourceDTO
  let batchResourceList = await OperatingtTerminalApi.getBatchResourceByRecordId(row.id, deviceId.value);
  //设置显示列表
  processTaskMaterialList.value = [];
  for (let batchResource of batchResourceList) {
    //物料需求为工装
    if (batchResource.resourceType == 'GZ') {
      processTaskMaterialList.value.push({
        ...material,
        batchResource: batchResource,
        resourceType: batchResource.resourceType,
        resourceTypeName: batchResource.resourceType == 'GZ' ? '工装' : '零件',
        resourceBarCode: batchResource.barCode
      });
    } else if (batchResource.resourceType == 'GJ') {
      //物料需求为工件(物料)
      if (material.barCode != null && material.barCode != '') {
        //任务已经绑定物料,只添加对应的数据
        if (material.barCode == batchResource.barCode) {
          processTaskMaterialList.value.push({
            ...material,
            batchResource: batchResource,
            resourceType: batchResource.resourceType,
            resourceTypeName: batchResource.resourceType == 'GZ' ? '工装' : '零件',
            resourceBarCode: batchResource.barCode
          });
        }
      } else {
        processTaskMaterialList.value.push({
          ...material,
          batchResource: batchResource,
          resourceType: batchResource.resourceType,
          resourceTypeName: batchResource.resourceType == 'GZ' ? '工装' : '零件',
          resourceBarCode: batchResource.barCode
        });
      }
    }
  }
};

/*******************************************表单相关************************************/

//工序物料详情点击
const loadAndUnload = async (row) => {
  /*
    row:McsBatchDetailDTO,批次零件任务
      processTask:McsBatchRecordDTO,批次任务
        processInfo:McsPlanProcessDTO,工序
      batchResource:物料需求
  */
  resetFormData(false);

  mterialBarCodeReadonly.value = false;
  targetBarCodeReadonly.value = false;
  toolingPositionHas.value = false;
  //初始化
  if (row.barCode != null && row.barCode != '') {
    //存在物料条码(仅使用此物料条码)
    formData.value.materialBarCode = row.barCode;
    mterialBarCodeReadonly.value = true;

    if (row.status == 3) {
      //当前状态为进行中(意味着物料已绑定到目标位置)
      targetBarCodeReadonly.value = true;
      formData.value.toolingBarCode = await OperatingtTerminalApi.getClampByMaterialBarCode(row.barCode);
      //根据工件查询绑定的工装编号
    }
  }

  if (row.status == 3) {
    showStartOREndDialog.value = true;
  } else {
    showStartOREndDialog.value = false;
  }
  //判断显示开工完工按钮

  chooseProcessMaterial.value = row;
  //选择的工序物料任务

  // let resourceList = row.processTask.processInfo.resourceList;
  // //制造资源列表:McsPlanResourcesDTO
  // for (const resource of resourceList) {
  //   if (resource.resourcesType == 3) {
  //     //此为工装类型，工装ID数据待完善
  //     if (resource.bindMaterialNumberList != null && resource.bindMaterialNumberList.length > 0) {
  //       bindMaterialNumberList.value = resource.bindMaterialNumberList;
  //       bindMaterialClampNumberList.value = resource.bindMaterialClampNumberList;
  //     }
  //   }
  // }

  formData.value.processTaskNumber = row.processTask.number;
  formData.value.processName = row.processTask.processInfo.part.processName;
  formData.value.technologyCode = row.processTask.technologyCode;
  formData.value.partVersion = row.processTask.processInfo.part.partVersion;
  formData.value.processTaskName = row.processTask.procedureName;
  //填充表单数据
};

//工装条码修改,根据选择的工装判断是否为单储位,设置工装位号是否存在
async function handleMaterialNumberChange(barCode) {
  //获得物料库存
  const materiaStock = oprateAreaMateriaInfo.value.find((v) => v.barCode == barCode);
  if (materiaStock == null) return;
  //获得物料类型
  const materiaConfig = await MaterialConfigApi.getMaterialConfig(materiaStock.materialConfigId);
  //目标工装为多储位
  if (materiaConfig.materialStorage == 0) {
    //允许设置工装位号
    toolingPositionHas.value = true;
  } else {
    toolingPositionHas.value = false;
  }
}

//重置表单数据
function resetFormData(isForce = true) {
  if (isForce) {
    formData.value = {
      processTaskNumber: null, //生产任务单号
      processName: null, //工艺规程名称
      technologyCode: null, //工艺规程号
      partVersion: null, //版本
      processTaskName: null, //工序名称
      materialBarCode: null, //物料条码
      toolingBarCode: null, //工装条码(托盘/托盘上的工装)
      toolingPosition: null, //工装位号
      installUnloadQuantity: null //装卸数量
    };
  } else {
    formData.value = {
      processTaskNumber: null, //生产任务单号
      processName: null, //工艺规程名称
      technologyCode: null, //工艺规程号
      partVersion: null, //版本
      processTaskName: null, //工序名称
      materialBarCode: formData.value.materialBarCode,
      toolingBarCode: formData.value.toolingBarCode,
      toolingPosition: formData.value.toolingPosition,

      installUnloadQuantity: null //装卸数量
    };
  }
}

/*******************************************其他表单************************************/

//查看文件
const downloadCheckFile = () => {
  let url = 'http://test.yudao.iocoder.cn/4065d16055b90221a21fdf5c641174798c4d399ff636d8519f07db961ac019d5.doc';
  window.open(url, '_blank');
};

/*******************************************开工完工************************************/

//开工
const startSubmit = async () => {
  loadandunloadUtils.setData({
    processTaskMaterialList: processTaskMaterialList.value,
    chooseProcessMaterial: chooseProcessMaterial.value,
    pickerAreaTrayInfo: pickerAreaTrayInfo.value,
    pickerAreaMateriaInfo: pickerAreaMateriaInfo.value,
    oprateAreaTrayInfo: oprateAreaTrayInfo.value,
    oprateAreaMateriaInfo: oprateAreaMateriaInfo.value,
    formData: formData.value
  });
  //设置工具类数据
  let err: string = loadandunloadUtils.startSubmitVerification();
  //使用工具类进行数据校验
  if (err != '') {
    message.error(err);
    return;
  }

  // if (showQuantityInput.value) {
  //   if (formData.value.installUnloadQuantity == null) {
  //     message.error('请先输入装卸数量');
  //     return;
  //   }
  // }
  // let stepId = getStepId(chooseProcessMaterial.value.processTask.processInfo.stepList, chooseProcessMaterial.value.recordList);

  let data = {
    type: loadandunloadUtils.getType(),
    //搬运类型
    pickerAreaTrayId: pickerAreaTrayInfo.value.id,
    //拣选位置容器库存id
    toolingBarCode: formData.value.toolingBarCode,
    //工装条码(托盘/托盘上的工装)
    toolingPosition: formData.value.toolingPosition,
    //工装位号

    batchRecordId: chooseProcessMaterial.value.processTask.id,
    //批次编码
    materialBarCode: formData.value.materialBarCode,
    //物料条码
    deviceId: deviceId.value,
    //设备编id
    operatorId: '' + userId.value
    //操作者

    // batchDetailId: chooseProcessMaterial.value.id,
    // //批次零件id
    // partBatchNumber: chooseProcessMaterial.value.partBatchNumber,
    // //物料批次码
    // unitNumber: null,
    // //生产单元(产线/工位)编码
    // time: new Date()
    // //操作时间
  };
  await OperatingtTerminalApi.changeBindTrayLoadANDUnload(data);

  await flushData();
  //提示
  message.success('已开工');
};

//完工
const endSubmit = async () => {
  loadandunloadUtils.setData({
    processTaskMaterialList: processTaskMaterialList.value,
    chooseProcessMaterial: chooseProcessMaterial.value,
    pickerAreaTrayInfo: pickerAreaTrayInfo.value,
    pickerAreaMateriaInfo: pickerAreaMateriaInfo.value,
    oprateAreaTrayInfo: oprateAreaTrayInfo.value,
    oprateAreaMateriaInfo: oprateAreaMateriaInfo.value,
    formData: formData.value
  });
  //设置工具类数据
  let err: string = loadandunloadUtils.endSubmitVerification();
  //使用工具类进行数据校验
  if (err != '') {
    message.error(err);
    return;
  }

  let data = {
    batchRecordId: chooseProcessMaterial.value.processTask.id,
    //批次编码
    barCode: formData.value.materialBarCode,
    //物料条码
    deviceUnitId: deviceId.value,
    //生产单元(产线/工位)编码
    operatorId: '' + userId.value,
    //操作者
    deviceId: deviceId.value
    //设备编id

    // batchDetailId: chooseProcessMaterial.value.id,
    //批次零件id
    // qualityNumber: formData.value.materialBarCode,
    //质量编号  扫码物料条码
    // partBatchNumber: chooseProcessMaterial.value.partBatchNumber
    //物料批次码
  };
  await OperatingtTerminalApi.batchRecordEnd(data);
  //工步完工
  await flushData();
  message.success('已完工');
};

const getStepId = (stepList, recordList) => {
  for (const step of stepList) {
    for (const record of recordList) {
      if (step.id == record.stepId) {
        if (record.operationType == 1) {
          message.error('该工步已开工');
          return;
        }
        break;
      }
    }
  }
  return null;
};

/*******************************************其他************************************/

//校验装卸数量
const checkQuantity = () => {
  if (materialTotality.value == null) {
    message.error('物料库存数量获取失败');
    return;
  }
  if (materialTotality.value < formData.value.installUnloadQuantity) {
    message.error('装卸数量不能大于库存数量');
    return;
  }
};

/*************************************表格列配置*****************************************************/

const stockInfoColumns = [
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'materialCode',
    label: '物料批次',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'quantity',
    label: '数量',
    width: '30%',
    align: 'center'
  }
];
//弹窗左侧
const chooseStockColumns = [
  {
    prop: 'materialNumber',
    label: '物料编号',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '物料条码',
    width: '60%',
    align: 'center'
  },
  // {
  //   prop: 'materialTypeName',
  //   label: '类型',
  //   width: '30%',
  //   align: 'center'
  // },
  {
    prop: 'locationCode',
    label: '位置',
    width: '60%',
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

//任务列表(列)
const processTaskListColumns = [
  {
    prop: 'number',
    label: '编码',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'partNumber',
    label: '零件图号',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'technologyCode',
    label: '工艺规程号',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'statusName',
    label: '状态',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'count',
    label: '数量',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'procedureName',
    label: '工序名称',
    width: '30%',
    align: 'center'
  }
];

//工序物料详情(列)
const pickerMaterialDetailColumns = [
  {
    prop: 'resourceBarCode',
    label: '条码',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'resourceTypeName',
    label: '类型',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'partBatchNumber',
    label: '零件批次编号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'materialCode',
    label: '材料类码',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'materialDesg',
    label: '材料牌号',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'materialName',
    label: '材料名称',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'orderDetailNumber',
    label: '零件任务编号',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'statusName',
    label: '状态',
    width: '30%',
    align: 'center'
  }
];
</script>
<style lang="scss">
@import url('@/assets/operatingterminal/scss/loadandunloadterminal.scss');
.my-input-item .el-input__inner {
  border: none !important;
  box-shadow: none !important;
}
</style>
