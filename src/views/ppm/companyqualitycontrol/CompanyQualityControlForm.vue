<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="formData.companyName" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="质量管理体系" prop="qmsc">
            <el-select v-model="formData.qmsc" placeholder="请选择质量管理体系" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_QMSC)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否专职检验" prop="inspection">
            <el-select v-model="formData.inspection" placeholder="请选择是否专职检验" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_INSPECTION)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="不合格品控制" prop=" nonconformingControl">
            <el-select v-model="formData.nonconformingControl" placeholder="请选择是否不合格品控制" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_NONCONFORMING_CONTROL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="生产可追溯" prop="productionTraceability">
            <el-select v-model="formData.productionTraceability" placeholder="请选择是否不合格品控制" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PRODUCTION_TRACEABILITY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采购质量控制" prop="purchasingControl">
            <el-select v-model="formData.purchasingControl" placeholder="请选择是否采购质量控制" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_PURCHASING_CONTROL)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="出厂质量控制" prop="oqc">
            <el-select v-model="formData.oqc" placeholder="请选择出厂质量控制" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_QUALITY_CONTROL_OQC)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" />
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
import { CompanyQualityControlApi, CompanyQualityControlVO } from '@/api/ppm/companyqualitycontrol'
import {DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { CompanyApi } from '@/api/ppm/company'

/** 企业质量控制信息 表单 */
defineOptions({ name: 'CompanyQualityControlForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  companyId: '',
  companyName: undefined,
  qmsc: undefined,
  inspection: undefined,
  nonconformingControl: undefined,
  productionTraceability: undefined,
  purchasingControl: undefined,
  oqc: undefined,
  remark: undefined,
})
const formRules = reactive({
  companyId: [{ required: true, message: '企业编号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (companyId?: string) => {
  dialogVisible.value = true

  resetForm()
  // 修改时，设置数据
  if (companyId) {
    formLoading.value = true
    try {
      let data = await CompanyQualityControlApi.getCompanyQualityControlByCompanyId(companyId)
      // 当前公司填过质量控制信息
      let type = 'create'
      // 存在时可编辑
      if(data){
        formData.value = data
        type = 'update'
      }
      // 新增将companyId封装进去
      else {
        formData.value.companyId = companyId
        // 通过companyId查询公司
        const data = await CompanyApi.getCompany(formData.value.companyId)
        formData.value.companyName = data.name
      }
      dialogTitle.value = t('action.' + type)
      formType.value = type

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
    const data = formData.value as unknown as CompanyQualityControlVO
    if (formType.value === 'create') {
      await CompanyQualityControlApi.createCompanyQualityControl(data)
      message.success(t('common.createSuccess'))
    } else {
      await CompanyQualityControlApi.updateCompanyQualityControl(data)
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
    id: '',
    companyId: '',
    companyName: undefined,
    qmsc: undefined,
    inspection: undefined,
    nonconformingControl: undefined,
    productionTraceability: undefined,
    purchasingControl: undefined,
    oqc: undefined,
    remark: undefined,
  }
  formRef.value?.resetFields()
}
</script>
