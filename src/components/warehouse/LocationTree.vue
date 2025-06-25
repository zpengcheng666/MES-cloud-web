<template>
  <!-- <div>
    <el-input v-model="wName" class="mb-20px" clearable placeholder="搜索">
      <template #prefix>
        <Icon icon="ep:search" />
      </template>
    </el-input>
  </div> -->
  <div class="head-container">
    <el-tree ref="treeRef" :data="warehouseList" :expand-on-click-node="false" :filter-node-method="filterNode"
      :props="defaultProps"   highlight-current node-key="id" @node-click="handleNodeClick" @node-contextmenu="ok" />
  </div>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import { warehouseLocationTree } from '@/api/wms/warehousemanage'
import bus from '@/utils/bus'

defineOptions({ name: 'LocationTree' })

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
// 上下架 时过滤库位树
const InsParam = inject('InsParam')
const params = ref({})
/** 获得部门树 */
const getTree = async () => {
  const startTime = Date.now();
  if(type)params.value.type = type
  if(InsParam){
    params.value.warehouseId = InsParam.warehouseId
    params.value.areaTypes = InsParam.areaTypes
  }
  const res = await warehouseLocationTree(params.value)
  const endTime = Date.now(); // 记录请求结束时间
  const duration = endTime - startTime; // 计算请求持续时间
  console.log(`网络请求时间: ${duration} 毫秒`);
        
  // changeTreeData([res])
  warehouseList.value = res
}

/** 基于名字过滤 */
const filterNode = (name: string, data: Tree) => {
  if (!name) return true
  return data.name.includes(name)
}

// 使用 inject 函数来注入 sharedState
const selectPositionNode = inject('selectPositionNode') as any

const handleNodeClick = async (row: { [key: string]: any }) => {
  const { name, id, type, childrens } = row
  selectPositionNode.name = name
  selectPositionNode.id = id
  selectPositionNode.type = type
  selectPositionNode.childrens = childrens
}

const emit = defineEmits(['ok']) // 定义 success 事件，用于操作成功后的回调
const ok = () => {
  console.log('ok')
  emit('ok')
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
  getTree()
})
</script>
<style lang="scss" scoped>
.head-container {
  min-height: 20vh;
  height: calc(100vh - var(--app-content-padding) - var(--top-tool-height) - var(--tags-view-height) - var(--el-component-size) - var(--el-card-padding) * 2 - 20px);
  overflow-y: auto;
}
</style>
