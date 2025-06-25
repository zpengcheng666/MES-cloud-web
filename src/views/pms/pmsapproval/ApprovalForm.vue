<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200" @close="closeDialog">
    <ApprovalCreateForm ref="approvalCreateFormRef"/>
    <!--<el-tabs v-model="subTabsName">-->
      <!--<el-tab-pane label="项目" name="project">-->
        <!--<PlanItemForm ref="planItemFormRef" :project-plan-id="formData.id" />-->
        <!--<ApprovalCreateForm ref="approvalCreateFormRef"/>-->
      <!--</el-tab-pane>-->
      <!--<el-tab-pane label="订单" name="order">-->
        <!--<OrderBasic ref="orderBasicRef"/>-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->

    <template #footer>
      <el-button @click="submit" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">

  import ApprovalCreateForm from './ApprovalCreateForm.vue'
  import OrderBasic from '../order/OrderBasic.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ApprovalApi, ApprovalVO } from '@/api/pms/pmsapproval'
import * as UserApi from '@/api/system/user'
// import AssessmentForm from './components/AssessmentForm.vue'
import { ContractApi, ContractVO } from '@/api/ppm/contract'
import { CompanyApi } from '@/api/ppm/company'
import { CompanyContactApi } from '@/api/ppm/companycontact'
import PmsOrderListForm from './components/PmsOrderListForm.vue'

/** pms 立项表,项目立项相关 表单 */
defineOptions({ name: 'ApprovalForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const userList = ref([]) // 用户列表
// const contractList = ref([])//合同列表
const companyList = ref([])//客户列表
const companyContactList = ref([])//客户联系人列表
const projectCodeCompare = ref('');
/** 子表 */
const subTabsName = ref('project')
// const orderListFormRef = ref()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const approvalCreateFormRef = ref() // 表单 Ref
// const orderBasicRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  nextTick(()=>{
    approvalCreateFormRef.value.setType(type)
    //订单获取物料类型
    // orderBasicRef.value.getMaterialList();
  })
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      // formData.value = await ApprovalApi.getApproval(id)
      const projectValue = await ApprovalApi.getApproval(id);
      const orderValue = projectValue.pmsorder;
      //外部订单，不许修改
      // debugger
      // if(orderValue?.orderType===0){
      //   orderBasicRef.value.setOrderType(true);
      // }
      approvalCreateFormRef.value.setProjectData(projectValue);
      // if(!!orderValue){
      //   orderBasicRef.value.setData(orderValue);
      // }


      // const ordervalue = projectvalue.
      //
      // const data = await CompanyContactApi.getCompanyContactSimpleList(formData.value.projectClient);
      // companyContactList.value = data.contactList;
      // projectCodeCompare.value = formData.value.projectCode;
      // formData.value.technicalMaterialArray = formData.value.technicalMaterials?.split(",");
    } finally {
      formLoading.value = false
    }
  }
}

const closeDialog = ()=>{
  dialogVisible.value = false;
  subTabsName.value = 'project';
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const submit = async()=>{
  await approvalCreateFormRef.value.validate();
  // await orderBasicRef.value.validate();
  // const orderdata =   await orderBasicRef.value.getData()
  // await approvalCreateFormRef.value.setOrderData(orderdata);
  await approvalCreateFormRef.value.submitForm()
  dialogVisible.value = false;
  emit('success')

}
// const submitForm = async () => {
//   // 校验表单
//   await formRef.value.validate()
//   // 提交请求
//   formLoading.value = true
//   try {
//     formData.value.technicalMaterials = formData.value.technicalMaterialArray?.join(",");
//
//     const data = formData.value as unknown as ApprovalVO
//     // 拼接子表的数据
//     // data.orderLists = orderListFormRef.value.getData()
//     if (formType.value === 'create') {
//       await ApprovalApi.createApproval(data)
//       message.success(t('common.createSuccess'))
//     } else {
//       await ApprovalApi.updateApproval(data)
//       message.success(t('common.updateSuccess'))
//     }
//     dialogVisible.value = false
//     // 发送操作成功的事件
//     emit('success')
//   } finally {
//     formLoading.value = false
//   }
// }


</script>
