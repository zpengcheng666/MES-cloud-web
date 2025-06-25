<template>
  <el-table :data="data" border height="65vh">
    <el-table-column prop="name" label="保养内容" />
    <el-table-column prop="value" label="保养状态" />
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

const data = ref<object[]>([])
</script>
