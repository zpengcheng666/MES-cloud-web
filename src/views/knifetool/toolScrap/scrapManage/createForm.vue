<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="刀盒码" prop="boxCode">
        <el-input placeholder="刀盒码" v-model="queryData.boxCode" @blur="handleBoxCodeChange" />
      </el-form-item>

      <el-form-item label="刀具物码" prop="objectCode">
        <el-input placeholder="刀具物码" v-model="queryData.objectCode" :disabled="true" />
      </el-form-item>

      <el-form-item label="报废类型" prop="scarpTypeId">
        <el-select allow-clear placeholder="请选择报废类型" v-model="formData.scarpTypeId">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.TOOL_SCRAP_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" :rows="2" type="textarea" placeholder="备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { createScrap, getDetailByParam } from '@/api/knifetool/toolScrap/scrapManage'
import { ElMessage } from 'element-plus'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('登记报废添加') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const queryData = ref<{
  boxCode: string
  objectCode: string
}>({
  boxCode: '',
  objectCode: ''
})
const formData = ref<{
  toolId?: number
  scarpTypeId?: number
  approveStatus?: number
  remark: string
}>({
  toolId: undefined,
  scarpTypeId: undefined,
  approveStatus: 1,
  remark: ''
})
const formRules = reactive({
  scarpTypeId: [{ required: true, message: '该选择该项内容', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const handleBoxCodeChange = async () => {
  if (queryData.value.boxCode !== '' && queryData.value.boxCode !== undefined) {
    try {
      const data = await getDetailByParam({ objectCode: queryData.value.boxCode })
      console.log(data)

      if (data !== null) {
        formData.value.toolId = data.id
        queryData.value.objectCode = data.objectCode

        ElMessage.success(`刀盒码[' ${queryData.value.boxCode} ']查询成功`)
      } else {
        ElMessage.error(`刀盒码[' ${queryData.value.boxCode} ']不存在！`)
        resetForm()
      }
    } catch {
      resetForm()
    }
  }
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log(formData.value)
    await createScrap(formData.value)
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    formLoading.value = false
  } catch {}
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    toolId: undefined,
    scarpTypeId: undefined,
    approveStatus: 1,
    remark: ''
  }
  queryData.value = {
    boxCode: '',
    objectCode: ''
  }
  formRef.value?.resetFields()
}
</script>
