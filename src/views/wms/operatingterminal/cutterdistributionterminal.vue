<template>
  <div id="cutter-distribution-terminal">
    <OperationTerminalHeader :title="'刀具拣选工位操作终端'" :title-color="'#3cb2df'" />
    <el-row :gutter="10">
      <el-col :span="12">
        <!-- 左侧 -->
        <el-container class="left-container">
          <el-header class="left-header">
            <el-row :gutter="5">
              <el-col v-for="(item, index) in leftHeaders" :key="index" :span="6">
                <div class="left-header-item">
                  <div class="left-header-item-value">
                    <span> {{ item.value }} </span>
                    <span class="left-header-item-unit"> {{ item.unit }} </span>
                  </div>
                  <div class="left-header-item-title">{{ item.label }}</div>
                </div>

              </el-col>

            </el-row>
          </el-header>
          <!-- 左侧标题 -->
          <div class="left-top">装卸刀具</div>

          <!-- 左侧 中部 -->
          <div class="left-center my-table">
            <ComponentTable class="left-center-table" :table-column="waitOutColumns" :table-data="waitOutData" height="35vh" />
          </div>
          <!-- 左侧 下部 -->
          <div class="left-bottom my-table">
            <ComponentTable class="left-bottom-table" :table-column="waitInColumns" :table-data="waitInData" height="35vh" />
          </div>

        </el-container>
      </el-col>
      <el-col :span="12">
        <!-- 右侧 -->
        <el-container class="right-container">
          <el-header height="20vh">
            <div class="right-top">
              <el-container>
                <el-header height="5vh">
                  <div class="right-top-title">
                    刀具信息
                  </div>
                </el-header>
                <el-container>
                  <el-aside width="25%">
                    <div class="right-top-box"></div>
                  </el-aside>
                  <el-main>
                    <div class="right-top-title1">
                      <el-row>
                        <el-col :span="12" class="right-top-label"> {{ cutterInfo.header[0].lable }} </el-col>
                        <el-col :span="12" class="right-top-val"> {{ cutterInfo.header[0].value }}</el-col>
                      </el-row>
                    </div>
                    <div class="right-top-title2">
                      <el-row>
                        <el-col :span="12" class="right-top-label"> {{ cutterInfo.header[1].lable }} </el-col>
                        <el-col :span="12" class="right-top-val"> {{ cutterInfo.header[1].value }}</el-col>
                      </el-row>
                    </div>
                  </el-main>
                </el-container>
                <el-footer style="height: 10vh;">
                  <el-row :gutter="5" >
                    <el-col  class="right-top-cutter-body" :span="6" v-for="(item, index) in cutterInfo.body" :key="index">
                      <span class="right-top-label"> {{ item.lable }} ：</span><span class="right-top-val" > {{ item.value }}</span>
                    </el-col>
                  </el-row>
                </el-footer>
              </el-container>
            </div>
          </el-header>
          <div class="right-center">
            <el-container>
              <el-header height="4vh" class="right-center-header"> 刀具托盘 </el-header>
              <el-main>
                <div class="right-center-box">
                  <template v-for="(cutterTrayDetail, index) in cutterLocationInfo" :key="index">
                    <div :class="selectLocationId==cutterTrayDetail.locationId?'right-center-box-item-select':'right-center-box-item'" @click="onClickLoction(cutterTrayDetail)">
                      <div class="right-center-box-item-border">
                        <template v-for="(storage, index2) in cutterTrayDetail.cutterTrayDetailInfoS" :key="index2">
                          <el-tooltip
                              class="box-item"
                              effect="dark"
                              placement="top-start"
                              :show-after="200"
                              :hide-after="0"
                            >
                            <template #content>
                              <span> 储位编码： {{ storage.storageCode }} </span>
                              <br/>
                              <span v-show="storage.barCode!= null"> 刀具物码： {{ storage.barCode }} </span>
                            </template>
                            <div @click="onClickStorage(storage)" :class="
                            storage.barCode == null?selectStorageId === storage.storageId? 'storage-select-null' :'storage-null'
                            :selectStorageId === storage.storageId? 'cutter-select': 'cutter-exist'"></div>
                          </el-tooltip>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </el-main>
              <el-footer class="right-footer">
                <el-row>
                  <el-col :span="6" style="text-align: center;"><div class="check-in" @click="openInSimpleDialog"></div></el-col>
                  <el-col :span="6" style="text-align: center;"><div class="check-out" @click="openOutSimpleDialog"></div></el-col>
                  <el-col :span="6" style="text-align: center;"><div class="call-out" @click="openDialog"></div></el-col>
                  <el-col :span="6" style="text-align: center;"><div class="distribution" @click="trayDistributionClick"></div></el-col>
                </el-row>
                <div class="right-footer-text">
                  <div class="right-footer-text-border">
                    <div v-if="cutterDistributionPath.length > 0">配送路径：</div>
                    <div v-else>暂无配送信息</div>
                    <el-tooltip
                              class="box-item"
                              effect="dark"
                              placement="top-start"
                              :show-after="200"
                              :hide-after="0"
                            >
                      <div>{{cutterDistributionPath}}</div>
                      <template #content>
                        <span > {{cutterDistributionPath}} </span>
                      </template>
                    </el-tooltip>
                  </div>
                </div>
              </el-footer>
            </el-container>
          </div>
        </el-container>
      </el-col>

    </el-row>

    <SimpleDialogComponent ref="inSimpleDialogRef" title="签入物料" label="刀具物码:" @simple-ok="warehouseIn" />
    <SimpleDialogComponent ref="outSimpleDialogRef" title="签出物料" label="库位编码:" @simple-ok="warehouseOut" />
  
  
    // 呼叫托盘
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
              <el-aside width="8%"/>
              <!-- 左边的表格 -->
              <el-aside width="45%" class="my-table">
                <ComponentTable class="chooseStockTable" :table-data="chooseStockList" @row-click="chooseStockClick" highlight-current-row :table-column="chooseStockColumns" height="320px"/>
              </el-aside>
              <el-aside width="3%"/>
              <!-- 右边的表格 -->
              <el-main width="45%">
                <div class="emptyStockText">
                  物料详情
                </div>
                <div class="emptyStockDetail">
                  <div class="emptyStockDetailPng">
                    <el-image :src="emptyStockDetailPng" fit="contain" />
                  </div>
                  <div class="emptyStockDetailTable my-table">
                    <ComponentTable :table-data="stockInfoList"  :table-column="emptyStockColumns" height="160px"/>
                  </div>

                </div>
                <div class="confirmContainer">
                  <div class="confirmContect">
                    <el-image :src="confirmPng" @click="confirmChoose" fit="contain" />
                  </div>
                </div>
              </el-main>
              <el-aside width="2%"/>
            </el-container>
          </el-main>
          <el-footer  height="100px" />
        </el-container>
      </el-dialog>
    </div>
  </div>

