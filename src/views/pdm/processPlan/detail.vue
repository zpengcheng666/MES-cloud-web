<template>
  <ContentWrap>
    <el-descriptions :column="4" border>
      <el-descriptions-item label="项目编号">
        {{ detailData.projectCode }}
      </el-descriptions-item>
      <el-descriptions-item label="零件图号">
        {{ detailData.partNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="零件名称">
        {{ detailData.partName }}
      </el-descriptions-item>
      <el-descriptions-item label="版次">
        {{ detailData.partVersion }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <el-row :gutter="20">
    <el-col :span="6" :xs="24">
      <ContentWrap>
        <div class="head-container" style="width:600px;height:680px">
          <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false" :props="defaultProps"
                   default-expand-all highlight-current node-key="id" :current-node-key="0" @node-click="handleNodeClick">
            <template #default="{ data }">
                  <span class="custom-tree-node">
                    <img src="../../../../src/assets/imgs/root.png" class="icon" v-if="data.type === 0" />
                    <img src="../../../../src/assets/imgs/process.png" class="icon" v-if="data.type === 1" />
                    <img src="../../../../src/assets/imgs/procedure.png" class="icon" v-if="data.type === 2" />
                    <img src="../../../../src/assets/imgs/step.png" class="icon" v-if="data.type === 3" />
                    <span>{{ data.name }}</span>
                  </span>
            </template>
          </el-tree>
        </div>
      </ContentWrap>
    </el-col>
    <el-col :span="10" :xs="24">
      <ContentWrap v-show="showPartBtn">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="零件设计属性" name="1" style="height:625px;overflow-y: auto">
            <el-descriptions :column="1" border>
              <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index + 1">
                {{ item.attrValue }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="文件目录" name="2">
            <el-table :data="tableData" border>
              <el-table-column align="center" label="序号" type="index" width="80px" />
              <el-table-column prop="fileName" label="文件名称" align="center" />
              <el-table-column prop="fileType" label="文件类型" align="center" />
              <el-table-column label="操作" align="center">
                <template #default="scope">
                  <el-link :underline="false" style="font-size: 12px; vertical-align: baseline" type="primary"
                           @click="downloadFile(scope.row.vaultUrl)">
                    下载
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="单件定额管理" name="3">
            <el-form ref="formRefQuota" :model="formData" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="材料牌号" prop="materialDesg">
                    <el-input v-model="formData.materialDesg" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="材料状态" prop="materialCondition">
                    <el-input v-model="formData.materialCondition" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="长度(mm)" prop="length">
                    <el-input-number v-model="formData.length" disabled controls-position="right"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="宽度(mm)" prop="width">
                    <el-input-number v-model="formData.width" disabled controls-position="right"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="厚度(mm)" prop="height">
                    <el-input-number v-model="formData.height" disabled controls-position="right"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工时定额(min)" prop="timeQuota">
                    <el-input-number v-model="formData.timeQuota" disabled controls-position="right"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showProcessBtn">
        <el-tabs v-model="activeNameProcess" class="demo-tabs">
          <el-tab-pane label="工艺方案" name="1">
            <el-form ref="formRefPlan" :model="formProcessPlan" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="工艺规程名称" prop="processName">
                    <el-input v-model="formProcessPlan.processName" placeholder="请输入工艺规程名称" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="版次" prop="processVersion">
                    <el-input v-model="formProcessPlan.processVersion" placeholder="请输入版次" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="关重属性" prop="property">
                    <el-select v-model="formProcessPlan.property" clearable class="!w-400px" disabled>
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY) "
                                 :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单机数量" prop="singleQuatity">
                    <el-input v-model="formProcessPlan.singleQuatity" pleaceholder="请输入单机数量" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="材料牌号" prop="materialDesg">
                    <el-input v-model="formProcessPlan.materialDesg" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="材料类码" prop="materialCode">
                    <el-input v-model="formProcessPlan.materialCode" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="材料名称" prop="materialName">
                    <el-input v-model="formProcessPlan.materialName" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="材料规格" prop="materialSpecification">
                    <el-input v-model="formProcessPlan.materialSpecification" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="单件毛料尺寸" prop="singleSize">
                    <el-input v-model="formProcessPlan.singleSize" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="成组加工尺寸" prop="groupSize">
                    <el-input v-model="formProcessPlan.groupSize" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="工作说明" prop="description">
                    <el-input type="textarea" v-model="formProcessPlan.description" pleaceholder="请说明" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showProcedureBtn">
        <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
          <el-tab-pane label="工序属性" name="1" style="height:320px;overflow-y: auto;overflow-x: hidden">
            <el-form ref="formProcedure" :model="procedureForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工序序号" prop="procedureNum">
                    <el-input-number v-model="procedureForm.procedureNum" :min="1" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item label="准备工时" prop="preparationTime">
                    <el-input-number v-model="procedureForm.preparationTime" class="!w-130px" disabled />
                  </el-form-item>
<!--                  <el-form-item label="是否检验" prop="isInspect">-->
<!--                    <el-radio-group v-model="procedureForm.isInspect" class="!w-200px" disabled>-->
<!--                      <el-radio v-for="is in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISINSPECT)" :key="is.value"-->
<!--                                :label="is.value">-->
<!--                        {{ is.label }}-->
<!--                      </el-radio>-->
<!--                    </el-radio-group>-->
<!--                  </el-form-item>-->
                  <el-form-item  label="检验类型" prop="inspectType">
                    <el-select v-model="procedureForm.inspectType" multiple placeholder="请选择">
                      <el-option v-for="sq in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_INSPECT_TYPE)" :key="sq.value" :label="sq.label" :value="sq.value!" />
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
                  <el-form-item label="工序名称" prop="procedureName">
                    <el-select v-model="procedureForm.procedureName" filterable clearable class="!w-130px" disabled>
                      <el-option v-for="na in procedureList" :key="na.name" :label="na.name" :value="na.name" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="加工工时" prop="processingTime">
                    <el-input-number v-model="procedureForm.processingTime" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item label="关重属性" class="!w-240px" prop="procedureProperty">
                    <el-select v-model="procedureForm.procedureProperty" class="!w-200px" disabled>
                      <el-option v-for="pre in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                                 :key="pre.value" :label="pre.label" :value="pre.value" />
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
                <el-input v-model="procedureForm.description" class="!w-467px" type="textarea" disabled />
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
          <el-tab-pane label="工装" name="3">
            <el-table :data="materialData" border>
              <el-table-column prop="materialNumber" label="工装编号" align="center" />
              <el-table-column prop="materialName" label="工装名称" align="center" />
              <el-table-column prop="materialSpecification" label="工装规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="量具" name="4">
            <el-table :data="measureData" border>
              <el-table-column prop="materialNumber" label="量具编号" align="center" />
              <el-table-column prop="materialName" label="量具名称" align="center" />
              <el-table-column prop="materialSpecification" label="量具规格" align="center" />
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
    </el-col>
    <el-col :span="8" :xs="24">
      <ContentWrap :style="{ transform: 'scale(${scaleFactor})' }"
                   :class="{ 'full-screen': isImageFullScreen }">
        <div style="cursor: pointer;position: absolute;top: 5px;right: 17px;">
          <img src="../../../../src/assets/imgs/fullscreen.png"
               style="width: 20px;height: 20px"
               @click="showFullScreen"
               :style="{ transform: isImageFullScreen ? 'scale(2)' : 'scale(1)' }"/>
        </div>
        <threejsModel :modelUrl="modelUrl" :processInfo="processInfo"/>
      </ContentWrap>
    </el-col>
  </el-row>
</template>
<style scoped lang="css">
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
import {ProcessPlanApi} from "@/api/pdm/processPlan";
import { defaultProps, handleTree } from '@/utils/tree'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {ElTree} from "element-plus";
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import { PartMasterApi } from "@/api/pdm/part/partmaster";
import {ProcessPlanDetailApi} from "@/api/pdm/processPlanDetail";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted, ref} from "vue";

defineOptions({ name: 'PDMProcessPlanNewDetail' })

const { query } = useRoute() // 查询参数

// 业务主键id(即工艺规程版本id)
const props = defineProps({
  id: propTypes.number.def(undefined)
})

const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const detailData = ref<any>({}) // 详情数据
const treeList = ref<Tree[]>([]) // 树形结构
const showPartBtn = ref(false) // 零件节点按钮显隐
const showProcessBtn = ref(false) // 工艺方案节点按钮显隐
const showProcedureBtn = ref(false) // 工序节点显隐
const activeName = ref(['1'])
const activeNameProcess = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const deviceData = ref([]) // 设备列表
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const measureData = ref([]) // 量具列表
const materialIds = ref([]) // 零件关联的工装id数组
const measureIds = ref([]) // 零件关联的量具id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组
const procedureFileData = ref([]) //草图列表

const formRefPlan = ref()
const productNumber = ref()

const queryId = query.id as unknown as number // 从URL传递过来的processInstanceId

const queryParams = reactive({
  projectCode: '',
  partVersionId: ''
})

const queryParamsResult = reactive({
  projectCode: '',
  partVersionId: '',
  status: '2'
})

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: ''
})

