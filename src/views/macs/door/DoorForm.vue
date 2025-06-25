<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编码" />
      </el-form-item>
      <el-form-item label="关联区域" prop="regionId" v-show="!region">
        <el-tree-select
          disabled
          v-model="formData.regionId"
          :data="regionList"
          :props="{...defaultProps, label: 'name'}"
          check-strictly
          default-expand-all
          placeholder="请选择关联区域"
        />
      </el-form-item>
      <el-form-item label="关联设备" prop="deviceId">
        <el-select v-model="formData.deviceId" filterable placeholder="请选择关联设备" @change="deviceSelectFun">
          <el-option
            v-for="item in deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="位置" prop="locationName">
        <el-input v-model="formData.locationName" placeholder="请输入位置" />
      </el-form-item>-->
      <el-form-item label="门禁状态" prop="doorStatus">
        <el-select v-model="formData.doorStatus" placeholder="请选择门禁状态">
          <el-option
            v-for="dict in getIntDictOptions('doorStatus')"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="描述/备注" prop="description">
        <el-input v-model="formData.description" placeholder="请输入描述/备注" />
      </el-form-item>
      <el-form-item label="关联设备位置" prop="devicePort">
        <el-input v-model="formData.devicePort" placeholder="请输入关联设备位置" />
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
import { getDoor, DoorVO, createDoor, updateDoor, getRegionList, getDeviceList } from '@/api/macs/door'
import {defaultProps, handleTree} from '@/utils/tree'
import {inject} from "vue";

/** 门 表单 */
defineOptions({ name: 'DoorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  name: undefined,
  code: undefined,
  regionId: undefined,
  deviceId: undefined,
  locationName: undefined,
  doorStatus: undefined,
  description: undefined,
  devicePort: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  code: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  deviceId: [{ required: true, message: '设备不能为空', trigger: 'blur' }],
  doorStatus: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  devicePort: [{ required: true, message: '设备位置不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const regionList = ref([])
const deviceList = ref([])
const region = inject("region");

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
      formData.value = await getDoor(id)
    } finally {
      formLoading.value = false
    }
  }
  [, deviceList.value] = await Promise.all([getRegionTree(), getDeviceList({})]);
  if (region) formData.value.regionId = region.id
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
    const data = formData.value as unknown as DoorVO
    if (formType.value === 'create') {
      await createDoor(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateDoor(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const deviceSelectFun = (value: any) => {
  const device = deviceList.value.find((item) => item.id === value)
  formData.value.regionId = device.regionId;
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    name: undefined,
    code: undefined,
    regionId: undefined,
    deviceId: undefined,
    locationName: undefined,
    doorStatus: undefined,
    description: undefined,
    devicePort: undefined
  }
  formRef.value?.resetFields()
}

/** 获得区域树 */
const getRegionTree = async () => {
  const data = await getRegionList({});
  regionList.value = handleTree(data, 'id', 'parentId')
}
</script>
