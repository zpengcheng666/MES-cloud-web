<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
      <!-- 搜索工作栏 -->
      <el-form-item label="项目编号" prop="code">
        <el-select v-model="queryParams.projectCode" filterable clearable class="!w-240px" @change="secondeclick">
          <el-option v-for="project in projectList" :key="project.code" :label="project.code" :value="project.code" />
        </el-select>
      </el-form-item>

      <el-form-item label="零件图号" prop="partVersionId">
        <el-select v-model="queryParams.partVersionId" filterable clearable class="!w-240px">
          <el-option v-for="part in partList" :key="part.partVersionId" :label="part.partNumber"
                     :value="part.partVersionId" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-180px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESS_VERSION_STATUS)" :key="dict.value"
                     :label="dict.label" :value="dict.value" />
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="validateAndSearch">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>

    <el-table ref="multipleTable" :data="processPlanDetailList" style="cursor: pointer;height:160px;overflow-y: auto"
              @row-click="partChange">
      <el-table-column align="center" label="工艺规程编号" prop="processCode" />
      <el-table-column align="center" label="加工方案码" prop="processSchemeCode" />
      <el-table-column align="center" label="工艺规程名称" prop="processName" />
      <el-table-column align="center" label="版次" prop="processVersion" />
      <el-table-column align="center" label="关重属性" prop="property">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_PROCESSPLAN_PROPERTY" :value="scope.row.property" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="产品图号" prop="productNumber" />
      <el-table-column align="center" label="负责人" prop="reviewer" />
      <el-table-column :formatter="dateFormatter" align="center" label="编制截止日期" prop="deadline" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_PROCESS_VERSION_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
    </el-table>

  </ContentWrap>
  <el-row :gutter="10">
    <!-- 左侧结构树 -->
    <el-col :span="4" :xs="28">
      <ContentWrap v-show="showResult">
        <div class="tree-style">
          <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false" :props="defaultProps" default-expand-all
                   highlight-current node-key="id" :current-node-key="0" @node-click="handleNodeClick">
            <template #default="{ data }">
              <span class="custom-tree-node">
                <img src="../../../../src/assets/imgs/process.png" class="icon" v-if="data.type === 0" />
                <img src="../../../../src/assets/imgs/procedure.png" class="icon" v-if="data.type === 1" />
                <img src="../../../../src/assets/imgs/step.png" class="icon" v-if="data.type === 2" />
                <span>{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </ContentWrap>
    </el-col>

    <el-col :span="20" :xs="24">
      <el-row :gutter="10">
        <el-col :span="12" :xs="24">
          <ContentWrap v-show="showProcess">
            <el-tabs model-value='1' class="demo-tabs">
              <el-tab-pane label="工艺规程属性" name="1" style="height:600px;overflow-y: auto;overflow-x: hidden">
                <el-form :model="processForm" label-width="110px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="工艺规程编号" prop="processCode">
                        <el-input v-model="processForm.processCode" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="加工方案码" prop="processSchemeCode">
                        <el-input v-model="processForm.processSchemeCode" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="零件图号" prop="partNumber">
                        <el-input v-model="processForm.partNumber" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="零件名称" prop="partName">
                        <el-input v-model="processForm.partNumber" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="材料牌号" prop="materialDesg">
                        <el-input v-model="processForm.materialDesg" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="材料名称" prop="materialName">
                        <el-input v-model="processForm.materialName" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="单件毛料尺寸" prop="singleSize">
                        <el-input v-model="processForm.singleSize" class="!w-130px" disabled />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工艺规程版本" prop="processVersion">
                        <el-input v-model="processForm.processVersion" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="工艺规程名称" prop="processName">
                        <el-input v-model="processForm.processName" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="零件版本" prop="partVersion">
                        <el-input v-model="processForm.partVersion" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="单机数量" prop="singleQuatity">
                        <el-input v-model="processForm.singleQuatity" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="材料类码" prop="materialCode">
                        <el-input v-model="processForm.materialCode" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="材料规格" prop="materialSpecification">
                        <el-input v-model="processForm.materialSpecification" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="成组下料尺寸" prop="groupSize">
                        <el-input v-model="processForm.groupSize" class="!w-130px" disabled />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="工作说明" prop="description">
                    <el-input v-model="processForm.description" class="!w-470px" type="textarea" disabled />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="零件设计属性" name="5" style="height:500px;overflow-y: auto">
                <el-descriptions :column="1" border>
                  <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index + 1">
                    {{ item.attrValue }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="文件目录" name="6" style="height:200px;overflow-y: auto">
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
            </el-tabs>
          </ContentWrap>
          <ContentWrap v-show="showProcedure">
            <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
              <el-tab-pane label="工序属性" name="1" style="height:300px;overflow-y: auto;overflow-x: hidden">
                <el-form ref="formProcedure" :model="procedureForm" label-width="110px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="工序序号" prop="procedureNum">
                        <el-input-number v-model="procedureForm.procedureNum" :min="1" class="!w-130px" disabled />
                      </el-form-item>
                      <el-form-item label="准备工时" prop="preparationTime">
                        <el-input-number v-model="procedureForm.preparationTime" class="!w-130px" disabled />
                      </el-form-item>
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
                          <el-option v-for="na in procedureList"
                                     :key="na.name" :label="na.name" :value="na.name" />
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
              <el-tab-pane label="工装" name="4">
                <el-table :data="materialData" border>
                  <el-table-column prop="materialNumber" label="工装编号" align="center" />
                  <el-table-column prop="materialName" label="工装名称" align="center" />
                  <el-table-column prop="materialSpecification" label="工装规格" align="center" />
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="量具" name="5">
                <el-table :data="measureData" border>
                  <el-table-column prop="materialNumber" label="量具编号" align="center" />
                  <el-table-column prop="materialName" label="量具名称" align="center" />
                  <el-table-column prop="materialSpecification" label="量具规格" align="center" />
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                                 @click="handleDeleteMeasure(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="工序草图" name="6" style="height:500px;overflow-y: auto">
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
            <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
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
                  <el-table-column prop="hiltMark" label="刀柄通用规格" align="center" />\
                  <el-table-column prop="cutternum" label="刀简号" align="center" />
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="执行程序" name="5" style="height:200px;overflow-y: auto">
                <el-table :data="ncData" border>
                  <el-table-column label="程序名称" align="center" prop="ncName" />
                  <el-table-column :width="200" align="center" label="操作">
                    <template #default="scope">
                      <div style="display: flex; align-items: center; justify-content: center;">
                        <el-link :underline="false" style="font-size: 15px;" type="primary" @click="downloadNc(scope.row.ncUrl)">
                          下载
                        </el-link>&nbsp;&nbsp;&nbsp;
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </ContentWrap>
        </el-col>
        <el-col :span="12" :xs="24">
          <ContentWrap v-show="showResult"
                       :style="{ transform: 'scale(${scaleFactor})' }"
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
    </el-col>
  </el-row>
</template>

<script setup lang="ts">

import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import { ProcessPlanApi } from '@/api/pdm/processPlan'
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import * as ProductApi from '@/api/pdm/product';
import { nextTick, provide, ref } from "vue";
import { dateFormatter } from '@/utils/formatTime'
import { onMounted } from 'vue';
import { defaultProps, handleTree } from '@/utils/tree'
import { ElTree } from "element-plus";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { PartMasterApi } from "@/api/pdm/part/partmaster";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);
const { push } = useRouter() // 路由

const isRouter = ref(true);
const reload = () => {
  isRouter.value = false;
  nextTick(() => {
    isRouter.value = true;
  });
};
provide("reload", reload);

/** 产品数据对象 列表 */
defineOptions({ name: 'ProcessPlanDetail' })
const productNumber = ref()
const loading = ref(true) // 列表的加载中
const treeList = ref<Tree[]>([]) // 树形结构
const total = ref(0) // 列表的总页数
const showResult = ref(false)
const showBtn = ref(false)
const showProcess = ref(false) //根节点显隐
const showProcedure = ref(false) //工序显隐
const showStep = ref(false) //工步显隐
const showProcessBtn = ref(false) //根节点显隐
const showProcedureBtn = ref(false) //工序显隐
const isViewCutter = ref(false) // 选择刀具显隐
const showProcessType = ref(''); // 控制工艺类型输入框的显示
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const projectList = ref<any[]>([]) // 项目列表
const partAttrs = ref([]) //零件动态属性
const processPlanDetailList = ref<any[]>([]) // 工艺编制列表
const partList = ref<any[]>([])
const procedureList = ref<any[]>([]); //获取工序列表
const deviceData = ref([]) // 设备列表
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组
const procedureFileData = ref([]) //草图列表
const queryParams = reactive({
  id: '',
  partVersionId: '',
  projectCode: '',
  status: '',
  processVersionId: '',
  procedureId: '',
  rootProductId: '',
  customizedIndex: '',
  processId: '',
  sketchCode: '',
  sketchUrl: ''
})
const processForm = ref({
  processCode: '',
  processSchemeCode: '',
  materialId: '',
  materialDesg: '',
  materialCode: '',
  materialName: '',
  materialSpec: '',
  materialSpecification: '',
  singleSize: '',
  groupSize: '',
  processRouteName: '',
  singleQuantity: '',
  partName: '',
  partVersion: '',
  partNumber: '',
  description: ''

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
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    projectList.value = await ProductApi.getProjectList()
    procedureList.value = await ProcessPlanApi.getProcessRouteList(null)
  } finally {
    loading.value = false
  }
}

/**时间格式*/
const dateFormatter = (row: any, column: any, cellValue: any) => {
  if (cellValue) {
    const date = new Date(cellValue);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  return '';
};


//下拉列表级联
const secondeclick = async (val) => {
  queryParams.projectCode = val;
  partList.value = await ProcessPlanDetailApi.getPartListByProcessPlanDetailId(val);
}

//搜索
const search = async () => {
  processPlanDetailList.value = await ProcessPlanDetailApi.getProcessPlanDetailList(queryParams)
  console.log('列表', processPlanDetailList)
}
/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  if (row.type === 0) {//根节点
    showBtn.value = true;
    showProcessBtn.value = true;
    showProcess.value = true;
    showProcedureBtn.value = false;
    showProcedure.value = false;
    showStep.value = false;

  } else if (row.type === 1) {//工序节点
    queryParams.id = row.id
    queryParams.procedureId = row.id;
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParams.id)
    showBtn.value = true;
    showProcedureBtn.value = true;
    showProcessBtn.value = false;
    showProcedure.value = true;
    showProcess.value = false;
    showStep.value = false;
    queryParamsResource.procedureId = row.id;
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
  } else {//工步节点
    queryParams.id = row.id
    stepForm.value = await ProcessPlanDetailApi.getStep(queryParams.id)
    showBtn.value = false;
    showProcedureBtn.value = false;
    showProcess.value = false;
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
    await getNclist()
    await getDeviceListStep()
    await getMaterialListStep()
    await getCombinationListStep()
  }

}
//获得树
const getTree = async () => {
  treeList.value = []
  const data = await ProcessPlanDetailApi.getProcessPlanDetailTreeList(queryParams)
  console.log('传入的值', data[0]?.processId)
  treeList.value.push(...handleTree(data))
  //默认选中根节点，并触发选中事件
  handleNodeClick(treeList.value[0]);
}
//选中行数据事件
const partChange = async (val) => {
  productNumber.value = val.productNumber
  queryParamsAttr.rootProductId = val.rootProductId
  queryParamsAttr.customizedIndex = val.customizedIndex
  queryParamsAttr.partVersionId = val.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  queryParams.processVersionId = val.processVersionId;
  queryParamsResource.projectCode = queryParams.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.processVersionId
  processForm.value = await ProcessPlanDetailApi.getProcess(val.processVersionId)
  processForm.value.processSchemeCode = val.processSchemeCode;

  tableData.value = await PartAttachmentApi.getdatapackageBomId(queryParams.partVersionId);
  //切换三维图
  showResult.value = true;
  let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
  await getTree()
}

