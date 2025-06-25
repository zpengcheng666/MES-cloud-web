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
      <el-form-item label="编号" prop="code">
        <el-input v-model="formData.code" placeholder="请输入编号" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="所属类型" prop="affiliationDeviceType">
        <el-select-v2
          v-model="formData.affiliationDeviceType"
          :options="props.deviceTypeList"
          filterable
          clearable
          placeholder="选择所属类型"
          @change="
            (id) => {
              formData.type = props.deviceTypeList.find((v) => {
                return v.id == id
              })?.type
            }
          "
        />
      </el-form-item>
      <!-- <el-form-item label="产线/工位组" prop="type">
        <el-select v-model="formData.type" placeholder="请选择产线/工位组" disabled>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.DMS_LINE_STATION_GROUP)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否启用" prop="enable">
        <el-select v-model="formData.enable" placeholder="请选择是否启用">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.ENABLE_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="本机IP" prop="ip">
        <el-input v-model="formData.ip" placeholder="请输入本机ip" />
      </el-form-item>
      <el-form-item label="仓库" prop="location">
        <el-select-v2
          v-model="formData.location"
          :options="props.warehouseList"
          filterable
          clearable
          placeholder="请选择仓库"
        />
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

  <LineToType ref="lineToTypeRef" />
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { LineStationGroupApi, LineStationGroupVO } from '@/api/dms/linestationgroup'

/** 产线/工位组 表单 */
defineOptions({ name: 'LineStationGroupForm' })

const props = defineProps(['deviceTypeList', 'warehouseList'])

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  type: undefined,
  enable: undefined,
  affiliationDeviceType: undefined,
  ip: undefined,
  location: undefined,
  remark: undefined
})
const formRules = reactive({})
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
      formData.value = await LineStationGroupApi.getLineStationGroup(id)
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
    const data = formData.value as unknown as LineStationGroupVO
    if (formType.value === 'create') {
      await LineStationGroupApi.createLineStationGroup(data)
      message.success(t('common.createSuccess'))
    } else if (formType.value === 'update') {
      await LineStationGroupApi.updateLineStationGroup(data)
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
    type: undefined,
    enable: undefined,
    affiliationDeviceType: undefined,
    ip: undefined,
    location: undefined,
    remark: undefined
  }
  formRef.value?.resetFields()
}
</script>
