<template>
  <el-row :gutter="20">
    <!-- 左侧结构树 -->
    <el-col :span="6" :xs="24">
      <ContentWrap>
        <div class="tree-style">
          <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false"
                   :props="defaultProps" default-expand-all highlight-current node-key="id" :current-node-key="0"
                   @node-click="handleNodeClick">
            <template #default="{ data }">
                  <span class="custom-tree-node">
                    <img src="../../../../src/assets/imgs/step.png" class="icon" v-if="data.type === 3" />
                    <img src="../../../../src/assets/imgs/root.png" class="icon" v-if="data.type === 4" />
                    <span>{{ data.name }}</span>
                  </span>
            </template>
          </el-tree>
        </div>
      </ContentWrap>
    </el-col>
    <el-col :span="10" :xs="24" >
      <ContentWrap v-show="showProcedure">
        <el-tabs model-value='1' class="demo-tabs">
          <el-tab-pane label="工序属性" name="1" style="height:300px;overflow-y: auto;overflow-x: hidden">
            <el-form :model="procedureForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工序序号">
                    <el-input  v-model="procedureForm.procedureNum" class="!w-130px" disabled/>
                  </el-form-item>
                  <el-form-item label="准备工时">
                    <el-input  v-model="procedureForm.preparationTime" class="!w-130px" disabled/>
                  </el-form-item>
