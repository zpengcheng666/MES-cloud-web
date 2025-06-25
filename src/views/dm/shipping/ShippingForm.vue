<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible"  width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="发货单" prop="no">
            <!--<el-input v-model="formData.no" placeholder="请输入发货单" :disabled="formDisabled != 0"/>-->


            <el-row :gutter="20">
              <el-col :span="16">
                <el-input v-model="formData.no" placeholder="" :disabled="true"/>
              </el-col>
              <el-col :span="8">
                <el-button @click="generatorCode" type="primary" :disabled="formDisabled != 0">生 码</el-button>
              </el-col>
            </el-row>

          </el-form-item>

        </el-col>

        <!--<el-col :span="8">-->
          <!--<el-form-item label="发货单名" prop="name">-->
            <!--<el-input v-model="formData.name" placeholder="请输入发货单名称" :disabled="formDisabled != 0"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="8">
          <el-form-item label="项目" prop="projectId">

            <el-input v-model="formData.projectName" placeholder="请选择项目" @click="openForm()" />
            <!--<el-select v-model="formData.projectId" placeholder="请选择项目"-->
                       <!--@change="onChangeProject($event)"-->
            <!--&gt;-->
              <!--<el-option-->
                      <!--v-for="dict in projectInfos"-->
                      <!--:key="dict.projectId"-->
                      <!--:label="dict.projectName"-->
                      <!--:value="dict.projectId"-->

              <!--/>-->
            <!--</el-select>-->
          </el-form-item>
        </el-col>

      <!--</el-row>-->


      <!--<el-row :gutter="20">-->


        <el-col :span="8">

          <el-form-item label="合同号" prop="contractId">
            <el-select
                    v-model="formData.contractId"
                    clearable
                    filterable
                    placeholder="请选择合同"
                    class="!w-1/1"
                    @change="getContractId(formData.contractId)"
                    :disabled="formDisabled != 0"
            >
              <el-option
                      v-for="item in contractList"
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
              :disabled="formDisabled !=0"
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
              :disabled="formDisabled !=0"
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
        <el-col :span="8">

          <el-form-item label="收货人" prop="consignedBy">
            <el-input v-model="formData.consignedBy" placeholder="请输入收货人" :disabled="formDisabled != 0"/>
          </el-form-item>

        </el-col>

        <el-col :span="8">
          <el-form-item label="收货人电话" prop="consignedContact">
            <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" :disabled="formDisabled  != 0"/>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row :gutter="20">

        <el-col :span="8" v-if="formDisabled  ==0|| formDisabled  ==4">
          <el-form-item label="承运人" prop="deliveryBy">
            <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" :disabled="formDisabled !=4"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formDisabled  ==0|| formDisabled  ==4">
          <el-form-item label="承运单号" prop="deliveryNumber">
            <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" :disabled="formDisabled  !=4"/>
          </el-form-item>
        </el-col>

        <el-col :span="8" >
          <el-form-item label="承运人电话" prop="deliveryContact">
            <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" :disabled="formDisabled !=4 "/>
          </el-form-item>

        </el-col>

      </el-row>
      <el-row :gutter="20" v-if="formDisabled  ==0|| formDisabled  ==4">

        <el-col :span="8">

          <el-form-item label="承运方式" prop="deliveryMethod">
            <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式" :disabled="formDisabled !=4">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TRANSPORT_WAY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="收货日期" prop="consignedDate">
            <el-date-picker
              v-model="formData.consignedDate"
              type="date"
              value-format="x"
              placeholder="选择收货日期"
              :disabled="formDisabled !=4"
            />
          </el-form-item>

        </el-col>



      </el-row>

      <el-row :gutter="20">
        <el-col :span="8"  v-if="formDisabled  ==0">
          <el-form-item label="附件" prop="fileUrl" v-if="formDisabled  ==0">
            <UploadFile :is-show-tip="false" v-model="formData.fileUrl" :limit="1" :bucket="bucket"/>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formDisabled ===2">
          <el-form-item label="出库仓库" prop="warehouseName">
            <el-input v-model="formData.warehouseName"  :disabled="formDisabled !=4 "/>
          </el-form-item>
        </el-col>

      </el-row>


    </el-form>


    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="销售发货明细" name="shippingDetail">
        <ShippingDetailForm ref="shippingDetailFormRef" :shipping-id="formData.id" :confirmStatus="formDisabled"
                            :contract-id="contractId" :orderInfo="orderInfo"/>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">{{formDisabled===2 ?'出库':'保存'}}</el-button>
      <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading " v-if="formDisabled  !=2 &&formDisabled !=4 ">保存并提交审核</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>

    <!-- 表单弹窗：添加/修改 -->
    <DMProjectChoose ref="projectRef" @getProject="getProject"/>


  </Dialog>
