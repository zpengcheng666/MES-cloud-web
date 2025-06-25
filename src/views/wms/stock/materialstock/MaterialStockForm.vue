<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <!-- <div class="elfromLeft"> -->
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
          </el-form-item>
          <el-form-item label="物料条码" prop="barCode">
            <el-input v-model="formData.barCode" :disabled="!!formData.id" placeholder="请输入物料条码" />
          </el-form-item>
          <!-- <el-form-item label="物料批次号" prop="batchNumber">
            <el-input v-model="formData.batchNumber" placeholder="请输入物料批次号" />
          </el-form-item> -->
          <!-- <el-form-item label="绑定物料" prop="materialId">
            <el-select v-model="formData.materialId" placeholder="请选择绑定物料" clearable filterable>
              <el-option
                v-for="l in materialStockList"
                :key="l.id"
                :label="l.barCode"
                :value="l.id+''"
              />
            </el-select>
          </el-form-item> -->


      <!-- </div> -->
<!--      <el-form-item label="绑定类型" prop="bindType">
        <el-select  v-model="formData.bindType" placeholder="请选择绑定类型" clearable>
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_BIND_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>-->
      <!-- <div class="elfromRight"> -->
          <el-form-item label="总库存" prop="totality">
            <el-input v-model="formData.totality" placeholder="请输入总库存" />
          </el-form-item>
          <!-- <el-form-item label="锁定库存" prop="locked">
            <el-input v-model="formData.locked" placeholder="请输入锁定库存" />
          </el-form-item> -->
    <!--      <el-form-item label="可用库存" prop="available">
            <el-input v-model="formData.available" placeholder="请输入可用库存" />
          </el-form-item>-->
    <!--      <el-form-item label="容器满载比例" prop="byOccupancyRatio">
            <el-input v-model="formData.byOccupancyRatio" placeholder="请输入容器满载比例" />
          </el-form-item>-->
          <!-- <el-form-item label="占用比例" prop="occupancyRatio">
            <el-input v-model="formData.occupancyRatio" placeholder="请输入占用比例" />
          </el-form-item> -->

          <el-form-item label="选择位置" prop="locationId">
            <el-tree-select v-model="position.name" @click="openLocationDialog" clearable placeholder="请选择位置" />
          </el-form-item>
          <!-- <el-form-item label="绑定库位" prop="locationId">
            <el-select v-model="formData.locationId" placeholder="请选择绑定库位"  clearable filterable>
              <el-option
                v-for="warehouseLocation in warehouseLocationList"
                :key="warehouseLocation.id"
                :label="warehouseLocation.locationCode"
                :value="warehouseLocation.id+''"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="绑定储位" prop="storageId">
            <el-select v-model="formData.storageId"  placeholder="请选择绑定储位" clearable filterable >
              <el-option
                v-for="storage in materialStorageList"
                :key="storage.id"
                :label="storage.storageCode"
                :value="storage.id+''"
              />
            </el-select>
          </el-form-item> -->
      <!-- </div> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <SelectLocationDialog ref="selectLocationDialog" @selectPositionNode="selectPositionNode" />
</template>
<script setup lang="ts">
import { MaterialStockApi, MaterialStockVO } from '@/api/wms/materialstock'
import {defaultProps, handleTree} from "@/utils/tree";
import {MaterialConfigApi} from "@/api/wms/materialconfig";
import SelectLocationDialog from "@/views/wms/dialog/SelectLocationDialog.vue";
import { WarehouseLocationApi } from '@/api/wms/warehouselocation'
import { MaterialStorageApi } from '@/api/wms/materialstorage'


/** 物料库存 表单 */
defineOptions({ name: 'MaterialStockForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

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
  totality: 1,
  locked: undefined,
  available: undefined,
  byOccupancyRatio: undefined,
  occupancyRatio: undefined,
})
const formRules = reactive({
  materialConfigId: [{ required: true, message: '物料编码不能为空', trigger: 'change' }],
  batchNumber: [{ required: true, message: '物料批次号不能为空', trigger: 'blur' }],
  bindType: [{ required: true, message: '绑定类型不能为空', trigger: 'change' }],
  totality: [{ required: true, message: '总库存不能为空', trigger: 'blur' }],
  locked: [{ required: true, message: '锁定库存不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
// const materialTypeList =ref() //物料类型
// const warehouseLocationList = inject('warehouseLocationList')  //库位
// const materialStorageList = inject('materialStorageList') //储位
const materialTypeTree = ref<any[]>([]) // 树形结构
const position = reactive({
  id: undefined,
  type: undefined,// 2 储位 3 库位
  name: undefined,
})

const selectPositionNode = (node: any) => {
  const { id, type } = node
  getPostion(id,type)
}

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
      formData.value = await MaterialStockApi.getMaterialStock(id)
      const locationId =formData.value.locationId
      const storageId =formData.value.storageId
      if(locationId){
        await getPostion(locationId,3)
      }else if(storageId){
        await getPostion(storageId,2)
      }

    } finally {
      formLoading.value = false
    }
  }
  await getMaterialConfigTree();
  // warehouseAreaList.value = await WarehouseAreaApi.getWarehouseAreaList();
  // materialStockList.value = await MaterialStockApi.getMaterialStockList()
}

const getPostion = async(id: number,type: number) => {
  if(type == 3){
    const data = await WarehouseLocationApi.getWarehouseLocation(id)
    if(!data){message.error('请选择根节点！！！'); return}
    position.id = id
    position.type = 3
    position.name = data.locationName
  }else if(type == 2){
    const data = await MaterialStorageApi.getMaterialStorage(id)
    if(!data){message.error('请选择根节点！！！'); return}
    position.id = id
    position.type = 2
    position.name = data.storageName
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const selectLocationDialog = ref()
const openLocationDialog = () => {
  selectLocationDialog.value.open()
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as MaterialStockVO
    if(!position.name){
      data.locationId = ''
      data.storageId = ''
    }else if(position.type == 3){
      data.locationId = position.id;
       data.storageId = ''
    }else if(position.type == 2){
      data.storageId = position.id;
      data.locationId = ''
    }

    // let storageId = data.storageId;
    // let locationId = data.locationId;

    // if(!isBlank(materialId)){
    //   flag++;
    // }
    // if(!isBlank(storageId)){
    //   flag++;
    // }
    // if(!isBlank(locationId )){
    //   flag++;
    // }
    // if(flag != 1){
    //   message.error(t('物料绑定位置必须有且只有一项'))
    //   return;
    // }

    if(data.totality < data.locked){
      message.error(t('总库存不能小于锁定库存'))
      return;
    }

    if (formType.value === 'create') {
      await MaterialStockApi.createMaterialStock(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaterialStockApi.updateMaterialStock(data)
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
    materialConfigId: undefined,
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
<style  lang="scss" >
.elfromLeft{
  width: 45%;
}
.elfromRight{
  width: 45%;
  position: absolute;
  top: 5em;
  right: 6%;
}
</style>
