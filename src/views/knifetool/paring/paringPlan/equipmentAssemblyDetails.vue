<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-17 14:44:46
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlan/equipmentAssemblyDetails.vue
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    :max-height="600"
    :scroll="true"
    title="设备装配情况"
    width="1000"
  >
    <el-table :data="list" style="width: 100%; margin-top: 20px" height="500">
      <el-table-column prop="toolGroupCode" label="刀组编码" align="center" />
      <el-table-column prop="matchingQuantity" label="已装配数量" align="center" />
    </el-table>
  </el-dialog>
</template>
<script lang="ts" setup>
import { getEquParingByEquCode } from '@/api/knifetool/paring/paringPlan'

const detailObj: any = ref({})
const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中

const list = ref<any>([]) // 列表的数

const queryParams = ref({
  equipmentCode: ''
})

/** 查询列表 */
const getList = async () => {
  detailLoading.value = true
  try {
    console.log(queryParams)
    const data = await getEquParingByEquCode(queryParams.value)
    console.log(data)
    list.value = data[0]
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const open = async (row: any) => {
  console.log(row)
  dialogVisible.value = true
  try {
    detailLoading.value = true
    detailObj.value = row
    queryParams.value.equipmentCode = row.equipmentCode
    getList()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
