<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <div class="elfromLeft">
          <el-form-item class="elfromItem" label="仓库名称" prop="warehouseName">
            <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称" />
          </el-form-item>
          <el-form-item label="仓库编码" prop="warehouseCode">
            <el-input v-model="formData.warehouseCode" :disabled="!!formData.id"  placeholder="请输入仓库编码" />
          </el-form-item>
          <el-form-item label="仓库地址" prop="warehouseAddress">
            <el-input v-model="formData.warehouseAddress" placeholder="请输入仓库地址" />
          </el-form-item>
          <el-form-item label="仓库容量" prop="warehouseCapacity">
            <el-input v-model="formData.warehouseCapacity" placeholder="请输入仓库容量" />
          </el-form-item>
      </div>
      <div class="elfromRight">
          <el-form-item label="仓库性质" prop="warehouseNature">
            <el-select v-model="formData.warehouseNature" placeholder="请选择仓库性质">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_NATURE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库类型" prop="warehouseType">
            <el-select v-model="formData.warehouseType" placeholder="请选择仓库类型">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_WAREHOUSE_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库状态" prop="warehouseState">
            <el-select v-model="formData.warehouseState" placeholder="请选择仓库状态">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_ENABLE_STOP_TYPE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="仓库主管" prop="userId">
            <el-select v-model="formData.userId" clearable filterable placeholder="请选择仓库主管">
              <el-option
                v-for="user in userList"
                :key="user.id"
                :label="user.nickname"
                :value="user.id+''"
              />
            </el-select>
          </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WarehouseApi, WarehouseVO } from '@/api/wms/warehouse'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import * as UserApi from '@/api/system/user'

/** 仓库表 表单 */
defineOptions({ name: 'WarehouseForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  warehouseName: undefined,
  warehouseCode: undefined,
  warehouseAddress: undefined,
  warehouseCapacity: undefined,
  warehouseNature: undefined,
  warehouseType: undefined,
  warehouseState: undefined,
  userId: undefined,
})
const formRules = reactive({
  warehouseName: [{ required: true, message: '仓库名称不能为空', trigger: 'blur' }],
  warehouseCode: [{ required: true, message: '仓库编码不能为空', trigger: 'blur' }],
  warehouseNature: [{ required: true, message: '仓库性质不能为空', trigger: 'change' }],
  warehouseType: [{ required: true, message: '仓库类型不能为空', trigger: 'change' }],
  warehouseState: [{ required: true, message: '仓库状态不能为空', trigger: 'change' }],
})
const formRef = ref() // 表单 Ref
const userList = ref<any[]>([]) // 用户列表
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
      formData.value = await WarehouseApi.getWarehouse(id)
    } finally {
      formLoading.value = false
    }
  }
  // 加载用户列表
  userList.value = await UserApi.getSimpleUserList()
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
    const data = formData.value as unknown as WarehouseVO
    if (formType.value === 'create') {
      await WarehouseApi.createWarehouse(data)
      message.success(t('common.createSuccess'))
    } else {
      await WarehouseApi.updateWarehouse(data)
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
    warehouseName: undefined,
    warehouseCode: undefined,
    warehouseAddress: undefined,
    warehouseCapacity: undefined,
    warehouseNature: undefined,
    warehouseType: undefined,
    warehouseState: undefined,
    userId: undefined,
  }
  formRef.value?.resetFields()
}

</script>
<style  lang="scss" scoped>
 .elfromLeft{
   width: 45%;
 }
 .elfromRight{
   width: 45%;
   position: absolute;
   top: 6em;
   right: 6%;
 }
</style>
