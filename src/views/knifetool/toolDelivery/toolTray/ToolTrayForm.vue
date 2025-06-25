<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <selectPositionDialog ref="positionForm" @success="selectPositionInfo" title="重新选择库位" />
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="托盘编码" prop="trayNumber">
        <el-input v-model="formData.trayNumber" placeholder="请输入托盘编码" />
      </el-form-item>
      <el-form-item label="托盘库内位置" prop="trayLocationName">
        <el-input v-model="formData.trayLocationName" placeholder="请选择托盘库">
          <template #append>
            <el-button :icon="Search" @click="openPositionDialog()" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="托盘类型" prop="trayTypeId">
        <el-select v-model="formData.trayTypeId" filterable placeholder="请选择托盘类型" style="width: 240px">
          <el-option v-for="item in typeSelect" :key="item.id" :label="item.trayTypeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="托盘状态" prop="trayStatus">
        <el-radio-group v-model="formData.trayStatus">
          <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_STATUS_TYPE)" :key="dict.value"
            :label="dict.value">
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ToolTrayApi from '@/api/knifetool/toolDelivery/tray'
import * as ToolTrayTypeApi from '@/api/knifetool/toolDelivery/trayType'
import selectPositionDialog from '@/components/store/selectPositionDialog.vue'
/** 刀具托盘 表单 */
defineOptions({ name: 'ToolTrayForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const typeSelect = ref<any>([])
const formData = ref({
  id: undefined,
  trayNumber: undefined,
  trayLocation: undefined,
  trayLocationName: '',
  trayTypeId: undefined,
  trayStatus: 1,
  createId: undefined,
  updateId: undefined
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  typeSelect.value = await ToolTrayTypeApi.getToolTrayTypeList()
  console.log(typeSelect.value)
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ToolTrayApi.getToolTray(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 选中的货位
const positionForm = ref()
const openPositionDialog = () => {
  positionForm.value.open()
}

// 选中的仓位信息
const selectPositionInfo = (json: any) => {
  formData.value.trayLocationName = `${json.layerNum}-${json.locationNum}`
  formData.value.trayLocation = json.id
  console.log(formData)
  console.log(json)
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ToolTrayApi.ToolTrayVO
    if (formType.value === 'create') {
      await ToolTrayApi.createToolTray(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolTrayApi.updateToolTray(data)
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
    trayNumber: undefined,
    trayLocation: undefined,
    trayLocationName: '',
    trayTypeId: undefined,
    trayStatus: 1,
    createId: undefined,
    updateId: undefined
  }
  formRef.value?.resetFields()
}

// 父组件充当中间件，将选中树节点传给子级
const treeSelectNode = reactive<any>({
  name: '',
  id: '',
  classification: null
})
provide('treeSelectNode', treeSelectNode)


const treeType = reactive<any>({
  storeMenuId: 1,
  type: 4
})
// 向后代组件提供数据, 只要是后代都能接收
provide('treeType', treeType)
</script>