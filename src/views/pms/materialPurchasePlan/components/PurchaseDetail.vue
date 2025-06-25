<template>
  <!-- 列表 -->
  <ContentWrap title="物料采购计划">
    <el-table height="30vh" :data="detailData" :stripe="true" :show-overflow-tooltip="true" @row-click="purchaseClick">
      <el-table-column label="项目名" align="center" prop="projectName" />
      <el-table-column label="图号" align="center" prop="partNumber" />
      <el-table-column label="计划数量" align="center" prop="quantity" />
      <el-table-column label="所需物料" align="center" prop="materialName" />
      <el-table-column label="库存" align="center" prop="inventory" />
      <el-table-column label="退货中" align="center" prop="materialRerurnAmount" />
      <el-table-column label="可用库存" align="center" prop="inventoryAvailable" />
      <el-table-column label="使用库存" align="center" prop="useInventory" />
      <el-table-column label="需采购" align="center" prop="needPurchase" />
      <!--<el-table-column label="使用库存" align="center" min-width="150px">-->
        <!--<template #default="{row}">-->
          <!--<el-input-number v-model="row.useInventory" placeholder="请输入数量" :min="0" @change="updateUseInventory(row)"/>-->
          <!--&lt;!&ndash;<el-input-number v-model="row.useInventory" placeholder="请输入数量" @change="updateUseInventory(row)"/>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" fixed="right" label="操作" min-width="80">
        <template #default="{ row }">
          <el-button link type="primary" @click.stop="openForm(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PurchaseDetailForm ref="purchaseDetailFormRef" @success="updateUseInventory" @saveDevice="saveDevice"/>
  </ContentWrap>
  <ContentWrap style="margin-top: 20px">
      <el-tabs v-model="activeNamePartDetail" model-value='1' >
        <el-tab-pane label="设备" name="1">
          <el-table :data="deviceData" border>
            <el-table-column prop="code" label="设备编号" align="center" />
            <el-table-column prop="name" label="设备名称" align="center" />
            <el-table-column prop="specification" label="设备规格" align="center" />
            <el-table-column prop="procedureName" label="工序名" align="center" />
            <el-table-column prop="useInventory" label="使用库存" align="center" />
            <el-table-column align="center" fixed="right" label="操作" min-width="80">
              <template #default="{ row }">
                <el-button link type="primary" @click.stop="openDeviceForm(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--<PurchaseDetailDeviceForm ref="purchaseDetailDeviceFormRef" />-->
        </el-tab-pane>
        <el-tab-pane label="刀具" name="2">
          <el-table :data="combinationData" border>
            <el-table-column align="center" label="刀简号" prop="cutternum" />
            <el-table-column align="center" label="接口型式" prop="taperTypeName" />
            <el-table-column align="center" label="刀柄牌号" prop="hiltMark" />
            <el-table-column align="center" label="刀具牌号" prop="cutterMark" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="工装" name="3">
          <el-table :data="materialData" border>
            <el-table-column prop="materialNumber" label="工装编号" align="center" />
            <el-table-column prop="materialName" label="工装名称" align="center" />
            <el-table-column prop="materialSpecification" label="工装规格" align="center" />
            <el-table-column prop="procedureName" label="工序名" align="center" />
            <el-table-column prop="useInventory" label="使用库存" align="center" />
            <el-table-column align="center" fixed="right" label="操作" min-width="80">
              <template #default="{ row }">
                <el-button link type="primary" @click.stop="openMaterialForm(row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<PurchaseDetailMaterialForm ref="purchaseDetailMaterialForm" />-->
        </el-tab-pane>
      </el-tabs>
    <PurchaseDetailDeviceForm ref="purchaseDetailDeviceFormRef" />
    <PurchaseDetailMaterialForm ref="purchaseDetailMaterialFormRef" />
    </ContentWrap>
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter,dateFormatter2,formatDate } from '@/utils/formatTime'
import { ApprovalApi } from '@/api/pms/pmsapproval'
import { erpPriceInputFormatter, erpPriceMultiply } from '@/utils'
import { MaterialStockApi } from '@/api/wms/materialstock'
import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
import  PurchaseDetailForm from './PurchaseDetailForm.vue'
import  PurchaseDetailDeviceForm from './PurchaseDetailDeviceForm.vue'
import  PurchaseDetailMaterialForm from './PurchaseDetailMaterialForm.vue'

import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import { ProcessPlanApi } from '@/api/pdm/processPlan'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const detailData = ref([])
const props = defineProps<{
  projectId: undefined // 项目id（主表的关联字段）
}>()
const purchaseDetailFormRef = ref()
const purchaseDetailDeviceFormRef = ref()
const purchaseDetailMaterialFormRef = ref()
const activeNamePartDetail = ref('1')

const deviceData = ref<any[]>([]);
const combinationData = ref<any[]>([]);
const materialData = ref<any[]>([]);

const queryParamsResource = reactive({
  projectCode: '',
  partVersionId: '',
  processVersionId: '',
  resourcesType: undefined,
  resourcesTypeId: '',
  procedureId: '',
  stepId: '',
  projectPlanId:'',

})

