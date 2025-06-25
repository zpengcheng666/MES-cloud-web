
<template>
  <h4>库区详情</h4>
  <ContentWrap>
    <el-descriptions :column="3" size="large" border v-if="list">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 仓库编码 </div>
        </template>
        {{ list.warehouseCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库区名称 </div>
        </template>
        {{ list.areaName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库区编码 </div>
        </template>
        {{ list.areaCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库区属性 </div>
        </template>
        <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_AREA_PROPERTY" :value="list.areaProperty" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库区类型 </div>
        </template>
        <dict-tag :type="DICT_TYPE.WMS_WAREHOUSE_AREA_TYPE" :value="list.areaType" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库位数量 </div>
        </template>
        {{ list.locationCount }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <ContentWrap>
    <el-timeline v-for="(c, ci) in list.childrens" :key="ci" >  
      <h5>通道：{{ ci+1 }}</h5>
      <el-timeline-item v-for="(g,gi) in c" :key="gi"  :timestamp="'组:'+(gi+1)" placement='top'>
        <el-card>
          <el-row :gutter="10" v-for="(l,li) in g" :key="li">
            <el-col v-for="(s,si) in l" :key="si" :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
              <el-statistic v-if="s" class="statistic" :value="100" :style="s.valid==1&& s.locked==0 ? 'background: #67C772;' : ''" @click="handleDetails(s.id)">
                <template #title>
                  <div class="statistic-title">  {{ li+1 }} - {{ si+1 }}</div>
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline>


    <!-- <el-timeline v-for="c in list.areaChannels===null?1:list.areaChannels" :key="c" >  
      <h5>通道：{{ c }}</h5>
      <el-timeline-item v-for="g in list.areaGroup===null?1:list.areaGroup" :key="g"  :timestamp="'组:'+g" placement='top'>
        <el-card>
          <el-row :gutter="10" v-for="l in list.areaLayer===null?1:list.areaLayer" :key="l">
            <el-col v-for="s in list.areaSite===null?1:list.areaSite" :key="s" :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
              <el-statistic class="statistic" :value="100" @click="handleDetails(c, g, l, s)">
                <template #title>
                  <div class="statistic-title">  {{ l }} - {{ s }}</div>
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>
    </el-timeline> -->
      
  </ContentWrap>
</template>
<script setup lang="ts">
import { getwarehouseareadetail } from '@/api/wms/warehousemanage'
import {DICT_TYPE} from "@/utils/dict";

const loading = ref(true) // 列表的加载中
const list = ref<any>({}) // 列表的数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  areaId: ''
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getwarehouseareadetail(queryParams)
    console.log(9999, data)
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
        queryParams.areaId = val
        getList()
      })
  },
  { immediate: true }
)

// 选择库位事件
const emit = defineEmits<{
  selectLocation: [id: string]
}>()
// const handleDetails = (c: any, g: any, l: any, s: any) => {
//   const lis = list.value.childrens.filter((item) => (item.channel == c|| item.channel == null) && (item.groupp == g|| item.groupp == null) && (item.layer == l|| item.layer == null) && (item.site == s|| item.site == null))
//   if(s.length == 0){
//     return
//   }
//   emit('selectLocation', lis[0].id)
// }
const handleDetails = (id: string) => {
  emit('selectLocation', id)
}
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
