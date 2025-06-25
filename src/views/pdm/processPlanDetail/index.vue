<template>
  <el-row :gutter="20">
    <!-- 左侧项目编号列表 -->
    <el-col :span="3" :xs="24">
      <ContentWrap class="h-1/1">
        <div class="head-container">
          <el-input v-model="queryCodeParams.code" class="mb-20px" clearable placeholder="项目编号" @input="getDataList">
            <template #prefix>
              <Icon icon="ep:search" />
            </template>
          </el-input>
        </div>
        <el-table :data="dataList" style="max-width: 160px;cursor: pointer" highlight-current-row
          @row-click="projectChange">
          <el-table-column align="center" prop="code" />
        </el-table>
      </ContentWrap>
    </el-col>
    <el-col :span="21" :xs="24">
      <ContentWrap>
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
          <el-form-item label="零件图号" prop="partNumber">
            <el-input v-model="queryParams.partNumber" class="!w-180px" clearable placeholder="请输入零件图号" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-180px">
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
            <el-button v-show="showStartBtn" plain type="primary" @click="startProcessInstance()">
              <Icon class="mr-5px" icon="ep:circle-check" />发起
            </el-button>
            <el-button v-show="showDetailBtn" plain type="primary" @click="handleProcessDetail()">
              <Icon class="mr-5px" icon="ep:circle-check" />进度
            </el-button>
            <el-button v-show="showProcedureBtn && isOperator" plain type="primary" @click="openStepForm()">
              <Icon class="mr-5px" icon="ep:plus" />新增工步
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <ContentWrap>
            <div class="head-container" style="height:680px;overflow-y:auto">
              <span style="font-size:14px;margin-left:10px">展开/折叠：</span>
              <el-switch v-model="menuExpand" @change="updateTreeExpan" />
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
                      <el-form-item label="单机数量" prop=" singleQuatity">
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
          <ContentWrap v-show="showStepBtn">
            <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
              <el-tab-pane label="工步属性" name="1" style="height:450px;overflow-y: auto;overflow-x: hidden">
                <el-form ref="formStep" :rules="stepFormRules" :model="stepForm" label-width="125px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="工步序号" prop="stepNum">
                        <el-input-number v-model="stepForm.stepNum" :min="1" class="!w-130px" />
                      </el-form-item>
                      <el-form-item label="工步名称" prop="stepName">
                        <el-input v-model="stepForm.stepName" class="!w-130px" />
                      </el-form-item>
                      <el-form-item label="关重属性" class="!w-240px" prop="stepProperty">
                        <el-select v-model="stepForm.stepProperty" class="!w-200px">
                          <el-option v-for="st in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)" :key="st.value"
                            :label="st.label" :value="st.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="工时(min)" prop="processingTime">
                        <el-input v-model="stepForm.processingTime" clearable class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="装炉温度(℃)"
                        prop="furnaceTemperature">
                        <el-input v-model="stepForm.furnaceTemperature" clearable class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="加热温度(℃)"
                        prop="heatTemperature">
                        <el-input v-model="stepForm.heatTemperature" clearable class="!w-130px" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="保温时间(min)"
                        prop="keepHeatTime">
                        <el-input v-model="stepForm.keepHeatTime" class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却介质"
                        prop="coolingMedium">
                        <el-input v-model="stepForm.coolingMedium" class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却温度(℃)"
                        prop="coolingTemperature">
                        <el-input v-model="stepForm.coolingTemperature" class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="冷却时间(s)"
                        prop="coolingTime">
                        <el-input v-model="stepForm.coolingTime" class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 1 || showProcessType === 2" label="升温时间(min)"
                        prop="heatUpTime">
                        <el-input v-model="stepForm.heatUpTime" clearable class="!w-130px" />
                      </el-form-item>
                      <el-form-item v-if="showProcessType === 2" label="槽号" prop="slotNumber">
                        <el-select v-model="stepForm.slotNumber" multiple placeholder="请选择">
                          <el-option v-for="sq in getIntDictOptions(DICT_TYPE.PDM_STEP_SLOT_NUMBER)" :key="sq.value" :label="sq.label" :value="sq.value!" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="工作说明" prop="description">
                    <el-input v-model="stepForm.description" class="!w-467px" type="textarea" />
                  </el-form-item>
                  <el-button type="primary" plain v-show="isOperator" @click="SaveForm" class="ml-125px">
                    <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                  </el-button>
                  <el-button type="danger" plain v-show="isOperator" @click="handleDeleteStep" class="ml-125px">
                    <Icon icon="ep:delete" class="mr-5px" />删除
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="设备" name="2">
                <el-button v-show="isOperator" @click="openFormDeviceStep()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择设备
                </el-button>
                <el-table :data="deviceData" border>
                  <el-table-column prop="code" label="设备编号" align="center" />
                  <el-table-column prop="name" label="设备名称" align="center" />
                  <el-table-column prop="specification" label="设备规格" align="center" />
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                        @click="handleDeleteDeviceStep(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="刀具" name="3" v-if="isViewCutter">
                <el-button v-show="isOperator" @click="openFormCombinationStep()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择刀具
                </el-button>
                <el-table :data="combinationData" border>
                  <el-table-column prop="cutterGroupCode" label="刀组编码" align="center" />
                  <el-table-column align="center" label="刀柄类型" prop="taperTypeName">
                    <template #default="scope">
                      <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeName" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="hiltMark" label="刀柄通用规格" align="center" />
                  <el-table-column prop="cutternum"  label="刀简号" align="center">
                    <template #default="scope">
                      <el-input v-model="scope.row.cutternum" size="small" :disabled="!isOperator"  clearable
                                @change="handlerCutternum(scope.row.id, scope.row.cutternum)"/>
                    </template>
                  </el-table-column>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                        @click="handleDeleteCombinationStep(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="执行程序" name="5" style="height:200px;overflow-y: auto">
                <el-button v-show="isOperator" @click="openNcForm()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />上传程序
                </el-button>
                <el-table :data="ncData" border @row-click="ncCheck">
                  <el-table-column label="程序名称" align="center" prop="ncName" />
                  <el-table-column :width="200" align="center" label="操作">
                    <template #default="scope">
                      <div style="display: flex; align-items: center; justify-content: center;">
                        <el-link :underline="false" style="font-size: 15px;" type="primary"
                          @click="downloadNc(scope.row.ncUrl)">
                          下载
                        </el-link>&nbsp;&nbsp;&nbsp;
                        <el-button link type="danger" style="font-size: 15px; margin-left: 10px;" v-show="isOperator"
                          @click="handleDeleteNc(scope.row.id)">
                          删除
                        </el-button>
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
    </el-col>
  </el-row>
  <!-- 表单弹窗：添加工步 -->
  <StepForm ref="formRefStep" @success="getTree" />
  <!-- 工步表单弹窗：选择设备 -->
  <DeviceStepForm ref="formRefDeviceStep" @success="getDeviceListStep" />
  <!-- 工步表单弹窗：选择刀具 -->
  <CombinationStepForm ref="formRefCombinationStep" @success="getCombinationListStep" />
  <!-- 工步表单弹窗：选择程序文件 -->
  <NcForm ref="formNc" @success="getNclist" />
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
import { ProcessPlanDetailApi ,ProcessPlanDetailVO} from '@/api/pdm/processPlanDetail'
import * as ProductApi from '@/api/pdm/product';
import { ProcessPlanApi } from "@/api/pdm/processPlan";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useUserStore } from '@/store/modules/user'
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import { PartMasterApi } from "@/api/pdm/part/partmaster";
import { defaultProps, handleTree } from '@/utils/tree'
import { ElTree } from "element-plus";
import { ref } from "vue";
import StepForm from "./stepForm.vue";
import CombinationStepForm from "./CombinationStepForm.vue";
import DeviceStepForm from "./DeviceStepForm.vue";
import ProcedureFileSecondForm from "./ProcedureFileSecondForm.vue";
import NcForm from "./NcForm.vue";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由
// const getIntDictOptions = ref([] as ProcessPlanDetailApi.ProcessPlanDetailVO[])
const treeList = ref<Tree[]>([]) // 树形结构
const showPartBtn = ref(false) // 零件节点显隐
const showProcessBtn = ref(false) // 工艺方案节点显隐
const showProcedureBtn = ref(false) // 工序节点显隐
const showStepBtn = ref(false) // 工步节点显隐
const showStartBtn = ref(false) // 发起审批按钮显隐
const showDetailBtn = ref(false) // 查看审批进度按钮显隐
const isViewCutter = ref(false) // 选择刀具显隐
const showProcessType = ref(''); // 控制工艺类型输入框的显示
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceData = ref([]) // 设备列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组
const procedureFileData = ref([]) //草图列表

