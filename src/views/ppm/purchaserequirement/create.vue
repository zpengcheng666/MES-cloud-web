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
              class="!w-1/1"
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
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useTagsViewStore} from "@/store/modules/tagsView";
import ProcessInstanceBpmnViewer from '../../bpm/processInstance/detail/ProcessInstanceBpmnViewer.vue'
import * as DefinitionApi from "@/api/bpm/definition";
import {defaultProps, handleTree} from "@/utils/tree";
import {CompanyVO} from "@/api/ppm/company";
import PurchaseRequirementDetailForm
  from "@/views/ppm/purchaserequirement/PurchaseRequirementDetailForm.vue";
import * as DeptApi from "@/api/system/dept";
import * as UserApi from "@/api/system/user";
import {PurchaseRequirementApi, PurchaseRequirementVO} from "@/api/ppm/purchaserequirement";
import {erpNumberFormatter} from "@/utils";

/** 供应商 表单 */
defineOptions({ name: 'BpmRequirementCreate' })

const message = useMessage() // 消息弹窗
const { delView } = useTagsViewStore() // 视图操作
const { push, currentRoute } = useRouter() // 路由

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

// 表单 Ref
const formRef = ref()
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

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseRequirementVO
    await PurchaseRequirementApi.createAndSubmitPurchaseRequirement(data)
    message.success('发起成功')
    // 关闭当前 Tab
    delView(unref(currentRoute))
    await push({ name: 'Requirement' })
  } finally {
    formLoading.value = false
  }
}

const deptList = ref<Tree[]>([]) // 树形结构
const userList = ref<UserApi.UserVO[]>([]) // 全量用户清单

// 根据选择的部门筛选员工清单
const userListByDeptId = computed(() =>
  formData.value.applicationDepartment
    ? userList.value.filter((u: UserApi.UserVO) => u.deptId === formData.value.applicationDepartment)
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

// BPMN 数据
const bpmnXML = ref(null)

/** 初始化 */
onMounted(async () => {

  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  userList.value = handleTree(await UserApi.getSimpleUserList())

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
