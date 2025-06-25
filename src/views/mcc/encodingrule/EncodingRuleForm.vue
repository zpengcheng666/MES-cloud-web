<template>
    <Dialog :title="dialogTitle" v-model="dialogVisible"  width="1200">
        <el-form
                ref="formRef"
                :model="formData"
                :rules="formRules"
                label-width="100px"
                v-loading="formLoading"
        >

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入名称"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="编码分类" prop="classificationId">

                        <el-select
                                v-model="formData.classificationId"
                                clearable
                                filterable
                                placeholder="请选择分类"
                                class="!w-1/1"
                                @change="getClassificationCode"
                        >
                            <el-option
                                    v-for="item in classificationList"
                                    :key="item.id"
                                    :label="item.name +'('+item.code+')'"
                                    :value="item.id+''"
                            />
                        </el-select>



                        <!--<el-input v-model="formData.classificationId" placeholder="请输入编码分类"/>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="启用状态" prop="status">
                        <el-select v-model="formData.status" placeholder="请选择启用状态">
                            <el-option
                                    v-for="dict in getIntDictOptions(DICT_TYPE.MCC_ENABLE_STATUS)"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="总位数" prop="totalBitNumber">
                        <el-input v-model="formData.totalBitNumber" placeholder="0" :disabled="true"/>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="类型" prop="encodingRuleType">
                        <el-select v-model="formData.encodingRuleType" placeholder="请选择类型">
                            <el-option
                                    v-for="dict in getIntDictOptions(DICT_TYPE.MCC_ENCODING_RULE_TYPE)"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料类别" prop="materialTypeId">

                        <el-select
                                v-model="formData.materialTypeId"
                                clearable
                                filterable
                                placeholder="请选择类别(物料类型编码用)"
                                class="!w-1/1"
                                @change="getChooseMaterialType"
                        >
                            <el-option
                                    v-for="item in materialTypeValue"
                                    :key="item.id"
                                    :label="item.name +'('+item.code+')'"
                                    :value="item.id+''"
                            />
                        </el-select>
                        <!--<el-input v-model="formData.classificationId" placeholder="请输入编码分类"/>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否自动释放" prop="autoRelease">
                        <el-select v-model="formData.autoRelease" placeholder="请选择是否自动释放流水号">
                            <el-option
                                    v-for="dict in getIntDictOptions(DICT_TYPE.MCC_AUTO_RELEASE)"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>

                </el-col>
            </el-row>

        </el-form>
        <!-- 子表的表单 -->
        <el-tabs v-model="subTabsName">
            <el-tab-pane label="编码规则配置详情" name="encodingRuleDetail">
                <EncodingRuleDetailForm ref="encodingRuleDetailFormRef" :encoding-rule-id="formData.id"  @getBitNumber="getBitNumber" :classCode="classCode"
                                        :materialTypeId="materialTypeId" :materialTypeValue="materialTypeValue" :encodingRuleList="encodingRuleList" :encodingAttributesList="encodingAttributesList"/>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
    import EncodingRuleDetailForm from './components/EncodingRuleDetailForm.vue'
    import { EncodingClassificationApi, EncodingClassificationVO } from '@/api/mcc/encodingclassification'
    import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
    import { EncodingAttributeApi, EncodingAttributeVO } from '@/api/mcc/encodingattribute'
    /** 编码规则配置 表单 */
    defineOptions({name: 'EncodingRuleForm'})

    const {t} = useI18n() // 国际化
    const message = useMessage() // 消息弹窗

    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
    const formType = ref('') // 表单的类型：create - 新增；update - 修改
    const formData = ref({
        id: undefined,
        name: undefined,
        classificationId: undefined,
        status: undefined,
        totalBitNumber: undefined,
    })
    const formRules = reactive({
        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        classificationId: [{required: true, message: '编码分类不能为空', trigger: 'blur'}],
        status: [{required: true, message: '启用状态  1启用 0未启用不能为空', trigger: 'change'}],
        totalBitNumber: [{required: true, message: '总位数不能为空', trigger: 'blur'}],
        encodingRuleType: [{required: true, message: '类型不能为空', trigger: 'blur'}],
    })
    const formRef = ref() // 表单 Ref

    const classCode = ref();
    const materialTypeId = ref();
    const classificationList = ref([])//分类集合
    const  materialTypeValue = ref()//所属类别表
    const  encodingRuleList = ref()//规则
    const  encodingAttributesList = ref()//自定义属性
    /** 子表的表单 */
    const subTabsName = ref('encodingRuleDetail')
    const encodingRuleDetailFormRef = ref()

    /** 打开弹窗 */
    const open = async (type: string, id
        ? : number
    ) =>
    {
        dialogVisible.value = true
        dialogTitle.value = t('action.' + type)
        formType.value = type
        classificationList.value=[]
        resetForm()
        // 修改时，设置数据
        if (id) {
            formLoading.value = true
            try {
                formData.value = await
                EncodingRuleApi.getEncodingRule(id)
            } finally {
                formLoading.value = false
            }
        }

        getClassification()//获取分类列表
        getMaterialTypeTree()//获取物料类型
        getEncodingRuleList()//获取规则
        getEncodingAttributesList()//获取自定义属性
    }
    defineExpose({open}) // 提供 open 方法，用于打开弹窗

    /** 提交表单 */
    const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
    const submitForm = async () => {
        // 校验表单
        await formRef.value.validate()
        // 校验子表单
        try {
            await encodingRuleDetailFormRef.value.validate()
        } catch (e) {
            subTabsName.value = 'encodingRuleDetail'
            return
        }
        // 提交请求
        formLoading.value = true
        try {
            const data = formData.value as unknown as EncodingRuleVO
            // 拼接子表的数据
            data.encodingRuleDetails = encodingRuleDetailFormRef.value.getData()
            if (formType.value === 'create') {
                await EncodingRuleApi.createEncodingRule(data)
                message.success(t('common.createSuccess'))
            } else {
                await EncodingRuleApi.updateEncodingRule(data)
                message.success(t('common.updateSuccess'))
            }
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success')
        } finally {
            formLoading.value = false
        }
    }

    //获取分类
    const getClassification =async ()=>{
        classificationList.value = await  EncodingClassificationApi.getEncodingClassificationList()
    }


    //获取总位数
    const  getBitNumber =(number)=>{
        formData.value.totalBitNumber=number
    }

    //获取编码分类
    const getClassificationCode =(id)=>{

        const row=  classificationList.value.find((item) => item.id == id)

        classCode.value = row.code

    }


    const getChooseMaterialType=(id)=>{
        materialTypeId.value = id
    }

    /** 获得编码类别属性表(树形结构)树 */
    const getMaterialTypeTree = async () => {
        materialTypeValue.value = [];
        const data = await MaterialTypeApi.getMaterialTypeList()
        data.forEach((item, index) => {
            if (item.parentId == '0'){
                materialTypeValue.value.push(item)
            }
        })
    }

    //获取规则
    const getEncodingRuleList = async ()=>{
        encodingRuleList.value =await EncodingRuleApi.getEncodingRuleList({});

    }
    //获取自定义属性
    const getEncodingAttributesList = async ()=>{
        encodingAttributesList.value =await EncodingAttributeApi.getEncodingAttributeList({});

    }

    /** 重置表单 */
    const resetForm = () => {
        formData.value = {
            id: undefined,
            name: undefined,
            classificationId: undefined,
            status: undefined,
            totalBitNumber: undefined,
        }
        formRef.value?.resetFields()
    }
</script>