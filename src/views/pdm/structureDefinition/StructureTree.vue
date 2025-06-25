<template>
  <div class="head-container">
    <el-input v-model="name" class="mb-20px" clearable placeholder="请输入结构名称">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div>
  <div class="head-container">
    <el-tree ref="treeRef" :data="structureList" :expand-on-click-node="false" :filter-node-method="filterNode"
      :props="defaultProps" default-expand-all highlight-current node-key="id" :current-node-key="0"
      @node-click="handleNodeClick">
      <template #default="{ data }">
        <span class="custom-tree-node">
          <img src="../../../../src/assets/imgs/data.png" class="icon" v-if="data.type === 0" />
          <img src="../../../../src/assets/imgs/structure.png" class="icon" v-if="data.type === 1" />
          <img src="../../../../src/assets/imgs/folder.png" class="icon" v-if="data.type === 2" />
          <img src="../../../../src/assets/imgs/file.png" class="icon" v-if="data.type === 3" />
          <span>{{ data.name }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style scoped lang="css">
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  padding-top: 5px;
  padding-right: 3px;
}
</style>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import { StructureApi } from '@/api/pdm/structureDefinition'
import { defaultProps, handleTree } from '@/utils/tree'

defineOptions({ name: 'PdmStructureTree' })

const name = ref('')
const structureList = ref<Tree[]>([]) // 树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()

/** 获得数据包结构树 */
const getTree = async () => {
  structureList.value = []
  const data = await StructureApi.getStructureList(null)
  structureList.value.push(...handleTree(data))

  console.log(structureList.value);

  //默认选中根节点，并触发选中事件
  handleNodeClick(structureList.value[0]);
}

defineExpose({ getTree }) // 暴露刷新结构树方法供父组件调用

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

/** 监听name */
watch(name, (val) => {
  treeRef.value!.filter(val)
})

/** 初始化 */
onMounted(async () => {
  await getTree()
})

</script>
