<template>
  <container :gutter="20" class="task-container" fit="contain">
    <el-header class="task-header">
      <el-row type="flex" justify="center">
        <div class="scanText">生产任务</div>
      </el-row>
    </el-header>
    <el-main class="task-main">
      <el-input v-model="input" class="input" clearable placeholder="请输入条码" />
      <el-table
        :data="filterData"
        class="task-table"
        max-height="50vh"
        highlight-current-row
        @row-click="clickRow"
        :header-cell-style="{
          borderBottom: '0.3vh solid rgba(37,249,254,1)',
          background: '#03375F',
          color: '#ffffff'
        }"
        :cell-style="{ borderBottom: '0.3vh solid rgb(37,249,254,1)' }"
        ref="tableRef"
      >
        <el-table-column label="生产单号" align="center" prop="number" width="100" />
        <el-table-column label="数量" align="center" prop="count" />
        <el-table-column>
          <template #default="scope">
            <el-row :gutter="20" align="middle">
              <el-col>
                <el-popover
                  placement="right"
                  trigger="click"
                  title="生产任务信息"
                  :show-arrow="false"
                  popper-class="popover"
                  :visible="scope.row.visible"
                >
                  <template #reference>
                    <div class="expandBtn" @click="open(scope.row)"></div>
                  </template>
                  <div v-click-outside="onClickOutside">
                    <div class="returnBtn" @click="scope.row.visible = false"></div>
                    <el-table
                      :data="detailList"
                      class="task-detail-table"
                      max-height="12vh"
                      :header-cell-style="{
                        borderBottom: '0.3vh solid rgba(37,249,254,1)',
                        background: '#03375F',
                        color: '#ffffff',
                        padding: '2px'
                      }"
                      :cell-style="{
                        borderBottom: '0.3vh solid rgb(37,249,254,1)',
                        padding: '2px'
                      }"
                    >
                      <el-table-column
                        label="零件图号"
                        align="center"
                        prop="code"
                        min-width="150px"
                      />
                      <el-table-column label="工艺规格号" align="center" prop="specs" />
                      <el-table-column label="工序" align="center" prop="processId" />
                      <el-table-column label="关重属性" align="center" prop="attr" />
                      <el-table-column label="加工方案码" align="center" prop="procode" />
                      <el-table-column label="生产状态" align="center" prop="status">
                        <template #default="scope">
                          <dict-tag :type="'mcs_order_detail_status'" :value="scope.row.status" />
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-popover>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </container>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { TerminalApi } from '@/api/mcs/terminal'
import { ClickOutside as vClickOutside } from 'element-plus'
import DictTag from '@/components/DictTag/src/DictTag.vue'

defineOptions({ name: 'TaskRunLeft' })
const props = defineProps(['stationData'])
const emit = defineEmits(['selectTask'])
//公共

/************************************数据逻辑*****************************/

const selectTask = ref() //当前选择的任务
const selectMcsPlanProcess = ref() //当前选择任务对应的工序信息
const mapData: any = inject('mapData') //总体map数据
//公共数据

//点击行选择任务
const clickRow = async (row) => {
  selectTask.value = row
  selectTask.value.resourceList = await TerminalApi.getBatchResourceByRecordId(
    selectTask.value.id,
    props.stationData?.id
  )
  selectMcsPlanProcess.value = await TerminalApi.getProcessByRecordId(row.id)
  emit('selectTask', selectTask.value, selectMcsPlanProcess.value)
}

/************************************界面逻辑*********************************/
const detailList = ref<any[]>([]) //详细数据界面数据
// 打开当前行 关闭其他行
const open = async (row) => {
  detailList.value = [
    {
      code: row.partNumber,
      specs: row.technologyCode,
      processId: row.processNumber,
      attr: selectMcsPlanProcess.value.procedureProperty,
      procode: selectMcsPlanProcess.value.part.processSchemeCode,
      status: row.status
    }
  ]
  row.visible = true
}

//点击外边关闭弹窗
const onClickOutside = () => {
  orderList.value.forEach((obj) => {
    obj.visible = false
  })
}

/***************************************初始化*************************/

const orderList = ref<any[]>([]) //生产任务列表数据
const tableRef = ref()

//刷新数据
async function flushData() {
  orderList.value = await TerminalApi.getBatchPlanByWorkstation(props.stationData.id)

  let select = mapData.value.get('selectTask')
  let now = orderList.value.find((v) => v.id == select?.id)
  if (now == undefined || now == null) {
    tableRef.value?.setCurrentRow()
    mapData.value.set('nowStatus', 0)
  } else {
    tableRef.value?.setCurrentRow(now)
  }
}
defineExpose({ flushData })

//初始化
onMounted(async () => {
  await flushData()
})

/****************************输入*****************************/

const input = ref('')

const filterData = computed(() => {
  return orderList.value.filter((v) => {
    return v.barCodeList.some((v2) => {
      return v2?.includes(input.value)
    })
  })
})
</script>

<style lang="scss">
.popover.el-popover {
  width: 35vw !important;
  height: 15vh !important;
  background: transparent;
  border: transparent;
  background-image: url('@/assets/produceterminal/images/taskDetail.png');
  background-size: 100% 100%;
  position: relative;

  .returnBtn {
    background-image: url('@/assets/produceterminal/images/returnBtn.png');
    background-size: 100% 100%;
    width: 3%;
    height: 9%;
    margin-left: 1vw;
    position: absolute;
    top: 2vh;
  }

  .el-popover__title {
    text-align: center;
    font-size: 0.8vw;
    color: #76f0ee;
    margin-top: 1.5vh;
  }

  .task-detail-table {
    background-color: transparent !important;
    width: 95%;
    left: 2.5%;
    margin-bottom: 2vh;
    --el-table-tr-bg-color: none;
    font-size: 0.55vw;
    --el-table-text-color: white;
    --el-table-header-text-color: white;
    --el-table-border-color: rgba(37, 249, 254, 1);
    --el-table-row-hover-bg-color: rgb(118, 240, 238, 0.4);
    --el-table-current-row-bg-color: rgb(118, 240, 238, 0.4);

    .el-tag {
      background-color: transparent !important;
      border-color: #00cef4 !important;
      color: #87c1c8 !important;
    }
  }

  .task-detail-table :deep(*) {
    background-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskRunLeft.scss');
</style>
