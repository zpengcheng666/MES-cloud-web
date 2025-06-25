<template>
  <ContentWrap title="成本评估">
    <el-table :data="partDataList" style="cursor: pointer;height:240px;overflow-y: auto" :row-key="getRowKeys">
      <el-table-column align="center" label="序号" type="index" width="60px" />
      <el-table-column align="center" label="零件图号" prop="partNumber" min-width="120px" />
      <el-table-column align="center" label="零件名称" prop="partName" />
      <el-table-column align="center" label="版次" prop="partVersion" min-width="50px" />
      <el-table-column align="center" label="负责人" prop="reviewer" />
    </el-table>

    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      style="margin-top: 20px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="总数量" prop="totalPrice">
            <el-input
              disabled
              v-model="formData.totalQuantity"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购数量" prop="purchaseQuantity">
            <el-input
              disabled
              v-model="formData.purchaseQuantity"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总金额" prop="totalPrice">
            <el-input
              disabled
              v-model="formData.totalPrice"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse v-model="showDeviceInfo">
      <el-collapse-item title="已有设备" name="1">
        <el-table :data="deviceData" border>
          <el-table-column prop="code" label="设备编号" align="center" />
          <el-table-column prop="name" label="设备名称" align="center" />
          <el-table-column prop="specification" label="设备规格" align="center" />
          <el-table-column prop="processingTime" label="预估工时(min)" align="center" />
          <el-table-column align="center" label="数量" prop="amount" />
          <el-table-column align="center" label="采购数量" prop="purchaseAmount" />
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <el-table-column label="预估单价" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="predictPrice" class="mb-0px!">
                <el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="损耗" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="wastage" class="mb-0px!">
                <el-input-number v-model="scope.row.wastage" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预估总价" align="center"/>
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
          <el-table-column align="center" label="数量" prop="amount" />
          <el-table-column align="center" label="采购数量" prop="purchaseAmount" />
          <el-table-column label="预估单价" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="predictPrice" class="mb-0px!">
                <el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="损耗" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="wastage" class="mb-0px!">
                <el-input-number v-model="scope.row.wastage" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预估总价" align="center"/>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="已有工装" name="3">
        <el-table :data="materialData" border>
          <el-table-column prop="materialNumber" label="工装编号" align="center" />
          <el-table-column prop="materialName" label="工装名称" align="center" />
          <el-table-column prop="materialSpecification" label="工装规格" align="center" />
          <el-table-column align="center" label="数量" prop="amount" />
          <el-table-column align="center" label="采购数量" prop="purchaseAmount" />
          <el-table-column label="预估单价" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="predictPrice" class="mb-0px!">
                <el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="损耗" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="wastage" class="mb-0px!">
                <el-input-number v-model="scope.row.wastage" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预估总价" align="center"/>
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
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <!--<el-table-column label="预估单价/损耗" align="center">-->
            <!--<template #default="scope">-->
              <!--<el-form-item prop="predictPrice" class="mb-0px!">-->
                <!--<el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>-->
              <!--</el-form-item>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="totalPrice" label="预估总价" align="center"/>-->
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
          <el-table-column align="center" label="数量" prop="amount" />
          <el-table-column align="center" label="采购数量" prop="purchaseAmount" />
          <el-table-column label="预估单价" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="predictPrice" class="mb-0px!">
                <el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="损耗" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="wastage" class="mb-0px!">
                <el-input-number v-model="scope.row.wastage" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预估总价" align="center"/>
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
          <el-table-column align="center" label="数量" prop="amount" />
          <el-table-column align="center" label="采购数量" prop="purchaseAmount" />
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <el-table-column label="预估单价" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="predictPrice" class="mb-0px!">
                <el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="损耗" align="center" width="180px">
            <template #default="scope">
              <el-form-item prop="wastage" class="mb-0px!">
                <el-input-number v-model="scope.row.wastage" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="预估总价" align="center"/>
          <el-table-column label="采购类型" align="center">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
        </el-table>
      </el-collapse-item>
      <!--<el-collapse-item title="工装采购" name="7">-->
        <!--<el-table :data="demandMaterialData" border>-->
          <!--<el-table-column align="center" label="序号" type="index" width="60px" />-->
          <!--<el-table-column align="center" label="工装编号" prop="materialCode" />-->
          <!--<el-table-column align="center" label="工装名称" prop="materialName" />-->
          <!--<el-table-column align="center" label="工装规格" prop="materialSpecification" />-->
          <!--<el-table-column align="center" label="备注" prop="description" />-->
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <!--<el-table-column label="预估单价/损耗" align="center">-->
            <!--<template #default="scope">-->
              <!--<el-form-item prop="predictPrice" class="mb-0px!">-->
                <!--<el-input-number v-model="scope.row.predictPrice" @change="handlerComputePrice(scope.row)" :disabled="costUpdate"/>-->
              <!--</el-form-item>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="totalPrice" label="预估总价" align="center"/>-->
          <!--<el-table-column label="采购类型" align="center">-->
            <!--<template #default="scope">-->
              <!--<dict-tag :type="DICT_TYPE.PMS_ASSESSMENT_PURCHASE_TYPE" :value="scope.row.purchaseType" />-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="partNumber" label="零件图号" align="center" />-->
        <!--</el-table>-->
      <!--</el-collapse-item>-->
    </el-collapse>
  </ContentWrap>
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
const costUpdate = ref(true);
const totalPrice = ref(0);
const commonProcessingTime = ref(0)

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

