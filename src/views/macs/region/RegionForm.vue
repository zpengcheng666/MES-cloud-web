<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="区域编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入区域编码" />
      </el-form-item>
      <el-form-item label="区域名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入区域名称" />
      </el-form-item>
      <el-form-item label="公开状态" prop="publicStatus">
        <el-radio-group v-model="formData.publicStatus">
          <el-radio
            v-for="dict in getBoolDictOptions('publicStatus')"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="父区域" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="regionTree"
          :props="{...defaultProps, label: 'code'}"
          check-strictly
          default-expand-all
          placeholder="请选择上级id"
          clearable
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { RegionApi, RegionVO } from '@/api/macs/region'
import { defaultProps, handleTree } from '@/utils/tree'
import { Editor } from '@/components/Editor'

/** 区域 表单 */
defineOptions({ name: 'RegionForm' })

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
  publicStatus: undefined,
  description: undefined,
  parentId: undefined,
  createBy: undefined,
  updateBy: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  publicStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const regionTree = ref([]) // 树形结构

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await RegionApi.getRegion(id)
    } finally {
      formLoading.value = false
    }
  }
  await getRegionTree()
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
    const data = formData.value as unknown as RegionVO
    if (formType.value === 'create') {
      await RegionApi.createRegion(data)
      message.success(t('common.createSuccess'))
    } else {
      await RegionApi.updateRegion(data)
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
    publicStatus: undefined,
    description: undefined,
    parentId: undefined,
    createBy: undefined,
    updateBy: undefined
  }
  formRef.value?.resetFields()
}

/** 获得区域树 */
const getRegionTree = async () => {
  const data = await RegionApi.getRegionList({})
  regionTree.value = handleTree(data, 'id', 'parentId')
}
</script>