</template>

<script setup lang="ts">
import OperationTerminalHeader from './components/OperationTerminalHeader.vue'
import ComponentTable from './components/ComponentTable.vue'
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal';
import SimpleDialogComponent from './components/SimpleDialogComponent.vue'
import closeDialogPng from '@/assets/operatingterminal/images/closeDialog.png'
import emptyStockDetailPng from '@/assets/operatingterminal/images/emptyStockDetail.png'
import confirmPng from '@/assets/operatingterminal/images/confirm.png'
import { OutWarehouseDetailApi } from '@/api/wms/outwarehousedetail';


/** 刀具拣选工位操作终端  */
defineOptions({ name: 'CutterDistributionTerminal' })
const message = useMessage() // 消息弹窗
const dialogVisible = ref<boolean>(false)
const stockInfoList = ref<any[]>([]);

  //库位编码
const locationCode = ref<string[]>(['DJHCK#CPDJJBQ2#-S1','DJHCK#CPDJJBQ2#-S2','DJHCK#CPDJJBQ2#-S3','DJHCK#CPDJJBQ2#-S4']);

const cutterLocationInfo = ref<any>([])
const selectLocationId = ref<string>('')
const selectLocationCode = ref<string>('')
const selectStorageId = ref<string>('')
const selectCutterBarCode = ref<string>('')
const selectTrayId = ref<string>('')
//选择托盘
const chooseStockList = ref<any[]>([]);
//弹窗里被选中的托盘数据
const chooseStockRow = ref();
const waitOutData = ref<any[]>([]);
const waitInData = ref<any[]>([]);
// 刀具配送路径
const cutterDistributionPath = ref<string>('')
// 签入弹窗
const inSimpleDialogRef = ref()
// 签出弹窗
const outSimpleDialogRef = ref()

onMounted(() => {
  getCutterLocationInfo()
  getOutWarehouseDetailList()
  getCutterWaitInOrderDetailList()
})

// 获取刀具出库列表
const getOutWarehouseDetailList = async() => {
  waitOutData.value = await OperatingtTerminalApi.getCutterWaitOutOrderDetailListByLocationCode(locationCode.value[0])
}

// 获取刀具入库列表
const getCutterWaitInOrderDetailList = async() => {
  waitInData.value = await OperatingtTerminalApi.getCutterWaitInOrderDetailListByLocationCode(locationCode.value[0])
}

