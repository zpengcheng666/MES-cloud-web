<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-form-item label="类型名称" prop="productTypeName" >
        <el-input v-model="formData.productTypeName" placeholder="请输入产品类型名称" />
      </el-form-item>

      <el-form-item label="类型介绍" prop="productTypeText">
        <el-input type='textarea'  v-model="formData.productTypeText" placeholder="请输入产品类型介绍" autosize/>
      </el-form-item>

      <el-form-item label="采集周期(分钟)" prop="collectAttributesCycle">
        <el-input  v-model="formData.collectAttributesCycle" type="number" oninput="value=value.replace(/\D/g,'')" placeholder="请输入采集周期" class="!w-240px" />
      </el-form-item>

      <el-form-item label="通信编码" prop="topicId">
        <el-input  v-model="formData.topicId" oninput="value=value.replace(/[^a-zA-Z]/g,'')"  :maxlength="20" placeholder="请输入20位以内全英文通信编码" class="!w-240px" :disabled="formType == 'update'" />
      </el-form-item>

      <el-form-item label="通信类型" prop="collectAttributesType">
        <el-select-v2
          v-model="formData.collectAttributesType"
          :options="getIntDictOptions(DICT_TYPE.COLLECT_ATTRIBUTES_TYPE)"
          placeholder="选择通信类型"
          clearable
          class="!w-240px"
        />
      </el-form-item>

      <ContentWrap>
        <el-tabs v-model="collectAttributes">
          <el-tab-pane label="采集属性详情" name="collectAttributesDetails">
            <CollectAttributesDetailForm ref="collectAttributesDetailFormRef" :product-type-id="formData.id" :collect-attributes-details="formData.collectAttributesDetails" :form-type="formType" />
          </el-tab-pane>
        </el-tabs>
      </ContentWrap>


    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading || formType == 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProductTypeApi, ProductTypeVO } from '@/api/dc/producttype'

import CollectAttributesDetailForm from './CollectAttributesDetailForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

/** 产品类型 表单 */
defineOptions({ name: 'ProductTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const collectAttributes = ref("collectAttributesDetails")
const formData = ref({
  id: undefined,
  productTypeName: undefined,
  productTypeText: undefined,
  collectTypeId: undefined,
  collectAttributesDetails: undefined,
  collectAttributesCycle: undefined,
  topicId: undefined,
  collectAttributesType: undefined,
})
const formRules = reactive({
  productTypeName: [{ required: true, message: '产品类型名称不能为空', trigger: 'blur' }],
  productTypeText: [{ required: true, message: '产品类型介绍不能为空', trigger: 'blur' }],
  collectAttributesCycle: [{ required: true, message: '采集周期不能为空', trigger: 'blur' }],
  collectAttributesType: [{ required: true, message: '通信类型不能为空', trigger: 'blur' }],
  topicId: [{ required: true, message: '通信编码不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const collectAttributesDetailFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProductTypeApi.getProductType(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  console.log(collectAttributes)
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await collectAttributesDetailFormRef.value.validate()
  } catch (e) {
    collectAttributes.value = 'collectAttributesDetails'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProductTypeVO
    if (formType.value === 'create') {
      data.collectAttributesDetails = collectAttributesDetailFormRef.value.getData()
      await ProductTypeApi.createProductType(data)
      message.success(t('common.createSuccess'))
    } else {
      data.collectAttributesDetails = collectAttributesDetailFormRef.value.getData()
      await ProductTypeApi.updateProductType(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    productTypeName: undefined,
    productTypeText: undefined,
    collectTypeId: undefined,
    collectAttributesDetails: undefined,
    collectAttributesCycle: undefined,
    topicId: undefined,
    collectAttributesType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