const dataList = ref<any[]>([]) // 项目列表
const queryFormRef = ref() // 搜索的表单
const productNumber = ref()
const taskId = ref()
const processInstanceId = ref()
const type = ref('create')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const isOperator = ref(false) // 是否可操作按钮(负责人为当前登录者且状态为1待评估或2评估中时可操作)
const activeName = ref(['1'])
const activeNameProcess = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const formRefPlan = ref()
const dataRouteListSecond = ref<any[]>([])
const ncData = ref([]) //数控程序文件列表
const formRef = ref()
const treeRef = ref();
const expandedKeys = ref([]);
const menuExpand = ref(true) // 展开/折叠

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
  materialDesg: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialNumber: undefined,
  materialSpecification: undefined,
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

const stepFormRules = reactive({
  stepNum: [{ required: true, message: '工步序号不能为空', trigger: 'blur' }],
  stepName: [{ required: true, message: '工步名称不能为空', trigger: 'change' }],
  stepProperty: [{ required: true, message: '关重属性不能为空', trigger: 'change' }],
  processingTime: [{ required: true, message: '工时不能为空', trigger: 'change' }],
  slotNumber: [{ required: true, message: '槽号不能为空', trigger: 'change' }],
  furnaceTemperature: [{ required: true, message: '装炉温度不能为空', trigger: 'change' }],
  heatTemperature: [{ required: true, message: '加热温度不能为空', trigger: 'change' }],
  heatUpTime: [{ required: true, message: '升温时间不能为空', trigger: 'change' }],
  keepHeatTime: [{ required: true, message: '保温时间不能为空', trigger: 'change' }],
  coolingMedium: [{ required: true, message: '冷却介质不能为空', trigger: 'change' }],
  coolingTemperature: [{ required: true, message: '冷却温度不能为空', trigger: 'change' }],
  coolingTime: [{ required: true, message: '冷却时间不能为空', trigger: 'change' }],
});

