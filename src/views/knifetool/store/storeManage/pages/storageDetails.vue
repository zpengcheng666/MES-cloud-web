<!--
 * @Author: hyj
 * @Description: 货位详情
 * @Date: 2024-06-12 13:54:43
 * @LastEditTime: 2024-06-17 15:59:45
 * @FilePath: /cimp-tms-web/src/views/store/storeManage/pages/storageDetails.vue
-->
<template>
  <h4>货位详情</h4>
  <ContentWrap>
    <el-descriptions :column="3" size="large" border v-if="statistic.store">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 仓库名称 </div>
        </template>
        {{ statistic.store.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 仓库管理员 </div>
        </template>
        {{ statistic.store.admin }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 货架名称 </div>
        </template>
        {{ statistic.rack.name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 货架规格 </div>
        </template>
        {{ statistic.rack.specifications }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 货位编号 </div>
        </template>
        {{ statistic.code }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库存物料数量 </div>
        </template>
        {{ total }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 位置 </div>
        </template>
        {{ statistic.store.location }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 是否满仓 </div>
        </template>
        <el-switch
          v-model="isFull"
          inline-prompt
          active-text="是"
          inactive-text="否"
          @change="handleSwitch"
        />
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <h4>库存信息</h4>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="code" label="刀具类码" align="center" width="180" />
      <el-table-column prop="name" label="刀具名称" align="center" />
      <el-table-column prop="spec" label="通用规格" align="center" />
      <el-table-column prop="toolCategoryValue" label="所属分类" align="center" />
      <el-table-column prop="storeNumNew" label="货位新品存储量" align="center" />
      <el-table-column prop="storeNumOld" label="货位旧品存储量" align="center" />
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
</template>
<script setup lang="ts">
import { getLocationInfo, getLocationGoodPage, putLocationIsfull } from '@/api/knifetool/store/storeManage'

const loading = ref(true) // 列表的加载中
const statistic = ref<any>({})
const isFull = ref<boolean>(false)
const list = ref<any>([]) // 列表的数
const total = ref<number>(0)
const queryTitleParams = reactive({
  id: ''
})
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storeLocationId: ''
})
const isFullParams = reactive<any>({ id: '', isfull: '' })

const getStatistic = async () => {
  loading.value = true
  try {
    const data = await getLocationInfo(queryTitleParams)
    console.log(data)
    statistic.value = data
    isFull.value = data.isfull === 1 ? true : false
    console.log(isFull.value)
  } finally {
    loading.value = false
  }
}

const getList = async () => {
  loading.value = true
  try {
    const data = await getLocationGoodPage(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
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
        queryTitleParams.id = val
        queryParams.storeLocationId = val
        isFullParams.id = val
        getStatistic()
        getList()
      })
  },
  { immediate: true }
)

const handleSwitch = async (val: boolean) => {
  isFullParams.isfull = val ? 1 : 0
  const data = await putLocationIsfull(isFullParams)
  console.log(data)
  console.log(val)
}

/** 初始化 */
// onMounted(() => {
//   getList()
// })
</script>

<style scoped>
/* :deep(.el-descriptions) {
  margin-top: 0;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
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
