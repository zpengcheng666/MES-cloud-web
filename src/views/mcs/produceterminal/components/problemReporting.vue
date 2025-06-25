<template>
  <el-container class="root">
    <el-aside width="49%" class="left">
      <el-row class="left-top" align="middle">
        <el-col :offset="1" :span="12">
          <el-image :src="problemReportingHistoryText" fit="contain" class="image" />
        </el-col>
      </el-row>
      <div class="left-body">
        <el-scrollbar height="100%">
          <table>
            <div
              v-for="(v, i) in problemReporList"
              :key="i"
              :style="{ backgroundColor: i % 2 == 0 ? 'rgba(21,41,52,1)' : 'rgba(10,34,50,1)' }"
              class="forDiv"
              @click="handleClickOne(v.id)"
            >
              <tr>
                <td colspan="2"> 上报时间：{{ formatDate(new Date(v.createTime)) }} </td>
              </tr>
              <tr class="empty">
                <td> </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <div></div>
                  类型：{{
                    getIntDictOptions('mcs_problem_report_type').find((v2) => {
                      return v2.value == v.type
                    })?.label
                  }}
                </td>
                <td>
                  <div class="td-right">编号：{{ v.entity }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="td-left"></div>
                  状态：{{
                    getIntDictOptions('mcs_problem_report_status').find((v2) => {
                      return v2.value == v.status
                    })?.label
                  }}
                </td>
                <td>
                  <div class="td-right">
                    {{ getLastContent(v.content).type == 0 ? '问题' : '回复' }}：
                    {{ getLastContent(v.content).value }}
                  </div>
                </td>
              </tr>
            </div>
          </table>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-aside width="49%" class="right">
      <el-row class="right-top" align="middle">
        <el-col :offset="1" :span="12">
          <el-image :src="problemReportingText" fit="contain" class="image" />
        </el-col>
      </el-row>
      <div class="right-body">
        <el-scrollbar height="100%">
          <el-form :model="formData" :rules="rules" ref="formRef" v-if="nowStatus == 0">
            <table>
              <tr>
                <td class="tleft">类型:</td>
                <td class="tright">
                  <el-form-item prop="type">
                    <el-select
                      v-model="formData.type"
                      placeholder="请选择问题类型"
                      class="problem-reporting-select"
                      popper-class="problem-reporting-select-div"
                      @change="handleTypeSelectChange"
                    >
                      <el-option
                        class="problem-reporting-select-item"
                        v-for="dict in getIntDictOptions('mcs_problem_report_type')"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="taskShow">
                <td class="tleft">任务：</td>
                <td class="tright">
                  <el-form-item prop="reportId">
                    <el-select
                      v-model="taskSelect"
                      placeholder="请选择任务"
                      class="problem-reporting-select"
                      popper-class="problem-reporting-select-div"
                      @change="handleTaskSelectChange"
                    >
                      <el-option
                        class="problem-reporting-select-item"
                        v-for="dict in taskSelectList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="tleft">实体：</td>
                <td class="tright">
                  <el-form-item prop="reportId">
                    <el-select
                      :disabled="!selectEnabled"
                      v-model="formData.reportId"
                      placeholder="请选择实体"
                      class="problem-reporting-select"
                      popper-class="problem-reporting-select-div"
                    >
                      <el-option
                        class="problem-reporting-select-item"
                        v-for="dict in selectList"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr valign="top">
                <td class="tleft">问题描述：</td>
                <td class="tright">
                  <el-form-item prop="content">
                    <el-input
                      v-model="contentObj.value"
                      class="input"
                      :rows="8"
                      type="textarea"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form>
          <el-row justify="space-around" style="margin-top: 10vh" v-if="nowStatus == 0">
            <el-col :span="5" class="click" @click="handleCancelClick">
              <el-image :src="problemReportingCancel" />
            </el-col>
            <el-col :span="5" class="click" @click="handleOkClick">
              <el-image :src="problemReportingOK" />
            </el-col>
          </el-row>
          <!--------------------------------- 分隔 ------------------------------------------>
          <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            v-if="nowStatus == 1"
            class="show"
          >
            <table>
              <tr>
                <td class="tleft">类型:</td>
                <td class="tright">
                  <el-form-item prop="type">
                    <el-select
                      v-model="formData.type"
                      placeholder="请选择问题类型"
                      class="problem-reporting-select"
                      popper-class="problem-reporting-select-div"
                      @change="handleTypeSelectChange"
                      disabled
                    >
                      <el-option
                        class="problem-reporting-select-item"
                        v-for="dict in getIntDictOptions('mcs_problem_report_type')"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="tleft">实体：</td>
                <td class="tright">{{ entityShow }}</td>
              </tr>
              <tr>
                <td class="tleft">状态：</td>
                <td class="tright">
                  {{
                    getIntDictOptions('mcs_problem_report_status').find((v2) => {
                      return v2.value == formData.status
                    })?.label
                  }}
                </td>
              </tr>

              <tr>
                <td class="tleft" valign="top">历史：</td>
                <td class="tright">
                  <div
                    v-for="(v, i) of contentTable"
                    :key="i"
                    :style="{
                      backgroundColor: i % 2 == 0 ? 'rgba(21,41,52,1)' : 'rgba(10,34,50,1)',
                      padding: '5px'
                    }"
                  >
                    {{ v.type == 0 ? '问题' : '回复' }}：{{ v.value }}<br />
                  </div>
                </td>
              </tr>

              <tr valign="top">
                <td class="tleft">问题：</td>
                <td class="tright">
                  <el-form-item prop="content">
                    <el-input
                      v-model="contentObj.value"
                      class="input"
                      :rows="8"
                      type="textarea"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-form>
          <el-row justify="space-around" style="margin-top: 10vh" v-if="nowStatus == 1">
            <el-col :span="5" class="click" @click="handleCancelClick">
              <el-image :src="problemReportingCancel" />
            </el-col>
            <el-col :span="5" class="click" @click="handleOkClick">
              <el-image :src="problemReportingOK" />
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
/************************************************资源*********************************************/

