<template>
    <Dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :data="attrsDataList">
        <ContentWrap>
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" v-loading="formLoading">
                <el-form-item label="属性英文名称" prop="attr_name">
                    <el-input v-model="formData.attr_name" />
                </el-form-item>
                <el-form-item label="属性中文名称" prop="attr_alias">
                    <el-input v-model="formData.attr_alias" />
                </el-form-item>
                <el-form-item label="属性类型" prop="attr_type">
                    <el-select v-model="formData.attr_type" clearable placeholder="请选择属性类型">
                        <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_DATAOBJECT_TYPE) " :key="dict.value"
                            :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="长度" prop="attr_length">
                    <el-input-number v-model="formData.attr_length" :min="10" placeholder="请输入长度" class="!w-200px"/>
                </el-form-item>
                <el-form-item label="单位" prop="attr_unit">
                    <el-input v-model="formData.attr_unit" />
                </el-form-item>
                <el-form-item label="默认值" prop="attr_default">
                    <el-input v-model="formData.attr_default" />
                </el-form-item>
                <el-form-item label="是否多值" prop="is_more_value">
                    <el-radio-group v-model="formData.is_more_value">
                        <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.PDM_DATAOBJECT_IS_VALUE) "
                            :key="dict.value" :label="dict.value">
                            {{ dict.label }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效值数组" prop="effective_value">
                    <el-input v-model="formData.effective_value" />
                </el-form-item>
            </el-form>
        </ContentWrap>
        <template #footer>
            <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </template>
    </Dialog>
</template>
<script setup lang="ts">
import { DataObjectApi, DataObjectVO } from '@/api/pdm/dataObject'
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
/** 产品数据对象 表单 */
defineOptions({ name: 'DataObjectFormDetail' })
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formRef = ref() // 表单 Ref
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const attrsDataList = ref([]) // 属性信息
const formData = ref({
    attr_name: undefined,
    attr_alias: undefined,
    effective_value: undefined,
    attr_default: undefined,
    attr_length: undefined,
    attr_unit: undefined,
    attr_type: undefined,
    is_more_value: undefined,
})
const rules = reactive({
  attr_name: [{ required: true, message: '属性英文名称不能为空', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        const regex = /[^a-z]/g;
        if (regex.test(value)) {
          callback(new Error('属性英文名称必须是小写字母'));
        } else {
          callback()
        }
      },trigger: 'change',}],
  attr_alias: [{ required: true, message: '属性中文名称不能为空', trigger: 'blur' }],
  attr_type: [{ required: true, message: '请选择属性类型', trigger: 'change' }],
  attr_length: [{ required: true, message: '长度不能为空', trigger: 'blur' }],
})
/** 打开弹窗 */
const open = async (row) => {
    //对话框显示
    dialogVisible.value = true
    dialogTitle.value = '编辑'
    resetForm()
    formData.value = row
}



/** 重置表单 */
const resetForm = () => {
    formData.value = {
        attr_name: undefined,
        attr_alias: undefined,
        effective_value: undefined,
        attr_default: undefined,
        attr_length: undefined,
        attr_unit: undefined,
        attr_type: undefined,
        is_more_value: undefined,
    }
    formRef.value?.resetFields()
}

const submitForm = async () => {
    // 校验表单
    if (!formRef) return
    // 校验表单
    await formRef.value.validate()
    // 提交请求
    formLoading.value = true
    try {
      const data = formData.value as unknown as DataObjectVO
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success', data)
    } finally {
      formLoading.value = false
    }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>
<style>
/* 添加自定义CSS样式 */
.custom-divider .el-divider__text {
    font-size: 20px;
    /* 调整文本大小 */
}
</style>
