<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择类型" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_FINANCE_PAY_METHOD)"
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
          <el-form-item label="账号" prop="accountNumber">
            <el-input v-model="formData.accountNumber" placeholder="请输入账号" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行" prop="bank">
            <el-input v-model="formData.bank" placeholder="请输入银行" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <el-input v-model="formData.address" placeholder="请输入地址" type="textarea" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="电话" prop="telephone">
            <el-input v-model="formData.telephone" maxlength="11" placeholder="请输入电话" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联行号" prop="bankAddress">
            <el-input v-model="formData.bankAddress" placeholder="请输入联行号" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="附件" prop="fileUrl">
            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" :formType="formType"/>
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
import { CompanyFinanceApi, CompanyFinanceVO } from '@/api/ppm/companyfinance'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {CompanyApi} from "@/api/ppm/company";

/** 企业税务信息 表单 */
defineOptions({ name: 'CompanyFinanceForm' })

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
  type: undefined,
  accountNumber: undefined,
  bank: undefined,
  address: undefined,
  telephone: undefined,
  bankAddress: undefined,
  fileUrl: '',
})
const formRules = reactive({
  companyId: [{ required: true, message: '公司ID不能为空', trigger: 'blur' }],
  accountNumber: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, companyId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CompanyFinanceApi.getCompanyFinance(id)
    } finally {
      formLoading.value = false
    }
  }

  if (companyId) {
    formData.value.companyId = companyId
    // 通过companyId查询公司
    const data = await CompanyApi.getCompany(formData.value.companyId)
    formData.value.companyName = data.name
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
    const data = formData.value as unknown as CompanyFinanceVO
    if (formType.value === 'create') {
      await CompanyFinanceApi.createCompanyFinance(data)
      message.success(t('common.createSuccess'))
    } else {
      await CompanyFinanceApi.updateCompanyFinance(data)
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
    type: undefined,
    accountNumber: undefined,
    bank: undefined,
    address: undefined,
    telephone: undefined,
    bankAddress: undefined,
    fileUrl: '',
  }
  formRef.value?.resetFields()
}
</script>