// 获取刀具托盘信息
const getCutterLocationInfo = async() => {
  cutterLocationInfo.value = await OperatingtTerminalApi.getCutterLocationInfo(locationCode.value)
  console.log(cutterLocationInfo.value)
}

// 点击库位
const onClickLoction = (cutterTrayDetail) => {
  if(selectLocationId.value && selectLocationId.value == cutterTrayDetail.locationId){
    selectLocationId.value = ''
    selectLocationCode.value = ''
    selectTrayId.value = ''
  }else{
    selectLocationId.value = cutterTrayDetail.locationId
    selectLocationCode.value = cutterTrayDetail.locationCode
    selectTrayId.value = cutterTrayDetail.cutterTrayId
    getDistributionPath()
  }
}

// 点击储位
const onClickStorage = (storage) => {
  if(selectStorageId.value && selectStorageId.value == storage.storageId){
    selectStorageId.value = ''
    selectCutterBarCode.value = ''
  }else{
    // 选中效果
    selectStorageId.value = storage.storageId
    selectCutterBarCode.value = storage.barCode
    if(storage.barCode){
      getCutterInfo(storage.barCode)
    }
  }
}


 // 签入弹窗2
const openInSimpleDialog = () =>{
  if(!selectStorageId.value || selectCutterBarCode.value){
    message.error('请先选择空储位');
    return;
  }
  inSimpleDialogRef.value.openDialog();
}

// 签出弹窗3
const openOutSimpleDialog = () =>{
  if(!selectCutterBarCode.value){
    message.error('请先选择签出刀具');
    return;
  }
  outSimpleDialogRef.value.openDialog();
}


//选择托盘的弹窗
const openDialog = async()=>{
  if(selectTrayId.value){
    message.error('已存在托盘，无需呼叫');
    return;
  }
  if(selectLocationId.value){
    await getTrayListByLocationId()
    dialogVisible.value = true;
  }else{
    message.error('请先选择库位');
  }

}

//关闭弹窗
const closeDialog = ()=>{
  stockInfoList.value = []
  dialogVisible.value = false;
}


//签入
const warehouseIn = async( barCode:string) => {

  const data = {
    barCode: barCode,
    storageId: selectStorageId.value,
  }
  if(await OperatingtTerminalApi.checkInAssignCutter(data)) {
    message.success('签入成功');
  }else {
    message.error('签入失败');
  }
}

//签出     todo: 待完善 签出库位 还是储位 有疑问
const warehouseOut = async(locationCode: string)=> {
  const data = {
    barCode: selectCutterBarCode.value,
    locationCode: locationCode,
  }
  if(await OperatingtTerminalApi.checkOutCutter(data)) {
    message.success('签出成功');
  }else {
    message.error('签出失败');
  }
}

//获取绑定了此接驳库区的有空闲储位的托盘
const getTrayListByLocationId = async() => {
  chooseStockList.value = await OperatingtTerminalApi.getTrayListByLocationId(selectLocationId.value);
  console.log("获取绑定了此接驳库区的有空闲储位的托盘",chooseStockList.value)
}


//确认选择
const confirmChoose = ()=>{
  if(chooseStockRow.value){
    callTray(chooseStockRow.value).then(res=>{
      if(res){
        message.success('呼叫任务生成成功')
      }else {
        message.success('呼叫任务生成失败')
      }
    })
    chooseStockRow.value = null;
    closeDialog();
  }else {
    message.info('请选择托盘')
  }
}


//呼叫托盘
const callTray = async (checkData) => {
  const data = {
    materialStockId: checkData.id,
    targetLocationId: selectLocationId.value,
  }
  return await OperatingtTerminalApi.callTray(data)
}


//弹窗表格单击,保存选中托盘行数据
const chooseStockClick = async(row)=>{
  chooseStockRow.value = row;
  stockInfoList.value =  await OperatingtTerminalApi.getMaterialStockByTray(row);
}



//刀具配送
const trayDistributionClick =async()=>{
  if(!selectTrayId.value){
    message.error('请先选择托盘');
      return;
    }
  ElMessageBox.confirm('确定开始配送刀具？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
    }).then(() => {
      OutWarehouseDetailApi.distributionTool(selectLocationCode.value).then(res => { 
        if(res){
          message.success('刀具配送任务生成成功')
        }else {
          message.error('刀具配送任务生成失败')
        }
      });
    })
}

//获取刀具配送路径
const getDistributionPath = async()=>{
  if(selectLocationCode.value && selectTrayId.value){
   const res = await OutWarehouseDetailApi.getDistributionPath(selectLocationCode.value)
   if(res.length > 0){
    cutterDistributionPath.value = "";
    for(let i=0;i<res.length;i++)
    if(i == 0){
      cutterDistributionPath.value +=  res[i];
    }else{
      cutterDistributionPath.value += " >>> " +  res[i];
    }
   }
  }else {
    cutterDistributionPath.value = ""
  }
}

