<template>
  <Dialog title="生产备料" v-model="dialogVisible" width="1000" @close="closeDialog">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="128px"
      v-loading="formLoading"
    >
      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="项目名称" prop="projectName">-->
            <!--<el-input v-model="formData.projectName" placeholder="请选择项目"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="项目编码" prop="projectCode">-->
            <!--<el-input v-model="formData.projectCode" placeholder="请输入项目编码"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="工艺方案" prop="processScheme">
            <el-select v-model="formData.processScheme" placeholder="请选择工艺方案" disabled>
              <el-option
                v-for="item in processSchemeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划数量" prop="quantity">
            <el-input v-model="formData.quantity" placeholder="请输入计划数量" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="已选物料" prop="hasPrepare">
            <el-input v-model="formData.hasPrepare" placeholder="请输入已选物料" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前需求" prop="require">
            <el-input v-model="formData.require" placeholder="请输入总需求物料" disabled/>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="已备物料" prop="hasPrepare">-->
            <!--<el-input v-model="formData.hasPrepare" placeholder="已备物料" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="物料类型" prop="materialNumber">
            <el-input v-model="formData.materialNumber" placeholder="请输入物料类型" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可用库存" prop="inventory">
            <el-input v-model="formData.inventory" placeholder="请输入可用库存" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="物料比" prop="property">-->
            <!--<el-input v-model="formData.property" placeholder="请输入物料比" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="物料比" prop="groupSize">
            <el-input v-model="formData.groupSize" placeholder="请输入物料比" disabled/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="选择物料" prop="materialCodeList">
        <el-select v-model="formData.materialCodeList" placeholder="请选择物料" :disabled ="!formData.processScheme" multiple ref="materialSelectRef">
          <el-option
            v-for="item in prepareMaterialList"
            :key="item.id"
            :label="item.barCode"
            :value="item.barCode"
          />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span ="12">
          <el-form-item label="物料不足" prop="enough">
            <el-switch v-model="enough" active-text="是" inactive-text="否" :disabled="!formData.processScheme"/>
          </el-form-item>
        </el-col>
        <!--<el-col :span ="8">-->
          <!--<el-form-item v-if="enough" label="采购数量" prop="purchaseAmount">-->
            <!--<el-input type="number" v-model="formData.purchaseAmount"/>-->
          <!--</el-form-item>-->

        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item v-if="enough" label="采购数量" prop="purchaseAmount">
            <el-input v-model="formData.purchaseAmount" placeholder="请输入总需求物料"/>
          </el-form-item>
        </el-col>
        <el-col :span ="4">
          <el-button style="margin-left: 20px" v-if="enough" @click="purchaseMaterial" type="primary" :disabled="loading">生成采购计划</el-button>
        </el-col>
      </el-row>

      <ContentWrap v-if="enough" title="物料采购计划记录">
        <el-table
          :data="purchaseMaterialData"
          border
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column prop="materialNumber" label="物料编号" align="center" />
          <el-table-column prop="materialName" label="物料名称" align="center" />
          <el-table-column prop="materialSpecification" label="物料规格" align="center" />
          <el-table-column prop="quantity" label="计划数量" align="center"/>
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column align="center" label="采购标记" prop="purchaseMark">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION" :value="scope.row.purchaseMark" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center" />
          <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
            link
            type="success"
            :disabled="scope.row.purchaseMark"
            @click="pushPurchase"
            >
              去采购
            </el-button>
          </template>
          </el-table-column>
        </el-table>
      </ContentWrap>

      <ContentWrap title="订单物料关系">
        <el-table
          :data="relationList"
          border
          :show-overflow-tooltip="true"
        >
          <el-table-column prop="materialCode" label="物料条码" align="center" />
          <!--<el-table-column prop="step" label="工序" align="center" />-->
          <el-table-column prop="stepName" label="工序" align="center" />
          <el-table-column align="center" label="物料状态" prop="materialStatus">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_MATERIAL_STATUS" :value="scope.row.materialStatus" />
            </template>
          </el-table-column>
          <!--<el-table-column prop="materialName" label="物料名称" align="center" />-->
          <!--<el-table-column prop="materialSpecification" label="物料规格" align="center" />-->
          <!--<el-table-column prop="quantity" label="计划数量" align="center"/>-->
          <!--<el-table-column prop="purchaseAmount" label="采购数量" align="center"/>-->
          <!--<el-table-column align="center" label="采购标记" prop="purchaseMark">-->
            <!--<template #default="scope">-->
              <!--<dict-tag :type="DICT_TYPE.PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION" :value="scope.row.purchaseMark" />-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="partNumber" label="零件图号" align="center" />-->
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <!-- :disabled="scope.row.materialStatus!=7" -->
              <el-button
                link
                type="danger"
                :disabled="!!scope.row.planItemId"
                @click="releaseRelation(scope.row)"
              >
                释放
              </el-button>
              <el-button
                link
                type="danger"
                :disabled="!scope.row.materialCode||scope.row.materialStatus===7||scope.row.materialStatus===8"
                @click="resolveRelation(scope.row)"
              >
                报废
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </ContentWrap>

      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="图号" prop="partNumber">-->
            <!--<el-input v-model="formData.partNumber" placeholder="请输入图号" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="工件名称" prop="partName">-->
            <!--<el-input v-model="formData.partName" placeholder="请输入工件名称" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <!--<el-row>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="物料牌号" prop="materialNumber">-->
            <!--<el-input v-model="formData.materialNumber" placeholder="请输入物料牌号" disabled/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="订单类型" prop="orderType">-->
            <!--<el-select v-model="formData.orderType" placeholder="请选择订单类型" disabled>-->
              <!--<el-option-->
                <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_TYPE)"-->
                <!--:key="dict.value"-->
                <!--:label="dict.label"-->
                <!--:value="dict.value"-->
              <!--/>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PlanApi, PlanVO } from '@/api/pms/plan'