const queryCodeParams = reactive({
  code: ''
})

const queryParams = reactive({
  projectCode: '',
  partNumber: '',
  status: undefined,
  viewSelf: false
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
  processType: '',
  inspectType: [],
})

const deleteResourceParams = reactive({
  projectCode: '',
  partVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  processVersionId: '',
  procedureId: '',
  stepId:''
})
const queryParamsProcess = reactive({
  processCode: '',
  partVersionId: '',
  projectCode: '',
  projPartBomId: '',
  processVersionId: '',
  source: ''
})
const startProcessParams = reactive({
  status: '3',
  id: ''
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
  processType: '',
  inspectType: [],
})
const getList = async () => {
  await getDataList()
  queryParams.projectCode = dataList.value[0].code;
  await getTree()
}

const getDataList = async () => {
  dataList.value = await ProductApi.getProjectList(queryCodeParams)
}

const projectChange = async (val) => {
  showPartBtn.value = false;
  showProcessBtn.value = false;
  showProcedureBtn.value = false;
  showStepBtn.value = false;
  showDetailBtn.value = false;
  queryParams.projectCode = val.code;
  await getTree()
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
    materialDesg: undefined,
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
  const data = await ProcessPlanDetailApi.getProjPartBomTreeList(queryParams)
  treeList.value.push(...handleTree(data))
  expandedKeys.value = getAllNodeIds(treeList.value);
  //默认选中根节点，并触发选中事件
  handleNodeClick(treeList.value[0]);
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getTree()
}

const updateTreeExpan = () => {
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

/** 点击零件节点 */
const partChange = async (val) => {
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  queryParamsProcess.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.processVersionId
  queryParamsResource.partVersionId = val.partVersionId

  queryParamsProcess.processCode = val.partNumber
  queryParamsProcess.projectCode = queryParams.projectCode
  queryParamsProcess.projPartBomId = val.id
  productNumber.value = val.productNumber

  showStartBtn.value = false;
  showDetailBtn.value = false;

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
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  showStartBtn.value = false;
  showDetailBtn.value = false;
  activeNameProcess.value = '1'
  queryParamsResource.projectCode = queryParams.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.id
  deleteResourceParams.projectCode = queryParams.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  deleteResourceParams.processVersionId = val.id

}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
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
    //获取零件信息详情
    const val = await ProcessPlanApi.getPartDetailByTaskId(row.taskId)
    await partChange(val)
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
    //在删除时，根据父节点的projPartBomId，processVersionId删除节点
    queryParamsProcess.partVersionId = row.partVersionId
    queryParamsProcess.projectCode = queryParams.projectCode
    queryParamsProcess.projPartBomId = row.parentId
    queryParamsProcess.processVersionId = row.id
    queryParamsProcess.source = row.source
    await processChange(row)
  } else if (row.type === 3) {//工序节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = true;
    showStepBtn.value = false;
    taskId.value = row.taskId;
    processInstanceId.value = row.processInstanceId;
    queryParamsResource.procedureId = row.id;
    queryParamsResource.id = row.id
    queryParamsResource.processVersionId = row.parentId
    queryParamsResource.processType = row.processType
    queryParamsResource.projectCode = queryParams.projectCode
    queryParamsResource.partVersionId = row.partVersionId
    //可操作按钮权限
    const userIdStr = "'" + userId + "'"
    const reviewedByStr = "'" + row.reviewedBy + "'"
    if (userIdStr == reviewedByStr && (row.status == '1' || row.status == '2' || row.status == '4')) {
      isOperator.value = true;
    } else {
      isOperator.value = false;
    }
    if (userIdStr == reviewedByStr && (row.status == '2' || row.status == '4')) {
      showStartBtn.value = true;
    } else {
      showStartBtn.value = false;
    }
    if (userIdStr == reviewedByStr && (row.status == '3' || row.status == '4' || row.status == '5')) {
      showDetailBtn.value = true;
    } else {
      showDetailBtn.value = false;
    }
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParamsResource.id)
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
  } else if (row.type === 4) {//工步节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    showStepBtn.value = true;
    showProcessType.value = row.processType
    if (row.processType === 0) {//机加工艺
      isViewCutter.value = true;
    } else {
      isViewCutter.value = false;
    }
    //可操作按钮权限
    const userIdStr = "'" + userId + "'"
    const reviewedByStr = "'" + row.reviewedBy + "'"
    if (userIdStr == reviewedByStr && (row.status == '1' || row.status == '2' || row.status == '4')) {
      isOperator.value = true;
    } else {
      isOperator.value = false;
    }
    queryParamsResource.processVersionId = row.processVersionId;
    queryParamsResource.procedureId = row.parentId;
    queryParamsResource.stepId = row.id;
    queryParamsResource.processType = row.processType
    stepForm.value = await ProcessPlanDetailApi.getStep(row.id)
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

const formRefStep = ref()
const openStepForm = () => {
  formRefStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, queryParamsResource.processType, queryParamsResource.projectCode, queryParamsResource.partVersionId);
};

