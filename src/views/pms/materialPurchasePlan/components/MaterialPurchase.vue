<template>
  <ContentWrap title="物料采购计划">
    <el-collapse v-model="showDeviceInfo">
      <el-collapse-item title="物料" name="1">
        <el-button @click="startPurchase(0)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading0">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="purchaseMaterialData"
          border
          @selection-change="purchaseMaterialSelectChange"
          ref="purchaseMaterialTableRef"
          :show-overflow-tooltip="true"
          :height="400"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column prop="materialNumber" label="物料编号" align="center" />
          <el-table-column prop="materialName" label="物料名称" align="center" />
          <el-table-column prop="materialSpecification" label="物料规格" align="center" />
          <el-table-column prop="quantity" label="计划数量" align="center"/>
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="150">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <!--<el-table-column prop="predictPrice" label="预估单价" align="center"/>-->
          <el-table-column label="预估单价" min-width="150">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.predictPrice`" class="mb-0px!">
                <el-input v-model="row.predictPrice" placeholder="预估单价" :disabled="!!row.purchaseMark"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购标记" prop="purchaseMark" min-width="100px">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION" :value="scope.row.purchaseMark" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="计划类型" prop="planType" min-width="100px">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_PLAN_ITEM_TYPE" :value="scope.row.planType" />
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" label="零件图号" align="center"/>
          <el-table-column label="操作" align="center" min-width="100px" fixed="right">
            <template #default="scope">
              <el-button
                link
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="设备" name="2">
        <el-button @click="startPurchase(1)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading1">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="demandDeviceData"
          border
          @selection-change="deviceSelectChange"
          ref="deviceTableRef"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column prop="deviceCode" label="设备编号" align="center" />
          <el-table-column prop="deviceName" label="设备名称" align="center" />
          <el-table-column prop="deviceSpecification" label="设备规格" align="center" />
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="150">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="predictPrice" label="预估单价" align="center"/>
          <el-table-column align="center" label="采购标记" prop="purchaseMark">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION" :value="scope.row.purchaseMark" />
            </template>
          </el-table-column>
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <el-table-column prop="partNumber" label="零件图号" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-collapse-item>
      <el-collapse-item title="刀具" name="3">
        <el-button @click="startPurchase(2)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading2">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="combinationData"
          border
          @selection-change="combinationSelectChange"
          ref="combinationTableRef"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column prop="cutternum" label="刀简号" align="center" />
          <el-table-column prop="taperTypeName" label="接口型式" align="center" />
          <el-table-column prop="hiltMark" label="刀柄牌号" align="center" />
          <el-table-column prop="cutterMark" label="刀具牌号" align="center" />
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="100">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="predictPrice" label="预估单价" align="center"/>
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
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="工装" name="4">
        <el-button @click="startPurchase(3)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading3">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="demandMaterialData"
          border
          @selection-change="materialSelectChange"
          ref="materialTableRef"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column prop="materialCode" label="工装编号" align="center" />
          <el-table-column prop="materialName" label="工装名称" align="center" />
          <el-table-column prop="materialSpecification" label="工装规格" align="center" />
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="100">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="predictPrice" label="预估单价" align="center"/>
          <el-table-column align="center" label="采购标记" prop="purchaseMark">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION" :value="scope.row.purchaseMark" />
            </template>
          </el-table-column>
          <!--<el-table-column prop="quantity" label="数量" align="center"/>-->
          <el-table-column prop="partNumber" label="零件图号" align="center" />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

      <el-collapse-item title="刀具采购" name="5">
        <el-button @click="startPurchase(4)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading4">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="demandCutterData"
          border
          @selection-change="cutterSelectChange"
          ref="cutterTableRef"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="刀具长度" prop="length" />
          <el-table-column align="center" label="刃长" prop="bladeLength" />
          <el-table-column align="center" label="刃数" prop="bladeNum" />
          <el-table-column align="center" label="直径" prop="diameter" />
          <el-table-column align="center" label="R角" prop="rrAngle" />
          <el-table-column align="center" label="缩径" prop="reducingDiameter" />
          <!--<el-table-column align="center" label="备注" prop="description" />-->
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="150">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="predictPrice" label="预估单价" align="center"/>
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
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="刀柄采购" name="6">
        <el-button @click="startPurchase(5)" style="margin-bottom: 10px" plain type="success" :disabled="formLoading5">
          <Icon class="mr-5px" icon="ep:edit" />发起采购
        </el-button>
        <el-table
          :data="demandHiltData"
          border
          @selection-change="hiltSelectChange"
          ref="hiltTableRef"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="selection" width="50" :selectable="selectTable"/>
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
          <el-table-column prop="purchaseAmount" label="采购数量" align="center"/>
          <el-table-column label="采购完成时间" min-width="150">
            <template #default="{ row, $index }">
              <el-form-item :prop="`${$index}.purchaseTime`" class="mb-0px!">
                <el-date-picker
                  v-model="row.purchaseTime"
                  type="date"
                  value-format="x"
                  placeholder="采购完成时间"
                  :disabled="!!row.purchaseMark"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="predictPrice" label="预估单价" align="center"/>
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
                type="primary"
                :disabled="!scope.row.purchaseMark"
                @click="pushRequirement"
              >
                采购申请
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>

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
  import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'

  const message = useMessage() // 消息弹窗
  const { t } = useI18n() // 国际化
  const { push } = useRouter() // 路由

  const formLoading0 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formLoading1 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formLoading2 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formLoading3 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formLoading4 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formLoading5 = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const showDeviceInfo = ref(['1'])
  const userStore = useUserStore()
  const userId = userStore.getUser.id // 当前登录用户id
  const deviceData = ref([]) // 设备列表
  const materialData = ref([]) // 工装列表
  const purchaseMaterialData = ref([]) // 物料列表
  const combinationData = ref([]) // 刀组列表
  const demandDeviceData = ref([]) // 采购设备列表
  const demandCutterData = ref([]) // 采购刀具列表
  const demandHiltData = ref([])//采购刀柄列表
  const demandMaterialData = ref([])//采购工装列表
  const currentDeviceRows = ref<any[]>([]);//设备表格当前选中行
  const currentCombinationRows = ref<any[]>([]);//刀具表格当前选中行
  const currentMaterialRows = ref<any[]>([]);//工装表格当前选中行
  const currentCutterRows = ref<any[]>([]);//刀具(分)表格当前选中行
  const currentHiltRows = ref<any[]>([]);//刀柄(分)表格当前选中行
  const currentPurchaseMaterialRows = ref<any[]>([]);//物料表格当前选中行
  const deviceTableRef = ref()
  const combinationTableRef = ref()
  const materialTableRef = ref()
  const cutterTableRef = ref()
  const hiltTableRef = ref()
  const purchaseMaterialTableRef = ref()

  const props = defineProps({
  })

  const emit = defineEmits(['success'])

  onMounted(async () => {
   // const projectList = await MaterialPurchaseApi.getApprovalListWithPass({projectType: 2, status:2})
   // await handleProjectList(projectList);
   //  console.log(projectList)
  })


  const handleProjectList = ((rows)=>{
    const projectIdList = []
    const projectCodeList = []
    rows.forEach((item=>{
      projectCodeList.push(item.project);
      projectIdList.push(item.id);
    }))
  })

  const setList =async (data)=>{
    combinationData.value = data.combinationDOList;

    purchaseMaterialData.value = data.purchaseMaterialDOList?.filter((item)=>{
      return item.purchaseMark ===0;
    });
    demandDeviceData.value = data.demandDeviceDOList
    demandCutterData.value = data.demandCutterDOList
    demandHiltData.value = data.demandHiltDOList
    demandMaterialData.value = data.demandMaterialDOList
  }
  //发起采购,type是类型(0物料,1设备,2刀具,3工装,4刀具(刀具一部分),5刀柄(刀具一部分))
  const startPurchase = (type)=>{
    switch (type) {
      case 0:
        startPurchaseType0(type);
        break;
      case 1:
        startPurchaseType1(type);
        break;
      case 2:
        startPurchaseType2(type);
        break;
      case 3:
        startPurchaseType3(type);
        break;
      case 4:
        startPurchaseType4(type);
        break;
      case 5:
        startPurchaseType5(type);
        break;
    }
  }

  /**
   * 发起物料采购
   */
  const startPurchaseType0 = async (type)=>{
    if(currentPurchaseMaterialRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentPurchaseMaterialRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    let res2 =await checkPrice(currentPurchaseMaterialRows.value);
    if (res2) {
      message.warning('请检查金额格式是否正确')
      return
    }
    //不需要判断了
    // const myset = new Set();
    // currentPurchaseMaterialRows.value.forEach((item=>{
    //   myset.add(item.materialId)
    // }))
    // if(myset.size<currentPurchaseMaterialRows.value.length){
    //   message.warning('不能选择相同类型的物料进行采购')
    //   return
    // }


    const data = {userId, type, purchaseMaterialDOList:currentPurchaseMaterialRows.value}
    try {
      formLoading0.value = true
      await MaterialPurchaseApi.startPurchase(data);
      purchaseMaterialTableRef.value.clearSelection();
      currentPurchaseMaterialRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading0.value = false;
    }
  }

  /**
   * 物料选中行
   * @param rows
   */
  const purchaseMaterialSelectChange = (rows)=>{
    currentPurchaseMaterialRows.value = rows;
  }

  /**p
   * 设备发起采购
   */
  const startPurchaseType1 = async (type)=>{
    if(currentDeviceRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentDeviceRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    const data = {userId, type, demandDeviceDOList:currentDeviceRows.value}
    try {
      formLoading1.value = true;
      await MaterialPurchaseApi.startPurchase(data);
      deviceTableRef.value.clearSelection();
      currentDeviceRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading1.value = false;
    }
  }

  /**
   * 设备选中行
   * @param rows
   */
  const deviceSelectChange = (rows)=>{
    currentDeviceRows.value = rows;
  }

  /**
   * 刀具发起采购
   */
  const startPurchaseType2 = async (type)=>{
    if(currentCombinationRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentCombinationRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    const data = {userId, type, combinationDOList:currentCombinationRows.value}
    try {
      formLoading2.value = true;
      await MaterialPurchaseApi.startPurchase(data);
      combinationTableRef.value.clearSelection();
      currentCombinationRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading2.value = false;
    }
  }

  /**
   * 刀具选中行
   * @param rows
   */
  const combinationSelectChange = (rows)=>{
    currentCombinationRows.value = rows;
  }


  /**
   * 工装发起采购
   */
  const startPurchaseType3 = async (type)=>{
    if(currentMaterialRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentMaterialRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    const data = {userId, type, demandMaterialDOList:currentMaterialRows.value}
    try{
      formLoading3.value = true;
      await MaterialPurchaseApi.startPurchase(data);
      materialTableRef.value.clearSelection();
      currentMaterialRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading3.value = false;
    }
  }

  /**
   * 工装选中行
   * @param rows
   */
  const materialSelectChange = (rows)=>{
    currentMaterialRows.value = rows;
  }

  /**
   * 刀具(分)发起采购
   */
  const startPurchaseType4 = async (type)=>{
    if(currentCutterRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentCutterRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    const data = {userId, type, demandCutterDOList:currentCutterRows.value}
    try{
      formLoading4.value = true;
      await MaterialPurchaseApi.startPurchase(data);
      cutterTableRef.value.clearSelection();
      currentCutterRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading4.value = false;
    }
  }

  /**
   * 刀具(分)选中行
   * @param rows
   */
  const cutterSelectChange = (rows)=>{
    currentCutterRows.value = rows;
  }

  /**
   * 刀柄(分)发起采购
   */
  const startPurchaseType5 = async (type)=>{
    if(currentHiltRows.value.length===0){
      message.info('还未选中数据')
      return
    }
    let res = await checkPurchase(currentHiltRows.value);
    if(res){
      message.warning('有数据未选择采购完成时间')
      return
    }
    const data = {userId, type, demandHiltDOList:currentHiltRows.value}
    try{
      formLoading5.value = true;
      await MaterialPurchaseApi.startPurchase(data);
      hiltTableRef.value.clearSelection();
      currentHiltRows.value = [];
      message.success('成功发起采购')
      emit('success')
    }catch (e) {
      message.success('发起采购失败')
      console.error(e)
    }finally {
      formLoading5.value = false;
    }
  }

  /**
   * 刀具(分)选中行
   * @param rows
   */
  const hiltSelectChange = (rows)=>{
    currentHiltRows.value = rows;
  }

  /**
   * 禁用选中
   * @param row
   * @param index
   */
  const selectTable = (row,index)=>{
    if(row.purchaseMark===1){
      return false
    }else {
      return true;
    }
  }

  const checkPurchase = (rows)=>{
    let res = rows.some(item=>{
      return item.purchaseTime===null||item.purchaseTime===undefined;
    })
    return res;
  }

  const checkPrice = (rows)=>{
    let res = rows.some(item=>{
      return item.predictPrice===null||item.predictPrice===undefined||!isFinite(item.predictPrice)
    })
    return res;
  }

  const pushRequirement = ()=>{
    push({
      // name: 'PurchaseRequirement',
      path:'/ppm/purchase-requirement'
    })
  }


  defineExpose({ deviceData,setList })
</script>
