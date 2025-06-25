
<template>
  <h4 v-if="list.childrens && list.childrens.length > 0">容器详情</h4>
  <h4 v-else>物料详情</h4>
  <ContentWrap>
    <el-descriptions :column="3" size="large" border v-if="list">
      <el-descriptions-item width="16.6%" >
        <template #label>
          <div class="cell-item"> 物料编号 </div>
        </template>
        {{ list.materialNumber }}
      </el-descriptions-item>
      <el-descriptions-item width="16.6%" >
        <template #label>
          <div class="cell-item"> 物料条码 </div>
        </template>
        {{ list.barCode }}
      </el-descriptions-item>
      <el-descriptions-item width="16.6%" >
        <template #label>
          <div class="cell-item"> 物料批次号 </div>
        </template>
        {{ list.batchNumber }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 绑定库位 </div>
        </template>
        {{list.locationName}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 绑定储位 </div>
        </template>
        {{ list.storageName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 总库存 </div>
        </template>
        {{ list.totality }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <ContentWrap v-if="list.childrens && list.childrens.length > 0">
    <el-timeline v-for="(l,li) in list.childrens" :key="li" >
      <h5>层：{{ li+1 }}</h5>
        <el-card>
          <el-row :gutter="10" v-for="(r,ri) in l" :key="ri">
            <h5>行：{{ ri+1 }}</h5>
            <el-col v-for="(c,ci) in r" :key="ci" :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
                  <!-- <el-statistic class="statistic" :style="list.childrens.filter((item) => item.layer == l && item.row == r && item.col == c ).length > 0 ? 'background: #67C772;' : ''" :value="100" @click="handleDetails(l, r, c)"> -->
                  <el-statistic v-if="c" class="statistic" :style="c.valid==1 ? 'background: #67C772;' : ''" :value="100" @click="handleDetails(c.id)">
                    <template #title>
                      <div class="statistic-title">  {{ ri+1 }} - {{ ci+1 }}</div>
                    </template>
                  </el-statistic>
                </el-col>
          </el-row>
        </el-card>
    </el-timeline>
  </ContentWrap>
</template>
<script setup lang="ts">
import { MaterialStockApi } from '@/api/wms/materialstock'

const loading = ref(true) // 列表的加载中
const list = ref<any>({}) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  stockId: ''
})

const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialStockApi.getMaterialStorageListByStockId(queryParams.stockId)
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
        queryParams.stockId = val
        getList()
      })
  },
  { immediate: true }
)

// 选择库位事件
const emit = defineEmits<{
  selectLocation: [id: string]
}>()

const handleDetails = (id: string) => {
  emit('selectStorage', id)
}
// const handleDetails = (l: any, r: any, c: any) => {
//   const s = list.value.childrens.filter((item) => (item.layer == l || item.layer == null) && (item.row == r || item.row == null) && (item.col == c || item.col == null))
//   if(s.length == 0){
//     return
//   }
//   emit('selectStorage', s[0].id)
// }
</script>

<style scoped lang="scss">
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
