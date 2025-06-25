<template>
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      row-key="id"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column label="编号" align="center" prop="number" />
      <el-table-column label="工序序号" align="center" prop="procedureNum" width="80"/>
      <el-table-column label="生产单元" align="center" prop="unitName" >
        <template #default="scope">
          <span v-text="scope.row.procesStatus === 2 ? scope.row.aidMill : scope.row.unitName"></span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center" prop="deviceNumber" />
      <el-table-column label="计划开始时间" align="center" prop="planStartTime" :formatter="dateFormatter" width="170"/>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" :formatter="dateFormatter" width="170"/>
      <el-table-column label="操作" align="center" fixed="right" width="90">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {inject, onMounted, ref} from 'vue';
import { BatchRecordApi } from '@/api/mcs/batchRecord'
import { dateFormatter } from '@/utils/formatTime'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const sharedInfo = inject("sharedInfo");

const props = defineProps<{
  batchId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchRecordApi.getBatchRecordList(props.batchId)
  } finally {
    loading.value = false
  }
}
sharedInfo.processOrderReload = getList;

/** 添加/修改操作 */
const openForm = (row: any) => {
  sharedInfo.processOrderEditOpen(row);
}

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
  }
  else expandKey.value = [];
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>

</style>
