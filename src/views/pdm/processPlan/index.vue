<template>
  <el-row :gutter="20">
    <!-- 左侧项目编号列表 -->
    <el-col :span="3" :xs="24">
      <ContentWrap class="h-1/1">
        <div class="head-container">
          <el-input v-model="queryCodeParams.code" class="mb-20px" clearable placeholder="项目编号"
                    @input="getDataList">
            <template #prefix>
              <Icon icon="ep:search"/>
            </template>
          </el-input>
        </div>
        <el-table :data="dataList" style="max-width: 160px;cursor: pointer" highlight-current-row
                  @row-click="projectChange">
          <el-table-column align="center" prop="code"/>
        </el-table>
      </ContentWrap>
    </el-col>
    <el-col :span="21" :xs="24">
      <ContentWrap>
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px"
                 label-width="68px">
          <el-form-item label="零件图号" prop="partNumber">
            <el-input v-model="queryParams.partNumber" class="!w-180px" clearable
                      placeholder="请输入零件图号"/>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable
                       class="!w-180px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_STATUS)"
                         :key="dict.value"
                         :label="dict.label" :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="viewSelf">
            <el-checkbox v-model="queryParams.viewSelf" label="只看我的"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="getTree">
              <Icon class="mr-5px" icon="ep:search"/>
              搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon class="mr-5px" icon="ep:refresh"/>
              重置
            </el-button>
            <el-button v-show="showPartBtn" plain type="primary" @click="handleFeasibilityDetail()">
              <Icon class="mr-5px" icon="ep:circle-check"/>
              查看评估
            </el-button>
            <el-button v-show="showPartBtn && isOperator" plain type="primary"
                       @click="openForm('create')">
              <Icon class="mr-5px" icon="ep:plus"/>
              新增方案
            </el-button>
            <el-button v-show="showStartBtn" plain type="primary" @click="startProcessInstance()">
              <Icon class="mr-5px" icon="ep:circle-check"/>
              发起
            </el-button>
            <el-button v-show="showDetailBtn" plain type="primary" @click="handleProcessDetail()">
              <Icon class="mr-5px" icon="ep:circle-check"/>
              进度
            </el-button>
            <el-button v-show="showProcessBtn && isOperator" plain type="primary"
                       @click="openProcedureForm()">
              <Icon class="mr-5px" icon="ep:plus"/>
              新增工序
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <ContentWrap>
            <div class="head-container" style="height:680px;overflow-y:auto">
              <span style="font-size:14px;margin-left:10px">展开/折叠：</span>
              <el-switch v-model="menuExpand"
                         @change="updateTreeExpansion"/>
              <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false"
                       :props="defaultProps"
                       highlight-current node-key="id" :current-node-key="0"
                       @node-click="handleNodeClick"
                       :default-expanded-keys="expandedKeys">
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <img src="../../../../src/assets/imgs/root.png" class="icon"
                         v-if="data.type === 0"/>
                    <img src="../../../../src/assets/imgs/process.png" class="icon"
                         v-if="data.type === 1"/>
                    <img src="../../../../src/assets/imgs/procedure.png" class="icon"
                         v-if="data.type === 2"/>
                    <img src="../../../../src/assets/imgs/step.png" class="icon"
                         v-if="data.type === 3"/>
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
                  <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias"
                                        :key="index + 1">
                    {{ item.attrValue }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="文件目录" name="2">
                <el-table :data="tableData" border>
                  <el-table-column align="center" label="序号" type="index" width="80px"/>
                  <el-table-column prop="fileName" label="文件名称" align="center"/>
                  <el-table-column prop="fileType" label="文件类型" align="center"/>
                  <el-table-column label="操作" align="center">
                    <template #default="scope">
                      <el-link :underline="false" style="font-size: 12px; vertical-align: baseline"
                               type="primary"
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
                <el-form ref="formRefPlan" :model="formProcessPlan" :rules="formProcessRules"
                         label-width="120px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="工艺规程名称" prop="processName">
                        <el-input v-model="formProcessPlan.processName"
                                  placeholder="请输入工艺规程名称"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="版次" prop="processVersion">
                        <el-input v-model="formProcessPlan.processVersion" placeholder="请输入版次"
                                  disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="关重属性" prop="property">
                        <el-select v-model="formProcessPlan.property" clearable class="!w-400px">
                          <el-option
                            v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY) "
                            :key="dict.value" :label="dict.label" :value="dict.value"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="单机数量" prop=" singleQuatity">
                        <el-input v-model="formProcessPlan.singleQuatity"
                                  pleaceholder="请输入单机数量"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="10">
                      <el-form-item label="材料牌号" prop="materialDesg">
                        <el-input v-model="formProcessPlan.materialDesg" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-button :disabled="!isOperator" type="primary" @click="openNewForm('create')"
                               class="choose">
                      选择
                    </el-button>
                    <el-col :span="11">
                      <el-form-item label="材料类码" prop="materialCode">
                        <el-input v-model="formProcessPlan.materialCode" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="材料名称" prop="materialName">
                        <el-input v-model="formProcessPlan.materialName" disabled/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="材料规格" prop="materialSpecification">
                        <el-input v-model="formProcessPlan.materialSpecification" disabled/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="单件毛料尺寸" prop="singleSize">
                        <el-input v-model="formProcessPlan.singleSize"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="成组加工尺寸" prop="groupSize">
                        <el-input v-model="formProcessPlan.groupSize"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col>
                      <el-form-item label="工作说明" prop="description">
                        <el-input type="textarea" v-model="formProcessPlan.description"
                                  pleaceholder="请说明"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="启用状态" prop="isValid">
                        <el-radio-group v-model="formProcessPlan.isValid" class="!w-400px">
                          <el-radio v-for="dic in getIntDictOptions(DICT_TYPE.COMMON_STATUS)  "
                                    :key="dic.value"
                                    :label="dic.value">
                            {{ dic.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-button v-show="isOperator && isOperatorUpdate" type="primary" plain
                             @click="submitProcessForm"
                             class="ml-120px">
                    <Icon icon="ep:circle-check" class="mr-5px"/>
                    保存
                  </el-button>
                  <el-button v-show="isOperator" type="danger" plain
                             @click="submitProcessdeleteForm" class="ml-150px">
                    <Icon icon="ep:delete" class="mr-5px"/>
                    删除
                  </el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </ContentWrap>
          <ContentWrap v-show="showProcedureBtn">
            <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
              <el-tab-pane label="工序属性" name="1">
                <el-form ref="formProcedure" :rules="procedureFormRules" :model="procedureForm"
                         label-width="110px">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="工序序号" prop="procedureNum">
                        <el-input-number v-model="procedureForm.procedureNum" :min="1"
                                         class="!w-130px"/>
                      </el-form-item>
                      <el-form-item label="准备工时" prop="preparationTime">
                        <el-input-number v-model="procedureForm.preparationTime" class="!w-130px"/>
                      </el-form-item>
                      <!--                      <el-form-item label="是否检验" prop="isInspect">-->
                      <!--                        <el-radio-group v-model="procedureForm.isInspect" class="!w-200px">-->
                      <!--                          <el-radio v-for="is in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISINSPECT)" :key="is.value"-->
                      <!--                            :label="is.value">-->
                      <!--                            {{ is.label }}-->
                      <!--                          </el-radio>-->
                      <!--                        </el-radio-group>-->
                      <!--                      </el-form-item>-->
                      <el-form-item label="检验类型" prop="inspectType">
                        <el-select v-model="procedureForm.inspectType" multiple
                                   placeholder="请选择">
                          <el-option
                            v-for="sw in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_INSPECT_TYPE)"
                            :key="sw.value" :label="sw.label" :value="sw.value!"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="是否外委" prop="isOut">
                        <el-radio-group v-model="procedureForm.isOut" class="!w-200px">
                          <el-radio v-for="out in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISOUT)"
                                    :key="out.value"
                                    :label="out.value">
                            {{ out.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工序名称" prop="procedureName">
                        <el-select v-model="procedureForm.procedureName" filterable clearable
                                   class="!w-130px">
                          <el-option v-for="na in processRouteList" :key="na.name" :label="na.name"
                                     :value="na.name"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="加工工时" prop="processingTime">
                        <el-input-number v-model="procedureForm.processingTime" class="!w-130px"/>
                      </el-form-item>
                      <el-form-item label="关重属性" class="!w-240px" prop="procedureProperty">
                        <el-select v-model="procedureForm.procedureProperty" class="!w-200px">
                          <el-option
                            v-for="pre in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                            :key="pre.value" :label="pre.label" :value="pre.value"/>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="工艺类型" class="!w-240px" prop="processType">
                        <el-select v-model="procedureForm.processType" class="!w-200px">
                          <el-option v-for="tp in getIntDictOptions(DICT_TYPE.PDM_PROCESS_TYPE)"
                                     :key="tp.value"
                                     :label="tp.label" :value="tp.value"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="工作说明">
                    <el-input v-model="procedureForm.description" class="!w-467px" type="textarea"/>
                  </el-form-item>
                  <el-button type="primary" plain v-show="isOperator && isOperatorUpdate"
                             @click="SaveProcedure" class="ml-110px">
                    <Icon icon="ep:circle-check" class="mr-5px"/>
                    保存
                  </el-button>
                  <el-button type="danger" plain v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteProcedure" class="ml-110px">
                    <Icon icon="ep:delete" class="mr-5px"/>
                    删除
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="设备" name="2">
                <el-button v-show="isOperator && isOperatorUpdate"
                           @click="openFormDeviceProcedure()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus"/>
                  选择设备
                </el-button>
                <el-table :data="deviceData" border>
                  <el-table-column prop="code" label="设备编号" align="center"/>
                  <el-table-column prop="name" label="设备名称" align="center"/>
                  <el-table-column prop="specification" label="设备规格" align="center"/>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                                 @click="handleDeleteDeviceProcedure(scope.row.id)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="工装" name="4">
                <el-button v-show="isOperator && isOperatorUpdate"
                           @click="openFormMaterialProcedure()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus"/>
                  选择工装
                </el-button>
                <el-table :data="materialData" border>
                  <el-table-column prop="materialNumber" label="工装编号" align="center"/>
                  <el-table-column prop="materialName" label="工装名称" align="center"/>
                  <el-table-column prop="materialSpecification" label="工装规格" align="center"/>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                                 @click="handleDeleteMaterialProcedure(scope.row.id)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="量具" name="5">
                <el-button v-show="isOperator && isOperatorUpdate"
                           @click="openFormMeasureProcedure()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus"/>
                  选择量具
                </el-button>
                <el-table :data="measureData" border>
                  <el-table-column prop="materialNumber" label="量具编号" align="center"/>
                  <el-table-column prop="materialName" label="量具名称" align="center"/>
                  <el-table-column prop="materialSpecification" label="量具规格" align="center"/>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                                 @click="handleDeleteMeasure(scope.row.id)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="工序草图" name="6">
                <el-button v-show="isOperator && isOperatorUpdate" @click="openProcedureFileForm()"
                           plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus"/>
                  上传草图
                </el-button>
                <el-table :data="procedureFileData" border>
                  <el-table-column label="草图编号" align="center" prop="sketchCode"/>
                  <el-table-column label="草图" align="center" prop="sketchUrl">
                    <template #default="scope">
                      <el-image :src="scope.row.sketchUrl" :preview-src-list="[scope.row.sketchUrl]"
                                class="w-32px h-32px" :preview-teleported="true"/>
                    </template>
                  </el-table-column>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button fit="cover" link type="danger"
                                 v-show="isOperator && isOperatorUpdate"
                                 @click="handleDeleteProcessdurefile(scope.row.id)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="检测项" name="7">
                <el-table :data="ProcedureSchemaItem" border>
                  <el-table-column label="序号" type="index" align="center"/>
                  <el-table-column label="检测项目" align="center" min-width="150">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.inspectionItemName`" class="mb-0px!">
                        <el-input v-model="row.inspectionItemName" placeholder="请输入检测项目"
                                  @click="openProcedureInspectForm('create',row)" readonly/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="检测顺序" align="center" min-width="150" prop="number">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.number`" class="mb-0px!">
                        <el-input-number v-model="row.number" placeholder="请输入检测顺序"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="上限值" align="center" min-width="150">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.largestValue`" class="mb-0px!">
                        <el-input v-model="row.largestValue" placeholder="请输入上限值"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="下限值" align="center" min-width="150">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.minValue`" class="mb-0px!">
                        <el-input v-model="row.minValue" placeholder="请输入下限值"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="技术要求" align="center" min-width="150">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.content`" class="mb-0px!">
                        <el-input v-model="row.content" placeholder="请输入技术要求"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="参考值判断 " align="center" min-width="100">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.referenceType`" class="mb-0px!">

                        <el-select v-model="row.referenceType" placeholder="请选择">
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
                  <el-table-column label="接收质量限(AQL)" align="center" min-width="150">
                    <template #default="{ row, $index }">
                      <el-form-item :prop="`${$index}.acceptanceQualityLimit`" class="mb-0px!">
                        <el-input-number v-model="row.acceptanceQualityLimit"
                                         placeholder="请输入接收质量限(AQL)" :precision="3"
                                         :step="0.1"/>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" fixed="right" label="操作" min-width="60">
                    <template #default="scope">
                      <el-button fit="cover" link type="danger"
                                 @click="handleDeleteProcedureSchemaItem(scope.row.id)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-row justify="center" class="mt-3">
                  <el-button @click="handleAdd" round>+ 添加检验方案检测项目详情</el-button>
                </el-row>
                <el-row justify="center" class="mt-3">
                  <el-button @click="saveProcedureSchemaItem" type="primary" >保存</el-button>
                </el-row>
                <ProcedureInspectionItemChoose ref="inspectionItemChooseRef"
                                               @getInspectionItem="getInspectionItem"
                                               :itemInfo="itemInfo"/>
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
  <!-- 表单弹窗：工艺方案编制添加 -->
  <ProcessInsertForm ref="formRef" @success="getTree"/>
  <!-- 表单弹窗：获取物料信息 -->
  <MaterialInsertForm ref="MaterialInsert" @success="getMaterialInsertList"/>
  <!-- 表单弹窗：选择已定版工艺规程 -->
  <ProcessSelectForm ref="formRefProcess" @success="getTree"/>
  <!-- 表单弹窗：添加工序 -->
  <ProcedureForm ref="formRefProcedure" @success="getTree"/>
  <!-- 工序表单弹窗：选择设备 -->
  <DeviceProcedureForm ref="formRefDeviceProcedure" @success="getDeviceListProcedure"/>
  <!-- 工序表单弹窗：选择工装 -->
  <MaterialProcedureForm ref="formRefMaterialProcedure" @success="getMaterialListProcedure"/>
  <!-- 工序表单弹窗：选择量具 -->
  <MeasureProcedureForm ref="formRefMeasureProcedure" @success="getMeasureListProcedure"/>
  <!-- 表单弹窗：选择草图 -->
  <ProcedureFileForm ref="formProcedureFile" @success="getProcedurelist"/>
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
import {ProcessPlanDetailApi, ProcessPlanDetailVO} from '@/api/pdm/processPlanDetail'
import * as ProductApi from '@/api/pdm/product';
import {
  ProcessPlanApi, QuotaPerPartVO
} from "@/api/pdm/processPlan";
import {FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useUserStore} from '@/store/modules/user'
import ProcessSelectForm from "./ProcessSelectForm.vue"
import MaterialInsertForm from './MaterialInsertForm.vue'
import {PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import {PartMasterApi} from "@/api/pdm/part/partmaster";
import ProcessInsertForm from './ProcessInsertForm.vue';
import {defaultProps, handleTree} from '@/utils/tree'
import {ElTree} from "element-plus";
import ProcedureForm from "./procedureForm.vue";
import ProcedureFileForm from "./ProcedureFileForm.vue"
import DeviceProcedureForm from "./DeviceProcedureForm.vue"
import MaterialProcedureForm from "./MaterialProcedureForm.vue"
import MeasureProcedureForm from "./MeasureProcedureForm.vue"
import ProcedureInspectionItemChoose from "./ProcedureInspectionItemChoose.vue"
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
import InspectionItemChoose
  from "@/views/qms/inspectionschemeitem/components/InspectionItemChoose.vue";
import {InspectionSchemeApi} from "@/api/qms/inspectionscheme";

const items = ref([]); //循环processVersion和procedureId
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const itemInfo = ref({})
const ProcedureSchemaItem = ref([]) //检测项列表

const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗
const {t} = useI18n() // 国际化
const {push} = useRouter() // 路由

const treeList = ref<Tree[]>([]) // 树形结构
const showPartBtn = ref(false) // 零件节点显隐
const showProcessBtn = ref(false) // 工艺方案节点显隐
const showProcedureBtn = ref(false) // 工序节点显隐
const showStartBtn = ref(false) // 发起审批按钮显隐
const showDetailBtn = ref(false) // 查看审批进度按钮显隐
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceData = ref([]) // 设备列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const measureData = ref([]) // 量具列表
const measureIds = ref([]) // 零件关联的量具id数组
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
const isOperatorUpdate = ref(false) // 是否可操作更改
const activeName = ref(['1'])
const activeNameProcess = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const formRefPlan = ref()
const dataRouteListSecond = ref<any[]>([])
const processRouteList = ref<any[]>([]) //获取工序列表
const formRef = ref()
const treeRef = ref();
const expandedKeys = ref([]);
const menuExpand = ref(true) // 展开/折叠
const formRefProcess = ref()
const openForm = async (type: string, id?: number) => {
  const count = await ProcessPlanApi.getProcessCountByPartVersionId(queryParamsProcess.partVersionId)
  if (count === 0) {//零件下无已定版工艺规程，创建工艺规程
    formRef.value.open(type, id, queryParamsProcess.partVersionId, queryParamsProcess.processCode, queryParamsProcess.projectCode, queryParamsProcess.projPartBomId)
  } else {//零件下存在已定版工艺规程，选择其一或升版
    formRefProcess.value.open(queryParamsProcess.partVersionId, queryParamsProcess.projectCode, queryParamsProcess.projPartBomId)
  }
}

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

const formRules = reactive({
  materialDesg: [{required: true, message: '材料牌号不能为空', trigger: 'blur'}],
  materialCondition: [{required: true, message: '材料状态不能为空', trigger: 'blur'}],
})

const formProcessRules = reactive({
  processName: [{required: true, message: '工艺规程名称不能为空', trigger: 'blur'}],
  processVersion: [{required: true, message: '版次不能为空', trigger: 'blur'}],
  property: [{required: true, message: '请选择关重属性', trigger: 'change'}],
  processRouteName: [{required: true, message: '请选择加工路线', trigger: 'blur'}],
  isValid: [{required: true, message: '请选择开启状态', trigger: 'blur'}],
})
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
  inspectType: []
})

const procedureSchemaItem = reactive({
  id: '',
  processVersionId: '',
  procedureId: '',
  inspectionItemId: '',
  number: '',
  referenceType: '',
  largestValue: '',
  minValue: '',
  content: '',
  judgement: '',
  acceptanceQualityLimit: '',
  items: []

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
  inspectType: []
})
const getList = async () => {
  await getDataList()
  queryParams.projectCode = dataList.value[0].code;
  await getTree()
  await getProcessRouteList()
}
const props = defineProps<{
  inspectionSchemeId: undefined, // 方案ID（主表的关联字段）
  samplingLimitType: undefined
}>()
/** 打开弹窗 */
const inspectionItemChooseRef = ref()

const openProcedureInspectForm = (type, row) => {
  itemInfo.value = row
  inspectionItemChooseRef.value.open()
}

/***
 * 获取产品物码
 * */
const getInspectionItem = async (inspectionItem, row) => {
  row.inspectionItemId = inspectionItem.id
  row.inspectionItemName = inspectionItem.itemName
}

/** 查询工序列表，只做获取name用 */
const getProcessRouteList = async () => {
  processRouteList.value = await ProcessPlanApi.getProcessRouteList(null)
}

const getDataList = async () => {
  dataList.value = await ProductApi.getProjectList(queryCodeParams)
}

const projectChange = async (val) => {
  showPartBtn.value = false;
  showProcessBtn.value = false;
  showProcedureBtn.value = false;
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
const procedureFormRules = reactive({
  procedureNum: [{required: true, message: '工序序号不能为空', trigger: 'blur'}],
  procedureName: [{required: true, message: '工序名称不能为空', trigger: 'blur'}],
  procedureProperty: [{required: true, message: '关重属性不能为空', trigger: 'blur'}],
  isInspect: [{required: true, message: '请选择是否检验！', trigger: 'blur'}],
  inspectType: [{required: true, message: '请选择检验类型！', trigger: 'blur'}],
  isOut: [{required: true, message: '请选择是否外委！', trigger: 'blur'}],
  processType: [{required: true, message: '请选择工序类型！', trigger: 'blur'}]
});
/** 获得结构树 */
const getTree = async () => {
  treeList.value = []
  const data = await ProcessPlanApi.getProjPartBomTreeList(queryParams)
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
  const userIdStr = "'" + userId + "'"
  const reviewedByStr = "'" + val.reviewedBy + "'"
  if (userIdStr == reviewedByStr && (val.status == '1' || val.status == '2' || val.status == '4')) {
    isOperator.value = true;
  } else {
    isOperator.value = false;
  }
  if (userIdStr == reviewedByStr && (val.status == '2' || val.status == '4')) {
    showStartBtn.value = true;
  } else {
    showStartBtn.value = false;
  }
  if (userIdStr == reviewedByStr && (val.status == '3' || val.status == '4' || val.status == '5')) {
    showDetailBtn.value = true;
  } else {
    showDetailBtn.value = false;
  }
  activeName.value = '1'
  queryParamsAttr.rootProductId = val.rootProductId
  queryParamsAttr.customizedIndex = val.customizedIndex
  queryParamsAttr.partVersionId = val.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  tableData.value = await PartAttachmentApi.getdatapackageBomId(val.partVersionId);
  //切换三维图
  showModel.value = true;
  let fileData = tableData.value.filter((item) => item.fileType === 'CATPart')
  if (fileData.length > 0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
  await getQuotaPerPart()
}
/** 点击工艺方案节点 */
const processChange = async (val) => {
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  const userIdStr = "'" + userId + "'"
  const reviewedByStr = "'" + val.reviewedBy + "'"
  if (userIdStr == reviewedByStr && (val.status == '1' || val.status == '2' || val.status == '4')) {
    isOperator.value = true;
  } else {
    isOperator.value = false;
  }
  showStartBtn.value = false;
  showDetailBtn.value = false;
  activeNameProcess.value = '1'
  queryParamsResource.projectCode = queryParams.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.id
  deleteResourceParams.projectCode = queryParams.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  deleteResourceParams.processVersionId = val.id
  isOperatorUpdate.value = isOperator.value;
  if (val.source === 2) {//若关联已定版工艺规程，则无法更改工艺方案、可删除
    isOperatorUpdate.value = false;
  }
}

//选择
const MaterialInsert = ref()
const openNewForm = (type: string, id?: number) => {
  MaterialInsert.value.open(type, id)
}

/** 单件定额管理 */
const getQuotaPerPart = async () => {
  formData.value = await ProcessPlanApi.getQuotaPerPartInfo(queryParamsResult)
  if (!formData.value) {
    resetForm()
  }
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

//修改工艺方案编制
const submitProcessForm = async () => {
  // 校验表单
  if (!formRefPlan) return
  const valid = await formRefPlan.value.validate()
  if (!valid) return
  try {
    if (formProcessPlan.value.materialSpecification === null) {
      formProcessPlan.value.materialSpecification = ''
    }
    await ProcessPlanApi.updateProcess(formProcessPlan.value)
    message.success('保存成功')

  } finally {
  }
}
//删除工艺方案编制
const submitProcessdeleteForm = async () => {
  try {
    await message.delConfirm()
    // 发起删除
    await ProcessPlanApi.deleteProcess(queryParamsProcess)
    //提示删除成功
    message.success(t('common.delSuccess'))
    //刷新结构树
    await getTree()
  } finally {

  }
}

/** 提交单件定额更改 */
const submitForm = async () => {
  // 校验表单
  await formRefQuota.value.validate()
  try {
    const data = formData.value as unknown as QuotaPerPartVO
    data.partVersionId = queryParamsResult.partVersionId
    if (data.id) {
      await FeasibilityDetailApi.updateQuotaPerPart(data)
    } else {
      await FeasibilityDetailApi.createQuotaPerPart(data)
    }
    message.success('保存成功')
  } finally {
  }
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
  } else if (row.type === 1) {//零件节点
    showPartBtn.value = true;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    taskId.value = row.taskId;
    processInstanceId.value = row.processInstanceId;
    //获取零件信息详情
    const val = await ProcessPlanApi.getPartDetailByTaskId(row.taskId)
    await partChange(val)
  } else if (row.type === 2) {//工艺方案节点
    showPartBtn.value = false;
    showProcessBtn.value = true;
    showProcedureBtn.value = false;
    resetProcessForm()
    formProcessPlan.value = await ProcessPlanApi.getProcess(row.id)
    if (formProcessPlan.value) {
      //加工路线默认赋值
      const routeNameStr = formProcessPlan.value.processRouteName.split('-')
      routeNameStr.forEach((nameStr) => {
        let item = {name: nameStr}
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
    queryParamsResource.procedureId = row.id;
    queryParamsResource.id = row.id
    queryParamsResource.processVersionId = row.parentId
    procedureSchemaItem.procedureId = row.id;
    procedureSchemaItem.processVersionId = row.parentId
    procedureSchemaItem.id = row.id
    const userIdStr = "'" + userId + "'"
    const reviewedByStr = "'" + row.reviewedBy + "'"
    if (userIdStr == reviewedByStr && (row.status == '1' || row.status == '2' || row.status == '4')) {
      isOperator.value = true;
    } else {
      isOperator.value = false;
    }
    isOperatorUpdate.value = isOperator.value;
    if (row.source === 2) {//若关联已定版工艺规程，则无法更改、删除工序
      isOperatorUpdate.value = false;
    }
    showStartBtn.value = false;
    showDetailBtn.value = false;
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParamsResource.id)
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
    await getProcedureSchemaList()

  }
}

/** 查看技术评估详情 */
const handleFeasibilityDetail = async () => {
  push({
    name: 'PDMFeasibilityDetail',
    query: {
      id: queryParamsProcess.projPartBomId
    }
  })
}

/** 发起流程 */
const startProcessInstance = async () => {
  startProcessParams.id = taskId.value
  await ProcessPlanApi.startProcessInstance(startProcessParams)
  message.success('发起成功')
  // 刷新结构树
  await getTree()
}


//工序节点-选择制造资源
/** 工序-选择设备操作 */
const formRefDeviceProcedure = ref()
const openFormDeviceProcedure = () => {
  formRefDeviceProcedure.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, deviceIds.value)
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

/** 工序-删除设备操作 */
const handleDeleteDeviceProcedure = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '1'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceProcedure(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDeviceListProcedure()
  } catch {
  }
}

/** 工序-选择工装操作 */
const formRefMaterialProcedure = ref()
const openFormMaterialProcedure = () => {
  formRefMaterialProcedure.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, materialIds.value)
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

/** 工序-删除工装操作 */
const handleDeleteMaterialProcedure = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    queryParamsResource.resourcesType = '3'
    queryParamsResource.resourcesTypeId = id
    // 发起删除
    await ProcessPlanDetailApi.deleteSelectedResourceProcedure(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getMaterialListProcedure()
  } catch {
  }
}

/**工序草图弹窗 */
const formProcedureFile = ref()
const openProcedureFileForm = () => {
  formProcedureFile.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId);
}

//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParamsResource)
  console.log(queryParamsResource)
}

//删除工艺草图列表数据
const handleDeleteProcessdurefile = async (id: number) => {
  try {
    //删除的二次确认
    await message.delConfirm()

    await ProcessPlanDetailApi.deleteProcedureFile(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getProcedurelist()
  } catch {

  }
}

//检测项
const getProcedureSchemaList = async () => {
  ProcedureSchemaItem.value = await ProcessPlanDetailApi.getProcedureSchemaItem(procedureSchemaItem)
}


//工序表单
const formProcedure = ref()
//修改工序
const SaveProcedure = async () => {
  // 校验表单
  const valid = await formProcedure.value.validate()
  if (!valid) return
  try {
    const data = procedureForm.value as unknown as ProcessPlanDetailVO
    data.id = procedureForm.value.id
    if (data.id) {
      await ProcessPlanDetailApi.updateProcedure(data)
    }
    message.success('保存成功')
  } finally {
  }
  await getTree()
}
//删除工序
const handleDeleteProcedure = async () => {
  try {
    await message.delConfirm()
    // 发起删除
    await ProcessPlanDetailApi.deleteProcedure(procedureForm.value.id)
    //提示删除成功
    message.success(t('common.delSuccess'))
    //刷新结构树
    await getTree()
  } finally {
  }
}

/** 工序-选择量具操作 */
const formRefMeasureProcedure = ref()
const openFormMeasureProcedure = () => {
  formRefMeasureProcedure.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId, measureIds.value)
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
    await getMeasureListProcedure()
  } catch {
  }
}

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.inspectionSchemeId,
  async (val) => {
    // 1. 重置表单
    ProcedureSchemaItem.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      ProcedureSchemaItem.value = await ProcessPlanDetailApi.getProcedureSchemaItem(val)
    } finally {
      formLoading.value = false
      emit('success')
    }
  },
  {immediate: true}
)

