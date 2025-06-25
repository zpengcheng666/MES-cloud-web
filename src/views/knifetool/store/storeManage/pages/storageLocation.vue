<!--
 * @Author: hyj
 * @Description: 货位管理
 * @Date: 2024-06-12 13:54:43
 * @LastEditTime: 2024-06-17 15:59:59
 * @FilePath: /cimp-tms-web/src/views/store/storeManage/pages/storageLocation.vue
-->
<template>
  <h4>货位管理</h4>
  <ContentWrap>
    <el-descriptions :column="3" size="large" border v-if="list.store">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 仓库名称 </div>
        </template>
        {{ list.store.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 仓库管理员 </div>
        </template>
        {{ list.store.admin }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 货架名称 </div>
        </template>
        {{ list.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 货架规格 </div>
        </template>
        {{ list.specifications }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库位数量 </div>
        </template>
        {{ list.store.shelfNum }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库存物料数量 </div>
        </template>
        {{ list.storeNum }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 位置 </div>
        </template>
        {{ list.store.location }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <ContentWrap>
    <el-row :gutter="10" v-for="(item, i) in list.lcation" :key="i">
      <el-col v-for="(c, ci) in item" :key="ci" :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
        <el-statistic class="statistic" :value="100" @click="handleDetails(c)">
          <template #title>
            <div class="statistic-title"> {{ c.layerNum }} - {{ c.locationNum }}</div>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </ContentWrap>
</template>
<script setup lang="ts">
import { getLocationMange } from '@/api/knifetool/store/storeManage'

const loading = ref(true) // 列表的加载中
const list = ref<any>({}) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  treeRackId: ''
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getLocationMange(queryParams)
    console.log(data)
    list.value = data
  } finally {
    loading.value = false
  }
}

const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    console.log(val)
    val &&
      val.length &&
      nextTick(() => {
        queryParams.treeRackId = val
        getList()
      })
  },
  { immediate: true }
)
// 处理绑定值更新
const emit = defineEmits<{
  statisticSelect: [id: number]
}>()
const handleDetails = (c: any) => {
  console.log(c)
  emit('statisticSelect', c.id)
}
</script>

<style scoped>
/* :deep(.el-descriptions) {
  margin-top: 0;
}*/
.cell-item {
  font-weight: bold;
}
.statistic {
  background: #e6e8eb;
  margin: 10px 0;
  padding: 5px;
  text-align: center;
  color: #409eff;
  cursor: pointer;
  .statistic-title {
    font-size: 16px;
    text-align: left;
  }
}
</style>
