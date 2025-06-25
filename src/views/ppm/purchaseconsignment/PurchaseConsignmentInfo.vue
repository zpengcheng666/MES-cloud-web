<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="detailRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="收货单" prop="no">
            <el-input v-model="formData.no" placeholder="请输入收货单" disabled/>
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
              disabled
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

        <el-col :span="8">
          <el-form-item  label="收货人" prop="consignedBy">
            <el-select
              v-model="formData.consignedBy"
              clearable
              filterable
              placeholder="请选择发货人员"
              class="!w-1/1"
              disabled
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname +'('+item.deptName+')'"
                :value="item.id+''"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>


      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="收货日期" prop="consignedDate">
            <el-date-picker
              v-model="formData.consignedDate"
              type="date"
              value-format="x"
              placeholder="选择收货日期"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="收货人电话" prop="consignedContact">
            <el-input v-model="formData.consignedContact" placeholder="请输入收货人电话" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="发货人" prop="consigner">
            <el-input v-model="formData.consigner" placeholder="请输入发货人" disabled/>
          </el-form-item>
        </el-col>

      </el-row>



      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收货单名" prop="consignmentName">
            <el-input v-model="formData.consignmentName" placeholder="请输入收货单名称" disabled/>
          </el-form-item>
        </el-col>

<!--        <el-col :span="8">-->
<!--          <el-form-item label="发货人电话" prop="consignerContact">-->
<!--            <el-input v-model="formData.consignerContact" placeholder="请输入发货人电话" disabled/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->

        <el-col :span="8">
          <el-form-item label="发货日期" prop="consignerDate">
            <el-date-picker
              v-model="formData.consignerDate"
              type="date"
              value-format="x"
              placeholder="选择发货日期"
              disabled
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="承运方式" prop="deliveryMethod">
            <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式" disabled>
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TRANSPORT_WAY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>


      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="承运单号" prop="deliveryNumber">
            <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="承运人" prop="deliveryBy">
            <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" disabled/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="承运人电话" prop="deliveryContact">
            <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" disabled/>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="采购明细" name="purchaseConsignmentDetail">
        <PurchaseConsignmentDetailList  :consignment-id="formData.id"  />
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>

<script setup lang="ts">
  import { PurchaseConsignmentApi, PurchaseConsignmentVO } from '@/api/ppm/purchaseconsignment'
  import {ContractApi} from "@/api/ppm/contract";
  import * as UserApi from '@/api/system/user'
  import PurchaseConsignmentDetailList from './components/PurchaseConsignmentDetailList.vue'
  /** 合同 */
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

  /** 采购收货 表单 */
  defineOptions({name: 'PurchaseConsignmentInfo'})
  const formDisabled = ref(0)

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    consignmentName:undefined,
    contractId: undefined,
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
  const detailRef = ref() // 表单 Ref

  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

  const constractList = ref < ContractApi.ContractVO[] > ([]) //合同列表

  const constractId = ref('0');

  const orderInfo = ref([]) as any


  /** 子表的表单 */
  const subTabsName = ref('PurchaseConsignmentDetail')

  /** 打开弹窗 */
  const open = async (type: string,
                      id?: number,
                      // confirmStatus ? : number
  ) => {
    resetForm();
    formData.value.id=id;
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    subTabsName.value = 'purchaseConsignmentDetail'
    // 修改时，设置数据
    if (id) {
      formLoading.value = true

      try {
        formData.value = await PurchaseConsignmentApi.getPurchaseConsignment(id)
      } finally {
        formLoading.value = false
      }
    }


    // if (id) {
    //   formLoading.value = true
    //   try {
    //     formData.value = await
    //       PurchaseConsignmentApi.getPurchaseConsignment(id)
    //     constractId.value =formData._value.contractId;
    //     orderInfo.value =await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(formData._value.contractId);
    //   } finally {
    //     formLoading.value = false
    //   }
    // }
    // if (confirmStatus) {
    //   formDisabled.value = confirmStatus;
    // } else {
    //   formDisabled.value = 0;
    // }


    // 加载用户列表
    userList.value = await
    UserApi.getSimpleUserList()
// 加载合同列表
    constractList.value = await
    ContractApi.getContractListByType(1)
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


  // const getConstractId = async (id: string) => {
  //   console.log(id);
  //   constractId.value = id;
  //   orderInfo.value =await PurchaseConsignmentApi.getPurchaseConsignmentDetailListByConsignmentId(id);
  //
  // }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      contractId: undefined,
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
    }
    detailRef.value?.resetFields()
  }
</script>
