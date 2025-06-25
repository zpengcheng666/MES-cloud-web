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
        <el-button v-show="showPartBtn" plain type="primary" @click="handleFeasibilityDetail()">
          <Icon class="mr-5px" icon="ep:circle-check" />查看评估
        </el-button>
        <el-button v-show="showPartBtn && isOperator" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />新增方案
        </el-button>
        <el-button v-show="showStartBtn" plain type="primary" @click="startProcessInstance()">
          <Icon class="mr-5px" icon="ep:circle-check" />发起
        </el-button>
        <el-button v-show="showDetailBtn" plain type="primary" @click="handleProcessDetail()">
          <Icon class="mr-5px" icon="ep:circle-check" />进度
        </el-button>
        <el-button v-show="showProcessBtn && isOperator && isOperatorUpdate" plain type="primary" @click="openProcedureForm()">
          <Icon class="mr-5px" icon="ep:plus" />新增工序
        </el-button>
        <el-button v-show="showProcedureBtn && isOperator && isOperatorUpdate" plain type="primary" @click="openStepForm()">
          <Icon class="mr-5px" icon="ep:plus" />新增工步
        </el-button>
        <el-button @click="test()">显示/隐藏</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-row :gutter="20">
    <el-col  :span="7" :xs="24">
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
    <el-col :span="leftColSpan" :xs="24">
      <ContentWrap v-show="showPartBtn">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="零部件属性" name="1" style="height:625px;overflow-y: auto">
            <div class="node-name">基本属性</div>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="项目号" width="80px">
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
              <el-descriptions-item label="状态">
                <template #default>
                  <dict-tag :type="DICT_TYPE.PDM_PROCESSPLAN_STATUS" :value="detailData.status" />
                </template>
              </el-descriptions-item>
              <el-descriptions-item label="编制截止时间">
                <span style="color:red">{{ detailData.deadline }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="工艺准备完成时间">
                {{ detailData.processPreparationTime }}
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
            <el-form ref="formRefPlan" :model="formProcessPlan" :rules="formProcessRules" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="工艺规程编号" prop="processCode">
                    <el-input v-model="formProcessPlan.processCode" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工艺规程名称" prop="processName">
                    <el-input v-model="formProcessPlan.processName" placeholder="请输入工艺规程名称" />
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
                    <el-input v-model="formProcessPlan.processVersion" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="材料编号" prop="materialNumber">
                    <el-input v-model="formProcessPlan.materialNumber" disabled />
                  </el-form-item>
                </el-col>
                <el-button v-show="isOperator && isOperatorUpdate" type="primary" @click="openNewForm('create')" class="choose">
                  选择
                </el-button>
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
                    <el-input v-model="formProcessPlan.singleSize" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="每毛坯件数" prop="groupSize">
                    <el-input-number v-model="formProcessPlan.groupSize" :min="1" clearable controls-position="right"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="工作说明" prop="description">
                    <el-input type="textarea" v-model="formProcessPlan.description" pleaceholder="请说明" />
                  </el-form-item>
                </el-col>
              </el-row>
              <div style="margin-left: 120px">
                <el-button v-show="isOperator && isOperatorUpdate" type="primary" plain @click="submitProcessForm">
                  <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                </el-button>
                <el-button v-show="isOperator" type="danger" plain @click="submitProcessdeleteForm">
                  <Icon icon="ep:delete" class="mr-5px" /> 删除
                </el-button>
                <el-button v-show="isSelf && isViewUp" type="success" plain @click="processUp">
                  <Icon icon="ep:upload" class="mr-5px" /> 升版
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane v-if="isSelf && isViewUp" label="工艺更改单" name="2">
            <el-button type="primary" plain @click="openOrderForm('create')">
              <Icon icon="ep:plus" class="mr-5px" /> 添加更改单
            </el-button>
            <el-table :data="ChangeOrderList" border>
              <el-table-column prop="changeCode" label="更改单号" align="center" />
              <el-table-column align="center" label="更改原因"  prop="changeReason">
                <template #default="scope" >
                  <dict-tag :type="DICT_TYPE.PDM_PROCESS_CHANGE_REASION " :value="scope.row.changeReason" />
                </template>
              </el-table-column>
              <el-table-column prop="changeContent" label="更改内容" align="center" :show-overflow-tooltip="true" />
              <el-table-column prop="workingOpinions" label="在制品处理" align="center" :show-overflow-tooltip="true" />
              <el-table-column align="center" label="状态"  prop="status">
                <template #default="scope" >
                  <dict-tag :type="DICT_TYPE.PDM_PROCESS_CHANGE_ORDER_STATUS " :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" :min-width="85">
                <template #default="scope">
                  <el-button link type="primary" @click="openOrderForm('update', scope.row.id)" v-if="(scope.row.status === 0 || scope.row.status === 2)">
                    编辑
                  </el-button>
                  <el-button link type="danger" @click="handleDeleteChangeOrder(scope.row.id)" v-if="(scope.row.status === 0 || scope.row.status === 2)">
                    删除
                  </el-button>
                  <el-button link type="primary" @click="startOrderInstance(scope.row.id)" v-if="(scope.row.status === 0 || scope.row.status === 2)" >发起</el-button>
                  <el-button link type="primary" @click="handleOrderDetail(scope.row.processInstanceId)" v-if="(scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3)">进度</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showProcedureBtn">
        <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
          <el-tab-pane label="工序属性" name="1">
            <el-form ref="formProcedure" :rules="procedureFormRules" :model="procedureForm" label-width="110px">
              <el-row :gutter="20">
                <el-col :span="12">
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
                <el-col :span="12">
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
              <el-form-item label="工作说明">
                <iframe ref="procedureFormRef"  :src="src"  width="100%" height="300px" style="border: none"></iframe>
              </el-form-item>
              <div style="margin-left: 110px">
                <el-button type="primary" plain v-show="isOperator && isOperatorUpdate" @click="SaveProcedure">
                  <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                </el-button>
                <el-button type="danger" plain v-show="isOperator && isOperatorUpdate" @click="handleDeleteProcedure">
                  <Icon icon="ep:delete" class="mr-5px" />删除
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="制造资源" name="2">
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator && isOperatorUpdate" @click="openFormDeviceProcedure()" plain type="primary">
                <Icon class="mr-5px" icon="ep:plus" />选择设备
              </el-button>
              <el-table :data="deviceData" border>
                <el-table-column prop="code" label="设备编号" align="center" />
                <el-table-column prop="name" label="设备名称" align="center" />
                <el-table-column prop="specification" label="设备规格" align="center" />
                <el-table-column :width="60" align="center" label="操作">
                  <template #default="scope">
                    <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                               @click="handleDeleteDeviceProcedure(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator && isOperatorUpdate" @click="openFormMaterialProcedure()" plain type="primary">
                <Icon class="mr-5px" icon="ep:plus" />选择工装
              </el-button>
              <el-table :data="materialData" border>
                <el-table-column prop="materialNumber" label="工装编号" align="center" />
                <el-table-column prop="materialName" label="工装名称" align="center" />
                <el-table-column prop="materialSpecification" label="工装规格" align="center" />
                <el-table-column :width="60" align="center" label="操作">
                  <template #default="scope">
                    <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                               @click="handleDeleteMaterialProcedure(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-bottom: 10px">
              <el-button v-show="isOperator && isOperatorUpdate" @click="openFormMeasureProcedure()" plain type="primary">
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
<!--            <el-button v-show="isOperator && isOperatorUpdate" @click="openProcedureFileForm()" plain type="primary">-->
<!--              <Icon class="mr-5px" icon="ep:plus" />上传草图-->
<!--            </el-button>-->
            <el-button v-show="isOperator && isOperatorUpdate" @click="openDesignEditForm()" plain type="primary">
              <Icon class="mr-5px" icon="ep:plus" />在线画图
            </el-button>
            <el-table :data="procedureFileData" border>
              <el-table-column prop="sketchCode"  label="草图编号" align="center">
                <template #default="scope">
                  <el-input v-model="scope.row.sketchCode" size="small" :disabled="!isOperator && !isOperatorUpdate"  clearable
                            @change="handlerSketchCode(scope.row.id, scope.row.sketchCode)"/>
                </template>
              </el-table-column>
<!--              <el-table-column label="草图" align="center" prop="sketchUrl">-->
<!--                <template #default="scope">-->
<!--                  &lt;!&ndash; 图片预览 &ndash;&gt;-->
<!--                  <el-image v-if="scope.row.sketchUrl.indexOf('.dxf')<0" :src="scope.row.sketchUrl" :preview-src-list="[scope.row.sketchUrl]"-->
<!--                            class="w-32px h-32px" :preview-teleported="true" />-->
<!--                  &lt;!&ndash; 草图预览 &ndash;&gt;-->
<!--                  <XButton v-if="scope.row.sketchUrl.indexOf('.dxf')>=0" preIcon="ep:view" title="预览" @click="handlePreview(scope.row.id)" />-->
<!--                </template>-->
<!--              </el-table-column>-->
              <el-table-column :width="180" align="center" label="操作">
                <template #default="scope">
                  <el-button v-if="scope.row.sketchUrl.indexOf('.dxf')>=0" fit="cover" link type="primary" v-show="isOperator && isOperatorUpdate"
                             @click="openDesignEditForm(scope.row.id)">
                    在线编辑</el-button>
                  <el-button fit="cover" link type="danger" v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteProcessdurefile(scope.row.id)">
                    删除</el-button>
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
              <el-table-column label="技术要求" align="center" width="90">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.content`" class="mb-0px!">
                    <el-input v-model="row.content" placeholder="请输入技术要求"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="上限值" align="center" width="80">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.maxValue`" class="mb-0px!">
                    <el-input v-model="row.maxValue" placeholder="请输入上限值"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="下限值" align="center" width="80">
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
              <el-table-column label="检测顺序" align="center" min-width="130" prop="number">
                <template #default="{ row, $index }">
                  <el-form-item :prop="`${$index}.number`" class="mb-0px!">
                    <el-input-number v-model="row.number" placeholder="请输入检测顺序"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" fixed="right" label="操作" min-width="60">
                <template #default="{ row,$index }">
                  <el-button v-if="row.id != undefined && row.id != ''" fit="cover" link type="danger" v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteProcedureSchemaItem(row.id)">
                    删除
                  </el-button>
                  <el-button v-if="row.id == undefined || row.id == ''" fit="cover" link type="danger" v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteItem($index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row justify="center" class="mt-3">
              <el-button @click="handleAdd" round v-show="isOperator && isOperatorUpdate">+ 添加检测项</el-button>
            </el-row>
            <el-row justify="center" class="mt-3">
              <el-button @click="saveProcedureSchemaItem" type="primary" v-show="isOperator && isOperatorUpdate" >保存</el-button>
            </el-row>
            <ProcedureInspectionItemChoose ref="inspectionItemChooseRef"
                                           @getInspectionItem="getInspectionItem"
                                           :itemInfo="itemInfo"/>
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>
      <ContentWrap v-show="showStepBtn">
        <el-tabs v-model="activeNamePartDetail" model-value='1' class="demo-tabs">
          <el-tab-pane label="工步属性" name="1" style="height:650px;overflow-y: auto;overflow-x: hidden">
            <el-form ref="formStep" :rules="stepFormRules" :model="stepForm" label-width="125px">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="工步序号" prop="stepNum">
                    <el-input v-model="stepForm.stepNum" class="!w-130px" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工步名称" prop="stepName">
                    <el-input v-model="stepForm.stepName" class="!w-130px" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="关重属性" class="!w-240px" prop="stepProperty">
                    <el-select v-model="stepForm.stepProperty" class="!w-200px">
                      <el-option v-for="st in getIntDictOptions(DICT_TYPE.PDM_PROCESSPLAN_PROPERTY)" :key="st.value"
                                 :label="st.label" :value="st.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工时(min)" prop="processingTime">
                    <el-input v-model="stepForm.processingTime" clearable class="!w-130px" />
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
                      class="w-1/1" @change="changeStepType()"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="工作说明" prop="description">
                    <iframe id="BlMarkdownEditor" ref="StepFormRef" :src="src" width="100%" height="300px" style="border: none"></iframe>
                  </el-form-item>
                </el-col>
              </el-row>
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
              <div style="margin-left: 125px">
                <el-button type="primary" plain v-show="isOperator && isOperatorUpdate" @click="SaveForm">
                  <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                </el-button>
                <el-button type="danger" plain v-show="isOperator && isOperatorUpdate" @click="handleDeleteStep">
                  <Icon icon="ep:delete" class="mr-5px" />删除
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="设备" name="2">
            <el-button v-show="isOperator && isOperatorUpdate" @click="openFormDeviceStep()" plain type="primary">
              <Icon class="mr-5px" icon="ep:plus" />选择设备
            </el-button>
            <el-table :data="deviceData" border>
              <el-table-column prop="code" label="设备编号" align="center" />
              <el-table-column prop="name" label="设备名称" align="center" />
              <el-table-column prop="specification" label="设备规格" align="center" />
              <el-table-column :width="60" align="center" label="操作">
                <template #default="scope">
                  <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteDeviceStep(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="刀具" name="3" v-if="isViewCutter">
            <el-button v-show="isOperator && isOperatorUpdate" @click="openFormCombinationStep()" plain type="primary">
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
                  <el-button link type="danger" v-show="isOperator && isOperatorUpdate"
                             @click="handleDeleteCombinationStep(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="执行程序" name="5" style="height:200px;overflow-y: auto">
            <el-button v-show="isOperator && isOperatorUpdate" @click="openNcForm()" plain type="primary">
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
                    <el-button link type="danger" style="font-size: 15px; margin-left: 10px;" v-show="isOperator && isOperatorUpdate"
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
    <el-col :span="17 - leftColSpan" :xs="24">
      <ContentWrap v-show="!showModel">
        <div style="width:600px;height:680px">三维图</div>
      </ContentWrap>
      <ContentWrap v-show="showModel"
                   :style="{ transform: 'scale(${scaleFactor})' }"
                   :class="{ 'full-screen': isImageFullScreen }">
        <div style="cursor: pointer;position: absolute;top: 5px;right: 17px;">
          <img src="../../../../src/assets/imgs/fullscreen.png"                 style="width: 20px;height: 20px"
               @click="showFullScreen"
               :style="{ transform: isImageFullScreen ? 'scale(2)' : 'scale(1)' }"/>
        </div>
        <threejsModel :modelUrl="modelUrl" :processInfo="processInfo"/>
      </ContentWrap>
    </el-col>
  </el-row>
  <!-- 表单弹窗：工艺方案编制添加 -->
  <ProcessInsertForm ref="formRef" @success="getTree" />
  <!-- 表单弹窗：获取物料信息 -->
  <MaterialInsertForm ref="MaterialInsert" @success="getMaterialInsertList" />
  <!-- 表单弹窗：选择已定版工艺规程 -->
  <ProcessSelectForm ref="formRefProcess" @success="getTree" />
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
  <!-- 工艺更改单弹窗-->
  <OrderChangeForm ref="formRefOrder" @success="changeOrderList" />
  <!-- 表单弹窗：工艺规程升版关联更改单 -->
  <ProcessUpForm ref="formRefProcessUp" @success="getBack" />
  <!-- 在线编辑草图弹窗-->
  <DesignEditForm ref="formRefCadEdit" @success="getProcedurelist" />
  <!-- 在线预览草图弹窗-->
  <DesignViewForm ref="formRefCadView" />

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
  ProcessPlanApi
} from "@/api/pdm/processPlan";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useUserStore } from '@/store/modules/user'
import ProcessSelectForm from "./ProcessSelectForm.vue"
import MaterialInsertForm from './MaterialInsertForm.vue'
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import {PartMasterApi, PartMasterVO} from "@/api/pdm/part/partmaster";
import ProcessInsertForm from './ProcessInsertForm.vue';
import { defaultProps, handleTree } from '@/utils/tree'
import { ElTree } from "element-plus";
import ProcedureForm from "./procedureForm.vue";
import ProcedureFileForm from "./ProcedureFileForm.vue"
import DeviceProcedureForm from "./DeviceProcedureForm.vue"
import MaterialProcedureForm from "./MaterialProcedureForm.vue"
import MeasureProcedureForm from "./MeasureProcedureForm.vue"
import ProcedureInspectionItemChoose from "./ProcedureInspectionItemChoose.vue"
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
import StepForm from "./stepForm.vue";
import CombinationStepForm from "./CombinationStepForm.vue";
import NcForm from "./NcForm.vue";
import DeviceStepForm from "./DeviceStepForm.vue";
import { StepCategoryApi, StepCategoryVO } from '@/api/pdm/stepCategory'
import { CustomizedAttributeAPI } from '@/api/pdm/customizedAttribute'
import OrderChangeForm from "@/views/pdm/processChange/OrderChangeForm.vue";
import ProcessUpForm from "./ProcessUpForm.vue"
import {getAccessToken} from "@/utils/auth";
const VITE_BASE_EDITOR_URL = import.meta.env.VITE_BASE_EDITOR_URL
const src = ref(VITE_BASE_EDITOR_URL)
import DesignEditForm from "./design2D/DesignEditForm.vue"
import DesignViewForm from "./design2D/DesignViewForm.vue"
const items = ref([]); //循环processVersion和procedureId
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const itemInfo = ref({})
const showModel = ref(false) // 三维图显示

const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);
const procedureFormRef = ref()
const StepFormRef = ref()
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const categoryList = ref<StepCategoryVO[]>([]) // 工步分类列表
const attributeList = ref([]) // 工步自定义属性
const ChangeOrderList = ref([]) // 更改单列表的数据
const currentNode = ref() // 当前选中树节点
const currentNodeData = ref() // 当前选中树节点data
const treeList = ref<Tree[]>([]) // 树形结构
const showPartBtn = ref(false) // 零件节点显隐
const showProcessBtn = ref(false) // 工艺方案节点显隐
const showProcedureBtn = ref(false) // 工序节点显隐
const showStepBtn = ref(false) // 工步节点显隐
const showStartBtn = ref(false) // 发起审批按钮显隐
const showDetailBtn = ref(false) // 查看审批进度按钮显隐
const isViewCutter = ref(false) // 选择刀具显隐
const isViewUp = ref(false) // 工艺规程升版显隐(已定版的工艺规程可显示)
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
const detailData = ref({} as PartMasterVO) // 零件基本属性
const queryFormRef = ref() // 搜索的表单
const productNumber = ref()
const taskId = ref()
const processInstanceId = ref()
const type = ref('create')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const isSelf = ref(false) //负责人是否本人
const isOperator = ref(false) // 是否可操作按钮(负责人为当前登录者且状态为可编辑时可操作)
const isOperatorUpdate = ref(false) // 是否可操作更改
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
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRefProcess = ref()
const leftColSpan = ref(9)
const test = () => {
  showModel.value = !showModel.value; // 切换 showModel 的值
  leftColSpan.value = showModel.value ? 9 : 17; // 根据 showModel 的值调整 leftColSpan
}
const openForm = async (type: string, id?: number) => {
  const count = await ProcessPlanApi.getProcessCountByPartVersionId(queryParamsProcess.partVersionId, queryParamsProcess.processCondition)
  if (count === 0) {//零件+加工状态下无已定版工艺规程，创建工艺规程
    formRef.value.open(type, id, queryParamsProcess.partVersionId, queryParamsProcess.processCode, queryParamsProcess.projectCode, queryParamsProcess.processTaskId, queryParamsProcess.processCondition)
  } else {//零件+加工状态下存在已定版工艺规程，选择其一或升版
    formRefProcess.value.open(queryParamsProcess.partVersionId, queryParamsProcess.projectCode, queryParamsProcess.processTaskId, queryParamsProcess.processCondition)
  }
}


