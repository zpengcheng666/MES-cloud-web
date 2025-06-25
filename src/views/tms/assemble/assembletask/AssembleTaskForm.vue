<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="工单号" label-width="150" prop="orderNumber">
            <el-input v-model="formData.orderNumber" placeholder="请输入工单号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料类型" label-width="150" prop="materialConfigId">
            <el-select v-model="formData.materialConfigId" clearable filterable placeholder="请选择物料类型">
              <el-option
                v-for="materialConfig in materialConfigList"
                :key="materialConfig.id"
                :label="materialConfig.materialNumber"
                :value="materialConfig.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="目标位置" label-width="150" prop="targetLocation">
            <el-input v-model="formData.targetLocation" placeholder="请输入目标位置" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需求数量" label-width="150" prop="needCount">
            <el-input-number v-model="formData.needCount" placeholder="请输入需求数量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配送截止时间" label-width="150" prop="distributionDeadline">
            <el-date-picker v-model="formData.distributionDeadline" type="date" value-format="x"
              placeholder="选择配送截止时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最短加工时长(min)" label-width="150" prop="minimumTime">
            <el-input-number v-model="formData.minimumTime" placeholder="请输入最短加工时长" />
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
   
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AssembleTaskApi, AssembleTaskVO } from '@/api/tms/assembletask'
import AssembleRecordForm from './components/AssembleRecordForm.vue'
import { MaterialConfigApi } from '@/api/wms/materialconfig'

/** 刀具装配任务 表单 */
defineOptions({ name: 'AssembleTaskForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderNumber: undefined,
  needCount: 1,
  targetLocation: undefined,
  distributionDeadline: undefined,
  materialConfigId: undefined,
  minimumTime: undefined,
  status: 1,
})
const formRules = reactive({
  orderNumber: [{ required: true, message: '工单号不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料编码不能为空', trigger: 'blur' }],
  needCount: [{ required: true, message: '需求数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const materialConfigList =ref<any[]>([])  //物料类型

/** 子表的表单 */
const subTabsName = ref('assembleRecord')
const assembleRecordFormRef = ref()

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
      formData.value = await AssembleTaskApi.getAssembleTask(id)
    } finally {
      formLoading.value = false
    }
  }
      materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
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
    const data = formData.value as unknown as AssembleTaskVO

    if (formType.value === 'create') {
      await AssembleTaskApi.createAssembleTask(data)
      message.success(t('common.createSuccess'))
    } else {
      await AssembleTaskApi.updateAssembleTask(data)
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
    orderNumber: undefined,
    needCount: 1,
    targetLocation: undefined,
    distributionDeadline: undefined,
    materialConfigId: undefined,
    minimumTime: undefined,
    status: 1,
  }
  formRef.value?.resetFields()
}
</script>