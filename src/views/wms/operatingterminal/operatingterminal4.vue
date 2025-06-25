<template>
  <div class="common-layout">
    <el-container id="myContainner">
      <el-header height="10vh">
        <el-input style="width: 10vw;position: absolute;top: 4vh; left:2vw;" placeholder="请输入库区编码" @keydown="changeArea" v-model="areaCode" />

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
          <el-container direction="vertical">
            <!-- areaList:区域数据 stockList:托盘信息 chooseStockList:要选择的空托盘列表  showMaterialInfoByTray:托盘上物料信息 materialListOutWh:有出库单的物料-->
            <ComponentOperationArea  :areaList="areaList" :chooseStockList="chooseStockList"
                                     :materialListOutWh="materialListOutWh" :materialListOutWhColumns="materialListOutWhColumns"
                                     :chooseStockColumns="chooseStockColumns" :stockColumnsOutWhColumns="stockColumnsOutWhColumns"
                                     :showMaterialInfoByTray = "showMaterialInfoByTray"
            />
          </el-container>
          <!-- 占位-->
          <el-aside class="aside2" width="2vw"/>
        </el-container>
      </el-main>
      <!-- 占位 -->
      <el-main height="5vh" />
      <!--待入库信息和托盘编号-->
      <el-footer height="45vh" >
        <el-container class="footTitle">
          <el-main class="footTitleChild">
            待入库信息
          </el-main>
          <el-main class="footTitleChild">
            托盘编号
          </el-main>
        </el-container>
        <el-container class="footData">
          <el-aside class="aside3" width="2vw"/>
          <!-- 待入库信息-->
          <el-main class="footDataWarehouse my-table">
            <ComponentTable class="warehouseTable" ref="warehouseTableRef" :table-data="waitInWarehouseDetailList" :table-column="waitInWarehouseDetailColumns" scroll-table-id="warehouseTableContainer" height="30vh"/>
          </el-main>
          <!-- 托盘编号-->
          <el-main class="footDataStock">
            <!-- 表格 -->
            <el-container>
              <el-main class="my-table">
                <ComponentTable class="stockInfoTable" ref="stockInfoTableRef" @row-click="checkStockClick" :table-data="stockInfoList" :table-column="stockInfoColumns" scroll-table-id="stockTableContainer" height="20vh" highlight-current-row/>
              </el-main>
            </el-container>
            <!-- 复选框 -->
            <el-container>
              <el-main>
                <div class="click">
                  <div class="stockInfoCheck">
                    <div class="checked" v-show="checkedVisible" >
                      <el-image :src="checkedPng" @click="changeCheck(false)" fit="contain" />
                      <el-input placeholder="请扫码"  v-model="inputValue"  @change="checkStockClick" style=" background-color: transparent; width: 15vw; border: none;"/>
                    </div>
                    <div class="unchecked">
                      <el-image v-show="!checkedVisible" :src="uncheckedPng" @click="changeCheck(true)"  fit="contain" />

                    </div>
                    <div class="checkText">
                      <span>手动扫码</span>
                    </div>
                </div>
                </div>
              </el-main>
            </el-container>
            <!-- 按钮 迁入迁出-->
            <el-container>
              <el-main>
                <div class="stockInfoBtn">
                  <el-image class="warehouseOut" :src="warehouseOutPng" @click="warehouseInOutClick('out')" fit="contain" />
                  <el-image class="warehouseIn" :src="warehouseInPng" fit="contain"  @click="warehouseInOutClick('in')" />
                </div>
              </el-main>
            </el-container>
          </el-main>
          <el-aside class="aside4" width="2vw" />
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
import ComponentOperationArea from './components/ComponentOperationArea.vue'
import ComponentTable from './components/ComponentTable.vue'
import { OperatingtTerminalApi, WaitInWarehouseDetailVO, waitInWarehouseDetailColumns } from '@/api/wms/operatingterminal'

const { handleLogin } = useEasyLogin();

  /** 缓存位操作4  */
  defineOptions({ name: 'operatingterminal4' })

const stockInfoColumns = [
  {
    prop:'materialNumber',
    label: '物料编号',
    width: '30%',
    align: 'center'
  },
/*  {
    prop:'materialCode',
    label: '物料批次',
    width: '40%',
    align: 'center'
  },*/{
    prop:'barCode',
    label: '物料条码',
    width: '40%',
    align: 'center'
  }, {
    prop:'batchNumber',
    label: '批次号',
    width: '40%',
    align: 'center'
  },
  {
    prop:'totality',
    label: '数量',
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
    prop:'materialCode',
    label: '物料批次',
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
const stockColumnsOutWhColumns = [
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
    prop:'storageName',
    label: '位置',
    width: '30%',
    align: 'center'
  },

]
const materialListOutWhColumns =[
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
      label: '物料类型',
      dictClass: 'string',
      width: '40%',
      align: 'center',
      prop:'materialTypeName',

    },
    {
      prop:'storageName',
      label: '位置',
      width: '30%',
      align: 'center'
    },]

