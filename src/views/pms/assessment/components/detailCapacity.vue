<template>
  <ContentWrap title="产能评估">
    <el-table :data="partDataList" style="cursor: pointer;height:240px;overflow-y: auto" :row-key="getRowKeys">
      <el-table-column align="center" label="序号" type="index" width="60px" />
      <el-table-column align="center" label="零件图号" prop="partNumber" min-width="120px" />
      <el-table-column align="center" label="零件名称" prop="partName" />
      <el-table-column align="center" label="版次" prop="partVersion" min-width="50px" />
      <el-table-column align="center" label="负责人" prop="reviewer" />
      <el-table-column align="center" label="数量" prop="amount" />
      <!--<el-table-column align="center" label="数量" prop="quantity" />-->
      <el-table-column align="center" label="单件工时(min)" prop="processingTime" />
      <el-table-column align="center" label="总工时(min)" prop="totalProcessingTime" />
      <el-table-column label="操作" align="center" width="180px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            :disabled="capacityUpdate"
            @click="openOutResourceForm(scope.row.orderId)"
          >
            外协决定
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-collapse v-model="showDeviceInfo">
      <el-collapse-item title="设备" name="1">
        <el-table :data="deviceData" border>
          <el-table-column prop="code" label="设备编号" align="center" />
          <el-table-column prop="name" label="设备名称" align="center" />
          <el-table-column prop="specification" label="设备规格" align="center" />
          <el-table-column prop="processingTime" label="预估工时(min)" align="center" />
          <el-table-column label="需要数量" align="center">
            <template #default="scope">
              <el-form-item prop="amount" class="mb-0px!">
                <el-input-number v-model="scope.row.amount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template #default="scope">
              <el-form-item prop="purchaseAmount" class="mb-0px!">
                <el-input-number v-model="scope.row.purchaseAmount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
          <!--<el-table-column :width="60" align="center" label="操作">-->
          <!--<template #default="scope">-->
          <!--<el-button link type="danger" v-show="isOperator"-->
          <!--@click="handleDeleteDevice(scope.row.id)">删除</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="已有刀具" name="2">
        <el-table :data="combinationData" border>
          <el-table-column prop="cutternum" label="刀简号" align="center" />
          <el-table-column prop="taperTypeName" label="接口型式" align="center" />
          <el-table-column prop="hiltMark" label="刀柄牌号" align="center" />
          <el-table-column prop="cutterMark" label="刀具牌号" align="center" />
          <el-table-column label="需要数量" align="center">
            <template #default="scope">
              <el-form-item prop="amount" class="mb-0px!">
                <el-input-number v-model="scope.row.amount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template #default="scope">
              <el-form-item prop="purchaseAmount" class="mb-0px!">
                <el-input-number v-model="scope.row.purchaseAmount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="工装" name="3">
        <el-table :data="materialData" border>
          <el-table-column prop="materialNumber" label="工装编号" align="center" />
          <el-table-column prop="materialName" label="工装名称" align="center" />
          <el-table-column prop="materialSpecification" label="工装规格" align="center" />
          <el-table-column label="需要数量" align="center">
            <template #default="scope">
              <el-form-item prop="amount" class="mb-0px!">
                <el-input-number v-model="scope.row.amount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template #default="scope">
              <el-form-item prop="purchaseAmount" class="mb-0px!">
                <el-input-number v-model="scope.row.purchaseAmount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
          <!--<el-table-column :width="60" align="center" label="操作">-->
          <!--<template #default="scope">-->
          <!--<el-button link type="danger" v-show="isOperator"-->
          <!--@click="handleDeleteMaterial(scope.row.id)">删除</el-button>-->
          <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-collapse-item>
      <!--<el-collapse-item title="设备采购" name="4">-->
        <!--<el-table :data="demandDeviceData" border>-->
          <!--<el-table-column prop="deviceCode" label="设备编号" align="center" />-->
          <!--<el-table-column prop="deviceName" label="设备名称" align="center" />-->
          <!--<el-table-column prop="deviceSpecification" label="设备规格" align="center" />-->
          <!--<el-table-column prop="processingTime" label="预估工时(min)" align="center" />-->
          <!--<el-table-column label="数量" align="center">-->
            <!--<template #default="scope">-->
              <!--<el-form-item prop="quantity" class="mb-0px!">-->
                <!--<el-input-number v-model="scope.row.quantity" :disabled="capacityUpdate"/>-->
              <!--</el-form-item>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="采购类型" align="center">-->
            <!--<template #default="scope">-->
              <!--<dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="partNumber" label="零件图号" align="center" />-->
        <!--</el-table>-->
      <!--</el-collapse-item>-->
      <el-collapse-item title="刀具采购" name="5">
        <el-table :data="demandCutterData" border>
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="刀具长度" prop="length" />
          <el-table-column align="center" label="刃长" prop="bladeLength" />
          <el-table-column align="center" label="刃数" prop="bladeNum" />
          <el-table-column align="center" label="直径" prop="diameter" />
          <el-table-column align="center" label="R角" prop="rrAngle" />
          <el-table-column align="center" label="缩径" prop="reducingDiameter" />
          <el-table-column align="center" label="备注" prop="description" />
          <el-table-column label="需要数量" align="center">
            <template #default="scope">
              <el-form-item prop="amount" class="mb-0px!">
                <el-input-number v-model="scope.row.amount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template #default="scope">
              <el-form-item prop="purchaseAmount" class="mb-0px!">
                <el-input-number v-model="scope.row.purchaseAmount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="刀柄采购" name="6">
        <el-table :data="demandHiltData" border>
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="接口型式" prop="taperTypeId">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeId" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="刀柄长度" prop="length" />
          <el-table-column align="center" label="刀柄前端直径" prop="frontEndDiameter" />
          <el-table-column align="center" label="刀柄前端长度" prop="frontEndLength" />
          <el-table-column align="center" label="倾角" prop="dipAngle" />
          <el-table-column align="center" label="备注" prop="description" />
          <el-table-column label="需要数量" align="center">
            <template #default="scope">
              <el-form-item prop="amount" class="mb-0px!">
                <el-input-number v-model="scope.row.amount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <template #default="scope">
              <el-form-item prop="purchaseAmount" class="mb-0px!">
                <el-input-number v-model="scope.row.purchaseAmount" :disabled="capacityUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </ContentWrap>
  <OutSourceForm ref="outSourceFormRef"/>