<!--                  <el-form-item label="是否检验">-->
<!--                    <el-radio-group v-model="procedureForm.isInspect" disabled>-->
<!--                      <el-radio :label="1">是</el-radio>-->
<!--                      <el-radio :label="0">否</el-radio>-->
<!--                    </el-radio-group>-->
<!--                  </el-form-item>-->
                  <el-form-item  label="检验类型" prop="inspectType">
                    <el-select v-model="procedureForm.inspectType" multiple placeholder="请选择" disabled>
                      <el-option v-for="sw in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_INSPECT_TYPE)" :key="sw.value" :label="sw.label" :value="sw.value!" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否外委" prop="isOut">
                    <el-radio-group v-model="procedureForm.isOut" class="!w-200px" disabled>
                      <el-radio v-for="out in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISOUT)" :key="out.value"
                                :label="out.value">
                        {{ out.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工序名称">
                    <el-input  v-model="procedureForm.procedureName" class="!w-130px" disabled/>
                  </el-form-item>
                  <el-form-item label="加工工时">
                    <el-input v-model="procedureForm.processingTime" class="!w-130px" disabled/>
                  </el-form-item>
                  <el-form-item label="关重属性">
                    <el-select
                      v-model="procedureForm.procedureProperty"
                      disabled
                      class="!w-130px"
                    >
                      <el-option
                        v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                        :key="pr.label"
                        :label="pr.label"
                        :value="pr.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工艺类型" class="!w-240px" prop="processType">
                    <el-select v-model="procedureForm.processType" class="!w-200px" disabled>
                      <el-option v-for="tp in getIntDictOptions(DICT_TYPE.PDM_PROCESS_TYPE)" :key="tp.value"
                                 :label="tp.label" :value="tp.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作说明">
                <el-input  v-model="procedureForm.description" class="!w-467px" type="textarea" disabled/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="设备" name="2">
            <el-table :data="deviceData" border>
              <el-table-column prop="code" label="设备编号" align="center" />
              <el-table-column prop="name" label="设备名称" align="center" />
              <el-table-column prop="specification" label="设备规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="工装" name="4">
            <el-table :data="materialData" border>
              <el-table-column prop="materialNumber" label="工装编号" align="center" />
              <el-table-column prop="materialName" label="工装名称" align="center" />
              <el-table-column prop="materialSpecification" label="工装规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="工序草图" name="5" style="height:500px;overflow-y: auto">
            <el-table :data="procedureFileData" border>
              <el-table-column label="草图编号" align="center" prop="sketchCode" />
              <el-table-column label="草图" align="center" prop="sketchUrl">
                <template #default="scope">
                  <el-image :src="scope.row.sketchUrl" :preview-src-list="[scope.row.sketchUrl]"
                            class="w-32px h-32px" :preview-teleported="true" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showStep">
        <el-tabs model-value='1' class="demo-tabs">
          <el-tab-pane label="工步属性" name="1" style="height:450px;overflow-y: auto;overflow-x: hidden">
            <el-form :model="stepForm" label-width="125px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工步序号">
                    <el-input  v-model="stepForm.stepNum" class="!w-130px" disabled/>
                  </el-form-item>
                  <el-form-item label="工步名称">
                    <el-input  v-model="stepForm.stepName" class="!w-130px" disabled/>
                  </el-form-item>
                  <el-form-item label="关重属性">
                    <el-select
                      v-model="stepForm.stepProperty"
                      disabled
                      class="!w-200px"
                    >
                      <el-option
                        v-for="pr in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                        :key="pr.label"
                        :label="pr.label"
                        :value="pr.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工时(min)" prop="processingTime">
                    <el-input v-model="stepForm.processingTime" clearable class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="装炉温度(℃)" prop="furnaceTemperature">
                    <el-input v-model="stepForm.furnaceTemperature" clearable class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="加热温度(℃)" prop="heatTemperature">
                    <el-input v-model="stepForm.heatTemperature" clearable class="!w-130px" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="保温时间(min)" prop="keepHeatTime">
                    <el-input v-model="stepForm.keepHeatTime" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却介质" prop="coolingMedium">
                    <el-input  v-model="stepForm.coolingMedium" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却温度(℃)" prop="coolingTemperature">
                    <el-input v-model="stepForm.coolingTemperature" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却时间(s)" prop="coolingTime">
                    <el-input v-model="stepForm.coolingTime" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="升温时间(min)" prop="heatUpTime">
                    <el-input v-model="stepForm.heatUpTime" clearable class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item v-if="showProcessType === 2" label="槽号" prop="slotNumber">
                    <el-select v-model="stepForm.slotNumber" multiple placeholder="请选择" disabled>
                      <el-option v-for="sq in getIntDictOptions(DICT_TYPE.PDM_STEP_SLOT_NUMBER)" :key="sq.value" :label="sq.label" :value="sq.value!" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作说明">
                <el-input  v-model="stepForm.description" class="!w-467px" type="textarea" disabled/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="设备" name="2">
            <el-table :data="deviceData" border>
              <el-table-column prop="code" label="设备编号" align="center" />
              <el-table-column prop="name" label="设备名称" align="center" />
              <el-table-column prop="specification" label="设备规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="刀具" name="3" v-if="isViewCutter">
            <el-table :data="combinationData" border>
              <el-table-column prop="cutterGroupCode" label="刀组编码" align="center" />
              <el-table-column align="center" label="刀柄类型" prop="taperTypeName">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeName" />
                </template>
              </el-table-column>
              <el-table-column prop="hiltMark" label="刀柄通用规格" align="center" />
              <el-table-column prop="cutternum" label="刀简号" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="执行程序" name="5" style="height:500px;overflow-y: auto">
            <el-table :data="ncData" border>
              <el-table-column label="程序名称" align="center" prop="ncName" />
              <el-table-column :width="100" align="center" label="操作">
                <template #default="scope">
                  <el-link :underline="false" style="font-size: 12px; vertical-align: baseline" type="primary"
                           @click="downloadNc(scope.row.ncUrl)">
                    下载
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
    </el-col>
    <el-col :span="8" :xs="24">
      <ContentWrap>
        <div style="width:600px;height:680px">三维图</div>
      </ContentWrap>
    </el-col>
  </el-row>
</template>
<style scoped lang="css">
.tree-style  {
  min-height: 730px;
}
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  padding-top: 5px;
  padding-right: 3px;
}
</style>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import {ref} from "vue";
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import { ProcessPlanApi } from '@/api/pdm/processPlan'
import { defaultProps, handleTree } from '@/utils/tree'
import {ElTree} from "element-plus";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

defineOptions({ name: 'PDMProcessPlanDetail' })

const { query } = useRoute() // 查询参数
// 业务主键id(即工艺规程版本id)
const props = defineProps({
  id: propTypes.number.def(undefined)
})
const queryId = query.id as unknown as number // 从URL传递过来的processInstanceId

const treeList = ref<Tree[]>([]) // 树形结构
const showProcedure = ref(false) //工序显隐
const showStep = ref(false) //工步显隐
const isViewCutter = ref(false) // 选择刀具显隐
const showProcessType = ref(''); // 控制工艺类型输入框的显示
const deviceData = ref([]) // 设备列表
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组
const procedureFileData = ref([]) //草图列表
const ncData = ref([]) //数控程序文件列表

const queryParams = reactive({
  processVersionId:'',
  id:'',
  procedureId:'',
  partVersionId: '',
  projectCode: '',
  taskId: '',
})
const queryParamsResource = reactive({
  projectCode: '',
  partVersionId: '',
  processVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  procedureId: '',
  stepId: '',
  inspectType: []
})

const procedureForm = ref({
  procedureNum:'',
  procedureName:'',
  isInspect:'',
  procedureProperty:'',
  preparationTime:'',
  processingTime:'',
  description:'',
  isOut: '',
  processType: '',
  inspectType: []
})
const stepForm = ref({
  stepNum: '',
  stepName: '',
  stepProperty: '',
  description: '',
  processType: '',
  slotNumber: [],
  furnaceTemperature: '',
  heatTemperature: '',
  heatUpTime: '',
  keepHeatTime: '',
  coolingMedium: '',
  coolingTemperature: '',
  coolingTime: '',
  processingTime: '',
})
/** 获得数据 */
const getInfo = async () => {
  queryParams.taskId = props.id || queryId

  treeList.value = []
  const data = await ProcessPlanDetailApi.getProjPartBomTreeByTaskId(queryParams)
  treeList.value.push(...handleTree(data))
  //默认选中根节点，并触发选中事件
  handleNodeClick(treeList.value[0]);
}

/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  queryParamsResource.partVersionId = row.partVersionId
  queryParamsResource.processVersionId = row.processVersionId
  if(row.type === 3) {//工序节点
    queryParams.id=row.id
    queryParams.procedureId = row.id;
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParams.id)
    showProcedure.value = true;
    showStep.value= false;
    queryParamsResource.procedureId = row.id;
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getProcedurelist()
  } else {//工步节点
    queryParams.id=row.id
    stepForm.value=await ProcessPlanDetailApi.getStep(queryParams.id)
    showProcedure.value = false;
    showStep.value = true;
    showProcessType.value = row.processType
    if(row.processType === 0) {//机加工艺
      isViewCutter.value = true;
    } else {
      isViewCutter.value = false;
    }
    queryParamsResource.procedureId = row.parentId;
    queryParamsResource.stepId = row.id;
    await getDeviceListStep()
    await getMaterialListStep()
    await getCombinationListStep()
    await getNclist()
  }
}

