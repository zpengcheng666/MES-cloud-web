<template>
  <ContentWrap>
    <el-table v-loading="loading" ref="batchTable" :data="list" @row-click="rowClick" class="-mt-10px" max-height="265">
      <el-table-column type="selection" />
      <el-table-column label="任务编号" align="center" prop="number" />
      <el-table-column label="零件图号" align="center" prop="partNumber" />
      <el-table-column label="数量" align="center" prop="count" width="70" />
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" width="180px"/>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { DistributionApplicationApi } from '@/api/mcs/distributionapplication'
import { ref, onMounted, reactive, watch } from "vue";
import { getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'

const loading = ref(true) // 列表的加载中

const props = defineProps<{
  deviceUnitId: undefined // 申请id（主表的关联字段）
}>()

const queryParams = reactive({
  orderId: undefined,
  deviceUnitId: undefined,
})

const list = ref([]);


/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

const queryFormRef = ref() // 搜索的表单
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  if (!queryParams.deviceUnitId) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    list.value = await DistributionApplicationApi.getBatchRecordByUnitForDelivery(queryParams);
  } finally {
    loading.value = false
  }
}

watch(
  () => props.deviceUnitId,
  async (val) => {
    queryParams.deviceUnitId = val;
    await getList();
  },
  { immediate: true }
)

const batchTable = ref()

const rowClick = (row: any) => {
  batchTable.value.toggleRowSelection(row)
}

const getData = () => {
  return batchTable.value.getSelectionRows()
}
defineExpose({ getData })

/** 初始化 **/
onMounted(() => {
  getList();
})

</script>
