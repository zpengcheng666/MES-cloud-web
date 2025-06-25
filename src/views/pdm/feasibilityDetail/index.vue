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
            <el-input v-model="queryParams.partNumber" class="!w-240px" clearable placeholder="请输入零件图号" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FEASIBILITY_STAUS)" :key="dict.value"
                         :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="viewSelf">
            <el-checkbox v-model="queryParams.viewSelf" label="只看我的" />
          </el-form-item>
          <el-form-item>
            <el-button @click="getPartData">
              <Icon class="mr-5px" icon="ep:search" />搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon class="mr-5px" icon="ep:refresh" />重置
            </el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>
      <el-row :gutter="20">
        <el-col :span="15" :xs="24">
          <ContentWrap>
            <el-collapse v-model="activePartName">
              <el-collapse-item title="项目零件目录" name="1">
                <el-table :data="partDataList" style="cursor: pointer;height:240px;overflow-y: auto"
                          @row-click="partChange" @selection-change="handleSelectionChange" :row-key="getRowKeys">
                  <el-table-column align="center" label="序号" type="index" width="60px" />
                  <el-table-column align="center" label="零件图号" prop="partNumber" min-width="120px" />
                  <el-table-column align="center" label="零件名称" prop="partName" />
                  <el-table-column align="center" label="版次" prop="partVersion" min-width="50px" />
                  <el-table-column align="center" label="负责人" prop="reviewer" />
                  <el-table-column align="center" label="评估截止日期" prop="deadline" min-width="110px" :formatter="dateFormatter2" />
                  <el-table-column align="center" label="状态" prop="status" min-width="70px">
                    <template #default="scope">
                      <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_STAUS" :value="scope.row.status" />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作" min-width="80px">
                    <template #default="scope">
                      <el-button v-if="(scope.row.status === 2 || scope.row.status === 4) && scope.row.isPass != null && (userId+'' === scope.row.reviewedBy)" link type="primary" @click="startProcessInstance(scope.row.taskId)">发起</el-button>
                      <el-button v-if="(scope.row.status === 3 || scope.row.status === 4 || scope.row.status === 5) && (userId+'' === scope.row.reviewedBy)" link type="primary" @click="handleApplyDetail(scope.row.processInstanceId)">进度</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </ContentWrap>
          <ContentWrap v-show="showResult">
            <el-form :inline="true" class="-mb-15px">
              <el-form-item label="当前评估对象：" label-width="110px">
                <el-input v-model="partNumber" class="!w-150px" disabled />
              </el-form-item>
              <el-form-item label="评估结果：">
                <span v-if="feasibilityResultInfo.isPass == '0'">通过</span>
                <span v-if="feasibilityResultInfo.isPass == '1'">不通过</span>
                <span v-if="feasibilityResultInfo.isPass == '' && feasibilityResultInfo.isPass != '0'">无</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="openForm()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:circle-check" />评估结果
                </el-button>
              </el-form-item>
              <el-form-item label="评估者：">
                {{ reviewer }}
              </el-form-item>
            </el-form>
          </ContentWrap>
          <ContentWrap v-show="showResult">
            <el-tabs v-model="activeName" class="demo-tabs">
              <el-tab-pane label="设备" name="1">
                <el-button @click="openFormDevice()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择设备
                </el-button>
                <el-button @click="openFormOpinions()" plain type="success">
                  <Icon class="mr-5px" icon="ep:edit" />采购意见
                </el-button>
                <el-table :data="deviceData" border>
                  <el-table-column prop="code" label="设备编号" align="center" />
                  <el-table-column prop="name" label="设备名称" align="center" />
                  <el-table-column prop="specification" label="设备规格" align="center" />
                  <el-table-column label="预估工时(min)" align="center">
                    <template #default="scope">
                      <el-form-item prop="processingTime" class="mb-0px!">
                        <el-input-number v-model="scope.row.processingTime" :min="10" :disabled="!isOperator" clearable
                                         controls-position="right"
                                         @change="handlerProcessingTime(scope.row.id, scope.row.processingTime)" />
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                                 @click="handleDeleteDevice(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="刀具" name="2">
                <el-button @click="openFormCombination()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择刀具
                </el-button>
                <el-button @click="openFormDemandCutter()" plain type="success">
                  <Icon class="mr-5px" icon="ep:edit" />刀具采购意见
                </el-button>
                <el-button @click="openFormDemandHilt()" plain type="success">
                  <Icon class="mr-5px" icon="ep:edit" />刀柄采购意见
                </el-button>
                <el-table :data="combinationData" border>
                  <el-table-column prop="cutterGroupCode" label="刀组编码" align="center" />
                  <el-table-column align="center" label="刀柄类型" prop="taperTypeName">
                    <template #default="scope">
                      <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeName" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="hiltMark" label="刀柄通用规格" align="center" />
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                                 @click="handleDeleteCombination(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="工装" name="3">
                <el-button @click="openFormMaterial()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择工装
                </el-button>
                <el-button @click="openFormDemandMaterial()" plain type="success">
                  <Icon class="mr-5px" icon="ep:edit" />采购意见
                </el-button>
                <el-table :data="materialData" border>
                  <el-table-column prop="materialNumber" label="工装编号" align="center" />
                  <el-table-column prop="materialName" label="工装名称" align="center" />
                  <el-table-column prop="materialSpecification" label="工装规格" align="center" />
                  <el-table-column :width="60" align="center" label="操作">
                    <template #default="scope">
                      <el-button link type="danger" v-show="isOperator"
                                 @click="handleDeleteMaterial(scope.row.id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="量具" name="4">
                <el-button @click="openFormMeasure()" plain type="primary">
                  <Icon class="mr-5px" icon="ep:plus" />选择量具
                </el-button>
                <el-button @click="openFormDemandMeasure()" plain type="success">
                  <Icon class="mr-5px" icon="ep:edit" />采购意见
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
              </el-tab-pane>
              <el-tab-pane label="单件定额管理" name="5">
                <el-form ref="formRefQuota" :model="formData" :rules="formRules" label-width="120px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="材料牌号" prop="materialDesg">
                        <el-input v-model="formData.materialDesg" placeholder="请输入材料牌号" />
                      </el-form-item>
                   </el-col>
                    <el-col :span="12">
                      <el-form-item label="材料状态" prop="materialCondition">
                        <el-input v-model="formData.materialCondition" placeholder="请输入材料状态" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="长度(mm)" prop="length">
                        <el-input-number v-model="formData.length" :min="1" clearable controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="宽度(mm)" prop="width">
                        <el-input-number v-model="formData.width" :min="1" clearable controls-position="right"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="厚度(mm)" prop="height">
                        <el-input-number v-model="formData.height" :min="1" clearable controls-position="right"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工时定额(min)" prop="timeQuota">
                        <el-input-number v-model="formData.timeQuota" :min="10" clearable controls-position="right"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-button v-show="isOperator" type="primary" plain @click="submitForm" class="ml-120px">
                    <Icon icon="ep:circle-check" class="mr-5px" /> 保存
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="零件设计属性" name="6" style="height:170px;overflow-y: auto">
                <el-descriptions :column="1" border>
                  <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index + 1">
                    {{ item.attrValue }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="文件目录" name="7">
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
        </el-col>
        <el-col :span="9" :xs="24">
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
  <!-- 表单弹窗：评估结果录入 -->
  <FeasibilityResultForm ref="formRef" @success="getFeasibilityResult" />
  <!-- 表单弹窗：选择设备 -->
  <DeviceForm ref="formRefDevice" @success="getDeviceList" />
  <!-- 表单弹窗：设备采购意见 -->
  <ProcurementOpinionsForm ref="formRefOpinions" />
  <!-- 表单弹窗：选择工装 -->
  <MaterialForm ref="formRefMaterial" @success="getMaterialList" />
  <!-- 表单弹窗：工装采购意见 -->
  <DemandMaterialForm ref="formRefDemandMaterial" />
  <!-- 表单弹窗：选择量具 -->
  <MeasureForm ref="formRefMeasure" @success="getMeasureList" />
  <!-- 表单弹窗：量具采购意见 -->
  <DemandMeasureForm ref="formRefDemandMeasure"/>
  <!-- 表单弹窗：选择刀具 -->
  <CombinationForm ref="formRefCombination" @success="getCombinationList" />
  <!-- 表单弹窗：刀具采购意见 -->
  <DemandCutterForm ref="formRefDemandCutter" />
  <!-- 表单弹窗：刀柄采购意见 -->
  <DemandHiltForm ref="formRefDemandHilt" />
</template>
<script setup lang="ts">
import * as ProductApi from '@/api/pdm/product';
import {
  FeasibilityDetailApi,
  FeasibilityResultVO,
  ProjPartBomVO, QuotaPerPartVO
} from "@/api/pdm/feasibilityDetail";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter2 } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user'
import FeasibilityResultForm from "./FeasibilityResultForm.vue";
import DeviceForm from "./DeviceForm.vue"
import CombinationForm from "./CombinationForm.vue"
import MaterialForm from "./MaterialForm.vue"
import MeasureForm from "./MeasureForm.vue"
import ProcurementOpinionsForm from './ProcurementOpinionsForm.vue';
import DemandMaterialForm from './DemandMaterialForm.vue';
import DemandMeasureForm from './DemandMeasureForm.vue';
import DemandCutterForm from './DemandCutterForm.vue';
import DemandHiltForm from './DemandHiltForm.vue';
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import { PartMasterApi } from "@/api/pdm/part/partmaster";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted, ref} from "vue";
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const dataList = ref<any[]>([]) // 项目列表
const partDataList = ref<any[]>([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activePartName = ref(['1'])
const feasibilityResultInfo = ref({} as FeasibilityResultVO) // 评估结果
const productNumber = ref()
const partNumber = ref()
const reviewer = ref()
const showResult = ref(false) // 评估结果显隐
const type = ref('create')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const isOperator = ref(false) // 是否可操作按钮(负责人为当前登录者且状态为1待评估或2评估中4审批失败时可操作)
const activeName = ref(['1'])
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
const formRules = reactive({
  materialDesg: [{ required: true, message: '材料牌号不能为空', trigger: 'blur' }],
  materialCondition: [{ required: true, message: '材料状态不能为空', trigger: 'blur' }],
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
  resourcesType: '1'
})

const deleteResourceParams = reactive({
  projectCode: '',
  partVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  processingTime: 0
})

const startProcessParams = reactive({
  status: '3',
  id: ''
})

const getList = async () => {
  await getDataList()
  queryParams.projectCode = dataList.value[0].code;
  await getPartData()
}

const getDataList = async () => {
  dataList.value = await ProductApi.getProjectList(queryCodeParams)
}

const projectChange = async (val) => {
  showResult.value = false;
  queryParams.projectCode = val.code;
  await getPartData()
}

/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = await FeasibilityDetailApi.getProjPartBomListByProjectCode(queryParams)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getPartData()
}

const partChange = async (val) => {
  showResult.value = true;
  queryParamsResult.projectCode = queryParams.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  productNumber.value = val.productNumber
  partNumber.value = val.partNumber
  reviewer.value = val.reviewer
  const userIdStr = "'" + userId + "'"
  const reviewedByStr = "'" + val.reviewedBy + "'"
  if (userIdStr == reviewedByStr && (val.status == '1' || val.status == '2' || val.status == '4')) {
    isOperator.value = true;
  } else {
    isOperator.value = false;
  }
  await getFeasibilityResult()

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

  queryParamsResource.projectCode = queryParams.projectCode
  queryParamsResource.partVersionId = val.partVersionId

  deleteResourceParams.projectCode = queryParams.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  await getDeviceList()
  await getMaterialList()
  await getMeasureList()
  await getCombinationList()
  await getQuotaPerPart()
}

/** 评估结果 */
const getFeasibilityResult = async () => {
  feasibilityResultInfo.value = await FeasibilityDetailApi.getFeasibilityResultInfo(queryParamsResult)
  if (!feasibilityResultInfo.value) {
    feasibilityResultInfo.value = { isPass: "", reviewer: "无" }
    type.value = 'create';
  } else {
    type.value = 'update';
  }
  // 刷新零件目录状态
  await getPartData()
}

/** 评估结果操作 */
const formRef = ref()
const openForm = () => {
  formRef.value.open(type.value, isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 选择设备操作 */
const formRefDevice = ref()
const openFormDevice = () => {
  formRefDevice.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId, deviceIds.value)
}

/** 设备采购意见操作 */
const formRefOpinions = ref()
const openFormOpinions = () => {
  formRefOpinions.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 选中设备后重新加载列表 */
const getDeviceList = async () => {
  queryParamsResource.resourcesType = '1'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  deviceIds.value = []
  //制造资源列表过滤设备id
  resourcesData.value.forEach((item) => {
    deviceIds.value.push(item.resourcesTypeId)
  })
  deviceData.value = await FeasibilityDetailApi.getDeviceListByDeviceIds(deviceIds.value)
  //处理设备预估工时
  deviceData.value.forEach((item) => {
    resourcesData.value.forEach((resource) => {
      if (resource.resourcesTypeId == item.id) {
        item.processingTime = resource.processingTime
      }
    })
  })
  // 刷新零件目录状态
  await getPartData()
}

/** 删除设备操作 */
const handleDeleteDevice = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    deleteResourceParams.resourcesType = '1'
    deleteResourceParams.resourcesTypeId = id
    // 发起删除
    await FeasibilityDetailApi.deleteSelectedResource(deleteResourceParams)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDeviceList()
  } catch { }
}

/** 设置设备预估工时操作 */
const handlerProcessingTime = (id: string, processingTime: number) => {
  deleteResourceParams.resourcesTypeId = id
  deleteResourceParams.processingTime = processingTime
  FeasibilityDetailApi.updateProcessingTime(deleteResourceParams)
}

/** 选择工装操作 */
const formRefMaterial = ref()
const openFormMaterial = () => {
  formRefMaterial.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId, materialIds.value)
}