const formProcessPlan = ref({
  id: undefined,
  processId: undefined,
  name: undefined,
  leftName: undefined,
  isValid: undefined,
  processRouteName: undefined,
  partVersionId: undefined,
  processCode: undefined,
  processName: undefined,
  processSchemeCode: undefined,
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
  processChangeId: undefined,
  changeCode: undefined,
  changeReason: undefined,
  changeTag: undefined,
  changeProcedureNum: undefined,
  changeStepNum: undefined,
  changeContent: undefined,
  status: undefined,
  processChangeId: undefined,
})

const procedureSchemaItemParam = reactive({
  processVersionId: '',
  procedureId: '',
  inspectionSchemeId: '',
})

const formProcessRules = reactive({
  processCode: [{ required: true, message: '工艺规程编号不能为空', trigger: 'blur' }],
  processName: [{ required: true, message: '工艺规程名称不能为空', trigger: 'blur' }],
  processRouteName: [{ required: true, message: '请选择加工路线', trigger: 'blur' }],
  materialNumber: [{ required: true, message: '请选择材料编号', trigger: 'blur' }],
  singleSize: [{ required: true, message: '毛坯外形尺寸不能为空', trigger: 'blur' }],
  groupSize: [{ required: true, message: '每毛坯件数不能为空', trigger: 'blur' }],
})

