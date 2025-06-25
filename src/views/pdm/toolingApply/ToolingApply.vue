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
                    <el-col :span="12">
                      <el-form-item label="工装分类：" class="!w-230px" prop="categoryId">
                        <el-tree-select
                          v-model="formData.categoryId"
                          :data="CategoryNameTree"
                          :props="defaultProps"
                          check-strictly
                          default-expand-all
                          placeholder="请选择分类"
                        />
                      </el-form-item>
                      <el-form-item label="工装图号：" prop="toolingNumber">
                        <el-input   class="!w-130px" clearable v-model="formData.toolingNumber"/>
                      </el-form-item>
                      <el-form-item label="申请人：" prop="applyName">
                        <el-input  class="!w-130px" disabled v-model="formData.applyName"/>
                      </el-form-item>
                      <el-form-item label="工装形式：" class="!w-240px" prop="toolingStyle">
                        <el-select  class="!w-130px" v-model="formData.toolingStyle">
                          <el-option v-for="sty in getIntDictOptions(DICT_TYPE.PDM_TOOLING_STYLE)"
                                     :key="sty.value" :label="sty.label" :value="sty.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="申请理由：" class="!w-240px" prop="applyReason">
                        <el-select  class="!w-130px" v-model="formData.applyReason">
                          <el-option v-for="re in getIntDictOptions(DICT_TYPE.PDM_TOOLING_APPLY_REASON)"
                                     :key="re.value" :label="re.label" :value="re.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="设备名称：" prop="equipmentName">
                        <el-input   class="!w-130px" v-model="formData.equipmentName"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工装编号：" prop="toolingCode">
                        <el-input class="!w-130px" v-model="formData.toolingCode" :disabled="true"/>
                      </el-form-item>
                      <el-form-item label="工装名称：" prop="toolingName">
                        <el-input   class="!w-130px" v-model="formData.toolingName"/>
                      </el-form-item>
                      <el-form-item label="申请数量：" prop="quantity">
                        <el-input-number  class="!w-130px" :min="1"  v-model="formData.quantity"/>
                      </el-form-item>
                      <el-form-item label="加工类型：" class="!w-240px" prop="processType">
                        <el-select  class="!w-130px" v-model="formData.processType">
                          <el-option v-for="pro in getIntDictOptions(DICT_TYPE.PDM_TOOLING_APPLY_PROCESS_TYPE)"
                                     :key="pro.value" :label="pro.label" :value="pro.value" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="需求日期：" prop="requireTime">
                        <el-date-picker v-model="formData.requireTime" type="date" value-format="x" class="!w-130px"
                                        :disabled-date="disabledDate" />
                      </el-form-item>
                      <el-form-item label="设备型号：" prop="equipmentNumber">
                        <el-input   class="!w-130px" v-model="formData.equipmentNumber"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="技术条件：" prop="technicalRequirement">
                    <el-input  class="!w-504px" type="textarea" v-model="formData.technicalRequirement"/>
                  </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ToolingApplyApi, ToolingApplyVO } from '@/api/pdm/toolingApply'
import {useUserStore} from "@/store/modules/user";
import {ref, computed} from "vue";
import {defaultProps, handleTree} from "@/utils/tree";
import {ToolingCategoryApi} from "@/api/pdm/toolingCategory";
import {EncodingRuleApi} from "@/api/mcc/encodingrule";
import {MaterialConfigVO} from "@/api/mcc/materialconfig";

const CategoryNameTree = ref() // 树形结构
const userStore = useUserStore();
const userId = userStore.getUser.id; // 当前登录用户id
const userName = userStore.getUser.nickname;
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const nameList = ref([]) // 分类列表
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const formData = ref({
  id: '',
  categoryId: '',
  toolingCode: '',
  toolingNumber: '',
  toolingName: '',
  toolingVersion: '',
  applyName: '',
  quantity: '',
  toolingStyle: '',
  processType: '',
  applyReason: '',
  requireTime: '',
  equipmentName: '',
  equipmentNumber: '',
  technicalRequirement: '',
  customizedIndex: '',
  status: '',
  processInstanceId: '',
  approvalStatus: '',
  applyId: '',
  parentId:''
})

