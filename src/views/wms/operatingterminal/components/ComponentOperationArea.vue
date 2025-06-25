<template>
  <!-- 区域信息 -->
  <el-container class="area">
    <el-main class="areafont" v-for="(item,index) in props.areaList" :key="index" :style="divStyle[index]">
     <div style="text-align:center;" >{{item.trayInfo.locationName}}</div>
     <!-- <div style="text-align:center;" >{{item.locationName2}}</div> -->
    </el-main>
  </el-container>
  <!-- 托盘信息和托盘下的图片按钮 -->
  <el-container class="stock">
    <el-main class="stockmain" v-for="(item,index) in props.areaList" :key="index"   :style="divStyle[index]">
      
      <div class=" stockInfo" @click="showMaterialInfo(item,index)"   >
        <div class="stockitem" v-if="item.trayInfo.barCode"  :style="divStyle[index]" >

          <div style="margin-bottom: 5%"><span style="margin:0 10% 0 -10%">托盘编号:</span><span>{{item.trayInfo.materialNumber}}</span></div>
          <div style="margin-bottom: 5%"><span style="margin:0 10% 0 -10%">托盘条码:</span><span>{{item.trayInfo.barCode}}</span></div>
          <div style="margin-bottom: 5%"><span style="margin:0 10% 0 -10%">托盘状态:</span><span></span></div>
        </div>
        <div class="stockitemnone" v-else>
          无托盘
        </div>
      </div>
      <div class="stockbtn">
        <div class="stockimg" v-if="item?.materialNumber">
<!--          <el-image class="callAgv" :src="callAgvPng" fit="contain" />-->
          <el-image class="warehouse" :src="stockwarehousePng" fit="contain" @click="inWarehouseAction(item)" />
        </div>
        <div class="stockimg" v-else>
          <el-image class="chooseStock" :src="chooseStockPng" @click="openDialog(index)" fit="contain" />
          <el-image class="chooseMaterial" :src="chooseMaterialPng" @click="openDialogShowChooseMaterial(index)" fit="contain" />
        </div>

      </div>
    </el-main>
  </el-container>

<!--  空托盘详情弹窗 -->
  <div class="my-dialog">
    <el-dialog v-model="dialogVisible" width="1000px" :show-close="false" destroy-on-close @close="closeDialog">
      <el-container>
        <!-- 关闭按钮 -->
        <el-header height="100px">
          <div class="closeContainer">
            <el-image :src="closeDialogPng" @click="closeDialog" fit="contain" />
          </div>
        </el-header>
        <el-main class="my-dialog-main">
          <el-container>
            <el-aside width="15%"/>
            <!-- 左边的表格 -->
            <el-aside width="80%" class="my-table">
              <ComponentTable class="chooseStockTable" :table-data="chooseStockList" @row-click="chooseStockClick" highlight-current-row :table-column="chooseStockColumns" height="320px"/>
            </el-aside>
            <el-aside width="3%"/>
            <!-- 弹窗表格加确认按钮-->
            <div class="confirmContainer">
              <div class="confirmContect">
                <el-image :src="confirmPng" @click="confirmChoose" fit="contain" style="width: 100%;height: 100%;" />
              </div>
            </div>

            <el-aside width="2%"/>
          </el-container>
        </el-main>
        <el-footer  height="100px" />
      </el-container>
    </el-dialog>
  </div>
  <!-- 呼叫物料-->
  <div class="my-dialog">
    <el-dialog v-model="showChooseMaterial" width="1000px" :show-close="false" destroy-on-close @close="closeDialog">
      <el-container>
        <!-- 关闭按钮 -->
        <el-header height="100px">
          <div class="closeContainer">
            <el-image :src="closeDialogPng" @click="closeDialog" fit="contain" />
          </div>
        </el-header>
        <el-main class="my-dialog-main">
          <el-container>
            <el-aside width="15%"/>
            <!-- 左边的表格 -->
<!--            <div>{{materialListOutWhColumns}}</div>-->
            <el-aside width="40%" class="my-table">
              <ComponentTable class="chooseStockTable" :table-data="props.materialListOutWh" @row-click="chooseStockClick "
                              highlight-current-row :table-column="props.materialListOutWhColumns" height="320px"/>
            </el-aside>
            <el-aside width="3%"/>
            <el-main width="45%" >
              <div class="emptyStockText">
                物料详情
              </div>
              <div class="emptyStockDetail">
                <div class="emptyStockDetailPng">
                  <el-image :src="emptyStockDetailPng" fit="contain" />
                </div>
                <div class="emptyStockDetailTable my-table">
                  <ComponentTable :table-data="stockInfoList"  :table-column="stockColumnsOutWhColumns" height="160px"/>
                </div>

              </div>
              <div class="confirmContainer">
                <div class="confirmContect">
                  <el-image :src="confirmPng" @click="confirmChooseByOutWh" fit="contain" />
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
</template>

