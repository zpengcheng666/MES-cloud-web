<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-table :data="processChangeList" @current-change="handleCurrentChange">
      <el-table-column align="center" width="50">
        <template #default="scope">
          <el-radio v-model="radio" :label="scope.row.id">
            <span></span>
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="changeCode" label="更改单号" align="center" />
      <el-table-column align="center" label="更改原因"  prop="changeReason">
        <template #default="scope" >
          <dict-tag :type="DICT_TYPE.PDM_PROCESS_CHANGE_REASION " :value="scope.row.changeReason" />
        </template>
      </el-table-column>
      <el-table-column prop="changeContent" label="更改内容" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="workingOpinions" label="在制品处理" align="center" :show-overflow-tooltip="true" />
    </el-table>
    <template #footer>
      <el-button type="primary" @click="saveSelectedProcessChange()" :disabled="radio === ''">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE } from "@/utils/dict";
import {ProcessPlanDetailApi} from "@/api/pdm/processPlanDetail";

defineOptions({ name: 'ProcessUpForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter() // 路由

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const processChangeList = ref([]) // 关联工艺更改单列表
const radio = ref<number>('')
const currentRow = ref()

const selectedProcessParams = reactive({
  projectCode: '',
  processVersionId: '',
  status: '3'
})

/** 打开弹窗 */
const open = async (projectCode: string, processVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '工艺规程升版'
  selectedProcessParams.projectCode = projectCode
  selectedProcessParams.processVersionId = processVersionId
  radio.value = ''
  await getProcessChangeData()
}

/** 搜索按钮操作 */
const getProcessChangeData = async () => {
  processChangeList.value = await ProcessPlanDetailApi.getChangeOrderList(selectedProcessParams);
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 单选选中操作 */
const handleCurrentChange = (row) => {
  currentRow.value = row
  radio.value = row?.id
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 确定按钮操作 */
const saveSelectedProcessChange = async () => {
  dialogVisible.value = false
  // 发送操作成功的事件：升版关联的更改单id回传
  emit('success', radio.value)
}
</script>
