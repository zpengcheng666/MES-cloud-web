<template>
  <div id="my-containner">
    <el-container>
      <el-header height="10vh">
        <el-select
          style="width: 10vw;position: absolute;top: 4vh; left:2vw;"
            v-model="areaCode"
            placeholder="请选择库区编码"
            clearable
            filterable
            class="!w-240px"
            @Change="changeArea"
          >
            <el-option
              v-for="warehouseArea in warehouseAreaList"
              :key="warehouseArea.id"
              :label="warehouseArea.areaCode + '-' + warehouseArea.areaName"
              :value="warehouseArea.areaCode+''"
            />
          </el-select>

        <!-- 扫码-->
        <div class="sacnCode">
          <el-image class="scanID" :src="IDPng" fit="contain" />
          <div class="scanText">ID扫码</div>
        </div>
      </el-header>
      <view style="position: absolute;">监听到的内容：{{inputString}}</view>
      <!--上侧main-->
      <el-main class="top-main">
        <el-container>
          <el-aside class="aside1" width="2vw"/>
          <!-- 拣选工作 -->
          <el-main>
            <div class="picker-work" >
              <div class="picker-work-text">
                刀具出库单
              </div>
              <div class="picker-work-table my-table">
                <ComponentTable :table-data="outWarehouseDetailList" :table-column="pickerWorkColumns" scroll-table-id="pickerWorkTableContainer" height="25vh"/>
              </div>
            </div>
          </el-main>
          
          <el-aside class="aside2" width="2vw"/>
        </el-container>
      </el-main>
      <!-- 占位 -->
      <el-main class="middle-main"/>
      <!-- 下侧main -->
      <el-main class="bottom-main" >
        <el-container>
          <el-aside class="aside3" width="2vw"/>
          <el-main>
            <!-- 上部 -->
            <el-container>
              <!-- 拣选工作 -->
              <el-main >
                <div class="picker-work-stock">
                  <PickCutterTrayOperation ref="pickerWorkStockRef" areaInfo="拣选工作"
                                           :stockInfo="pickerAreaTrayInfo"
                                           @btn-show="flushData" 
                                           :currentLocationCode="locationCode[0]"
                                           :chooseStockColumns="chooseStockColumns" :chooseStockList="chooseStockList"
                                           :emptyStockColumns="emptyStockColumns"/>
                </div>
              </el-main>
              <!--占位-->
              <el-main ><div class="bottom-main-middle-placeholder"></div></el-main>
              <el-main class="picker-material-main">
                <div class="picker-material-table my-table">
                  <ComponentTable :table-data="pickerAreaMateriaInfo" @row-dblclick="pickDblClick"  @row-click="choosePickStockClick" :table-column="cutterColumns" height="18vh" highlight-current-row/>
                </div>
                <div class="picker-material-btn">
                  <!-- 签入 -->
                  <div class="warehouseIn" @click="openInSimpleDialog(pickerAreaTrayInfo.id)">
                    <el-image :src="warehouseInPng" fit="contain" />
                  </div>
                  <!-- 签出 -->
                  <div class="warehouseOut" @click="openOutPickSimpleDialog">
                    <el-image :src="warehouseOutPng" fit="contain" />
                  </div>
                </div>
              </el-main>
            </el-container>
            <!-- 中部 -->
            <el-container class="bottom-container-middle-placeholder"/>
            <!-- 下部 -->
            <el-container>
              <el-main >
                <div class="oprate-area-stock">
                      <DistributionCutterTray ref="oprateAreaStockRef" areaInfo="操作区"
                                           :stockInfo="oprateAreaTrayInfo" 
                                           @btn-show="flushData"
                                           :currentLocationCode="locationCode[1]"
                                           :chooseStockColumns="chooseStockColumns" :chooseStockList="callTrayList"
                                           :emptyStockColumns="emptyStockColumns" />
                </div>
              </el-main>
              <el-main ><div class="bottom-main-middle-placeholder"></div></el-main>
              <el-main class="operate-material-main">
                <!-- <div class="operate-table-text">
                  已就位
                </div> -->
                <div class="operate-material-table my-table">
                  <ComponentTable :table-data="oprateAreaMateriaInfo" @row-dblclick="oprateDblClick"  @row-click="chooseOprateStockClick"  :table-column="cutterColumns" height="18vh" highlight-current-row/>
                </div>
                <div class="operate-material-btn">
                  <!-- 签入 -->
                  <div class="warehouseIn" @click="openInSimpleDialog(oprateAreaTrayInfo.id)">
                    <el-image :src="warehouseInPng" fit="contain" />
                  </div>
                  <!-- 签出 -->
                  <div class="warehouseOut" @click="openOutOpratenSimpleDialog">
                    <el-image :src="warehouseOutPng" fit="contain" />
                  </div>
                </div>
              </el-main>
            </el-container>
          </el-main>
          <el-aside class="aside4" width="2vw"/>
        </el-container>
      </el-main>
    </el-container>

    <!-- 弹窗 -->
    <SimpleDialogComponent  ref="simpleDialogRef" title="拣选物料" label="储位编码:" @simple-ok="simpleOK" />
    <SimpleDialogComponent  ref="inSimpleDialogRef" title="签入物料" label="刀具物码:" label2="储位编码" @simple-ok="inSimpleOK" />
    <SimpleDialogComponent  ref="outSimpleDialogRef" title="签出物料" label="库位编码:" @simple-ok="outSimpleOK" />
  </div>
