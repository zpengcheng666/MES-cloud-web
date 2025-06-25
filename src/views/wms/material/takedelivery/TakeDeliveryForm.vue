<template>
<!--  <Dialog :title="dialogTitle" v-model="dialogVisible">-->
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="到货单号" prop="orderNumber">
        <el-input v-model="formData.orderNumber" placeholder="到货单号由其他服务提供" />
      </el-form-item>
      <el-form-item label="物料编号" prop="materialConfigId">
        <el-tree-select
          clearable
          filterable
          v-model="formData.materialConfigId"
          :data="materialTypeTree"
          :props="{...defaultProps, label: 'materialNumber'}"
          @node-click="nodeClick"
          check-strictly
          default-expand-all
          placeholder="请选择物料编号"
        />
      </el-form-item>
      <el-form-item label="收货数量" v-if="isMaterialManage" prop="tdQuantity">
        <el-input v-model="formData.tdQuantity" placeholder="请输入收货数量" />
      </el-form-item>

      <el-form-item label="绑定库位" prop="locationId">
        <el-select v-model="formData.locationId" placeholder="请选择绑定库位（绑定位置二选一）" clearable filterable>
          <el-option
            v-for="warehouseLocation in warehouseLocationList"
            :key="warehouseLocation.id"
            :label="warehouseLocation.locationCode"
            :value="warehouseLocation.id+''"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定储位" prop="storageId">
        <el-select v-model="formData.storageId"  placeholder="请选择绑定储位（绑定位置二选一）" clearable filterable >
          <el-option
            v-for="storage in materialStorageList"
            :key="storage.id"
            :label="storage.storageCode"
            :value="storage.id+''"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="绑定物料" prop="materialId">
        <el-select v-model="formData.materialId" placeholder="请选择绑定物料（绑定位置二选一）" clearable filterable>
          <el-option
            v-for="l in materialStockList"
            :key="l.id"
            :label="l.barCode"
            :value="l.id+''"
          />
        </el-select>
      </el-form-item>-->
    </el-form>
<!--    <template #footer>-->
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
<!--    </template>-->
<!--  </Dialog>-->
  </ContentWrap>
</template>
<script setup lang="ts">
import { TakeDeliveryApi, TakeDeliveryVO } from '@/api/wms/takedelivery'
import {MaterialConfigApi, MaterialConfigVO} from "@/api/wms/materialconfig";
import {defaultProps, handleTree} from "@/utils/tree";
import {isBlank} from "@/utils/is";
import {MaterialStockApi} from "@/api/wms/materialstock";
import {WarehouseLocationApi} from "@/api/wms/warehouselocation";
import {MaterialStorageApi} from "@/api/wms/materialstorage";

/** 物料收货 表单 */
defineOptions({ name: 'TakeDeliveryForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  orderNumber: undefined,
  materialConfigId: undefined,
  tdQuantity: 1,
  locationId: undefined,
  storageId: undefined,
  materialId: undefined,
})
const formRules = reactive({
  orderNumber: [{ required: true, message: '收货单号不能为空', trigger: 'blur' }],
  materialTypeId: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  tdQuantity: [{ required: true, message: '收货数量不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const materialTypeTree = ref<any[]>([]) // 树形结构
const isMaterialManage = ref(false) // 树形结构
const warehouseLocationList =ref() //库位
const materialStorageList =ref() //储位

// 物料管理模式 单件1 还是 批量2
const nodeClick = (selected: MaterialConfigVO, node: any, event: any) => {
  isMaterialManage.value = selected.materialManage === 2
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
      formData.value = await TakeDeliveryApi.getTakeDelivery(id)
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
    // 提交的二次确认
    await message.confirm("确认提交？")

    const data = formData.value as unknown as TakeDeliveryVO
    let flag = 0;
    // let materialId = data.materialId;
    let storageId = data.storageId;
    let locationId = data.locationId;

    /*if(!isBlank(materialId)){
      flag++;
    }*/
    if(!isBlank(storageId)){
      flag++;
    }
    if(!isBlank(locationId )){
      flag++;
    }
    if(flag != 1){
      message.error(t('物料绑定位置必须有且只有一项'))
      return;
    }
    // if (formType.value === 'create') {
      await TakeDeliveryApi.createTakeDelivery(data)
      resetForm();

      message.success("收货成功")
    /*} else {
      await TakeDeliveryApi.updateTakeDelivery(data)
      message.success(t('common.updateSuccess'))
    }*/
    dialogVisible.value = false
    // 发送操作成功的事件
    // emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    orderNumber: undefined,
    materialTypeId: undefined,
    tdQuantity: 1,
    locationId: undefined,
    storageId: undefined,
    materialId: undefined,
  }
  formRef.value?.resetFields()
}
/** 获得物料类型树 */
const getMaterialConfigTree = async () => {
  const data = await MaterialConfigApi.getMaterialConfigList()
  materialTypeTree.value = handleTree(data, 'id', 'materialParentId')

  // 获得库位、储位、
  warehouseLocationList.value =await WarehouseLocationApi.getWarehouseLocationList()
  materialStorageList.value = await MaterialStorageApi.getMaterialStorageList()
}
/** 初始化 **/
onMounted(() => {
  getMaterialConfigTree();
})
</script>
