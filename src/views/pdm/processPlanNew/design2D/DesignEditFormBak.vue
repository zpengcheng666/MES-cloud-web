<template>
  <ElDialog v-model="dialogVisible" :title="dialogTitle" :fullscreen="true">
    <el-form ref="formRefProcedureFile" v-loading="formLoading" :model="formData" :rules="formProcedureFileRules"
             label-width="110px">
      <el-form-item v-show="isView === '0'" label="草图编号" prop="sketchCode">
        <el-input v-model="formData.sketchCode" class="!w-240px" clearable />
      </el-form-item>
      <el-form-item>
<!--        <DesignEdit :fileUrl="fileUrl" :isView="isView"/>-->
        <div style="width: 100%;height: 80vh; overflow: hidden;">
          <iframe id="Design2D" :src="designUrl" style="width: 100%;height: 100%"></iframe>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-show="isView === '0'" :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button v-show="isView === '0'" @click="dialogVisible = false">取 消</el-button>
      <el-button v-show="isView === '1'" @click="dialogVisible = false">关 闭</el-button>
    </template>
  </ElDialog>
</template>
<script lang="ts" setup>
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import {useI18n} from "vue-i18n";
import DesignEdit from "./DesignEdit.vue";

const VITE_BASE_DESIGN_URL = import.meta.env.VITE_BASE_DESIGN_URL
const designUrl = ref(VITE_BASE_DESIGN_URL)

const fileUrl = ref('') // 草图地址
const isView = ref('') // 是否预览模式

defineOptions({ name: 'DesignEditForm' })
const { t } = useI18n(); // 国际化
const message = useMessage(); // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formRefProcedureFile = ref()
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
    id: undefined,
    processVersionId: undefined,
    procedureId: undefined,
    sketchCode: undefined,
    sketchUrl: undefined,
  }
)

const formProcedureFileRules = reactive({
  sketchCode: [{ required: true, message: '草图编号不能为空', trigger: 'blur' }]
})
/** 打开弹窗 */
const open = async (id?: number, processVersionId: string, procedureId: string, isViewParam: string) => {
  dialogVisible.value = true
  if(isViewParam === '0') {
    dialogTitle.value = '在线画图'
  } else {
    dialogTitle.value = '预览'
  }
  resetForm()
  formData.value.processVersionId = processVersionId
  formData.value.procedureId = procedureId
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProcessPlanDetailApi.getProcedureFileById(id);
      fileUrl.value = formData.value.sketchUrl
    } finally {
      formLoading.value = false
    }
  } else {
    fileUrl.value = ''
  }
  isView.value = isViewParam;
  const iframe: any = document.getElementById('Design2D');
  iframe?.contentWindow?.postMessage(
    {
      type:'clearCanvas',
      isView: isViewParam
    },
    '*'
  );
  setTimeout(()=>{
    if(isViewParam === '0') {//编辑
      iframe?.contentWindow?.postMessage(
        {
          type:'openWebFile',
          param:{fileUrl:fileUrl.value}
        },
        '*'
      );
    }
    if(isViewParam === '1') {//预览
      iframe?.contentWindow?.postMessage(
        {
          type:'viewWebFile',
          param:{fileUrl:fileUrl.value}
        },
        '*'
      );
    }
  },500)

}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRefProcedureFile) return
  const valid = await formRefProcedureFile.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  const data = formData.value
  // 在线画图文件上传在Design2D内部实现
  const iframe: any = document.getElementById('Design2D');
  iframe.contentWindow.postMessage(
    {
      type:'saveFile',
      param:{id:data.id,processVersionId:data.processVersionId,procedureId:data.procedureId,sketchCode:data.sketchCode}
    },
    '*'
  );
  // 上传文件有延迟
  setTimeout(()=>{
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
    formLoading.value = false
  },2000)
}
/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    processVersionId: undefined,
    procedureId: undefined,
    sketchCode: undefined,
    sketchUrl: undefined,
  }
  formRefProcedureFile.value?.resetFields()
}
</script>
<style>
.el-dialog__footer {
  padding-top: var(--el-dialog-padding-primary);
  text-align: center;
  box-sizing: border-box;
}
</style>
