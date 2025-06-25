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
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="depart">
            <!--            <el-input v-model="formData.depart" placeholder="请输入部门" />-->
            <el-select v-model="formData.depart" @blur="e=>selectBlur(e, 'depart')"
                       style="width: 100%"
                       filterable clearable allow-create
                       placeholder="请选择部门" ref="123"
                       :disabled="formType == 'detail'" >
              <el-option v-for="item in dictData.deptList" :key="item.id" :label="item.depart" :value="item.depart" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formData.name" placeholder="请输入姓名" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="formData.sex" placeholder="请选择" class="w-1/1" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_USER_SEX)"
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
          <el-form-item label="年龄" prop="age">
            <el-input-number
              v-model="formData.age"
              :precision="0"
              :min="0"
              left
              controls-position="right"
              placeholder="请输入年龄"
              style="width:100%;"
              :disabled="formType == 'detail'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="在职状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择" class="w-1/1" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_JOB_STATUS)"
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
          <el-form-item label="电话" prop="phone">
            <el-input v-model="formData.phone" maxlength="11" placeholder="请输入电话" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" maxlength="50" placeholder="请输入邮箱" :disabled="formType == 'detail'" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="职务" prop="position">
<!--            <el-input v-model="formData.position" placeholder="请输入职务" />-->
            <el-select v-model="formData.position" @blur="e=>selectBlur(e, 'position')"
                        style="width: 100%"
                       filterable clearable allow-create
                       placeholder="请选择职务" ref="selectInput"
                       :disabled="formType == 'detail'" >
              <el-option v-for="item in dictData.posList" :key="item.id" :label="item.position" :value="item.position" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门负责人" prop="header">
            <!--            <el-input v-model="formData.header" placeholder="请输入部门负责人" />-->
            <el-select v-model="formData.header" @blur="e=>selectBlur(e, 'header')"
                       style="width: 100%"
                       filterable clearable allow-create
                       placeholder="请选择部门负责人" ref="selectInput"
                       :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_HEADER)"
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
          <el-form-item label="直属上级" prop="superior">
<!--            <el-input v-model="formData.superior" placeholder="请输入直属上级" />-->
            <el-select v-model="formData.superior" @blur="e=>selectBlur(e, 'superior')"
                       @change="val=>selectChange(val, 'superior')" style="width: 100%"
                       filterable clearable allow-create
                       placeholder="请选择直属上级" ref="selectInput"
                       :disabled="formType == 'detail'" >
              <el-option v-for="item in dictData.contactList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
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
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" placeholder="请输入备注" type="textarea" :disabled="formType == 'detail'" />
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
import { CompanyContactApi, CompanyContactVO } from '@/api/ppm/companycontact'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {CompanyApi} from "@/api/ppm/company";

/** 企业联系人 表单 */
defineOptions({ name: 'CompanyContactForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const route = useRoute() // 路由

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  companyId: route.params.companyId,
  companyName: undefined,
  name: undefined,
  depart: undefined,
  position: undefined,
  status: undefined,
  superior: undefined,
  header: undefined,
  sex: undefined,
  phone: undefined,
  email: undefined,
  age: undefined,
  address: undefined,
  remark: undefined,
  creationIp: undefined,
  updatedIp: undefined,
})
const formRules = reactive({
  companyId: [{ required: true, message: '企业ID不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  depart: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  header: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string, companyId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 刷新字典
  await getCompanyContactSimpleList(companyId)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CompanyContactApi.getCompanyContact(id)
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
const emit = defineEmits(['success', 'initSelect']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CompanyContactVO

    if (formType.value === 'create') {
      await CompanyContactApi.createCompanyContact(data)
      message.success(t('common.createSuccess'))
    } else {
      await CompanyContactApi.updateCompanyContact(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    emit('initSelect')
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
    name: undefined,
    depart: undefined,
    position: undefined,
    status: undefined,
    superior: undefined,
    header: undefined,
    sex: undefined,
    phone: undefined,
    email: undefined,
    age: undefined,
    address: undefined,
    remark: undefined,
    creationIp: undefined,
    updatedIp: undefined,
  }
  formRef.value?.resetFields()
}


// 部门负责人、直属上级、部门、职位下拉选项
const dictData = ref({
  contactList: [] as any,
  deptList: [] as any,
  posList: [] as any
})
/** 查询列表 */
const getCompanyContactSimpleList = async (companyId) => {
  dictData.value = await CompanyContactApi.getCompanyContactSimpleList(companyId)
}


// 手动输入
function selectBlur(e, field) {
  if (e.target.value) {
    // 当下拉选择框中的值是手动输入的就将手动输入的值赋值给this.inputValue
    formData.value[field] = e.target.value;
  }
}

// 下拉选中
function selectChange(val, field) {
  if (val) {
    // 当选项框中的值不是手动输入的就将选中的value赋值给this.inputValue
    formData.value[field] = val
    // 如果后端同时需要value值就通过循环遍历取出value值
    //let value = this.dataOptions.find((item) => item.label == val)?.value;
  }
}

</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
