<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1000">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="formData.companyName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料名称" prop="materialName">
<!--            <el-input v-model="formData.materialName" placeholder="请输入物料名称"  :disabled="formType == 'detail'" />-->
            <el-select
              v-model="formData.materialName"
              @blur="e=>materialBlur(e)"
              @change="val=>changeMaterial(val)"
              clearable
              filterable
              allow-create
              placeholder="请选择物料"
              :disabled="formType == 'detail'"
            >
              <el-option
                v-for="item in materialList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="初始单价" prop="initPrice">
            <el-input-number
              v-model="formData.initPrice"
              :precision="2"
              :min="0"
              left
              controls-position="right"
              placeholder="请输入初始单价"
              :disabled="formType == 'detail'"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="默认税率" prop="initTax">
            <el-select v-model="formData.initTax" @blur="e=>selectBlur(e, 'initTax')" filterable clearable allow-create placeholder="请选择初始税率" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_PRODUCT_DEFAULT_TAX_RATE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供货周期" prop="leadTime">
            <el-input-number
              v-model="formData.leadTime"
              :precision="0"
              :min="0"
              left
              controls-position="right"
              placeholder="请输入供货周期"
              :disabled="formType == 'detail'"
              style="width:100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否免检" prop="qualityCheck">
            <el-select v-model="formData.qualityCheck" placeholder="请选择是否免检" :disabled="formType == 'detail'" >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.PD_PRODUCT_QUALITY_CHECK)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料编号" prop="materialNumber">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-input v-model="formData.materialNumber" placeholder="请输入物料编号" :disabled="true"/>
              </el-col>
              <el-col :span="8">
                <el-button @click="generatorCode" type="primary" :disabled="formLoading || chooseValue==1">生 码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
          <!--<el-form-item label="物料名称" prop="materialName">-->
            <!--<el-input v-model="formData.materialName" placeholder="请输入物料名称"/>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="主类别" prop="materialParentTypeId">


            <el-select
                    v-model="formData.materialParentTypeId"
                    clearable
                    filterable
                    placeholder="请选择类别"
                    class="!w-1/1"
                    @change="getChooseMaterialType"
            >
              <el-option
                      v-for="item in materialTypeValue"
                      :key="item.id"
                      :label="item.name +'('+item.code+')'"
                      :value="item.id+''"
              />
            </el-select>

            <!--<el-input v-model="formData.materialParentTypeId" placeholder="请输入主类别（工件、托盘、工装、夹具、刀具）"/>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="当前类别" prop="materialTypeId">


            <el-tree-select
                    v-model="formData.materialTypeId"
                    :data="materialTypeTree"
                    :props="defaultProps"
                    check-strictly
                    default-expand-all
                    placeholder="请选择类别"
                    @change="getRow"
            />
            <!--<el-input v-model="formData.materialTypeId" placeholder="请输入当前类别"/>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料规格" prop="materialSpecification">
            <el-input v-model="formData.materialSpecification" placeholder="请输入物料规格"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物料品牌" prop="materialBrand">
            <el-input v-model="formData.materialBrand" placeholder="请输入物料品牌"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
          <el-form-item label="来源物料类型" prop="materialSourceName">
            <el-input v-model="formData.materialSourceName" placeholder="请选择来源物料类型" @click="openChooseForm"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="物料管理模式" prop="materialManage">
            <el-select v-model="formData.materialManage" placeholder="请输入物料管理模式">
              <el-option
                      v-for="dict in getIntDictOptions(DICT_TYPE.WMS_MATERIALTYPE_MATERIALMODE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <MaterialConfigChoose ref="materialConfigChooseRef" @getSource="getSource" />
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading" v-if="formType != 'detail'">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CompanyProductApi, CompanyProductVO } from '@/api/ppm/companyproduct'
import {CompanyApi} from "@/api/ppm/company";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {UnitApi} from "@/api/mcc/unit";
import {MaterialConfigApi, MaterialConfigVO} from '@/api/mcc/materialconfig'
import * as UserApi from "@/api/system/user";
import {MaterialTypeApi, MaterialTypeVO} from '@/api/mcc/materialtype'
import MaterialConfigChoose from '@/views/mcc/materialconfig/components/MaterialConfigChoose.vue'
import {defaultProps, handleTree} from '@/utils/tree'
/** 企业产品表，用于销售和采购 表单 */
defineOptions({ name: 'CompanyProductForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  companyId: '',
  companyName: undefined,
  initPrice: undefined,
  initTax: undefined,
  leadTime: undefined,
  qualityCheck: undefined,
  materialNumber: undefined,
  materialCode: undefined,
  materialId: undefined,
  materialName: undefined,
  materialProperty: undefined,
  materialType: undefined,
  materialSpecification: undefined,
  materialBrand: undefined,
  materialUnit: undefined,
  materialManage: undefined
})
const formRules = reactive({
  companyId: [{ required: true, message: '企业ID不能为空', trigger: 'blur' }],
  initPrice: [{ required: true, message: '初始单价不能为空', trigger: 'blur' }],
  initTax: [{ required: true, message: '默认税率不能为空', trigger: 'blur' }],
  leadTime: [{ required: true, message: '供货周期不能为空', trigger: 'blur' }],
  qualityCheck: [{ required: true, message: '是否免检不能为空', trigger: 'blur' }],
  materialNumber: [{ required: true, message: '物料编号不能为空', trigger: 'blur' }],
  materialCode: [{ required: true, message: '物料类码不能为空', trigger: 'blur' }],
  materialName: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
  materialProperty: [{ required: true, message: '物料属性（成品、毛坯、辅助材料）不能为空', trigger: 'blur' }],
  materialType: [{ required: true, message: '物料类型（零件、托盘、工装、夹具、刀具）不能为空', trigger: 'change' }],
  materialUnit: [{ required: true, message: '物料单位不能为空', trigger: 'change' }],
  materialManage: [{ required: true, message: '管理模式不能为空', trigger: 'change' }],
})

