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
         <!-- <el-table-column label="成品刀具id" align="center" prop="toolInfoId" /> -->
        <el-table-column label="工单号" width="150"  align="center" prop="orderNumber" />
        <el-table-column label="目标位置" width="150" align="center" prop="targetLocationCode" />
        <el-table-column label="配送截止时间" width="150" align="center" prop="distributionDeadline" />
        <el-table-column label="物料编码" width="150" align="center" prop="materialNumber" />
        <el-table-column label="加工时长" align="center" prop="minimumTime" />
        <el-table-column label="Rfid" width="150" align="center" prop="barCode" />
        <el-table-column label="所在托盘" width="150" align="center" prop="storageCode" />
        <el-table-column label="所在库位" width="150" align="center" prop="rootLocationCode" />
        <el-table-column label="刀具直径" align="center" prop="diameter" />
        <el-table-column label="刀具总长" align="center" prop="totalLength" />
        <el-table-column label="刀具r角" align="center" prop="rangle" />
        <el-table-column label="额定寿命" align="center" prop="ratedLife" />
        <el-table-column label="剩余寿命" align="center" prop="remainLife" />
        <el-table-column label="状态" width="90" align="center" prop="status" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.ASSEMBLE_STATUS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" v-if="assembleAction" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="handleAssemble(scope.row.id)"
              v-hasPermi="['tms:assemble-task:update']"
              v-if="scope.row.status===1"
            >
              配刀
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { AssembleTaskApi } from '@/api/tms/assembletask'

  
const loading = ref(true) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    creator: undefined
  })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  assembleTaskId: undefined, // 刀具装配任务id（主表的关联字段）
  assembleAction: false // 是否显示配刀操作
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.id = props.assembleTaskId
    const data = await AssembleTaskApi.getAssembleRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['openAssembleToolAction']) 
/** 配刀按钮操作 */
const handleAssemble = async (id: string) => {
  // 打开配刀工具弹窗
  emit('openAssembleToolAction', id)
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