const message = useMessage() // 消息弹窗
  //待入库
  const warehouseTableRef = ref();
  //托盘信息
  const stockInfoTableRef = ref()
  //弹窗里被选中的数据
  const chooseStockRow = ref();

  //区域
  const areaList = ref<any[]>([])
  //托盘信息
  const stockList = ref<any[]>([])
  //待入库信息
  const waitInWarehouseDetailList = ref<WaitInWarehouseDetailVO[]>([]);
  //托盘编号
  const stockInfoList = ref<any[]>([]);
  //选择托盘
  const chooseStockList = ref<any[]>([]);
  //物料
  const materialListOutWh = ref<any[]>([]);
  const checkedVisible = ref<boolean>(false)
  const dialogVisible = ref<boolean>(false)
  const inputValue = ref<string>();
  //选择迁入库位
  const chooseLocation = ref<any>();
  const userId = ref<any>();
  const checkStockClickInfo = ref<any>();
  //库区编码
  const areaCode = ref<string>('JGKQ');

  const changeCheck = (val)=>{
    checkedVisible.value = val;
  }



  onMounted(()=>{
    handleLogin({tenantName:'上海弥彧', username:'miyutech',password:'admin123'}).then((res)=>{
      userId.value = res;
      console.log("登录id",res)

    });
    //仓库编码
    const warehouseCode = ref<string>('THJX1');

    getAreaList(areaCode.value);

    // setInterval(()=>{
    //   getList();
    //   getEmptyTrayList();
    //   getMaterialStockByOutWarehouseDetail(areaCode.value);

    // },5000)
  })


//选择托盘的弹窗
const openDialog = (number)=>{
  dialogVisible.value = true;
}
//关闭弹窗
const closeDialog = ()=>{
  dialogVisible.value = false;
}
//确认选择
const confirmChoose = ()=>{
  if(chooseStockRow.value){
    console.log(chooseStockRow.value);
    console.log(chooseStockRow.value.bindType);

    chooseStockRow.value = undefined;
    message.success('成功选择托盘')
    closeDialog();
  }else {
    message.info('请选择托盘')
  }

}

//签入 签出
const warehouseInOutClick = async (param:any)=>{
  let data =null;
  if(stockInfoList.value.length == 0){
    message.error('托盘上物料信息空');
    return;
  }
  if(checkStockClickInfo.value ==null ){
    message.error('未选择物料');
    return;
  }
  //签出
  if(param == 'out'){
    data = {
      barCode: checkStockClickInfo.value.barCode,
      storageCode: checkStockClickInfo.value.locationId,
    };
    if(await OperatingtTerminalApi.checkOut(data)) {
      message.success('签出成功');
    }else {
      message.error('签出失败');
    }
  }else if(param == 'in'){
    //签入
    data = {
      barCode: checkStockClickInfo.value.barCode,
      storageCode: checkStockClickInfo.value.storageCode,
    };

    if(await OperatingtTerminalApi.checkIn(data)) {
      message.success('签入成功');
    }else {
      message.error('签入失败');
    }
  }
}
// 获取待入库数据
const getList = async ()=>{
  waitInWarehouseDetailList.value = await OperatingtTerminalApi.getWaitInWarehouseDetailList()
}

const changeArea = (e) => {
  if (e.keyCode === 13) {
    getAreaList(areaCode.value);
  }
}

const getAreaList = async (areaCode)=>{
  stockList.value =[];
  areaList.value= await OperatingtTerminalApi.getWarehouseLocation(areaCode);
  // for (const item of areaList.value) {
  //   let index  = item.locationName.lastIndexOf('#')
  //   item.locationName1 = item.locationName.substring(0,index+1);
  //   item.locationName2 = item.locationName.substring(index+1,item.locationName.length);
  //   //托盘信息
  //   item.carryStock = await OperatingtTerminalApi.getTrayByLocation(item.id);
  //   if( item.carryStock  ==null){
  //     item.carryStock={"locationId":item.id};
  //   }
  //   stockList.value.push(item.carryStock)
  // }
  console.log("getAreaList",areaList.value)
}
//获取托盘上物料信息
const  showMaterialInfoByTray = async(data)=>{
  if(data.id ==null || data.id == undefined){
    stockInfoList.value =null;
    message.error('请选择托盘');
    return;
  }
  //选择的库位上物料信息
  chooseLocation.value = data;
  //库位托盘上物料信息
  stockInfoList.value =  await OperatingtTerminalApi.getMaterialStockByTray(data);
  console.log("showMaterialInfoByTray",data,stockInfoList.value)
}
const getEmptyTrayList = async() => {
  chooseStockList.value = await OperatingtTerminalApi.getEmptyTrayList();
  console.log("getEmptyTrayList",chooseStockList.value);
}
//获取有出库详情单的物料
const getMaterialStockByOutWarehouseDetail = async(areaCode) => {
  materialListOutWh.value = await OperatingtTerminalApi.getMaterialStockByOutWarehouseDetail(areaCode);
  console.log("获取有出库详情单的物料",materialListOutWh.value)
}

const checkStockClick = (row) => {
  console.log(row);
  if(row.id == null){
    //手动扫码
    for(const item of stockInfoList.value){
      if(item.barCode == inputValue.value.trim()){
        checkStockClickInfo.value = item;
        break;
      }
    }
  }else{
    checkStockClickInfo.value = row;
  }
}

</script>
<style lang="scss">
  @import url("@/assets/operatingterminal/scss/operatingterminal4.scss");

</style>
