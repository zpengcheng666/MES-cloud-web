<!--
 * @Author: hyj
 * @Description: 仓库选择
 * @Date: 2024-06-27 09:27:42
 * @LastEditTime: 2024-07-03 10:23:40
 * @FilePath: /cimp-tms-web/src/components/store/formStoreSelect.vue
-->
<template>
  <el-select v-model="storeMenutreeId" placeholder="请选择仓库" filterable @change="handleChange">
    <el-option v-for="option in options" :label="option.name" :value="option.id" :key="option.id" />
  </el-select>
</template>

<script setup lang="ts">
import { getStoreMenuTreeName } from '@/api/knifetool/storeCheck/plan/index'

const loading = ref(true) // 列表的加载中
const options = ref()

const props = defineProps({ value: [String, Number] })

const storeMenutreeId = ref()
const setValueUndefined = () => {
  storeMenutreeId.value = undefined
}
defineExpose({ setValueUndefined })

const getList = async () => {
  loading.value = true
  try {
    const data = await getStoreMenuTreeName({ userId: 0 })
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
  storeMenutreeId.value = props.value
  getList()
})
</script>

<style scoped></style>
