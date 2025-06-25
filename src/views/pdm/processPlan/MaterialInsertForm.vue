<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
        <ContentWrap>
            <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
                <el-form-item label="材料牌号" prop="materialNumber">
                    <el-input v-model="queryParams.materialNumber" class="!w-240px" clearable placeholder="请输入材料牌号" />
                </el-form-item>
                <el-form-item label="材料名称" prop="materialName">
                    <el-input v-model="queryParams.materialName" class="!w-240px" clearable placeholder="材料名称" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="getMaterialData">
                        <Icon class="mr-5px" icon="ep:search" />搜索
                    </el-button>
                    <el-button @click="resetQuery">
                        <Icon class="mr-5px" icon="ep:refresh" />重置
                    </el-button>
                </el-form-item>
            </el-form>
        </ContentWrap>
        <ContentWrap>
            <el-table ref="multipleTable" :data="materialDataList" style="height:400px;overflow-y: auto"
                @current-change="handleCurrentChange">
                <el-table-column align="center" width="50">
                    <template #default="scope">
                        <el-radio v-model="radio" :label="scope.row.id">
                            <span></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="材料牌号" prop="materialNumber" />
                <el-table-column align="center" label="材料类码" prop="materialCode" />
                <el-table-column align="center" label="材料名称" prop="materialName" />
                <el-table-column align="center" label="材料规格" prop="materialSpecification" />
            </el-table>
        </ContentWrap>
        <template #footer>
            <el-button type="primary" @click="saveSelectedMaterial()" :disabled="radio === ''">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { ProcessPlanApi, ProcessRegulationsVO } from "@/api/pdm/processPlan";
import { watch } from 'vue';

defineOptions({ name: 'FeasibilityMaterialForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const isOperatorSave = ref(false) // 是否可操作保存
const queryFormRef = ref() // 搜索的表单
const materialDataList = ref([]) // 材料列表
const multipleTable = ref()
const materialIds = ref([]) // 零件关联的工装id数组
const radio = ref<number>('')
const currentRow = ref()

const queryParams = reactive({
    materialId: '',
    materialNumber: '',
    materialName: '',
    // materialType: '1',
    // materialProperty: '2',
    materialTypeCode: 'MP'
})

const selectedMaterialParams = reactive({
    ids: '',
    projectCode: '',
    partVersionId: '',
    processVersionId: '',
    resourcesType: '3',
    status: '2'
})

/** 打开弹窗 */
const open = async (isOperator: boolean, projectCode: string, partVersionId: string, processVersionId: string, materialIdss: string[]) => {
    dialogVisible.value = true
    dialogTitle.value = '选择材料'
    isOperatorSave.value = isOperator;
    selectedMaterialParams.projectCode = projectCode
    selectedMaterialParams.partVersionId = partVersionId
    selectedMaterialParams.processVersionId = processVersionId
    materialIds.value = materialIdss
    radio.value = ''
    await getMaterialData()
    // }
}

/** 单选选中操作 */
const handleCurrentChange = (row) => {
    currentRow.value = row
    radio.value = row?.id
}
/** 搜索按钮操作 */
const getMaterialData = async () => {
    materialDataList.value = await ProcessPlanApi.getMaterialList(queryParams)

}

/** 重置按钮操作 */
const resetQuery = () => {
    queryFormRef.value.resetFields()
    getMaterialData()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 确定按钮操作 */
const saveSelectedMaterial = async () => {
    const data = currentRow.value
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success', data)

}

watch(dialogVisible, (newFormValue, oldFormValue) => {
  if (!newFormValue && oldFormValue) {
    resetQuery();
  }
});
</script>