const formRef = ref() // 表单 Ref
const unitList = ref<any[]>([]) // 物料单位列表
const materialTypeValue = ref([]) // 表单 Ref
const materialTypeDataValue = ref([]) // 表单 Ref
const materialTypeTree = ref([]) // 表单 Ref

const  chooseValue = ref(0)
/** 打开弹窗 */
const open = async (type: string, id?: string, companyId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
    getMaterialType()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CompanyProductApi.getCompanyProduct(id)

        chooseValue.value = 1
        getChooseMaterialType(formData.value.materialParentTypeId)
    } finally {
      formLoading.value = false
    }
  }
  if (companyId) {
    formData.value.companyId = companyId
    // 通过companyId查询公司
    const data = await CompanyApi.getCompany(formData.value.companyId)
    formData.value.companyName = data.name
  }

  unitList.value = await UnitApi.getUnitList();
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
    const data = formData.value as unknown as CompanyProductVO
    if (formType.value === 'create') {
      await CompanyProductApi.createCompanyProduct(data)
      message.success(t('common.createSuccess'))
    } else {
      await CompanyProductApi.updateCompanyProduct(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}


const getMaterialType = async () => {
    materialTypeValue.value = [];
    materialTypeDataValue.value = [];
    const data = await MaterialTypeApi.getMaterialTypeList()
    materialTypeDataValue.value = data
    data.forEach((item, index) => {
        if (item.parentId == '0') {
            materialTypeValue.value.push(item)
        }
    })

}


const materialConfigChooseRef= ref();

const openChooseForm = () => {
    materialConfigChooseRef.value.open()
}


const generatorCode=async ()=>{

    if (!formData.value.materialParentTypeId) {
        message.error("请先选择主类别");
        return;
    }

    if (!formData.value.materialTypeId) {
        message.error("请先选择当前类别");
        return;
    }
    formLoading.value = true
    const data = {
        classificationCode:'MT',
        materialMainTypeCode:formData.value.materialParentTypeCode,
        encodingRuleType:1,
        oldBarCode:formData.value.materialNumberSource,
        attributes:{materialTypeCode:formData.value.materialTypeCode}
    }

    try {
        const result = await EncodingRuleApi.createCode(data)
        formData.value.materialNumber = result
        debugger
    } finally {

        formLoading.value = false
    }


}

const getRow = async (id) => {

    const row = materialTypeDataValue.value.find((item) => item.id == id)
    formData.value.materialTypeCode = row.code

}


const getChooseMaterialType = (id) => {
    materialTypeTree.value=[]
    const row = materialTypeDataValue.value.find((item) => item.id == id)
    const root: Tree = { id: '0', name: '总类别', children: [] }
    root.children = handleTree(materialTypeDataValue.value, 'id', 'parentId')

    const s = root.children.find((item) => item.id == id)
    materialTypeTree.value.push(s)

    formData.value.materialParentTypeCode = row.code
}



const getSource = async (rule) => {

    formData.value.materialSourceId = rule.id
    formData.value.materialNumberSource = rule.materialNumber
    formData.value.materialSourceName = rule.materialName +"("+rule.materialNumber+")"

}




/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    companyId: '',
    companyName: undefined,
    initPrice: undefined,
    initTax: undefined,
    leadTime: undefined,
    qualityCheck: undefined,
    materialNumber: undefined,
    materialCode: undefined,
    materialId: undefined,
    materialName: undefined,
    materialProperty: undefined,
    materialType: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    materialManage: undefined
  }
  formRef.value?.resetFields()
}