const queryParams = reactive({
  projectCode: '',
  processVersionId: '',
  partNumber: '',
  status: undefined,
  viewSelf: false,
  projectStatus: 0,
  processChangeId: '',
  changeCode: '',
  changeReason: '',
  changeTag: '',
  changeProcedureNum: '',
  changeStepNum: '',
  changeContent: '',
})

const queryParamsResult = reactive({
  projectCode: '',
  partVersionId: '',
  status: '2',
  processVersionId:''
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
  source: '',
  processId: '',
  processChangeId: '',
  status: '2',
  processCondition: '',
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
  descriptionPreview:'',
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
    processCode: undefined,
    processName: undefined,
    processSchemeCode: undefined,
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
    status: undefined,
    processChangeId: undefined,
  }
  formRefPlan.value?.resetFields()
  dataRouteListSecond.value = []
}
const procedureFormRules = reactive({
  procedureNum: [{ required: true, message: '工序序号不能为空', trigger: 'blur' }],
  procedureName: [{ required: true, message: '工序名称不能为空', trigger: 'blur' }],
  procedureProperty: [{ required: true, message: '关重属性不能为空', trigger: 'blur' }],
  isInspect: [{ required: true, message: '请选择是否专检！', trigger: 'blur' }],
  isOut: [{ required: true, message: '请选择是否外委！', trigger: 'blur' }]
});
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
  queryParamsProcess.processCondition = val.processCondition
  productNumber.value = val.productNumber
  const userIdStr = "'" + userId + "'"
  const reviewedByStr = "'" + val.reviewedBy + "'"
  if(userIdStr == reviewedByStr) {
    isSelf.value = true;
  } else {
    isSelf.value = false;
  }
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
  let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
}



