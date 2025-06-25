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
          <el-form-item label="方案" prop="inspectionSchemeName">
            <el-input v-model="formData.inspectionSchemeName" placeholder="请输入方案" readonly disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检测项目" prop="inspectionItemName">
            <el-input v-model="formData.inspectionItemName" placeholder="请选择检测项" disabled readonly/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检测顺序" prop="number">
            <el-input-number v-model="formData.number" placeholder="请输入检测顺序" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="检验方案检测项目详情" name="inspectionSchemeItemDetail">
        <InspectionSchemeItemDetailFormInfo ref="inspectionSchemeItemDetailFormRef"  :inspection-scheme-item-id="formData.id"  :configList="configList"/>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>


  </Dialog>
</template>
<script setup lang="ts">
  import {InspectionSchemeItemApi, InspectionSchemeItemVO} from '@/api/qms/inspectionschemeitem'
  import {InspectionItemApi, InspectionItemVO} from '@/api/qms/inspectionitem'
  import InspectionSchemeItemDetailFormInfo from './components/InspectionSchemeItemDetailFormInfo.vue'
  import {InspectionItemConfigApi, InspectionItemConfigVO} from '@/api/qms/inspectionitemconfig'
  /** 检验方案检测项目详情 表单 */
  defineOptions({name: 'InspectionSchemeItemFormDetail'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const formData = ref({
    id: undefined,
    inspectionSchemeId: undefined,
    inspectionSchemeName: undefined,
    inspectionItemId: undefined,
    number: undefined,
    inspectionItemName: undefined
  })
  const formRules = reactive({
    inspectionSchemeId: [{required: true, message: '方案不能为空', trigger: 'blur'}],
    inspectionSchemeName: [{required: true, message: '方案不能为空', trigger: 'blur'}],
    inspectionItemId: [{required: true, message: '检测项目不能为空', trigger: 'blur'}],
    inspectionItemName: [{required: true, message: '检测项目不能为空', trigger: 'change'}],
    number: [{required: true, message: '检测顺序不能为空', trigger: 'change'}],
  })
  const formRef = ref() // 表单 Ref

  /** 子表的表单 */
  const subTabsName = ref('inspectionSchemeItemDetail')
  const inspectionSchemeItemDetailFormRef = ref()
  const configList = ref <[] > ([]) // 检测项配置信息
  /** 打开弹窗 */
  const open = async (type: string, id
  ? : number, inspectionSchemeId
  :
  string, inspectionSchemeName
  :
  string
  ) =>
  {
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    resetForm()
    formData.value.inspectionSchemeId = inspectionSchemeId
    formData.value.inspectionSchemeName = inspectionSchemeName

    configList.value=await InspectionItemConfigApi.getInspectionItemConfigList()
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await
        InspectionSchemeItemApi.getInspectionSchemeItem(id)
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
      const data = formData.value as unknown as InspectionSchemeItemVO

       data.inspectionSchemeItemDetails = inspectionSchemeItemDetailFormRef.value.getData()
      if (formType.value === 'create') {
        await InspectionSchemeItemApi.createInspectionSchemeItemWithDetail(data)
        message.success(t('common.createSuccess'))
      } else {
        await InspectionSchemeItemApi.updateInspectionSchemeItemWithDetail(data)
        message.success(t('common.updateSuccess'))
      }
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
    } finally {
      formLoading.value = false
    }
  }


  /** 打开弹窗 */
  const inspectionItemChooseRef = ref()
  const openForm = (type, row, confirmStatus) => {
    inspectionItemChooseRef.value.open(type)
  }

  /***
   * 获取产品物码
   * */
  const getInspectionItem = async (inspectionItem) => {
    formData.value.inspectionItemId = inspectionItem.id
    formData.value.inspectionItemName = inspectionItem.itemName
  }

  /** 重置表单 */
  const resetForm = () => {
    formData.value = {
      id: undefined,
      inspectionSchemeId: undefined,
      inspectionItemId: undefined,
      number: undefined,
    }
    formRef.value?.resetFields()
  }
</script>
