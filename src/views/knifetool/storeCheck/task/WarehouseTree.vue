<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-12 10:32:20
 * @LastEditTime: 2024-07-05 15:29:30
 * @FilePath: /cimp-tms-web/src/views/storeCheck/task/WarehouseTree.vue
-->
<template>
  <el-card shadow="never">
    <template #header>仓库货架树</template>
    <el-tree
      :expand-on-click-node="false"
      style="max-width: 600px"
      :props="defaultProps"
      :load="loadNode"
      lazy
      @node-click="handleNodeClick"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import {
  getTreeChildren,
  getTreeLocation,
  getStoreCheckLocation,
  getStoreCheckPlanItemInfoByLocationIdAndPlanId
} from '@/api/knifetool/storeCheck/task'
import type Node from 'element-plus/es/components/tree/src/model/node'
// import bus from '@/utils/bus'

defineOptions({ name: 'SystemUserDeptTree' })

const defaultProps = {
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const props = defineProps({ storeInfo: Object })

const queryParams = reactive<{
  type: number
}>({
  type: 1
})

interface Tree {
  name: string
  isLeaf?: boolean
}

const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
  console.log(node)
  if (node.data.classification === 3) {
    const lData = await getTreeLocation(node.data.id, queryParams)
    console.log(lData)
    lData.map((item) => (item.leaf = true))
    resolve(lData)
  } else {
    const res = await getTreeChildren(props.storeInfo?.treeId, queryParams)
    console.log(res)
    return resolve(res)
  }
}

const emit = defineEmits(['handleSelect'])
const handleNodeClick = async (node) => {
  console.log(node)

  if (node.classification === 3) {
    const res = await getStoreCheckLocation({ treeid: node.id, planId: props.storeInfo?.planId })
    emit('handleSelect', { data: res, currentNode: node })
  } else {
    const res = await getStoreCheckPlanItemInfoByLocationIdAndPlanId({
      locationId: node.id,
      checkPlanId: props.storeInfo?.planId
    })
    emit('handleSelect', { data: res, currentNode: node })
  }
}
</script>
<style lang="scss" scoped>
.head-container {
  height: calc(
    100vh - var(--app-content-padding) - var(--top-tool-height) - var(--tags-view-height) - var(
        --el-component-size
      ) - var(--el-card-padding) * 2 - 20px - 20px
  );
  overflow-y: scroll;
}
</style>
