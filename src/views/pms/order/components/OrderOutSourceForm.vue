<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="400">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <!--<el-form-item label="订单数量" prop="quantity">-->
        <!--<el-input-number v-model="formData.quantity" placeholder="请输入订单数量" disabled/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="整单外协" prop="outsource">-->
        <!--<el-input-number v-model="formData.outsource" placeholder="请输入订单数量"/>-->
        <!--<el-switch v-model="formData.outsource" inline-prompt active-text="是" inactive-text="否" size="large"/>-->
      <!--</el-form-item>-->
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
      <el-form-item  label="外协备料" prop="outsourcePrepareMaterial">
        <!--<el-input-number v-model="formData.outsource" placeholder="请输入订单数量"/>-->
        <el-switch v-model="formData.outsourcePrepareMaterial" inline-prompt active-text="是" inactive-text="否" size="large"/>
      </el-form-item>
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
const formData = ref({
  id: undefined,
  quantity:undefined,
  outsource:undefined
})
const formRules = reactive({

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
