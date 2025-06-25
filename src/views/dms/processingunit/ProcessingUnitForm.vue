<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
      :disabled="formType == 'detail'"
    >
      <el-form-item label="产线编号" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="请输入产线编号"
          :disabled="formType == 'update'"
        />
      </el-form-item>
      <el-form-item label="产线名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入产线名称" />
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-select-v2
          v-model="formData.enable"
          :options="getIntDictOptions(DICT_TYPE.DMS_DEVICE_TYPE_ENABLE)"
          placeholder="选择是否启用"
          clearable
        />
      </el-form-item>

      <el-form-item label="关联类型" prop="deviceType">
        <el-select-v2
          v-model="formData.deviceType"
          :options="props.deviceTypeList"
          placeholder="选择运行状态"
          filterable
          clearable
        />
      </el-form-item>

      <el-form-item label="规格型号" prop="specification">
        <el-input v-model="formData.specification" placeholder="请输入规格型号" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <el-input v-model="formData.manufacturer" placeholder="请输入生产厂家" />
      </el-form-item>
      <el-form-item label="产地" prop="countryRegion">
        <el-input v-model="formData.countryRegion" placeholder="产地" />
      </el-form-item>
      <el-form-item label="厂家联系人" prop="contacts">
        <el-input v-model="formData.contacts" placeholder="请输入厂家联系人" />
      </el-form-item>
      <el-form-item label="厂家联系电话" prop="contactPhone">
        <el-input v-model="formData.contactPhone" placeholder="请输入厂家联系电话" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="5" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { DeviceTypeApi, DeviceTypeVO } from '@/api/dms/devicetype'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

/** 设备产线 表单 */
defineOptions({ name: 'DeviceTypeForm' })
const props = defineProps(['deviceTypeList'])
//属性

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的产线：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  type: 0,
  enable: undefined,
  deviceType: undefined,
  specification: undefined,
  manufacturer: undefined,
  countryRegion: undefined,
  contacts: undefined,
  contactPhone: undefined,
  remark: undefined
})
const formRules = reactive({
  code: [{ required: true, message: '产线编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '产线名称不能为空', trigger: 'blur' }],
  enable: [{ required: true, message: '是否启用必选', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

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
      formData.value = await DeviceTypeApi.getDeviceType(id)
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
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DeviceTypeVO
    if (formType.value === 'create') {
      await DeviceTypeApi.createDeviceType(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await DeviceTypeApi.updateDeviceType(data)
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
    code: undefined,
    name: undefined,
    type: 1,
    enable: undefined,
    deviceType: undefined,
    specification: undefined,
    manufacturer: undefined,
    countryRegion: undefined,
    contacts: undefined,
    contactPhone: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
