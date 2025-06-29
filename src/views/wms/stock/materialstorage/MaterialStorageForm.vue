<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="储位编码" prop="storageCode">
        <el-input v-model="formData.storageCode" placeholder="请输入储位编码" />
      </el-form-item>
      <el-form-item label="物料条码" prop="materialStockId">
        <el-select v-model="formData.materialStockId" placeholder="请选择物料条码">
          <el-option
            v-for="materialStock in materialStockList"
            :key="materialStock.id"
            :label="materialStock.barCode"
            :value="materialStock.id"
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
import { MaterialStorageApi, MaterialStorageVO } from '@/api/wms/materialstorage'
import {MaterialStockApi} from "@/api/wms/materialstock";

/** 物料储位 表单 */
defineOptions({ name: 'MaterialStorageForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  storageCode: undefined,
  materialStockId: undefined,
})
const formRules = reactive({
  storageCode: [{ required: true, message: '储位编码不能为空', trigger: 'blur' }],
  materialStockId: [{ required: true, message: '物料id不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref
const materialStockList = ref<any[]>([]) // 物料库存列表

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
      formData.value = await MaterialStorageApi.getMaterialStorage(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获取物料库存列表
  materialStockList.value = await MaterialStockApi.getMaterialStockList()


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
    const data = formData.value as unknown as MaterialStorageVO
    if (formType.value === 'create') {
      await MaterialStorageApi.createMaterialStorage(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaterialStorageApi.updateMaterialStorage(data)
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
    storageCode: undefined,
    materialStockId: undefined,
  }
  formRef.value?.resetFields()
}
</script>
<style  lang="scss" >

</style>
