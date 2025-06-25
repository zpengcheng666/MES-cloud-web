<template>
  <ElDialog v-model="dialogVisible" :title="dialogTitle" :fullscreen="true">
    <DesignView :fileUrl="fileUrl"/>
  </ElDialog>
</template>
<script setup lang="ts">
import DesignView from "./DesignView.vue";
import {ProcessPlanDetailApi} from "@/api/pdm/processPlanDetail";

defineOptions({ name: 'DesignViewForm' })
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

const fileUrl = ref('') // 草图地址

/** 打开弹窗 */
const open = async (id, processVersionId: string, procedureId: string) => {
  dialogVisible.value = true
  dialogTitle.value = '预览'
  let data = await ProcessPlanDetailApi.getProcedureFileById(id);
  fileUrl.value = data.sketchUrl
  const iframe: any = document.getElementById('Design2D');
  iframe?.contentWindow?.postMessage(
    {
      type:'clearCanvas',
      isView: '1',
      param:{id:id,processVersionId:processVersionId,procedureId:procedureId}
    },
    '*'
  );
  setTimeout(()=>{
    iframe?.contentWindow?.postMessage(
      {
        type:'viewWebFile',
        param:{fileUrl:data.sketchUrl}
      },
      '*'
    );
  },500)
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
