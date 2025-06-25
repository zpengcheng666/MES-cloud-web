<template>
  <el-tabs>
    <el-tab-pane label="申请信息">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购类型" prop="type">
              <el-select v-model="formData.type" disabled >
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
                check-strictly
                node-key="id"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicant">
              <el-select v-model="formData.applicant" clearable disabled >
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
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="申请理由" prop="applicationReason">
              <el-input type="textarea"  v-model="formData.applicationReason" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 子表的表单 -->
      <ContentWrap>
        <el-tabs model-value="requirementDetail">
          <el-tab-pane label="需求明细" name="requirementDetail">
            <PurchaseRequirementDetailForm ref="requirementDetailFormRef" :requirement-id="formData.id" :details="formData.details" :form-type="'detail'"/>
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

    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useTagsViewStore} from "@/store/modules/tagsView";
import {defaultProps, handleTree} from "@/utils/tree";
import {PurchaseRequirementApi} from "@/api/ppm/purchaserequirement";
import * as DeptApi from "@/api/system/dept";
import * as UserApi from "@/api/system/user";
import PurchaseRequirementDetailForm from "./PurchaseRequirementDetailForm.vue";
import {erpNumberFormatter} from "@/utils";

defineOptions({ name: 'BpmRequirementDetail' })
const route = useRoute()
const props = defineProps<{ id?: number }>()
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

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

const formRef = ref() // 表单 Ref

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

/** 关闭 */
const { delView } = useTagsViewStore() // 视图操作
const { currentRoute } = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

const deptList = ref<Tree[]>([]) // 树形结构
const userList = ref<UserApi.UserVO[]>([]) // 全量用户清单

// 根据选择的部门筛选员工清单
const userListByDeptId = computed(() =>
  formData.value.applicationDepartment
    ? userList.value.filter((u: UserApi.UserVO) => u.deptId === formData.value.applicationDepartment)
    : []
)

const ERP_PRICE_DIGIT = 2
const priceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，合同不能为空！')
    close()
    return
  }
  formData.value = await PurchaseRequirementApi.getPurchaseRequirement(id)
  formData.value.applicationDepartment = Number(formData.value.applicationDepartment)
  formData.value.applicant = Number(formData.value.applicant)

  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
  userList.value = handleTree(await UserApi.getSimpleUserList())
})
</script>
