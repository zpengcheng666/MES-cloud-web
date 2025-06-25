<template>
  <div class="common-layout">
    <el-container id="myContainner">
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
      <el-main height="40vh" >
        <el-container>
          <!-- 占位-->
          <el-aside class="aside1" width="2vw"/>
          <!--<el-container direction="vertical">-->
          <el-main type="flex" justify="center">
            <!-- areaList:区域数据 stockList:托盘信息 chooseStockList:要选择的托盘列表 -->
            <!--<ComponentOperationArea6  :areaList="areaList" :stockList="stockList" />-->
            <el-row type="flex" justify="space-around">
            <!--<el-row style="width: 96vw" type="flex" justify="center">-->
              <el-col :span="colSize"   v-for="(locationInfo,index) in areaList" :key="index">
                <div class="main-stock" @click="showMaterialInfo(locationInfo.trayInfo,index)">
                <!--<div :style="{border:' 1px solid red',height:'45vh',width:conwidth}" >-->
                  <ComponentOperationArea6 :location="locationInfo.trayInfo.locationName" :stockListlength="areaList.length" :stockInfo="locationInfo.trayInfo" :chooseStockList="chooseStockList" :chooseStockColumns="chooseStockColumns" :emptyStockColumns="emptyStockColumns"/>
                </div>
              </el-col>
            </el-row>

          </el-main>
          <!-- 占位-->
          <el-aside class="aside2" width="2vw"/>
        </el-container>
      </el-main>
      <!-- 占位 -->
      <el-main height="5vh" />
      <!--待入库信息和托盘编号-->
      <el-footer height="45vh" >
        <el-container>
          <el-aside class="aside3" width="2vw"/>
          <el-main width="96vw">
            <el-container>
              <!-- 左下侧 -->
              <div class="foot-container">
                <el-main>
                  <el-container class="footTitle">
                    <el-main>
                      <el-main class="footTitleChild">
                        待处理出入库单
                      </el-main>
                    </el-main>
                  </el-container>
                  <el-container class="footData">
                    <!-- 待入库信息-->
                    <el-main class="footDataWarehouse my-table">
                      <ComponentTable class="warehouseTable" ref="warehouseTableRef" :table-data="waitOrderDetailList" :table-column="waitOrderDetailColumns" scroll-table-id="warehouseTableContainer" height="30vh"/>
                    </el-main>
                  </el-container>
                </el-main>
              </div>

              <!-- 右下侧 -->
              <div class="foot-container">
                <el-main>
                  <el-container class="footTitle">
                    <el-main >
                      <el-main class="footTitleChild">
                        托盘信息
                      </el-main>
                    </el-main>
                  </el-container>
                  <el-container class="footData">
                    <el-main class="footDataStock">
                      <el-container>
                        <el-main class="my-table">
                          <ComponentTable class="stockInfoTable" ref="stockInfoTableRef" @row-click="checkStockClick" :table-data="stockInfoList" :table-column="stockInfoColumns" scroll-table-id="stockTableContainer" height="25vh" highlight-current-row/>
                        </el-main>
                      </el-container>
                      <el-container>
                        <el-main>
                          <div class="click">
                            <div class="stockInfoCheck">
                              <div class="checked"  v-show="checkedVisible">
                                <el-image :src="checkedPng" @click="changeCheck(false)" fit="contain" />
                                <el-input  placeholder="请扫描物料条码"  v-model="scanBarCode"  @change="checkStockClick" style=" background-color: transparent; width: 15vw; border: none;"/>
                                <el-input v-show="!scanStroageVisible" placeholder="请扫描储位码"  v-model="scanStroageCode"  @change="checkStockClick" style=" background-color: transparent; width: 15vw; border: none;"/>
                              </div>
                              <div class="unchecked" v-show="!checkedVisible">
                                <el-image  :src="uncheckedPng" @click="changeCheck(true)"  fit="contain" />
                              </div>
                              <div class="checkText">
                                <span>手动扫码</span>
                              </div>
                            </div>
                          </div>
                        </el-main>
                      </el-container>
                      <el-container>
                        <el-main>
                          <div class="stockInfoBtn">
                            <!-- 签出 -->
                            <el-image class="warehouseOut" :src="warehouseOutPng"  @click="warehouseInOutClick('out')" fit="contain" />
                            <!-- 签入 -->
                            <el-image class="warehouseIn" :src="warehouseInPng"  @click="warehouseInOutClick('in')" fit="contain" />
                          </div>
                        </el-main>
                      </el-container>
                    </el-main>
                  </el-container>
                </el-main>
              </div>

            </el-container>
          </el-main>
          <el-aside class="aside4" width="2vw"/>
        </el-container>

      </el-footer>
    </el-container>
  </div>