<script setup lang="ts">
  import stockwarehousePng from '@/assets/operatingterminal/images/stockwarehouse.png'
  import chooseStockPng from '@/assets/operatingterminal/images/chooseStock.png'
  import chooseMaterialPng from '@/assets/operatingterminal/images/chooseMater.png'
  import confirmPng from '@/assets/operatingterminal/images/confirm.png'
  import closeDialogPng from '@/assets/operatingterminal/images/closeDialog.png'
  import emptyStockDetailPng from '@/assets/operatingterminal/images/emptyStockDetail.png'

  import ComponentTable from './ComponentTable.vue'
  import {InWarehouseDetailApi, InWarehouseDetailVO} from "@/api/wms/inwarehousedetail";
  import {OperatingtTerminalApi} from "@/api/wms/operatingterminal";
  import {OutWarehouseDetailApi} from "@/api/wms/outwarehousedetail";
  import { DICT_TYPE } from '@/utils/dict'

 /** 区域组件 */
  defineOptions({ name: 'ComponentArea' })

  const props = defineProps({
    // key 是 prop 的名称, value 是该 prop 预期类型的构造函数
    areaList: {
      type: Array,
      default: () => []
    },
    chooseStockList: {
      type: Array,
      default: () => []
    },
    chooseStockColumns:{
      type: Array,
      default: () => []
    },
    stockColumnsOutWhColumns:{
      type: Array,
      default: () => []
    },
    materialListOutWhColumns:{
      type: Array,
      default: () => []
    },
   materialListOutWh:{
     type: Array,
     default: () => []
   },
    showMaterialInfoByTray:Function
  })

  const message = useMessage() // 消息弹窗
  const dialogVisible = ref<boolean>(false)
  const showChooseMaterial = ref<boolean>(false)
  //弹窗里被选中的数据
  const chooseStockRow = ref();

  const stockInfoList = ref<any[]>([]);
  const divStyle =  ref<any[]>([{"color":"white"},{"color":"white"},{"color":"white"},{"color":"white"},]);
  const flag = ref();
  //选择托盘的弹窗
  const openDialog = (number)=>{
    dialogVisible.value = true;
  }
  const openDialogShowChooseMaterial = (number)=>{
    showChooseMaterial.value = true;
  }
  //关闭弹窗
  const closeDialog = ()=>{
    dialogVisible.value = false;
    showChooseMaterial.value = false;
  }
  //确认选择
  const confirmChoose = ()=>{
    if(chooseStockRow.value){
      callTray(chooseStockRow.value).then(res=>{
        if(res){
          message.success('成功选择托盘')
          closeDialog();
        }else {
          message.success('选择托盘失败')
        }
      })

    }else {
      message.info('请选择托盘')
    }
    chooseStockRow.value=null;
  }
  //确认选择
  const confirmChooseByOutWh= ()=>{
    if(chooseStockRow.value){
      console.log(chooseStockRow.value);
      let data = {
        materialStockId: chooseStockRow.value.id,
      }

      callMaterial(chooseStockRow.value).then(res=>{
        if(res){
          message.success('成功选择物料')
          closeDialog();
        }else {
          message.success('选择物料失败')
        }
      })

    }else {
      message.info('请选择物料')
    }
    chooseStockRow.value=null;
  }
  //弹窗表格单击,保存选中行数据
  const chooseStockClick = async(row)=>{
    chooseStockRow.value=row;

    stockInfoList.value =  await OperatingtTerminalApi.getMaterialStockByTray( row);
  }
  //托盘入库
  const inWarehouseAction=async(item)=>{
    console.log('inWarehouseAction',item);
    await InWarehouseDetailApi.inWarehouseAction(item.locationId,item.atWarehouseId);
  }

  //呼叫托盘
  const callTray = async (data) => {
    return await InWarehouseDetailApi.callTray(data)
  }

  //呼叫物料
  const callMaterial = async (data) => {
    return await OutWarehouseDetailApi.callMaterial(data);
  }

  const showMaterialInfo=(item,index)=>{
    console.log("showMaterialInfo",item);
    //查询选中数据
    props.showMaterialInfoByTray(item);
    //改变选中颜色
    divStyle.value[flag.value] = {"color":"white"};
    divStyle.value[index] = {"color":"#00bed7", " background-color":"#76f0ee"};
    flag.value = index;
  }

</script>

<style lang="scss">
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
  }
</style>
