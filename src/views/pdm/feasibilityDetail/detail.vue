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
      <el-descriptions-item label="评估者">
        {{ detailData.reviewer }}
      </el-descriptions-item>
      <el-descriptions-item label="评估结果">
        <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_RESULT" :value="detailData.isPass" />
      </el-descriptions-item>
      <el-descriptions-item label="不通过原因">
        {{ detailData.reason }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
  <el-row :gutter="20">
    <el-col :span="15" :xs="24">
      <ContentWrap>
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
          <el-tab-pane label="单件定额管理" name="4">
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
          <el-tab-pane label="零件设计属性" name="5" style="height:450px;overflow-y: auto">
            <el-descriptions :column="1" border>
              <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index + 1">
                {{ item.attrValue }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="文件目录" name="6">
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
      <ContentWrap>
        <div style="width:600px;height:504px">三维图</div>
      </ContentWrap>
    </el-col>
  </el-row>
  <!-- 表单弹窗：设备采购意见 -->
  <ProcurementOpinionsForm ref="formRefOpinions" />
  <!-- 表单弹窗：工装采购意见 -->
  <DemandMaterialForm ref="formRefDemandMaterial" />
  <!-- 表单弹窗：刀具采购意见 -->
  <DemandCutterForm ref="formRefDemandCutter" />
  <!-- 表单弹窗：刀柄采购意见 -->
  <DemandHiltForm ref="formRefDemandHilt" />
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE } from '@/utils/dict'
import {FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
import {PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import {PartMasterApi} from "@/api/pdm/part/partmaster";
import ProcurementOpinionsForm from "@/views/pdm/feasibilityDetail/ProcurementOpinionsForm.vue";
import DemandMaterialForm from "@/views/pdm/feasibilityDetail/DemandMaterialForm.vue";
import DemandHiltForm from "@/views/pdm/feasibilityDetail/DemandHiltForm.vue";
import DemandCutterForm from "@/views/pdm/feasibilityDetail/DemandCutterForm.vue";

defineOptions({ name: 'PDMFeasibilityDetail' })

const { query } = useRoute() // 查询参数

const isOperator = ref(false)
const activeName = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const deviceData = ref([]) // 设备列表
const resourcesData = ref([]) // 零件关联的制造资源列表
const deviceIds = ref([]) // 零件关联的设备id数组
const materialData = ref([]) // 工装列表
const materialIds = ref([]) // 零件关联的工装id数组
const combinationData = ref([]) // 刀组列表
const combinationIds = ref([]) // 零件关联的刀组id数组

// 业务主键id(即taskId)
const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailData = ref<any>({}) // 详情数据

const queryId = query.id as unknown as number // 从URL传递过来的processInstanceId

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

const queryParamsResource = reactive({
  projectCode: '',
  partVersionId: '',
  resourcesType: '1'
})

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: ''
})

const queryParamsResult = reactive({
  projectCode: '',
  partVersionId: '',
  status: '2'
})

/** 获得数据 */
const getInfo = async () => {
  activeName.value = '1'
  detailData.value = await FeasibilityDetailApi.getPartDetailByTaskId(props.id || queryId)

  queryParamsAttr.rootProductId = detailData.value.rootProductId
  queryParamsAttr.customizedIndex = detailData.value.customizedIndex
  queryParamsAttr.partVersionId = detailData.value.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  tableData.value = await PartAttachmentApi.getdatapackageBomId(detailData.value.partVersionId);

  queryParamsResult.projectCode = detailData.value.projectCode
  queryParamsResult.partVersionId = detailData.value.partVersionId
  queryParamsResource.projectCode = detailData.value.projectCode
  queryParamsResource.partVersionId = detailData.value.partVersionId

  await getDeviceList()
  await getMaterialList()
  await getCombinationList()
  await getQuotaPerPart()
}
/** 设备列表 */
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
}
/** 设备采购意见操作 */
const formRefOpinions = ref()
const openFormOpinions = () => {
  formRefOpinions.value.open(false, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}
/** 工装列表 */
const getMaterialList = async () => {
  queryParamsResource.resourcesType = '3'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  materialIds.value = []
  //制造资源列表过滤工装id
  resourcesData.value.forEach((item) => {
    materialIds.value.push(item.resourcesTypeId)
  })
  materialData.value = await FeasibilityDetailApi.getMaterialListByMaterialIds(materialIds.value)
}
/** 工装采购意见操作 */
const formRefDemandMaterial = ref()
const openFormDemandMaterial = () => {
  formRefDemandMaterial.value.open(isOperator.value, queryParamsResult.projectCode, queryParamsResult.partVersionId)
}
/** 刀组列表 */
const getCombinationList = async () => {
  queryParamsResource.resourcesType = '2'
  resourcesData.value = await FeasibilityDetailApi.getResourceListByPart(queryParamsResource);
  combinationIds.value = []
  //制造资源列表过滤刀组id
  resourcesData.value.forEach((item) => {
    combinationIds.value.push(item.resourcesTypeId)
  })
  combinationData.value = await FeasibilityDetailApi.getCombinationListByCombinationIds(combinationIds.value)
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
/** 单件定额管理 */
const getQuotaPerPart = async () => {
  formData.value = await FeasibilityDetailApi.getQuotaPerPartInfo(queryParamsResult)
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