</template>

<script setup lang="ts">
  import useEasyLogin  from '@/views/Login/components/easyLogin'
  import checkedPng from '@/assets/operatingterminal/images/checked.png'
  import uncheckedPng from '@/assets/operatingterminal/images/unchecked.png'
  import warehouseInPng from '@/assets/operatingterminal/images/warehouseIn.png'
  import warehouseOutPng from '@/assets/operatingterminal/images/warehouseOut.png'
  import IDPng from '@/assets/operatingterminal/images/ID.png'
  import ComponentOperationArea6 from './components/ComponentOperationArea6.vue'
  import ComponentTable from './components/ComponentTable.vue'
  import { OperatingtTerminalApi, waitOrderDetailColumns } from '@/api/wms/operatingterminal'
  import { WarehouseAreaApi } from '@/api/wms/warehousearea'

  const { handleLogin, getBindedLocation } = useEasyLogin();

  /** 缓存位操作6  */
  defineOptions({ name: 'operatingterminal6' })

  const stockInfoColumns = [
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
      prop: 'totality',
      label: '数量',
      width: '30%',
      align: 'center'
    }
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
      prop:'barCode',
      label: '物料条码',
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
  const message = useMessage() // 消息弹窗
  //待入库
  const warehouseTableRef = ref();
  //托盘信息
  const stockInfoTableRef = ref(null)
  //弹窗里被选中的数据
  const chooseStockRow = ref();

  //区域
  const areaList = ref<any[]>([])
  //待入库信息
  const waitOrderDetailList = ref<any[]>([]);
  //托盘编号
  const stockInfoList = ref<any[]>([]);
  //选择托盘
  const chooseStockList = ref<any[]>([]);
  //库区信息
  const areaCode = ref<string>('JGKQ')
  const warehouseAreaList = ref<any[]>([]) // 仓库区域列表

  const scanBarCode = ref<string>('');
  const scanStroageCode = ref<string>('');
  const scanStroageVisible = ref<boolean>(false);
  const checkBarCode = ref<string>('');
  // 选中的托盘
  const checkTrayInfo = ref<any>();

  const checkedVisible = ref<boolean>(false)
  const dialogVisible = ref<boolean>(false)
  const userId = ref<string>('');
  const userBindedLocationIds = ref<string[]>([]);

  //一行几个
  const colSize = ref<any>(0);


  const changeCheck = (val)=>{
    checkedVisible.value = val;
  }

  onMounted(()=>{
    handleLogin({tenantName:'上海弥彧', username:'miyutech',password:'admin123'}).then((res) => {
      userId.value = res;
      getBindedLocation(userId.value).then((locationIds) => {
        userBindedLocationIds.value = locationIds
      })
    })

    getAreaList(areaCode.value);
    getOrderList(areaCode.value);
    getMaterialList(areaCode.value);

    // 开启定时器
    setInterval(() => {
      getAreaList(areaCode.value);
      getOrderList(areaCode.value);
      getMaterialList(areaCode.value);
    }, 10000);
  })

// 初始化库位style
const initLocationStyle = ()=>{
  if(areaList.value.length<=4){
      colSize.value = 6;
    }else {
      colSize.value = 8;
    }
}

