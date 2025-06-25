<template>
    <Dialog :title="dialogTitle" v-model="dialogVisible">
        <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="120px"
                v-loading="formLoading"
        >

            <el-row :gutter="20">

                <el-col :span="8">
                    <el-form-item label="发货单编号" prop="no">
                        <!--<el-input v-model="formData.no" placeholder="请输入发货单编号" :disabled="formDisabled != 0"/>-->

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
                    <!--<el-form-item label="发货单名称" prop="name">-->
                        <!--<el-input v-model="formData.name" placeholder="请输入发货单名称" :disabled="formDisabled != 0"/>-->
                    <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :span="8">
                    <el-form-item label="合同编号" prop="contractName">
                        <el-input v-model="formData.contractName" placeholder="请选择合同" @click="openForm()" readonly/>
                    </el-form-item>
                </el-col>
            <!--</el-row>-->
            <!--&lt;!&ndash;<el-form-item label="公司" prop="companyId">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-input v-model="formData.companyId" placeholder="请输入公司ID" />&ndash;&gt;-->
            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
            <!--<el-row :gutter="20">-->

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
                    <el-form-item label="发货日期" prop="consignerDate">
                        <el-date-picker
                                v-model="formData.consignerDate"
                                type="date"
                                value-format="x"
                                placeholder="选择发货日期"
                                :disabled="formDisabled != 0"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="formDisabled  ==0|| formDisabled  ==4">
                    <el-form-item label="承运方式" prop="deliveryMethod">
                        <el-select v-model="formData.deliveryMethod" placeholder="请选择承运方式" >
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
            <el-row :gutter="20" v-if="formDisabled  ==0|| formDisabled  ==4">
                <el-col :span="8" >
                    <el-form-item label="承运人" prop="deliveryBy">
                        <el-input v-model="formData.deliveryBy" placeholder="请输入承运人"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运单号" prop="deliveryNumber">
                        <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承运人电话" prop="deliveryContact">
                        <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="formDisabled  ==0|| formDisabled  ==4">
                <el-col :span="8">
                    <el-form-item label="收货人" prop="consignedBy">
                        <el-input v-model="formData.consignedBy" placeholder="请输入收货人"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收货日期" prop="consignedDate">
                        <el-date-picker
                                v-model="formData.consignedDate"
                                type="date"
                                value-format="x"
                                placeholder="选择收货日期"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="收货人联系方式" prop="consignedContact">
                        <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式"/>
                    </el-form-item>

                </el-col>
            </el-row>
        </el-form>
        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
            <el-tab-pane label="外协发货单详情" name="contractConsignmentDetail">
                <ContractConsignmentDetailForm ref="contractConsignmentDetailFormRef" :consignment-id="formData.id"  :orderInfo="orderInfo" :confirmStatus="formDisabled"/>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">{{formDisabled===2 ?'出库':'保存'}}</el-button>
            <el-button @click="submitFormAndBpm" type="primary" :disabled="formLoading " v-if="formDisabled  !=2 &&formDisabled !=4 ">保存并提交审核</el-button>
            <el-button @click="cancel">取 消</el-button>
        </template>

        <!-- 合同选择 -->
        <PPMContractChooseForOut ref="contractRef" @getContract="getContract"/>

    </Dialog>
