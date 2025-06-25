<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目编号" prop="projectCode">
            <el-input v-model="formData.projectCode" placeholder="请输入项目编号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图号" prop="partNumber">
            <el-input v-model="formData.partNumber" placeholder="请输入图号" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划数量" prop="quantity">
            <el-input v-model="formData.quantity" placeholder="请输入计划数量" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工艺方案" prop="processScheme" >
            <el-select v-model="formData.processScheme" placeholder="请选择工艺方案" @change="selectChange" disabled>
              <el-option
                v-for="item in processSchemeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料牌号" prop="materialNumber">
            <el-input v-model="formData.materialNumber" placeholder="请输入物料牌号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划类型" prop="planType">
            <el-select v-model="formData.planType" placeholder="请选择计划类型" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PLAN_ITEM_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="工艺准备" prop="processPreparationTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.processPreparationTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="工艺准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="采购" prop="purchaseCompletionTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.purchaseCompletionTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="采购完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="生产准备" prop="productionPreparationTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.productionPreparationTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="生产准备完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="入库" prop="warehousingTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.warehousingTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="入库完成时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->

      <!--<el-row :gutter="20">-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="完成检验" prop="checkoutCompletionTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.checkoutCompletionTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="完成检验时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="计划交付" prop="planDeliveryTime">-->
            <!--<el-date-picker-->
              <!--v-model="formData.planDeliveryTime"-->
              <!--type="date"-->
              <!--value-format="x"-->
              <!--placeholder="计划交付时间"-->
            <!--/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      <!--</el-row>-->
    </el-form>
    <ContentWrap title="工序表">
      <el-table :data="processStepList">
        <el-table-column label="工序" align="center" prop="procedureNum" />
        <el-table-column label="工序名" align="center" prop="procedureName" />
        <el-table-column label="外协" align="center" prop="sourceName" />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
  import { PlanApi, PlanVO } from '@/api/pms/plan'
  import { OrderApi } from '@/api/pms/order'
  import PlanItemForm from './components/PlanItemForm.vue'
  import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
  import { ProcessPlanApi } from '@/api/pdm/processPlan'
  import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'

  /** 项目计划 内嵌表单的编辑表单,用来选择工艺方案 */
  /** 由于工艺方案现在是分配子计划的时候选,这个表单实际上已经没有存在的意义了,现改成详情 */
  defineOptions({ name: 'PurchaseDetailForm' })

  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const processSchemeList = ref<any[]>([])
  const processStepList = ref<any[]>([])

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('选择工艺方案') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    projectName: undefined,
    partNumber: undefined,
    processScheme:undefined,
    partVersionId:undefined,
    materialId:undefined,
    materialName:undefined,
    materialCode:undefined,
    materialSpecification:undefined,
  })
  const formRules = reactive({
  })
  const formRef = ref() // 表单 Ref


  /** 打开弹窗 */
  const open = async (row) => {
    resetForm()
    console.log(row)
    dialogVisible.value = true;
    formData.value = {...row};

    //查询工艺方案
    selectProcessSchemeList(row);
    selectProcessStepList(row);

  }
  // const selectProcessSchemeList = async (row)=>{
  //   const params = {
  //     projectCode:row.projectCode,
  //     partNumber:row.partNumber,
  //     viewSelf:false
  //   }
  //   //整个项目的工艺方案
  //   processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
  // }
  //选择工艺方案
  const selectProcessSchemeList = async (row)=>{
    const params = {
      projectCode:row.projectCode,
      partNumber:row.partNumber,
      // viewSelf:false
    }
    //整个项目的工艺方案
    // processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
    //用新接口
    // params.projectCode = 'XM022000801';
    // params.partNumber = 'C01342091-002';
    const list = await ProcessPlanApi.getProjPartBomTreeListNew(params);
    processSchemeList.value = list.filter((item)=>{
      return item.type ===2;
    })
    console.log(processSchemeList.value);

  }

  //选择工序
  const selectProcessStepList = async (row)=>{
    processStepList.value = await PlanApi.getProcedureListByProcessVersionId(row.processScheme);
    processStepList.value.forEach((item)=>{
      if(item.isOut==='1'){
        item.sourceName = '是'
      }else {
        item.sourceName = '否'
      }
    })
    console.log(processStepList.value)
  }

  //选定工艺方案后,为对应物料赋值
  const selectChange = async (row)=>{
    for (let i = 0; i < processSchemeList.value.length; i++) {
      if(processSchemeList.value[i].id === row){
        const data = await ProcessPlanApi.getProcess(row);
        formData.value.materialId = data.materialId;
        formData.value.materialName = data.materialName;
        formData.value.materialCode = data.materialCode;
        formData.value.materialSpecification =  data.materialSpecification
        formData.value.partVersionId = processSchemeList.value[i].partVersionId;
        break;
      }
    }
  }


  defineExpose({ open }) // 提供 open 方法，用于打开弹窗

  /** 提交表单 */
  const emit = defineEmits(['success','saveDevice']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()
    //防止selectChange没有触发
    if(formData.value.processScheme){
      await selectChange(formData.value.processScheme);
    }

    // 提交请求
    formLoading.value = true
    try {

      //更新使用库存
      // await MaterialPurchaseApi.updatePlanItem({id:formData.value.id,useInventory:formData.value.useInventory,materialId:formData.value.materialId})
      console.log(formData.value)
      await MaterialPurchaseApi.updatePlanItem(formData.value)
      dialogVisible.value = false
      //保存设备,工装,刀具
      emit('saveDevice',formData.value)
      // 发送操作成功的事件
      emit('success')
    } finally {
      resetForm()
      formLoading.value = false
    }
  }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      projectName: undefined,
      partNumber: undefined,
      processScheme:undefined,
      partVersionId:undefined,
      materialId:undefined,
      materialName:undefined,
      materialCode:undefined,
      materialSpecification:undefined,
    }
    formRef.value?.resetFields()
  }

</script>
