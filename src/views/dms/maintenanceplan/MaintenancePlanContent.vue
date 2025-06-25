<template>
  <el-table :data="data" border height="75vh">
    <el-table-column prop="name" label="维护内容">
      <template #header>
        <el-input type="textarea" :rows="5" v-model="addData" placeholder="输入新增维护内容" />
      </template>
    </el-table-column>
    <el-table-column width="100px">
      <template #header>
        <el-button @click="funAdd" type="success">新增</el-button>
      </template>
      <template #default="scope">
        <el-button @click="funDelete(scope.$index)" type="danger">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
const model = defineModel()

let isOK = 0
watch(
  () => model.value,
  () => {
    if (model.value && isOK == 0) {
      try {
        data.value = JSON.parse(model.value as string)
        isOK = 1
      } catch (e) {}
    }
  }
)

const data = ref<any[]>([])

let addData = ref('')
function funAdd() {
  if (addData.value.trim() == '') return
  for (const v of data.value) {
    if (addData.value == v.name) return
  }

  data.value.push({ name: addData.value })
  addData.value = ''
  model.value = JSON.stringify(data.value)
}

function funDelete(index) {
  data.value.splice(index, 1)
  model.value = JSON.stringify(data.value)
}
</script>