const emit = defineEmits(['refresh']) // 定义 success 事件，用于操作成功后的回调
const setList =async (rows)=>{
  rows.forEach(item=>{
    //这两部计算出当前物料库存
    if(item.inventoryAvailable===null||item.inventoryAvailable===undefined){
      item.inventoryAvailable = 0
    }
    item.needPurchase = item.quantity - item.useInventory

  })
  // debugger
  detailData.value = rows;
}

const updateUseInventory = ()=>{
  //emit提醒父组件,刷新
  emit('refresh')
}

const openForm = (row)=>{
  purchaseDetailFormRef.value.open(row)
}
const openDeviceForm = (row)=>{
  purchaseDetailDeviceFormRef.value.open(row)
}
const openMaterialForm = (row)=>{
  purchaseDetailMaterialFormRef.value.open(row)
}
const purchaseClick = async (row)=>{
  //根据planItemId查询,设备,刀具,工装,
  const data =await MaterialPurchaseApi.getPurchaseResource(row.id)
  console.log(data);
  console.log(data.deviceDOList);
  deviceData.value = data.deviceDOList;
  materialData.value = data.materialDOList;
  console.log(row);
}
//物料采购计划单击事件
const purchaseClick2 =async (row)=>{
  if(row.processScheme===undefined||row.processScheme===null){
    message.warning("未选择工艺方案")
    return
  }
  const params = {
    projectCode:row.projectCode,
    partNumber:row.partNumber,
    viewSelf:false,
    processScheme:row.processScheme,
    projectPlanId:row.projectPlanId,
    projectPlanItemId:row.id

  }


  //工艺编程下面那个节点，大概是工序
  const data = await MaterialPurchaseApi.getProcessDetailDesign(params);
  //总共需要的参数partVersionId,processVersionId,resourcesType,procedureId,id
  queryParamsResource.processVersionId = row.processScheme;
  const deviceIds= [];
  const combinationIds= [];
  const materialIds= [];
  for(const item of data){
    queryParamsResource.procedureId = item.id;
    queryParamsResource.id = item.id
    queryParamsResource.partVersionId = item.partVersionId
    // queryParamsResource.resourcesType = '1';
    // const device =await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
    // deviceIds.push(...device.map(item=>item.resourcesTypeId));
    // queryParamsResource.resourcesType = '2';
    // const combination =await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
    // combinationIds.push(...combination.map(item=>item.resourcesTypeId));
    // queryParamsResource.resourcesType = '3';
    // const material =await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
    // materialIds.push(...material.map(item=>item.resourcesTypeId));
    queryParamsResource.resourcesType = undefined;
    const list = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
    list.forEach((item)=>{
      if(item.resourcesType===1){
        deviceIds.push(item.resourcesTypeId)
      }
      if(item.resourcesType===2){
        combinationIds.push(item.resourcesTypeId)
      }
      if(item.resourcesType===3){
        materialIds.push(item.resourcesTypeId)
      }
    })
    // console.log(device)
    // console.log(combination)
    // console.log(material)
  }
  deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds);
  combinationData.value = await ProcessPlanApi.getCombinationListByCombinationIds(combinationIds);
  materialData.value = await ProcessPlanApi.getMaterialListByMaterialIds(materialIds);
  // deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds);
  // console.log(deviceIds)
  // console.log(combinationIds)
  // console.log(materialIds)
  // console.log(row)
}
/**
 * 选择工艺并提交后,这边就应该把设备,刀具,工装保存好(这个方法已经不适用了,现在直接用评审的数据，而不是看每道工序下用的设备，刀具等)
 * @param row
 */
const saveDevice = async (row)=>{
  debugger
  const params = {
    projectCode:row.projectCode,
    partNumber:row.partNumber,
    viewSelf:false,
    processScheme:row.processScheme,
    projectPlanId:row.projectPlanId,
    projectPlanItemId:row.id
  }
  //工艺编程下面那个节点，大概是工序
  const data = await MaterialPurchaseApi.getProcessDetailDesign(params);
  //总共需要的参数partVersionId,processVersionId,resourcesType,procedureId,id
  queryParamsResource.processVersionId = row.processScheme;
  const deviceIds= [];
  const combinationIds= [];
  const materialIds= [];
  for(const item of data){
    queryParamsResource.procedureId = item.id;
    queryParamsResource.id = item.id
    queryParamsResource.partVersionId = item.partVersionId
    queryParamsResource.resourcesType = undefined;
    const list = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
    list.forEach((item)=>{
      if(item.resourcesType===1){
        deviceIds.push(item.resourcesTypeId)
      }
      if(item.resourcesType===2){
        combinationIds.push(item.resourcesTypeId)
      }
      if(item.resourcesType===3){
        materialIds.push(item.resourcesTypeId)
      }
    })
  }
  const deviceFormData = []
  const combinationFormData = []
  const materialFormData = []
  deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds);
  combinationData.value = await ProcessPlanApi.getCombinationListByCombinationIds(combinationIds);
  materialData.value = await ProcessPlanApi.getMaterialListByMaterialIds(materialIds);

}

defineExpose({ setList })
</script>

