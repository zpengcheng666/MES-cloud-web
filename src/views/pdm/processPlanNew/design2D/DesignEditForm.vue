<template>
  <ElDialog v-model="dialogVisible" :title="dialogTitle" :fullscreen="true" :show-close="false">
    <el-form ref="formRefProcedureFile" v-loading="formLoading" :model="formData"
             label-width="110px">
      <div style="width: 101.7%;height: 98.3vh; overflow: hidden;margin-top:-32px;margin-left:-16px;">
        <iframe id="Design2D" :src="designUrl"></iframe>
      </div>
    </el-form>
  </ElDialog>
</template>
<script lang="ts" setup>
import { ProcessPlanDetailApi } from '@/api/pdm/processPlanDetail'
import {useI18n} from "vue-i18n";

const VITE_BASE_DESIGN_URL = import.meta.env.VITE_BASE_DESIGN_URL
const designUrl = ref(VITE_BASE_DESIGN_URL)

const fileUrl = ref('') // 草图地址
const isView = ref('') // 是否预览模式

defineOptions({ name: 'DesignEditForm' })

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

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

// 监听子窗口的请求指令
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type == 'closeDialog') {//关闭弹窗iframe
    dialogVisible.value = false
  } else if(data.type == 'saveFile') {//保存dxf文件后刷新列表
    // 上传文件有延迟
    setTimeout(()=>{
      dialogVisible.value = false
      // 发送操作成功的事件
      emit('success')
      formLoading.value = false
    },2000)
  }
}, false);

/** 打开弹窗 */
const open = async (id?: number, processVersionId: string, procedureId: string, isViewParam: string) => {
  dialogVisible.value = true
  dialogTitle.value = ''
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
    await ProcessPlanDetailApi.getProcedureFileById(111);
  }
  isView.value = isViewParam;
  const iframe: any = document.getElementById('Design2D');
  iframe?.contentWindow?.postMessage(
    {
      type:'clearCanvas',
      isView: isViewParam,
      param:{id:formData.value.id,processVersionId:processVersionId,procedureId:procedureId}
    },
    '*'
  );
  setTimeout(()=>{
    if(isViewParam === '0') {//编辑
      iframe?.contentWindow?.postMessage(
        {
          type:'openWebFile',
          param:{fileUrl:fileUrl.value,id:formData.value.id,processVersionId:processVersionId,procedureId:procedureId}
        },
        '*'
      );
    }
    if(isViewParam === '1') {//预览
      iframe?.contentWindow?.postMessage(
        {
          type:'viewWebFile',
          param:{fileUrl:fileUrl.value,id:formData.value.id,processVersionId:processVersionId,procedureId:procedureId}
        },
        '*'
      );
    }
  },500)

}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
<style lang="scss" scoped>
.el-dialog.is-fullscreen {
  overflow: hidden;
}
.el-dialog {
  padding: 0;
}
.el-dialog__header {
  padding-bottom: 0;
}
iframe {
  border: none !important;
  width: 100%;
  height:100%;
  overflow: hidden;
}
</style>