/** 工装采购意见操作 */
const formRefDemandMaterial = ref()
const openFormDemandMaterial = () => {
  formRefDemandMaterial.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 选中工装后重新加载列表 */
const getMaterialList = async () => {
  queryParamsResource.resourcesType = '3'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  materialIds.value = []
  //制造资源列表过滤工装id
  resourcesData.value.forEach((item) => {
    materialIds.value.push(item.resourcesTypeId)
  })
  materialData.value = await FeasibilityDetailApi.getMaterialListByMaterialIds(materialIds.value)
  // 刷新零件目录状态
  await getPartData()
}

/** 删除工装操作 */
const handleDeleteMaterial = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    deleteResourceParams.resourcesType = '3'
    deleteResourceParams.resourcesTypeId = id
    // 发起删除
    await FeasibilityDetailApi.deleteSelectedResource(deleteResourceParams)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getMaterialList()
  } catch { }
}


/** 选择量具操作 */
const formRefMeasure = ref()
const openFormMeasure = () => {
  formRefMeasure.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId, measureIds.value)
}

/** 量具采购意见操作 */
const formRefDemandMeasure = ref()
const openFormDemandMeasure = () => {
  formRefDemandMeasure.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 选中量具后重新加载列表 */
const getMeasureList = async () => {
  queryParamsResource.resourcesType = '4'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  measureIds.value = []
  //制造资源列表过滤量具id
  resourcesData.value.forEach((item) => {
    measureIds.value.push(item.resourcesTypeId)
  })
  measureData.value = await FeasibilityDetailApi.getMaterialListByMaterialIds(measureIds.value)
  // 刷新零件目录状态
  await getPartData()
}

/** 删除量具操作 */
const handleDeleteMeasure = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    deleteResourceParams.resourcesType = '4'
    deleteResourceParams.resourcesTypeId = id
    // 发起删除
    await FeasibilityDetailApi.deleteSelectedResource(deleteResourceParams)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getMeasureList()
  } catch { }
}

