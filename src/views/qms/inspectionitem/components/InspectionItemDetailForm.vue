<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="检测项配置" prop="inspectionItemConfigId">

        <el-select
          v-model="formData.inspectionItemConfigId"
          clearable
          filterable
          placeholder="请选择检测项"
          class="!w-1/1"
        >
          <el-option
            v-for="item in configList"
            :key="item.id"
            :label="item.name"
            :value="item.id+''"
          />
        </el-select>


        <!--<el-input v-model="formData.inspectionItemConfigId" placeholder="请输入检测项配置表ID" />-->
      </el-form-item>
       <el-form-item label="判断方式" prop="referenceType">
        <el-select v-model="formData.referenceType" placeholder="请选择">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_REFERENCE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="技术要求（数字）" prop="number">
        <el-input v-model="formData.number" placeholder="请输入数字" />
      </el-form-item>
      <el-form-item label="上限值" prop="maxValue">
        <el-input v-model="formData.maxValue" placeholder="请输入上限值" />
      </el-form-item>
      <el-form-item label="下限值" prop="minValue">
        <el-input v-model="formData.minValue" placeholder="请输入下限值" />
      </el-form-item>
      <el-form-item label="技术要求（文字）" prop="content">
        <el-input v-model="formData.content" placeholder="请输入下限值" />
      </el-form-item>
      <el-form-item label="判断" prop="judgement">
        <el-input v-model="formData.judgement" placeholder="请输入判断" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
// import { InspectionItemDetailApi } from '@/api/qms/inspectionitemdetail'
import {InspectionItemConfigApi, InspectionItemConfigVO} from '@/api/qms/inspectionitemconfig'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
defineOptions({name: 'InspectionItemDetailForm'})
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const configList = ref <[] > ([]) // 检测项配置信息

const formData = ref({
  id: undefined,
  inspectionItemConfigId: undefined,
  inspectionItemId: undefined,
  referenceType: undefined,
  number: undefined,
  maxValue: undefined,
  minValue: undefined,
  content: undefined,
  judgement: undefined,
})
const formRules = reactive({
  inspectionItemConfigId: [{ required: true, message: '检测项配置表ID不能为空', trigger: 'blur' }],
  inspectionItemId: [{ required: true, message: '检测项目ID不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, inspectionItemId: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.inspectionItemId = inspectionItemId
  configList.value=await InspectionItemConfigApi.getInspectionItemConfigList()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      //formData.value = await InspectionItemDetailApi.getInspectionItemDetail(id)
    } finally {
      formLoading.value = false
    }
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
    if (formType.value === 'create') {
     // await InspectionItemDetailApi.createInspectionItemDetail(data)
      message.success(t('common.createSuccess'))
    } else {
    //  await InspectionItemDetailApi.updateInspectionItemDetail(data)
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
    inspectionItemConfigId: undefined,
    inspectionItemId: undefined,
    referenceType: undefined,
    number: undefined,
    maxValue: undefined,
    minValue: undefined,
    content: undefined,
    judgement: undefined,
  }
  formRef.value?.resetFields()
}
</script>
