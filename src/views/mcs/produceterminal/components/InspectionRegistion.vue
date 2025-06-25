<template>
  <el-container :gutter="20" class="inpestion-container" fit="contain">
    <el-container class="inpestion-container1">
      <el-header class="inpestion-header">
        <div class="taskText">检验信息录入</div>
      </el-header>
      <el-main class="inpestion-main1">
        <el-table
          :data="schemeList"
          class="inspect-table"
          max-height="40vh"
          highlight-current-row
          @row-click="handleRowClick"
          :header-cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
          :cell-style="{ borderBottom: '0.3vh solid rgb(37,249,254,1)' }"
          ref="schemeTableRef"
        >
          <el-table-column label="生产单号" align="center" prop="recordNumber" />
          <el-table-column label="总数量" align="center" prop="quantity" />
          <el-table-column label="待检验" align="center" prop="toInspectionQuantity" />
          <el-table-column label="合格 / 不合格" align="center">
            <template #default="scope">
              <span>{{ scope.row.qualifiedQuantity }} / {{ scope.row.unqualifiedQuantity }} </span>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-row :gutter="5">
                <el-col :span="12">
                  <div
                    class="callBtn"
                    @click.stop="openMaterialForm(scope.row)"
                    v-if="scope.row.selfInspection == null"
                  ></div>
                </el-col>
                <el-col :span="12">
                  <div class="operBtn" @click.stop="clickRow(scope.row)"></div>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-container class="inpestion-container2">
      <el-header class="inpestion-header">
        <div class="taskText">{{ curtask }}检验任务</div>
        <div class="scanText">
          物料条码&nbsp;<span>{{ formData.barCode }}</span>
        </div>
      </el-header>
      <el-main class="inpestion-main2">
        <el-row :gutter="20">
          <el-col :span="8" class="inspectSummary">
            当前零件应检验数:
            <span style="color: rgba(37, 249, 254, 1)">{{ sumQuantity }}</span>
          </el-col>
          <el-col :span="8" class="inspectSummary">
            已检验数:
            <span style="color: rgba(37, 249, 254, 1)">{{ inspectedQuantity }}</span>
          </el-col>
          <el-col :span="8" class="inspectSummary">
            待检验数:
            <span style="color: rgba(37, 249, 254, 1)">{{ toInspectQuantity }}</span>
          </el-col>
        </el-row>

        <el-form
          ref="recordFormRef"
          :model="formData.records"
          :rules="formRules"
          :inline-message="true"
        >
          <el-table
            :data="formData.records"
            class="inspect-table"
            max-height="40vh"
            :header-cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
            :cell-style="{ borderBottom: '0.3vh solid rgb(37,249,254,1)' }"
          >
            <el-table-column label="检验项" align="center" prop="inspectionSchemeItemName" />
            <el-table-column label="检验标准" align="center" prop="schemeContent" />
            <el-table-column label="实际测量" align="center" prop="content">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.content`"
                  :rules="formRules.content"
                  class="mb-0px!"
                >
                  <el-input
                    v-model="row.content"
                    class="no-border"
                    placeholder="请输入"
                    :readonly="
                      curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus != 0
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="是否合格" align="center" prop="inspectionResult">
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.inspectionResult`"
                  :rules="formRules.inspectionResult"
                  class="mb-0px!"
                >
                  <el-select
                    v-model="row.inspectionResult"
                    placeholder="请选择"
                    class="select-result"
                    popper-class="select-popper"
                    :popper-append-to-body="false"
                    :disabled="
                      curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus != 0
                    "
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="实际测量"
              align="center"
              prop="mutualContent"
              v-if="isConfirm && curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus >= 1"
            >
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.mutualContent`"
                  :rules="formRules.mutualContent"
                  class="mb-0px!"
                >
                  <el-input
                    v-model="row.mutualContent"
                    class="no-border"
                    placeholder="请输入"
                    :readonly="
                      curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus > 1
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="是否合格"
              align="center"
              prop="mutualInspectionResult"
              v-if="isConfirm && curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus >= 1"
            >
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.mutualInspectionResult`"
                  :rules="formRules.mutualInspectionResult"
                  class="mb-0px!"
                >
                  <el-select
                    v-model="row.mutualInspectionResult"
                    placeholder="请选择"
                    class="select-result"
                    popper-class="select-popper"
                    :popper-append-to-body="false"
                    :disabled="
                      curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus > 1
                    "
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="实际测量"
              align="center"
              prop="specContent"
              v-if="isConfirm && curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus >= 3"
              fixed="right"
            >
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.content`"
                  :rules="formRules.content"
                  class="mb-0px!"
                >
                  <el-input
                    v-model="row.specContent"
                    class="no-border"
                    placeholder="请输入"
                    :readonly="
                      curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus > 3
                    "
                  />
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column
              label="是否合格"
              align="center"
              prop="specInspectionResult"
              v-if="isConfirm && curRow && curRow.selfInspection == 1 && curRow.selfAssignmentStatus >= 3"
              fixed="right"
            >
              <template #default="{ row, $index }">
                <el-form-item
                  :prop="`${$index}.specInspectionResult`"
                  :rules="formRules.specInspectionResult"
                  class="mb-0px!"
                >
                  <el-select
                    v-model="row.specInspectionResult"
                    placeholder="请选择"
                    class="select-result"
                    popper-class="select-popper"
                    :popper-append-to-body="false"
                    :disabled="curRow.selfInspection == 1 && curRow.selfAssignmentStatus > 3"
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_RESULT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-main>

      <el-footer class="inpestion-footer2" v-if="formData.records.length > 0">
        <div style="margin-left: 30%">
          <el-form ref="resultFormRef" :model="formData" :rules="formRules">
            <el-form-item prop="result">
              <el-checkbox-group v-model="formData.result" @change="singleSelect">
                <el-checkbox :label="1" :key="1" :value="1" size="large">合格</el-checkbox>
                <el-checkbox :label="2" :key="2" :value="2" size="large">不合格</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="confirmBtn">
          <el-image class="btn" :src="saveBtn" @click="submit('save')" />
          <el-image class="btn" :src="confirmBtn" @click="submit('submit')" />
        </div>
      </el-footer>
    </el-container>

    <el-dialog class="scanBarCodeDialog" v-model="detailDialog" destroy-on-close width="25vw">
      <div class="scanBarCodeDiv">
        <el-form ref="formRef" :model="formData">
          <el-row :gutter="10" align="middle">
            <el-col :span="20">
              <el-form-item label="物料条码" prop="barCode">
                <el-input
                  v-model="barCode"
                  placeholder="请输入物料条码"
                  class="bar-code-input"
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
  </el-container>

  <MaterialStockForm ref="materialStockRef" :scheme-id="curRow.inspectionSchemeId" />
</template>
<script setup lang="ts">
import { inject } from 'vue'
import confirmBtn from '@/assets/produceterminal/images/confirmBtn.png'
import saveBtn from '@/assets/produceterminal/images/saveBtn.png'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { InspectionResultVO, InspectionSheetApi } from '@/api/qms/inspectionsheet'
import MaterialStockForm from './MaterialStockForm.vue'

defineOptions({ name: 'InspectionRegistion' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const loading = ref(true) // 列表的加载中
const detailDialog = ref(false)

const formData = ref<any>({
  records: [],
  result: [],
  barCode: undefined
})

const formRules = reactive({
  content: [{ required: true, message: '实际测量不能为空', trigger: 'blur' }],
  inspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  mutualContent: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  mutualInspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  specContent: [{ required: true, message: '测量结果不能为空', trigger: 'blur' }],
  specInspectionResult: [{ required: true, message: '是否合格不能为空', trigger: 'blur' }],
  result: [{ required: true, message: '检验结果不能为空', trigger: 'change' }]
})

const recordFormRef = ref() // 表单 Ref
const resultFormRef = ref() // 表单 Ref

const schemeList = ref<any[]>([])

const userData: any = inject('userData') //用户数据
const stationData: any = inject('stationData') // 工位数据

/** 查询检测任务 */
const getInspectionSheetSchemeList4Terminal = async () => {
  loading.value = true
  try {
    const params = {
      assignmentId: userData.value.id
    }
    schemeList.value = await InspectionSheetApi.getInspectionSheetSchemeList4Terminal(params)
  } finally {
    loading.value = false
  }
}


// 点击检验任务
const handleRowClick = (row) => {
  // 初始化
  reset()
  // 再次点击当前行取消高亮
  if (curRow.value == row) {
    // 取消高亮
    schemeTableRef.value?.setCurrentRow()
    // 初始化定时器
    initInterval()
  }
  else {
    curRow.value = row
  }
}

/**
 * 查询检测产品集合
 * @param row
 */

const curRow = ref<any>({})
const barCodeInputRef = ref()
const clickRow = async (row) => {
  detailDialog.value = true
  curRow.value = row
  barCode.value = ''
  // 生产检验 且 自检 显示barcode
  if (row.schemeType == 2 && row.selfInspection != null) {
    barCode.value = row.barCode
  }
  schemeTableRef.value?.setCurrentRow(row)
}

const materialStockRef = ref()
const openMaterialForm = (row) => {
  schemeTableRef.value?.setCurrentRow(row)
  curRow.value = row
  materialStockRef.value.open(row.id)
}

/**
 * 扫码完成
 * @param row
 */
const barCode = ref()
// 检验产品主键
const schemeMaterialId = ref()
// 检验总数量
const sumQuantity = ref()
// 待检验数量
const toInspectQuantity = ref()
// 已检验数量
const inspectedQuantity = ref()

// 扫码完成确认标识
const isConfirm = ref(false)

/**
 * 扫码完成
 */
const confirm = async () => {

  // 验证物料条码
  const result = await validInspectionSchemeBarCode()
  if (result) {


    console.log(111, curRow.value)

    // 扫码成功 工序检 更新任务开始
    // 单据来源生产且非自检
    if(curRow.value.sourceType == 6 && curRow.value.selfInspection == null){
      const recordParam = {
        barCode: barCode.value,
        inspectionSchemeId: curRow.value.id,
        deviceId: stationData.value.id
      }
      const result = await InspectionSheetApi.updateMcsRecordBegin(recordParam)

      console.log(123, result)
    }

    // 扫码完成
    isConfirm.value = true
    // 当前任务
    curtask.value = curRow.value.recordNumber
    // 物料条码
    formData.value.barCode = barCode.value
    // 获取检验记录
    await getInspectionRecords()
  }
}

/**
 * 验证物料条码
 */
const validInspectionSchemeBarCode = async () => {
  const params = {
    barCode: barCode.value,
    schemeId: curRow.value.id
  }
  return await InspectionSheetApi.validInspectionSchemeBarCode(params)
}

/**
 * 获取检验记录
 */
const getInspectionRecords = async () => {
  loading.value = true
  try {
    formData.value.barCode = barCode.value
    const params = {
      inspectionSchemeId: curRow.value.id,
      barCode: barCode.value
    }
    const data = await InspectionSheetApi.getInspectionSheetRecordList4Terminal(params)
    formData.value.records = data.records
    formData.value.result[0] = data.inspectionResult
    schemeMaterialId.value = data.schemeMaterialId
    sumQuantity.value = curRow.value.quantity
    toInspectQuantity.value = curRow.value.toInspectionQuantity
    inspectedQuantity.value = curRow.value.inspectedQuantity
  } finally {
    loading.value = false
    detailDialog.value = false
  }
}

// 复选按钮转单选
const singleSelect = () => {
  formData.value.result = formData.value.result.slice(-1)
}

const submit = async (type: string) => {
  if (type === 'submit') {
    // 校验表单
    await recordFormRef.value.validate()
    await resultFormRef.value.validate()
  }
  // 提交请求
  loading.value = true
  try {
    const data = {
      barCode: formData.value.barCode,
      sheetId: curRow.value.inspectionSheetId,
      sheetSchemeId: curRow.value.id,
      sheetSchemeMaterialId: schemeMaterialId.value,
      inspectionResult: formData.value.result[0],
      records: formData.value.records,
      deviceId: stationData == undefined ? null : stationData.value.id
    }

    // 自检任务
    if (curRow.value.selfInspection == '1') {
      // 当前状态是互检
      if (curRow.value.selfAssignmentStatus == 1) {
        data.records = data.records.map((r) => ({
          id: r.id,
          inspectionResult: r.mutualInspectionResult,
          content: r.mutualContent
        }))
      }
      // 当前状态是专检
      else if (curRow.value.selfAssignmentStatus == 3) {
        data.records = data.records.map((r) => ({
          id: r.id,
          inspectionResult: r.specInspectionResult,
          content: r.specContent
        }))
      }
    }

    // 提交
    if (type === 'submit') {
      await InspectionSheetApi.updateInspectionSheetRecordTerminal(data as any)
    }
    // 保存
    else {
      await InspectionSheetApi.updateInspectionSheetRecordTemp(data)
    }
    // 刷新待检验任务列表
    await getInspectionSheetSchemeList4Terminal()
    // 初始化待检验数量
    reset()
    // 初始化定时器
    initInterval()
    message.success(t('common.createSuccess'))
  } finally {
    loading.value = false
  }
}

const reset = () => {
  curtask.value = ''
  barCode.value = undefined
  // 检验产品主键
  schemeMaterialId.value = undefined
  // 检验总数量
  sumQuantity.value = undefined
  // 待检验数量
  toInspectQuantity.value = undefined
  // 已检验数量
  inspectedQuantity.value = undefined
  // 物料条码
  formData.value.barCode = undefined
  // 检验记录
  formData.value.records = []
  // 检验结果
  formData.value.result = []
  // 当前选中行
  curRow.value = {}
  // 扫码完成
  isConfirm.value = false
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

// 检验任务表格ref
const schemeTableRef = ref()
/** 查询检测任务 */
const scanBarCode = async (code) => {
    // 重置
    reset()
    // barcode获取检验任务
    let params = {
      assignmentId: userData.value.id,
      barCode: code
    }
    const scheme = await InspectionSheetApi.getInspectionSheetSchemeListByBarCode4Terminal(params)
    // 当前barCode有检验任务
    if(scheme){
      schemeList.value.forEach((item) => {
        // 选中当前检验任务
        if(item.id == scheme.id){
          schemeTableRef.value?.setCurrentRow(item)
          curRow.value = item
          barCode.value = code
          return
        }
      })
    }

    if(Object.keys(curRow.value).length > 0 ){
      await confirm()
    }
    else {
      schemeTableRef.value?.setCurrentRow()
    }
}

const initScanCodeUtil = () => {
  ScanCodeUtil.listen(function (code) {
    scanBarCode(code)
  });
}

let timer = null;
const initInterval = () => {
  // console.log("init")
  timer = setInterval(async () => {
    if(Object.keys(curRow.value).length != 0){
      clearInterval(timer);
    }
    else {
      await getInspectionSheetSchemeList4Terminal();
    }
  }, 20000);
}

onMounted(() => {
  // 查询检验任务集合
  getInspectionSheetSchemeList4Terminal()
  // 初始化扫码枪
  initScanCodeUtil()
  // 初始化定时器
  initInterval()
})

onBeforeUnmount(() => {
  // console.log("unmount")
  clearInterval(timer);
});

const curtask = ref('')
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/inspectionRegistion.scss');
</style>

<style lang="scss">
.select-result .el-select__wrapper {
  border: none !important;
  box-shadow: none !important;
  .el-select__selected-item {
    font-size: larger;
    font-weight: bold;
    text-align: center;
    color: #61bbe4;
  }
}

.select-popper.el-select__popper.el-popper {
  background: transparent !important;
  border: none !important;
}

.select-popper.el-select__popper .el-select-dropdown {
  background-color: #021324 !important;
  text-align: center;
  background-image: url(@/assets/produceterminal/images/select-dropdown2.png);
  background-size: 100% 100%;
  border-radius: 0 !important;
  margin-top: -0.6vh;
}

.select-popper.el-select__popper .el-select-dropdown__item {
  font-size: large;
  font-weight: bold;
  color: #5fb7e6;
  //margin-left: 8vh;
}

.select-popper.el-select__popper.el-popper .el-popper__arrow {
  display: none !important;
}

.select-popper.el-select__popper .el-select-dropdown__list {
  padding: 0 !important;
}

.select-popper.el-select__popper .el-select-dropdown__item.is-selected {
  color: #61bbe4;
  font-weight: 700;
}

.select-popper.el-select__popper .el-select-dropdown__item.is-hovering {
  //background-color: #0E4666 !important;
  color: #baecf7;
  background-image: url(@/assets/produceterminal/images/select-dropdown-active2.png);
  background-size: 100% 100%;
}

.scanBarCodeDialog {
  --el-dialog-bg-color: transparent;
  background-image: url(@/assets/produceterminal/images/taskRunDetailBackground.png);
  // background-image: url(@/assets/produceterminal/images/problemReportingInput.png);
  background-size: 100% 100%;
  height: 30vh;
  position: relative;
  .el-dialog__header {
    display: none;
  }

  .scanBarCodeDiv {
    position: absolute;
    top: 10vh;
    width: 90%;
    margin-left: 10%;
  }
  .el-input__wrapper {
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

  .confirmBtn {
    height: 5vh;
    width: 6vw;
    position: absolute;
    right: 3vw;
    bottom: 5vh;
    .btn:hover {
      background: #15bc83;
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.5);
      opacity: 0.8;
      cursor: pointer;
    }
  }
}
</style>
