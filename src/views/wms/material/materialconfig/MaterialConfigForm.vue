<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      v-loading="formLoading"
    >

    <!-- <el-row>
      <el-col :span="12">
      <el-form-item label="物料编号" prop="materialNumber">
        <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" />
      </el-form-item>
      </el-col>
      <el-col :span="12">
      <el-form-item label="物料类码" prop="materialCode">
        <el-input v-model="formData.materialCode" placeholder="请输入物料类码" />
      </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item label="物料名称" prop="materialName">
        <el-input v-model="formData.materialName" placeholder="请输入物料名称" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="物料属性" prop="materialProperty">
        <el-select v-model="formData.materialProperty" placeholder="请选择物料属性">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item label="物料类型" prop="materialType">
        <el-select v-model="formData.materialType" placeholder="请选择物料类型（零件、托盘、工装、夹具、刀具）">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item v-if="formData.materialType === 2" label="托盘类型" prop="containerType">
        <el-select v-model="formData.containerType" placeholder="请选择托盘类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CONTAINER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item label="物料规格" prop="materialSpecification">
        <el-input v-model="formData.materialSpecification" placeholder="请输入物料规格" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="物料品牌" prop="materialBrand">
        <el-input v-model="formData.materialBrand" placeholder="请输入物料品牌" />
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item label="物料单位" prop="materialUnit">
        <el-select v-model="formData.materialUnit" placeholder="请选择物料单位">
          <el-option
            v-for="unit in unitList"
            :key="unit.id"
            :label="unit.unit"
            :value="unit.unit"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">

      <el-form-item label="出库规则" prop="materialOutRule">
        <el-select v-model="formData.materialOutRule" placeholder="请输入出库规则">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_OUTBOUNDRULES)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="12">
      <!-- <el-form-item label="是否质检" prop="materialQualityCheck">
        <el-select v-model="formData.materialQualityCheck" placeholder="请输入是否质检">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.INFRA_BOOLEAN_TINYINT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="存放指定容器" prop="containerConfigIds">
        <el-select v-model="formData.containerConfigIds" clearable filterable multiple placeholder="请选择容器">
          <el-option
            v-for="materialConfig in materialConfigList"
            :key="materialConfig.id"
            :label="materialConfig.materialNumber"
            :value="materialConfig.id"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="默认存放仓库" prop="defaultWarehouseId">
        <el-select v-model="formData.defaultWarehouseId" placeholder="请选择默认存放仓库">
          <el-option
            v-for="warehouse in warehouseList"
            :key="warehouse.id"
            :label="warehouse.warehouseCode + ' - ' + warehouse.warehouseName"
            :value="warehouse.id+''"
          />
        </el-select>
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <!-- <el-col :span="12">
      <el-form-item label="父物料类型" prop="materialParentId">
        <el-tree-select
          clearable
          filterable
          v-model="formData.materialParentId"
          :data="materialTypeTree"
          :props="{...defaultProps, label: (data, node)=> { return data.materialNumber } } "
          check-strictly
          default-expand-all
          placeholder="请选择父物料类型"
        />
      </el-form-item>
    </el-col> -->
    <el-col :span="12">
      <el-form-item label="出库规则" prop="materialOutRule">
        <el-select v-model="formData.materialOutRule" placeholder="请输入出库规则">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_OUTBOUNDRULES)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <!-- <el-col :span="12">
      <el-form-item label="物料管理模式" prop="materialManage">
        <el-switch  v-model="formData.materialManage" :active-value="1" :inactive-value="2" active-text="单件" inactive-text="批量"  inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" /> -->
        <!-- <el-select v-model="formData.materialManage" placeholder="请输入物料管理模式">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select> -->
      <!-- </el-form-item>
    </el-col> -->
    <el-col :span="12">
      <el-form-item v-if="formData.materialType === 'TP'" label="托盘类型" prop="containerType">
        <el-select v-model="formData.containerType" placeholder="请选择托盘类型">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CONTAINER_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.materialManage === 2" label="预警库存" prop="warningStock">
        <el-input-number v-model="formData.warningStock" :min="0" placeholder="请输入预警库存" />
      </el-form-item>
    </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="12">
      <el-form-item v-if="formData.materialManage === 1" label="是否为容器" prop="materialContainer">
        <el-switch  v-model="formData.materialContainer" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item v-if="formData.materialManage === 1 &&formData.materialContainer === 1" label="是否单储位" prop="materialStorage">
        <el-switch  v-model="formData.materialStorage" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />

      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item v-if="formData.materialStorage === 0" label="层" prop="materialLayer">
        <el-input v-model="formData.materialLayer" placeholder="请输入层" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item v-if="formData.materialStorage === 0" label="排" prop="materialRow">
        <el-input v-model="formData.materialRow" placeholder="请输入排" />
      </el-form-item>
    </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
      <el-form-item v-if="formData.materialStorage === 0" label="列" prop="materialCol">
        <el-input v-model="formData.materialCol" placeholder="请输入列" />
      </el-form-item>
    </el-col>
    </el-row> -->
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { MaterialConfigApi, MaterialConfigVO } from '@/api/wms/materialconfig'
import { defaultProps, handleTree } from '@/utils/tree'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {UnitApi} from "@/api/wms/unit";
import { WarehouseApi } from '@/api/wms/warehouse';