/** 点击工艺方案节点 */
const processChange = async (val, processStatus) => {
  queryParamsResult.projectCode = val.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  const userIdStr = "'" + userId + "'"
  const reviewedByStr = "'" + val.reviewedBy + "'"
  if(userIdStr == reviewedByStr) {
    isSelf.value = true;
  } else {
    isSelf.value = false;
  }
  if (userIdStr == reviewedByStr && (val.status == '1' || val.status == '2' || val.status == '4')) {
    isOperator.value = true;
  } else {
    isOperator.value = false;
  }
  showStartBtn.value = false;
  showDetailBtn.value = false;
  activeNameProcess.value = '1'
  queryParamsResource.projectCode = val.projectCode
  queryParamsResource.partVersionId = val.partVersionId
  queryParamsResource.processVersionId = val.id
  deleteResourceParams.projectCode = val.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  deleteResourceParams.processVersionId = val.id
  await changeOrderList()
  isOperatorUpdate.value = isOperator.value;
  if (val.source === 2) {//若关联已定版工艺规程，则无法更改工艺方案、可删除
    isOperatorUpdate.value = false;
  }
  if(processStatus === 3) {//已定版工艺规程
    isViewUp.value = true;
  } else {
    isViewUp.value = false;
  }
}

const changeOrderList = async() => {
  ChangeOrderList.value = await ProcessPlanDetailApi.getChangeOrderList(queryParamsResource);
  // todo 增加升版时关联的更改单
  if(formProcessPlan.value.processChangeId) {
    const processChange = await ProcessPlanDetailApi.getProcessChangeById(formProcessPlan.value.processChangeId)
    ChangeOrderList.value.push(processChange)
  }
}