const formData = ref({
  totalQuantity:0,
  purchaseQuantity:0,
  totalPrice: 0,
})


//获取项目编码相关的产品零件
const getList = async () => {
  queryParams.projectCode = props.projectCode;
  await getPartData()
}


/** 搜索按钮操作 */
const getPartData = async () => {
  // partDataList.value = await FeasibilityDetailApi.getProjPartBomListByProjectCode(queryParams)
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

//获得所有评审相关信息
const getTechnologyAssessmentInfo = async ()=>{
  //成本评估要改价格
  const devicedata =  await AssessmentApi.getAssessmentDeviceListMap(props.assessmentId);
  const data = await AssessmentApi.getTechnologyAssessment(props.projectCode)
  data.deviceList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    //设置总价，已有的是损耗，要乘时间
    //设置总价,现在价格等于 需求数量*损耗*工作时间+采购数量*预估单价
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
  })
  deviceData.value = data.deviceList;
  data.combinationList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    //设置总价，已有的是损耗，要乘时间,这种没时间的,先用固定值替代
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
  })
  combinationData.value = data.combinationList;
  data.materialList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount === undefined ? 0 : devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
  })
  materialData.value = data.materialList;
  data.demandDeviceList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount ===undefined?0:devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    //设置总价,没有的是采购
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
    //属性名变更
    item.code = item.deviceCode
    item.name = item.deviceName
    item.specification = item.deviceSpecification
  })
  demandDeviceData.value = data.demandDeviceList;
  deviceData.value.push(...demandDeviceData.value);
  data.demandCutterList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount===undefined?0:devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
  })
  demandCutterData.value = data.demandCutterList;
  data.demandHiltList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount===undefined?0:devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
  })
  demandHiltData.value = data.demandHiltList;
  data.demandMaterialList.forEach((item)=>{
    const index = item.partNumber+item.resourcesType+item.resourcesTypeId;
    if(item.processingTime===null||item.processingTime===undefined){
      item.processingTime = devicedata[index]?.processingTime!=null?devicedata[index]?.processingTime:0;
    }
    item.amount = devicedata[index]?.amount===undefined?0:devicedata[index]?.amount;
    item.purchaseAmount = devicedata[index]?.purchaseAmount === undefined ? 0 : devicedata[index]?.purchaseAmount;
    item.predictPrice = devicedata[index]?.predictPrice === null ? 0 : devicedata[index]?.predictPrice;
    item.wastage = devicedata[index]?.wastage === null ? 0 : devicedata[index]?.wastage;
    item.totalPrice = item.wastage*item.amount*item.processingTime+item.purchaseAmount*item.predictPrice;
    item.materialNumber = item.materialCode;
  })
  demandMaterialData.value = data.demandMaterialList;
  materialData.value.push(...demandMaterialData.value);
  //查询零件
  await getList()
  //计算数量
  handlerComputeTotalQunatuty()
  //计算总额
  handlerComputeTotalPrice()
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
    demandDeviceList:demandDeviceData.value,
    demandCutterList:demandCutterData.value,
    demandHiltList:demandHiltData.value,
    demandMaterialList:demandMaterialData.value
  }
  await AssessmentApi.createTechnologyAssessment(data);
}

