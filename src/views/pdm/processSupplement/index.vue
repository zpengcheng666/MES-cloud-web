<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="110px">
      <el-form-item label="项目号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" class="!w-180px" clearable placeholder="请输入项目号"/>
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-input v-model="queryParams.partNumber" class="!w-180px" clearable placeholder="请输入零件图号"/>
      </el-form-item>
      <el-form-item label="补加工工艺编号" prop="processCodeSupplement">
        <el-input v-model="queryParams.processCodeSupplement" class="!w-160px" clearable placeholder="请输入补加工工艺编号"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-130px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESS_SUPPLEMENT_STATUS)" :key="dict.value"
                     :label="dict.label" :value="dict.value" />
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="handleQuery" >
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" style="cursor: pointer;height:160px;overflow-y: auto"
              @row-click="partChange">
      <el-table-column align="center" label="项目号" prop="projectCode" :width="180" />
      <el-table-column align="center" label="零件图号" prop="partNumber" :width="200"/>
      <el-table-column align="center" label="零件名称" prop="partName" />
      <el-table-column align="center" label="加工状态" prop="processCondition" :width="180"/>
      <el-table-column align="center" label="工艺规程编号" prop="processCode" :width="180" />
      <el-table-column align="center" label="当前工序号" prop="procedureNum" />
      <el-table-column align="center" label="补加工后工序号" prop="procedureNumNext" />
      <el-table-column align="center" label="补加工工艺编号" prop="processCodeSupplement" :width="180" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_PROCESS_SUPPLEMENT_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :width="150" align="center" label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.status==='0' || scope.row.status==='2'" link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-if="scope.row.status==='0' || scope.row.status==='2'" link type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
          <el-button v-if="scope.row.status==='0' || scope.row.status==='2'"
                     link type="primary" @click="startProcessInstance(scope.row.id)">发起</el-button>
          <el-button
            v-if="scope.row.status==='1' || scope.row.status==='2' || scope.row.status==='3'"
            link type="primary" @click="handleProcessDetail(scope.row.processInstanceId)">进度</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total"
                @pagination="getList" />
  </ContentWrap>
  <el-row :gutter="10">
    <!-- 左侧结构树 -->
    <el-col :span="6" :xs="24">
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
    <el-col :span="18" :xs="24">
      <el-button v-show="showProcess && isOperator" plain type="primary" @click="openProcedureForm()">
        <Icon class="mr-5px" icon="ep:plus" />新增工序
      </el-button>
      <el-button v-show="showProcedure && isOperator" plain type="primary" @click="openStepForm()">
        <Icon class="mr-5px" icon="ep:plus" />新增工步
      </el-button>
      <ContentWrap v-show="showProcess">
        <el-tabs model-value='1' class="demo-tabs">
          <el-tab-pane label="补加工工艺属性" name="1">
            <el-form :model="processForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="项目号" prop="projectCode">
                    <el-input v-model="processForm.projectCode" class="!w-240px" disabled />
                  </el-form-item>
                  <el-form-item label="零件图号" prop="partNumber">
                    <el-input v-model="processForm.partNumber" class="!w-240px" disabled />
                  </el-form-item>
                  <el-form-item label="当前工序号" prop="procedureNum">
                    <el-input v-model="processForm.procedureNum" class="!w-240px" disabled />
                  </el-form-item>
                  <el-form-item label="补加工后工序号" prop="procedureNumNext">
                    <el-input v-model="processForm.procedureNumNext" class="!w-240px" disabled />
                  </el-form-item>
                  <el-form-item label="补加工工艺编号" prop="processCodeSupplement">
                    <el-input v-model="processForm.processCodeSupplement" class="!w-240px" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作说明" prop="description">
                <el-input v-model="processForm.description" class="!w-470px" type="textarea" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showProcedure">
        <el-tabs model-value='1' class="demo-tabs">
          <el-tab-pane label="工序属性" name="1">
            <el-form ref="formProcedure" :rules="procedureFormRules" :model="procedureForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="工序序号" prop="procedureNum">
                    <el-input v-model="procedureForm.procedureNum" class="!w-130px" />
                  </el-form-item>
                  <el-form-item label="准备工时" prop="preparationTime">
                    <el-input-number v-model="procedureForm.preparationTime" class="!w-130px" />
                  </el-form-item>
                  <el-form-item label="是否专检" prop="isInspect">
                    <el-radio-group v-model="procedureForm.isInspect" class="!w-200px">
                      <el-radio v-for="is in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISINSPECT)" :key="is.value"
                                :label="is.value">
                        {{ is.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否外委" prop="isOut">
                    <el-radio-group v-model="procedureForm.isOut" class="!w-200px">
                      <el-radio v-for="out in getIntDictOptions(DICT_TYPE.PDM_PROCEDURE_ISOUT)" :key="out.value"
                                :label="out.value">
                        {{ out.label }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工序名称" prop="procedureName">
                    <el-select v-model="procedureForm.procedureName" filterable clearable class="!w-130px">
                      <el-option v-for="na in processRouteList" :key="na.name" :label="na.name" :value="na.name" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="加工工时" prop="processingTime">
                    <el-input-number v-model="procedureForm.processingTime" class="!w-130px" />
                  </el-form-item>
                  <el-form-item label="关重属性" class="!w-240px" prop="procedureProperty">
                    <el-select v-model="procedureForm.procedureProperty" class="!w-200px">
                      <el-option v-for="pre in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)"
                                 :key="pre.value" :label="pre.label" :value="pre.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作说明" prop="description">
                <iframe ref="IframeRef"  :src="src"  width="100%" height="300px" style="border: none"></iframe>
              </el-form-item>
              <div style="margin-left: 120px;" class="flex-container">
                <el-button type="primary" plain v-show="isOperator" @click="SaveProcedure">
                  <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                </el-button>
                <el-button type="danger" plain v-show="isOperator" @click="handleDeleteProcedure">
                  <Icon icon="ep:delete" class="mr-5px" />删除
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="制造资源" name="2">
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator" @click="openFormDeviceProcedure()" plain type="primary">
                <Icon class="mr-5px" icon="ep:plus" />选择设备
              </el-button>
              <el-table :data="deviceData" border>
                <el-table-column prop="code" label="设备编号" align="center" />
                <el-table-column prop="name" label="设备名称" align="center" />
                <el-table-column prop="specification" label="设备规格" align="center" />
                <el-table-column :width="60" align="center" label="操作">
                  <template #default="scope">
                    <el-button link type="danger" v-show="isOperator"
                               @click="handleDeleteDeviceProcedure(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator" @click="openFormMaterialProcedure()" plain type="primary">
                <Icon class="mr-5px" icon="ep:plus" />选择工装
              </el-button>
              <el-table :data="materialData" border>
                <el-table-column prop="materialNumber" label="工装编号" align="center" />
                <el-table-column prop="materialName" label="工装名称" align="center" />
                <el-table-column prop="materialSpecification" label="工装规格" align="center" />
                <el-table-column :width="60" align="center" label="操作">
                  <template #default="scope">
                    <el-button link type="danger" v-show="isOperator"
                               @click="handleDeleteMaterialProcedure(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator" @click="openFormMeasureProcedure()" plain type="primary">
                <Icon class="mr-5px" icon="ep:plus" />选择量具
              </el-button>
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
            </div>
          </el-tab-pane>
          <el-tab-pane label="工序草图" name="3">
            <el-button v-show="isOperator" @click="openProcedureFileForm()" plain type="primary">
              <Icon class="mr-5px" icon="ep:plus" />上传草图
            </el-button>
            <el-table :data="procedureFileData" border>
              <el-table-column label="草图编号" align="center" prop="sketchCode" />
              <el-table-column label="草图" align="center" prop="sketchUrl">
                <template #default="scope">
                  <el-image :src="scope.row.sketchUrl" :preview-src-list="[scope.row.sketchUrl]"
                            class="w-32px h-32px" :preview-teleported="true" />
                </template>
              </el-table-column>
              <el-table-column :width="120" align="center" label="操作">
                <template #default="scope">
                  <el-button fit="cover" link type="danger" v-show="isOperator"
                             @click="handleDeleteProcessdurefile(scope.row.id)">
                    删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="检测项" name="4">
            <el-table :data="ProcedureSchemaItem" border>
              <el-table-column label="序号" type="index" align="center" width="60"/>
              <el-table-column label="检测项目" align="center" min-width="150">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.inspectionItemName`" class="mb-0px!">
                    <el-input v-model="row.inspectionItemName" placeholder="请输入检测项目"
                              @click="openProcedureInspectForm('create',row)" readonly/>
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
              <el-table-column label="技术要求" align="center" min-width="150">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.content`" class="mb-0px!">
                    <el-input v-model="row.content" placeholder="请输入技术要求"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="上限值" align="center" min-width="150">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.maxValue`" class="mb-0px!">
                    <el-input v-model="row.maxValue" placeholder="请输入上限值"/>
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
              <el-table-column label="接收质量限(AQL)" align="center" min-width="150" v-if="false">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.acceptanceQualityLimit`" class="mb-0px!">
                    <el-input-number v-model="row.acceptanceQualityLimit"
                                     placeholder="请输入接收质量限(AQL)" :precision="3"
                                     :step="0.1"/>
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
              <el-table-column align="center" fixed="right" label="操作" min-width="60">
                <template #default="{ row,$index }">
                  <el-button v-if="row.id != undefined && row.id != ''" fit="cover" link type="danger" v-show="isOperator"
                             @click="handleDeleteProcedureSchemaItem(row.id)">
                    删除
                  </el-button>
                  <el-button v-if="row.id == undefined || row.id == ''" fit="cover" link type="danger" v-show="isOperator"
                             @click="handleDeleteItem($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row justify="center" class="mt-3">
              <el-button @click="handleAdd" round v-show="isOperator">+ 添加检测项</el-button>
            </el-row>
            <el-row justify="center" class="mt-3">
              <el-button @click="saveProcedureSchemaItem" type="primary" v-show="isOperator" >保存</el-button>
            </el-row>
            <ProcedureInspectionItemChoose ref="inspectionItemChooseRef"
                                           @getInspectionItem="getInspectionItem"
                                           :itemInfo="itemInfo"/>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showStep">
        <el-tabs model-value='1' class="demo-tabs">
          <el-tab-pane label="工步属性" name="1">
            <el-form ref="formStep" :rules="stepFormRules" :model="stepForm" label-width="125px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="工步序号" prop="stepNum">
                    <el-input v-model="stepForm.stepNum" class="!w-130px" />
                  </el-form-item>
                  <el-form-item label="关重属性" class="!w-240px" prop="stepProperty">
                    <el-select v-model="stepForm.stepProperty" class="!w-200px">
                      <el-option v-for="st in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)" :key="st.value"
                                 :label="st.label" :value="st.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工步类型" prop="categoryId">
                    <el-tree-select
                      v-model="stepForm.categoryId"
                      :data="categoryList"
                      :props="defaultProps"
                      check-strictly
                      default-expand-all
                      placeholder="请选择工步类型"
                      class="w-1/1" @change="changeStepType()"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工步名称" prop="stepName">
                    <el-input v-model="stepForm.stepName" class="!w-130px" />
                  </el-form-item>
                  <el-form-item label="工时(min)" prop="processingTime">
                    <el-input v-model="stepForm.processingTime" clearable class="!w-130px" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作说明" prop="description">
                <iframe id="BlMarkdownEditor" ref="StepFormRef" :src="src" width="100%" height="300px" style="border: none"></iframe>
              </el-form-item>
              <div style="width: 800px">
                <div class="node-name">自定义属性</div>
                <el-descriptions :column="2" border style="margin-bottom:20px">
                  <el-descriptions-item v-for="(item, index) in attributeList" :label="item.attrNameCn" :key="index+1">
                    <el-input v-if="item.isMultvalues === 0" v-model="item.attrDefaultValue" clearable class="!w-130px" />
                    <el-select v-if="item.isMultvalues === 1" v-model="item.attrDefaultValue" multiple placeholder="请选择" class="!w-130px">
                      <el-option v-for="attrValue in item.attrEffectiveValue.split(',')" :key="attrValue"
                                 :label="attrValue" :value="attrValue" />
                    </el-select>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
              <div style="margin-left: 125px">
                <el-button type="primary" plain v-show="isOperator" @click="SaveForm">
                  <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                </el-button>
                <el-button type="danger" plain v-show="isOperator" @click="handleDeleteStep">
                  <Icon icon="ep:delete" class="mr-5px" />删除
                </el-button>
              </div>
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
          <el-tab-pane label="执行程序" name="4">
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
  </el-row>
  <!-- 表单弹窗：添加/修改补加工工艺 -->
  <ProcessSupplementForm ref="formRef" @success="getList" />
  <!-- 表单弹窗：添加工序 -->
  <ProcedureForm ref="formRefProcedure" @success="refreshTreeByProcedure" />
  <!-- 工序表单弹窗：选择设备 -->
  <DeviceProcedureForm ref="formRefDeviceProcedure" @success="getDeviceListProcedure" />
  <!-- 工序表单弹窗：选择工装 -->
  <MaterialProcedureForm ref="formRefMaterialProcedure" @success="getMaterialListProcedure" />
  <!-- 工序表单弹窗：选择量具 -->
  <MeasureProcedureForm ref="formRefMeasureProcedure" @success="getMeasureListProcedure" />
  <!-- 表单弹窗：选择草图 -->
  <ProcedureFileForm ref="formProcedureFile" @success="getProcedurelist" />
  <!-- 表单弹窗：添加工步 -->
  <StepForm ref="formRefStep" @success="refreshTreeByStep" />
  <!-- 工步表单弹窗：选择设备 -->
  <DeviceStepForm ref="formRefDeviceStep" @success="getDeviceListStep" />
  <!-- 工步表单弹窗：选择刀具 -->
  <CombinationStepForm ref="formRefCombinationStep" @success="getCombinationListStep" />
  <!-- 工步表单弹窗：选择程序文件 -->
  <NcForm ref="formNc" @success="getNclist" />
</template>
<script lang="ts" setup>
import {ProcessSupplementApi, ProcessSupplementVO} from '@/api/pdm/processSupplement'
import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
import { ProcessPlanApi } from "@/api/pdm/processPlan";
import { StepCategoryApi, StepCategoryVO } from '@/api/pdm/stepCategory'
import { CustomizedAttributeAPI } from '@/api/pdm/customizedAttribute'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import ProcessSupplementForm from './processSupplementForm.vue';
import { defaultProps, handleTree } from '@/utils/tree'
import {ElTree} from "element-plus";
import {ref,defineComponent} from "vue";
import ProcedureForm from "@/views/pdm/processPlanNew/procedureForm.vue";
import StepForm from "@/views/pdm/processPlanNew/stepForm.vue";
import ProcedureInspectionItemChoose
  from "@/views/pdm/processPlanNew/ProcedureInspectionItemChoose.vue";
import ProcedureFileForm from "@/views/pdm/processPlanNew/ProcedureFileForm.vue";
import DeviceProcedureForm from "@/views/pdm/processPlanNew/DeviceProcedureForm.vue";
import MeasureProcedureForm from "@/views/pdm/processPlanNew/MeasureProcedureForm.vue";
import MaterialProcedureForm from "@/views/pdm/processPlanNew/MaterialProcedureForm.vue";
import CombinationStepForm from "@/views/pdm/processPlanNew/CombinationStepForm.vue";
import NcForm from "@/views/pdm/processPlanNew/NcForm.vue";
const VITE_BASE_EDITOR_URL = import.meta.env.VITE_BASE_EDITOR_URL
const src = ref(VITE_BASE_EDITOR_URL)
defineOptions({ name: 'PdmProcessSupplement' })
const message=useMessage()//弹窗
const {t} =useI18n()//国际化
const { push } = useRouter() // 路由
const loading = ref(true)//列表加载
const total=ref(0)//列表总页数
const list = ref<ProcessSupplementVO[]>([]) // 列表的数据
const currentNode = ref() // 当前选中树节点
const currentNodeData = ref() // 当前选中树节点data
const treeList = ref<Tree[]>([]) // 树形结构
const showResult = ref(false)
const showProcess = ref(false) //工艺规程节点显隐
const showProcedure = ref(false) //工序显隐
const showStep = ref(false) //工步显隐
const isViewCutter = ref(false) // 选择刀具显隐
const isOperator = ref(false) // 是否可操作按钮
const queryFormRef = ref() // 搜索的表单
const treeRef = ref()
const IframeRef = ref()
const StepFormRef = ref()
const processRouteList = ref<any[]>([]) //获取工序列表
const categoryList = ref<StepCategoryVO[]>([]) // 工步分类列表
const attributeList = ref([]) // 工步自定义属性
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
const ProcedureSchemaItem = ref([]) //检测项列表
const items = ref([]); //循环processVersion和procedureId
const itemInfo = ref({})
const ncData = ref([]) //数控程序文件列表
const queryParams = reactive({
  pageNo:1,
  pageSize:10,
  projectCode: '',
  partNumber: '',
  processCodeSupplement: '',
  status: '',
  processVersionId: '',
})
const processForm = ref({
  projectCode: '',
  partNumber: '',
  processCodeSupplement: '',
  procedureNum: '',
  procedureNumNext: '',
  description: ''
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
  descriptionPreview:''
})
const procedureFormRules = reactive({
  procedureNum: [{ required: true, message: '工序序号不能为空', trigger: 'blur' }],
  procedureName: [{ required: true, message: '工序名称不能为空', trigger: 'blur' }],
  procedureProperty: [{ required: true, message: '关重属性不能为空', trigger: 'blur' }],
  isInspect: [{ required: true, message: '请选择是否专检！', trigger: 'blur' }],
  isOut: [{ required: true, message: '请选择是否外委！', trigger: 'blur' }]
})
const stepForm = ref({
  stepNum: '',
  stepName: '',
  stepProperty: '',
  description: '',
  processingTime: '',
  descriptionPreview:'',
  categoryId: undefined
})
const stepFormRules = reactive({
  stepNum: [{ required: true, message: '工步序号不能为空', trigger: 'blur' }],
  stepName: [{ required: true, message: '工步名称不能为空', trigger: 'change' }],
  stepProperty: [{ required: true, message: '关重属性不能为空', trigger: 'change' }],
  processingTime: [{ required: true, message: '工时不能为空', trigger: 'change' }],
  categoryId: [{ required: true, message: '工步类型不能为空', trigger: 'blur' }],
});
const queryParamsResource = reactive({
  processVersionId: '',
  procedureId: '',
  stepId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  ncId: '',
  inspectionSchemeId: '',
})
const startProcessParams = reactive({
  status: '1',
  id: ''
})

//查看补加工工艺规程列表
const getList = async () => {
  loading.value=true
  try{
    const data=await ProcessSupplementApi.getProcessSupplementPage(queryParams)
    list.value=data.list
    total.value=data.total
  }finally {
    loading.value=false
  }
}

/**搜索按钮操作**/
const handleQuery=()=>{
  queryParams.pageNo=1
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProcessSupplementApi.deleteProcessSupplement(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}
//选中行数据事件
const partChange = async (val) => {
  showResult.value = true;
  queryParams.processVersionId = val.id;
  processForm.value = await ProcessSupplementApi.getProcessSupplement(val.id)
  if ((val.status == '0' || val.status == '2')) {
    isOperator.value = true;
  } else {
    isOperator.value = false;
  }
  await getTree()
  await getProcessRouteList()
}
//获得树
const getTree = async () => {
  treeList.value = []
  const data = await ProcessSupplementApi.getProcessSupplementTreeList(queryParams)
  treeList.value.push(...handleTree(data))
  //默认选中根节点，并触发选中事件
  setTimeout(()=>{handleNodeClick(treeList.value[0]);},500)
}
/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  currentNodeData.value = row;
  currentNode.value = treeRef.value.getNode(row)
  if (row.type === 0) {//工艺规程节点
    showProcess.value = true;
    showProcedure.value = false;
    showStep.value = false;
    queryParamsResource.processVersionId = row.id
  } else if (row.type === 1) {//工序节点
    showProcess.value = false;
    showProcedure.value = true;
    showStep.value = false;
    queryParamsResource.processVersionId = row.parentId
    queryParamsResource.procedureId = row.id;
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(row.id)

    const iFrame = IframeRef.value;
    iFrame.contentWindow.postMessage(
      {
        type: 'showData',
        param: { description: procedureForm.value.description, descriptionPreview: procedureForm.value.descriptionPreview }
      },
      '*'
    );
    await getProcedurelist()
    await getDeviceListProcedure()
    await getMaterialListProcedure()
    await getMeasureListProcedure()
    await getProcedureSchemaList()

  } else {//工步节点
    showProcess.value = false;
    showProcedure.value = false;
    showStep.value = true;
    queryParamsResource.processVersionId = row.processVersionId;
    queryParamsResource.procedureId = row.parentId;
    queryParamsResource.stepId = row.id;
    stepForm.value = await ProcessPlanDetailApi.getStep(row.id)
    const stepFormiFrame = StepFormRef.value;
    stepFormiFrame.contentWindow.postMessage(
      {
        type: 'showData',
        param: { description: stepForm.value.description, descriptionPreview: stepForm.value.descriptionPreview }
      },
      '*'
    );
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
/** 查询工序列表，只做获取name用 */
const getProcessRouteList = async () => {
  processRouteList.value = await ProcessPlanApi.getProcessRouteList(null)
}

//工序表单
const formProcedure = ref()
const receivedDescription = ref();
const receivedContentHtml = ref();

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'description') {
    receivedDescription.value = data.data;
    // 更新表单字段
    if (procedureForm.value) {
      procedureForm.value.description = receivedDescription.value;
    } else {
      console.error('procedureForm is not initialized');
    }
  } else if (data.type == 'contentHtml') {
    receivedContentHtml.value = data.data;
    // 更新表单字段
    if (procedureForm.value) {
      procedureForm.value.descriptionPreview = receivedContentHtml.value;
    } else {
      console.error('procedureForm is not initialized');
    }
  } else {
    console.warn('Unknown message type:', data.type);
  }

}, false);



//修改工序
const SaveProcedure = async () => {
  //校验表单
  const valid = await formProcedure.value.validate()
  if (!valid) return
  try {
    const data = procedureForm.value as unknown as ProcessPlanDetailVO
    procedureForm.value.description =  receivedDescription.value
    procedureForm.value.descriptionPreview = receivedContentHtml.value
    // 校验工序号
    if (processForm.value.procedureNumNext) {
      if (parseInt(data.procedureNum) < parseInt(processForm.value.procedureNum) || parseInt(data.procedureNum) >= parseInt(processForm.value.procedureNumNext)) {
        //当前工序号≤工序号＜补加工后工序号
        message.error('工序号必须在当前工序号与补加工后工序号之间')
        return
      }
    } else {//最后一道工序
      if (parseInt(data.procedureNum) < parseInt(processForm.value.procedureNum)) {
        message.error('工序号必须≥当前工序号')
        return
      }
    }
    data.id = procedureForm.value.id
    if (data.id) {

      await ProcessPlanDetailApi.updateProcedure(data)
      message.success('保存成功')
      // 局部刷新结构树-更新工序节点名称
      currentNodeData.value.name = data.procedureNum + '(' + data.procedureName + ')'
    }
  }finally {
  }
}
//删除工序
const handleDeleteProcedure = async () => {
  try {
    await message.delConfirm()
    // 发起删除
    await ProcessPlanDetailApi.deleteProcedure(procedureForm.value.id)
    //提示删除成功
    message.success(t('common.delSuccess'))
    // 局部刷新结构树-删除工序节点
    treeRef.value.remove(currentNodeData.value)
  } finally { }
}
const formRefProcedure = ref()
const openProcedureForm = () => {
  formRefProcedure.value.open(queryParamsResource.processVersionId, processForm.value.procedureNum, processForm.value.procedureNumNext);
};
/** 新增工序后局部刷新结构树 */
const refreshTreeByProcedure = async (procedureId, procedureNum, procedureName) => {
  let procedureNode = {
    type:1,id:procedureId,parentId:currentNodeData.value.id,name:procedureNum+'('+procedureName+')',
    serialnum:procedureNum,
    processVersionId:currentNodeData.value.processVersionId
  }
  if(currentNodeData.value.children) {
    currentNodeData.value.children.push(procedureNode)
  } else {
    currentNodeData.value.children = []
    currentNodeData.value.children.push(procedureNode)
  }
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
  } catch { }
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
  } catch { }
}
/**工序草图弹窗 */
const formProcedureFile = ref()
const openProcedureFileForm = () => {
  formProcedureFile.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId);
}
//工艺草图加载后列表
const getProcedurelist = async () => {
  procedureFileData.value = await ProcessPlanDetailApi.getProcedureFile(queryParamsResource)
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
  } catch { }
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
  } catch { }
}

