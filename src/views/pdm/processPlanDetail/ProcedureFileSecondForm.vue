<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="600">
        <el-form ref="formRefStepFile" v-loading="formLoading" :model="formData" :rules="formProcedureFileRules"
            label-width="110px">
            <el-form-item label="草图编号" prop="sketchCode">
                <el-input v-model="formData.sketchCode" clearable />
            </el-form-item>
            <el-form-item label="上传草图" prop="sketchUrl">
                <UploadImg v-model="formData.sketchUrl" :limit="1" height="128px" width="128px" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </Dialog>
</template>
<script lang="ts" setup>
import { ProcessPlanDetailApi, ProcessPlanDetailVO } from '@/api/pdm/processPlanDetail'
defineOptions({ name: 'ProcedureFileSecondForm' })
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formRefStepFile = ref()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
    id: undefined,
    processVersionId: undefined,
    procedureId: undefined,
    stepId: undefined,
    sketchCode: undefined,
    sketchUrl: undefined,
}
)

// const formRef = ref() // 表单 Ref

const formProcedureFileRules = reactive({
    sketchCode: [{ required: true, message: '草图编号不能为空', trigger: 'blur' }],
    sketchUrl: [{ required: true, message: '草图不能为空', trigger: 'blur' }]
})
/** 打开弹窗 */
const open = async (processVersionId: string, procedureId: string, stepId: string) => {
    dialogVisible.value = true
    dialogTitle.value = '上传草图'
    formData.value.processVersionId = processVersionId
    formData.value.procedureId = procedureId
    formData.value.stepId = stepId
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
    // 校验表单
    if (!formRefStepFile) return
    const valid = await formRefStepFile.value.validate()
    if (!valid) return
    // 提交请求
    formLoading.value = true
    const data = formData.value
    await ProcessPlanDetailApi.saveStepFile(data)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    formLoading.value = false
    resetForm()
}
/** 重置表单 */
const resetForm = () => {
    formData.value = {
        id: undefined,
        stepId: undefined,
        processVersionId: undefined,
        procedureId: undefined,
        sketchCode: undefined,
        sketchUrl: undefined,
    }
    formRefStepFile.value?.resetFields()
}
</script>
