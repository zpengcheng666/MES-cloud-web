<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-table :data="processDataList" @current-change="handleCurrentChange">
      <el-table-column align="center" width="50">
        <template #default="scope">
          <el-radio v-model="radio" :label="scope.row.id">
            <span></span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工艺规程编号" prop="processCode" min-width="120px" />
      <el-table-column align="center" label="工艺规程名称" prop="processName" min-width="120px" />
      <el-table-column align="center" label="加工方案码" prop="processSchemeCode" min-width="100px" />
      <el-table-column align="center" label="版次" prop="processVersion" />
      <el-table-column align="center" label="加工状态" prop="processCondition" />
      <el-table-column :width="120" align="center" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleProcessDetail(scope.row.id)">查看</el-button>
<!--          <el-button link type="primary" @click="processUp(scope.row.id,scope.row.processId)">升版</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" @click="saveSelectedProcess()" :disabled="radio === ''">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <!-- 表单弹窗：工艺规程升版关联更改单 -->
  <ProcessUpForm ref="formRefProcessUp" @success="getBack" />
</template>
<script setup lang="ts">
import { ProcessPlanApi, ProcessPlanVO } from "@/api/pdm/processPlan";
import ProcessUpForm from "./ProcessUpForm.vue"

defineOptions({ name: 'FeasibilityDeviceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter() // 路由

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const processDataList = ref([]) // 工艺规程列表
const radio = ref<number>('')
const currentRow = ref()

const selectedProcessParams = reactive({
  partVersionId: '',
  projectCode: '',
  processTaskId: '',
  processVersionId: '',
  status: '2',
  processId: '',
  processChangeId: '',
  processCondition: '',
})

/** 打开弹窗 */
const open = async (partVersionId: string, projectCode: string, processTaskId: string, processCondition: string) => {
  dialogVisible.value = true
  dialogTitle.value = '选择已定版工艺规程'
  selectedProcessParams.partVersionId = partVersionId
  selectedProcessParams.projectCode = projectCode
  selectedProcessParams.processTaskId = processTaskId
  selectedProcessParams.processCondition = processCondition
  radio.value = ''
  await getProcessData()
}

/** 搜索按钮操作 */
const getProcessData = async () => {
  processDataList.value = await ProcessPlanApi.getProcessListByPartVersionId(selectedProcessParams.partVersionId, selectedProcessParams.processCondition)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const selectionList = ref<ProcessPlanVO[]>([])

/** 单选选中操作 */
const handleCurrentChange = (row) => {
  currentRow.value = row
  radio.value = row?.id
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 确定按钮操作 */
const saveSelectedProcess = async () => {
  try {
    selectedProcessParams.processVersionId = radio.value;
    await ProcessPlanApi.saveSelectedProcess(selectedProcessParams)
    // 更新工艺方案任务状态
    await ProcessPlanApi.updateFeasibilityTaskStatus(selectedProcessParams)
    dialogVisible.value = false
    message.success('选择成功')
    // 发送操作成功的事件
    emit('success')
  } catch { }
}
/** 查看工艺规程详细信息 */
const handleProcessDetail = async (id: number) => {
  push({
    name: 'PDMProcessDetail',
    query: {
      id: id
    }
  })
}
const formRefProcessUp = ref()
/** 工艺规程升版 */
const processUp = async (id: number, processId: number) => {
  selectedProcessParams.processVersionId = id
  selectedProcessParams.processId = processId
  formRefProcessUp.value.open(selectedProcessParams.projectCode, selectedProcessParams.processVersionId)
}
/** 工艺规程升版关联更改单回调 */
const getBack = async (processChangeId) => {
  selectedProcessParams.processChangeId = processChangeId
  await ProcessPlanApi.saveProcessUp(selectedProcessParams)
  // 更新工艺方案任务状态
  await ProcessPlanApi.updateFeasibilityTaskStatus(selectedProcessParams)
  dialogVisible.value = false
  message.success('升版成功')
  // 发送操作成功的事件
  emit('success')
}
</script>
