<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">

      <el-form-item label="类型" prop="type" v-if="!formData.pid">
        <el-select v-model="formData.type">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CATEGORY_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type" v-else>
        <el-select v-model="formData.type" disabled>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CATEGORY_TYPE)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="父分类" prop="pid" v-if="formData.pid">
        <el-input v-model="formData.pname" placeholder="请输入父分类名称" disabled />
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="接口型号" prop="interfaceModel">
        <el-input v-model="formData.interfaceModel" placeholder="请输入接口型号" />
      </el-form-item>
      <!-- <el-form-item label="组装配方ID" prop="partsAssemblyId">
        <el-input v-model="formData.partsAssemblyId" placeholder="请输入组装配方ID" />
      </el-form-item> -->
      <el-form-item label="托盘类型" prop="trayTypeId">
        <el-select v-model="formData.trayTypeId" filterable placeholder="请选择托盘类型" style="width: 240px">
          <el-option v-for="item in typeSelect" :key="item.id" :label="item.trayTypeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="formData.state">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
            :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as CategoryApi from '@/api/knifetool/tool/category'
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'

/** 刀具分类 表单 */
defineOptions({ name: 'CategoryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const typeSelect = ref<any>([])
const formData = ref({
  id: undefined,
  pid: 0,
  pname: undefined,
  name: undefined,
  level: 1,
  type: 1,
  code: undefined,
  interfaceModel: undefined,
  partsAssemblyId: undefined,
  trayTypeId: undefined,
  state: 1,
})
const formRules = reactive({
  name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '类型编码不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  state: [{ required: true, message: '逻辑删除(0:失效 1:有效2已删除)不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number, pid?: number, toolType?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  if (toolType) {
    formData.value.type = toolType
  }
  if (pid) {
    // 根据PID获取父分类信息
    const data = await CategoryApi.getCategory(pid)
    console.log("data", data)
    formData.value.pid = pid
    formData.value.pname = data.name
    formData.value.level = data.level + 1
  }
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CategoryApi.getCategory(id)
    } finally {
      formLoading.value = false
    }
  }
  typeSelect.value = await ToolTrayTypeApi.getToolTrayTypeList()
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
    const data = formData.value as unknown as CategoryApi.CategoryVO
    if (formType.value === 'create') {
      await CategoryApi.createCategory(data)
      message.success(t('common.createSuccess'))
    } else {
      await CategoryApi.updateCategory(data)
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
    pid: 0,
    pname: undefined,
    name: undefined,
    level: 1,
    type: 1,
    code: undefined,
    interfaceModel: undefined,
    partsAssemblyId: undefined,
    trayTypeId: undefined,
    state: 1
  }
  formRef.value?.resetFields()
}
</script>