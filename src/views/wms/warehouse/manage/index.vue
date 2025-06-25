<template>
  <el-row :gutter="20">
    <el-col :span="6" :xs="24">
      <ContentWrap>
        <WarehouseTree />
      </ContentWrap>
    </el-col>
    <el-col :span="18" :xs="24">
      <!-- 仓库 -->
      <warehouse v-if="treeSelectNode.type === 0 || treeSelectNode.type === null" />
      <!-- 库区 -->
      <warehousearea v-if="treeSelectNode.type === 1" />
      <!-- 库区详情 -->
      <WarehouseAreaDetail @selectLocation="handleLocatonSelect" v-if="treeSelectNode.type === 2" />
      <!-- 库存 -->
      <WarehouseLocationDetail v-if="treeSelectNode.type === 3" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import WarehouseTree from '@/components/warehouse/WarehouseTree.vue'
import warehouse from '../warehouse/index.vue'
import warehousearea from '../warehousearea/index.vue'
import WarehouseAreaDetail from '../warehousearea/WarehouseAreaDetail.vue'
import WarehouseLocationDetail from '../warehouselocation/WarehouseLocationDetail.vue'

const handleLocatonSelect = (val: string) => {
  treeSelectNode.id = val
  treeSelectNode.type = 3
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
