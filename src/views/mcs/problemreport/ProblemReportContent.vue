<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="type" label="类型">
      <template #default="scope">
        {{ scope.row.type == 0 ? '问题' : '回复' }}
      </template>
    </el-table-column>
    <el-table-column prop="value" label="内容" />
  </el-table>
  <el-input v-model="reportData" type="textarea" placeholder="请输入回复" />
  <el-button class="button" @click="addReport" type="primary">添加回复</el-button>
</template>
<script setup lang="ts">
defineOptions({ name: 'ProblemReportContent' })
const model = defineModel()

const tableData = ref<any[]>([])
const reportData = ref('')

const emit = defineEmits(['addReport'])

function flush(c) {
  tableData.value = JSON.parse(c as string)
}
defineExpose({ flush }) // 提供 open 方法，用于打开弹窗

function addReport() {
  tableData.value.push({ typt: 1, value: reportData.value })
  reportData.value = ''
  model.value = JSON.stringify(tableData.value)
  emit('addReport')
}
</script>

<style lang="scss" scoped>
.button {
  margin-top: 8px;
}
</style>
