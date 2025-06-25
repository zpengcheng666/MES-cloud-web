<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择采购类型" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PPM_REQUIREMENT_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请部门" prop="applicationDepartment">
            <el-tree-select
              v-model="formData.applicationDepartment"
              :data="deptList"
              :props="defaultProps"
              @change="changeDept"
              check-strictly
              node-key="id"
              placeholder="请选择申请部门"
              :disabled="deptId!=null"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicant">
            <el-select v-model="formData.applicant" placeholder="请选择申请人" clearable >
              <el-option
                v-for="(user, index) in userListByDeptId"
                :label="user.nickname"
                :value="user.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="申请日期" prop="applicationDate">
            <el-date-picker
              v-model="formData.applicationDate"
              type="date"
              value-format="x"
              placeholder="选择申请日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="申请理由" prop="applicationReason">
            <el-input type="textarea"  v-model="formData.applicationReason" placeholder="请输入申请理由" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 子表的表单 -->
    <ContentWrap>
      <el-tabs model-value="requirementDetail">
        <el-tab-pane label="需求明细" name="requirementDetail">
          <PurchaseRequirementDetailForm ref="requirementDetailFormRef" :requirement-id="formData.id" :details="formData.details" :form-type="formType"/>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <el-row>
      <el-col :span="8">
        <el-form-item label="总金额" prop="totalPrice">
          <el-input
            disabled
            v-model="formData.totalPrice"
            :formatter="priceInputFormatter"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { PurchaseRequirementApi, PurchaseRequirementVO } from '@/api/ppm/purchaserequirement'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import * as DeptApi from '@/api/system/dept'
import { defaultProps, handleTree } from '@/utils/tree'
import * as UserApi from "@/api/system/user";
import PurchaseRequirementDetailForm from "./PurchaseRequirementDetailForm.vue";
import {erpNumberFormatter} from "@/utils";

/** 采购申请主 表单 */
defineOptions({ name: 'PurchaseRequirementForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  deptId: undefined
}>()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  type: undefined,
  applicant: undefined,
  applicationDepartment: undefined,
  applicationDate: undefined,
  applicationReason: undefined,
  totalPrice: 0,
  details: []
})
const formRules = reactive({
  type: [{ required: true, message: '采购类型不能为空', trigger: 'change' }],
  applicationDepartment: [{ required: true, message: '申请部门不能为空', trigger: 'change' }],
  applicant: [{ required: true, message: '申请人不能为空', trigger: 'change' }],
  applicationDate: [{ required: true, message: '申请日期不能为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
/** 子表的表单 */
const requirementDetailFormRef = ref()

/** 计算总金额 */
watch(
  () => formData.value.details,
  (val) => {
    if (!val) {
      return
    }
    // 价格合计
    const totalPrice = val.reduce((prev, curr) => (parseFloat(prev) + parseFloat(curr.estimatedPrice) * curr.requiredQuantity), 0)
    formData.value.totalPrice = totalPrice  ? totalPrice : 0
  },
  { deep: true }
)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  // 部门ID不为空 默认申请部门为当前部门
  if(props.deptId){
    formData.value.applicationDepartment = props.deptId
  }

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await PurchaseRequirementApi.getPurchaseRequirement(id)
      formData.value.applicationDepartment = Number(formData.value.applicationDepartment)
      formData.value.applicant = Number(formData.value.applicant)
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
  // 校验子表单
  try {
    await requirementDetailFormRef.value.validate()
  } catch (e) {
    return
  }

  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseRequirementVO
    if (formType.value === 'create') {
      await PurchaseRequirementApi.createPurchaseRequirement(data)
      message.success(t('common.createSuccess'))
    } else {
      await PurchaseRequirementApi.updatePurchaseRequirement(data)
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
    type: undefined,
    applicant: undefined,
    applicationDepartment: undefined,
    applicationDate: undefined,
    applicationReason: undefined,
    details: []
  }
  formRef.value?.resetFields()
}

// const deptName = ref('')
const deptList = ref<Tree[]>([]) // 树形结构
const userList = ref<UserApi.UserVO[]>([]) // 全量用户清单

// 根据选择的部门筛选员工清单
const userListByDeptId = computed(() =>
    formData.value.applicationDepartment
      ? userList.value.filter((u: UserApi.UserVO) => u.deptId == formData.value.applicationDepartment)
      : []
)

/** 修改部门 清空申请人 */
const changeDept = async () => {
  formData.value.applicant = undefined
}

const ERP_PRICE_DIGIT = 2
const priceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

// 加载部门树、用户集合
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  userList.value = handleTree(await UserApi.getSimpleUserList())
})
</script>
