<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="分配类型" prop="assignmentType">
        <el-select v-model="formData.assignmentType" placeholder="请选择分配类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.QMS_ASSIGNMENT_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="检验人员" prop="assignmentId" v-if="formData.assignmentType == '1'">
        <el-select
          v-model="formData.assignmentId"
          placeholder="请选择检验人员"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.nickname+ '（' + item.deptName + '）'"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="检验班组" prop="assignmentId" v-if="formData.assignmentType == '2'">
        <el-tree-select
          v-model="formData.assignmentId"
          :data="deptList"
          :props="defaultProps"
          check-strictly
          node-key="id"
          placeholder="请选择检验人员"
        />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { InspectionSheetApi } from '@/api/qms/inspectionsheet'
import * as UserApi from "@/api/system/user";
import * as DeptApi from '@/api/system/dept'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import { defaultProps, handleTree } from '@/utils/tree'

defineOptions({ name: 'InspectionSheetAssignForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const userOptions = ref<UserApi.UserVO[]>([]) // 用户列表

const formData = ref({
  id: undefined,
  assignmentType: undefined,
  assignmentId: undefined,
})
const formRules = reactive({
  assignmentType: [{ required: true, message: '分配类型不能为空', trigger: 'change' }],
  assignmentId: [{ required: true, message: '检验人员不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = '分配检验人员'
  resetForm()
  const data = await InspectionSheetApi.getInspectionSheetScheme(id)
  formData.value.id = id
  if(data.assignmentId){
    formData.value.assignmentType = data.assignmentType
    formData.value.assignmentId = parseInt(data.assignmentId)
  }
  // 获得用户列表
  userOptions.value = await UserApi.getSimpleUserList()
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
    const data = formData.value
    await InspectionSheetApi.updateInspectionSheetSchemeAssignment(data)
    message.success(t('common.createSuccess'))
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
    assignmentType: undefined,
    assignmentId: undefined,
  }
  formRef.value?.resetFields()
}

const deptList = ref<Tree[]>([]) // 树形结构
// 加载部门树、用户集合
onMounted(async () => {
  deptList.value = handleTree(await DeptApi.getSimpleDeptList())
})
</script>
