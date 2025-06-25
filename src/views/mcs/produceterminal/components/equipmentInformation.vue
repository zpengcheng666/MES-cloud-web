<template>
  <el-container class="root">
    <el-main class="left">
      <el-container class="left-body">
        <el-header class="device" height="50%">
          <el-space direction="vertical" class="space">
            <div class="title-fount">设备信息</div>
            <table>
              <tr>
                <td>
                  <span class="title">设备编号：</span>
                  <span class="details">{{ props.deviceData.code }}</span>
                </td>
                <td>
                  <span class="title">设备名称：</span>
                  <span class="details">{{ props.deviceData.name }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">设备状态：</span>
                  <span class="details">
                    {{
                      getIntDictOptions('dms_device_status').find(
                        (v) => v.value == props.deviceData.status
                      )?.label
                    }}
                  </span>
                </td>
                <td>
                  <span class="title">运行状态：</span>
                  <span class="details">
                    {{
                      getIntDictOptions('dms_device_status_run').find(
                        (v) => v.value == props.deviceData.runStatus
                      )?.label
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="title">在线状态：</span>
                  <span class="details">
                    {{
                      getIntDictOptions('dms_device_status_online').find(
                        (v) => v.value == props.deviceData.onlineStatus
                      )?.label
                    }}
                  </span>
                </td>
                <td>
                  <span class="title">设备IP：</span>
                  <span class="details">{{ props.deviceData.ip }}</span>
                </td>
              </tr>
            </table>
          </el-space>
        </el-header>
        <el-main class="warning">
          <el-space direction="vertical" class="space">
            <div class="title-fount">报警信息</div>
            <el-table
              :data="failureRecordData"
              style="width: 40vw"
              max-height="24vh"
              class="warningTable"
              :header-cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
              :cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
            >
              <el-table-column prop="code" label="报警编号" align="center" />
              <el-table-column prop="description" label="报警描述" align="center" />
              <el-table-column prop="faultState" label="故障状态" align="center">
                <template #default="scope">
                  {{
                    getIntDictOptions('dms_fault_state').find(
                      (v) => v.value == scope.row.faultState
                    )?.label
                  }}
                </template>
              </el-table-column>
            </el-table>
          </el-space>
        </el-main>
      </el-container>
    </el-main>
    <el-aside width="50%" class="individually">
      <el-space direction="vertical" class="space" :size="40">
        <div class="title-fount">设备点检信息</div>
        <el-table
          :data="individuallyTableData"
          style="width: 40vw"
          max-height="50vh"
          class="individuallyTable"
          :header-cell-style="{ borderBottom: '0.3vh solid rgba(37,249,254,1)' }"
          :cell-style="{ border: '0.2vh solid rgba(37,249,254,1)' }"
          @row-click="handleRowClick"
        >
          <el-table-column prop="project" label="检测项目" align="center" />
          <el-table-column prop="standard" label="检测标准" align="center" />
          <el-table-column prop="value" label="检测结果" align="center" width="120">
            <template #default="scope">
              {{ scope.row.value == true ? '✔' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="time" label="检测时间" align="center">
            <template #default="scope">
              <div style="font-size: 0.7em">{{ scope.row.time }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="记录人" align="center" width="100" />
        </el-table>
      </el-space>
      <div class="button">
        <el-image
          :src="problemReportingOK"
          class="image click"
          @click="handleImageClick"
          v-if="inspectionRecordEmpty == false"
        />
      </div>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
//文本图片
import problemReportingOK from '@/assets/produceterminal/images/problemReportingOK.png'

import { getIntDictOptions } from '@/utils/dict'
const props = defineProps(['stationData', 'userData', 'deviceData'])

/***********************初始化**************/

onMounted(async () => {
  await initFailureRecordData()
  await initIndividuallyTableData()
})

/*********************报警信息*******************/
import { FailureRecordApi } from '@/api/dms/failurerecord'
const failureRecordData = ref<any[]>([])
async function initFailureRecordData() {
  failureRecordData.value = await FailureRecordApi.getFailureRecordList(props.deviceData?.id)
}

/*******************点检信息******************/
import { InspectionRecordApi } from '@/api/dms/inspectionrecord'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const inspectionRecordEmpty = ref(true) //点检数据为空

const inspectionRecord = ref<any>(undefined) //点检数据
const individuallyTableData = ref<any[]>([]) //表格实时数据

async function initIndividuallyTableData() {
  let searchData = await InspectionRecordApi.getInspectionRecordPage({
    pageNo: 1,
    pageSize: 10,
    roles: userStore.roles,
    status: 0,
    device: props.deviceData?.id,
    type: 1
  })

  if (searchData.list.length > 0) {
    inspectionRecord.value = searchData.list[0]
    inspectionRecordEmpty.value = false
  } else {
    inspectionRecordEmpty.value = true
    searchData = await InspectionRecordApi.getInspectionRecordPage({
      pageNo: 1,
      pageSize: 10,
      roles: userStore.roles,
      status: 1,
      device: props.deviceData?.id,
      type: 1
    })

    if (searchData.list.length > 0) {
      inspectionRecord.value = searchData.list[0]
    } else {
      inspectionRecord.value = undefined
    }
  }

  flushData()
}

function flushData() {
  if (inspectionRecord.value == undefined) {
    individuallyTableData.value = []
    return
  }

  individuallyTableData.value = JSON.parse(inspectionRecord.value.content)
  individuallyTableData.value = individuallyTableData.value.map((v) => {
    return {
      value: v.value == undefined ? null : v.value,
      time: v.time == undefined ? null : v.time,
      user: v.user == undefined ? null : v.user,
      ...v
    }
  })
  inspectionRecord.value.content = JSON.stringify(individuallyTableData.value)
}

async function handleRowClick(row, column) {
  if (inspectionRecordEmpty.value == true) return

  if (column.property == 'value') {
    if (row.value == true) {
      row.value = false
      row.time = null
      row.user = null
    } else {
      row.value = true
      row.time = formatDate(new Date())
      row.user = props.userData.nickname
    }
    inspectionRecord.value.content = JSON.stringify(individuallyTableData.value)

    inspectionRecord.value.startTime =
      inspectionRecord.value.startTime == undefined
        ? new Date().getTime()
        : inspectionRecord.value.startTime
    inspectionRecord.value.endTime = new Date().getTime()

    await InspectionRecordApi.updateInspectionRecord(inspectionRecord.value)
  }
}

async function handleImageClick() {
  if (inspectionRecordEmpty.value == true) return

  inspectionRecord.value.content = JSON.stringify(individuallyTableData.value)

  inspectionRecord.value.startTime =
    inspectionRecord.value.startTime == undefined
      ? new Date().getTime()
      : inspectionRecord.value.startTime
  inspectionRecord.value.endTime = new Date().getTime()

  await InspectionRecordApi.addInspectionRecord(inspectionRecord.value)
  await initIndividuallyTableData()
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/equipmentInformation.scss');
</style>