</template>
<script setup lang="ts">
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {ContractConsignmentApi, ContractConsignmentVO} from '@/api/ppm/contractconsignment'
    import ContractConsignmentDetailForm from './components/ContractConsignmentDetailForm.vue'
    import PPMContractChooseForOut from "./components/PPMContractChooseForOut.vue"
    import {ContractApi, ContractStatusVO, ContractVO} from '@/api/ppm/contract'
    import * as UserApi from '@/api/system/user'
    import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'

    /** 外协发货 表单 */
    defineOptions({name: 'ContractConsignmentForm'})

    const {t} = useI18n() // 国际化
    const message = useMessage() // 消息弹窗
    const formDisabled = ref(0)
    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
    const formType = ref('') // 表单的类型：create - 新增；update - 修改
    const formData = ref({
        id: undefined,
        no: undefined,
        name: undefined,
        contractId: undefined,
        companyId: undefined,
        consigner: undefined,
        consignerDate: undefined,
        deliveryMethod: undefined,
        deliveryBy: undefined,
        deliveryNumber: undefined,
        deliveryContact: undefined,
        consignedBy: undefined,
        consignedDate: undefined,
        consignedContact: undefined,
        status: undefined,
        processInstanceId: undefined,
        fileUrl: undefined,
        consignmentStatus: undefined,
    })
    const formRules = reactive({
        no: [{required: true, message: '发货单编号不能为空', trigger: 'blur'}],
        // name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        contractName: [{required: true, message: '合同不能为空', trigger: 'blur'}],
        consigner: [{required: true, message: '发货人不能为空', trigger: 'blur'}],
        consignerDate: [{required: true, message: '发货日期不能为空', trigger: 'blur'}],
        status: [{required: true, message: '审批状态不能为空', trigger: 'change'}],
    })
    const formRef = ref() // 表单 Ref
    const orderInfo = ref([]) as any
    /** 子表的表单 */
    const subTabsName = ref('contractConsignmentDetail')
    const contractConsignmentDetailFormRef = ref()
    const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
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
        // 加载用户列表
        userList.value = await
        UserApi.getSimpleUserList()

        // 修改时，设置数据
        if (id) {
            formLoading.value = true
            try {
               const data = await
                ContractConsignmentApi.getContractConsignment(id)
                formData.value = data
                debugger
                orderInfo.value =await ContractApi.getProjectOrderListByContractId(data.contractId);

            } finally {
                formLoading.value = false
            }
        }


        if (confirmStatus) {
            formDisabled.value = confirmStatus;
        } else {
            formDisabled.value = 0;
        }

    }
    defineExpose({open}) // 提供 open 方法，用于打开弹窗

    /** 提交表单 */
    const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
    const submitForm = async () => {
        // 校验表单
        await formRef.value.validate()
        // 校验子表单
        try {
            await contractConsignmentDetailFormRef.value.validate()
        } catch (e) {
            subTabsName.value = 'contractConsignmentDetail'
            return
        }
        // 提交请求
        formLoading.value = true
        try {
            const data = formData.value as unknown as ContractConsignmentVO
            // 拼接子表的数据
            data.shippingDetails = contractConsignmentDetailFormRef.value.getData()
            if (formType.value === 'create') {
                await ContractConsignmentApi.createContractConsignment(data)
                const update={code:data.no,status:2}
                await EncodingRuleApi.updateCode(update)
                message.success(t('common.createSuccess'))
            } else {
                await ContractConsignmentApi.updateContractConsignment(data)
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
            await contractConsignmentDetailFormRef.value.validate()
        } catch (e) {
            subTabsName.value = 'contractConsignmentDetail'
            return
        }
        // 提交请求
        formLoading.value = true
        try {
            const data = formData.value as unknown as ContractConsignmentVO
            // 拼接子表的数据
            data.shippingDetails = contractConsignmentDetailFormRef.value.getData()
            if (formType.value === 'create') {
                await ContractConsignmentApi.createContractConsignmentAndSubmit(data)

                const update={code:data.no,status:2}
                await EncodingRuleApi.updateCode(update)
                message.success(t('common.createSuccess'))
            } else {
                await ContractConsignmentApi.updateContractConsignmentAndSubmit(data)
                message.success(t('common.updateSuccess'))
            }
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success')
        } finally {
            formLoading.value = false
        }
    }


    const generatorCode=async ()=>{
        formLoading.value = true
        const data = {
            classificationCode:'OEM_GI',
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
    const contractRef = ref() // 合同 Ref
    const openForm = () => {
        contractRef.value.open()
    }

    /***
     * 获取产品物码
     * */
    const getContract = async (contract) => {
        // 选中合同
        formData.value.contractId = contract.id
        formData.value.contractName = contract.number + '(' + contract.name + ')'
        formData.value.contractType = contract.contractType
        formData.value.companyId = contract.party
        
        orderInfo.value =await ContractApi.getProjectOrderListByContractId(contract.id);
    }


    /** 重置表单 */
    const resetForm = () => {
        formData.value = {
            id: undefined,
            no: undefined,
            name: undefined,
            contractId: undefined,
            companyId: undefined,
            consigner: undefined,
            consignerDate: undefined,
            deliveryMethod: undefined,
            deliveryBy: undefined,
            deliveryNumber: undefined,
            deliveryContact: undefined,
            consignedBy: undefined,
            consignedDate: undefined,
            consignedContact: undefined,
            status: undefined,
            processInstanceId: undefined,
            fileUrl: undefined,
            consignmentStatus: undefined,
        }
        formRef.value?.resetFields()
    }
</script>