// 设置每个 item 的 procedureId 和 processVersionId
const setProcedureProperties = (items) => {
  items.forEach(row => {
    row.procedureId = row.id;
    row.processVersionId = row.parentId;
  });
};

// 初始化数据
setProcedureProperties(items.value);

// 在组件挂载时重新设置属性
onMounted(() => {
  setProcedureProperties(items.value);
});
/** 检测项新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    inspectionSchemeId: undefined,
    inspectionItemId: undefined,
    number: undefined,
    acceptanceQualityLimit: undefined
  }
  row.inspectionSchemeId = props.inspectionSchemeId
  ProcedureSchemaItem.value.push(row)
}


/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({validate, getData})

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const saveProcedureSchemaItem = async () => {
  formLoading.value = true
  // 假设 procedureSchemaItem.value 包含需要保存的数据
  const dataToSave = ProcedureSchemaItem.value;

    await ProcessPlanDetailApi.saveProcedureSchemaItem(dataToSave)

    message.success(t('common.createSuccess'));
    emit('success');

}

//删除检测项列表数据
const handleDeleteProcedureSchemaItem = async (id: number) => {
  try {
    //删除的二次确认
    await message.delConfirm()
    await ProcessPlanDetailApi.deleteProcedureSchemaItem(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getProcedureSchemaList()
  } catch {

  }
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
const getMaterialInsertList = async (data) => {
  formProcessPlan.value.materialDesg = ''
  formProcessPlan.value.materialName = ''
  formProcessPlan.value.materialCode = ''
  formProcessPlan.value.materialSpecification = ''
  formProcessPlan.value.materialId = ''
  formProcessPlan.value.materialCode = data.materialCode
  formProcessPlan.value.materialName = data.materialName
  formProcessPlan.value.materialDesg = data.materialNumber
  formProcessPlan.value.materialSpecification = data.materialSpecification
  formProcessPlan.value.materialId = data.id
}

const formRefProcedure = ref()
const openProcedureForm = () => {
  formRefProcedure.value.open(queryParamsResource.processVersionId);
};

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

const handleFullScreenChange = () => {
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
</style>
