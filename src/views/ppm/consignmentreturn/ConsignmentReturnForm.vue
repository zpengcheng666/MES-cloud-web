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
                    <el-form-item label="退货单编号" prop="no">
                        <!--<el-input v-model="formData.no" placeholder="请输入退货单编号"-->
                                  <!--:disabled="formData.shippingStatus > 0"/>-->


                        <el-row :gutter="20">
                            <el-col :span="16">
                                <el-input v-model="formData.no" placeholder="" :disabled="true"/>
                            </el-col>
                            <el-col :span="8">
                                <el-button @click="generatorCode" type="primary"  :disabled="formData.shippingStatus > 0">生 码</el-button>
                            </el-col>
                        </el-row>




                    </el-form-item>
                </el-col>

                <!--<el-col :span="8">-->
                    <!--<el-form-item label="退货单名称" prop="name">-->
                        <!--<el-input v-model="formData.name" placeholder="请输入退货单名称"-->
                                  <!--:disabled="formData.shippingStatus > 0"/>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->

                <el-col :span="8">
                    <el-form-item label="合同号" prop="contractId">
                        <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>
                        <!--<el-select-->
                                <!--v-model="formData.contractId"-->
                                <!--clearable-->
                                <!--filterable-->
                                <!--placeholder="请选择合同"-->
                                <!--class="!w-1/1"-->
                                <!--:disabled="formData.shippingStatus > 0"-->
                                <!--@change="getContractId(formData.contractId)"-->
                        <!--&gt;-->
                            <!--<el-option-->
                                    <!--v-for="item in contractList"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.name + '('+item.number +')'"-->
                                    <!--:value="item.id"-->
                            <!--/>-->
                        <!--</el-select>-->

                    </el-form-item>
                </el-col>

            <!--</el-row>-->


            <!--<el-row :gutter="20">-->
                <el-col :span="8">
                    <el-form-item label="处理方式" prop="returnType">
                        <el-select v-model="formData.returnType" placeholder="请选择处理方式"
                                   @change="changeAdd(formData.returnType)" :disabled="formData.shippingStatus > 0">
                            <el-option
                                    v-for="dict in getIntDictOptions(DICT_TYPE.CONSIGNMENT_RETURN_TYPE)"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="退货人" prop="consigner">

                        <el-select
                                v-model="formData.consigner"
                                clearable
                                filterable
                                placeholder="请选择退货人员"
                                class="!w-1/1"
                                :disabled="formData.shippingStatus > 0"
                        >
                            <el-option
                                    v-for="item in userList"
                                    :key="item.id"
                                    :label="item.nickname +'('+item.deptName+')'"
                                    :value="item.id+''"
                            />
                        </el-select>


                        <!--<el-input v-model="formData.consignedBy" placeholder="请输入接收人"/>-->
                    </el-form-item>
                </el-col>


                <el-col :span="8">
                    <el-form-item label="退货日期" prop="consignerDate">
                        <el-date-picker
                                v-model="formData.consignerDate"
                                type="date"
                                value-format="x"
                                placeholder="选择退货日期"
                                :disabled="formData.shippingStatus > 0"
                        />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="退换货原因" prop="returnReason">
                <el-input type="textarea" v-model="formData.returnReason" placeholder="请输入退换货原因"
                          :disabled="formData.shippingStatus > 0"/>
            </el-form-item>

            <el-row :gutter="20">

                <el-col :span="8">
                    <el-form-item label="接收人" prop="consignedBy">
                        <el-input v-model="formData.consignedBy" placeholder="请输入接收人"
                                  :disabled="formData.shippingStatus > 0"/>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="收货人电话" prop="consignedContact">
                        <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式"
                                  :disabled="formData.shippingStatus > 0"/>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="接收日期" prop="consignedDate">
                        <el-date-picker
                                v-model="formData.consignedDate"
                                type="date"
                                value-format="x"
                                placeholder="选择退货日期"
                                :disabled="formData.shippingStatus > 0"
                        />
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row v-if="formData.shippingStatus ===2">
            <el-col :span="8" >
                <el-form-item label="出库仓库" prop="warehouseName">
                    <el-input v-model="formData.warehouseName" :disabled="formData.shippingStatus ==2 "/>
                </el-form-item>
            </el-col>
            </el-row>
        </el-form>

        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName" v-show="returnType !=4">
            <el-tab-pane label="采购退货单详情" name="consignmentReturnDetail">
                <ConsignmentReturnDetailForm ref="consignmentReturnDetailFormRef" :consignment-return-id="formData.id"
                                             :contractId="contractId" :detailInfo="detailInfo"
                                             :consignment-status="formData.shippingStatus"/>
            </el-tab-pane>
        </el-tabs>
        <!-- 合同选择 -->
        <PPMContractChoose ref="contractRef" @getContract="getContract"/>


        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">{{formData.shippingStatus ==2?'出库':'保存'}}</el-button>
            <el-button @click="submitFormAndAudit" type="primary" :disabled="formLoading"
                       v-if="formData.shippingStatus == null">保存并提交审核
            </el-button>
            <el-button @click="cancel">取 消</el-button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {ConsignmentReturnApi, ConsignmentReturnVO} from '@/api/ppm/consignmentreturn'
    import * as UserApi from "@/api/system/user";
    import {ContractApi} from "@/api/ppm/contract";
    import ConsignmentReturnDetailForm from "@/views/ppm/consignmentreturn/components/ConsignmentReturnDetailForm.vue";
    import {PurchaseConsignmentApi, PurchaseConsignmentVO} from '@/api/ppm/purchaseconsignment'
    import {WarehouseApi, WarehouseVO} from '@/api/wms/warehouse'
    import PPMContractChoose from "../purchaseconsignment/components/PPMContractChoose.vue"

    import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
    /** 采购退货单 表单 */
    defineOptions({name: 'ConsignmentReturnForm'})
    const formDisabled = ref(0)
    const {t} = useI18n() // 国际化
    const message = useMessage() // 消息弹窗

    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
    const formType = ref('') // 表单的类型：create - 新增；update - 修改
    const formData = ref({
        id: undefined,
        consignmentDetailId: undefined,
        no: undefined,
        name: undefined,
        contractId: undefined,
        consigner: undefined,
        consignerDate: undefined,
        consignedBy: undefined,
        consignedDate: undefined,
        consignedContact: undefined,
        returnType: undefined,
        returnReason: undefined,
        processInstanceId: undefined,
        status: undefined,
        shippingStatus: undefined,
        fileUrl: undefined,
        remark: undefined,
    })
    const formRules = reactive({
        no: [{required: true, message: '退货单编号不能为空', trigger: 'blur'}],
        // name: [{required: true, message: '退货单名称不能为空', trigger: 'blur'}],
        contractId: [{required: true, message: '合同ID不能为空', trigger: 'blur'}],
        returnType: [{required: true, message: '处理方式 1返修2换货3退货退款4仅退款不能为空', trigger: 'change'}],
        returnReason: [{required: true, message: '退换货原因不能为空', trigger: 'blur'}],
        status: [{required: true, message: '审批状态不能为空', trigger: 'blur'}],
    })
    const formRef = ref() // 表单 Ref
    const constractId  = ref() // 表单 Ref

    const shippingStatus = ref(0)
    const contractId = ref('0');//合同
    const detailInfo = ref([]) as any
    const userList = ref < UserApi.UserVO[] > ([]) // 用户列表

    const contractList = ref < ContractApi.ContractVO[] > ([]) //合同列表

    const returnType = ref(1)

    const changeAdd = async (type) => {
        returnType.value = type
    }

    /** 子表的表单 */
    const subTabsName = ref('consignmentReturnDetail')
    const consignmentReturnDetailFormRef = ref()

    /** 打开弹窗 */
    const open = async (type: string, id
    ? : number , consignmentReturnStatus ? : number
    ) =>
    {
        dialogVisible.value = true
        dialogTitle.value = t('action.' + type)
        formType.value = type
        resetForm()
        formData.value.id = id

        // 修改时，设置数据
        if (id) {
            formLoading.value = true
            try {
                formData.value = await
                ConsignmentReturnApi.getConsignmentReturn(id)
                formData.value.shippingStatus = consignmentReturnStatus
                contractId.value = formData._value.contractId;
                returnType.value = formData._value.returnType;
                debugger
                detailInfo.value = await
                PurchaseConsignmentApi.getConsignmentDetailByContractId(formData._value.contractId);


                const warehouse = await
                WarehouseApi.getWarehouse("1796370351509213185");//默认出库仓库

                formData.value.warehouseId = warehouse.id;
                formData.value.warehouseName = warehouse.warehouseName;
            } finally {
                formLoading.value = false
            }
        }

        // 加载用户列表
        userList.value = await
        UserApi.getSimpleUserList()

        // 加载合同列表
        contractList.value = await
        ContractApi.getContractListByType(1)
    }
    defineExpose({open}) // 提供 open 方法，用于打开弹窗


    //合同点击事件
    const getContractId = async (id: string) => {
        if (id) {

            const contract = contractList.value.find((item) => item.id === id)
            formData.value.companyId = contract.party
            contractId.value = id;

            detailInfo.value = await PurchaseConsignmentApi.getConsignmentDetailByContractId(id);
        } else {
            contractId.value = '0';
        }


    }



    /** 添加/修改操作 */
    const contractRef = ref() // 合同 Ref
    const openForm = () => {
        contractRef.value.open()
    }



    const generatorCode=async ()=>{
        formLoading.value = true
        const data = {
            classificationCode:'PM_MRB',
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




    /***
     * 获取产品物码
     * */
    const getContract = async (contract) => {
        // 选中合同
        formData.value.contractId = contract.id
        formData.value.contractName = contract.number + '(' + contract.name + ')'
        formData.value.contractType = contract.contractType
        contractId.value = contract.id;
        detailInfo.value = await
            PurchaseConsignmentApi.getConsignmentDetailByContractId(contract.id);
    }



    /** 提交表单 */
    const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
    const submitForm = async () => {
        // 校验表单
        debugger
        await formRef.value.validate()
        // 校验子表单
        try {
            await consignmentReturnDetailFormRef.value.validate()
        } catch (e) {
            subTabsName.value = 'consignmentReturnDetail'
            return
        }
        // 提交请求
        formLoading.value = true
        try {

            const data = formData.value as unknown as ConsignmentReturnVO
            // 拼接子表的数据
            data.shippingDetails = consignmentReturnDetailFormRef.value.getData()
            if (formType.value === 'create') {
                await ConsignmentReturnApi.createConsignmentReturn(data)
                const update={code:data.no,status:2}
                await EncodingRuleApi.updateCode(update)
                message.success(t('common.createSuccess'))
            } else {
                await ConsignmentReturnApi.updateConsignmentReturn(data)
                message.success(t('common.updateSuccess'))
            }
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success')
        } finally {
            formLoading.value = false
        }
    }

    //保存并提交审核
    const submitFormAndAudit = async () => {
        // 校验表单
        await formRef.value.validate()
        // 校验子表单
        try {
            await consignmentReturnDetailFormRef.value.validate()
        } catch (e) {
            subTabsName.value = 'consignmentReturnDetail'
            return
        }
        // 提交请求
        formLoading.value = true
        try {
            const data = formData.value as unknown as ConsignmentReturnVO
            // 拼接子表的数据
            data.shippingDetails = consignmentReturnDetailFormRef.value.getData()
            if (formType.value === 'create') {
                await ConsignmentReturnApi.createConsignmentReturnAndAudit(data)
                const update={code:data.no,status:2}
                await EncodingRuleApi.updateCode(update)
                message.success(t('common.createSuccess'))
            } else {
                await ConsignmentReturnApi.updateConsignmentReturnAndAudit(data)
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
            consignmentDetailId: undefined,
            no: undefined,
            name: undefined,
            contractId: undefined,
            consigner: undefined,
            consignerDate: undefined,
            consignedBy: undefined,
            consignedDate: undefined,
            consignedContact: undefined,
            returnType: undefined,
            returnReason: undefined,
            processInstanceId: undefined,
            status: undefined,
            shippingStatus: undefined,
            fileUrl: undefined,
            remark: undefined,
        }
        formRef.value?.resetFields()
    }
</script>
