<template>
  <el-row :gutter="20">
    <el-col :span="6" :xs="24">
      <ContentWrap>
        <StockTree />
      </ContentWrap>
    </el-col>
    <el-col :span="18" :xs="24">
      <!-- 物料库存 -->
      <materialstock v-if="treeSelectNode.type === 0 || treeSelectNode.type === null" />
      <!-- 物料库存详情-->
      <materialStorageDetail @selectStorage="handleStorageSelect" v-if="treeSelectNode.type === 1" />
      <!-- 储位详情 -->
      <materialStockDetail v-if="treeSelectNode.type === 2" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import StockTree from '@/components/materialstock/StockTree.vue'
import materialstock from '../materialstock/index.vue'
import materialStorageDetail from '../materialstorage/MaterialStorageDetail.vue'
import materialStockDetail from '../materialstock/MaterialStockDetail.vue'


const handleStorageSelect = (val: string) => {
  treeSelectNode.id = val
  treeSelectNode.type = 2
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  type: null
})
provide('treeSelectNode', treeSelectNode)
</script>
<style scoped lang="scss"></style>
