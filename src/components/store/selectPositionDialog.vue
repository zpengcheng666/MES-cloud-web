<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 10:29:56
 * @LastEditTime: 2024-07-01 14:30:03
 * @FilePath: /cimp-tms-web/src/components/store/selectPositionDialog.vue
-->
<template>
  <Dialog v-model="innerVisible" :title="title" width="1200px" style="min-height: 500px">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <WarehouseTree ref="warehouseTreeRef" />
      </el-col>
      <el-col :span="20" :xs="24">
        <el-card style="height: 100%" shadow="never">
          <template #header>
            <strong style="font-size: 16px">选择货位</strong>
          </template>
          <el-row :gutter="10" v-for="(item, i) in list.lcation" :key="i">
            <el-col v-for="(c, ci) in item" :key="ci" :xs="4" :sm="3" :md="3" :lg="3" :xl="3">
              <div class="l-box" @click="handleDetails(c)">
                <el-badge :value="200" :max="99" class="item">
                  <el-button>{{ c.isfull ? '满库' : '库位' }}</el-button>
                </el-badge>
                <div class="statistic-title"> {{ c.layerNum }}-{{ c.locationNum }}</div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </Dialog>
</template>

<script setup lang="ts">
import WarehouseTree from './WarehouseTree.vue'
import { getlocationMangeNo } from '@/api/knifetool/store/storeManage'
import { propTypes } from '@/utils/propTypes'

const innerVisible = ref(false) // 弹窗的是否展示
const loading = ref(true) // 列表的加载中
const list = ref<any>({}) // 列表的数
const queryParams = reactive<{
  pageNo: number
  pageSize: number
  treeRackId?: number
}>({
  pageNo: 1,
  pageSize: 10,
  treeRackId: undefined
})

const props = defineProps({
  title: propTypes.string,
  isclick: propTypes.bool
})

// 显示当前弹窗
const open = async () => {
  innerVisible.value = true
}

const resetList = () => {
  treeSelectNode.id = ''
  list.value = []
}

// 向外暴露open方法，方便父组件调用，用于打开弹窗
defineExpose({ open, resetList })

const getList = async () => {
  loading.value = true
  try {
    const data = await getlocationMangeNo(queryParams)
    // console.log(data)
    list.value = data
  } finally {
    loading.value = false
  }
}

const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
      val.length &&
      nextTick(() => {
        if (treeSelectNode.classification !== undefined) {
          queryParams.treeRackId = val
          getList()
        }
      })
  },
  { immediate: true }
)

// 处理绑定值更新
const emit = defineEmits<{
  success: [id: number]
}>()
const handleDetails = (c: any) => {
  if (c.isfull && !props.isclick) {
    ElNotification({
      title: '警告',
      message: '当前仓库已满，请选择其他仓库',
      type: 'error'
    })
    return
  }
  emit('success', c)
  innerVisible.value = false
}
</script>

<style scoped>
.l-box {
  background: #e6e8eb;
  margin: 10px 0;
  padding: 5px;
  text-align: center;
  cursor: pointer;

  .statistic-title {
    font-size: 16px;
  }
}
</style>