const handlerComputePrice = (row)=>{
  // if(row.purchaseType===0){
  //   row.totalPrice = row.amount*row.predictPrice*(row?.processingTime||commonProcessingTime.value);
  // }
  // if(row.purchaseType===1){
  //   row.totalPrice = row.amount*row.predictPrice;
  // }
  row.totalPrice = row.wastage*row.amount*row.processingTime+row.purchaseAmount*row.predictPrice;
  handlerComputeTotalPrice();
}

const handlerComputeTotalPrice = ()=>{
  formData.value.totalPrice = 0;
  deviceData.value.forEach((item)=>{
    if(item.totalPrice!=null&&item.totalPrice!=undefined){
      formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
    }
  })
  combinationData.value.forEach((item)=>{
    if(item.totalPrice!=null&&item.totalPrice!=undefined){
      formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
    }
  })
  materialData.value.forEach((item)=>{
    if(item.totalPrice!=null&&item.totalPrice!=undefined){
      formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
    }
  })
  // demandDeviceData.value.forEach((item)=>{
  //   if(item.totalPrice!=null&&item.totalPrice!=undefined){
  //     formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
  //   }
  // })
  demandCutterData.value.forEach((item)=>{
    if(item.totalPrice!=null&&item.totalPrice!=undefined){
      formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
    }
  })
  demandHiltData.value.forEach((item)=>{
    if(item.totalPrice!=null&&item.totalPrice!=undefined){
      formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
    }
  })
  // demandMaterialData.value.forEach((item)=>{
  //   if(item.totalPrice!=null&&item.totalPrice!=undefined){
  //     formData.value.totalPrice = formData.value.totalPrice + item.totalPrice;
  //   }
  // })
}
const handlerComputeTotalQunatuty = ()=>{
  formData.value.totalQuantity = 0;
  formData.value.purchaseQuantity = 0;
  deviceData.value.forEach((item)=>{
    if(item.amount!=null&&item.amount!=undefined){
      formData.value.totalQuantity = formData.value.totalQuantity + item.amount;
    }
    if(item.purchaseAmount!=null&&item.purchaseAmount!=undefined){
      formData.value.purchaseQuantity = formData.value.purchaseQuantity + item.purchaseAmount;
    }
  })
  combinationData.value.forEach((item)=>{
    if(item.amount!=null&&item.amount!=undefined){
      formData.value.totalQuantity = formData.value.totalQuantity + item.amount;
    }
    if(item.purchaseAmount!=null&&item.purchaseAmount!=undefined){
      formData.value.purchaseQuantity = formData.value.purchaseQuantity + item.purchaseAmount;
    }
  })
  materialData.value.forEach((item)=>{
    if(item.amount!=null&&item.amount!=undefined){
      formData.value.totalQuantity = formData.value.totalQuantity + item.amount;
    }
    if(item.purchaseAmount!=null&&item.purchaseAmount!=undefined){
      formData.value.purchaseQuantity = formData.value.purchaseQuantity + item.purchaseAmount;
    }
  })
  // demandDeviceData.value.forEach((item)=>{
  //   if(item.quantity!=null&&item.quantity!=undefined){
  //     formData.value.totalQuantity = formData.value.totalQuantity + item.quantity;
  //   }
  // })
  demandCutterData.value.forEach((item)=>{
    if(item.amount!=null&&item.amount!=undefined){
      formData.value.totalQuantity = formData.value.totalQuantity + item.amount;
    }
    if(item.purchaseAmount!=null&&item.purchaseAmount!=undefined){
      formData.value.purchaseQuantity = formData.value.purchaseQuantity + item.purchaseAmount;
    }
  })
  demandHiltData.value.forEach((item)=>{
    if(item.amount!=null&&item.amount!=undefined){
      formData.value.totalQuantity = formData.value.totalQuantity + item.amount;
    }
    if(item.purchaseAmount!=null&&item.purchaseAmount!=undefined){
      formData.value.purchaseQuantity = formData.value.purchaseQuantity + item.purchaseAmount;
    }
  })
  // demandMaterialData.value.forEach((item)=>{
  //   if(item.quantity!=null&&item.quantity!=undefined){
  //     formData.value.totalQuantity = formData.value.totalQuantity + item.quantity;
  //   }
  // })
}

onMounted(async () => {
  await getTechnologyAssessmentInfo();
  // await getList()
  if(props.taskDefinitionKey==="Activity_1u6c3vu"){
    costUpdate.value = false;
  }
})

defineExpose({ deviceData,submit })
</script>