const changeArea = (code:string) => {
  getAreaList(code);
  getOrderList(code);
  getMaterialList(code);
}

// 获取库区上的库位列表和其上托盘信息
const getAreaList = async (areaCode)=>{
  areaList.value= await OperatingtTerminalApi.getWarehouseLocation(areaCode);
  initLocationStyle();
  // 加载仓库区域列表
  warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
}

//获取有出库详情单的物料 和 绑定了此接驳库区的空托盘
const getMaterialList = async(areaCode) => {
  chooseStockList.value = await OperatingtTerminalApi.getMaterialStockByOutWarehouseDetail(areaCode);
  console.log("获取有出库详情单的物料",chooseStockList.value)
}

 // 取消托盘内物料信息选中
const cancelSelect = ()=>{
  stockInfoTableRef.value?.clearSelect()
  checkBarCode.value = ''
}
// 更改选中托盘样式
const changeSelectStyle = (i) => {
  const trayBoxs = document.querySelectorAll('.main-stock')
  trayBoxs.forEach(item=>{
    item.classList.remove('checkedBox');
  })
  trayBoxs[i].classList.add('checkedBox');
}

// 展示托盘上的物料
const showMaterialInfo = async(trayInfo,i)=>{
  cancelSelect()
  changeSelectStyle(i);
  console.log("showMaterialInfo",trayInfo);
  checkTrayInfo.value = trayInfo;
  scanStroageVisible.value = trayInfo.materialStorage
  if(trayInfo.materialStockId === null){
    stockInfoList.value = [];
    return;
  }
  //选择的库位上物料信息
  const data = {
    id:trayInfo.materialStockId,
  }
  //库位托盘上物料信息
  stockInfoList.value =  await OperatingtTerminalApi.getMaterialStockByTray(data);
  console.log("showMaterialInfoByTray",data,stockInfoList.value)
}

// 选择或扫码物料
const checkStockClick = (row) => {
  console.log(row);
  if(checkedVisible.value){
    //手动扫码
    checkBarCode.value = scanBarCode.value.trim();
  }else{
    checkBarCode.value = row.barCode;
  }
}

//签入 签出
const warehouseInOutClick = async (param:any)=>{
  if(scanStroageVisible.value){
    scanStroageCode.value = checkTrayInfo.value.barCode
  }


  //签出
  if(param == 'out'){
    if(stockInfoList.value.length == 0){
      message.error('托盘上物料信息空');
      return;
    }
    const data = {
      barCode:checkTrayInfo.value.barCode,
      locationId:checkTrayInfo.value.locationId,
      locationByUserData: userBindedLocationIds.value
    }
    stockInfoList.value.forEach(item=>{
      if(item.barCode === checkBarCode.value){
        data.barCode = item.barCode
      }
    })

   
    if(await OperatingtTerminalApi.checkOut(data)) {
      message.success('签出成功');
    }else {
      message.error('签出失败');
    }
  }else if(param == 'in'){
    if(scanBarCode.value.trim() === ''){
      message.error('请输入物料条码');
      return;
    }
    if(!scanStroageVisible.value && scanStroageCode.value.trim() === ''){
      message.error('未选择储位');
      return;
    }
    //签入
    const data = {
      barCode: scanBarCode.value.trim(),
      storageCode: scanStroageCode.value.trim(),
    };

    if(await OperatingtTerminalApi.checkIn(data)) {
      message.success('签入成功');
      scanBarCode.value = '';
      scanStroageCode.value = '';
    }else {
      message.error('签入失败');
    }
  }
}


  // 获取数据
  const getOrderList = async (areaCode)=>{
    waitOrderDetailList.value = await OperatingtTerminalApi.getWaitOrderDetailList(areaCode)
  }
</script>
<style lang="scss">
  @import url("@/assets/operatingterminal/scss/operatingterminal6.scss");
</style>