//检测项
const getProcedureSchemaList = async () => {
  const schemaItem = await ProcessPlanDetailApi.getProcedureSchemaItem(queryParamsResource)
  if(schemaItem.inspectionSchemeId) {
    queryParamsResource.inspectionSchemeId = schemaItem.inspectionSchemeId
  } else {
    queryParamsResource.inspectionSchemeId = ''
  }
  if(schemaItem.itemList) {
    ProcedureSchemaItem.value = schemaItem.itemList
  } else {
    ProcedureSchemaItem.value = []
  }
}

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
    processVersionId: undefined,
    procedureId: undefined,
    inspectionItemId: undefined,
    number: undefined,
    acceptanceQualityLimit: undefined
  }
  row.processVersionId = queryParamsResource.processVersionId
  row.procedureId = queryParamsResource.procedureId
  row.inspectionSchemeId = queryParamsResource.inspectionSchemeId
  ProcedureSchemaItem.value.push(row)
}

/** 删除动态添加的检测项 */
const handleDeleteItem = (index) => {
  ProcedureSchemaItem.value.splice(index, 1)
}

const saveProcedureSchemaItem = async () => {
  // 假设 procedureSchemaItem.value 包含需要保存的数据
  const dataToSave = ProcedureSchemaItem.value;

  await ProcessPlanDetailApi.saveProcedureSchemaItem(dataToSave)
  message.success(t('common.createSuccess'));

  // 刷新列表
  await getProcedureSchemaList()
}