</template>
<script setup lang="ts">
  import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import {WarehouseApi, WarehouseVO} from '@/api/wms/warehouse'
  import ShippingDetailForm from './components/ShippingDetailForm.vue'
  import * as UserApi from '@/api/system/user'
  import {ContractApi} from '@/api/ppm/contract'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  import DMProjectChoose from '../contract/components/contractquery/DMProjectChoose.vue'
  import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
  /** 销售发货 表单 */
  defineOptions({name: 'ShippingForm'})
  const formDisabled = ref(0)
  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const bucket = ref('test') // 上传空间
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改

  const projectInfos = ref([]) // 项目集合
  const projectOrder = ref() //  选中项目

  const formData = ref({
    id: undefined,
    contractId: undefined,
    companyId: undefined,
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
    shippingStatus: undefined
  })
  const formRules = reactive({
    projectId: [{required: true, message: '项目不能为空', trigger: 'blur'}],
    no: [{required: true, message: '发货单不能为空', trigger: 'blur'}],
    consigner: [{required: true, message: '发货人不能为空', trigger: 'blur'}],
    consignerDate: [{required: true, message: '发货日期不能为空', trigger: 'blur'}],
    // name: [{required: true, message: '发货单名不能为空', trigger: 'blur'}],
  })
  const formRef = ref() // 表单 Ref


  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

  const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
  const materialList = ref  ([]) //物料列表

  const contractId = ref();







  const list = ref([]) // 列表的数据
  const orderInfo = ref([]) as any

  /** 子表的表单 */
  const subTabsName = ref('shippingDetail')
  const shippingDetailFormRef = ref()

  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number, confirmStatus ? : number
  ) =>
  {
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    orderInfo.value=[];
    resetForm()
      // projectInfos.value=[];
      // projectInfos.value = await DMContractApi.getProductOrderList(2);
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await
        ShippingApi.getShipping(id)
        contractId.value =formData._value.contractId;

          orderInfo.value =await DMContractApi.getMaterialStockByProjectId(formData._value.projectId)
          contractList.value = await
          DMContractApi.getContractInfoByProjectId(formData._value.projectId)
          const warehouse = await WarehouseApi.getWarehouse("1796370351509213185");//默认出库仓库

          formData.value.warehouseId = warehouse.id;
          formData.value.warehouseName = warehouse.warehouseName;

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

  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗





  const generatorCode=async ()=>{
      formLoading.value = true
      const data = {
          classificationCode:'SMS_GI',
          encodingRuleType:1,
      }
      try {
          const result = await EncodingRuleApi.createCode(data)
          formData.value.no = result
          debugger
      } finally {
          formLoading.value = false
      }
  }

  const cancel = async () => {
      if (formData.value.no && formData.value.id==undefined) {
          const data = formData.value
          const update = {code: data.no, status: 3}
          try {
              let result = await EncodingRuleApi.updateCode(update)
          } finally {
              formLoading.value = false
          }
      }
      dialogVisible.value = false

  }




  /** 添加/修改操作 */
  const projectRef = ref() // 合同 Ref
  const openForm = () => {
      projectRef.value.open()
  }





  const getProject = async (project) => {
      // 选中项目
      formData.value.projectId = project.id
      formData.value.projectName = project.projectCode + '(' + project.projectName + ')'
     // projectId.value =  project.id
      // productList.value = DMContractApi.getProductOrderList(2,project.id)

      contractList.value = await
          DMContractApi.getContractInfoByProjectId(project.id)
      formData.value.companyId = project.projectClient;

     orderInfo.value =await DMContractApi.getMaterialStockByProjectId(project.id)


  }





  const getContractId = async (id: string) => {

    if (id){

        contractId.value = id;

    } else {
      contractId.value = undefined;
    }


  }


  const onChangeProject = async (orderId) => {
      const order = projectInfos.value.find((item) => item.projectId === orderId)
      projectOrder.value = order;
      formData.value.products=[]

      contractList.value = await
      DMContractApi.getContractInfoByProjectId(order.projectId)
      formData.value.companyId = order.companyId;

      orderInfo.value =await DMContractApi.getProjectOrderByProjectId(order.projectId)
  }




  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()



    // 校验子表单
    try {
      await shippingDetailFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'shippingDetail'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ShippingVO
        
        if (contractList.value.length > 0 && data.contractId == undefined){
            message.error('请选择合同')
            return;
        }
      // 拼接子表的数据
      data.shippingDetails = shippingDetailFormRef.value.getData()

        const order =  data.shippingDetails.find((item) => item.projectId != data.projectId)
        if (order){
            await message.confirm(`所选物料存在非选择的项目中的物料，是否提交？`)
        }

        
        if (data.shippingStatus ==2){
            await ShippingApi.outBoundShipping(data)
            message.success('发送出库申请成功')
        }  else if (formType.value === 'create') {
        await ShippingApi.createShipping(data)

            const update={code:data.no,status:2}
            await EncodingRuleApi.updateCode(update)
        message.success(t('common.createSuccess'))
      } else {
        await ShippingApi.updateShipping(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }


  const submitFormAndBpm = async () => {
    // 校验表单
    await formRef.value.validate()
    // 校验子表单
    try {
      await shippingDetailFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'shippingDetail'
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as ShippingVO
      // 拼接子表的数据
      data.shippingDetails = shippingDetailFormRef.value.getData()
        
      if (formType.value === 'create') {
        await ShippingApi.createShippingAndSubmit(data)

          const update={code:data.no,status:2}
          await EncodingRuleApi.updateCode(update)
        message.success(t('common.createSuccess'))
      } else {
        await ShippingApi.updateShippingAndSubmit(data)
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
      no: undefined,
      shippingStatus: undefined
    }
    formRef.value?.resetFields()
    formDisabled.value = 0;
  }
</script>