/** 工序-选中设备后重新加载列表 */
const getDeviceListProcedure = async () => {
  queryParamsResource.resourcesType = '1'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
  deviceIds.value = [];
  //制造资源列表过滤设备id
  resourcesData.value.forEach((item) => {
    deviceIds.value.push(item.resourcesTypeId)
  })
  deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds.value)
}
/** 工序-选中工装后重新加载列表 */
const getMaterialListProcedure = async () => {
  queryParamsResource.resourcesType = '3'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
  materialIds.value = []
  //制造资源列表过滤工装id
  resourcesData.value.forEach((item) => {
    materialIds.value.push(item.resourcesTypeId)
  })
  materialData.value = await ProcessPlanApi.getMaterialListByMaterialIds(materialIds.value)
}

/** 工步-选中设备后重新加载列表 */
const getDeviceListStep = async () => {
  queryParamsResource.resourcesType = '1'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByStep(queryParamsResource);
  deviceIds.value = [];
  //制造资源列表过滤设备id
  resourcesData.value.forEach((item) => {
    deviceIds.value.push(item.resourcesTypeId)
  })
  deviceData.value = await ProcessPlanApi.getDeviceListByDeviceIds(deviceIds.value)
}
/** 工步-选中工装后重新加载列表 */
const getMaterialListStep = async () => {
  queryParamsResource.resourcesType = '3'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByStep(queryParamsResource);
  materialIds.value = []
  //制造资源列表过滤工装id
  resourcesData.value.forEach((item) => {
    materialIds.value.push(item.resourcesTypeId)
  })
  materialData.value = await ProcessPlanApi.getMaterialListByMaterialIds(materialIds.value)
}
/** 工步-选中刀具后重新加载列表 */
const getCombinationListStep = async () => {
  queryParamsResource.resourcesType = '2'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByStep(queryParamsResource);
  combinationIds.value = []
  //制造资源列表过滤刀组id
  resourcesData.value.forEach((item) => {
    combinationIds.value.push(item.resourcesTypeId)
  })
  combinationData.value = await ProcessPlanApi.getCombinationListByCombinationIds(combinationIds.value)
  //处理刀具刀简号
  combinationData.value.forEach((item) => {
    resourcesData.value.forEach((resource) => {
      if (resource.resourcesTypeId == item.id) {
        item.cutternum = resource.cutternum
      }
    })
  })
}

//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParamsResource)
}

//数控程序列表
const getNclist = async () => {
  ncData.value = await ProcessPlanDetailApi.getNc(queryParamsResource)
}

/** 下载数控程序文件 */
const downloadNc = async (ncUrl: string) => {
  window.open(ncUrl, '_blank');
}

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
