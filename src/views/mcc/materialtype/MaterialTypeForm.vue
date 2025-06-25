<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="父类型id" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="materialTypeTree"
          :props="defaultProps"
          check-strictly
          default-expand-all
          placeholder="请选择父类型id"
          @change="getRow"
        />
      </el-form-item>


      <el-form-item label="分类" prop="encodingProperty">
        <el-select v-model="formData.encodingProperty" placeholder="分类">
          <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.MCC_ENCODING_PROPERTY)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="位数" prop="bitNumber">-->
        <!--<el-input-number v-model="formData.bitNumber" placeholder="请输入位数"  :disabled="formData.id !=undefined "/>-->
      <!--</el-form-item>-->

      <!--<el-form-item label="层级限制" prop="levelLimit" v-if="formData.parentId=='0'">-->
        <!--<el-input-number v-model="formData.levelLimit" placeholder="请输入层级限制" :disabled="formData.id !=undefined "/>-->
      <!--</el-form-item>-->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
import { defaultProps, handleTree } from '@/utils/tree'
import {getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
/** 编码类别属性表(树形结构) 表单 */
defineOptions({ name: 'MaterialTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  parentId: undefined,
  bitNumber: undefined,
})
const formRules = reactive({
  parentId: [{ required: true, message: '父类型id不能为空', trigger: 'blur' }],
  // bitNumber: [{ required: true, message: '位数不能为空', trigger: 'blur' }],
  //   levelLimit: [{ required: true, message: '限制层数不能为空', trigger: 'blur' }],
    encodingProperty: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const materialTypeTree = ref() // 树形结构

const  materialTypeValue = ref()
const  formDisabled = ref(false)

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
    formDisabled.value =false;
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MaterialTypeApi.getMaterialType(id)
    } finally {
      formLoading.value = false
    }
  }
  await getMaterialTypeTree()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MaterialTypeVO
    if (formType.value === 'create') {
      await MaterialTypeApi.createMaterialType(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaterialTypeApi.updateMaterialType(data)
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
    code: undefined,
    name: undefined,
    parentId: undefined,
    bitNumber: undefined,
      levelLimit:0
  }
  formRef.value?.resetFields()
}

const  getRow = async (id)=>{
    if (id=='0'){
        //formData.value.bitNumber = undefined;
        formDisabled.value = false;
    }else{
        const row=  materialTypeValue.value.find((item) => item.id == id)
        if (row.bitNumber) {
            formData.value.bitNumber = row.bitNumber
            formData.value.levelLimit = row.levelLimit
            formData.value.encodingProperty = row.encodingProperty
            formDisabled.value = true;
        }
    }


}

/** 获得编码类别属性表(树形结构)树 */
const getMaterialTypeTree = async () => {
  materialTypeTree.value = []
  const data = await MaterialTypeApi.getMaterialTypeList()
  const root: Tree = { id: '0', name: '总类别', children: [] }
  root.children = handleTree(data, 'id', 'parentId')
  materialTypeTree.value.push(root)
    materialTypeValue.value = data;
}
</script>