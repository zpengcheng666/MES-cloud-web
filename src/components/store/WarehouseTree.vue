<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-12 10:32:20
 * @LastEditTime: 2024-07-03 11:19:58
 * @FilePath: /cimp-tms-web/src/components/store/WarehouseTree.vue
-->
<template>
  <div>
    <el-input v-model="wName" class="mb-20px" clearable placeholder="请输入仓库名称">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container">
    <el-tree ref="treeRef" :data="warehouseList" :expand-on-click-node="false" :filter-node-method="filterNode"
      :props="defaultProps" default-expand-all highlight-current node-key="id" @node-click="handleNodeClick" />
  </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import { getSimpleLocationList } from '@/api/knifetool/store/storeManage'
import bus from '@/utils/bus'

defineOptions({ name: 'SystemUserDeptTree' })

const wName = ref('')
const warehouseList = ref<Tree[]>([]) // 树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'childrens',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const changeTreeData = (arr: any[]) => {
  arr.map((item: { childrens: any[]; children?: any[] }) => {
    const { children, childrens } = item
    item.childrens = childrens || children
    if (item.childrens) {
      changeTreeData(item.childrens)
    }
  })
}

const type = inject('treeType') as any
console.log(type)
/** 获得部门树 */
const getTree = async () => {
  const res = await getSimpleLocationList(type)
  changeTreeData([res])
  warehouseList.value = [res]
}

/** 基于名字过滤 */
const filterNode = (name: string, data: Tree) => {
  if (!name) return true
  return data.name.includes(name)
}

// 使用 inject 函数来注入 sharedState
const treeSelectNode = inject('treeSelectNode') as any

const handleNodeClick = async (row: { [key: string]: any }) => {
  const { name, id, classification, type } = row
  treeSelectNode.name = name
  treeSelectNode.id = id
  treeSelectNode.classification = classification
  treeSelectNode.type = type
}

/** 监听wName */
watch(wName, (val) => {
  treeRef.value!.filter(val)
})

/** 初始化 */
onMounted(async () => {
  await getTree()
})

bus.on('updateTreeNode', () => {
  console.log('更新树')
  getTree()
})
</script>
<style lang="scss" scoped>
.head-container {
  height: calc(100vh - var(--app-content-padding) - var(--top-tool-height) - var(--tags-view-height) - var(--el-component-size) - var(--el-card-padding) * 2 - 20px - 20px);
  overflow-y: scroll;
}
</style>