const formRules = reactive({
  categoryId: [{ required: true, message: '工装分类不能为空', trigger: 'blur' }],
  toolingCode: [{ required: true, message: '工装编号不能为空', trigger: 'blur' }],
  toolingNumber: [{ required: true, message: '工装图号不能为空', trigger: 'blur' }],
  toolingName: [{ required: true, message: '工装名称不能为空', trigger: 'blur' }],
  applyName: [{ required: true, message: '申请人不能为空', trigger: 'blur' }],
  quantity: [{ required: true, message: '申请数量不能为空', trigger: 'blur' }],
  toolingStyle: [{ required: true, message: '工装形式不能为空', trigger: 'blur' }],
  processType: [{ required: true, message: '加工类型不能为空', trigger: 'blur' }],
  applyReason: [{ required: true, message: '申请理由不能为空', trigger: 'blur' }],
  requireTime: [{ required: true, message: '需求日期不能为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
const List = ref([]); // 工装分类名列表

/** 打开弹窗 */
const open = async (type: string, id?: number, toolingCode?: string, toolingNumber?: string, toolingName?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm();
  nameList.value = await ToolingApplyApi.getToolingApplyList();
  List.value = nameList.value.map(item => item.name);

  if (formType.value === 'create') {
    Object.assign(formData.value, currentUser.value);
    //新增时自动生成工装编号
    await generatorCode()
  }

  if (id) {
    formLoading.value = true
    try {
      const data = await ToolingApplyApi.getToolingApply(id);
      Object.assign(formData.value, data);
    } finally {
      formLoading.value = false
    }
  }
  await getCategoryNameTree()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const currentUser = computed(() => {
  return {
    applyName: userStore.getUser.nickname,
    applyId: userStore.getUser.id,
  };
});

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ToolingApplyVO

    if (formType.value === 'create') {
      await ToolingApplyApi.createToolingApply(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolingApplyApi.updateToolingApply(data)
      message.success(t('common.updateSuccess'))
    }
    //提交后，更新mcc码已使用
    const update={code:formData.value.toolingCode,status:2}
    EncodingRuleApi.updateCode(update)
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
    id: '',
    categoryId: '',
    toolingCode: '',
    toolingNumber: '',
    toolingName: '',
    toolingVersion: '',
    applyName: '',
    quantity: '',
    toolingStyle: '',
    processType: '',
    applyReason: '',
    requireTime: '',
    equipmentName: '',
    equipmentNumber: '',
    technicalRequirement: '',
    customizedIndex: '',
    status: '',
    processInstanceId: '',
    approvalStatus: '',
    applyId: ''
  }
  formRef.value?.resetFields()
}

//产品分类树
const getCategoryNameTree = async () => {
  CategoryNameTree.value = []
  const data = await ToolingCategoryApi.getProductCategoryList()
  console.log(data)
  const root: Tree = { id: 0, name: '工装分类', children: [] }
  root.children = handleTree(data, 'id', 'parentId')
  CategoryNameTree.value.push(root)
}

/** 工装编号请求mcc码 */
const generatorCode=async ()=>{
  formLoading.value = true
  const data = {
    classificationCode:'MT',
    materialMainTypeCode:'GZ',
    encodingRuleType:1,
    attributes:{materialTypeCode:'GZ'}
  }
  try {
    const result = await EncodingRuleApi.createCode(data)
    formData.value.toolingCode = result
    debugger
  } finally {
    formLoading.value = false
  }
}
/** 取消时释放mcc码 */
const cancel = async () => {
  if (formType.value === 'create') {
    if (formData.value.toolingCode) {
      const update = {code: formData.value.toolingCode, status: 3}
      try {
        EncodingRuleApi.updateCode(update)
      } finally {
        formLoading.value = false
      }
    }
  }
  dialogVisible.value = false
}
</script>
