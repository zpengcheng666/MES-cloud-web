<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="小车编号" prop="carNo">
        <el-input v-model="formData.carNo" placeholder="小车编号" />
      </el-form-item>
      <el-form-item label="运行模式" prop="mode">
        <el-radio-group v-model="formData.mode">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MODE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="x 坐标" prop="x">
        <el-input v-model="formData.x" placeholder="请输入机器人的 x 坐标, 单位 m" />
      </el-form-item>
      <el-form-item label="y坐标" prop="y">
        <el-input v-model="formData.y" placeholder="请输入机器人的 y坐标, 单位 m" />
      </el-form-item>
      <el-form-item label="当前所在站点" prop="currentStation">
        <el-input v-model="formData.currentStation" placeholder="请输入机器人当前所在站点的 id（该判断比	较严格，机器人必须很靠近某一个站	点(<30cm， 这个距离可以通过参数	配置中的 CurrentPointDist 修改)，否	则为空字符，即不处于任何站点
" />
      </el-form-item>
      <el-form-item label="上一所在站
" prop="lastStation">
        <el-input v-model="formData.lastStation" placeholder="请输入机器人上一个所在站点的 id
" />
      </el-form-item>
      <el-form-item label="是否静止" prop="isStop">
        <el-radio-group v-model="formData.isStop">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否被阻挡" prop="blocked">
        <el-radio-group v-model="formData.blocked">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否急停" prop="emergency">
        <el-radio-group v-model="formData.emergency">
          <el-radio
            v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="taskStatus">
        <el-select v-model="formData.taskStatus" placeholder="请选择0 = NONE, 1 = WAITING(目前不可能	出现该状态), 2 = RUNNING, 3 =	SUSPENDED, 4 = COMPLETED, 5 =	FAILED, 6 = CANCELED
">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.WMS_AGV_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="自身库位" prop="locationId">
        <el-select v-model="formData.locationId" placeholder="请选择绑定库位" clearable filterable>
              <el-option
                v-for="warehouseLocation in warehouseLocationList"
                :key="warehouseLocation.id"
                :label="warehouseLocation.locationCode"
                :value="warehouseLocation.id+''"
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
import { getIntDictOptions, getStrDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import { AGVApi, AGVVO } from '@/api/wms/agv'
import { WarehouseLocationApi } from '@/api/wms/warehouselocation';

/** AGV 信息 表单 */
defineOptions({ name: 'AGVForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  carNo: undefined,
  mode: 1,
  x: undefined,
  y: undefined,
  currentStation: undefined,
  lastStation: undefined,
  isStop: true,
  blocked: false,
  emergency: false,
  taskStatus: "0",
  locationId: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const warehouseLocationList =ref<any[]>([]) //库位列表

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
      formData.value = await AGVApi.getAGV(id)
    } finally {
      formLoading.value = false
    }
  }
  // 获取库位列表  
  warehouseLocationList.value =await WarehouseLocationApi.getWarehouseLocationList()
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
    const data = formData.value as unknown as AGVVO
    if (formType.value === 'create') {
      await AGVApi.createAGV(data)
      message.success(t('common.createSuccess'))
    } else {
      await AGVApi.updateAGV(data)
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
    carNo: undefined,
    mode: 1,
    x: undefined,
    y: undefined,
    currentStation: undefined,
    lastStation: undefined,
    isStop: true,
    blocked: false,
    emergency: false,
    taskStatus: "0",
    locationId: undefined,
  }
  formRef.value?.resetFields()
}
</script>