<template>
  <el-table :data="data" border>
    <el-table-column prop="name" label="保养内容" />
    <el-table-column prop="value" label="保养状态">
      <template #default="scope">
        <el-input type="textarea" :rows="5" v-model="scope.row.value" @input="setData" />
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
const model = defineModel()
const props = defineProps(['tableData'])

const data = ref<any[]>([])

defineExpose({ reSet })

watch(
  () => props.tableData,
  () => {
    reSet()
  }
)

function setData() {
  model.value = JSON.stringify(data.value)
}

function reSet() {
  if (props.tableData) {
    try {
      data.value = JSON.parse(props.tableData as string)
      for (let v of data.value) {
        v.value = ''
      }
      model.value = JSON.stringify(data.value)
    } catch (e) {}
  }
}
</script>
