<template>
  <h4>储位详情</h4>
  <ContentWrap>
    <el-descriptions :column="2" size="large" border v-if="storageInfo">
      <el-descriptions-item width="16%" >
        <template #label>
          <div class="cell-item"> 储位编码 </div>
        </template>
        {{ storageInfo.storageCode }}
      </el-descriptions-item>
      <el-descriptions-item width="16%" >
        <template #label>
          <div class="cell-item"> 储位名称 </div>
        </template>
        {{ storageInfo.storageName }}
      </el-descriptions-item>
      <el-descriptions-item width="16%">
        <template #label>
          <div class="cell-item"> 是否有效 {{valid}}</div>
        </template>
        <el-switch v-model="storageInfo.valid" 
          :active-value="'1'" :inactive-value="'0'" 
          active-text="是" inactive-text="否" 
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="handleChange" />
      </el-descriptions-item>
      <el-descriptions-item width="16%" >
        <template #label>
          <div class="cell-item"> 物料条码 </div>
        </template>
        {{ storageInfo.barCode }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料编号" align="center" width="120px" prop="materialNumber" />
      <el-table-column label="物料条码" align="center" width="150px" prop="barCode" />
      <el-table-column label="物料批次号" align="center" width="150px" prop="batchNumber" />
      <el-table-column label="绑定库位" align="center" width="150px" prop="locationCode" />
      <el-table-column label="绑定储位" align="center" width="150px" prop="storageCode" />
      <el-table-column label="绑定类型" align="center" prop="bindType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.WMS_BIND_TYPE" :value="scope.row.bindType" />
        </template>
      </el-table-column>
      <el-table-column label="总库存" align="center" prop="totality" />
      <el-table-column label="占用比例" align="center" prop="occupancyRatio" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
      
  </ContentWrap>
</template>
<script setup lang="ts">
import { MaterialStockApi } from '@/api/wms/materialstock'
import { MaterialStorageApi, MaterialStorageVO } from '@/api/wms/materialstorage'
import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";
const message = useMessage() // 消息弹窗


const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
    val.length &&
    nextTick(() => {
      queryParams.storageId = treeSelectNode.id
      getStorageInfo()
      getList()
    })
  },
  { immediate: true }
)

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  storageId: '',
})

const storageInfo = ref({})
// 查询库位信息
const getStorageInfo = async () => {
  loading.value = true
  try {
    const data = await MaterialStockApi.getStorageStockDetail(queryParams.storageId)
    storageInfo.value = data
  } finally {
    loading.value = false
  }
}

const handleChange = async () => {
  if(storageInfo.value.id){
    const data = storageInfo.value as unknown as MaterialStorageVO
    await MaterialStorageApi.updateMaterialStorage(data)
      message.success("储位状态已更新")
  }

}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialStockApi.getMaterialStockPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

</script>
