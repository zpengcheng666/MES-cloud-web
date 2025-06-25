<template>
  <div class="head-container">
    <el-input v-model="itemTypeName" class="mb-20px" clearable placeholder="请输入检测项目分类名称">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container">
    <el-tree
      ref="treeRef"
      :data="itemTypeList"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :props="defaultProps"
      default-expand-all
      highlight-current
      node-key="id"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ElTree } from 'element-plus'
  import { InspectionItemTypeApi, InspectionItemTypeVO } from '@/api/qms/inspectionitemtype'
  import { defaultProps, handleTree } from '@/utils/tree'

  defineOptions({ name: 'ItemTypeTree' })

  const itemTypeName = ref('')
  const itemTypeList = ref<Tree[]>([]) // 树形结构
  const treeRef = ref<InstanceType<typeof ElTree>>()

  /** 获得部门树 */
  const getTree = async () => {
    const res = await InspectionItemTypeApi.getInspectionItemTypeList()
    itemTypeList.value = []
    itemTypeList.value.push(...handleTree(res))
  }

  /** 基于名字过滤 */
  const filterNode = (name: string, data: Tree) => {
    if (!name) return true
    return data.itemTypeName.includes(name)
  }

  /** 处理部门被点击 */
  const handleNodeClick = async (row: { [key: string]: any }) => {
    emits('node-click', row)
  }
  const emits = defineEmits(['node-click'])

  /** 监听deptName */
  watch(itemTypeName, (val) => {
    treeRef.value!.filter(val)
  })

  /** 初始化 */
  onMounted(async () => {
    await getTree()
  })
</script>
