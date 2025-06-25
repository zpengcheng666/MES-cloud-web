<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <ContentWrap>
      <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
        <el-form-item label="量具编号" prop="materialNumber">
          <el-input v-model="queryParams.materialNumber" class="!w-240px" clearable placeholder="请输入量具编号" />
        </el-form-item>
        <el-form-item label="量具名称" prop="materialName">
          <el-input v-model="queryParams.materialName" class="!w-240px" clearable placeholder="请输入量具名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="getMaterialData"><Icon class="mr-5px" icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <ContentWrap>
      <el-table ref="multipleTable" :data="materialDataList" style="height:400px;overflow-y: auto" @selection-change="handleSelectionChange" :row-key="getRowKeys">
        <el-table-column width="30" label="选择" type="selection" :reserve-selection="true" />
        <el-table-column align="center" label="量具编号" prop="materialNumber" />
        <el-table-column align="center" label="量具名称" prop="materialName" />
        <el-table-column align="center" label="量具规格" prop="materialSpecification" />
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button v-show="isOperatorSave" type="primary" @click="saveSelectedMaterial(selectionList.map((item) => item.id))" :disabled="selectionList.length === 0">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import {FeasibilityDetailApi, MaterialVO} from "@/api/pdm/feasibilityDetail";
import { watch } from 'vue';

defineOptions({ name: 'FeasibilityMeasureForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const queryFormRef = ref() // 搜索的表单
const materialDataList = ref([]) // 工装列表
const multipleTable = ref()
const materialIds = ref([]) // 零件关联的工装id数组

const queryParams = reactive({
  materialNumber: '',
  materialName: '',
  // materialType: '3'
  materialTypeCode: 'GZ'
})

const selectedMaterialParams = reactive({
  ids: '',
  projectCode: '',
  partVersionId: '',
  resourcesType: '4',
  status: '2'
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string, materialIdss: string[]) => {
  dialogVisible.value = true
  dialogTitle.value = '选择量具'
  isOperatorSave.value = isOperator;
  selectedMaterialParams.projectCode = projectCode
  selectedMaterialParams.partVersionId = partVersionId
  materialIds.value = materialIdss
  await getMaterialData()
}

/** 搜索按钮操作 */
const getMaterialData = async () => {
  materialDataList.value = await FeasibilityDetailApi.getMaterialList(queryParams)
  //默认选中已关联的量具
  materialDataList.value.forEach((item) => {
    if (materialIds.value.indexOf(item.id) >= 0) {
      multipleTable.value.toggleRowSelection(item, true)
    }
  })
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getMaterialData()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 选中操作 */
const selectionList = ref<MaterialVO[]>([])
const handleSelectionChange = (rows: MaterialVO[]) => {
  selectionList.value = rows
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const getRowKeys= (row) => {
  return row.id
}
/** 确定按钮操作 */
const saveSelectedMaterial = async (ids: number[]) => {
  try {
    let idsStr = ids.join(',')
    selectedMaterialParams.ids = idsStr;
    await FeasibilityDetailApi.saveSelectedResource(selectedMaterialParams)
    // 更新技术评估任务状态
    await FeasibilityDetailApi.updateFeasibilityTaskStatus(selectedMaterialParams)
    dialogVisible.value = false
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id))
    // 发送操作成功的事件
    emit('success')
  } catch {}
}

watch(dialogVisible, (newFormValue, oldFormValue) => {
  if (!newFormValue && oldFormValue) {
    resetQuery();
  }
});
</script>