const materialList = ref([]) as any
const getMaterialList = async () => {
  // materialList.value = await CompanyProductApi.getMaterialList()
  materialList.value = await MaterialConfigApi.getMaterialConfigList()
  materialList.value = materialList.value.map(d => ({ label: d.materialName +'('+d.materialNumber+')', value: d.id, unit: d.materialUnit }))
}


// 手动输入
function selectBlur(e, field) {
  if (e.target.value) {
    // 手动输入的就将手动输入的值赋值给this.inputValue
    formData.value[field] = e.target.value;
  }
}

const materialBlur =(e)=> {
  if (e.target.value) {
    resetMaterial()
    // 手动输入的就将手动输入的值赋值给this.inputValue
    formData.value.materialName = e.target.value;
    formData.value.materialId = e.target.value;
  }
}

// 下拉选中
const changeMaterial = async (val) => {
  resetMaterial()
  if (val) {
    formData.value.materialId = val
    const material = await MaterialConfigApi.getMaterialConfig(val)
    if(material != null){
      formData.value.materialNumber = material.materialNumber
      formData.value.materialCode = material.materialCode
      formData.value.materialName = material.materialName
      formData.value.materialProperty = material.materialProperty
      formData.value.materialTypeId = material.materialTypeId
      formData.value.materialParentTypeId = material.materialParentTypeId
      formData.value.materialSourceId = material.materialSourceId
      formData.value.materialSpecification = material.materialSpecification
      formData.value.materialBrand = material.materialBrand
      formData.value.materialUnit = material.materialUnit
      formData.value.materialManage = material.materialManage


        getChooseMaterialType(material.materialParentTypeId)
    }
    else {
      formData.value.materialName = val
    }
  }
}

const resetMaterial =()=> {
  formData.value.materialNumber = undefined
  formData.value.materialCode = undefined
  formData.value.materialName = undefined
  formData.value.materialProperty = undefined
  formData.value.materialType = undefined
  formData.value.materialSpecification = undefined
  formData.value.materialBrand = undefined
  formData.value.materialUnit = undefined
  formData.value.materialManage = undefined
}

/** 初始化 **/
onMounted(() => {
  getMaterialList()
})
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