//删除检测项列表数据
const handleDeleteProcedureSchemaItem = async (id: number) => {
  try {
    await ProcessPlanDetailApi.deleteProcedureSchemaItem(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getProcedureSchemaList()
  } catch {

  }
}

const formRefStep = ref()
const openStepForm = () => {
  formRefStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId);
};

const receivedContent = ref()
const receivedContentHtmls = ref()

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'description') {
    receivedContent.value = data.data;
    console.log(receivedContent.value)
    // 更新表单字段
    if (stepForm.value) {
      stepForm.value.description = receivedContent.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else if (data.type == 'contentHtml') {
    receivedContentHtmls.value = data.data;
    // 更新表单字段
    if (stepForm.value) {
      stepForm.value.descriptionPreview = receivedContentHtmls.value;
    } else {
      console.error('stepForm is not initialized');
    }
  } else {
    console.warn('Unknown message type:', data.type);
  }

}, false);
//工步表单
const formStep = ref()
//修改工步
const SaveForm = async () => {
  // 校验表单
  const valid = await formStep.value.validate()
  if (!valid) return
  try {
    const data = stepForm.value as unknown as ProcessPlanDetailVO
    stepForm.value.description =  receivedContent.value
    stepForm.value.descriptionPreview = receivedContentHtmls.value
    data.id = stepForm.value.id
    if (data.id) {
      //自定义属性赋值-单值转数组
      attributeList.value.forEach((item) => {
        if(item.isMultvalues === 0 && !(item.attrDefaultValue instanceof Array)) {
          item.attrDefaultValue = item.attrDefaultValue.split(",")
        }
      })
      data.attributeValList = attributeList.value;
      await ProcessPlanDetailApi.updateStep(data)
    }
    message.success('保存成功')
    // 局部刷新结构树-更新工步节点名称
    currentNodeData.value.name = data.stepNum+'('+data.stepName+')'
  } finally {
  }
}
//删除工步
const handleDeleteStep = async () => {
  try {
    await message.delConfirm()
    // 发起删除
    await ProcessPlanDetailApi.deleteStep(stepForm.value.id)
    //提示删除成功
    message.success(t('common.delSuccess'))
    // 局部刷新结构树-删除工步节点
    treeRef.value.remove(currentNodeData.value)
  } finally { }
}

