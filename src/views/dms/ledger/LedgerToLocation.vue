<template>
  <Dialog title="台账/位置对应" v-model="dialogVisible" align-center width="80vw">
    <el-form
      class="-mb-15px"
      :model="addForm"
      :rules="formRules"
      ref="addFormRef"
      :inline="true"
      label-width="70px"
      style="margin-bottom: 8px"
    >
      <el-form-item label="仓库" prop="warehouse">
        <el-select-v2
          v-model="addForm.warehouse"
          :options="warehouseList"
          placeholder="选择仓库"
          class="!w-270px"
          filterable
          clearable
          @change="handleWarehouseChange"
        />
      </el-form-item>
      <el-form-item label="库位" prop="location">
        <el-select-v2
          v-model="addForm.location"
          :options="locationList"
          placeholder="选择库位"
          class="!w-500px"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select-v2
          v-model="addForm.type"
          :options="[
            { value: 0, label: '物料库位' },
            { value: 1, label: '刀具库位' }
          ]"
          placeholder="选择类型"
          class="!w-120px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="handleCreate">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="listData" style="width: 100%" height="500px">
      <el-table-column prop="type" label="类型" align="center">
        <template #default="scope">
          {{ scope.row.type == 0 ? '物料库位' : '刀具库位' }}
        </template>
      </el-table-column>
      <el-table-column prop="locationData.locationCode" label="库位编码" align="center" />
      <el-table-column prop="locationData.locationName" label="库位名称" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="handleDelete(scope.row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
</template>

<script setup lang="ts">
/*********************************************全局*************************************/

import { LedgerApi } from '@/api/dms/ledger' //台账
import { WarehouseLocationApi } from '@/api/wms/warehouselocation' //库位

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

defineOptions({ name: 'LedgerToLocation' })
const props = defineProps(['userList'])

/**********************************************开启弹窗与初始化*****************************/

const dialogVisible = ref(false) // 弹窗是否展示
const ledgerId = ref() //台账ID

/** 打开弹窗 */
const open = async (id) => {
  if (id == undefined || id == null) return
  dialogVisible.value = true
  ledgerId.value = id

  resetForm()
  await getList()
}
defineExpose({ open })

const listData: any = ref([]) //列表数据

async function getList() {
  await getWarehouseList()
  listData.value = await LedgerApi.getLedgerToLocationList(ledgerId.value)
  listData.value = await Promise.all(
    listData.value.map(async (v) => {
      return {
        ...v,
        locationData: await WarehouseLocationApi.getWarehouseLocation(v.location)
      }
    })
  )
}

/*******************************************级联表单(添加表单)*******************************/

const addForm = ref({
  warehouse: undefined, //仓库选择
  location: undefined, //库位选择
  type: undefined //类型选择
}) //表单数据

const addFormRef = ref() //表单Ref
const formRules = reactive({
  warehouse: [{ required: true, message: '仓库不能为空', trigger: 'blur' }],
  location: [{ required: true, message: '库位不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
})
//校验规则

const locationList = ref([]) //库位列表,选择仓库时改变

//仓库选择改变
async function handleWarehouseChange(id) {
  locationList.value = (await WarehouseLocationApi.getLocationListByWarehouseId(id)).map((v) => {
    return { value: v.id, label: v.locationName }
  })
  addForm.value.location = undefined
}

//重置表单相关
function resetForm() {
  addForm.value = {
    warehouse: undefined, //仓库选择
    location: undefined, //库位选择
    type: undefined //类型选择
  }
  locationList.value = []
}

//新增操作
async function handleCreate() {
  await addFormRef.value.validate() //校验表单

  if (listData.value.some((v) => v.location == addForm.value.location)) {
    message.error('数据已存在')
    resetForm()
    return
  }
  //校验是否已存在

  await LedgerApi.createLedgerToLocation([
    {
      ledger: ledgerId.value,
      location: addForm.value.location,
      type: addForm.value.type
    }
  ])
  resetForm()
  await getList()
}

/*******************************************删除操作************************************/

async function handleDelete(id) {
  await LedgerApi.deleteLedgerToLocation(id)
  await getList()
}

/*************************************************仓库列表*********************************/
import { WarehouseApi } from '@/api/wms/warehouse'
const warehouseList = ref<any[]>([])
const getWarehouseList = async () => {
  const data = await WarehouseApi.getWarehouseList()
  warehouseList.value = []
  for (let v of data) {
    warehouseList.value.push({
      value: v.id,
      label: v.warehouseName + ' - ' + v.warehouseCode,
      key: v.id,
      ...v
    })
  }
}
</script>
<style scoped></style>
