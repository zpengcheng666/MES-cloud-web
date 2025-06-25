<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
      <ContentWrap>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="接口型式" prop="taperTypeId">
                <el-select v-model="formData.taperTypeId" clearable placeholder="请选择接口型式">
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="刀柄长度" prop="length">
                <el-input v-model="formData.length" placeholder="请输入刀柄长度" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="刀柄前端直径" prop="frontEndDiameter">
                <el-input v-model="formData.frontEndDiameter" placeholder="请输入刀柄前端直径" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="刀柄前端长度" prop="frontEndLength">
                <el-input v-model="formData.frontEndLength" placeholder="请输入刀柄前端长度" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="倾角" prop="dipAngle">
                <el-input v-model="formData.dipAngle" placeholder="请输入倾角" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="description">
                <el-input v-model="formData.description" placeholder="请输入备注" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button v-show="isOperatorSave" type="primary" plain @click="submitForm" class="ml-120px">
            <Icon icon="ep:circle-check" class="mr-5px" /> 保存
          </el-button>
          <el-button @click="resetForm" class="ml-20px">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-table :data="demandHiltDataList" style="height:300px;overflow-y: auto">
          <el-table-column align="center" label="序号" type="index" width="60px" />
          <el-table-column align="center" label="接口型式" prop="taperTypeId">
            <template #default="scope">
              <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeId" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="刀柄长度" prop="length" />
          <el-table-column align="center" label="刀柄前端直径" prop="frontEndDiameter" />
          <el-table-column align="center" label="刀柄前端长度" prop="frontEndLength" />
          <el-table-column align="center" label="倾角" prop="dipAngle" />
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
import {DemandHiltVO, FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
defineOptions({ name: 'DemandHiltForm' })

const message=useMessage()//弹窗
const {t} =useI18n()//国际化
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const demandHiltDataList = ref([]) // 刀柄采购意见列表
const formRef = ref()

const queryParams = reactive({
  projectCode: '',
  partVersionId: '',
})
const formData = ref({
  id: undefined,
  projectCode: undefined,
  partVersionId: undefined,
  taperTypeId: undefined,
  length: undefined,
  frontEndDiameter: undefined,
  frontEndLength: undefined,
  dipAngle: undefined,
  description: undefined,
})
const formRules = reactive({
  taperTypeId: [{ required: true, message: '接口型式不能为空', trigger: 'change' }],
  length: [{ required: true, message: '刀柄长度不能为空', trigger: 'blur' }],
  frontEndDiameter: [{ required: true, message: '刀柄前端直径不能为空', trigger: 'blur' }],
  frontEndLength: [{ required: true, message: '刀柄前端长度不能为空', trigger: 'blur' }],
  dipAngle: [{ required: true, message: '倾角不能为空', trigger: 'blur' }],
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '刀柄采购意见'
  resetForm()
  isOperatorSave.value = isOperator;
  queryParams.projectCode = projectCode
  queryParams.partVersionId = partVersionId
  formData.value.projectCode = projectCode
  formData.value.partVersionId = partVersionId
  await getDemandHiltData()
}

/** 查刀柄采购意见列表 */
const getDemandHiltData = async () => {
  demandHiltDataList.value = await FeasibilityDetailApi.getDemandHiltList(queryParams)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const setForm = async (id: number) => {
  formData.value = await FeasibilityDetailApi.getDemandHilt(id)
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeasibilityDetailApi.deleteDemandHilt(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getDemandHiltData()
  } catch { }
}

const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  try {
    const data = formData.value as unknown as DemandHiltVO
    if (data.id) {
      await FeasibilityDetailApi.updateDemandHilt(data)
    } else {
      await FeasibilityDetailApi.createDemandHilt(data)
    }
    // 刷新列表
    await getDemandHiltData()
  } finally {
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    projectCode: undefined,
    partVersionId: undefined,
    taperTypeId: undefined,
    length: undefined,
    frontEndDiameter: undefined,
    frontEndLength: undefined,
    dipAngle: undefined,
    description: undefined,
  }
  formRef.value?.resetFields()
  formData.value.projectCode = queryParams.projectCode
  formData.value.partVersionId = queryParams.partVersionId
}
</script>
