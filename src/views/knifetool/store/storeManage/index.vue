<!--
 * @Author: hyj
 * @Description: 库区
 * @Date: 2024-06-11 10:42:22
 * @LastEditTime: 2024-07-03 10:45:19
 * @FilePath: /cimp-tms-web/src/views/store/storeManage/index.vue
-->
<template>
  <el-row :gutter="20">
    <el-col :span="4" :xs="24">
      <ContentWrap>
        <WarehouseTree />
      </ContentWrap>
    </el-col>
    <el-col :span="20" :xs="24">
      <!-- 库区 -->
      <warehouseLocation v-if="treeSelectNode.classification === null" />
      <!-- 货架 -->
      <shelves v-if="treeSelectNode.classification === 2" />
      <!-- 货位管理 -->
      <storageLocation
        @statistic-select="handleStatisticSelect"
        v-if="treeSelectNode.classification === 3"
      />
      <!-- 货位详情 -->
      <storageDetails v-if="treeSelectNode.classification === undefined" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import WarehouseTree from '@/components/store/WarehouseTree.vue'
import warehouseLocation from './pages/warehouseLocation.vue'
import shelves from './pages/shelves.vue'
import storageLocation from './pages/storageLocation.vue'
import storageDetails from './pages/storageDetails.vue'

const handleStatisticSelect = (val: number) => {
  console.log(val)
  treeSelectNode.id = val
  treeSelectNode.classification = undefined
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  classification: null
})
provide('treeSelectNode', treeSelectNode)
</script>
<style scoped lang="scss"></style>
