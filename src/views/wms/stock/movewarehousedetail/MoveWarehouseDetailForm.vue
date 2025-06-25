<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- <el-form-item label="移库单号" prop="orderNumber">
        <el-input v-model="formData.orderNumber" placeholder="请输入移库单号" />
      </el-form-item> -->
      <el-form-item label="移库类型" prop="moveType">
        <el-select v-model="formData.moveType" placeholder="请选择移库类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MOVE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移库状态" prop="moveState">
        <el-select v-model="formData.moveState" placeholder="请选择移库状态">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MOVE_STATE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="起始仓库" prop="startWarehouseId">
        <el-select v-model="formData.startWarehouseId" clearable filterable placeholder="请选择起始仓库">
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseCode"
            :value="warehouse.id+''"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="目标仓库" prop="targetWarehouseId">
        <el-select v-model="formData.targetWarehouseId" clearable filterable placeholder="请选择目标仓库">
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseCode"
            :value="warehouse.id+''"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="物料批次号" prop="batchNumber">
        <el-input v-model="formData.batchNumber" placeholder="请输入物料批次号" />
      </el-form-item>
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-tree-select
              clearable
              filterable
              v-model="formData.materialConfigId"
              :data="materialTypeTree"
              :props="{...defaultProps, label: 'materialNumber'}"
              check-strictly
              default-expand-all
              placeholder="请选择物料编号"
            />
      </el-form-item> -->
      <el-form-item label="移库物料" prop="chooseStockId">
        <el-select v-model="formData.chooseStockId" placeholder="请选择物料条码">
          <el-option
            v-for="materialStock in materialStockList"
            :key="materialStock.id"
            :label="materialStock.barCode"
            :value="materialStock.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="formData.quantity" placeholder="请输入数量" />
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
import { MoveWarehouseDetailApi, MoveWarehouseDetailVO } from '@/api/wms/movewarehousedetail'
import { WarehouseApi } from '@/api/wms/warehouse';
import { MaterialConfigApi } from '@/api/wms/materialconfig';
import { handleTree,defaultProps } from '@/utils/tree';
import { MaterialStockApi } from '@/api/wms/materialstock';

/** 库存移动详情 表单 */
defineOptions({ name: 'MoveWarehouseDetailForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderNumber: undefined,
  moveType: 1,
  moveState: 1,
  startWarehouseId: undefined,
  targetWarehouseId: undefined,
  batchNumber: undefined,
  materialConfigId: undefined,
  materialStockId: undefined,
  chooseStockId: undefined,
  quantity: 1,
})
const formRules = reactive({
  orderNumber: [{ required: true, message: '移库单号不能为空', trigger: 'blur' }],
  moveType: [{ required: true, message: '移库类型不能为空', trigger: 'change' }],
  moveState: [{ required: true, message: '移库状态不能为空', trigger: 'change' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'blur' }],
  materialConfigId: [{ required: true, message: '物料编号不能为空', trigger: 'change' }],
  chooseStockId: [{ required: true, message: '物料条码不能为空', trigger: 'change' }],
  quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const warehouseList = ref<any[]>([]) // 仓库列表
const materialTypeTree = ref<any[]>([]) // 树形结构
const materialStockList = ref<any[]>([])

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
      formData.value = await MoveWarehouseDetailApi.getMoveWarehouseDetail(id)
    } finally {
      formLoading.value = false
    }
  }
  materialStockList.value = await MaterialStockApi.getMaterialStockList()
  //加载仓库列表
  warehouseList.value = await WarehouseApi.getWarehouseList()
  await getMaterialConfigTree();
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
    const data = formData.value as unknown as MoveWarehouseDetailVO
    if (formType.value === 'create') {
      await MoveWarehouseDetailApi.createMoveWarehouseDetail(data)
      message.success(t('common.createSuccess'))
    } else {
      await MoveWarehouseDetailApi.updateMoveWarehouseDetail(data)
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
    orderNumber: undefined, 
    moveType: 1,
    moveState: 1,
    startWarehouseId: undefined,
    targetWarehouseId: undefined,
    batchNumber: undefined,
    materialConfigId: undefined,
    materialStockId: undefined,
    chooseStockId: undefined,
    quantity: 1,
  }
  formRef.value?.resetFields()
}
/** 获得物料类型树 */
const getMaterialConfigTree = async () => {
  const data = await MaterialConfigApi.getMaterialConfigList()
  materialTypeTree.value = handleTree(data, 'id', 'materialParentId')
}
</script>
