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
                <el-col :span="12">
                    <el-form-item label="物料编号" prop="materialNumber">
                        <el-row :gutter="20">
                            <el-col :span="16">
                        <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" :disabled="true"/>
                            </el-col>
                            <el-col :span="8">
                                <el-button @click="generatorCode" type="primary" :disabled="formLoading">生 码</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料名称" prop="materialName">
                        <el-input v-model="formData.materialName" placeholder="请输入物料名称"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="主类别" prop="materialParentTypeId">


                        <el-select
                                v-model="formData.materialParentTypeId"
                                clearable
                                filterable
                                placeholder="请选择类别"
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

                        <!--<el-input v-model="formData.materialParentTypeId" placeholder="请输入主类别（工件、托盘、工装、夹具、刀具）"/>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="当前类别" prop="materialTypeId">


                        <el-tree-select
                                v-model="formData.materialTypeId"
                                :data="materialTypeTree"
                                :props="defaultProps"
                                check-strictly
                                default-expand-all
                                placeholder="请选择类别"
                                @change="getRow"
                        />
                        <!--<el-input v-model="formData.materialTypeId" placeholder="请输入当前类别"/>-->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="物料规格" prop="materialSpecification">
                        <el-input v-model="formData.materialSpecification" placeholder="请输入物料规格"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料品牌" prop="materialBrand">
                        <el-input v-model="formData.materialBrand" placeholder="请输入物料品牌"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="物料单位" prop="materialUnit">
                        <el-select v-model="formData.materialUnit" placeholder="请选择物料单位">
                            <el-option
                                    v-for="unit in unitList"
                                    :key="unit.id"
                                    :label="unit.unit"
                                    :value="unit.unit"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="来源物料类型" prop="materialSourceName">
                        <el-input v-model="formData.materialSourceName" placeholder="请选择来源物料类型" @click="openChooseForm"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
            <el-form-item label="物料管理模式" prop="materialManage">
                <el-select v-model="formData.materialManage" placeholder="请输入物料管理模式">
                    <el-option
                            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE)"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                    />
                </el-select>
            </el-form-item>
                </el-col>
            </el-row>
            <!--<el-form-item label="类码" prop="materialTypeCode">-->
            <!--<el-input v-model="formData.materialTypeCode" placeholder="请输入类码" />-->
            <!--</el-form-item>-->
        </el-form>

        <MaterialConfigChoose ref="materialConfigChooseRef" @getSource="getSource" />
        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
    import {MaterialConfigApi, MaterialConfigVO} from '@/api/mcc/materialconfig'
    import {MaterialTypeApi, MaterialTypeVO} from '@/api/mcc/materialtype'
    import {defaultProps, handleTree} from '@/utils/tree'
    import { UnitApi, UnitVO } from '@/api/mcc/unit'
    import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
    import MaterialConfigChoose from './components/MaterialConfigChoose.vue'
    import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'


    /** 物料类型 表单 */
    defineOptions({name: 'MCCMaterialConfigForm'})

    const {t} = useI18n() // 国际化
    const message = useMessage() // 消息弹窗
    const unitList = ref<any[]>([]) // 物料单位列表
    const dialogVisible = ref(false) // 弹窗的是否展示
    const dialogTitle = ref('') // 弹窗的标题
    const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
    const formType = ref('') // 表单的类型：create - 新增；update - 修改
    const formData = ref({
        id: undefined,
        materialNumber: undefined,
        materialName: undefined,
        materialTypeId: undefined,
        materialParentTypeId: undefined,
        materialSpecification: undefined,
        materialBrand: undefined,
        materialUnit: undefined,
        materialSourceId: undefined,
        materialTypeCode: undefined,
    })
    const formRules = reactive({
        materialNumber: [{required: true, message: '编码不能为空', trigger: 'blur'}],
        materialName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
        materialParentTypeId: [{required: true, message: '主类别不能为空', trigger: 'change'}],
        materialTypeId: [{required: true, message: '当前类别不能为空', trigger: 'blur'}],
        classificationId: [{required: true, message: '编码分类ID不能为空', trigger: 'blur'}],
        materialUnit: [{required: true, message: '单位不能为空', trigger: 'blur'}],
        materialManage: [{required: true, message: '管理模式不能为空', trigger: 'blur'}],
    })
    const materialTypeValue = ref([]) // 表单 Ref
    const materialTypeDataValue = ref([]) // 表单 Ref
    const materialTypeTree = ref([]) // 表单 Ref
    const formRef = ref() // 表单 Ref


    /** 打开弹窗 */
    const open = async (type: string, id
        ? : number
    ) =>
    {
        dialogVisible.value = true
        dialogTitle.value = t('action.' + type)
        formType.value = type
        resetForm()

        getMaterialType()
        unitList.value = await UnitApi.getUnitList();

        // 修改时，设置数据
        if (id) {
            formLoading.value = true
            try {
                const  data = await
                MaterialConfigApi.getMaterialConfig(id)
                formData.value = data
                if (data.materialParentTypeId){
                    getChooseMaterialType(data.materialParentTypeId)
                }
                if (data.materialTypeId){
                    getRow(data.materialTypeId)
                }

            } finally {
                formLoading.value = false
            }
        }


    }
    defineExpose({open}) // 提供 open 方法，用于打开弹窗

    /** 提交表单 */
    const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
    const submitForm = async () => {
        // 校验表单
        await formRef.value.validate()
        // 提交请求
        formLoading.value = true
        try {
            const data = formData.value as unknown as MaterialConfigVO
            if (formType.value === 'create') {
                await MaterialConfigApi.createMaterialConfig(data)
                message.success(t('common.createSuccess'))
                const update={code:data.materialNumber,status:2}
                await EncodingRuleApi.updateCode(update)
            } else {
                await MaterialConfigApi.updateMaterialConfig(data)
                message.success(t('common.updateSuccess'))
            }


            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success')
        } finally {
            formLoading.value = false
        }
    }


    const cancel = async () => {

        if (formData.value.materialNumber && formData.value.id==undefined) {
            const data = formData.value as unknown as MaterialConfigVO
            const update = {code: data.materialNumber, status: 3}
            try {
                let result = EncodingRuleApi.updateCode(update)
            } finally {
                formLoading.value = false
            }
        }

        dialogVisible.value = false

    }


    const getMaterialType = async () => {
        materialTypeValue.value = [];
        materialTypeDataValue.value = [];
        const data = await MaterialTypeApi.getMaterialTypeList()
        materialTypeDataValue.value = data
        data.forEach((item, index) => {
            if (item.parentId == '0') {
                materialTypeValue.value.push(item)
            }
        })

    }


    const materialConfigChooseRef= ref();

    const openChooseForm = () => {
        materialConfigChooseRef.value.open()
    }


    const generatorCode=async ()=>{

        if (!formData.value.materialParentTypeId) {
            message.error("请先选择主类别");
            return;
        }

        if (!formData.value.materialTypeId) {
            message.error("请先选择当前类别");
            return;
        }
        formLoading.value = true
        const data = {
            classificationCode:'MT',
            materialMainTypeCode:formData.value.materialParentTypeCode,
            encodingRuleType:1,
            oldBarCode:formData.value.materialNumberSource,
            attributes:{materialTypeCode:formData.value.materialTypeCode}
        }

        try {
            const result = await EncodingRuleApi.createCode(data)
            formData.value.materialNumber = result
            debugger
        } finally {

            formLoading.value = false
        }


    }


    const getRow = async (id) => {

        const row = materialTypeDataValue.value.find((item) => item.id == id)
        formData.value.materialTypeCode = row.code

    }


    const getChooseMaterialType = (id) => {

        materialTypeTree.value=[]
        const row = materialTypeDataValue.value.find((item) => item.id == id)
        formData.value.materialTypeId = row.id
        const root: Tree = { id: '0', name: '总类别', children: [] }
        root.children = handleTree(materialTypeDataValue.value, 'id', 'parentId')

        const s = root.children.find((item) => item.id == id)
        materialTypeTree.value.push(s)

        formData.value.materialParentTypeCode = row.code
    }



    const getSource = async (rule) => {

        formData.value.materialSourceId = rule.id
        formData.value.materialNumberSource = rule.materialNumber
        formData.value.materialSourceName = rule.materialName +"("+rule.materialNumber+")"

    }





    /** 重置表单 */
    const resetForm = () => {
        formData.value = {
            id: undefined,
            materialNumber: undefined,
            materialName: undefined,
            materialTypeId: undefined,
            materialParentTypeId: undefined,
            materialSpecification: undefined,
            materialBrand: undefined,
            materialUnit: undefined,
            materialSourceId: undefined,
            materialTypeCode: undefined,
        }
        formRef.value?.resetFields()
    }
</script>