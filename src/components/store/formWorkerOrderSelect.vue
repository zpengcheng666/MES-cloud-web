<!--
 * @Author: hyj
 * @Description: 工单号
 * @Date: 2024-06-27 09:27:42
 * @LastEditTime: 2024-07-15 16:29:38
 * @FilePath: /cimp-tms-web/src/components/store/formWorkerOrderSelect.vue
-->
<template>
  <el-select v-model="planeNumber" placeholder="请选择工单号" filterable @change="handleChange">
    <el-option
      v-for="option in options"
      :label="option.workOrderCode"
      :value="option.workOrderCode"
      :key="option.workOrderCode"
    />
  </el-select>
</template>

<script setup lang="ts">
import { getParingPlanList } from '@/api/knifetool/store/storeRegister'

const loading = ref(true) // 列表的加载中
const options = ref()

const planeNumber = ref()
const setValueUndefined = () => {
  planeNumber.value = undefined
}
defineExpose({ setValueUndefined })

const getList = async () => {
  loading.value = true
  try {
    const data = await getParingPlanList({})
    options.value = data
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['handleSelect']) // 定义 success 事件，用于操作成功后的回调
const handleChange = (val: number) => {
  emit('handleSelect', val)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