const queryParamsResource = reactive({
  projectCode: '',
  partVersionId: '',
  processVersionId: '',
  resourcesType: '1'
})

const queryParamsProcess = reactive({
  processCode: '',
  partVersionId: '',
  projectCode: '',
  projPartBomId: '',
  processVersionId: '',
  source: ''
})

const formRefQuota = ref()
const formData = ref({
  id: undefined,
  partVersionId: undefined,
  length: undefined,
  width: undefined,
  height: undefined,
  materialDesg: undefined,
  materialCondition: undefined,
  timeQuota: undefined,
})

const formProcessPlan = ref({
  id: undefined,
  name: undefined,
  leftName: undefined,
  processRouteName: undefined,
  partVersionId: undefined,
  processName: undefined,
  processVersion: undefined,
  property: undefined,
  description: undefined,
  processRegulations: undefined,
  processRoute: undefined,
  processRouteList: undefined,
  processingTime: undefined,
  singleQuatity: undefined,
  singleSize: undefined,
  groupSize: undefined,
  processRouteDetailDOList: undefined,
})

const procedureForm = ref({
  id:'',
  procedureNum: '',
  procedureName: '',
  isInspect: '',
  procedureProperty: '',
  preparationTime: '',
  processingTime: '',
  description: '',
  isOut: '',
  processType: '',
  inspectType:[]
})