import { OrderApi } from '@/api/pms/order'
import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
import PlanItemForm from './components/PlanItemForm.vue'
import { ContractApi } from '@/api/ppm/contract'
import ProjectForm from './components/ProjectForm.vue';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ProcessPlanApi } from '@/api/pdm/processPlan'
import { RelationApi } from '@/api/pms/orderMaterialRelation'

/** 项目计划 表单 */
defineOptions({ name: 'PrepareMaterialForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const { push } = useRouter() // 路由
const formLoading = ref(false)
const dialogVisible = ref(false)
const formData = ref({
  id: undefined,
  processScheme:undefined,
  quantity:undefined,
  require:undefined,
  hasPrepare:undefined,
  materialCodeList:undefined,
  purchaseAmount:undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const materialSelectRef = ref()
const processSchemeList = ref<any[]>([])
const materialList = ref<any[]>([])
const purchaseMaterialData = ref<any[]>([])
const prepareMaterialList = ref<any[]>([])
const relationList = ref<any[]>([])
const enough = ref(true)

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const open =async (row)=>{
  enough.value = false
  dialogVisible.value = true
  console.log(row)
  resetForm()

  try{
    formLoading.value = true
    //表单赋值
    const data = Object.assign({},row,{orderId:row.projectOrderId},{projectPlanId:row.planId});
    formData.value = data
    formData.value.projectId = row.id
    formData.value.id = row.planId;
    formData.value.processScheme = row.processScheme;

    const processInfo = await ProcessPlanApi.getProcess(formData.value.processScheme)
    formData.value.materialNumber = processInfo?.materialDesg;
    //formData.value.property = processInfo?.property;
    formData.value.groupSize = parseInt(processInfo?.groupSize);
    relationList.value =await RelationApi.getRelationListByOrderId(row.projectOrderId);
    let totalRequire = formData.value.quantity
    if(formData.value.groupSize!=null||formData.value.groupSize!=undefined){
      totalRequire = totalRequire/formData.value.groupSize;
    }
    let has = 0;
    let require = 0;
    let scrap = 0
    relationList.value.forEach((val)=>{
      if(val.materialCode){
        has++;
      }
      if(val.materialStatus===7||val.materialStatus===8){
        scrap++;
      }
      if(val.step===-1){
        val.stepName = "已完成"
      }else {
        val.stepName = val.step;
      }
    })
    formData.value.hasPrepare = has;
    formData.value.require = totalRequire + scrap - has;

    await getprocessSchemeList();
    showPurchaseMaterial()

    //物料选取,备料，从库存里选择物料
    prepareMaterialList.value = await PlanApi.getPrepareMaterial(formData.value.materialNumber)
    formData.value.inventory = prepareMaterialList.value.length

  }finally {
    formLoading.value = false;
  }
}

const getprocessSchemeList = async ()=>{
  const params = {
    projectCode:formData.value.projectCode,
    partNumber:formData.value.partNumber,
  }
  //整个项目的工艺方案,用新接口
  const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
  processSchemeList.value = list.filter((item)=>{
    return item.type ===2;
  })

  //工艺方案只有一个
  //computeRequire(processSchemeList.value[0])
}

const computeRequire =async (row)=>{
 const data = await ProcessPlanApi.getProcess(row.id)
  console.log(data)
  let size = Number.parseInt(data.groupSize)
  let requireAmount = Math.ceil(formData.value.quantity / data.groupSize)
  formData.value.require = requireAmount;
  formData.value.purchaseAmount = requireAmount;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    processScheme:undefined,
    quantity:undefined,
    require:undefined,
    // hasPrepare:undefined,
    materialCodeList:undefined,
    purchaseAmount:undefined
  }
  enough.value = false
  relationList.value = []
  formRef.value?.resetFields()
}

const closeDialog = ()=>{
  resetForm();
}

const purchaseMaterial = async ()=>{
  if(formData.value.purchaseAmount === undefined || formData.value.purchaseAmount === 0){
    message.warning('未填写采购数量')
    return
  }
  console.log(formData.value)
  await PlanApi.creatMaterialPurchsePlan(formData.value);
  showPurchaseMaterial();
}

/**
 * 展示物料采购计划
 */
const showPurchaseMaterial = async ()=>{
  const ids = [formData.value.projectId];
  const data =await MaterialPurchaseApi.getPurchaseResourceByProjectIds(ids);
  const purchaseData = data.purchaseMaterialDOList;
  purchaseMaterialData.value = purchaseData.filter((item)=>{
    return item.planType ===1;
  })
  // purchaseMaterialData.value = data.purchaseMaterialDOList;
  console.log(purchaseMaterialData.value)
}
//跳转到物料采购计划页面
const pushPurchase = ()=>{
  dialogVisible.value = false;
  push({name: 'MaterialPurchasePlan'})
}

//废弃处理
const resolveRelation = async (row)=>{
// 删除的二次确认
  await message.delConfirm('确认报废吗,报废后无法使用')
 await RelationApi.addRelation(row)
  relationList.value =await RelationApi.getRelationListByOrderId(row.orderId);
}
const releaseRelation = async(row)=>{
  await message.delConfirm('确认释放吗,释放后可被其他项目选中')
  await RelationApi.releaseCode(row.id)
  relationList.value =await RelationApi.getRelationListByOrderId(row.orderId);
}

const submitForm = async ()=>{
  // if((formData.value.require-formData.value.hasPrepare-formData.value.materialCodeList.length)<0){
  //   message.warning('选择的物料多余需要的物料，请减少选择的物料')
  //   return
  // }
  try {
    formLoading.value = true
    const data = formData.value;
    await RelationApi.updatePrepare(data)
    emit('success')
  }finally {
    formLoading.value = false
    dialogVisible.value = false;
  }

}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
