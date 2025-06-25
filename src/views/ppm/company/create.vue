<template>
<el-tabs>
  <el-tab-pane label="业务表单">
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
            <el-input v-model="formData.name" placeholder="请输入名称" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用代码" prop="usci">
            <el-input v-model="formData.usci" placeholder="请输入统一社会信用代码" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="组织结构代码" prop="organizationCode">
            <el-input v-model="formData.organizationCode" placeholder="请输入组织结构代码" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司状态" prop="status">
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
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_SUPPLY_TYPE).filter((item) => item.value != 2)"
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
            <el-input v-model="formData.website" placeholder="请输入公司官网" :disabled="formType == 'detail'" />
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

      <el-form-item>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-tab-pane>
  <el-tab-pane label="流程图" lazy>
    <ProcessInstanceBpmnViewer :bpmn-xml="bpmnXML as any" />
  </el-tab-pane>
</el-tabs>
</template>

<script setup lang="ts">
import { CompanyApi } from '@/api/ppm/company'

import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useTagsViewStore} from "@/store/modules/tagsView";
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import * as DefinitionApi from "@/api/bpm/definition";
import {defaultProps} from "@/utils/tree";
import {CompanyVO} from "@/api/ppm/company";

/** 供应商 表单 */
defineOptions({ name: 'BpmCompanyCreate' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

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

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CompanyVO
    data.processKey = 'pm-company-audit'
    await CompanyApi.createAndSubmitCompany(data)
    message.success('发起成功')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'Company' })
  } finally {
    formLoading.value = false
  }
}

// BPMN 数据
const bpmnXML = ref(null)

/** 初始化 */
onMounted(async () => {
  // 获取流程图
  const processDefinitionDetail = await DefinitionApi.getProcessDefinition(undefined,"pm-company-audit")
  if (processDefinitionDetail) {
    bpmnXML.value = processDefinitionDetail.bpmnXml
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
