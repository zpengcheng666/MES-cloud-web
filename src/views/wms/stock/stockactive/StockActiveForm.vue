<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-tree-select
          disabled
          filterable
          v-model="formData.materialConfigId"
          :data="materialTypeTree"
          :props="{...defaultProps, label: 'materialNumber'}"
          check-strictly
          default-expand-all
          placeholder="请选择物料编号"
        />
      </el-form-item>
      <el-form-item label="物料条码" prop="barCode">
        <el-input v-model="formData.barCode" disabled placeholder="请输入物料条码" />
      </el-form-item>
      <el-form-item label="物料批次号" prop="batchNumber">
        <el-input v-model="formData.batchNumber" disabled placeholder="请输入物料批次号" />
      </el-form-item>
      <el-form-item v-if="formType === 'off'" label="下架库位" prop="locationId">
        <el-select v-model="formData.locationId" placeholder="请选择下架库位" clearable filterable>
          <el-option
            v-for="warehouseLocation in warehouseLocationList"
            :key="warehouseLocation.id"
            :label="warehouseLocation.locationCode"
            :value="warehouseLocation.id+''"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formType === 'on'" label="上架库位" prop="locationId">
        <el-select v-model="formData.locationId" placeholder="请选择上架库位" clearable filterable>
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
import { MaterialStockApi, MaterialStockVO } from '@/api/wms/materialstock'
import {defaultProps, handleTree} from "@/utils/tree";
import {MaterialConfigApi} from "@/api/wms/materialconfig";
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import {MaterialStorageApi} from "@/api/wms/materialstorage";
import { StockActiveApi } from '@/api/wms/stockactive';

/** 物料库存 表单 */
defineOptions({ name: 'StockActiveForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialConfigId: undefined,
  barCode: undefined,
  batchNumber: undefined,
  materialId: undefined,
  storageId: undefined,
  locationId: undefined,
  bindType: undefined,
  totality: 111,
  locked: undefined,
  available: undefined,
  byOccupancyRatio: undefined,
  occupancyRatio: undefined,
})
const formRules = reactive({
  materialTypeId: [{ required: true, message: '物料编码不能为空', trigger: 'change' }],
  barCode: [{ required: true, message: '物料条码不能为空', trigger: 'blur' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'blur' }],
  bindType: [{ required: true, message: '绑定类型不能为空', trigger: 'change' }],
  totality: [{ required: true, message: '总库存不能为空', trigger: 'blur' }],
  locked: [{ required: true, message: '锁定库存不能为空', trigger: 'blur' }],
  locationId: [{ required: true, message: '绑定库位不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
// const materialTypeList =ref() //物料类型
const warehouseLocationList =ref() //库位
const materialStorageList =ref() //储位
const materialStockList =ref() //物料
const materialTypeTree = ref<any[]>([]) // 树形结构

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  if('on' === type){
    dialogTitle.value = '上架'
  }
  if('off' === type){
    dialogTitle.value = '下架'
  }
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await MaterialStockApi.getMaterialStock(id)
      // 初始化置空
      formData.value.locationId = ''
    } finally {
      formLoading.value = false
    }
  }
  await getMaterialConfigTree();
  // warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList();
  materialStockList.value = await MaterialStockApi.getMaterialStockList()

  warehouseLocationList.value =await WarehouseLocationApi.getWarehouseLocationList()
  materialStorageList.value = await MaterialStorageApi.getMaterialStorageList()
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
    const data = formData.value as unknown as MaterialStockVO

    if (formType.value === 'off') {
      await StockActiveApi.stockOffShelf(data.id,data.locationId)
    }
    if (formType.value === 'on') {
      await StockActiveApi.stockOnShelf(data.id,data.locationId)
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
    materialTypeId: undefined,
    barCode: undefined,
    batchNumber: undefined,
    materialId: undefined,
    storageId: undefined,
    locationId: undefined,
    bindType: 1,
    totality: 1,
    locked: 0,
    available: undefined,
    byOccupancyRatio: undefined,
    occupancyRatio: undefined,
  }
  formRef.value?.resetFields()
}

/** 获得物料类型树 */
const getMaterialConfigTree = async () => {
  const data = await MaterialConfigApi.getMaterialConfigList()
  materialTypeTree.value = handleTree(data, 'id', 'materialParentId')
}
</script>