import problemReportingText from '@/assets/produceterminal/images/problemReportingText.png'
import problemReportingHistoryText from '@/assets/produceterminal/images/problemReportingHistoryText.png'
//文本图片
import problemReportingOK from '@/assets/produceterminal/images/problemReportingOK.png'
import problemReportingCancel from '@/assets/produceterminal/images/problemReportingCancel.png'
//按钮图片

import { getIntDictOptions } from '@/utils/dict'
import { ProblemReportApi } from '@/api/mcs/problemreport'
import { TerminalApi } from '@/api/mcs/terminal'
//引入

const stationData: any = inject('stationData') //工位数据
const problemReporList = ref<any[]>([]) //问题列表
//总体

/***************************************************初始化****************************************/

async function init() {
  resetData()
  problemReporList.value = await ProblemReportApi.getProblemReportList(stationData.value.id)
  problemReporList.value = await Promise.all(
    problemReporList.value.map(async (v) => {
      return {
        ...v,
        entity: await codeToEntity(v.type, v.reportId)
      }
    })
  )
}

onMounted(async () => {
  await init()
})

/*************************************************编号选择*****************************************/

const selectList = ref<any>([]) //实体选择列表
const selectEnabled = ref(true) //实体是否可选择

const taskShow = ref(false) //是否显示任务
const taskSelect = ref('')
const taskSelectList = ref<any[]>([]) //任务列表

//重置选择数据
function selectReset() {
  formData.value.reportId = undefined

  selectList.value = []
  selectEnabled.value = true

  taskShow.value = false
  taskSelect.value = ''
  taskSelectList.value = []
}

//选择类型
async function handleTypeSelectChange(value) {
  selectReset()
  switch (value) {
    case 0: //设备
      {
        selectList.value = [
          {
            value: stationData.value.id,
            label: stationData.value.code
          }
        ]
        selectEnabled.value = false
        formData.value.reportId = stationData.value.id
      }
      break
    case 1: //任务
      {
        let data = await TerminalApi.getBatchPlanByWorkstation(stationData.value.id)
        selectList.value = data.map((v) => {
          return {
            value: v.id,
            label: v.number
          }
        })
      }
      break
    case 2: //工艺
      {
        let data = await TerminalApi.getBatchPlanByWorkstation(stationData.value.id)
        taskSelectList.value = data.map((v) => {
          return {
            value: v.id,
            label: v.number
          }
        })
        taskShow.value = true
      }
      break
    case 3: //物料
      {
        let data = await TerminalApi.getBatchPlanByWorkstation(stationData.value.id)
        taskSelectList.value = data.map((v) => {
          return {
            value: v.id,
            label: v.number
          }
        })
        taskShow.value = true
      }
      break
  }
}

//任务选择改变
async function handleTaskSelectChange(id) {
  formData.value.reportId = undefined
  selectList.value = []

  if (formData.value.type == 2) {
    //工艺
    selectEnabled.value = false
    let data = await TerminalApi.getProcessByRecordId(id)
    selectList.value = [
      {
        value: data.id,
        label: data.procedureName
      }
    ]
    formData.value.reportId = data.id
  } else if (formData.value.type == 3) {
    //物料
    let data = await TerminalApi.getBatchDetailByRecordId(id)
    selectList.value = data.map((v) => {
      return {
        value: v.id,
        label: v.partBatchNumber
      }
    })
  }
}