</template>
<script setup lang="ts">
import {
  FeasibilityDetailApi,
  FeasibilityResultVO,
  ProjPartBomVO, QuotaPerPartVO
} from "@/api/pdm/feasibilityDetail";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { dateFormatter2 } from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user'
import TechnologyPartDetail from './technologyPartDetail.vue';
import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";
import { PartMasterApi } from "@/api/pdm/part/partmaster";
import { AssessmentApi} from '@/api/pms/assessment'
import OutSourceForm from './OutSourceForm.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const partDataList = ref<any[]>([]) // 零件目录列表
const showDeviceInfo = ref(['1'])
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const deviceData = ref([]) // 设备列表
const materialData = ref([]) // 工装列表
const combinationData = ref([]) // 刀组列表
const demandDeviceData = ref([]) // 采购设备列表
const demandCutterData = ref([]) // 采购刀具列表
const demandHiltData = ref([])//采购刀柄列表
const demandMaterialData = ref([])//采购工装列表
const technologyPartDetailRef = ref();
const capacityUpdate = ref(true);
const outSourceFormRef = ref();//外协数量分配弹窗

const props = defineProps({
  projectCode: {
    type: String ,
    default: () => ''
  },
  assessmentId: {
    type: String ,
    default: () => ''
  },
  taskDefinitionKey: {
    type: String ,
    default: () => ''
  },
  orderList:{
    type: Array ,
    default: () => []
  },
})

const queryParams = reactive({
  projectCode: '',
  partNumber: '',
  status: undefined,
  viewSelf: false
})


//获取项目编码相关的产品零件
const getList = async () => {
  queryParams.projectCode = props.projectCode;
  await getPartData()
}


