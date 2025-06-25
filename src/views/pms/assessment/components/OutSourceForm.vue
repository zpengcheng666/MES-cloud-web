<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-form-item label="订单数量" prop="quantity">
        <el-input-number v-model="formData.quantity" placeholder="请输入订单数量" disabled/>
      </el-form-item>
      <!--<el-form-item label="整单外协" prop="outsource">-->
        <!--<el-input-number v-model="formData.outsource" placeholder="请输入订单数量"/>-->
        <!--<el-switch v-model="formData.outsource" inline-prompt active-text="是" inactive-text="否" size="large"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="外协数量" prop="outSourceAmount">-->
      <!--<el-input-number v-model="formData.outSourceAmount" placeholder="请输入外协数量"/>-->
      <!--</el-form-item>-->
      <el-form-item label="带料加工" prop="processType">
        <el-select v-model="formData.processType" placeholder="请选择带料加工" disabled>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_PROCESS_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="整单外协" prop="outsource">
        <el-select v-model="formData.outsource" placeholder="请选择是否整单外协">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料类型" prop="materialNumber" v-if="formData.processType===1&&formData.outsource===1">
        <el-select v-model="formData.materialNumber" placeholder="请选择物料" :disabled="ordertype">
          <el-option
            v-for="item in mpList"
            :key="item.id"
            :label="item.materialNumber"
            :value="item.materialNumber"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="外协备料" prop="outsourcePrepareMaterial">-->
        <!--<el-select v-model="formData.outsourcePrepareMaterial" placeholder="请选择是否外协备料">-->
          <!--<el-option-->
            <!--v-for="dict in getIntDictOptions(DICT_TYPE.PMS_ORDER_OUTSOURCE)"-->
            <!--:key="dict.value"-->
            <!--:label="dict.label"-->
            <!--:value="dict.value"-->
          <!--/>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="外协数量" prop="outSourceAmount">-->
        <!--<el-input-number v-model="formData.outSourceAmount" placeholder="请输入外协数量"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="工序外协" prop="stepOutSourceAmount">-->
        <!--<el-input-number v-model="formData.stepOutSourceAmount" placeholder="请输入工序外协数量"/>-->
      <!--</el-form-item>-->

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE,getBoolDictOptions } from '@/utils/dict'
import AssessmentReplenishForm from './components/AssessmentReplenishForm.vue'
import {OrderApi} from '@/api/pms/order'

/** 外协数量窗口 */
defineOptions({ name: 'OutSourceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const modeVisible = ref(false);
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const mpList = ref<any[]>([]) // 列表的数据
const formData = ref({
  id: undefined,
  quantity:undefined,
  outsource:undefined,
  materialNumber:undefined,
  // outSourceAmount:undefined,
  // stepOutSourceAmount:undefined
})
const checkQuantity =async (rule,value,callback)=>{
  if((formData.value.outSourceAmount+formData.value.stepOutSourceAmount)>formData.value.quantity){
    callback(new Error('所有外协的数量之和不能大于订单数量'))
  }
  callback()
}
const checkOutSource =async (rule,value,callback)=>{
  if(formData.value.stepOutSourceAmount<0){
    callback(new Error('工序外协数量应大于0'))
  }
  callback()
}
const checkStepOutSource =async (rule,value,callback)=>{
  if(formData.value.outSourceAmount<0){
    callback(new Error('外协数量应大于0'))
  }
  callback()
}
const formRules = reactive({
  // quantity: [{validator: checkQuantity,trigger: 'blur'}],
  // outSourceAmount: [{validator: checkOutSource,trigger: 'blur'}],
  // stepOutSourceAmount: [{validator: checkStepOutSource,trigger: 'blur'}],
  outsource: [{ required: true, message: '整单外协不能为空', trigger: 'blur' }],
  // outsourcePrepareMaterial: [{ required: true, message: '外协备料不能为空', trigger: 'blur' }],
  materialNumber: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (orderId) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + 'update')
  resetForm()
  // 修改时，设置数据
  formLoading.value = true
  try {
    //查询订单
    formData.value =  await OrderApi.getOrder(orderId);
    mpList.value = await OrderApi.getMaterialByTypeCode("MP");
  } finally {
    formLoading.value = false
  }

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
    const data = formData.value
    dialogVisible.value = false
    await OrderApi.updateOrder(data);
    // 发送操作成功的事件
    // emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    quantity:undefined,
    outsource:undefined,
    // outSourceAmount:undefined,
    // stepOutSourceAmount:undefined
  }
  formRef.value?.resetFields()
}
</script>
