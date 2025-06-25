<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="库区编码" prop="warehouseAreaId">
        <el-select v-model="formData.warehouseAreaId" clearable filterable placeholder="请选择库区">
          <el-option
            v-for="warehouseArea in warehouseAreaList"
            :key="warehouseArea.id"
            :label="warehouseArea.areaCode +'-'+ warehouseArea.areaName"
            :value="warehouseArea.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物料类型" prop="materialConfigId">
        <el-select v-model="formData.materialConfigId" clearable filterable placeholder="请选择物料类型">
          <el-option
            v-for="materialConfig in materialConfigList"
            :key="materialConfig.id"
            :label="materialConfig.materialNumber"
            :value="materialConfig.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MaterialConfigApi } from '@/api/wms/materialconfig';
import { MaterialConfigAreaApi, MaterialConfigAreaVO } from '@/api/wms/materialconfigarea'
import { WarehouseAreaApi } from '@/api/wms/warehousearea';

/** 物料类型关联库区配置 表单 */
defineOptions({ name: 'MaterialConfigAreaForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warehouseAreaId: undefined,
  materialConfigId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const warehouseAreaList = ref<any[]>([]) // 仓库区域列表
const materialConfigList =ref<any[]>([])  //物料类型

/** 打开弹窗 */
const open = async (type: string, id?: number, warehouseAreaId?: string, materialConfigId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MaterialConfigAreaApi.getMaterialConfigArea(id)
    } finally {
      formLoading.value = false
    }
  }else{
    formData.value.warehouseAreaId = warehouseAreaId;
    formData.value.materialConfigId = materialConfigId;
  }
    // 加载仓库区域列表
  warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList()
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
    const data = formData.value as unknown as MaterialConfigAreaVO
    if (formType.value === 'create') {
      await MaterialConfigAreaApi.createMaterialConfigArea(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaterialConfigAreaApi.updateMaterialConfigArea(data)
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
    warehouseAreaId: undefined,
    materialConfigId: undefined,
  }
  formRef.value?.resetFields()
}
</script>