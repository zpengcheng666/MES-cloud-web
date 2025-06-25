<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="任务编码" prop="taskCode">
        <el-input v-model="formData.taskCode" placeholder="请输入任务编码" />
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input-number v-model="formData.priority" placeholder="请输入优先级" />
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-radio-group v-model="formData.taskStatus">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CARRY_TASK_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="formData.taskType" placeholder="请选择任务类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CARRY_TASK_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务内容" prop="taskContent">
        <el-input type="textarea" v-model="formData.taskContent" placeholder="请输入任务内容" />
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDescription">
        <el-input type="textarea" v-model="formData.taskDescription" placeholder="请输入任务描述" />
      </el-form-item>
      <el-form-item label="AGV ID" prop="agvId">
        <el-input v-model="formData.agvId" placeholder="请输入AGV ID" />
      </el-form-item>
      <el-form-item label="库存单集合" prop="orderIds">
        <el-input v-model="formData.orderIds" placeholder="请输入库存单集合" />
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="搬运任务子表" name="carrySubTask">
        <CarrySubTaskForm ref="carrySubTaskFormRef" :parent-id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CarryTaskApi, CarryTaskVO } from '@/api/wms/carrytask'
import CarrySubTaskForm from './components/CarrySubTaskForm.vue'

/** 搬运任务 表单 */
defineOptions({ name: 'CarryTaskForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  taskCode: undefined,
  priority: undefined,
  taskStatus: undefined,
  taskType: undefined,
  taskContent: undefined,
  taskDescription: undefined,
  agvId: undefined,
  orderIds: undefined,
})
const formRules = reactive({
  taskType: [{ required: true, message: '任务类型不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('carrySubTask')
const carrySubTaskFormRef = ref()

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
      formData.value = await CarryTaskApi.getCarryTask(id)
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
    await carrySubTaskFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'carrySubTask'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as CarryTaskVO
    // 拼接子表的数据
    data.carrySubTasks = carrySubTaskFormRef.value.getData()
    if (formType.value === 'create') {
      await CarryTaskApi.createCarryTask(data)
      message.success(t('common.createSuccess'))
    } else {
      await CarryTaskApi.updateCarryTask(data)
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
    taskCode: undefined,
    taskStatus: undefined,
    taskType: undefined,
    taskContent: undefined,
    taskDescription: undefined,
    agvId: undefined,
    orderIds: undefined,
  }
  formRef.value?.resetFields()
}
</script>
