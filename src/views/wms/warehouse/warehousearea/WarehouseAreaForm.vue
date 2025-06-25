<template>
  <Dialog :title="dialogTitle" width="60%" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="仓库编码" prop="warehouseId">
            <el-select v-model="formData.warehouseId" :disabled="!!formData.id" clearable filterable placeholder="请选择仓库">
              <el-option
                v-for="warehouse in warehouseList"
                :key="warehouse.id"
                :label="warehouse.warehouseCode"
                :value="warehouse.id+''"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区名称" prop="areaName">
            <el-input v-model="formData.areaName" placeholder="请输入库区名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库区编码" prop="areaCode">
            <el-input v-model="formData.areaCode" :disabled="!!formData.id" placeholder="请输入库区编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区属性" prop="areaProperty">
            <el-select v-model="formData.areaProperty" placeholder="请选择库区属性">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_AREA_PROPERTY)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库区类型" prop="areaType">
            <el-select v-model="formData.areaType" placeholder="请选择库区类型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_AREA_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区承重" prop="areaBearing">
            <el-input v-model="formData.areaBearing" placeholder="请输入库区承重" />
          </el-form-item>
         
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库区宽" prop="areaWidth">
            <el-input v-model="formData.areaWidth" placeholder="请输入库区宽" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区高" prop="areaHeight">
            <el-input v-model="formData.areaHeight" placeholder="请输入库区高" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="库区长" prop="areaLength">
            <el-input v-model="formData.areaLength" placeholder="请输入库区长" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通道(C)" prop="areaChannels">
            <el-input v-model="formData.areaChannels" :disabled="!!formData.id" placeholder="请输入通道" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="组(G)" prop="areaGroup">
            <el-input v-model="formData.areaGroup" :disabled="!!formData.id" placeholder="请输入组" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="层(L)" prop="areaLayer">
            <el-input v-model="formData.areaLayer" :disabled="!!formData.id" placeholder="请输入层" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="位(S)" prop="areaSite">
            <el-input v-model="formData.areaSite" :disabled="!!formData.id" placeholder="请输入位" />
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
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { WarehouseAreaApi, WarehouseAreaVO } from '@/api/wms/warehousearea'
import {WarehouseApi} from "@/api/wms/warehouse";
import { el } from 'element-plus/es/locale';

/** 库区 表单 */
defineOptions({ name: 'WarehouseAreaForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warehouseId: undefined,
  areaName: undefined,
  areaCode: undefined,
  areaProperty: undefined,
  areaLength: undefined,
  areaWidth: undefined,
  areaHeight: undefined,
  areaBearing: undefined,
  areaChannels: undefined,
  areaGroup: undefined,
  areaLayer: undefined,
  areaSite: undefined,
  areaType: undefined,
})
const formRules = reactive({
  warehouseId: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
  areaName: [{ required: true, message: '库区名称不能为空', trigger: 'blur' }],
  areaCode: [{ required: true, message: '库区编码不能为空', trigger: 'blur' }],
  areaProperty: [{ required: true, message: '库区属性不能为空', trigger: 'blur' }],
  areaType: [{ required: true, message: '库区类型不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseList = ref<any[]>([]) // 仓库列表

const selectWarehouseId = ref(undefined) // 仓库选择器的选择值
const treeSelectNode = inject('treeSelectNode') as any
watch(
  () => treeSelectNode.id,
  (val) => {
    val &&
    val.length &&
    nextTick(() => {
      selectWarehouseId.value = treeSelectNode.id
    })
  },
  { immediate: true }
)


/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  formData.value.warehouseId = selectWarehouseId.value
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WarehouseAreaApi.getWarehouseArea(id)
    } finally {
      formLoading.value = false
    }
  }
  //加载仓库列表
  warehouseList.value = await WarehouseApi.getWarehouseList()
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
    const data = formData.value as unknown as WarehouseAreaVO
    if (formType.value === 'create') {
      await WarehouseAreaApi.createWarehouseArea(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarehouseAreaApi.updateWarehouseArea(data)
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
    warehouseId: undefined,
    areaName: undefined,
    areaCode: undefined,
    areaProperty: undefined,
    areaLength: undefined,
    areaWidth: undefined,
    areaHeight: undefined,
    areaBearing: undefined,
    areaChannels: undefined,
    areaGroup: undefined,
    areaLayer: undefined,
    areaSite: undefined,
    areaType: undefined,
  }
  formRef.value?.resetFields()
}
</script>
<style  lang="scss" >

</style>
