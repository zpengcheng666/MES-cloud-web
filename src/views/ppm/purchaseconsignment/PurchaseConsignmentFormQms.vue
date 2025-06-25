<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="收货单" prop="no">
            <el-input v-model="formData.no" placeholder="请输入收货单" :disabled="formDisabled != 0"/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="合同编号" prop="contractId">
            <el-select
              v-model="formData.contractId"
              clearable
              filterable
              placeholder="请选择合同"
              class="!w-1/1"
            >
              <el-option
                v-for="item in constractList"
                :key="item.id"
                :label="item.name + '('+item.number +')'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>





    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="采购明细" name="purchaseConsignmentDetail">
        <PurchaseConsignmentDetailFormQms ref="purchaseConsignmentDetailFormRef" :consignment-id="formData.id" :confirmStatus="formDisabled"
                                       :contract-id="constractId" :orderInfo="orderInfo"/>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">质 检</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
import PurchaseConsignmentDetailFormQms from './components/PurchaseConsignmentDetailFormQms.vue'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from "@/api/system/user";
// import {defaultProps, handleTree} from "@/utils/tree";
import {ContractApi} from "@/api/ppm/contract";

/** 采购收货 表单 */
defineOptions({ name: 'PurchaseConsignmentFormQms' })
const formDisabled = ref(0)
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  consignmentName:undefined,
  contractId: undefined,
  companyId: undefined,
  contractNo: undefined,
  consignedBy: undefined,
  no: undefined,
  consignedDate: undefined,
  consignedContact: undefined,
  consigner: undefined,
  consignerContact: undefined,
  consignerDate: undefined,
  deliveryMethod: undefined,
  deliveryNumber: undefined,
  deliveryBy: undefined,
  deliveryContact: undefined,
  processInstanceId: undefined,
  status: undefined,
  department: undefined,
  consignmentStatus: undefined
})
const formRules = reactive({
  contractId: [{ required: true, message: '合同编号不能为空', trigger: 'blur' }],
  no: [{ required: true, message: '收货单不能为空', trigger: 'blur' }],
  consignedBy: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
  consignedDate: [{ required: true, message: '收货日期不能为空', trigger: 'blur' }],
  consignmentName: [{ required: true, message: '收货单名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

// const deptName = ref('')
const userList = ref<UserApi.UserVO[]>([]) // 用户清单
const deptList = ref<Tree[]>([]) // 树形结构

const constractList = ref < ContractApi.ContractVO[] > ([]) //合同列表

const constractId = ref('0');

const orderInfo = ref([]) as any

/** 子表的表单 */
const subTabsName = ref('purchaseConsignmentDetail')
const purchaseConsignmentDetailFormRef = ref()

/** 打开弹窗 */
const open = async (type: string,
                    id?: number,
                    confirmStatus ? : number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  subTabsName.value = 'purchaseConsignmentDetail'
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await
      PurchaseConsignmentApi.getPurchaseConsignment(id)
      constractId.value =formData._value.contractId;
      orderInfo.value =await PurchaseConsignmentApi.getContractOrderListByContractId(formData._value.contractId);
    } finally {
      formLoading.value = false
    }
  }
  if (confirmStatus) {
    formDisabled.value = confirmStatus;
  } else {
    formDisabled.value = 0;
  }

    // 加载用户列表
    userList.value = await
    UserApi.getSimpleUserList()

    // 加载合同列表
    constractList.value = await
    ContractApi.getContractListByType(1)

  }
  defineExpose({ open }) // 提供 open 方法，用于打开弹窗


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await purchaseConsignmentDetailFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'purchaseConsignmentDetail'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as PurchaseConsignmentVO
    // 拼接子表的数据
    data.purchaseConsignmentDetails = purchaseConsignmentDetailFormRef.value.getData()
      await PurchaseConsignmentApi.updatePurchaseConsignmentForQms(data)
      message.success(t('common.updateSuccess'))
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
    companyId: undefined,
    consignmentName:undefined,
    contractNo: undefined,
    id: undefined,
    contractId: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    consigner: undefined,
    consignerContact: undefined,
    consignerDate: undefined,
    deliveryMethod: undefined,
    deliveryNumber: undefined,
    deliveryBy: undefined,
    deliveryContact: undefined,
    processInstanceId: undefined,
    status: undefined,
    department: undefined,
    no: undefined,
    consignmentStatus: undefined
  }
  formRef.value?.resetFields()
}


// 加载部门树、用户集合
// onMounted(async () => {
//   deptList.value = handleTree(await DeptApi.getSimpleDeptList())
//   userList.value = handleTree(await UserApi.getSimpleUserList())
// })
</script>
