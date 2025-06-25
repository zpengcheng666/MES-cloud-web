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
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入名称"  :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用代码" prop="usci">
            <el-input v-model="formData.usci" placeholder="请输入统一社会信用代码"  :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织结构代码" prop="organizationCode">
            <el-input v-model="formData.organizationCode" placeholder="请输入组织结构代码"  :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司状态" prop="companyStatus">
            <el-select v-model="formData.companyStatus" placeholder="请选择公司状态" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_STATUS)"
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
          <el-form-item label="公司类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择公司类型" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业分类" prop="industryClassification">
            <el-select v-model="formData.industryClassification" placeholder="请选择行业分类" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_INDUSTRY_CLASSIFICATION)"
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
          <el-form-item label="成立时间" prop="formed">
            <el-date-picker
              v-model="formData.formed"
              placeholder="选择成立时间"
              type="date"
              value-format="x"
              class="!w-1/1"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="注册资金" prop="registrationFund">
            <el-input-number
              v-model="formData.registrationFund"
              :precision="0"
              :min="0"
              left
              controls-position="right"
              placeholder="请输入注册资金"
              style="width:100%;"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供求类型" prop="supplyType">
            <el-select v-model="formData.supplyType" placeholder="请选择供求类型" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_SUPPLY_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人资质" prop="taxpayer">
            <el-select v-model="formData.taxpayer" placeholder="请选择纳税人资质" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_TAXPAYER)"
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
          <el-form-item label="区域" prop="area">
            <!--            <el-cascader v-model="formData.area" :options="options"  :props="defaultData" placeholder="请选择区域" style="width: 100%;">-->
            <!--              <template #default="{ data }">-->
            <!--                <span>{{ data.name }}</span>-->
            <!--              </template>-->
            <!--            </el-cascader>-->

            <el-cascader
              v-model="formData.area"
              :options="areaList"
              :props="defaultProps"
              class="w-1/1"
              clearable
              filterable
              placeholder="请选择区域"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="注册地址" prop="registrationAddress">
            <el-input v-model="formData.registrationAddress" placeholder="请输入注册地址" type="textarea" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业规模" prop="firmSize">
            <el-select v-model="formData.firmSize" placeholder="请选择企业规模" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_FIRM_SIZE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="formData.telephone" maxlength="11" placeholder="请输入电话" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" maxlength="50" placeholder="请输入邮箱" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司官网" prop="website">
            <el-input v-model="formData.website" placeholder="请输入公司官网"  :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="简介" prop="introduction">
            <el-input v-model="formData.introduction" placeholder="请输入简介" type="textarea" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="formType != 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CompanyApi, CompanyVO } from '@/api/ppm/company'
import { defaultProps } from "@/utils/tree";

import * as AreaApi from '@/api/system/area'

/** 供应商信息 表单 */
defineOptions({ name: 'DMCompanyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const areaList = ref([]) // 地区列表

const formData = ref({
  id: undefined,
  name: undefined,
  usci: undefined,
  organizationCode: undefined,
  companyStatus: undefined,
  type: undefined,
  industryClassification: undefined,
  formed: undefined,
  registrationFund: undefined,
  taxpayer: undefined,
  area: undefined,
  registrationAddress: undefined,
  firmSize: undefined,
  telephone: undefined,
  email: undefined,
  website: undefined,
  introduction: undefined,
  creationIp: undefined,
  updatedIp: undefined,
  status: undefined,
  supplyType: undefined,
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  usci: [{ required: true, message: '统一社会信用代码不能为空', trigger: 'blur' }],
  companyStatus: [{ required: true, message: '状态不能为空', trigger: 'change' }],
  type: [{ required: true, message: '公司类型不能为空', trigger: 'change' }],
  industryClassification: [{ required: true, message: '行业分类不能为空', trigger: 'change' }],
  supplyType: [{ required: true, message: '供求类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

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
      formData.value = await CompanyApi.getCompany(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获得地区列表
  areaList.value = await AreaApi.getAreaTree()
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
    const data = formData.value as unknown as CompanyVO
    if (formType.value === 'create') {
      await CompanyApi.createCompany(data)
      message.success(t('common.createSuccess'))
    } else {
      await CompanyApi.updateCompany(data)
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
    name: undefined,
    usci: undefined,
    organizationCode: undefined,
    companyStatus: undefined,
    type: undefined,
    industryClassification: undefined,
    formed: undefined,
    registrationFund: undefined,
    taxpayer: undefined,
    area: undefined,
    registrationAddress: undefined,
    firmSize: undefined,
    telephone: undefined,
    email: undefined,
    website: undefined,
    introduction: undefined,
    creationIp: undefined,
    updatedIp: undefined,
    status: undefined,
    supplyType: undefined,
  }
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>


