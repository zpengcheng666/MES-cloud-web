<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200">
    <el-form
      ref="formRef"
      class="tool-config-form"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料名称" prop="toolName">
            <el-input v-model="formData.toolName" placeholder="请输入物料名称" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料编号" prop="materialNumber">
            <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料类别" prop="materialConfigName">
            <el-input v-model="formData.materialTypeName" placeholder="请输入物料类别" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料类码" prop="toolCode">
            <el-input v-model="formData.materialTypeCode" placeholder="请输入物料类码" disabled />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="型号" prop="toolModel">
            <el-input v-model="formData.toolModel" placeholder="请输入型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重量" prop="toolWeight">
            <el-input-number v-model="formData.toolWeight" placeholder="请输入重量" controls-position="right" :min="0" :precision="2" class="!w-1/1" style="text-align: center;" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="材质" prop="toolTexture">
            <el-input v-model="formData.toolTexture" placeholder="请输入材质" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涂层" prop="toolCoating">
            <el-input v-model="formData.toolCoating" placeholder="请输入涂层" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.materialTypeCode=='CP'">
        <el-col :span="12">
          <el-form-item label="总长上限(mm)" prop="lengthUpper">
            <el-input-number v-model="formData.lengthUpper" placeholder="请输入总长上限" controls-position="right" :min="0" :precision="4" class="!w-1/1" style="text-align: center;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="总长下限(mm)" prop="lengthFloor">
            <el-input-number v-model="formData.lengthFloor" placeholder="请输入总长下限" controls-position="right" :min="0" :precision="4" class="!w-1/1" style="text-align: center;" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.materialTypeCode=='CP'">
        <el-col :span="12">
          <el-form-item label="玄长上限(mm)" prop="hangingLengthUpper">
            <el-input-number v-model="formData.hangingLengthUpper" placeholder="请输入玄长上限" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="玄长下限(mm)" prop="hangingLengthFloor">
            <el-input-number v-model="formData.hangingLengthFloor" placeholder="请输入玄长下限" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.materialTypeCode=='CP'">
        <el-col :span="12">
          <el-form-item label="刃径上偏差(mm)" prop="bladeUpperDeviation">
            <el-input-number v-model="formData.bladeUpperDeviation" placeholder="请输入刃径上偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刃径下偏差(mm)" prop="bladeFloorDeviation">
            <el-input-number v-model="formData.bladeFloorDeviation" placeholder="请输入刃径下偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="formData.materialTypeCode=='CP'">
        <el-col :span="12">
          <el-form-item label="底R上偏差(mm)" prop="rUpperDeviation">
            <el-input-number v-model="formData.rUpperDeviation" placeholder="请输入底R上偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="底R下偏差(mm)" prop="rFloorDeviation">
            <el-input-number v-model="formData.rFloorDeviation" placeholder="请输入底R下偏差" controls-position="right" :min="0" :precision="4" class="!w-1/1" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12" v-if="formData.materialTypeCode!='CP'">
          <el-form-item label="额定寿命" prop="ratedLife">
            <el-input-number v-model="formData.ratedLife" placeholder="请输入额定寿命" controls-position="right" :min="0" :precision="0" class="!w-1/1" style="text-align: center;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最高转速(mm)" prop="maxSpeed">
            <el-input-number v-model="formData.maxSpeed" placeholder="请输入最高转速" controls-position="right" :min="0" :precision="0" class="!w-1/1" style="text-align: center;" />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row v-if="formData.materialTypeCode!='CP'">
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>几何参数</span>
              </div>
            </template>
            <el-table :data="formData.geoParamList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center" />
              <el-table-column prop="abbr" label="缩写" align="center" />
              <el-table-column prop="value" label="值" align="center">
                <template #default="scope">
                  <el-input placeholder="请输入" v-model="formData.geoParamList[scope.$index].value" :maxLength="64" />
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <el-row v-if="formData.materialTypeCode!='CP'" style="margin-top: 15px;">
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>切削参数</span>
              </div>
            </template>
            <el-table :data="formData.cutParamList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center" />
              <el-table-column prop="abbr" label="缩写" align="center" />
              <el-table-column prop="value" label="值" align="center">
                <template #default="scope">
                  <el-input placeholder="请输入" v-model="formData.cutParamList[scope.$index].value" :maxLength="64" />
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" align="center" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <!-- 适配关系 -->
      <el-row v-if="formData.materialTypeCode!='CP'" style="margin-top: 15px;">
        <el-col>
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span v-if="formData.materialTypeCode == 'DB' || formData.materialTypeCode == 'PJ'">适配刀具</span>
                <span v-if="formData.materialTypeCode == 'DT' || formData.materialTypeCode == 'DP'">适配刀柄/配件</span>
              </div>
            </template>
            <div style="margin-bottom: 10px" v-if="formType !== 'detail'">
              <el-button v-if="formData.materialTypeCode == 'DB'" type="primary" @click="openFitToolTypeDialog(1)">选择</el-button>
              <el-button v-if="formData.materialTypeCode == 'DT' || formData.materialTypeCode == 'DP'" type="primary" @click="openFitToolTypeDialog(2)">选择</el-button>
              <el-button v-if="formData.materialTypeCode == 'PJ'" type="primary" @click="openFitToolTypeDialog(3)">选择</el-button>
            </div>
            <el-table :data="formData.fitConfigList" border style="width: 100%; text-align: center">
              <el-table-column prop="toolName" label="名称" align="center" />
              <el-table-column prop="materialTypeCode" label="类码" align="center" />
              <el-table-column prop="toolModel" label="规格" align="center" />
              <el-table-column label="操作" align="center" v-if="formType !== 'detail'">
                <template #default="scope">
                  <el-button type="danger" size="small" @click="handleDelete(3, scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <ToolTypeDialog ref="toolTypeForm" @success="selectToolInfo" />
