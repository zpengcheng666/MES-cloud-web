<template>
  <!--<div style="border: 1px solid red;height:40vh;width:24vw">-->
  <!--<div style="border: 1px solid red;height:45vh">-->
    <!-- 区域信息 -->
    <el-container class="area">
      <el-main class="areafont">
        {{areaInfo}}
      </el-main>
    </el-container>
    <!-- 托盘信息和托盘下的图片按钮 -->
    <el-container class="stock">
      <el-main class="stockmain">
        <div class="stockInfo" >
          <div class="stockitem" v-if="stockInfo?.barCode">
            <div><span style="margin:0 10% 0 -10%">托盘编码:</span>{{stockInfo.materialNumber}}</div>
            <div><span style="margin:0 10% 0 -10%">托盘条码:</span>{{stockInfo.barCode}}</div>
            <div><span style="margin:0 10% 0 -10%">托盘状态:</span>{{ stockInfo.locationLocked? '锁定' : '未锁定' }}</div>
          </div>
          <div class="stockitemnone" v-else>
            无托盘
          </div>
        </div>
        <div class="stockbtn">
          <div class="stockimg" v-if="stockInfo?.barCode">
            <!-- 上架 -->
            <el-image class="warehouse" v-show="stockwarehouseVisible" @click="stockWarehouseClick" :src="upshelfPng" fit="contain" />
          </div>
          <div class="stockimg" v-else>
            <!-- 下架 -->
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
</template>

<script setup lang="ts">
  import downshelf from '@/assets/operatingterminal/images/downshelf.png'
  import upshelfPng from '@/assets/operatingterminal/images/upshelf.png'
  import confirmPng from '@/assets/operatingterminal/images/confirm.png'
  import closeDialogPng from '@/assets/operatingterminal/images/closeDialog.png'
  import emptyStockDetailPng from '@/assets/operatingterminal/images/emptyStockDetail.png'

  import ComponentTable from './ComponentTable.vue'
  import {OperatingtTerminalApi} from "@/api/wms/operatingterminal";

  /** 区域组件 */
  defineOptions({ name: 'ComponentArea6' })

  const props = defineProps({
    // key 是 prop 的名称, value 是该 prop 预期类型的构造函数
    areaInfo: {
      type: String,
      default: () => ''
    },
    stockInfo: {
      type: Object,
      default: () => {}
    },
    chooseStockList: {
      type: Array,
      default: () => []
    },
    chooseStockColumns:{
      type: Array,
      default: () => []
    },
    emptyStockColumns:{
      type: Array,
      default: () => []
    },
    currentLocationCode: {
      type: String,
      default: () => ''
    },
  })

  //btnShow,无论是选择托盘还是托盘入库,点击后都要调用这个,用以确定按钮的显隐
  const emit = defineEmits(['btnShow'])

  const message = useMessage() // 消息弹窗
  const dialogVisible = ref<boolean>(false)
  //弹窗里被选中的数据
  const chooseStockRow = ref();

  const stockInfoList = ref<any[]>([]);

  //托盘入库按钮显示
  const stockwarehouseVisible =ref<boolean>(true)
  //选择托盘按钮显示
  const chooseStockVisible =ref<boolean>(true)

  
  //弹窗表格单击,保存选中行数据
  const chooseStockClick = async(row)=>{
    chooseStockRow.value = row;
    stockInfoList.value =  await OperatingtTerminalApi.getMaterialStockByTray(row);
    console.log("选中行数据",stockInfoList.value);
  }

  //选择托盘的弹窗
  const openDialog = ()=>{
    dialogVisible.value = true;
  }

  //关闭弹窗
  const closeDialog = ()=>{
    stockInfoList.value = []
    dialogVisible.value = false;
  }
  //确认选择
  const confirmChoose = ()=>{
    if (chooseStockRow.value == null || chooseStockRow.value == undefined) {
      message.info('请选择托盘');
    }
    OperatingtTerminalApi.palletUnloading(chooseStockRow.value.id, chooseStockRow.value.locationId, props.currentLocationCode).then(res => {
      if (res) {
        message.success('下架成功')
        closeDialog()
        emit('btnShow');
        return
      } 
      message.error('下架失败')
    })
  }


  //上架
  const stockWarehouseClick =async()=>{
    await ElMessageBox.confirm('确定上架操作？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    });
    await OperatingtTerminalApi.available(props.currentLocationCode).then(res => {
      if (res) {
        message.success('上架成功')
        closeDialog()
        emit('btnShow');
        return
      } 
      message.error('上架失败')
    })
  }


  defineExpose({ stockwarehouseVisible,chooseStockVisible })
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