//选择
const MaterialInsert = ref()
const openNewForm = (type: string, id?: number) => {
  MaterialInsert.value.open(type, id)
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

//修改工艺方案编制
const submitProcessForm = async () => {
  // 校验表单
  if (!formRefPlan.value) return
  const valid = await formRefPlan.value.validate()
  if (!valid) return
  try {
    if (formProcessPlan.value.materialSpecification === null) {
      formProcessPlan.value.materialSpecification = ''
    }
    await ProcessPlanApi.updateProcess(formProcessPlan.value)
    message.success('保存成功')
    // 局部刷新结构树-更新工艺规程节点名称
    currentNodeData.value.name = formProcessPlan.value.processCode+'_'+formProcessPlan.value.processSchemeCode+'_'+formProcessPlan.value.processVersion
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

/** 工艺规程升版 */
const formRefProcessUp = ref()
const processUp = async () => {
  formRefProcessUp.value.open(queryParamsProcess.projectCode, queryParamsProcess.processVersionId)
}
/** 工艺规程升版关联更改单回调 */
const getBack = async (processChangeId) => {
  queryParamsProcess.processChangeId = processChangeId
  queryParamsProcess.processId = formProcessPlan.value.processId
  await ProcessPlanApi.saveProcessUp(queryParamsProcess)
  // 更新工艺方案任务状态
  await ProcessPlanApi.updateFeasibilityTaskStatus(queryParamsProcess)
  message.success('升版成功')
  //刷新结构树
  await getTree()
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/** 处理结构树被点击 */
const handleNodeClick = async (row) => {
  console.log("点击动作",row)
  currentNodeData.value = row;
  currentNode.value = treeRef.value.getNode(row)
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
    await processChange(row, formProcessPlan.value.status)
  } else if (row.type === 3) {//工序节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = true;
    showStepBtn.value = false;
    queryParamsResource.procedureId = row.id;
    queryParamsResource.id = row.id
    queryParamsResource.processVersionId = row.parentId

    procedureSchemaItemParam.procedureId = row.id;
    procedureSchemaItemParam.processVersionId = row.parentId

    // todo 工序节点部分属性取父级节点(工艺规程属性)
    let projectCode = currentNode.value.parent.data.projectCode
    let reviewedBy = currentNode.value.parent.data.reviewedBy
    let status = currentNode.value.parent.data.status
    let source = currentNode.value.parent.data.source
    queryParamsResource.projectCode = projectCode
    const userIdStr = "'" + userId + "'"
    const reviewedByStr = "'" + reviewedBy + "'"
    if(userIdStr == reviewedByStr) {
      isSelf.value = true;
    } else {
      isSelf.value = false;
    }
    if (userIdStr == reviewedByStr && (status == '1' || status == '2' || status == '4')) {
      isOperator.value = true;
    } else {
      isOperator.value = false;
    }
    isOperatorUpdate.value = isOperator.value;
    if (source === 2) {//若关联已定版工艺规程，则无法更改、删除工序
      isOperatorUpdate.value = false;
    }
    showStartBtn.value = false;
    showDetailBtn.value = false;
    procedureForm.value = await ProcessPlanDetailApi.getProcedure(queryParamsResource.id)
    const iFrame = procedureFormRef.value;
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
  } else if(row.type === 4) {//工步节点
    showPartBtn.value = false;
    showProcessBtn.value = false;
    showProcedureBtn.value = false;
    showStepBtn.value = true;
    showStartBtn.value = false;
    showDetailBtn.value = false;
    // todo 工步节点部分属性取父级再父级节点(工艺规程属性)
    let reviewedBy = currentNode.value.parent.parent.data.reviewedBy
    let status = currentNode.value.parent.parent.data.status
    let source = currentNode.value.parent.parent.data.source
    //可操作按钮权限
    const userIdStr = "'" + userId + "'"
    const reviewedByStr = "'" + reviewedBy + "'"
    if(userIdStr == reviewedByStr) {
      isSelf.value = true;
    } else {
      isSelf.value = false;
    }
    if (userIdStr == reviewedByStr && (status == '1' || status == '2' || status == '4')) {
      isOperator.value = true;
    } else {
      isOperator.value = false;
    }
    isOperatorUpdate.value = isOperator.value;
    if (source === 2) {//若关联已定版工艺规程，则无法更改、删除工步
      isOperatorUpdate.value = false;
    }
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



/** 查看技术评估详情 */
const handleFeasibilityDetail = async () => {
  push({
    name: 'PDMFeasibilityDetailNew',
    query: {
      id: queryParamsProcess.feasibilityTaskId
    }
  })
}

/** 发起流程 */
const startProcessInstance = async () => {
  startProcessParams.id = taskId.value
  await ProcessPlanApi.startProcessInstance(startProcessParams)
  message.success('发起成功')
  //刷新结构树
  await getTree()
}


//发起更改单流程
const startOrderParams = reactive({
  status: '1',
  id: ''
})


/** 查看流程进度 */
const handleOrderDetail = async (id: number) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: id
    }
  })
}

//发起更改单流程
const startOrderInstance = async (id: number) => {
  startOrderParams.id = id
  await ProcessPlanDetailApi.startOrderChangeInstance(startOrderParams)
  message.success('发起成功')
  // 刷新更改单列表
  await changeOrderList()
}

//删除工艺更改单
const handleDeleteChangeOrder = async (id: number) => {
  try {
    //删除的二次确认
    await message.delConfirm()
    await ProcessPlanDetailApi.deleteChangeOrderById(id)
    message.success(t('common.delSuccess'))
    // 刷新更改单列表
    await changeOrderList()
  } catch { }
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

/**在线编制草图弹窗 */
const formRefCadEdit = ref()
const openDesignEditForm = (id?: number) => {
  formRefCadEdit.value.open(id, queryParamsResource.processVersionId, queryParamsResource.procedureId, '0');
}
/**预览草图弹窗 */
const formRefCadView = ref()
const handlePreview = (id: string) => {
  formRefCadView.value.open(id, queryParamsResource.processVersionId, queryParamsResource.procedureId);
}

/** 工序草图-输入草图编号实时修改*/
const handlerSketchCode = (id: string, sketchCode: string) => {
  let data = {id:id,processVersionId:queryParamsResource.processVersionId,procedureId:queryParamsResource.procedureId,sketchCode:sketchCode}
  ProcessPlanDetailApi.saveProcedureFile(data)
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

//工序表单
const formProcedure = ref()
const receivedDescription = ref();
const receivedContentHtml = ref();

// 监听子页面数据
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'description') {
    receivedDescription.value = data.data;
    console.log(receivedDescription.value)
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
  // 校验表单
  const valid = await formProcedure.value.validate()
  if (!valid) return
  try {
    const data = procedureForm.value as unknown as ProcessPlanDetailVO
    procedureForm.value.description =  receivedDescription.value
    procedureForm.value.descriptionPreview = receivedContentHtml.value
    data.id = procedureForm.value.id
    if (data.id) {
      await ProcessPlanDetailApi.updateProcedure(data)
    }
    message.success('保存成功')
    // 局部刷新结构树-更新工序节点名称
    currentNodeData.value.name = data.procedureNum+'('+data.procedureName+')'
  } finally {
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
    isOperator.value = false;
  } finally { }
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

const formRefProcedure = ref()
const openProcedureForm = () => {
  formRefProcedure.value.open(queryParamsResource.processVersionId);
};

/** 新增工序后局部刷新结构树 */
const refreshTreeByProcedure = async (procedureId, procedureNum, procedureName) => {
  let procedureNode = {
    type:3,id:procedureId,parentId:currentNodeData.value.id,name:procedureNum+'('+procedureName+')',
    serialnum:procedureNum,partVersionId:currentNodeData.value.partVersionId,
    source:currentNodeData.value.source,partNumber:currentNodeData.value.partNumber,
    processVersionId:currentNodeData.value.processVersionId,
    status:currentNodeData.value.status,reviewedBy:currentNodeData.value.reviewedBy,
    projectCode:currentNodeData.value.projectCode,processCondition:currentNodeData.value.processCondition
  }
  if(currentNodeData.value.children) {
    currentNodeData.value.children.push(procedureNode)
  } else {
    currentNodeData.value.children = []
    currentNodeData.value.children.push(procedureNode)
  }
}

//检测项
const getProcedureSchemaList = async () => {
  const schemaItem = await ProcessPlanDetailApi.getProcedureSchemaItem(procedureSchemaItemParam)
  if(schemaItem.inspectionSchemeId) {
    procedureSchemaItemParam.inspectionSchemeId = schemaItem.inspectionSchemeId
  } else {
    procedureSchemaItemParam.inspectionSchemeId = ''
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
  row.processVersionId = procedureSchemaItemParam.processVersionId
  row.procedureId = procedureSchemaItemParam.procedureId
  row.inspectionSchemeId = procedureSchemaItemParam.inspectionSchemeId
  ProcedureSchemaItem.value.push(row)
}

/** 删除动态添加的检测项 */
const handleDeleteItem = (index) => {
  ProcedureSchemaItem.value.splice(index, 1)
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const saveProcedureSchemaItem = async () => {
  formLoading.value = true
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

const formRefOrder = ref()
const openOrderForm = (type: string, id?: number) => {
  formRefOrder.value.open(type, id, queryParamsResource.processVersionId,queryParamsResource.projectCode);
};

const formRefStep = ref()
const openStepForm = () => {
  formRefStep.value.open(queryParamsResource.processVersionId, queryParamsResource.procedureId);
};

const receivedContent = ref()
const receivedContentHtmls = ref()

// 监听子页面数据
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
        if(item.isMultvalues === 0 && item.attrDefaultValue != null && !(item.attrDefaultValue instanceof Array)) {
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
    isOperator.value = false;
  } finally { }
}

/** 新增工步后局部刷新结构树 */
const refreshTreeByStep = async (stepId, stepNum, stepName) => {
  let stepNode = {
    type:4,id:stepId,parentId:currentNodeData.value.id,name:stepNum+'('+stepName+')',
    serialnum:stepNum,partVersionId:currentNodeData.value.partVersionId,
    source:currentNodeData.value.source,partNumber:currentNodeData.value.partNumber,
    processVersionId:currentNodeData.value.processVersionId,
    status:currentNodeData.value.status,reviewedBy:currentNodeData.value.reviewedBy,
    projectCode:currentNodeData.value.projectCode,processCondition:currentNodeData.value.processCondition
  }
  if(currentNodeData.value.children) {
    currentNodeData.value.children.push(stepNode)
  } else {
    currentNodeData.value.children = []
    currentNodeData.value.children.push(stepNode)
  }
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
  formProcessPlan.value.materialNumber = ''
  formProcessPlan.value.materialName = ''
  formProcessPlan.value.materialCode = ''
  formProcessPlan.value.materialSpecification = ''
  formProcessPlan.value.materialId = ''
  formProcessPlan.value.materialCode = data.materialCode
  formProcessPlan.value.materialName = data.materialName
  formProcessPlan.value.materialNumber = data.materialNumber
  formProcessPlan.value.materialSpecification = data.materialSpecification
  formProcessPlan.value.materialId = data.id
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
  await getList();
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  const taskIdFromRoute = route.query.id;
  if (taskIdFromRoute) {
    const detailNewData = await ProcessPlanApi.getPartDetailNewHome(taskIdFromRoute)
    const matchingRow = detailNewData.find(row => row.taskId === taskIdFromRoute);
    matchingRow.type = 1;
    if (matchingRow) {
      handleNodeClick(matchingRow);
    }
  }
});
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
import {toRefs,onMounted} from 'vue'
import {useRoute} from 'vue-router'
let route = useRoute()
let {query} = toRefs(route)


/** 切换工步类型 */
const changeStepType = async () => {
  // 取分类自定义属性
  attributeList.value = await CustomizedAttributeAPI.getCustomizedAttribute(stepForm.value.categoryId);
}
</script>
<!--三维图-->
<style scoped>
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
