<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-26 09:31:03
 * @FilePath: /cimp-tms-web/src/views/toolDetail/toolComponentInfo/viewToolDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :fullscreen="true" title="查看">
    <baseInfoDetails
      v-if="currentRow.toolDataType === 1"
      :isView="true"
      :rowID="currentRow.toolInformationId"
    />
    <handleInfoDetails
      v-if="currentRow.toolDataType === 2"
      :isView="true"
      :rowID="currentRow.toolInformationId"
    />
    <partsInfoDetails
      v-if="currentRow.toolDataType === 3"
      :isView="true"
      :rowID="currentRow.toolInformationId"
    />
  </Dialog>
</template>
<script lang="ts" setup>
import baseInfoDetails from '@/views/knifetool/tool/baseInfo/AddAndEdit.vue'
import handleInfoDetails from '@/views/knifetool/tool/handleInfo/AddAndEdit.vue'
import partsInfoDetails from '@/views/knifetool/tool/partsInfo/AddAndEdit.vue'

const dialogVisible = ref(false) // 弹窗的是否展示
const currentRow = ref()

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  currentRow.value = row
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

onMounted(() => {})
</script>
