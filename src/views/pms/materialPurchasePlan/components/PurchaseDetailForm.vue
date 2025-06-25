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
          <el-form-item label="项目名" prop="projectName">
            <el-input v-model="formData.projectName" placeholder="请输入项目名" disabled/>
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
          <el-form-item label="物料名" prop="materialName">
            <el-input v-model="formData.materialName" placeholder="请输入物料名" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库存" prop="inventory">
            <el-input v-model="formData.inventory" placeholder="请输入库存" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退货数量" prop="materialRerurnAmount">
            <el-input v-model="formData.materialRerurnAmount" placeholder="请输入退货数量" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="可用库存" prop="inventoryAvailable">
            <el-input v-model="formData.inventoryAvailable" placeholder="请输入可用库存" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用库存" prop="useInventory">
            <el-input-number v-model="formData.useInventory" :min="0" placeholder="请输入使用库存" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="工艺方案" prop="processScheme" >
            <el-select v-model="formData.processScheme" placeholder="请选择工艺方案" @change="selectChange">
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
  import PlanItemForm from './components/PlanItemForm.vue'
  import { MaterialPurchaseApi } from '@/api/pms/materialPurchasePlan'
  import { ProcessPlanApi } from '@/api/pdm/processPlan'

  /** 项目计划 表单 */
  defineOptions({ name: 'PlanForm' })

  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const processSchemeList = ref<any[]>([])

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('使用库存填写') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    projectName: undefined,
    partNumber: undefined,
    quantity: undefined,
    materialId: undefined,
    materialName: undefined,
    inventory: undefined,
    materialRerurnAmount: undefined,
    inventoryAvailable: undefined,
    useInventory: undefined,
    processScheme:undefined,
    partVersionId:undefined,

  })
  const formRules = reactive({
  })
  const formRef = ref() // 表单 Ref
  //总可用
  const totalAvailable = ref(0)


  /** 打开弹窗 */
  const open = async (row) => {
    console.log(row)
    dialogVisible.value = true;
    formData.value = {...row};
    totalAvailable.value = formData.value.inventoryAvailable + formData.value.useInventory;

    //查询工艺方案
    selectProcessSchemeList(row);

  }
  const selectProcessSchemeList = async (row)=>{
    const params = {
      projectCode:row.projectCode,
      partNumber:row.partNumber,
      viewSelf:false
    }
    //整个项目的工艺方案
    processSchemeList.value = await PlanApi.getProjPartBomPlanList(params)
  }

  //选定工艺方案后,为对应物料赋值
  const selectChange = async (row)=>{
    for (let i = 0; i < processSchemeList.value.length; i++) {
      if(processSchemeList.value[i].id === row){
        const data = await ProcessPlanApi.getProcess(row);
        formData.value.materialId = data.materialId;
        formData.value.materialName = data.materialName;
        formData.value.partVersionId = processSchemeList.value[i].partVersionId;
        break;
      }
    }
  }


  defineExpose({ open }) // 提供 open 方法，用于打开弹窗

  /** 提交表单 */
  const emit = defineEmits(['success','saveDevice']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // if(formData.value.useInventory>totalAvailable.value){
    //   message.warning("使用数量不能超过可用数量")
    //   return
    // }
    // 校验表单
    await formRef.value.validate()
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
    totalAvailable.value = 0;
    formData.value = {
      id: undefined,
      projectName: undefined,
      partNumber: undefined,
      quantity: undefined,
      materialName: undefined,
      inventory: undefined,
      materialRerurnAmount: undefined,
      inventoryAvailable: undefined,
      useInventory: undefined,
    }
    formRef.value?.resetFields()
  }

</script>
