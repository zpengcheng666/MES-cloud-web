<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="指令类型" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.insType`" :rules="formRules.insType" class="mb-0px!">
            <el-select v-model="row.insType" placeholder="请选择指令类型">
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.WMS_TASK_INS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.taskStatus`" :rules="formRules.taskStatus" class="mb-0px!">
            <el-select v-model="row.taskStatus" placeholder="请选择任务状态">
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CARRY_SUB_TASK_STATUS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <!--<el-table-column label="物料id" min-width="150">-->
        <!--<template #default="{ row, $index }">-->
          <!--<el-form-item :prop="`${$index}.materialStockId`" :rules="formRules.materialStockId" class="mb-0px!">-->
            <!--<el-input v-model="row.materialStockId" placeholder="请输入物料id" />-->
          <!--</el-form-item>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="物料id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.materialStockId`" :rules="formRules.materialStockId" class="mb-0px!">
            <el-select
              v-model="row.materialStockId"
              placeholder="请输入物料id"
              clearable
              filterable
            >
              <el-option
                v-for="stock in materialStockContainerList"
                :key="stock.id"
                :label="stock.barCode"
                :value="stock.id + ''"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="库位id" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.locationId`" :rules="formRules.locationId" class="mb-0px!">
            <el-select v-model="row.locationId" placeholder="请输入库位id" clearable filterable>
              <el-option
                v-for="warehouseLocation in warehouseLocationList"
                :key="warehouseLocation.id"
                :label="warehouseLocation.locationCode"
                :value="warehouseLocation.id + ''"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="执行顺序" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.executeOrder`" :rules="formRules.executeOrder" class="mb-0px!">
            <el-input-number v-model="row.executeOrder" placeholder="请输入执行顺序" />
          </el-form-item>
        </template>
      </el-table-column>
       <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加搬运任务子表</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { CarryTaskApi } from '@/api/wms/carrytask'
import { MaterialStockApi } from '@/api/wms/materialstock'
import { WarehouseLocationApi } from '@/api/wms/warehouselocation'

const props = defineProps<{
  parentId: undefined // 搬运任务id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
})
const formRef = ref() // 表单 Ref
const materialStockContainerList = ref() //储位
const warehouseLocationList = ref() //库位

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.parentId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await CarryTaskApi.getCarrySubTaskListByParentId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    insType: undefined,
    taskStatus: undefined,
    materialStockId: undefined,
    locationId: undefined,
    executeOrder: undefined,
    parentId: undefined,
  }
  row.parentId = props.parentId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}
const getMaterialStockContainer = async () => {
  materialStockContainerList.value = await MaterialStockApi.getMaterialStockContainerList()
  warehouseLocationList.value = await WarehouseLocationApi.getWarehouseLocationList()
}

/** 初始化 **/
onMounted(() => {
  getMaterialStockContainer()
})

defineExpose({ validate, getData })
</script>
