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
              <el-form-item label="设备编号" prop="deviceCode">
                <el-input v-model="formData.deviceCode" placeholder="请输入设备编号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备名称" prop="deviceName">
                <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备规格" prop="deviceSpecification">
                <el-input v-model="formData.deviceSpecification" placeholder="请输入设备规格" />
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
        <el-table :data="demandDeviceDataList" style="height:300px;overflow-y: auto">
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="设备编号" prop="deviceCode" />
          <el-table-column align="center" label="设备名称" prop="deviceName" />
          <el-table-column align="center" label="设备规格" prop="deviceSpecification" />
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
import {DemandDeviceVO, FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
defineOptions({ name: 'DemandDeviceForm' })

const message=useMessage()//弹窗
const {t} =useI18n()//国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const demandDeviceDataList = ref([]) // 设备采购意见列表
const formRef = ref()

const queryParams = reactive({
  projectCode: '',
  partVersionId: '',
})
const formData = ref({
  id: undefined,
  projectCode: undefined,
  partVersionId: undefined,
  deviceCode: undefined,
  deviceName: undefined,
  deviceSpecification: undefined,
  description: undefined,
})
const formRules = reactive({
  deviceCode: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '设备采购意见'
  resetForm()
  isOperatorSave.value = isOperator;
  queryParams.projectCode = projectCode
  queryParams.partVersionId = partVersionId
  formData.value.projectCode = projectCode
  formData.value.partVersionId = partVersionId
  await getDemandDeviceData()
}

/** 查设备采购意见列表 */
const getDemandDeviceData = async () => {
  demandDeviceDataList.value = await FeasibilityDetailApi.getDemandDeviceList(queryParams)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const setForm = async (id: number) => {
  formData.value = await FeasibilityDetailApi.getDemandDevice(id)
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeasibilityDetailApi.deleteDemandDevice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDemandDeviceData()
  } catch { }
}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    const data = formData.value as unknown as DemandDeviceVO
    if (data.id) {
      await FeasibilityDetailApi.updateDemandDevice(data)
    } else {
      await FeasibilityDetailApi.createDemandDevice(data)
    }
    // 刷新列表
    await getDemandDeviceData()
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    partVersionId: undefined,
    deviceCode: undefined,
    deviceName: undefined,
    deviceSpecification: undefined,
    description: undefined,
  }
  formRef.value?.resetFields()
  formData.value.projectCode = queryParams.projectCode
  formData.value.partVersionId = queryParams.partVersionId
}
</script>