</template>

<script setup lang="ts">
import { ToolConfigApi, ToolConfigVO } from '@/api/tms/toolconfig'
import { ToolParamTemplateApi, ToolParamTemplateVO } from '@/api/tms/toolparamtemplate'
import ToolTypeDialog from './ToolTypeDialog.vue'

/** 刀具类型 表单 */
defineOptions({ name: 'ToolConfigForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  materialConfigId: undefined,
  materialNumber: undefined,
  materialTypeName: undefined,
  materialTypeCode: undefined,
  toolName: undefined,
  toolModel: undefined,
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
  status: undefined,
  // 几何参数
  geoParamList: [],
  // 切削参数
  cutParamList: [],
  // 参数模板集合
  templateParamList: [],
  // 适配集合
  fitConfigList: [],
  detailList: []
})

const formRules = reactive({
})
const formRef = ref() // 表单 Ref

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
      formData.value = await ToolConfigApi.getToolConfig(id)
      // 未配置过参数
      if(formData.value.templateParamList.length == 0){
        // 物料类别获取参数模板
        formData.value.templateParamList = await ToolParamTemplateApi.getToolParamTemplateByMaterialTypeId(formData.value.materialTypeId)
      }

      if (formData.value.templateParamList !== null && formData.value.templateParamList.length > 0) {
        formData.value.templateParamList.map((item) => {
          if (item.type === 1) {
            formData.value.geoParamList.push(item)
          }
          if (item.type === 2) {
            formData.value.cutParamList.push(item)
          }
        })
      }
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
    const data = formData.value as unknown as ToolConfigVO
    if (formType.value === 'create') {
      await ToolConfigApi.createToolConfig(data)
      message.success(t('common.createSuccess'))
    } else {
      await ToolConfigApi.updateToolConfig(data)
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
    materialNumber: undefined,
    materialTypeName: undefined,
    materialTypeCode: undefined,
    toolName: undefined,
    toolModel: undefined,
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
    status: undefined,
    // 几何参数
    geoParamList: [],
    // 切削参数
    cutParamList: [],
    // 参数模板集合
    templateParamList: [],
    // 适配集合
    fitConfigList: [],
    detailList: []
  }
  formRef.value?.resetFields()
}

// 刀具信息组件
const toolTypeForm = ref()
const openFitToolTypeDialog = (type: any) => {
  toolTypeForm.value.open(type)
}

// 选中的刀具信息
const selectToolInfo = (json: any) => {
  changeData(json.selection, json.type)
}

const changeData = (arr, type) => {
  return arr.map((item) => {
    const { id, toolName, materialTypeCode, toolModel } = item
    const obj = formData.value.fitConfigList.find((c) => c.fitToolConfigId === id)
    if (obj === undefined)
      formData.value.fitConfigList.push({
        id: item.id,
        fitToolConfigId: item.id,
        toolName,
        materialTypeCode,
        toolModel
      })
  })
}

// 删除选中数据
const handleDelete = async (type: number, index: number) => {
  await message.confirm(`确定删除此条数据吗？`)
  formData.value.fitConfigList.splice(index, 1)

}


</script>

<style>
.tool-config-form .el-input-number .el-input__inner{
  text-align: left;
}
</style>