/** 搜索按钮操作 */
const getPartData = async () => {
  // partDataList.value = await FeasibilityDetailApi.getProjPartBomListByProjectCode(queryParams)
  //产品零件数据
  // const data = await FeasibilityDetailApi.getProjPartBomListByProjectCode(queryParams)
  const data = await FeasibilityDetailApi.getPartListByProjectCode(queryParams)
  const filterDeviceData = deviceData.value.filter((item)=>{
    return item.resourcesType ===1;
  })
  const filterDemandDeviceData = demandDeviceData.value.filter((item)=>{
    return item.resourcesType ===1;
  })
  data.forEach((item)=>{
    item.processingTime = 0;
    //数量赋值
    props.orderList.forEach((val)=>{
      if(item.partNumber===val.partNumber){
        item.amount = val.quantity;
        item.orderId = val.id;
      }
    })
    //设备工时
    filterDeviceData.forEach((val)=>{
      if(item.partNumber===val.partNumber){
        if(val.processingTime!=null&&val.processingTime!=undefined){
          item.processingTime = item.processingTime + val.processingTime;
        }else {
          item.processingTime = item.processingTime ===undefined ? 0 :item.processingTime;
        }
      }
    })
    //采购设备工时
    filterDemandDeviceData.forEach((val)=>{
      if(item.partNumber===val.partNumber){
        val.processingTime = val.processingTime||0
        item.processingTime = item.processingTime+val.processingTime;
      }
    })
    item.totalProcessingTime = item.processingTime*item.amount;
  })

  // debugger
  partDataList.value = data;

}


const getRowKeys= (row) => {
  return row.id
}

// 获得所有评审相关信息
const getTechnologyAssessmentInfo = async ()=>{
  //成本评估要改价格
  //评审的设备表数据
  const devicedata =  await AssessmentApi.getAssessmentDeviceListMap(props.assessmentId);
  //技术评估的数据
  const data = await AssessmentApi.getTechnologyAssessment(props.projectCode)
  data.deviceList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice === undefined ? 0 : devicedata[index]?.predictPrice;
  })
  deviceData.value = data.deviceList;
  data.combinationList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice === undefined ? 0 : devicedata[index]?.predictPrice;
  })
  combinationData.value = data.combinationList;
  data.materialList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice === undefined ? 0 : devicedata[index]?.predictPrice;
  })
  materialData.value = data.materialList;
  //采购设备
  data.demandDeviceList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount!=undefined? devicedata[index]?.amount:0;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice;
    //属性名变更
    item.code = item.deviceCode
    item.name = item.deviceName
    item.specification = item.deviceSpecification
  })
  demandDeviceData.value = data.demandDeviceList;
  deviceData.value.push(...demandDeviceData.value);
  data.demandCutterList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice;
  })
  demandCutterData.value = data.demandCutterList;
  data.demandHiltList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice;
  })
  demandHiltData.value = data.demandHiltList;
  data.demandMaterialList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    // item.predictPrice = devicedata[index]?.predictPrice;
    item.materialNumber = item.materialCode;
  })
  demandMaterialData.value = data.demandMaterialList;
  materialData.value.push(...demandMaterialData.value);
  //查询零件
  await getList()
}

const handleDetailMaterial = (row)=>{
  technologyPartDetailRef.value.open(row);
}

const submit = async ()=>{
  const data = {
    assessmentId:props.assessmentId,
    projectCode:props.projectCode,
    deviceList:deviceData.value,
    combinationList:combinationData.value,
    materialList:materialData.value,
    // demandDeviceList:demandDeviceData.value,
    demandCutterList:demandCutterData.value,
    demandHiltList:demandHiltData.value,
    // demandMaterialList:demandMaterialData.value
  }
  await AssessmentApi.createTechnologyAssessment(data);
}

const openOutResourceForm = (orderId)=>{
  outSourceFormRef.value.open(orderId)
}

onMounted(async () => {
  await getTechnologyAssessmentInfo();
  // await getList()
  if(props.taskDefinitionKey==="Activity_04bad3q"){
    capacityUpdate.value = false;
  }
})

defineExpose({ deviceData,submit })
</script>
