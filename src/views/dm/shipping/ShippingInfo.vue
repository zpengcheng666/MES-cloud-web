<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible"  width="1000">
    <el-form
      ref="detailRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="发货单" prop="no">
            <el-input v-model="formData.no" placeholder="请输入发货单" disabled/>
          </el-form-item>

        </el-col>



        <el-col :span="8">
          <el-form-item label="发货单名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入发货单名称"  disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目" prop="projectId">
            <el-input v-model="formData.projectName" placeholder="请选择项目"  disabled />
          </el-form-item>
        </el-col>



      </el-row>


      <el-row :gutter="20">


        <el-col :span="8">
          <el-form-item label="合同号" prop="contractId">

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
          <el-form-item label="发货人" prop="consigner">
            <el-select
              v-model="formData.consigner"
              clearable
              filterable
              placeholder="请选择发货人员"
              class="!w-1/1"
              disabled
            >
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id +''"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">

          <el-form-item label="收货人" prop="consignedBy">
            <el-input v-model="formData.consignedBy" placeholder="请输入收货人" disabled/>
          </el-form-item>

        </el-col>

      </el-row>

      <el-row :gutter="20">

        <el-col :span="8">
          <el-form-item label="承运人" prop="deliveryBy">
            <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运单号" prop="deliveryNumber">
            <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="承运人电话" prop="deliveryContact">
            <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" disabled/>
          </el-form-item>

        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="收货人电话" prop="consignedContact">
            <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" disabled/>
          </el-form-item>
        </el-col>
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
          <el-form-item label="承运方式" prop="deliveryMethod">
            <el-input v-model="formData.deliveryMethod" placeholder="请输入承运方式" disabled/>
          </el-form-item>

        </el-col>

      </el-row>

    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="销售发货明细" name="shippingDetail">
        <ShippingDetailList  :shipping-id="formData.id"/>
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>
<script setup lang="ts">
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import ShippingDetailList from './components/ShippingDetailList.vue'
  import * as UserApi from '@/api/system/user'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  /** 合同 */
  import {ContractApi} from '@/api/ppm/contract'

  /** 销售发货 表单 */
  defineOptions({name: 'ShippingInfo'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    contractId: undefined,
    consigner: undefined,
    fileUrl: '',
    consignerDate: undefined,
    deliveryMethod: undefined,
    deliveryBy: undefined,
    deliveryNumber: undefined,
    deliveryContact: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    no: undefined,
  })
  const detailRef = ref() // 表单 Ref

  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

  const constractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
  const projectInfos = ref([]) // 项目集合

  /** 子表的表单 */
  const subTabsName = ref('shippingDetail')
  const shippingDetailFormRef = ref()

  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number
  ) =>
  {
    resetForm();
    formData.value.id=id;
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
      projectInfos.value=[];
      projectInfos.value = await DMContractApi.getProductOrderList(2);
    // 修改时，设置数据
    if (id) {
      formLoading.value = true

      try {
        formData.value = await ShippingApi.getShipping(id)
          contractList.value = await
          DMContractApi.getContractInfoByProjectId(formData._value.projectId)
      } finally {
        formLoading.value = false
      }
    }


    // 加载用户列表
    userList.value = await
    UserApi.getSimpleUserList()
// 加载合同列表
//     constractList.value = await
//     ContractApi.getContractListByType(2)
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗



  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      contractId: undefined,
      consigner: undefined,
      fileUrl: undefined,
      consignerDate: undefined,
      deliveryMethod: undefined,
      deliveryBy: undefined,
      deliveryNumber: undefined,
      deliveryContact: undefined,
      consignedBy: undefined,
      consignedDate: undefined,
      consignedContact: undefined,
      processInstanceId: undefined,
      no: undefined
    }
    detailRef.value?.resetFields()
  }
</script>
