<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <ContentWrap>
      <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="100px">
        <el-form-item label="刀组编码" prop="cutterGroupCode">
          <el-input v-model="queryParams.cutterGroupCode" class="!w-180px" clearable placeholder="请输入刀组编码" />
        </el-form-item>
        <el-form-item label="刀柄类型" prop="taperTypeName">
          <el-select v-model="queryParams.taperTypeName" clearable class="!w-180px" placeholder="请选择刀柄类型">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="刀柄通用规格" prop="hiltMark">
          <el-input v-model="queryParams.hiltMark" class="!w-180px" clearable placeholder="请输入刀柄通用规格" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getCombinationData">
            <Icon class="mr-5px" icon="ep:search" />搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon class="mr-5px" icon="ep:refresh" />重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <ContentWrap>
      <el-table ref="multipleTable" :data="combinationDataList" style="height:400px;overflow-y: auto"
        @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column width="30" label="选择" type="selection" :reserve-selection="true" />
        <el-table-column align="center" label="刀组编码" prop="cutterGroupCode" />
        <el-table-column align="center" label="刀柄类型" prop="taperTypeName">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PDM_FEASIBILITY_TAPER_TYPE" :value="scope.row.taperTypeName" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="刀柄通用规格" prop="hiltMark" />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button type="primary" @click="saveSelectedCombination(selectionList.map((item) => item.id))"
        :disabled="selectionList.length === 0">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProcessPlanApi, CombinationVO } from "@/api/pdm/processPlan";
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import { watch } from 'vue';
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

defineOptions({ name: 'FeasibilityCombinationForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const queryFormRef = ref() // 搜索的表单
const combinationDataList = ref([]) // 刀组列表
const multipleTable = ref()
const combinationIds = ref([]) // 零件关联的刀组id数组

const queryParams = reactive({
  cutterGroupCode: '',
  taperTypeName: '',
  hiltMark: '',
})

const selectedCombinationParams = reactive({
  ids: '',
  processVersionId: '',
  procedureId: '',
  stepId: '',
  resourcesType: '2',
  status: '2'
})

/** 打开弹窗 */
const open = async (processVersionId: string, procedureId: string, stepId: string, combinationIdss: string[]) => {
  dialogVisible.value = true
  dialogTitle.value = '选择刀组'
  selectedCombinationParams.processVersionId = processVersionId
  selectedCombinationParams.procedureId = procedureId
  selectedCombinationParams.stepId = stepId
  combinationIds.value = combinationIdss
  await getCombinationData()
}

/** 搜索按钮操作 */
const getCombinationData = async () => {
  combinationDataList.value = await ProcessPlanApi.getCombinationList(queryParams)
  //默认选中已关联的刀组
  combinationDataList.value.forEach((item) => {
    if (combinationIds.value.indexOf(item.id) >= 0) {
      multipleTable.value.toggleRowSelection(item, true)
    }
  })
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getCombinationData()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 选中操作 */
const selectionList = ref<CombinationVO[]>([])
const handleSelectionChange = (rows: CombinationVO[]) => {
  selectionList.value = rows
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const getRowKeys = (row) => {
  return row.id
}

/** 确定按钮操作 */
const saveSelectedCombination = async (ids: number[]) => {
  try {
    let idsStr = ids.join(',')
    selectedCombinationParams.ids = idsStr;
    await ProcessPlanDetailApi.saveSelectedResourceStep(selectedCombinationParams)
    dialogVisible.value = false
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
    // 发送操作成功的事件
    emit('success')
  } catch { }
}

watch(dialogVisible, (newFormValue, oldFormValue) => {
  if (!newFormValue && oldFormValue) {
    resetQuery();
  }
});
</script>
