<template>
  <h4>库位详情</h4>
  <ContentWrap>
    <el-descriptions :column="3" size="large" border v-if="locationInfo">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库位编码 </div>
        </template>
        {{ locationInfo.locationCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库位名称 </div>
        </template>
        {{ locationInfo.locationName }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库区编码 </div>
        </template>
        {{ locationInfo.areaCode }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 是否有效 </div>
        </template>
        <!-- <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="locationInfo.valid" /> -->
        <el-switch v-model="locationInfo.valid" 
          :active-value="1" :inactive-value="0" 
          active-text="是" inactive-text="否" 
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="handleChange" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 是否锁定 </div>
        </template>
        <!-- <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_TINYINT" :value="locationInfo.locked" /> -->
        <el-switch v-model="locationInfo.locked" 
          :active-value="1" :inactive-value="0" 
          active-text="是" inactive-text="否" 
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          @change="handleChange" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item"> 库位物料数量 </div>
        </template>
        {{ list.length }}
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
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="offShelfInstruction(scope.row.id)"
            v-hasPermi="['wms:instruction:create']"
            v-if="locationInfo.valid === 1 
            && locationInfo.locked === 0
            && locationInfo.areaType === 1"
          >
            下架
          </el-button>
          <el-button
            link
            type="primary"
            @click="onShelfInstruction(scope.row.id)"
            v-hasPermi="['wms:instruction:create']"
            v-if="locationInfo.valid === 1 
            && locationInfo.locked === 0
            && (locationInfo.areaType === 3  || locationInfo.areaType === 9 || locationInfo.areaType === 11)"
          >
            上架
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
      
  </ContentWrap>
  <SelectLocationDialog ref="selectLocationDialog" @selectPositionNode="selectPositionNode" />

</template>
<script setup lang="ts">
import { WarehouseLocationApi, WarehouseLocationVO } from '@/api/wms/warehouselocation'
import { MaterialStockApi } from '@/api/wms/materialstock'
import { InstructionApi } from '@/api/wms/instruction'
import {DICT_TYPE} from "@/utils/dict";
import {dateFormatter} from "@/utils/formatTime";
import SelectLocationDialog from "@/views/wms/dialog/SelectLocationDialog.vue";

const message = useMessage() // 消息弹窗


const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
    val.length &&
    nextTick(() => {
      // queryParams.locationId = treeSelectNode.id
      // 全查库位上的所有物料
      queryParams.rootLocationId = treeSelectNode.id
      getLocationInfo()
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
  locationId: '',
})

const locationInfo = ref({})
// 查询库位信息
const getLocationInfo = async () => {
  loading.value = true
  try {
    const data = await WarehouseLocationApi.getWarehouseLocationDetail(queryParams.rootLocationId)
    // const data = await WarehouseLocationApi.getWarehouseLocationDetail(queryParams.locationId)
    locationInfo.value = data
    InsParam.warehouseId = data.warehouseId
  } finally {
    loading.value = false
  }
}

const handleChange = async () => {
  if(locationInfo.value.id){
    const data = locationInfo.value as unknown as WarehouseLocationVO
    await WarehouseLocationApi.updateWarehouseLocation(data)
    message.success("库位状态已更新")
  }

}

const materialStockId = ref('')
const InsType = ref('')

const offShelfInstruction = (id: number) => {
  InsParam.areaTypes = "3, 9, 11"
  materialStockId.value = id
  InsType.value = "offShelf"
  openLocationDialog()
}

const onShelfInstruction = (id: number) => {
  InsParam.areaTypes = "1"
  materialStockId.value = id
  InsType.value = "onShelf"
  openLocationDialog()
}

const InsParam = reactive<any>({
  warehouseId: undefined,
  areaTypes: undefined
})
// 向后代组件提供数据, 只要是后代都能接收
provide('InsParam', InsParam)



// 打开储位选择弹框
const selectLocationDialog = ref()
const openLocationDialog = () => {
  selectLocationDialog.value.open()
}

const position = reactive({
  id: undefined,
  type: undefined,// 2 储位 3 库位
  name: undefined,
})

// NULL全部  1 库位 2 储位
provide('treeType', 1)
const selectPositionNode = (node: any) => {
  const { id, type } = node
  getPostion(id,type)
}

const getPostion = async(id: number,type: number) => {
  if(type == 3){
    const data = await WarehouseLocationApi.getWarehouseLocation(id)
    if(!data){message.error('请选择根节点！！！'); return}
    generateInstruction(id)
  }
}

// 生成指令
const generateInstruction = async(targetLocationId: string) => {
  if(InsType.value === 'offShelf'){
    await InstructionApi.offShelfInstruction(materialStockId.value, targetLocationId)
    message.success('下架指令已生成')
  }
  if(InsType.value === 'onShelf'){
    await InstructionApi.onShelfInstruction(materialStockId.value, targetLocationId)
    message.success('上架指令已生成')
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