/** 新增工步后局部刷新结构树 */
const refreshTreeByStep = async (stepId, stepNum, stepName) => {
  let stepNode = {
    type:2,id:stepId,parentId:currentNodeData.value.id,name:stepNum+'('+stepName+')',
    serialnum:stepNum,
    processVersionId:currentNodeData.value.processVersionId
  }
  if(currentNodeData.value.children) {
    currentNodeData.value.children.push(stepNode)
  } else {
    currentNodeData.value.children = []
    currentNodeData.value.children.push(stepNode)
  }
}
/** 切换工步类型 */
const changeStepType = async () => {
  // 取分类自定义属性
  attributeList.value = await CustomizedAttributeAPI.getCustomizedAttribute(stepForm.value.categoryId);
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
  queryParamsResource.resourcesType = '2'
  queryParamsResource.resourcesTypeId = id
  queryParamsResource.cutternum = cutternum
  ProcessPlanDetailApi.updateCutternum(queryParamsResource)
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

/** 发起流程 */
const startProcessInstance = async (id: number) => {
  startProcessParams.id = id
  await ProcessSupplementApi.startProcessInstance(startProcessParams)
  message.success('发起成功')
  // 刷新列表
  await getList()
}
/** 查看流程进度 */
const handleProcessDetail = async (processInstanceId) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: processInstanceId
    }
  })
}
/** 初始化 **/
onMounted(async () => {
  getList()
})


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
  box-sizing: content-box;
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