/*************************************表单数据*****************************/

const formData = ref<any>({
  id: undefined,
  stationId: stationData.value.id,
  type: undefined,
  reportId: undefined,
  status: 0,
  content: undefined
})
//表单数据
const contentTable = ref<any[]>([]) //内容列表
const contentObj = ref({ type: 0, value: '' }) //输入内容结构

//重置数据
function resetData() {
  formData.value = {
    id: undefined,
    stationId: stationData.value.id,
    type: undefined,
    reportId: undefined,
    status: 0,
    content: undefined
  }
  contentObj.value = { type: 0, value: '' }
  contentTable.value = []
  nowStatus.value = 0
  selectReset()
  entityShow.value = ''
}

//获得最后一条内容数据
function getLastContent(v) {
  let data: any[] = JSON.parse(v)
  return data[data.length - 1]
}

/***************************************选择逻辑****************************/

const nowStatus = ref(0) //目前状态，0：新增，1：查看

const entityShow = ref('') //显示显示的实体文字

//点击列表中一项
async function handleClickOne(id) {
  nowStatus.value = 1

  formData.value = await ProblemReportApi.getProblemReport(id)
  contentTable.value = JSON.parse(formData.value.content as any)

  entityShow.value = await codeToEntity(formData.value.type, formData.value.reportId)
}

import { LedgerApi } from '@/api/dms/ledger' //设备
import { BatchRecordApi } from '@/api/mcs/batchRecord' //任务
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail' //工序
import { BatchDetailApi } from '@/api/mcs/batchdetail' //物料

//将报编号转为文字
async function codeToEntity(type, id) {
  switch (type) {
    case 0: //设备
      {
        let data = await LedgerApi.getLedger(id)
        return data.code
      }
      break
    case 1: //任务
      {
        let data = await BatchRecordApi.getBatchRecord(id)
        return data.number
      }
      break
    case 2: //工艺
      {
        let data = await ProcessPlanDetailApi.getProcedure(id)
        return data.procedureName
      }
      break
    case 3: //物料
      {
        let data = await BatchDetailApi.getBatchDetail(id)
        return data.partBatchNumber
      }
      break
  }
}

/****************************************提交逻辑***************************/

const formRef = ref() //表单ref
const rules = ref({
  type: [{ required: true, message: '请选择问题类型', trigger: 'blur' }],
  content: [{ required: true, message: '请输入问题描述', trigger: 'blur' }]
})
//表单规则

//点击取消按钮
function handleCancelClick() {
  resetData()
}

//点击确定按钮
async function handleOkClick() {
  if (nowStatus.value == 0) {
    //新增模式
    formData.value.content = JSON.stringify([contentObj.value]) as any
    await formRef.value.validate()
    await ProblemReportApi.createProblemReport(formData.value as any)
  } else {
    //查看模式
    nowStatus.value = 0
    contentTable.value.push(contentObj.value)
    formData.value.content = JSON.stringify(contentTable.value) as any
    formData.value.status = 4 //状态：新问题
    await formRef.value.validate()
    await ProblemReportApi.updateProblemReport(formData.value as any)
  }
  handleCancelClick()
  await init()
}

/*************************************工具函数*********************************/

//格式化时间
function formatDate(date) {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

//判断是否为空
function isBlank(v: any): boolean {
  if (v == undefined || v == null) {
    return true
  }
  if (typeof v?.trim == 'function' && v.trim() == '') {
    return true
  }
  return false
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/problemReporting.scss');
</style>

<style lang="scss">
.problem-reporting-select {
  width: 10vw;
}

.problem-reporting-select .el-select__wrapper {
  border: none !important;
  box-shadow: none !important;
  background-color: transparent;
  padding: 0px;

  .el-select__suffix {
    display: none;
  }
  .el-select__selection .el-select__input-wrapper {
    display: none;
  }

  .el-select__selection .el-select__placeholder {
    color: white;
    font-size: 2vh;
  }
}

.problem-reporting-select-div {
  border: 1px solid rgb(37, 217, 253) !important;
  --el-bg-color-overlay: black;
  --el-fill-color-light: #18262c;
  --el-text-color-regular: white;
  --el-color-primary: white;

  .el-scrollbar {
    .el-scrollbar__view {
      padding: 0px;
      text-align: center;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

.problem-reporting-select-item {
  border: 0.001vh solid rgb(37, 217, 253);
}
</style>
