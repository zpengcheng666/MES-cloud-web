<template>
  <ContentWrap class="h-1/1">
    <el-form ref="formRefUpdate" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="厂家" prop="companyId">
        <el-select v-model="formData.companyId" @change="handleChange" placeholder="请选择厂家" filterable clearable class="!w-240px">
          <el-option v-for="company in companyList" :key="company.id" :label="company.name" :value="company.id" />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="项目" prop="projectCode">-->
<!--        <el-select v-model="formData.projectCode" placeholder="请选择项目" filterable clearable class="!w-240px">-->
<!--          <el-option v-for="project in projectList" :key="project.code" :label="project.name" :value="project.code" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="产品机型" prop="rootProductId">-->
<!--        <el-select v-model="formData.rootProductId" placeholder="请选择产品机型" filterable clearable class="!w-240px">-->
<!--          <el-option v-for="product in productList" :key="product.id" :label="product.productNumber"-->
<!--                     :value="product.id" />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="数据包结构" prop="structureId">
        <el-select v-model="formData.structureId" placeholder="请选择数据包结构" filterable clearable class="!w-240px">
          <el-option v-for="structure in structureList" :key="structure.id" :label="structure.name"
            :value="structure.id" />
        </el-select>
        <el-button @click="preview()" type="primary" style="margin-left:20px">预 览</el-button>
      </el-form-item>
      <el-form-item label="数据包" prop="file">
<!--        <el-upload ref="uploadRef" v-model:file-list="fileList"-->
<!--          :action="importUrl + '?rootProductId=' + formData.rootProductId + '&projectCode=' + formData.projectCode + '&structureId=' + formData.structureId"-->
<!--          :auto-upload="false" :disabled="formLoading" :headers="uploadHeaders" :limit="1" :on-error="submitFormError"-->
<!--          :on-exceed="handleExceed" :on-success="submitFormSuccess" accept=".zip" drag>-->
<!--          <Icon icon="ep:upload" />-->
<!--          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--          <template #tip>-->
<!--            <div class="el-upload__tip text-center">-->
<!--              <span>仅允许导入 zip 格式文件。</span>-->
<!--            </div>-->
<!--          </template>-->
<!--        </el-upload>-->
        <el-upload ref="uploadRef" v-model:file-list="fileList"
                   :action="importUrl + '?companyId=' + formData.companyId + '&companyName=' + formData.companyName + '&structureId=' + formData.structureId"
                   :auto-upload="false" :disabled="formLoading" :headers="uploadHeaders" :limit="1" :on-error="submitFormError"
                   :on-exceed="handleExceed" :on-success="submitFormSuccess" accept=".zip" drag>
          <Icon icon="ep:upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip text-center">
              <span>仅允许导入 zip 格式文件。</span>
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-button :disabled="formLoading" type="warning" plain @click="submitForm" class="ml-120px">
      <Icon icon="ep:upload" class="mr-5px" /> 导入
    </el-button>
    <el-button @click="resetForm">
      <Icon icon="ep:refresh" class="mr-5px" /> 重置
    </el-button>
  </ContentWrap>

  <!-- 预览弹窗 -->
  <StructurePreview ref="formRef" />
</template>
<script setup lang="ts">
import * as ProductApi from '@/api/pdm/product';
import { StructureApi } from '@/api/pdm/structureDefinition'
import { CompanyApi } from '@/api/ppm/company'
import StructurePreview from "./StructurePreview.vue";
import { getAccessToken, getTenantId } from '@/utils/auth'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const formLoading = ref(false) // 表单的加载中
const uploadRef = ref() // 上传数据包Ref
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/pdm/data-import/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

const formData = ref({
  rootProductId: '',
  projectCode: '',
  structureId: undefined,
  companyId: '',
  companyName: '',
})
const formRules = reactive({
  // rootProductId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  // projectCode: [{ required: true, message: '请选择项目', trigger: 'change' }],
  companyId: [{ required: true, message: '请选择厂家', trigger: 'change' }],
  structureId: [{ required: true, message: '请选择数据包结构', trigger: 'change' }],
})

const productList = ref<any[]>([]) // 产品列表
const projectList = ref<any[]>([]) // 项目列表
const companyList = ref<any[]>([]) // 厂家列表
const structureList = ref<any[]>([]) // 数据包结构列表

const handleChange = async (value) => {
  companyList.value.forEach((item) => {
    if(item.id === value) {
      formData.value.companyName = item.name;
    }
  })
}
const formRefUpdate = ref() // 导入表单Ref
const submitForm = async () => {
  // 校验表单
  await formRefUpdate.value.validate()
  try {
    if (fileList.value.length == 0) {
      message.error('请上传数据包')
      return
    }
    // 提交请求
    uploadHeaders.value = {
      Authorization: 'Bearer ' + getAccessToken(),
      'tenant-id': getTenantId()
    }
    formLoading.value = true
    uploadRef.value!.submit()
  } finally {
  }
}

const queryParams = reactive({
  type: 1,
  status: 0
})

const productParams = reactive({
  status: 0,
  productType: 0
})

/** 查询列表 */
const getList = async () => {
  try {
    //加载产品列表
    // productList.value = await ProductApi.getProductList(productParams)
    //加载项目列表
    // projectList.value = await ProductApi.getProjectList(null)
    //加载厂家列表
    companyList.value = await CompanyApi.getCompanyListByType("2,3")
    //加载数据包结构列表
    structureList.value = await StructureApi.getStructureList(queryParams)
  } finally {
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const formRef = ref()
const preview = async () => {
  // 校验表单
  await formRefUpdate.value.validate()
  formRef.value.open(formData.value.structureId)
}

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

const submitFormSuccess = (response: any) => {
  if (response.code !== 0) {
    message.error(response.msg)
    formLoading.value = false
    return
  }
  message.success(t('common.importSuccess'))
  resetForm()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    rootProductId: '',
    projectCode: '',
    structureId: undefined,
  }
  formRefUpdate.value?.resetFields()
  // 重置上传状态和文件
  formLoading.value = false
  uploadRef.value?.clearFiles()
}
</script>
