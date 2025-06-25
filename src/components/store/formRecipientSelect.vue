<!--
 * @Author: hyj
 * @Description: 用户列表
 * @Date: 2024-06-27 09:27:42
 * @LastEditTime: 2024-07-03 09:57:54
 * @FilePath: /cimp-tms-web/src/components/store/formRecipientSelect.vue
-->
<template>
  <el-select v-model="handover" :placeholder="placeholder" filterable @change="handleChange">
    <el-option v-for="option in options" :label="option.nickname" :value="option.id" :key="option.id" />
  </el-select>
</template>

<script setup lang="ts">
import { getSimpleUserList } from '@/api/system/user'

const loading = ref(true) // 列表的加载中
const options = ref()

const props = defineProps({ placeholder: String, value: [String, Number] })

const handover = ref()
const setValueUndefined = (val) => {
  if (val) {
    handover.value = val
  } else {
    handover.value = undefined
  }
}
defineExpose({ setValueUndefined })

const getList = async () => {
  loading.value = true
  try {
    const data = await getSimpleUserList()
    console.log(data)
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
  handover.value = props.value
  getList()
})
</script>

<style scoped></style>
