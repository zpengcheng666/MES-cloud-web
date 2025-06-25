<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-row :gutter="20">
        <el-form-item label="厂家" prop="companyId">
          <el-select v-model="formData.companyId" @change="handleChange" placeholder="请选择厂家" filterable clearable class="!w-240px">
            <el-option v-for="company in companyList" :key="company.id" :label="company.name" :value="company.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="零件图号：" prop="partNumber" >
          <el-input   class="!w-240px" clearable v-model="formData.partNumber" placeholder="请输入零件图号"/>
        </el-form-item>
        <el-form-item label="零件名称：" prop="partName">
          <el-input  class="!w-240px" clearable v-model="formData.partName" placeholder="请输入零件名称"/>
        </el-form-item>
        <el-form-item label="加工状态：" prop="processCondition">
          <el-input   class="!w-240px" clearable v-model="formData.processCondition" placeholder="请输入加工状态"/>
        </el-form-item>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">

import { PartMasterApi, PartMasterVO } from '@/api/pdm/part/partmaster'
import {useUserStore} from "@/store/modules/user";
import {ref, computed} from "vue";
import { CompanyApi } from '@/api/ppm/company'
import {EncodingRuleApi} from "@/api/mcc/encodingrule";
const userStore = useUserStore();
const userId = userStore.getUser.id; // 当前登录用户id
const userName = userStore.getUser.nickname;
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改，
const companyList = ref<any[]>([]) // 厂家列表
const formData = ref({
  id: '',
  partVersion: '-A',
  partName: '',
  partNumber: '',
  processCondition: '',
  companyName: '',
  companyId: '',
  rootProductId:'',
})

const formRules = reactive({
  companyId: [{ required: true, message: '厂家不能为空', trigger: 'blur' }],
  partName: [{ required: true, message: '零件名称不能为空', trigger: 'blur' }],
  partNumber: [{ required: true, message: '零件图号不能为空', trigger: 'blur' }],
  processCondition: [{ required: true, message: '加工状态不能为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
const List = ref([]); // 工装分类名列表

const handleChange = async (value) => {
  companyList.value.forEach((item) => {
    if(item.id === value) {
      formData.value.companyName = item.name;
    }
  })
}
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = ('新增零件')
  resetForm();
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
    const data = formData.value as unknown as PartMasterVO
      await PartMasterApi.addPart(data)
      message.success(t('common.createSuccess'))
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
    id: '',
    partVersion: '-A',
    partName: '',
    partNumber: '',
    processCondition: '',
    companyId: '',
    companyName: '',
    rootProductId:'',
  }
  formRef.value?.resetFields()
}
/** 查询列表 */
const getList = async () => {
  try {
    //加载厂家列表
    companyList.value = await CompanyApi.getCompanyListByType("2,3")
  } finally { }
}

const cancel = async () => {
  dialogVisible.value = false
  await resetForm()
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
