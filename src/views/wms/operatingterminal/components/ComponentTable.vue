<template>
  <el-table
    :data="props.tableData"
    :height="props.height"
    :id="props.scrollTableId"
    :header-cell-style="{ 'border-bottom': '1px solid #76f0ee' }"
    ref="ComponentTableRef"
    highlight-current-row
  >
    <el-table-column
      v-for="column in props.tableColumn"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :align="column.align"
      label-class-name="custom-header-color"
      :min-width="column.width"
    />
  </el-table>
</template>

<script setup lang="ts">
/***********************************************公共******************************/

defineOptions({ name: 'ComponentTable' });

const props = defineProps({
  tableData: {
    type: Array,
    default: () => []
  },
  //表格数据
  tableColumn: {
    type: Array as () => Array<any>,
    default: () => []
  },
  //表格列
  height: {
    type: String,
    default: 'auto'
  },
  //表格高度
  scrollTableId: {
    type: String,
    default: ''
  }
  // 表格滚动元素的id 注意不可重复
});

/********************************************导出*************************************/

const ComponentTableRef = ref();
//表格ref

const clearSelect = () => {
  ComponentTableRef.value?.clearSelection();
};
defineExpose({ clearSelect });
//用于多选表格，清空用户的选择

/******************************************初始化(滚动操作)***************************************/

// 在组件挂载时启动自动播放
onMounted(() => {
  nextTick(() => {
    autoPlay();
  });
});

// 表单内容自动向上轮播 表头不动
const autoPlay = () => {
  const table = document.querySelector('#' + props.scrollTableId);
  if (!table) {
    return;
  }
  //获得表格原始dom
  const scrollBarWrap = table?.querySelector('.el-scrollbar__wrap');
  if (!scrollBarWrap) {
    return;
  }
  //获得表格滚动元素的原始dom

  const status = ref(false);
  //当前状态(是否滚动)
  scrollBarWrap.addEventListener('mouseover', () => {
    status.value = false;
  });
  // 鼠标移入不滚动
  scrollBarWrap.addEventListener('mouseout', () => {
    status.value = false;
  });
  // 鼠标移出恢复滚动

  let scrollTop = 0; //当前滚动顶部
  const scrollStep = 1; // 每次滚动的步长
  const scrollInterval = 30; // 滚动间隔时间（毫秒）

  // 开启定时器，每隔一段时间滚动一次
  setInterval(() => {
    if (status.value) {
      scrollTop += scrollStep;
      // 滚动条滚动到底部时，重置滚动位置  滚动高度 - 可视区域高度
      if (scrollTop > scrollBarWrap.scrollHeight - scrollBarWrap.clientHeight) {
        scrollTop = 0; // 重置滚动位置
      }
      scrollBarWrap.scrollTop = scrollTop;
    }
  }, scrollInterval);
};
</script>

<style lang="scss">
//每个使用table组件的地方，都在其父元素上加上类my-table
.my-table {
  .el-table {
    //表格背景透明
    --el-table-border-color: transparent;
    --el-table-border: none;
    //--el-table-current-row-bg-color: transparent;
    --el-table-header-bg-color: transparent;
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-expanded-cell-bg-color: transparent;

    //表头颜色
    --el-table-header-text-color: #76f0ee;
    //文字颜色
    --el-table-text-color: #76f0ee;
    //鼠标停留在当前行高亮
    --el-table-row-hover-bg-color: rgb(118, 240, 238, 0.4);
    //选中高亮
    --el-table-current-row-bg-color: rgb(118, 240, 238, 0.4);
  }
}
</style>
