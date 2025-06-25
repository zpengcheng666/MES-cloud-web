<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="订单编号" prop="orderId">
        <el-select disabled v-model="formData.orderId" filterable placeholder="请选择订单编号" >
          <el-option
            v-for="order in orderFormList"
            :key="order.id"
            :label="order.orderNumber"
            :value="order.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="批次编码" prop="batchNumber">
        <el-input disabled v-model="demandInfo.batchNumber" placeholder="批次编码" />
      </el-form-item>
      <el-form-item label="生成单元" prop="unitName">
        <el-input disabled v-model="demandInfo.unitName" placeholder="选择生成单元" />
      </el-form-item>
      <el-form-item label="需求类型" prop="requirementType">
        <el-select disabled v-model="formData.requirementType" placeholder="请选择需求类型">
          <el-option v-for="dict in getIntDictOptions('mcs_requirement_type')"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="资源编码" prop="resourceCode">
        <el-input disabled v-model="formData.resourceCode" placeholder="请输入资源编码" />
      </el-form-item>
      <el-form-item label="需求数量" prop="total">
        <el-input disabled v-model="formData.total" placeholder="请输入需求数量" />
      </el-form-item>
      <el-form-item label="最小需求数量" prop="minimum">
        <el-input type="number" v-model="formData.minimum" placeholder="请输入最小数量" />
      </el-form-item>
      <el-form-item label="齐备状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择齐备状态">
          <el-option v-for="dict in getIntDictOptions('mcs_ready_status')"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { BatchOrderDemandApi, BatchOrderDemandVO } from '@/api/mcs/batchorderdemand'
import {inject} from "vue";
import { getIntDictOptions } from '@/utils/dict'

defineOptions({ name: 'CompleteConfirmView' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const orderFormList = ref([]);
const demandInfo = inject("demandInfo");

const formRef = ref() // 表单 Ref
const formData = ref({
  orderNumber: undefined,
  batchCode: undefined,
  resourceType: undefined,
  resourceCode: undefined,
  total: undefined,
  minimum: undefined,
  status: undefined,
  confirmedBy: undefined,
  confirmedTime: undefined,
  requirementType: undefined,
})

const formRules = reactive({
  status: [{ required: true, message: '需求状态不能为空', trigger: 'blur' }],
})

const open = async (id: number) => {
  dialogVisible.value = true
  dialogTitle.value = '需求齐备确认'
  // 修改时，设置数据
  resetForm()
  formLoading.value = true
  try {
    formData.value = await BatchOrderDemandApi.getBatchOrderDemand(id)
  } finally {
    formLoading.value = false
  }
  orderFormList.value = await BatchOrderDemandApi.getOrderList({status: [0,1,4]})
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗



/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as BatchOrderDemandVO
    await BatchOrderDemandApi.updateBatchOrderComplete(data)
    message.success(t('common.updateSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
const resetForm = () => {
  formData.value = {
    orderNumber: undefined,
    batchCode: undefined,
    resourceType: undefined,
    resourceCode: undefined,
    total: undefined,
    minimum: undefined,
    status: undefined,
    confirmedBy: undefined,
    confirmedTime: undefined,
    requirementType: undefined,
  }
  formRef.value?.resetFields()
}

</script>

<style scoped>

</style>
