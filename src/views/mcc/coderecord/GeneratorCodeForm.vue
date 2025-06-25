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
          <el-form-item label="编码规则" prop="name">
            <el-input v-model="formData.name" placeholder="请选择编码规则" @click="openRuleChooseForm"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="分类" prop="classificationName">
            <el-input v-model="formData.classificationName" placeholder="" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="类别" prop="materialTypeName">
            <el-input v-model="formData.materialTypeName" placeholder="" :disabled="true"/>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="编码规则配置详情" name="encodingRuleDetail">
        <RuleDetailForm ref="encodingRuleDetailFormRef" :encoding-rule-id="formData.ruleId"/>
      </el-tab-pane>
    </el-tabs>


    <el-tabs v-model="subTabsName1">
      <el-tab-pane label="类别对照表" name="typeTree">
        <el-table
                v-loading="loading"
                :data="standardList"
                :stripe="true"
                :show-overflow-tooltip="true"
                row-key="id"
                :default-expand-all="isExpandAll"
                v-if="refreshTable"
        >
          <!--<el-table-column label="ID" align="center" prop="id" />-->
          <el-table-column label="名称" align="center" prop="name" />
          <el-table-column label="编码" align="center" prop="code" />

          <!--<el-table-column label="父类型id" align="center" prop="parentId" />-->
          <el-table-column label="位数" align="center" prop="bitNumber" />
          <el-table-column label="限制层级" align="center" prop="levelLimit" />

          <el-table-column label="分类" align="center" prop="service">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.MCC_ENCODING_PROPERTY" :value="scope.row.encodingProperty" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>

    <!-- 表单弹窗：添加/修改 -->
    <RuleChoose ref="ruleChooseRef" @getRule="getRule"/>

  </Dialog>
</template>
<script setup lang="ts">
    import {getIntDictOptions, DICT_TYPE} from '@/utils/dict'
    import {EncodingRuleApi, EncodingRuleVO} from '@/api/mcc/encodingrule'
    import RuleDetailForm from './components/RuleDetailForm.vue'
    import RuleChoose from './components/RuleChoose.vue'
    import { EncodingClassificationApi, EncodingClassificationVO } from '@/api/mcc/encodingclassification'
    import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
    import { defaultProps, handleTree } from '@/utils/tree'
    import { ElTree } from 'element-plus'
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
        // name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
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
    /** 子表的表单 */
    const subTabsName = ref('encodingRuleDetail')
    const subTabsName1 = ref('typeTree')
    const encodingRuleDetailFormRef = ref()
    const queryParams = reactive({
        createTime: [],
        code: undefined,
        name: undefined,
        parentId: undefined,
        bitNumber: undefined,
        encodingProperty: undefined,
    })
    const standardList = ref<Tree[]>([]) // 树形结构
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


        const data = await MaterialTypeApi.getMaterialTypeList(queryParams)
        standardList.value = handleTree(data, 'id', 'parentId')

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
            data.attributes = encodingRuleDetailFormRef.value.getData()[0]

           const result = await EncodingRuleApi.createCode(data)
            debugger
            dialogVisible.value = false
            // 发送操作成功的事件
            emit('success',result)
        } finally {
            formLoading.value = false
        }
    }

    /***
     * 获取规则
     * */
    const getRule = async (rule) => {
        debugger

        formData.value.ruleId = rule.id
        formData.value.name = rule.name
        formData.value.classificationCode = rule.classificationCode
        formData.value.classificationName = rule.classificationName +"("+rule.classificationCode+")"
        formData.value.materialTypeName = rule.materialTypeName +"("+rule.materialTypeCode+")"
        formData.value.materialMainTypeCode = rule.materialTypeCode
        formData.value.encodingRuleType = rule.encodingRuleType
    }


   const  ruleChooseRef = ref()
    /** 添加/修改操作 */
    const openRuleChooseForm = () => {
        ruleChooseRef.value.open()
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


    const isExpandAll = ref(false) // 是否展开，默认全部展开
    const refreshTable = ref(true) // 重新渲染表格状态
    const toggleExpandAll = async () => {
        refreshTable.value = false
        isExpandAll.value = !isExpandAll.value
        await nextTick()
        refreshTable.value = true
    }
</script>