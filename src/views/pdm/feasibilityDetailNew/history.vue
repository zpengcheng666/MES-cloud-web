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
    <el-col :span="16" :xs="24">
      <ContentWrap>
        <el-collapse v-model="activePartName">
          <el-collapse-item title="项目零件目录" name="1">
            <el-table :data="partDataList" style="cursor: pointer;height:240px;overflow-y: auto"
                      @row-click="partChange" @selection-change="handleSelectionChange" :row-key="getRowKeys">
              <el-table-column align="center" label="序号" type="index" width="55px" />
              <el-table-column align="center" label="项目号" prop="projectCode" width="130px"/>
              <el-table-column align="center" label="零件图号" prop="partNumber" />
              <el-table-column align="center" label="零件名称" prop="partName" />
              <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
              <el-table-column align="center" label="评估者" prop="reviewer" width="115px" />
              <el-table-column align="center" label="评估结果" prop="status" width="80px">
                <template #default="scope">
                  <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_RESULT" :value="scope.row.isPass" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="不通过原因" prop="reason" width="120px" :show-overflow-tooltip="true"/>
              <el-table-column align="center" label="操作" width="70px">
                <template #default="scope">
                  <el-button v-if="(scope.row.status === 3 || scope.row.status === 4 || scope.row.status === 5) && (userId+'' === scope.row.reviewedBy)" link type="primary" @click="handleApplyDetail(scope.row.processInstanceId)">进度</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </ContentWrap>
      <ContentWrap v-show="showResult">
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane label="设备" name="1">
            <el-button @click="openFormOpinions()" plain type="success">
              <Icon class="mr-5px" icon="ep:edit" />采购意见
            </el-button>
            <el-table :data="deviceData" border>
              <el-table-column prop="code" label="设备编号" align="center" />
              <el-table-column prop="name" label="设备名称" align="center" />
              <el-table-column prop="specification" label="设备规格" align="center" />
              <el-table-column prop="processingTime" label="预估工时(min)" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="刀具" name="2">
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
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="工装" name="3">
            <el-button @click="openFormDemandMaterial()" plain type="success">
              <Icon class="mr-5px" icon="ep:edit" />采购意见
            </el-button>
            <el-table :data="materialData" border>
              <el-table-column prop="materialNumber" label="工装编号" align="center" />
              <el-table-column prop="materialName" label="工装名称" align="center" />
              <el-table-column prop="materialSpecification" label="工装规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="量具" name="4">
            <el-button @click="openFormDemandMeasure()" plain type="success">
              <Icon class="mr-5px" icon="ep:edit" />采购意见
            </el-button>
            <el-table :data="measureData" border>
              <el-table-column prop="materialNumber" label="量具编号" align="center" />
              <el-table-column prop="materialName" label="量具名称" align="center" />
              <el-table-column prop="materialSpecification" label="量具规格" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="单件定额管理" name="5">
            <el-form :model="formData" label-width="120px">
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
          <el-tab-pane label="零件设计属性" name="6" style="height:280px;overflow-y: auto">
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
    <el-col :span="8" :xs="24">
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
  <!-- 表单弹窗：设备采购意见 -->
  <ProcurementOpinionsForm ref="formRefOpinions" />
  <!-- 表单弹窗：工装采购意见 -->
  <DemandMaterialForm ref="formRefDemandMaterial" />
  <!-- 表单弹窗：量具采购意见 -->
  <DemandMeasureForm ref="formRefDemandMeasure"/>
  <!-- 表单弹窗：刀具采购意见 -->
  <DemandCutterForm ref="formRefDemandCutter" />
  <!-- 表单弹窗：刀柄采购意见 -->
  <DemandHiltForm ref="formRefDemandHilt" />
</template>
<script setup lang="ts">
import {
  FeasibilityDetailApi,
  ProjPartBomVO, QuotaPerPartVO
} from "@/api/pdm/feasibilityDetail";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { useUserStore } from '@/store/modules/user'
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

const partDataList = ref<any[]>([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activePartName = ref(['1'])
const productNumber = ref()
const partNumber = ref()
const reviewer = ref()
const showResult = ref(false) // 评估结果显隐
const type = ref('create')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const isOperator = ref(false)
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
  resourcesType: '1'
})

const deleteResourceParams = reactive({
  projectCode: '',
  partVersionId: '',
  resourcesType: '1',
  resourcesTypeId: '',
  processingTime: 0
})

const getList = async () => {
  await getPartData()
}

/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = await FeasibilityDetailApi.getPartListByProjectCode(queryParams)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getPartData()
}

const partChange = async (val) => {
  showResult.value = true;
  queryParamsResult.projectCode = val.projectCode
  queryParamsResult.partVersionId = val.partVersionId
  productNumber.value = val.productNumber
  partNumber.value = val.partNumber
  reviewer.value = val.reviewer

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

  queryParamsResource.projectCode = val.projectCode
  queryParamsResource.partVersionId = val.partVersionId

  deleteResourceParams.projectCode = val.projectCode
  deleteResourceParams.partVersionId = val.partVersionId
  await getDeviceList()
  await getMaterialList()
  await getMeasureList()
  await getCombinationList()
  await getQuotaPerPart()
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
