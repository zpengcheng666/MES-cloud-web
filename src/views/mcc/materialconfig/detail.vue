<template>
  <el-tabs>
    <el-tab-pane label="物料配置详情">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading" v-if="formData.materialType!='DJ'">
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料编号" prop="materialNumber">
              <el-input disabled v-model="formData.materialNumber" placeholder="请输入物料编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料类码" prop="materialCode">
              <el-input disabled v-model="formData.materialCode" placeholder="请输入物料类码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料名称" prop="materialName">
              <el-input disabled v-model="formData.materialName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料属性" prop="materialProperty">
              <el-select disabled v-model="formData.materialProperty" placeholder="请选择物料属性">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_PROPERTIES)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料类型" prop="materialType">
              <el-select disabled v-model="formData.materialType" placeholder="请选择物料类型（零件、托盘、工装、夹具、刀具）">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料单位" prop="materialUnit">
              <el-select disabled v-model="formData.materialUnit" placeholder="请选择物料单位">
                <el-option v-for="unit in unitList" :key="unit.id" :label="unit.unit" :value="unit.unit" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料规格" prop="materialSpecification">
              <el-input disabled v-model="formData.materialSpecification" placeholder="请输入物料规格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料品牌" prop="materialBrand">
              <el-input disabled v-model="formData.materialBrand" placeholder="请输入物料品牌" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="存放指定容器" prop="containerConfigIds">
              <el-select v-model="formData.containerConfigIds" clearable filterable multiple placeholder="请选择容器">
                <el-option v-for="materialConfig in materialConfigList" :key="materialConfig.id"
                  :label="materialConfig.materialNumber" :value="materialConfig.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="默认存放仓库" prop="defaultWarehouseId">
              <el-select v-model="formData.defaultWarehouseId" clearable filterableplaceholder="请选择默认存放仓库">
                <el-option v-for="warehouse in warehouseList" :key="warehouse.id"
                  :label="warehouse.warehouseCode + ' - ' + warehouse.warehouseName" :value="warehouse.id + ''" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="出库规则" prop="materialOutRule">
              <el-select v-model="formData.materialOutRule" placeholder="请输入出库规则">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIAL_TYPE_OUTBOUNDRULES)"
                  :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialType === 'TP'" label="托盘类型" prop="containerType">
              <el-select v-model="formData.containerType" placeholder="请选择托盘类型">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.WMS_CONTAINER_TYPE)" :key="dict.value"
                  :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label-width="120px" v-if="formData.materialManage === 2" label="预警库存" prop="warningStock">
              <el-input-number v-model="formData.warningStock" :min="0" placeholder="请输入预警库存" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialManage === 1" label="是否为容器" prop="materialContainer">
              <el-switch v-model="formData.materialContainer" :active-value="1" :inactive-value="0" active-text="是"
                inactive-text="否" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialManage === 1 && formData.materialContainer === 1" label="是否单储位"
              prop="materialStorage">
              <el-switch v-model="formData.materialStorage" :active-value="1" :inactive-value="0" active-text="是"
                inactive-text="否" inline-prompt style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialStorage === 0" label="层" prop="materialLayer">
              <el-input v-model="formData.materialLayer" placeholder="请输入层" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialStorage === 0" label="排" prop="materialRow">
              <el-input v-model="formData.materialRow" placeholder="请输入排" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" v-if="formData.materialStorage === 0" label="列" prop="materialCol">
              <el-input v-model="formData.materialCol" placeholder="请输入列" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 刀具 -->
      <el-form ref="formRef" class="tool-config-form" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading" v-else >
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料编号" prop="materialNumber">
              <el-input disabled v-model="formData.materialNumber" placeholder="请输入物料编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="物料名称" prop="materialName">
              <el-input disabled v-model="formData.materialName" placeholder="请输入物料名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="型号" prop="toolModel">
              <el-input v-model="formData.toolModel" placeholder="请输入型号" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="重量" prop="toolWeight">
              <el-input-number v-model="formData.toolWeight" placeholder="请输入重量" controls-position="right" :min="0" :precision="2" class="!w-1/1" style="text-align: center;" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="材质" prop="toolTexture">
              <el-input v-model="formData.toolTexture" placeholder="请输入材质" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="涂层" prop="toolCoating">
              <el-input v-model="formData.toolCoating" placeholder="请输入涂层" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.materialCode=='CP'">
          <el-col :span="12">
            <el-form-item label-width="120px" label="总长上限" prop="lengthUpper">
              <el-input-number v-model="formData.lengthUpper" placeholder="请输入总长上限" controls-position="right" :min="0" :precision="4" class="!w-1/1" style="text-align: center;" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="总长下限" prop="lengthFloor">
              <el-input-number v-model="formData.lengthFloor" placeholder="请输入总长下限" controls-position="right" :min="0" :precision="4" class="!w-1/1" style="text-align: center;" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.materialCode=='CP'">
          <el-col :span="12">
            <el-form-item label-width="120px" label="玄长上限" prop="hangingLengthUpper">
              <el-input-number v-model="formData.hangingLengthUpper" placeholder="请输入玄长上限" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="玄长下限" prop="hangingLengthFloor">
              <el-input-number v-model="formData.hangingLengthFloor" placeholder="请输入玄长下限" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="formData.materialCode=='CP'">
          <el-col :span="12">
            <el-form-item label-width="120px" label="刃径上偏差" prop="bladeUpperDeviation">
              <el-input-number v-model="formData.bladeUpperDeviation" placeholder="请输入刃径上偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="刃径下偏差" prop="bladeFloorDeviation">
              <el-input-number v-model="formData.bladeFloorDeviation" placeholder="请输入刃径下偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formData.materialCode=='CP'">
          <el-col :span="12">
            <el-form-item label-width="120px" label="底R上偏差" prop="rUpperDeviation">
              <el-input-number v-model="formData.rUpperDeviation" placeholder="请输入底R上偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="底R下偏差" prop="rFloorDeviation">
              <el-input-number v-model="formData.rFloorDeviation" placeholder="请输入底R下偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" v-if="formData.materialCode!='CP'">
            <el-form-item label-width="120px" label="额定寿命" prop="ratedLife">
              <el-input-number v-model="formData.ratedLife" placeholder="请输入额定寿命" controls-position="right" :min="0" :precision="0" class="!w-1/1" style="text-align: center;" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.materialCode=='CP'">
            <el-form-item label-width="120px" label="最高转速" prop="maxSpeed">
              <el-input-number v-model="formData.maxSpeed" placeholder="请输入最高转速" controls-position="right" :min="0" :precision="0" class="!w-1/1" style="text-align: center;" :disabled="formData.toolId" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>