//工步节点-选择制造资源
/** 工步-选择设备操作 */
const formRefDeviceStep = ref()
const openFormDeviceStep = () => {
  formRefDeviceStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, queryParamsResource.stepId, deviceIds.value)
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

/** 工步-删除设备操作 */
const handleDeleteDeviceStep = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '1'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceStep(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDeviceListStep()
  } catch { }
}


/** 工步-输入刀简号实时修改*/
const handlerCutternum = (id: string, cutternum: string) => {
  deleteResourceParams.resourcesType = '2'
  deleteResourceParams.resourcesTypeId = id
  deleteResourceParams.cutternum = cutternum
  deleteResourceParams.processVersionId = queryParamsResource.processVersionId
  deleteResourceParams.procedureId = queryParamsResource.procedureId
  deleteResourceParams.stepId = queryParamsResource.stepId
  ProcessPlanDetailApi.updateCutternum(deleteResourceParams)
}
/** 工步-选择刀具操作 */
const formRefCombinationStep = ref()
const openFormCombinationStep = () => {
  formRefCombinationStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, queryParamsResource.stepId, combinationIds.value)
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

/** 工步-删除刀具操作 */
const handleDeleteCombinationStep = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '2'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceStep(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getCombinationListStep()
  } catch { }
}

//工步表单
const formStep = ref()
//修改工步
const SaveForm = async () => {
  // 校验表单
  const valid = await formStep.value.validate()
  if (!valid) return
  try {
    const data = stepForm.value as unknown as ProcessPlanDetailVO
    data.id = stepForm.value.id
    if (data.id) {
      await ProcessPlanDetailApi.updateStep(data)
    }
    message.success('保存成功')
  } finally {
  }
  await getTree()
}
//删除工步
const handleDeleteStep = async () => {
  try {
    await message.delConfirm()
    // 发起删除
    await ProcessPlanDetailApi.deleteStep(stepForm.value.id)
    //提示删除成功
    message.success(t('common.delSuccess'))
    //刷新结构树
    await getTree()
  } finally { }
}

const ncCheck = async (val) => {
  queryParamsResource.ncId = val.id;
}

/**数控程序弹窗 */
const formNc = ref()
const openNcForm = () => {
  try {
    formNc.value.openNc(queryParamsResource.processVersionId, queryParamsResource.procedureId, queryParamsResource.stepId);
  } catch { }
}

//数控程序列表
const getNclist = async () => {
  ncData.value = await ProcessPlanDetailApi.getNc(queryParamsResource)
}

/** 下载数控程序文件 */
const downloadNc = async (ncUrl: string) => {
  window.open(ncUrl, '_blank');
}

//删除数控程序数据
const handleDeleteNc = async () => {
  try {
    //删除的二次确认
    await message.delConfirm()
    console.log('请求参数', queryParamsResource.ncId)
    await ProcessPlanDetailApi.deleteNc(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getNclist()
  } catch {

  }
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
/** 发起流程 */
const startProcessInstance = async () => {
  startProcessParams.id = taskId.value
  await ProcessPlanDetailApi.startProcessInstance(startProcessParams)
  message.success('发起成功')
  // 刷新结构树
  await getTree()
}

/** 查看流程进度 */
const handleProcessDetail = async () => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: processInstanceId.value
    }
  })
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
<style>
.custom-tree-node .icon {
  box-sizing: content-box ;
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

