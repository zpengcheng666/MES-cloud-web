<template>
  <el-dialog class="inoutDialog" v-model="dialogVisible" destroy-on-close width="25vw" @close="closeDialog">
    <span style="color: #DADDE1; font-size: 18px; " v-if="operType != 1 && operType != 4 "> {{ selectedNum }} / {{number}}</span>
    <div class="inoutDiv">
      <el-table
        :data="inoutListData"
        :show-header=false
        class="inout-table"
        max-height="18vh"
        ref="itemTableRef"
        v-if="operType != 1 && operType != 4"
        @selection-change="selectionChange"
        :header-cell-style="{
            background: 'transparent',
            color: '#ffffff'
          }"
      >
        <el-table-column width="80" align="right" type="selection" />
        <el-table-column align="left" prop="barCode" />
      </el-table>

      <el-form ref="formRef" v-if="operType == 1 || operType == 4">
        <el-row :gutter="10" align="middle" style="margin-top:3vh">
          <el-col :span="20">
            <el-form-item label="数量" prop="number">
              <el-input-number
                v-model="number"
                placeholder="请输入物料条码"
                controls-position="right"
                :min="1"
                :precision="0"
                class="!w-100%"
                ref="barCodeInputRef"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="confirmBtn">
        <el-image class="btn" :src="confirmBtn" @click="confirm" />
      </div>
    </template>
  </el-dialog>

</template>
<script setup lang="ts">
import { OperatingtTerminalApi } from '@/api/wms/operatingterminal'
import confirmBtn from "@/assets/operatingterminal/inoutimage/confirmBtn.png";

defineOptions({ name: 'InOutStockDialog' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中

const dialogVisible = ref(false) // 弹窗的是否展示
const inoutListData = ref<any[]>([]);
const billId = ref('')
const billType = ref('')
const operType = ref('')
const number = ref(0)
const selectedNum = ref(0)
const locationId = ref('')

// 选中、取消复选框
const selectionChange = () => {
  selectedNum.value = itemTableRef.value.getSelectionRows().length
}

/** 打开弹窗 */
const open = async (bType: string, location: string, type: string, id? : number, sum? : number) =>
{
  dialogVisible.value = true
  billId.value = id
  billType.value = bType
  operType.value = type
  locationId.value = location
  // 收货
  if(bType == 'in'){
    number.value = sum
    // 类型为采购
    // 扫码收货 (非采购、委托代加工)
    if(type != '1' && type != '4'){
      inoutListData.value = await OperatingtTerminalApi.getSignConsignmentDetail(id);
      // 初始化扫码枪
      initScanCodeUtil()
    }
  }
  // 发货
  else{
    number.value = sum
    inoutListData.value = await OperatingtTerminalApi.getShippingDetailByShippingInfoId(id);
    // 初始化扫码枪
    initScanCodeUtil()
  }
}

defineExpose({open}) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success'])

// 关闭keydown事件
const closeDialog = async () =>
{
  $('body').off('keydown')
  // // 清空选中行
  // emit('resetRow')
}

const confirm = async () =>
{
  dialogVisible.value = false
  $('body').off('keydown')
  // 收货
  if(billType.value == 'in'){
    // 类型为采购
    // 扫码收货
    if(operType.value != '1' && operType.value != '4'){
      const data = {
        consignmentInfoId: billId.value,
        locationId: locationId.value,
        barCodes: itemTableRef.value.getSelectionRows().map(row => row.barCode)
      }
      // 条码签收
      await OperatingtTerminalApi.signMaterial(data)
    }
    // 数量签收
    else {
      const data = {
        consignmentInfoId: billId.value,
        locationId: locationId.value,
        number: number.value
      }
      await OperatingtTerminalApi.signNumber(data)
    }
    message.success(t('签收成功'))
  }
  // 发货
  else {
    // 扫码收货
    if(operType.value == '2'){
      const data = {
        shippingInfoId: billId.value,
        // locationId: locationId.value,
        barCodes: itemTableRef.value.getSelectionRows().map(row => row.barCode)
      }
      // 条码发货
      await OperatingtTerminalApi.signMaterialShipping(data)
      message.success(t('发货成功'))
    }
  }

  emit('success')
}

/**
 * 扫描枪工具类
 */
import $ from '@/views/wms/operatingterminal/jquery';
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
    // 监听扫描事件
    $('body').on("keydown").keydown(function (event) {
      ScanCodeUtil.execute(event, callback);
    });
  }
};

const itemTableRef = ref() // 表格的 Ref

const initScanCodeUtil = () => {
  ScanCodeUtil.listen(function (code) {
    inoutListData.value.forEach((item) => {
      // 匹配日期
      if(item.barCode == code){
        itemTableRef.value.toggleRowSelection(item, true)
        selectedNum.value = itemTableRef.value.getSelectionRows().length
      }
    })
  });
}

</script>


<style lang="scss" scoped>
.inout-table {
  width: 90%;
  margin-left: 5%;
  //border-top: 0.3vh solid rgba(37,249,254,1);
  background-color: transparent;
  font-size: large;
  font-weight: normal;
  color: #DADDE1;

  --el-table-text-color: white;
  --el-table-header-text-color: white;
  --el-table-border-color: none;
  --el-table-row-hover-bg-color: none;
  --el-table-current-row-bg-color: rgb(118, 240, 238, 0.4);
}

.inout-table :deep(*) {
  background-color: transparent;
}

:deep(.el-checkbox.el-checkbox--large .el-checkbox__label) {
  font-size: 1vw;
  color: white;
  font-weight: 540;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #2bb673;
  //border-color: #2bb673;
}
</style>

<style lang="scss">
.page-main {
  .inoutDialog {
    --el-dialog-bg-color: transparent;
    background-image: url(@/assets/operatingterminal/inoutimage/dialog.png);
    background-size: 100% 100%;
    height: 30vh;
    position: relative;
    .el-dialog__header {
      display: none;
    }

    .el-dialog__footer {
      border-top: none !important;
    }

    .inoutDiv {
      position: absolute;
      top: 5vh;
      width: 90%;
      margin-left: 10%;

      .el-input__wrapper {
        //margin-top: 4vh;
        background-color: transparent;
        border: 2px solid #01e0fc !important;
        box-shadow: none !important;
      }

      .el-input__inner {
        color: #76f0ee;
        font-size: large;
        outline: none;
        border-color: transparent;
        background: transparent !important;
      }
      .el-form-item__label {
        font-size: 0.9vw;
        color: #76f0ee;
      }

      .el-input-number.is-controls-right .el-input-number__decrease, el-input-number__increase  {
        border-color: #DADDE1;
      }

      .el-input-number.is-controls-right .el-input-number__decrease, .el-input-number.is-controls-right .el-input-number__increase {
        background-color: #76f0ee;
      }
    }

    .confirmBtn {
      height: 4vh;
      position: absolute;
      right: 9vw;
      bottom: 2vh;
      .btn:hover {
        background: #15bc83;
        box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.5);
        opacity: 0.8;
        cursor: pointer;
      }
    }
  }
}
</style>
