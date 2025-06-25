<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <ContentWrap>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="工装编号" prop="materialCode">
                <el-input v-model="formData.materialCode" placeholder="请输入工装编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工装名称" prop="materialName">
                <el-input v-model="formData.materialName" placeholder="请输入工装名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工装规格" prop="materialSpecification">
                <el-input v-model="formData.materialSpecification" placeholder="请输入工装规格" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="description">
                <el-input v-model="formData.description" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button v-show="isOperatorSave" type="primary" plain @click="submitForm" class="ml-100px">
            <Icon icon="ep:circle-check" class="mr-5px" /> 保存
          </el-button>
          <el-button @click="resetForm" class="ml-20px">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table :data="demandMaterialDataList" style="height:300px;overflow-y: auto">
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="工装编号" prop="materialCode" />
          <el-table-column align="center" label="工装名称" prop="materialName" />
          <el-table-column align="center" label="工装规格" prop="materialSpecification" />
          <el-table-column align="center" label="备注" prop="description" />
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <el-button v-show="isOperatorSave" link type="primary" @click="setForm(scope.row.id)">编辑</el-button>
              <el-button v-show="isOperatorSave" link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </ContentWrap>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
</template>
<script setup lang="ts">
import {DemandMaterialVO, FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
defineOptions({ name: 'DemandMaterialForm' })

const message=useMessage()//弹窗
const {t} =useI18n()//国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const demandMaterialDataList = ref([]) // 工装采购意见列表
const formRef = ref()

const queryParams = reactive({
  projectCode: '',
  partVersionId: '',
})
const formData = ref({
  id: undefined,
  projectCode: undefined,
  partVersionId: undefined,
  materialCode: undefined,
  materialName: undefined,
  materialSpecification: undefined,
  description: undefined,
})
const formRules = reactive({
  materialCode: [{ required: true, message: '工装编号不能为空', trigger: 'blur' }],
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '工装采购意见'
  resetForm()
  isOperatorSave.value = isOperator;
  queryParams.projectCode = projectCode
  queryParams.partVersionId = partVersionId
  formData.value.projectCode = projectCode
  formData.value.partVersionId = partVersionId
  await getDemandMaterialData()
}

/** 查工装采购意见列表 */
const getDemandMaterialData = async () => {
  demandMaterialDataList.value = await FeasibilityDetailApi.getDemandMaterialList(queryParams)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const setForm = async (id: number) => {
  formData.value = await FeasibilityDetailApi.getDemandMaterial(id)
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeasibilityDetailApi.deleteDemandMaterial(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDemandMaterialData()
  } catch { }
}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    const data = formData.value as unknown as DemandMaterialVO
    if (data.id) {
      await FeasibilityDetailApi.updateDemandMaterial(data)
    } else {
      await FeasibilityDetailApi.createDemandMaterial(data)
    }
    // 刷新列表
    await getDemandMaterialData()
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    partVersionId: undefined,
    materialCode: undefined,
    materialName: undefined,
    materialSpecification: undefined,
    description: undefined,
  }
  formRef.value?.resetFields()
  formData.value.projectCode = queryParams.projectCode
  formData.value.partVersionId = queryParams.partVersionId
}
</script>
