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
          <el-form-item label="项目编码" prop="projectCode">
            <el-input v-model="formData.projectCode" placeholder="请输入项目编码" disabled/>
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
          <el-form-item label="设备名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入设备名称" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格" prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入规格" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工序" prop="procedureName">
            <el-input v-model="formData.procedureName" placeholder="请输入工序" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="使用库存" prop="useInventory">
            <el-input v-model="formData.useInventory" placeholder="请输入使用库存"/>
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
  defineOptions({ name: 'PurchaseDetailDeviceForm' })

  const { t } = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const processSchemeList = ref<any[]>([])

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('使用设备填写') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    code: undefined,
    partNumber: undefined,
    name: undefined,
    projectCode: undefined,
    procedureName: undefined,
    inventory: undefined,
    useInventory: undefined,
    projectPlanId: undefined,
    projectPlanItemId: undefined,
    specification: undefined,
    type: undefined,
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

  }



  defineExpose({ open }) // 提供 open 方法，用于打开弹窗

  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
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
      //await MaterialPurchaseApi.updatePlanItem(formData.value)
      dialogVisible.value = false
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
      code: undefined,
      partNumber: undefined,
      name: undefined,
      projectCode: undefined,
      procedureName: undefined,
      inventory: undefined,
      useInventory: undefined,
      projectPlanId: undefined,
      projectPlanItemId: undefined,
      specification: undefined,
      type: undefined,
    }
    formRef.value?.resetFields()
  }

</script>
