<template>
  <ContentWrap>
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
      <el-form-item label="项目号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" class="!w-160px" clearable placeholder="请输入项目号"/>
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-input v-model="queryParams.partNumber" class="!w-160px" clearable placeholder="请输入零件图号" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-160px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_STATUS)" :key="dict.value"
                     :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="viewSelf">
        <el-checkbox v-model="queryParams.viewSelf" label="只看我的" />
      </el-form-item>
      <el-form-item>
        <el-button @click="getTree">
          <Icon class="mr-5px" icon="ep:search" />搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-row :gutter="20">
    <el-col :span="7" :xs="24">
      <ContentWrap>
        <div class="head-container" style="height:680px;overflow-y:auto">
          <span style="font-size:14px;margin-left:10px">展开/折叠：</span>
          <el-switch v-model="menuExpand"
                     @change="updateTreeExpansion" />
          <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false" :props="defaultProps"
                   highlight-current node-key="id" :current-node-key="0" @node-click="handleNodeClick"
                   :default-expanded-keys="expandedKeys">
            <template #default="{ data }">
                  <span class="custom-tree-node">
                    <img src="../../../../src/assets/imgs/root.png" class="icon" v-if="data.type === 0" />
                    <img src="../../../../src/assets/imgs/process.png" class="icon" v-if="data.type === 1" />
                    <img src="../../../../src/assets/imgs/procedure.png" class="icon" v-if="data.type === 2" />
                    <img src="../../../../src/assets/imgs/step.png" class="icon" v-if="data.type === 3" />
                    <img src="../../../../src/assets/imgs/root.png" class="icon" v-if="data.type === 4" />
                    <span>{{ data.name }}</span>
                  </span>
            </template>
          </el-tree>
        </div>
      </ContentWrap>
    </el-col>
    <el-col :span="9" :xs="24">
      <ContentWrap v-show="showPartBtn">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="零部件属性" name="1" style="height:625px;overflow-y: auto">
            <div class="node-name">基本属性</div>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="项目号" min-width="80">
                {{ detailData.projectCode }}
              </el-descriptions-item>
              <el-descriptions-item label="零件图号">
                {{ detailData.partNumber }}
              </el-descriptions-item>
              <el-descriptions-item label="零件名称">
                {{ detailData.partName }}
              </el-descriptions-item>
              <el-descriptions-item label="加工状态">
                {{ detailData.processCondition }}
              </el-descriptions-item>
              <el-descriptions-item label="负责人">
                {{ detailData.reviewer }}
              </el-descriptions-item>
            </el-descriptions>
            <div class="node-name">零件设计属性</div>
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
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showProcessBtn">
        <el-tabs v-model="activeNameProcess" class="demo-tabs">
          <el-tab-pane label="工艺方案" name="1">
            <el-form ref="formRefPlan" :model="formProcessPlan" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="工艺规程编号" prop="processCode">
                    <el-input v-model="formProcessPlan.processCode" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工艺规程名称" prop="processName">
                    <el-input v-model="formProcessPlan.processName" placeholder="请输入工艺规程名称" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="加工方案码" prop="processSchemeCode">
                    <el-input v-model="formProcessPlan.processSchemeCode" disabled />
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
                  <el-form-item label="材料编号" prop="materialNumber">
                    <el-input v-model="formProcessPlan.materialNumber" disabled />
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
                  <el-form-item label="毛坯外形尺寸" prop="singleSize">
                    <el-input v-model="formProcessPlan.singleSize" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="每毛坯件数" prop="groupSize">
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
          <el-tab-pane label="工序属性" name="1">
            <el-form ref="formProcedure" :model="procedureForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工序序号" prop="procedureNum">
                    <el-input v-model="procedureForm.procedureNum" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item label="准备工时" prop="preparationTime">
                    <el-input-number v-model="procedureForm.preparationTime" class="!w-130px" disabled />
                  </el-form-item>
                  <el-form-item label="是否专检" prop="isInspect">
                    <el-radio-group v-model="procedureForm.isInspect" class="!w-200px" disabled>
                      <el-radio v-for="is in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISINSPECT)" :key="is.value"
                                :label="is.value">
                        {{ is.label }}
                      </el-radio>
                    </el-radio-group>
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
                      <el-option v-for="na in processRouteList" :key="na.name" :label="na.name" :value="na.name" />
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
                </el-col>
              </el-row>
              <el-form-item label="工作说明">
                <div v-html="procedureForm.descriptionPreview" style="margin-top: -14px"></div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="制造资源" name="2">
            <div style="margin-bottom: 10px">
              <el-table :data="deviceData" border>
                <el-table-column prop="code" label="设备编号" align="center" />
                <el-table-column prop="name" label="设备名称" align="center" />
                <el-table-column prop="specification" label="设备规格" align="center" />
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-table :data="materialData" border>
                <el-table-column prop="materialNumber" label="工装编号" align="center" />
                <el-table-column prop="materialName" label="工装名称" align="center" />
                <el-table-column prop="materialSpecification" label="工装规格" align="center" />
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-table :data="measureData" border>
                <el-table-column prop="materialNumber" label="量具编号" align="center" />
                <el-table-column prop="materialName" label="量具名称" align="center" />
                <el-table-column prop="materialSpecification" label="量具规格" align="center" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工序草图" name="3">
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
          <el-tab-pane label="检测项" name="4">
            <el-table :data="ProcedureSchemaItem" border>
              <el-table-column label="序号" type="index" align="center" width="60"/>
              <el-table-column label="检测项目" align="center" width="110">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.inspectionItemName`" class="mb-0px!">
                    <el-input v-model="row.inspectionItemName" placeholder="请输入检测项目" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="参考值判断 " align="center" width="100">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.referenceType`" class="mb-0px!">
                    <el-select v-model="row.referenceType" placeholder="请选择" disabled>
                      <el-option
                        v-for="dict in getIntDictOptions(DICT_TYPE.QMS_REFERENCE_TYPE)"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="技术要求" align="center" width="90">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.content`" class="mb-0px!">
                    <el-input v-model="row.content" placeholder="请输入技术要求" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="上限值" align="center" width="80">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.maxValue`" class="mb-0px!">
                    <el-input v-model="row.maxValue" placeholder="请输入上限值" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="下限值" align="center" width="80">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.minValue`" class="mb-0px!">
                    <el-input v-model="row.minValue" placeholder="请输入下限值" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="检测顺序" align="center" width="130" prop="number">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.number`" class="mb-0px!">
                    <el-input-number v-model="row.number" placeholder="请输入检测顺序" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="接收质量限(AQL)" align="center" min-width="150" v-if="false">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.acceptanceQualityLimit`" class="mb-0px!">
                    <el-input-number v-model="row.acceptanceQualityLimit"
                                     placeholder="请输入接收质量限(AQL)" :precision="3"
                                     :step="0.1" disabled/>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showStepBtn">
        <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
          <el-tab-pane label="工步属性" name="1">
            <el-form :model="stepForm" label-width="125px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工步序号" prop="stepNum">
                    <el-input v-model="stepForm.stepNum" class="!w-130px" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工步名称" prop="stepName">
                    <el-input v-model="stepForm.stepName" class="!w-130px" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
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
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工时(min)" prop="processingTime">
                    <el-input v-model="stepForm.processingTime" clearable class="!w-130px" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工步类型" prop="categoryId">
                    <el-tree-select
                      v-model="stepForm.categoryId"
                      :data="categoryList"
                      :props="defaultProps"
                      check-strictly
                      default-expand-all
                      placeholder="请选择工步类型"
                      class="w-1/1" disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="工作说明" prop="description">
                    <div v-html="stepForm.descriptionPreview" style="margin-top: -14px"></div>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="node-name">自定义属性</div>
              <el-descriptions :column="2" border>
                <el-descriptions-item v-for="(item, index) in attributeList" :label="item.attrNameCn" :key="index+1">
                  <el-input v-if="item.isMultvalues === 0" v-model="item.attrDefaultValue" clearable class="!w-130px" disabled />
                  <el-select v-if="item.isMultvalues === 1" v-model="item.attrDefaultValue" multiple placeholder="请选择" class="!w-130px" disabled>
                    <el-option v-for="attrValue in item.attrEffectiveValue.split(',')" :key="attrValue"
                               :label="attrValue" :value="attrValue" />
                  </el-select>
                </el-descriptions-item>
              </el-descriptions>
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
          <el-tab-pane label="执行程序" name="5">
            <el-table :data="ncData" border @row-click="ncCheck">
              <el-table-column label="程序名称" align="center" prop="ncName" />
              <el-table-column :width="200" align="center" label="操作">
                <template #default="scope">
                  <div style="display: flex; align-items: center; justify-content: center;">
                    <el-link :underline="false" style="font-size: 15px;" type="primary"
                             @click="downloadNc(scope.row.ncUrl)">
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
    <el-col :span="8" :xs="24">
      <ContentWrap v-show="!showModel">
        <div style="width:600px;height:680px">三维图</div>
      </ContentWrap>
      <ContentWrap v-show="showModel"
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
</template>
<style>
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  padding-top: 5px;
  padding-right: 3px;
  box-sizing: content-box;
}

</style>
<script setup lang="ts">
import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import {
  ProcessPlanApi, QuotaPerPartVO
} from "@/api/pdm/processPlan";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useUserStore } from '@/store/modules/user'
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import {PartMasterApi, PartMasterVO} from "@/api/pdm/part/partmaster";
import { defaultProps, handleTree } from '@/utils/tree'
import { ElTree } from "element-plus";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted, ref} from "vue";
import { StepCategoryApi, StepCategoryVO } from '@/api/pdm/stepCategory'
import { CustomizedAttributeAPI } from '@/api/pdm/customizedAttribute'
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const categoryList = ref<StepCategoryVO[]>([]) // 工步分类列表
const attributeList = ref([]) // 工步自定义属性
const ProcedureSchemaItem = ref([]) //检测项列表
const detailData = ref({} as PartMasterVO) // 零件基本属性
const currentNode = ref() // 当前选中树节点
const treeList = ref<Tree[]>([]) // 树形结构
const showPartBtn = ref(false) // 零件节点显隐
const showProcessBtn = ref(false) // 工艺方案节点显隐
const showProcedureBtn = ref(false) // 工序节点显隐
const showStepBtn = ref(false) // 工步节点显隐
const showStartBtn = ref(false) // 发起审批按钮显隐
const showDetailBtn = ref(false) // 查看审批进度按钮显隐
const isViewCutter = ref(false) // 选择刀具显隐
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceData = ref([]) // 设备列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const measureData = ref([]) // 量具列表
const measureIds = ref([]) // 零件关联的量具id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组
const procedureFileData = ref([]) //草图列表
const queryFormRef = ref() // 搜索的表单
const productNumber = ref()
const taskId = ref()
const processInstanceId = ref()
const type = ref('create')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const activeName = ref(['1'])
const activeNameProcess = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const formRefPlan = ref()
const dataRouteListSecond = ref<any[]>([])
const processRouteList = ref<any[]>([]) //获取工序列表
const ncData = ref([]) //数控程序文件列表
const formRef = ref()
const treeRef = ref();
const expandedKeys = ref([]);
const menuExpand = ref(false) // 展开/折叠

const formProcessPlan = ref({
  id: undefined,
  name: undefined,
  leftName: undefined,
  isValid: undefined,
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
  materialId: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialNumber: undefined,
  materialSpecification: undefined,
})

const queryParams = reactive({
  projectCode: '',
  partNumber: '',
  status: undefined,
  viewSelf: true,
  projectStatus: 1,
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
  resourcesType: '1',
  resourcesTypeId: '',
  procedureId: '',
  stepId: '',
  ncId: '',
})

const deleteResourceParams = reactive({
  projectCode: '',
  partVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  processVersionId: '',
})
const queryParamsProcess = reactive({
  processCode: '',
  partVersionId: '',
  projectCode: '',
  processTaskId: '',
  feasibilityTaskId: '',
  processVersionId: '',
  source: ''
})

const procedureForm = ref({
  id: '',
  procedureNum: '',
  procedureName: '',
  isInspect: '',
  procedureProperty: '',
  preparationTime: '',
  processingTime: '',
  description: '',
  isOut: '',
})

const stepForm = ref({
  stepNum: '',
  stepName: '',
  stepProperty: '',
  description: '',
  processingTime: '',
  categoryId: undefined
})

const procedureSchemaItemParam = reactive({
  processVersionId: '',
  procedureId: '',
})

const getList = async () => {
  await getTree()
  await getProcessRouteList()
}

/** 查询工序列表，只做获取name用 */
const getProcessRouteList = async () => {
  processRouteList.value = await ProcessPlanApi.getProcessRouteList(null)
}

/** 重置表单 */
const resetProcessForm = () => {
  formProcessPlan.value = {
    id: undefined,
    name: undefined,
    leftName: undefined,
    isValid: undefined,
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
    materialId: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialNumber: undefined,
    materialSpecification: undefined,
  }
  formRefPlan.value?.resetFields()
  dataRouteListSecond.value = []
}

/** 获得结构树 */
const getTree = async () => {
  treeList.value = []
  const data = await ProcessPlanApi.getProjPartBomTreeListNew(queryParams)
  treeList.value.push(...handleTree(data))
  //默认展开
  // expandedKeys.value = getAllNodeIds(treeList.value);
  //默认选中根节点，并触发选中事件
  handleNodeClick(treeList.value[0]);
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getTree()
}

/** 点击零件节点 */
const partChange = async (val) => {
  queryParamsResult.projectCode = val.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  queryParamsProcess.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.processVersionId
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsProcess.processCode = val.partNumber
  queryParamsProcess.projectCode = val.projectCode
  queryParamsProcess.processTaskId = val.id
  queryParamsProcess.feasibilityTaskId = val.feasibilityTaskId
  productNumber.value = val.productNumber

  activeName.value = '1'
  queryParamsAttr.rootProductId = val.rootProductId
  queryParamsAttr.customizedIndex = val.customizedIndex
  queryParamsAttr.partVersionId = val.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  tableData.value = await PartAttachmentApi.getdatapackageBomId(val.partVersionId);
  //切换三维图
  showModel.value = true;
  let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
}
/** 点击工艺方案节点 */
const processChange = async (val) => {
  queryParamsResult.projectCode = val.projectCode
  queryParamsResult.partVersionId = val.partVersionId

  showStartBtn.value = false;
  showDetailBtn.value = false;
  activeNameProcess.value = '1'
  queryParamsResource.projectCode = val.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.id
  deleteResourceParams.projectCode = val.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  deleteResourceParams.processVersionId = val.id
}

/** 左侧结构树的展开/折叠全部 */
const updateTreeExpansion = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
  }
}

// 获取整个树的节点
const getAllNodeIds = (nodeOrNodes) => {
  let nodes = nodeOrNodes;
  if (!Array.isArray(nodes)) {
    nodes = [nodes]; // 如果传入的是单个节点，将其转换为数组
  }
  return nodes.reduce((acc, node) => {
    acc.push(node.id);
    if (node.children && node.children.length > 0) {
      acc.push(...getAllNodeIds(node.children));
    }
    return acc;
  }, []);
};

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  currentNode.value = row
  if (row.type === 0) {//根节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    showStepBtn.value = false;
  } else if (row.type === 1) {//零件节点
    showPartBtn.value = true;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    showStepBtn.value = false;
    taskId.value = row.taskId;
    processInstanceId.value = row.processInstanceId;
    //获取零件信息详情
    detailData.value = await ProcessPlanApi.getPartDetailByTaskIdNew(row.taskId)
    await partChange(detailData.value)
  } else if (row.type === 2) {//工艺方案节点
    showPartBtn.value = false;
    showProcessBtn.value = true;
    showProcedureBtn.value = false;
    showStepBtn.value = false;
    resetProcessForm()
    formProcessPlan.value = await ProcessPlanApi.getProcess(row.id)
    if (formProcessPlan.value) {
      //加工路线默认赋值
      const routeNameStr = formProcessPlan.value.processRouteName.split('-')
      routeNameStr.forEach((nameStr) => {
        let item = { name: nameStr }
        dataRouteListSecond.value.push(item)
      })
    }
    //在删除时，根据父节点的processTaskId，processVersionId删除节点
    queryParamsProcess.partVersionId = row.partVersionId
    queryParamsProcess.projectCode = row.projectCode
    queryParamsProcess.processTaskId = row.parentId
    queryParamsProcess.processVersionId = row.id
    queryParamsProcess.source = row.source
    await processChange(row)
  } else if (row.type === 3) {//工序节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = true;
    showStepBtn.value = false;
    queryParamsResource.procedureId = row.id;
    queryParamsResource.id = row.id
    queryParamsResource.processVersionId = row.parentId
    queryParamsResource.projectCode = row.projectCode

    showStartBtn.value = false;
    showDetailBtn.value = false;

    procedureSchemaItemParam.procedureId = row.id;
    procedureSchemaItemParam.processVersionId = row.parentId

    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParamsResource.id)
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
    await getProcedureSchemaList()
  } else if(row.type === 4) {//工步节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    showStepBtn.value = true;
    showStartBtn.value = false;
    showDetailBtn.value = false;

    queryParamsResource.processVersionId = row.processVersionId;
    queryParamsResource.procedureId = row.parentId;
    queryParamsResource.stepId = row.id;
    stepForm.value = await ProcessPlanDetailApi.getStep(row.id)
    if (stepForm.value.categoryId === '1848998619777974273') {//机加工艺(工步类型对应机加)
      isViewCutter.value = true;
    } else {
      isViewCutter.value = false;
    }
    // 工步类型
    const categoryData = await StepCategoryApi.getStepCategorySimpleList()
    categoryList.value = handleTree(categoryData, 'id', 'parentId')
    // 根据工步id取自定义属性
    const attrValList = await ProcessPlanDetailApi.getStepAttributeValList(row.id)
    // 取分类自定义属性
    attributeList.value = await CustomizedAttributeAPI.getCustomizedAttribute(stepForm.value.categoryId);
    // 匹配自定义属性并赋值
    attributeList.value.forEach((item) => {
      attrValList.forEach((val) => {
        if(val.attributeId === item.id) {
          item.attrDefaultValue = val.attributeValue
        }
      })
    })

    await getNclist()
    await getDeviceListStep()
    await getCombinationListStep()
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

//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParamsResource)
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

/** 工序-检测项 */
const getProcedureSchemaList = async () => {
  const schemaItem = await ProcessPlanDetailApi.getProcedureSchemaItem(procedureSchemaItemParam)
  if(schemaItem.itemList) {
    ProcedureSchemaItem.value = schemaItem.itemList
  } else {
    ProcedureSchemaItem.value = []
  }
}

const ncCheck = async (val) => {
  queryParamsResource.ncId = val.id;
}

//数控程序列表
const getNclist = async () => {
  ncData.value = await ProcessPlanDetailApi.getNc(queryParamsResource)
}

/** 下载数控程序文件 */
const downloadNc = async (ncUrl: string) => {
  window.open(ncUrl, '_blank');
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
  //在前端将刀简号加入数组
  combinationData.value.forEach((combinationItem, index) => {
    const matchingResource = resourcesData.value.find(resource => resource.resourcesTypeId === combinationItem.id);
    if (matchingResource) {
      combinationItem.cutternum = matchingResource.cutternum;
    }
  });
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
onMounted(async () => {
  await getList()
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
.node-name {
  margin-top: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #444;
  display: flex;
}
.node-name::before {
  content: "";
  width: 6px;
  height: 15px;
  background-color: rgb(2, 167, 240);
  margin-right: 5px;
  margin-top: 2px;
  border-radius: 8px;
}
</style>