import { useTagsViewStore } from "@/store/modules/tagsView";
import { MaterialConfigApi, MaterialConfigVO } from '@/api/wms/materialconfig'
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { UnitApi } from "@/api/wms/unit";
import { WarehouseApi } from '@/api/wms/warehouse';
import { defaultProps, handleTree } from '@/utils/tree'
import {ToolConfigApi} from "@/api/tms/toolconfig";

defineOptions({ name: 'BpmMaterialConfigDetail' })
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
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
  warningStock: 0,
  materialOutRule: undefined,
  materialStorage: 1,
  materialContainer: 0,
  materialQualityCheck: undefined,
  containerConfigIds: undefined,
  materialLayer: undefined,
  materialRow: undefined,
  materialCol: undefined,
  defaultWarehouseId: undefined,
  materialParentId: undefined,

  // 刀具
  toolId: undefined,
  toolModel: undefined,
  templeteId: undefined,
  toolWeight: undefined,
  toolTexture: undefined,
  toolCoating: undefined,
  ratedLife: undefined,
  maxSpeed: undefined,
  lengthUpper: undefined,
  lengthFloor: undefined,
  hangingLengthUpper: undefined,
  hangingLengthFloor: undefined,
  bladeUpperDeviation: undefined,
  bladeFloorDeviation: undefined,
  rUpperDeviation: undefined,
  rFloorDeviation: undefined,
  status: undefined
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

  templeteId: [{ required: true, message: '参数模板不能为空', trigger: 'blur' }],
})

const formRef = ref() // 表单 Ref
const materialTypeTree = ref() // 树形结构
const warehouseList = ref<any[]>([]) // 仓库列表
const unitList = ref<any[]>([]) // 物料单位列表
const materialConfigList = ref<any[]>([])  //物料类型



defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
    warningStock: 0,
    materialOutRule: undefined,
    materialStorage: 1,
    materialContainer: 0,
    materialQualityCheck: undefined,
    containerConfigIds: undefined,
    materialLayer: undefined,
    materialRow: undefined,
    materialCol: undefined,
    defaultWarehouseId: undefined,
    materialParentId: undefined,
    // 刀具
    toolId: undefined,
    toolModel: undefined,
    templeteId: undefined,
    toolWeight: undefined,
    toolTexture: undefined,
    toolCoating: undefined,
    ratedLife: undefined,
    maxSpeed: undefined,
    lengthUpper: undefined,
    lengthFloor: undefined,
    hangingLengthUpper: undefined,
    hangingLengthFloor: undefined,
    bladeUpperDeviation: undefined,
    bladeFloorDeviation: undefined,
    rUpperDeviation: undefined,
    rFloorDeviation: undefined,
    status: undefined
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
  materialTypeTree.value = handleTree(data, 'id', 'materialParentId');
}

/** 关闭 */
const { delView } = useTagsViewStore() // 视图操作
const { currentRoute } = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

const route = useRoute()
const props = defineProps<{ id?: number }>()

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，物料类型不能为空！')
    close()
    return
  }

  formData.value = await MaterialConfigApi.getMaterialConfig(id)
  // 非刀具初始化
  if(formData.value.materialType != 'DJ'){
    await getMaterialConfigTree();
    //加载仓库列表
    warehouseList.value = await WarehouseApi.getWarehouseList()
    unitList.value = await UnitApi.getUnitList();
    // 获取物料类型列表
    materialConfigList.value = await MaterialConfigApi.getMaterialConfigList()
  }
  // 刀具
  else {
    const toolData = await ToolConfigApi.getToolConfigByMaterialConfigId(id)
    formData.value = {...formData.value, ...toolData}
    if(toolData){
      formData.value.toolId = id
    }
  }
})

watch(
  () => formData.value,
  async (val) => {
    getCustomVariables(val)
  },
  { deep: true }
)

const aa = ref([]) as any

//定义getCustomVariables 事件，用于作成功后的回调
const emit = defineEmits(['getCustomVariables'])
/**
 * 获取表单自定义参数
 */
const getCustomVariables = async (data) => {
  let dataMap = {};
  dataMap['wmsMaterialConfig'] = data
  emit('getCustomVariables', dataMap)
}
</script>

<style>
.tool-config-form .el-input-number .el-input__inner{
  text-align: left;
}
</style>
