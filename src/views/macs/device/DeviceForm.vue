<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="区域" prop="regionId">
        <el-tree-select
          v-model="formData.regionId"
          :data="regionList"
          :props="{...defaultProps, label: 'name'}"
          check-strictly
          default-expand-all
          placeholder="请选择区域"
          clearable
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="formData.status"  placeholder="请选择设备状态">
          <el-option
            v-for="dict in getIntDictOptions('connectionStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ip" prop="ip">
        <el-input v-model="formData.ip" placeholder="请输入ip" />
      </el-form-item>
      <el-form-item label="端口号" prop="port">
        <el-input v-model="formData.port" placeholder="请输入端口号" />
      </el-form-item>
      <el-form-item label="账户" prop="accountNumber">
        <el-input v-model="formData.accountNumber" placeholder="请输入账户" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="启用状态" prop="enableStatus">
        <el-radio-group v-model="formData.enableStatus">
          <el-radio
            v-for="dict in getIntDictOptions('enableStatus')"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="厂商" prop="manufacturer">
        <el-input v-model="formData.manufacturer" placeholder="请输入厂商" />
      </el-form-item>
      <el-form-item label="型号" prop="unit">
        <el-input v-model="formData.unit" placeholder="请输入型号" />
      </el-form-item>
      <el-form-item label="连接信息" prop="connectionInformation">
        <el-input v-model="formData.connectionInformation" placeholder="请输入连接信息" />
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
import { DeviceApi, DeviceVO } from '@/api/macs/device'
import { defaultProps,handleTree } from "@/utils/tree";

/** 设备 表单 */
defineOptions({ name: 'DeviceForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const regionList = ref([])
const formData = ref({
  code: undefined,
  name: undefined,
  status: undefined,
  ip: undefined,
  port: undefined,
  accountNumber: undefined,
  password: undefined,
  manufacturer: undefined,
  unit: undefined,
  connectionInformation: undefined,
  enableStatus: undefined,
  createBy: undefined,
  updateBy: undefined,
  regionId: undefined,
})
const formRules = reactive({
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  ip: [{ required: true, message: 'IP不能为空', trigger: 'blur' }],
  port: [{ required: true, message: '端口不能为空', trigger: 'blur' }],
  accountNumber: [{ required: true, message: '账户不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  enableStatus: [{ required: true, message: '启用状态不能为空', trigger: 'blur' }],
  regionId: [{ required: true, message: '区域不能为空', trigger: 'blur' }],
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
      formData.value = await DeviceApi.getDevice(id)
    } finally {
      formLoading.value = false
    }
  }
  await getRegionList();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getRegionList = async () => {
  const data = await DeviceApi.getRegionList();
  regionList.value = handleTree(data, 'id', 'parentId')
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as DeviceVO
    if (formType.value === 'create') {
      await DeviceApi.createDevice(data)
      message.success(t('common.createSuccess'))
    } else {
      await DeviceApi.updateDevice(data)
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
    code: undefined,
    name: undefined,
    status: undefined,
    ip: undefined,
    port: undefined,
    accountNumber: undefined,
    password: undefined,
    enableStatus: undefined,
    createBy: undefined,
    updateBy: undefined
  }
  formRef.value?.resetFields()
}
</script>
