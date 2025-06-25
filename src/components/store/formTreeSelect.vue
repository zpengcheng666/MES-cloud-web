<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-27 09:27:42
 * @LastEditTime: 2024-08-01 11:14:23
 * @FilePath: /cimp-tms-web/src/components/store/formTreeSelect.vue
-->
<template>
  <el-tree-select
    placeholder="请选择刀具分类"
    check-strictly
    :props="defaultProps"
    v-model="toolCategoryValue"
    :data="treeSelect"
    :render-after-expand="false"
    style="width: 240px"
    @change="handleChange"
    clearable
  />
</template>

<script setup lang="ts">
import { handleTree } from '@/utils/tree'
import { getCategoryList } from '@/api/knifetool/tool/category'

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}
const treeSelect = ref<any>([])
const loading = ref(true) // 列表的加载中

const toolCategoryValue = ref()
defineExpose({ toolCategoryValue })

/** 查询刀具分类 */

const getTreeSelectList = async () => {
  loading.value = true
  try {
    const data = await getCategoryList({})
    treeSelect.value = handleTree(data, 'id', 'pid')
    console.log(treeSelect.value)
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['treeValue']) // 定义 success 事件，用于操作成功后的回调
const handleChange = (val: number) => {
  emit('treeValue', val)
}

/** 初始化 */
onMounted(() => {
  getTreeSelectList()
})
</script>

<style scoped></style>