const getCutterInfo = async(barCode:string) => {
  cutterInfo.value = await OperatingtTerminalApi.getCutterInfo(barCode)
}

const leftHeaders = [
  {
    value: 1,
    unit: '把',
    label: '备刀总数'
  },
  {
    value: 22,
    unit: '把',
    label: '回收总数'
  },
  {
    value: 333,
    unit: '把',
    label: '需求总数'
  },
  {
    value: 4444,
    unit: '把',
    label: '延误总数'
  },
]

const waitOutColumns = [
  {
    prop: 'materialNumber',
    label: '刀具编码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'materialName',
    label: '刀具名称',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '刀具物码',
    width: '20%',
    align: 'center'
  },
  // {
  //   prop: 'totality',
  //   label: '刀具长度',
  //   width: '10%',
  //   align: 'center'
  // },
  // {
  //   prop: 'totality',
  //   label: '刀具半径',
  //   width: '10%',
  //   align: 'center'
  // },
  {
    prop: 'targetWarehouseName',
    label: '目标仓库',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'targetLocationName',
    label: '目标库位',
    width: '40%',
    align: 'center'
  },
  {
    prop: 'needTime',
    label: '需求时间',
    width: '10%',
    align: 'center'
  },
]

const waitInColumns = [
{
    prop: 'materialNumber',
    label: '刀具编码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'materialName',
    label: '刀具名称',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'barCode',
    label: '刀具物码',
    width: '20%',
    align: 'center'
  },
  {
    prop: 'totality',
    label: '刀具长度',
    width: '30%',
    align: 'center'
  },
  {
    prop: 'locationName',
    label: '刀具库位',
    width: '40%',
    align: 'center'
  },

]

const cutterInfo = ref(
{
  header: [
    {
      lable: '刀具编码:',
      value: ''
    },
    {
      lable: 'RFID:',
      value: ''
    }
  ],
  body: [
      {
        lable: '刀具类型',
        value: ''
      },
      {
        lable: '刀具长度',
        value: ''
      },
      {
        lable: '刀具半径',
        value: ''
      },
      {
        lable: '刀具规格',
        value: ''
      },
      {
        lable: '刀具品牌',
        value: ''
      },
      {
        lable: '刀具类别',
        value: ''
      },
  ]
})

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



</script>
<style lang="scss">
@import url("@/assets/operatingterminal/scss/cutterdistributionterminal.scss");
.my-dialog{
  //弹窗样式
  .el-dialog{
    background-color: transparent;
    background-image: url("@/assets/operatingterminal/images/dialog.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .el-dialog__header{
    padding: 0;
  }
  .el-dialog__body,el-dialog__header{
    padding: 0;
  }


  .my-dialog-main{
    height: 400px;
  }
  
  //弹窗里的关闭按钮
  .closeContainer{
    width: 30px;
    height:30px;
    margin-top: 10px;
    left:95%;
    position: relative;
  }
  .closeContainer:hover{
    box-shadow: -1px 1px 1px rgba(0,0,0,.5);
    opacity: 0.8;
    cursor: pointer;
  }

  //弹窗里的确认按钮
  .confirmContainer{
    width: 224px;
    height:83px;
    //background-color: red;
    position: relative;
    left:42%;
    .confirmContect{
      transform: scale(0.3);
      transform-origin:0% 0%;
      position: relative;
      left:65%;
      top:30%;
    }
    .confirmContect:hover{
      box-shadow: -1px 1px 1px rgba(0,0,0,.5);
      opacity: 0.8;
      cursor: pointer;
    }
  }

  //弹窗-空托盘-详情文字
  .emptyStockText{
    margin-top: 8px;
    font-size: 1.1em;
    color: #76f0ee;
  }

  //弹窗-空托盘-详情数据
  .emptyStockDetail{
    height: 300px;
    position: relative;
    //弹窗-空托盘-详情图片
    .emptyStockDetailPng{
      position: absolute;
    }
    //弹窗-空托盘-详情表格
    .emptyStockDetailTable{
      width: 96%;
      top:20%;
      position: relative;
    }
  }
    /** 布局配置 */
    .el-main{
    padding: 0;
    overflow: hidden;
  }
  .el-header{
    padding: 0;
  }
  .el-footer{
    padding: 0;
  }
  .el-container{
    overflow: hidden;
  }

  
  //占位,确保布局正确
  .aside1,.aside2{
    //width:2vw;
    height: 40vh;
  }

  .aside3,.aside4{
    //width:2vw;
    height: 45vh;
  }

}
</style>