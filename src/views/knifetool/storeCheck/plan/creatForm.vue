<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="130px"
    >
      <el-form-item label="计划名称" prop="planName">
        <el-input placeholder="请输入计划名称" v-model="formData.planName" />
      </el-form-item>

      <el-form-item label="请选择仓库" prop="storeMenutreeId">
        <formStoreSelect
          ref="formStoreSelectRef"
          :value="formData.storeMenutreeId"
          @handle-select="(val) => setFormSelectValue(val, 'storeMenutreeId')"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="最晚提交日期" prop="latestCheckTime">
        <el-date-picker
          v-model="formData.latestCheckTime"
          style="width: 100%"
          format="YYYY-MM-DD"
          placeholder="最晚提交日期"
        />
      </el-form-item>

      <el-form-item label="盘点负责人" prop="chargeUserId">
        <formRecipientSelect
          ref="recipientRef"
          :value="formData.chargeUserId"
          placeholder="请选择盘点负责人"
          @handle-select="(val) => setFormSelectValue(val, 'chargeUserId')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { createOrUpdateCheckPlan } from '@/api/knifetool/storeCheck/plan'
import formStoreSelect from '@/components/store/formStoreSelect.vue'
import formRecipientSelect from '@/components/store/formRecipientSelect.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  storeMenutreeId: undefined,
  planName: null,
  latestCheckTime: '',
  chargeUserId: undefined,
  planFlag: 0
})

const formRef = ref() // 表单 Ref
const formRules = reactive({
  planName: [
    {
      required: true,
      message: '请输入计划名称',
      trigger: 'blur'
    }
  ],
  storeMenutreeId: [
    {
      required: true,
      message: '请选择要盘点的仓库',
      trigger: 'blur'
    }
  ],
  latestCheckTime: [
    {
      required: true,
      message: '请选择最晚提交时间',
      trigger: 'blur'
    }
  ],
  chargeUserId: [
    {
      required: true,
      message: '请选择负责人',
      trigger: 'blur'
    }
  ]
})

/** 打开弹窗 */
const open = async (type: string, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = `${type === 'create' ? '新增' : '修改'}盘点计划`
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (row) {
    console.log(row)
    formLoading.value = true
    try {
      formData.value = JSON.parse(JSON.stringify(row))
    } finally {
      formLoading.value = false
    }
  }
}
// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log(formData.value)

    const res = await createOrUpdateCheckPlan(formData.value)
    console.log(res)
    if (formType.value === 'create') {
      message.success(t('common.createSuccess'))
    } else {
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    storeMenutreeId: undefined,
    planName: null,
    latestCheckTime: '',
    chargeUserId: undefined,
    planFlag: 0
  }
  formRef.value?.resetFields()
}

const setFormSelectValue = (val: string, prop: string) => {
  console.log(val)
  formData.value[prop] = val
}
</script>
