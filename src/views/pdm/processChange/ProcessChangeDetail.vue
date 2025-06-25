<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" row-key="id" :show-overflow-tooltip="true" :expand-row-keys="expandKey"
              @expand-change="expandChange">
      <el-table-column label="更改标记" align="center" prop="changeTag" />
      <el-table-column label="更改工序号" align="center" prop="changeProcedureNum" />
      <el-table-column label="更改工步号" align="center" prop="changeStepNum" />
      <el-table-column label="更改内容" align="center" prop="changeContent" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="danger" @click="handleDelete(scope.row.id)" v-show="showDeleteBtn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  processChangeId: undefined, // 访客申请id（主表的关联字段）
  status: undefined,
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const expandKey = ref([]);
const showDeleteBtn = ref(false) // 是否显示子表单删除

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await ProcessPlanDetailApi.getChangeDetail(props.processChangeId)
  } finally {
    loading.value = false
  }
  if(props.status === 0 || props.status === 2) {
    showDeleteBtn.value = true;
  } else {
    showDeleteBtn.value = false;
  }
}

const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
    selectOrderInfo.batchNumber = row.batchNumber
    selectOrderInfo.batchStatus = row.status
  }
  else expandKey.value = [];
}

const handleDelete = async (id: number) => {
  try {
    //删除的二次确认
    await message.delConfirm()
    await ProcessPlanDetailApi.deleteOrderDetailById(id)
    message.success(t('common.delSuccess'))
    // 刷新树
    await getList()
  } catch { }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
