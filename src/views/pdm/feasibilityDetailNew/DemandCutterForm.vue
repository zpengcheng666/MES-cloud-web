<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
      <ContentWrap>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="刀具长度" prop="length">
                <el-input v-model="formData.length" placeholder="请输入刀具长度" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="刃长" prop="bladeLength">
                <el-input v-model="formData.bladeLength" placeholder="请输入刃长" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="刃数" prop="bladeNum">
                <el-input v-model="formData.bladeNum" placeholder="请输入刃数" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="直径" prop="diameter">
                <el-input v-model="formData.diameter" placeholder="请输入直径" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="R角" prop="rrAngle">
                <el-input v-model="formData.rrAngle" placeholder="请输入R角" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="缩径" prop="reducingDiameter">
                <el-input v-model="formData.reducingDiameter" placeholder="请输入缩径" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
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
        <el-table :data="demandCutterDataList" style="height:300px;overflow-y: auto">
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="刀具长度" prop="length" />
          <el-table-column align="center" label="刃长" prop="bladeLength" />
          <el-table-column align="center" label="刃数" prop="bladeNum" />
          <el-table-column align="center" label="直径" prop="diameter" />
          <el-table-column align="center" label="R角" prop="rrAngle" />
          <el-table-column align="center" label="缩径" prop="reducingDiameter" />
          <el-table-column align="center" label="备注" prop="description" />
          <el-table-column align="center" label="操作" width="120px">
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
import {DemandCutterVO, FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
defineOptions({ name: 'DemandCutterForm' })

const message=useMessage()//弹窗
const {t} =useI18n()//国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const demandCutterDataList = ref([]) // 刀具采购意见列表
const formRef = ref()

const queryParams = reactive({
  projectCode: '',
  partVersionId: '',
})
const formData = ref({
  id: undefined,
  projectCode: undefined,
  partVersionId: undefined,
  length: undefined,
  bladeLength: undefined,
  bladeNum: undefined,
  diameter: undefined,
  rrAngle: undefined,
  reducingDiameter: undefined,
  description: undefined
})
const formRules = reactive({
  length: [{ required: true, message: '刀具长度不能为空', trigger: 'blur' }],
  bladeLength: [{ required: true, message: '刃长不能为空', trigger: 'blur' }],
  bladeNum: [{ required: true, message: '刃数不能为空', trigger: 'blur' }],
  diameter: [{ required: true, message: '直径不能为空', trigger: 'blur' }],
  rrAngle: [{ required: true, message: 'R角不能为空', trigger: 'blur' }],
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '刀具采购意见'
  resetForm()
  isOperatorSave.value = isOperator;
  queryParams.projectCode = projectCode
  queryParams.partVersionId = partVersionId
  formData.value.projectCode = projectCode
  formData.value.partVersionId = partVersionId
  await getDemandCutterData()
}

/** 查刀具采购意见列表 */
const getDemandCutterData = async () => {
  demandCutterDataList.value = await FeasibilityDetailApi.getDemandCutterList(queryParams)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const setForm = async (id: number) => {
  formData.value = await FeasibilityDetailApi.getDemandCutter(id)
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeasibilityDetailApi.deleteDemandCutter(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDemandCutterData()
  } catch { }
}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    const data = formData.value as unknown as DemandCutterVO
    if (data.id) {
      await FeasibilityDetailApi.updateDemandCutter(data)
    } else {
      await FeasibilityDetailApi.createDemandCutter(data)
    }
    // 刷新列表
    await getDemandCutterData()
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    partVersionId: undefined,
    length: undefined,
    bladeLength: undefined,
    bladeNum: undefined,
    diameter: undefined,
    rrAngle: undefined,
    reducingDiameter: undefined,
    description: undefined
  }
  formRef.value?.resetFields()
  formData.value.projectCode = queryParams.projectCode
  formData.value.partVersionId = queryParams.partVersionId
}
</script>