</template>

<script setup lang="ts">
  import useEasyLogin  from '@/views/Login/components/easyLogin'
  import { OperatingtTerminalApi } from '@/api/wms/operatingterminal'
  import IDPng from '@/assets/operatingterminal/images/ID.png'
  import warehouseInPng from '@/assets/operatingterminal/images/warehouseIn.png'
  import warehouseOutPng from '@/assets/operatingterminal/images/warehouseOut.png'
  import ComponentTable from './components/ComponentTable.vue'
  import PickCutterTrayOperation from './components/PickCutterTrayOperation.vue'
  import DistributionCutterTray from './components/DistributionCutterTray.vue'
  import { WarehouseAreaApi } from '@/api/wms/warehousearea'
  import SimpleDialogComponent from './components/SimpleDialogComponent.vue'

  /** 拣选工位操作终端  */
  defineOptions({ name: 'PickerTerminal' })
  const { handleLogin } = useEasyLogin();
  const message = useMessage() // 消息弹窗
  const inputString = ref<string>('')
  const warehouseAreaList = ref<any[]>([]) // 仓库区域列表

  // 弹窗
  const simpleDialogRef = ref()
  const inSimpleDialogRef = ref()
  const outSimpleDialogRef = ref()
  // 当前选中刀具
  const currentCutterId = ref('')
  // 要拣选到的托盘id
  const pickToTrayId = ref('')
  // 拣选位置托盘id
  const pickTrayId = ref('')
  // 操作位置托盘
  const operationTrayId = ref('')
  // 要签入的托盘id
  const currInTrayId = ref('')
  // 选中拣选托盘的刀具
  const choosePickCutter = ref('')
  // 选中操作托盘的刀具
  const chooseOperationCutter = ref('')

  //下架托盘
  const chooseStockList = ref<any[]>([]);
  // 呼叫托盘
  const callTrayList = ref<any[]>([]);

  const pickerWorkStockRef = ref({
    stockwarehouseVisible:false,
    chooseStockVisible:false,
  });
  const oprateAreaStockRef = ref();


  //拣选工作-托盘信息
  const pickerAreaTrayInfo = ref<any[]>([]);
  //拣选工作 物料
  const pickerAreaMateriaInfo = ref<any[]>([])
  //操作区-托盘信息
  const oprateAreaTrayInfo = ref();
  const oprateAreaMateriaInfo = ref();
  //出库单
  const outWarehouseDetailList =  ref<any[]>([]);

  //拣选工作(列)
  const pickerWorkColumns = [
    {
      prop:'materialNumber',
      label: '刀组编码',
      width: '30%',
      align: 'center'
    },  {
      prop:'materialName',
      label: '刀具名称',
      width: '30%',
      align: 'center'
    },{
      prop:'barCode',
      label: '刀具物码',
      width: '30%',
      align: 'center',
    },{
      prop:'targetWarehouseName',
      label: '目标仓库',
      width: '30%',
      align: 'center'
    },{
      prop:'targetLocationName',
      label: '目标库位',
      width: '50%',
      align: 'center'
    },
  ]
 

  //刀具拣选
  const cutterColumns =[
    {
      prop:'materialNumber',
      label: '刀组编码',
      width: '20%',
      align: 'center'
    },
    {
      prop:'materialName',
      label: '刀具名称',
      width: '20%',
      align: 'center'
    }, {
      prop:'barCode',
      label: '刀具物码',
      width: '30%',
      align: 'center'
    },
    {
      prop:'storageCode',
      label: '位置',
      width: '30%',
      align: 'center'
    },
  ]


  //弹窗左侧
  const chooseStockColumns =[
  {
    prop:'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
  {
    prop:'barCode',
    label: '物料条码',
    width: '40%',
    align: 'center'
  },
  {
    prop:'locationName',
    label: '位置',
    width: '30%',
    align: 'center'
  },
  ]
  //弹窗右侧
  const emptyStockColumns = [
    {
      prop:'materialNumber',
      label: '物料编号',
      width: '40%',
      align: 'center'
    },
    {
      prop:'batchNumber',
      label: '物料批次',
      width: '40%',
      align: 'center'
    },
    {
      prop:'totality',
      label: '数量',
      width: '20%',
      align: 'center'
    },
  ]
/****************************配置信息***********************************************/

  //库区编码
  const areaCode = ref<string>('CPDJJBQ1');
  //库位编码
  const locationCode = ref<string[]>(['DJHCK#CPDJJBQ1#-S1', 'DJHCK#CPDJJBQ1#-S2']);

/****************************配置信息结束***********************************************/

  onMounted(()=>{
    handleLogin({tenantName:'上海弥彧', username:'miyutech',password:'admin123'});

    setInterval(async () => {
      timerData();
    }, 10000);
    timerData();
    flushData();
    initAreaList();
  })

  const initAreaList = async() => {
    // 加载仓库区域列表
    warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
  }

  // 定时数据
  const timerData = () => {
    //刀具待出库单
    getOutWarehouseDetail(areaCode.value);
  }

  // 刷新数据
  const flushData = async()=> {
    //根据两个库位上是否存在托盘设置按钮是否显示
    showButton();
    // 选择下架托盘
    chooseDownShelfTray();
    // 呼叫托盘信息列表
    getCallTrayList();
    // 获取刀具接驳库位上的托盘信息
    getTrayInfoByLocationCode();
  }

  // 获取刀具接驳库位上的托盘信息
  const getTrayInfoByLocationCode = () => {
      //获取两个库位上的托盘或工装信息
    getMaterialStockByLocationCode(locationCode.value[0]).then((res) => {
      pickerAreaTrayInfo.value = res.trayInfo;
      pickTrayId.value = res.trayInfo.id;
      pickerAreaMateriaInfo.value = res.onTrayMaterialInfo;
    });

    getMaterialStockByLocationCode(locationCode.value[1]).then((res) => {
      oprateAreaTrayInfo.value = res.trayInfo;
      operationTrayId.value = res.trayInfo.id;
      oprateAreaMateriaInfo.value = res.onTrayMaterialInfo;
    });
  }


  // 选择下架托盘
  const chooseDownShelfTray = async() => {
    //获得本仓库中存储库区的托盘与工装
    chooseStockList.value = await OperatingtTerminalApi.getMaterialStockByAreaAndAreaTypeEq1(areaCode.value);
  }

  // 呼叫托盘展示
  const getCallTrayList = async() => {
    callTrayList.value = await OperatingtTerminalApi.getCallEmpryTrayList(areaCode.value);
    console.log("获取有出库详情单的物料",chooseStockList.value)
  }


  //获得指定库位绑定的托盘或工装信息
  const getMaterialStockByLocationCode = async (locationCode: any) => {
    let trayInfo = undefined;
    let onTrayMaterialInfo: any = undefined;
    console.log("locationCode",locationCode)
    let materialStock = await OperatingtTerminalApi.getMaterialStockByLocationCode(locationCode);
    if (materialStock?.materialType == 'TP' || materialStock?.materialType == 'GZ') {
      trayInfo = materialStock;
      onTrayMaterialInfo = await OperatingtTerminalApi.getMaterialStockByTray(trayInfo);
    }
    return { onTrayMaterialInfo: onTrayMaterialInfo, trayInfo: trayInfo };
  };


  //根据两个库位上是否存在托盘设置按钮是否显示
  const showButton = () => {
    pickerWorkStockRef.value.chooseStockVisible = true; //上 选择托盘
    pickerWorkStockRef.value.stockwarehouseVisible = true; //上 托盘入库(上架)
    oprateAreaStockRef.value.stockwarehouseVisible = true; //下 选择托盘
    oprateAreaStockRef.value.chooseStockVisible = true; //下 托盘入库(上架)
  };


  // 双击拣选区刀具行
  const pickDblClick = (row:any) => {
    if(!pickTrayId.value){
      message.error('请先呼叫托盘');
      return;
    }
    if(!operationTrayId.value){
      message.error('请先下架托盘');
      return;
    }
    currentCutterId.value = row.id;
    pickToTrayId.value = operationTrayId.value;
    simpleDialogRef.value.openDialog();
  }

  // 双击 操作区刀具行
  const oprateDblClick = (row:any) => {
    if(!pickTrayId.value){
      message.error('请先呼叫托盘');
      return;
    }
    if(!operationTrayId.value){
      message.error('请先下架托盘');
      return;
    }
    currentCutterId.value = row.id;
    pickToTrayId.value = pickTrayId.value;
    simpleDialogRef.value.openDialog();
  }

  // 双击拣选 弹窗确认
  const simpleOK = async(v1:string,v2: string) => {
    bindCutterToTray(v1)
  }

  // 绑定刀具到托盘
  const bindCutterToTray = async(storageCode:string) => {
    OperatingtTerminalApi.bindCutterToTray(currentCutterId.value, pickToTrayId.value, storageCode).then((res) => {
      if (res) {
        message.success('绑定成功');
        flushData();
      } else {
        message.error('绑定失败');
      }
    });
  }
  

  //弹窗表格单击,保存选中的拣选托盘内的刀具
  const choosePickStockClick = (row)=>{
    choosePickCutter.value = row.barCode;
  }

  // 操作区托盘内的刀具
  const chooseOprateStockClick = (row)=>{
    chooseOperationCutter.value = row.barCode;
  }

  // 获取刀具待出库单
  const getOutWarehouseDetail=async(areaCode:any)=>{
    outWarehouseDetailList.value = await OperatingtTerminalApi.getCutterWaitOrderDetailList(areaCode);
  }


  // 签入弹窗2
  const openInSimpleDialog = (trayId: string) =>{
    if(!trayId){
      return;
    }
    currInTrayId.value = trayId;
    inSimpleDialogRef.value.openDialog();
  }

  const pickOrOprate = ref<number>(0);
  // 签出弹窗3
  const openOutPickSimpleDialog = () =>{
    if(!choosePickCutter.value){
      message.error('请先选择签出刀具');
      return;
    }
    pickOrOprate.value = 1;
    outSimpleDialogRef.value.openDialog();
  }
  const openOutOpratenSimpleDialog = () =>{
    if(!chooseOperationCutter.value){
      message.error('请先选择签出刀具');
      return;
    }
    pickOrOprate.value = 2;
    outSimpleDialogRef.value.openDialog();
  }
  
  // 签入确认
  const inSimpleOK = async(v1: string, v2: string) => {
    warehouseIn(currInTrayId.value, v1, v2);
  }
  // 签出确认
  const outSimpleOK = async(v1: string, v2: string) => {
    if(pickOrOprate.value == 1){
      warehouseOut(choosePickCutter.value, v1);
    }
    if(pickOrOprate.value == 2){
      warehouseOut(chooseOperationCutter.value, v1);
    }
    pickOrOprate.value = 0;
  }


  //签入
  const warehouseIn = async(trayId:string, barCode:string, storageCode:string) => {
    if(!trayId){
      message.error('不存在托盘');
      return;
    }
    const data = {
      trayId: trayId,
      barCode: barCode,
      storageCode: storageCode,
    }
    if(await OperatingtTerminalApi.checkInCutter(data)) {
      message.success('签入成功');
      flushData();
    }else {
      message.error('签入失败');
    }
  }
  //签出
  const warehouseOut = async(barCode, locationCode)=> {
    const data = {
      barCode: barCode,
      locationCode: locationCode,
    }
    if(await OperatingtTerminalApi.checkOutCutter(data)) {
      message.success('签出成功');
      flushData();
    }else {
      message.error('签出失败');
    }
  }




  /**
   * 扫描枪工具类
   */
  // var ScanCodeUtil={
  //   keys:[],
  //   code:null,
  //   verify:function(key){
  //     if(  key.keyCode == 13 ){//Enter
  //       return false;
  //     }
  //     if(  key.keyCode == 16 ){//Shift
  //       return false;
  //     }
  //     return true;
  //   },
  //   execute:function(key,callback){
  //     this.keys.push(key);
  //     var keys=this.keys;
  //     var endTime=key.timeStamp;
  //     var code="";
  //     if( key.keyCode == 13 ){//扫描枪结束时的自动回车
  //       for( var i=keys.length-1;i >= 0;i-- ){
  //         if( endTime - keys[i].timeStamp < 50 ){
  //           if( this.verify(keys[i]) ){
  //             code = keys[i].key+code;
  //           }
  //           endTime=keys[i].timeStamp;
  //         }else{
  //           break;
  //         }

  //       }
  //       this.code=code;
  //       if( code ){
  //         callback(code);
  //       }
  //     }
  //   },
  //   listen:function(callback){
  //     //1.模拟聚焦使得页面可以监听到扫描事件
  //     setInterval(function(){
  //       var $scanCodeInput= $("<input type='text'/>")
  //       $("body").append($scanCodeInput);
  //       $scanCodeInput.focus();
  //       $scanCodeInput.remove();

  //     }, 1000);
  //     //2.监听扫描事件
  //     $("body").keydown(function(event){
  //       ScanCodeUtil.execute(event,callback);
  //     });
  //   }
  // };
  // $(function(){

  //   ScanCodeUtil.listen(function(code){
  //     if(outWarehouseDetaiClick.value.id ==null){
  //       message.error('请先选择出库单');
  //       return;
  //     }
  //     //code为扫描内容
  //     code = "BC-1721975786";
  //     message.success('扫描成功：'+code)
  //     changeOnTrayMaterialStorage(code);
  //   });

  // });
</script>

<style lang="scss">
  @import url("@/assets/operatingterminal/scss/cutterpickerterminal.scss");
</style>
