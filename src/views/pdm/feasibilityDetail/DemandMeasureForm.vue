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
            <el-form-item label="量具编号" prop="measureCode">
              <el-input v-model="formData.measureCode" placeholder="请输入量具编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量具名称" prop="measureName">
              <el-input v-model="formData.measureName" placeholder="请输入量具名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="量具规格" prop="measureSpecification">
              <el-input v-model="formData.measureSpecification" placeholder="请输入量具规格" />
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
      <el-table :data="demandMeasureDataList" style="height:300px;overflow-y: auto">
        <el-table-column align="center" label="序号" type="index" width="60px" />
        <el-table-column align="center" label="量具编号" prop="measureCode" />
        <el-table-column align="center" label="量具名称" prop="measureName" />
        <el-table-column align="center" label="量具规格" prop="measureSpecification" />
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

<script setup lang="ts">import { DemandMeasureVO, FeasibilityDetailApi } from '@/api/pdm/feasibilityDetail';
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

const message = ElMessage;
const { t } = useI18n();
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(''); // 弹窗的标题
const isOperatorSave = ref(false); // 是否可操作保存
const demandMeasureDataList = ref([]); // 工装采购意见列表
const formRef = ref();

const queryParams = reactive({
  projectCode: '',
  partVersionId: '',
});

const formData = reactive({
  id: undefined,
  projectCode: undefined,
  partVersionId: undefined,
  measureCode: undefined,
  measureName: undefined,
  measureSpecification: undefined,
  description: undefined,
});

const formRules = reactive({
  measureCode: [{ required: true, message: '量具编号不能为空', trigger: 'blur' }],
});

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '量具采购意见'
  resetForm()
  isOperatorSave.value = isOperator;
  queryParams.projectCode = projectCode
  queryParams.partVersionId = partVersionId
  formData.value.projectCode = projectCode
  formData.value.partVersionId = partVersionId
  await getDemandMeasureData()
}

/** 查量具采购意见列表 */
const getDemandMeasureData = async () => {
  demandMeasureDataList.value = await FeasibilityDetailApi.getDemandMeasureList(queryParams)
  console.log('demandMeasureDataList', demandMeasureDataList.value)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const setForm = async (id: number) => {
  formData.value = await FeasibilityDetailApi.getDemandMeasure(id)
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeasibilityDetailApi.deleteDemandMeasure(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDemandMeasureData()
  } catch { }
}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    const data = formData.value as unknown as DemandMeasureVO
    if (data.id) {
      await FeasibilityDetailApi.updateDemandMeasure(data)
    } else {
      await FeasibilityDetailApi.createDemandMeasure(data)
    }
    // 刷新列表
    await getDemandMeasureData()
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    partVersionId: undefined,
    measureCode: undefined,
    measureName: undefined,
    measureSpecification: undefined,
    description: undefined,
  }
  formRef.value?.resetFields()
  formData.value.projectCode = queryParams.projectCode
  formData.value.partVersionId = queryParams.partVersionId
}
</script>