/** 选择刀组操作 */
const formRefCombination = ref()
const openFormCombination = () => {
  formRefCombination.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId, combinationIds.value)
}

/** 选中刀组后重新加载列表 */
const getCombinationList = async () => {
  queryParamsResource.resourcesType = '2'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  combinationIds.value = []
  //制造资源列表过滤刀组id
  resourcesData.value.forEach((item) => {
    combinationIds.value.push(item.resourcesTypeId)
  })
  combinationData.value = await FeasibilityDetailApi.getCombinationListByCombinationIds(combinationIds.value)
  // 刷新零件目录状态
  await getPartData()
}

/** 删除刀组操作 */
const handleDeleteCombination = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    deleteResourceParams.resourcesType = '2'
    deleteResourceParams.resourcesTypeId = id
    // 发起删除
    await FeasibilityDetailApi.deleteSelectedResource(deleteResourceParams)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getCombinationList()
  } catch { }
}

/** 刀具采购意见操作 */
const formRefDemandCutter = ref()
const openFormDemandCutter = () => {
  formRefDemandCutter.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 刀柄采购意见操作 */
const formRefDemandHilt = ref()
const openFormDemandHilt = () => {
  formRefDemandHilt.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}

/** 选中项目零件目录 */
const selectionList = ref<ProjPartBomVO[]>([])
const handleSelectionChange = (rows: ProjPartBomVO[]) => {
  selectionList.value = rows
}

const getRowKeys= (row) => {
  return row.id
}

/** 单件定额管理 */
const getQuotaPerPart = async () => {
  formData.value = await FeasibilityDetailApi.getQuotaPerPartInfo(queryParamsResult)
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

/** 提交单件定额信息 */
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
    // 更新技术评估任务状态
    await FeasibilityDetailApi.updateFeasibilityTaskStatus(queryParamsResult)
    // 刷新零件目录状态
    await getPartData()
    message.success('保存成功')
  } finally {
  }
}

/** 发起流程 */
const startProcessInstance = async (taskId: number) => {
  startProcessParams.id = taskId
  await FeasibilityDetailApi.startProcessInstance(startProcessParams)
  console.log(startProcessParams)
  message.success('发起成功')
  // 刷新零件目录状态
  await getPartData()
}

/** 查看流程进度 */
const handleApplyDetail = async (processInstanceId: number) => {
  console.log(processInstanceId)
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: processInstanceId
    }
  })
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
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
</style>
