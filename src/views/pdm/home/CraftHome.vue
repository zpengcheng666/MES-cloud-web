<template>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px" v-hasPermi="['pdm:feasibilityTask:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.feasibilityTask') }}</span>
          <el-link type="primary" :underline="false" @click="handleFeasibilityTaskNew ()">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-table ref="multipleTable" :data="partDataList" style="cursor: pointer;height:300px;overflow-y: auto">
        <el-table-column align="center" label="项目号" prop="projectCode" width="150px"/>
        <el-table-column align="center" label="零件图号" prop="partNumber" width="150px"/>
        <el-table-column align="center" label="零件名称" prop="partName" />
        <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
      </el-table>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px" v-hasPermi="['pdm:processTask:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.processTask') }}</span>
          <el-link type="primary" :underline="false" @click="handleProcessTaskNew ()">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-table ref="multipleTable" :data="taskList" style="cursor: pointer;height:300px;overflow-y: auto" >
        <el-table-column align="center" label="项目号" prop="projectCode" width="150px"/>
        <el-table-column align="center" label="零件图号" prop="partNumber" width="150px"/>
        <el-table-column align="center" label="零件名称" prop="partName" />
        <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
        <el-table-column :formatter="dateFormatter" align="center" label="工艺准备完成时间" prop="processPreparationTime"  width="140px" />
      </el-table>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px" v-hasPermi="['pdm:feasibilityDetail:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.feasibilityList') }}</span>
          <el-link type="primary" :underline="false" @click="handleFeasibilityDetailNew1()">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-table :data="feasibilityList" style="cursor: pointer;height:300px;overflow-y: auto" @row-click="handleRowClick">
        <el-table-column align="center" label="项目号" prop="projectCode" width="150px"/>
        <el-table-column align="center" label="零件图号" prop="partNumber" width="150px"/>
        <el-table-column align="center" label="零件名称" prop="partName" />
        <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
        <el-table-column align="center" label="评估截止日期" prop="deadline" width="110px" :formatter="dateFormatter2" />
        <el-table-column align="center" label="操作" width="100px">
          <template #default="scope">
            <el-button link type="primary" @click="handleButtonFeasibilityDetailNew(scope.row)">去评估</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-col>
  <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24"  class="mb-8px" v-hasPermi="['pdm:processPlan:query']">
    <el-card shadow="never" style="height: 400px">
      <template #header>
        <div class="h-3 flex justify-between">
          <span>{{ t('workplace.processPlanNew') }}</span>
          <el-link type="primary" :underline="false" @click="handleProcessPlanNew1()">{{ t('action.more') }}</el-link>
        </div>
      </template>
      <el-table :data="detailData" style="cursor: pointer;height:300px;overflow-y: auto" @row-click="handleRowClick">
        <el-table-column align="center" label="项目号" prop="projectCode" width="150px"/>
        <el-table-column align="center" label="零件图号" prop="partNumber" width="150px"/>
        <el-table-column align="center" label="零件名称" prop="partName" />
        <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
        <el-table-column align="center" label="编制截止日期" prop="deadline" width="110px" :formatter="dateFormatter2" />
        <el-table-column align="center" label="操作" width="100px">
          <template #default="scope">
            <el-button link type="primary" @click="handleButtonProcessPlanNew(scope.row)">去编制</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-col>
</template>
<script lang="ts" setup>
import {reactive} from 'vue'
import { useUserStore } from '@/store/modules/user'
import {ref} from "vue";
import {dateFormatter, dateFormatter2} from "@/utils/formatTime";
import {ProcessPlanApi} from "@/api/pdm/processPlan";
import {FeasibilityTaskApi} from "@/api/pdm/feasibilityTask";
import {ProcessTaskApi} from "@/api/pdm/processTask";
import {FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";

const { push } = useRouter()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
defineOptions({ name: 'CraftHomeForm' })
const message = useMessage() // 消息弹窗
const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname
const showResult = ref(false) // 评估结果显隐
const feasibilityList = ref<any[]>([]) // 评估列表
const detailData = ref<any[]>([]) // 工艺方案编制
const partDataList = ref<any[]>([]) // 评估任务列表
const taskList = ref<any[]>([]) // 工艺任务列表

const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = t("工艺模块")
}
defineExpose({ open })

const queryParams = reactive({
  projectCode: '',
  partNumber: '',
  status: 0,
  projectStatus: 0,
  id:'',
  taskId: '',
  taskIds:'',
  partVersionId: '',
})
const queryParams1 = reactive({
  reviewedBy:undefined,
  reviewer: undefined,
  projectCode: '',
  partNumber: '',
  status: 1,
  viewSelf: true,
  projectStatus: 0,
  id:'',
  taskId: '',
  taskIds:'',
  partVersionId: '',
})
const getPartData = async () => {
  partDataList.value = await FeasibilityTaskApi.getPartListByProjectCode(queryParams)
  taskList.value = await ProcessTaskApi.getPartListByProjectCode(queryParams)
  feasibilityList.value = await FeasibilityDetailApi.getPartListByProjectCode(queryParams1)
  detailData.value = await ProcessPlanApi.getPartDetailNewHome(queryParams1)

}
const handleButtonFeasibilityDetailNew = (row: any) => {
  handleFeasibilityDetailNew(row);
}
const handleButtonProcessPlanNew = (row: any) => {
  handleProcessPlanNew(row);
}
const handleRowClick = (row: any) => {
  console.log('行数据:', row);
}
const handleFeasibilityTaskNew = async () => {
  push({
    name: 'PDMFeasibilityTaskNew',
  })
}
const handleProcessTaskNew = async () => {
  push({
    name: 'PDMProcessTaskNew',
  })
}
const handleFeasibilityDetailNew = async (row) => {
  push({
    name: 'PDMFeasibilityDetailList',
    query: {
      id: row.taskId
    }
  })
}
const handleFeasibilityDetailNew1 = async (row) => {
  push({
    name: 'PDMFeasibilityDetailList',
  })
}
const handleProcessPlanNew = async (row) => {
  push({
    name: 'PDMProcessPlanNew1',
    query: {
      id: row.id
    }
  })
}
const handleProcessPlanNew1 = async (row) => {
  push({
    name: 'PDMProcessPlanNew1',
  })
}
const dateFormatter = (row: any, column: any, cellValue: any) => {
  if (cellValue) {
    const date = new Date(cellValue);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  return '';
};

const getAllApi = async () => {
  await Promise.all([
    getPartData()
  ])
  loading.value = false
}

getAllApi()
</script>