/** 物料类型 表单 */
defineOptions({ name: 'MaterialConfigForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialNumber: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialProperty: undefined,
  materialType: undefined,
  containerType: undefined,
  materialSpecification: undefined,
  materialBrand: undefined,
  materialUnit: undefined,
  materialManage: 1,
  materialOutRule: undefined,
  warningStock: 0,
  materialStorage: 1,
  materialContainer: 0,
  materialQualityCheck: undefined,
  containerConfigIds: undefined,
  materialLayer: undefined,
  materialRow: undefined,
  materialCol: undefined,
  defaultWarehouseId: undefined,
  materialParentId: undefined,
})
const formRules = reactive({
  materialNumber: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  materialCode: [{ required: true, message: '物料类码不能为空', trigger: 'blur' }],
  materialName: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
  materialProperty: [{ required: true, message: '物料属性（成品、毛坯、辅助材料）不能为空', trigger: 'blur' }],
  materialType: [{ required: true, message: '物料类型（零件、托盘、工装、夹具、刀具）不能为空', trigger: 'change' }],
  containerType: [{ required: true, message: '托盘类型不能为空', trigger: 'change' }],
  materialUnit: [{ required: true, message: '物料单位不能为空', trigger: 'blur' }],
  materialManage: [{ required: true, message: '物料管理模式不能为空', trigger: 'blur' }],
  // materialOutRule: [{ required: true, message: '出库规则不能为空', trigger: 'blur' }],
  materialContainer: [{ required: true, message: '是否为容器不能为空', trigger: 'blur' }],
  materialQualityCheck: [{ required: true, message: '是否质检不能为空', trigger: 'blur' }],
  defaultWarehouseId: [{ required: true, message: '默认存放仓库不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const materialTypeTree = ref() // 树形结构
const warehouseList = ref<any[]>([]) // 仓库列表
const unitList = ref<any[]>([]) // 物料单位列表
const materialConfigList =ref<any[]>([])  //物料类型

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
      formData.value = await MaterialConfigApi.getMaterialConfig(id)
    } finally {
      formLoading.value = false
    }
  }
  await getMaterialConfigTree();
   //加载仓库列表
  warehouseList.value = await WarehouseApi.getWarehouseList()
  unitList.value = await UnitApi.getUnitList();
  // 获取物料类型列表
  materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
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
    const data = formData.value as unknown as MaterialConfigVO
    if (formType.value === 'create') {
      await MaterialConfigApi.createMaterialConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await MaterialConfigApi.updateMaterialConfig(data)
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
    materialNumber: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialProperty: undefined,
    materialType: undefined,
    containerType: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    materialManage: 1,
    materialOutRule: undefined,
    materialStorage: 1,
    materialContainer: 0,
    warningStock: 0,
    materialQualityCheck: undefined,
    containerConfigIds: undefined,
    materialLayer: undefined,
    materialRow: undefined,
    materialCol: undefined,
    defaultWarehouseId: undefined,
    materialParentId: undefined,
  }
  formRef.value?.resetFields()
}

/** 获得物料类型树 */
const getMaterialConfigTree = async () => {
  materialTypeTree.value = []
  const data = await MaterialConfigApi.getMaterialConfigList();
/*  const root: Tree = {  children: [] }
  debugger
  root.children = handleTree(data, 'id', 'materialParentId')
  materialTypeTree.value.push(root)*/
  materialTypeTree.value= handleTree(data, 'id', 'materialParentId');
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
  bottom: 20%;
}
</style>
