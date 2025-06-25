<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="盘点库区" prop="checkAreaId">
        <el-select v-model="formData.checkAreaId" clearable filterable placeholder="请选择库区">
          <el-option
            v-for="warehouseArea in warehouseAreaList"
            :key="warehouseArea.id"
            :label="warehouseArea.areaCode +'-'+ warehouseArea.areaName"
            :value="warehouseArea.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="盘点名称" prop="checkName">
        <el-input v-model="formData.checkName" placeholder="请输入盘点名称" />
      </el-form-item>
      <el-form-item label="物料类型" prop="materialConfigIds">
        <el-select v-model="formData.materialConfigIds" multiple clearable filterable placeholder="请选择物料类型">
          <el-option
            v-for="materialConfig in materialConfigList"
            :key="materialConfig.id"
            :label="materialConfig.materialNumber"
            :value="materialConfig.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="formData.startTime"
          type="datetime"
          value-format="x"
          placeholder="选择开始时间"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="formData.endTime"
          type="datetime"
          value-format="x"
          placeholder="选择结束时间"
        />
      </el-form-item>
      <el-form-item label="截止时间" prop="cutOffTime">
        <el-date-picker
          v-model="formData.cutOffTime"
          type="datetime"
          value-format="x"
          placeholder="选择截止时间"
        />
      </el-form-item>
      <el-form-item label="负责人" prop="checkUserId">
        <el-select v-model="formData.checkUserId" placeholder="请选择负责人">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="盘点状态" prop="checkStatus">
        <el-select v-model="formData.checkStatus" placeholder="请选择盘点状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CHECK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否锁盘" prop="checkLocked">
        <el-switch  v-model="formData.checkLocked" :active-value="true" :inactive-value="false" active-text="是" inactive-text="否" inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CheckPlanApi, CheckPlanVO } from '@/api/wms/checkplan'
import { WarehouseAreaApi } from '@/api/wms/warehousearea';
import { MaterialConfigApi } from '@/api/wms/materialconfig';
import { fa } from 'element-plus/es/locale';

/** 库存盘点计划 表单 */
defineOptions({ name: 'CheckPlanForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  checkAreaId: undefined,
  checkName: undefined,
  materialConfigIds: undefined,
  startTime: undefined,
  endTime: undefined,
  cutOffTime: undefined,
  checkUserId: undefined,
  checkStatus: undefined,
  checkLocked: true,
})
const formRules = reactive({
  checkAreaId: [{ required: true, message: '盘点库区不能为空', trigger: 'change' }],
  checkName: [{ required: true, message: '盘点名称不能为空', trigger: 'blur' }],
  cutOffTime: [{ required: true, message: '截止时间不能为空', trigger: 'blur' }],
  checkStatus: [{ required: true, message: '盘点状态不能为空', trigger: 'change' }],
  checkLocked: [{ required: true, message: '是否锁盘不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseAreaList = ref<any[]>([]) // 仓库区域列表
const materialConfigList =ref<any[]>([])  //物料类型

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
      formData.value = await CheckPlanApi.getCheckPlan(id)
    } finally {
      formLoading.value = false
    }
  }
  // 加载仓库区域列表
  warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
  // 获取物料类型列表
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
    const data = formData.value as unknown as CheckPlanVO
    if (formType.value === 'create') {
      await CheckPlanApi.createCheckPlan(data)
      message.success(t('common.createSuccess'))
    } else {
      await CheckPlanApi.updateCheckPlan(data)
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
    checkAreaId: undefined,
    checkName: undefined,
    materialConfigIds: undefined,
    startTime: undefined,
    endTime: undefined,
    cutOffTime: undefined,
    checkUserId: undefined,
    checkStatus: undefined,
    checkLocked: true,
  }
  formRef.value?.resetFields()
}
</script>