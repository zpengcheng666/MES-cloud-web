<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="产品名称" prop="productName">
        <el-input v-model="formData.productName" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="产品图号" prop="productNumber">
        <el-input v-model="formData.productNumber" placeholder="请输入产品图号" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-tree-select
          v-model="formData.categoryId"
          :data="categoryList"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="请选择分类"
          class="w-1/1"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status" clearable placeholder="请选择状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设计单位" prop="designUnit">
        <el-input v-model="formData.designUnit" placeholder="请输入设计单位" />
      </el-form-item>
      <el-form-item label="产品描述" prop="description">
        <el-input v-model="formData.description" placeholder="请输入产品描述" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as ProductApi from '@/api/pdm/product'
import { ProductCategoryApi, ProductCategoryVO } from '@/api/pdm/productCategory'
import {defaultProps, handleTree} from "@/utils/tree";

defineOptions({ name: 'PdmProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  productName: '',
  productNumber: '',
  designUnit: '',
  status: CommonStatusEnum.ENABLE,
  description: '',
  categoryId: undefined
})
const formRules = reactive({
  productName: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }],
  productNumber: [{ required: true, message: '产品图号不能为空', trigger: 'change' }],
  categoryId: [{ required: true, message: '产品分类编号不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref
const categoryList = ref<ProductCategoryVO[]>([]) // 产品分类列表

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
      formData.value = await ProductApi.getProduct(id)
    } finally {
      formLoading.value = false
    }
  }
  // 产品分类
  const categoryData = await ProductCategoryApi.getProductCategorySimpleList()
  categoryList.value = handleTree(categoryData, 'id', 'parentId')
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    productName: '',
    productNumber: '',
    designUnit: '',
    status: CommonStatusEnum.ENABLE,
    categoryId: undefined,
    description: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProductApi.ProductVO
    if (formType.value === 'create') {
      await ProductApi.createProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductApi.updateProduct(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
