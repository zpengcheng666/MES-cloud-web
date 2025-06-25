<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="47%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="申请单号" prop="applicationNumber">
        <el-input v-model="formData.applicationNumber" placeholder="请输入申请单号" />
      </el-form-item>
      <el-form-item label="申请代理人" prop="agent">
        <el-input v-model="formData.agent" placeholder="请输入申请代理人" />
      </el-form-item>
      <el-form-item label="公司组织" prop="organization">
        <el-input v-model="formData.organization" placeholder="请输入公司/组织" />
      </el-form-item>
      <el-form-item label="部门" prop="department">
        <el-input v-model="formData.department" placeholder="请输入部门" />
      </el-form-item>
      <el-form-item label="申请原因目的" prop="reason">
        <el-input type="textarea" v-model="formData.reason" placeholder="请输入申请原因/目的" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="访客区域权限" name="visitorRegion">
        <VisitorRegionForm ref="visitorRegionFormRef" :application-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { AccessApplicationApi, AccessApplicationVO } from '@/api/macs/accessapplication'
import VisitorRegionForm from './components/VisitorRegionForm.vue'

/** 通行申请 表单 */
defineOptions({ name: 'AccessApplicationForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  applicationNumber: undefined,
  agent: undefined,
  organization: undefined,
  department: undefined,
  reason: undefined,
  status: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('visitorRegion')
const visitorRegionFormRef = ref()

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
      formData.value = await AccessApplicationApi.getAccessApplication(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await visitorRegionFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'visitorRegion'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AccessApplicationVO
    // 拼接子表的数据
    data.visitorRegions = visitorRegionFormRef.value.getData();
    data.status = '0'
    if (formType.value === 'create') {
      await AccessApplicationApi.createAccessApplication(data)
      message.success(t('common.createSuccess'))
    } else {
      await AccessApplicationApi.updateAccessApplication(data)
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
    applicationNumber: undefined,
    agent: undefined,
    organization: undefined,
    department: undefined,
    reason: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>
