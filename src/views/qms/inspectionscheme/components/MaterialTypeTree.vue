<template>
  <div>
    <el-input v-model="standardName" class="mb-20px" clearable placeholder="搜索">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container" >
    <el-tree
      ref="treeRef"
      :data="materialTypeList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="defaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      @node-click="handleNodeClick"
    >
    <template #default="{ node }">
        <span
          :title="node.label"
          v-text="node.label">
        </span>
    </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import { ElTree } from 'element-plus'
  import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
  import { defaultProps, handleTree } from '@/utils/tree'

  defineOptions({ name: 'MaterialTypeTree' })

  const standardName = ref('')
  const materialTypeList = ref<Tree[]>([]) // 树形结构
  const treeRef = ref<InstanceType<typeof ElTree>>()

  /** 获得部门树 */
  const getTree = async () => {
    const res = await MaterialTypeApi.getMaterialTypeList()

      const root: Tree = { id: '0', name: '类别', children: [] }
      root.children = handleTree(res, 'id', 'parentId')
   materialTypeList.value = []
      materialTypeList.value.push(root)
  }

  /** 基于名字过滤 */
  const filterNode = (name: string, data: Tree) => {
    if (!name) return true
    return data.name.includes(name)
  }

  /** 处理部门被点击 */
  const handleNodeClick = async (row: { [key: string]: any }) => {
    emits('node-click', row)
  }
  const emits = defineEmits(['node-click'])

  /** 监听deptName */
  watch(standardName, (val) => {
    treeRef.value!.filter(val)
  })

  /** 初始化 */
  onMounted(async () => {
    await getTree()
  })
</script>

<style lang="scss" scoped>
.head-container {
  height: calc(100vh - var(--app-content-padding) - var(--top-tool-height) - var(--tags-view-height) - var(--el-component-size) - var(--el-card-padding) * 2 - 100px);
  overflow-y: scroll;
}
</style>
