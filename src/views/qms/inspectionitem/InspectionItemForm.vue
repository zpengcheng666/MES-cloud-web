<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="110px"
      v-loading="formLoading"
    >

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检测项目名称" prop="itemName">
            <el-input v-model="formData.itemName" placeholder="请输入检测项目名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测项目编号" prop="itemNo">
            <el-input v-model="formData.itemNo" placeholder="请输入检测项目编号"/>
          </el-form-item>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检测方式" prop="inspectionType">
            <el-select v-model="formData.inspectionType" placeholder="请选择检测方式">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.QMS_INSPECTION_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测工具 " prop="inspectionTool">
            <el-select
              v-model="formData.inspectionToolId"
              clearable
              filterable
              placeholder="请选择检测工具"
              class="!w-1/1"
            >
              <el-option
                v-for="item in toolList"
                :key="item.id"
                :label="item.materialConfigName"
                :value="item.id"
              />
            </el-select>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检测项目分类" prop="itemTypeId">

            <el-tree-select
              v-model="formData.itemTypeId"
              :data="itemTypeList"
              :props="defaultProps"
              check-strictly
              node-key="id"
              placeholder="请选择检测项目分类"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="检测项目描述" prop="desc">
            <el-input v-model="formData.desc" placeholder="请输入检测项目描述"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--&lt;!&ndash; 子表的表单 &ndash;&gt;-->
    <!--<el-tabs v-model="subTabsName">-->
      <!--<el-tab-pane label="检测项目详情" name="inspectionItemDetail">-->
        <!--<InspectionItemDetailFormInfo ref="inspectionItemDetailFormRef" :inspection-item-id="formData.id"  :configList="configList"/>-->
      <!--</el-tab-pane>-->
    <!--</el-tabs>-->
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
  import {InspectionItemApi, InspectionItemVO} from '@/api/qms/inspectionitem'
  import {defaultProps, handleTree} from '@/utils/tree'
  import {InspectionItemTypeApi, InspectionItemTypeVO} from '@/api/qms/inspectionitemtype'
  import {InspectionItemConfigApi, InspectionItemConfigVO} from '@/api/qms/inspectionitemconfig'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
  // import InspectionItemDetailFormInfo from './components/InspectionItemDetailFormInfo.vue'
  import { InspectionToolApi, InspectionToolVO } from '@/api/qms/inspectiontool'
  /** 检测项目 表单 */
  defineOptions({name: 'InspectionItemForm'})

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const dialogVisible = ref(false) // 弹窗的是否展示
  const dialogTitle = ref('') // 弹窗的标题
  const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
  const formType = ref('') // 表单的类型：create - 新增；update - 修改
  const itemTypeList = ref < Tree[] > ([]) // 树形结构
  const formData = ref({
    id: undefined,
    itemName: undefined,
    itemNo: undefined,
    desc: undefined,
    inspectionType: undefined,
    inspectionToolId: undefined,
    itemTypeId: undefined,
  })
  const formRules = reactive({
    itemName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
    itemNo: [{required: true, message: '编号不能为空', trigger: 'blur'}],
    inspectionType: [{required: true, message: '检测方式不能为空', trigger: 'blur'}],
    inspectionToolId: [{required: true, message: '检测工具不能为空', trigger: 'blur'}],
    itemTypeId: [{required: true, message: '项目分类不能为空', trigger: 'blur'}],
  })

  const toolList = ref <InspectionToolVO[] > ([]) //工具列表
  const formRef = ref() // 表单 Ref
  /** 子表的表单 */
  const subTabsName = ref('inspectionItemDetail')
  const inspectionItemDetailFormRef = ref()
  /** 打开弹窗 */
  const open = async (type: string, id
    ? : number, itemTypeId ? : string
  ) =>
  {
    dialogVisible.value = true
    dialogTitle.value = t('action.' + type)
    formType.value = type
    resetForm()

    if (itemTypeId) {
      formData.value.itemTypeId = itemTypeId
    }

    getTree();
    toolList.value= await  InspectionToolApi.getInspectionToolList()
    // 修改时，设置数据
    if (id) {
      formLoading.value = true
      try {
        formData.value = await
        InspectionItemApi.getInspectionItem(id)
      } finally {
        formLoading.value = false
      }
    }
  }
  defineExpose({open}) // 提供 open 方法，用于打开弹窗


  /** 获得部门树 */
  const getTree = async () => {
    const res = await InspectionItemTypeApi.getInspectionItemTypeList()

    itemTypeList.value = []
    itemTypeList.value.push(...handleTree(res))
  }


  /** 提交表单 */
  const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
  const submitForm = async () => {
    // 校验表单
    await formRef.value.validate()

    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as InspectionItemVO
      // 拼接子表的数据
      // data.inspectionItemDetails = inspectionItemDetailFormRef.value.getData()
      if (formType.value === 'create') {
        await InspectionItemApi.createInspectionItem(data)
        message.success(t('common.createSuccess'))
      } else {
        await InspectionItemApi.updateInspectionItem(data)
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
      itemName: undefined,
      itemNo: undefined,
      desc: undefined,
      inspectionType: undefined,
      inspectionToolId: undefined,
      itemTypeId: undefined,
    }
    formRef.value?.resetFields()
  }
</script>
