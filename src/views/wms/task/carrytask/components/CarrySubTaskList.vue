<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="执行顺序" align="center" prop="executeOrder" />

      <el-table-column label="指令类型" align="center" prop="insType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_TASK_INS" :value="scope.row.insType" />
        </template>
      </el-table-column>
      <el-table-column label="任务状态" align="center" prop="taskStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_CARRY_SUB_TASK_STATUS" :value="scope.row.taskStatus" />
        </template>
      </el-table-column>
      <el-table-column label="物料条码" align="center" width="180"  prop="barCode" />
      <el-table-column label="库位编码" align="center" width="180" prop="locationCode" />
      <!-- <el-table-column label="任务内容" align="center" prop="taskContent" /> -->
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="任务描述" align="center" prop="taskDescription" />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="success"
            @click="endCarryTask(scope.row.id)"
            v-hasPermi="['wms:carry-task:update']"
          >
            完成反馈
          </el-button>
        </template>
      </el-table-column>
     </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import { CarryTaskApi } from '@/api/wms/carrytask'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  parentId: undefined // 搬运任务id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await CarryTaskApi.getCarrySubTaskListByParentId(props.parentId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
const reload = inject<() => void>('reload')
const endCarryTask = async (id: number) => {
  let data = await CarryTaskApi.endCarryTask(id)
  if (reload) reload()
  if (data) {
    message.success('执行反馈成功')
  }else {
    message.error('执行反馈失败')
  }
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