//零件动态属性
const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: '',
  processInstanceId: ''
})
const queryParamsResource = reactive({
  projectCode: '',
  partVersionId: '',
  processVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  procedureId: '',
  stepId: '',
})
// 搜索前的验证
const validateAndSearch = () => {
  if (!queryParams.projectCode) {
    message.error('请选择项目编号');
    return;
  } else if (!queryParams.partVersionId) {
    message.error('请选择零件图号');
  } else {
    search();
  }

};

const emit = defineEmits(['success'])

/** 重置按钮操作 */
const resetQuery = () => {
  nextTick(() => {
    queryFormRef.value.resetFields();
  });
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}
/** 下载数控程序文件 */
const downloadNc = async (ncUrl: string) => {
  window.open(ncUrl, '_blank');
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

const measureData = ref([]); // 量具列表
/** 工序-选中量具后重新加载列表 */
const getMeasureListProcedure = async () => {
  queryParamsResource.resourcesType = '4'
  resourcesData.value = await ProcessPlanDetailApi.getResourceListByProcedure(queryParamsResource);
  materialIds.value = []
  //制造资源列表过滤量具id
  resourcesData.value.forEach((item) => {
    materialIds.value.push(item.resourcesTypeId)
  })
  measureData.value = await ProcessPlanApi.getMaterialListByMaterialIds(materialIds.value)
}

/** 工序-删除量具操作 */
const handleDeleteMeasure = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '4'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceProcedure(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getMaterialListProcedure()
  } catch { }
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

//工序表单
const formProcedure = ref()
//工步表单
const formStep = ref()

//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParams)
}

const ncData = ref([]) //数控程序文件列表
//数控程序列表
const getNclist = async () => {
  queryParams.stepId = stepForm.value.id
  queryParams.procedureId = queryParamsResource.procedureId
  ncData.value = await ProcessPlanDetailApi.getNc(queryParams)
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
  getList()
  document.addEventListener('fullscreenchange', handleFullScreenChange);
})
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>
<style scoped lang="css">
.tree-style {
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
