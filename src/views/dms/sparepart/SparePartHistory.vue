<template>
  <Dialog title="使用记录" v-model="dialogVisible" width="70%">
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="number" label="数量" align="center" />
      <el-table-column label="计划编码" align="center">
        <template #default="scope">
          {{ scope.row.record?.code }}
        </template>
      </el-table-column>
      <el-table-column label="完成状态" align="center">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DMS_MAINTENANCE_STATUS" :value="scope.row.record?.status" />
        </template>
      </el-table-column>
      <el-table-column label="保养类型" align="center">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DMS_MAINTENANCE_TYPE" :value="scope.row.record?.type" />
        </template>
      </el-table-column>
      <el-table-column label="开始维护时间" align="center">
        <template #default="scope">
          {{ formatDate(new Date(scope.row.record?.startTime)) }}
        </template>
      </el-table-column>
      <el-table-column label="结束维护时间" align="center">
        <template #default="scope">
          {{ formatDate(new Date(scope.row.record?.endTime)) }}
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { MaintenanceRecordApi } from '@/api/dms/maintenancerecord'
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'

const list: any = ref()

const dialogVisible = ref(false) // 弹窗的是否展示

/** 打开弹窗 */
const open = async (id: number) => {
  let h = await MaintenanceRecordApi.getSparePartByPartId(id)
  h = await Promise.all(
    h.map(async (v) => {
      const r = await MaintenanceRecordApi.getMaintenanceRecord(v.recordId)
      return { ...v, record: r }
    })
  )

  console.log(h)
  list.value = h
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