/** 重置表单 */
const resetProcessForm = () => {
  formProcessPlan.value = {
    id: undefined,
    name: undefined,
    leftName: undefined,
    processRouteName: undefined,
    partVersionId: undefined,
    processName: undefined,
    processVersion: undefined,
    property: undefined,
    description: undefined,
    processRegulations: undefined,
    processRoute: undefined,
    processRouteList: undefined,
    processingTime: undefined,
    singleQuatity: undefined,
    singleSize: undefined,
    groupSize: undefined,
    processRouteDetailDOList: undefined,
  }
  formRefPlan.value?.resetFields()
}

/** 获得数据 */
const getInfo = async () => {
  detailData.value = await ProcessPlanApi.getPartDetailByTaskId(props.id || queryId)
  queryParams.projectCode = detailData.value.projectCode;
  queryParams.partVersionId = detailData.value.partVersionId;
  await getTree()
}

/** 获得结构树 */
const getTree = async () => {
  treeList.value = []
  const data = await ProcessPlanApi.getProjPartBomTreeByPartVersionId(queryParams)
  treeList.value.push(...handleTree(data))
  //默认选中根节点，并触发选中事件
  handleNodeClick(treeList.value[0]);
}

/** 点击零件节点 */
const partChange = async (val) => {
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  queryParamsProcess.partVersionId = val.partVersionId
  queryParamsProcess.processCode = val.partNumber
  queryParamsProcess.projectCode = queryParams.projectCode
  queryParamsProcess.projPartBomId = val.id
  productNumber.value = val.productNumber
  activeName.value = '1'
  queryParamsAttr.rootProductId = val.rootProductId
  queryParamsAttr.customizedIndex = val.customizedIndex
  queryParamsAttr.partVersionId = val.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  tableData.value = await PartAttachmentApi.getdatapackageBomId(val.partVersionId);

  //切换三维图
  let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
  await getQuotaPerPart()
}
/** 点击工艺方案节点 */
const processChange = async (val) => {
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  activeNameProcess.value = '1'
  queryParamsResource.projectCode = queryParams.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.id
}

/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  if (row.type === 1) {//零件节点
    showPartBtn.value = true;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    //获取零件信息详情
    const val = await ProcessPlanApi.getPartDetailByTaskId(row.taskId)
    await partChange(val)
  } else if (row.type === 2) {//工艺方案节点
    showPartBtn.value = false;
    showProcessBtn.value = true;
    showProcedureBtn.value = false;
    resetProcessForm()
    formProcessPlan.value = await ProcessPlanApi.getProcess(row.id)
    await processChange(row)
  } else if (row.type === 3) {//工序节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = true;
    queryParamsResource.procedureId = row.id;
    queryParamsResource.id = row.id
    queryParamsResource.processVersionId = row.parentId
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParamsResource.id)
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
    await getCombinationListProcedure()
  }
}

/** 单件定额管理 */
const getQuotaPerPart = async () => {
  formData.value = await ProcessPlanApi.getQuotaPerPartInfo(queryParamsResult)
  if (!formData.value) {
    resetForm()
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    partVersionId: undefined,
    length: undefined,
    width: undefined,
    height: undefined,
    materialDesg: undefined,
    materialCondition: undefined,
    timeQuota: undefined,
  }
  formRef.value?.resetFields()
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParamsResource)
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

/** 工序-选中量具后重新加载列表 */
const getMeasureListProcedure = async () => {
  queryParamsResource.resourcesType = '4'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
  measureIds.value = []
  //制造资源列表过滤量具id
  resourcesData.value.forEach((item) => {
    measureIds.value.push(item.resourcesTypeId)
  })
  measureData.value = await ProcessPlanApi.getMaterialListByMaterialIds(measureIds.value)
}

/** 工序-选中刀具后重新加载列表 */
const getCombinationListProcedure = async () => {
  queryParamsResource.resourcesType = '2'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
  combinationIds.value = []
  //制造资源列表过滤刀组id
  resourcesData.value.forEach((item) => {
    combinationIds.value.push(item.resourcesTypeId)
  })
  combinationData.value = await ProcessPlanApi.getCombinationListByCombinationIds(combinationIds.value)
}

/** 三维图最大化 */
const showFullScreen = () => {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    el.requestFullscreen().catch((err) => console.error(err));
  } else {
    document.exitFullscreen();
  }
  isImageFullScreen.value = !isImageFullScreen.value;
}

const handleFullScreenChange = () =>{
  isImageFullScreen.value = document.fullscreenElement !== null;
}

/** 初始化 **/
onMounted(() => {
  getInfo()
  document.addEventListener('fullscreenchange', handleFullScreenChange);
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>
<!--三维图-->
<style scoped>
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: auto;
}
</style>
