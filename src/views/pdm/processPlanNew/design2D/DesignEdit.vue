<template>
  <div style="width: 100%;height: 80vh; overflow: hidden;">
    <iframe id="Design2D" :src="designUrl" style="width: 100%;height: 100%"></iframe>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';

const VITE_BASE_DESIGN_URL = import.meta.env.VITE_BASE_DESIGN_URL
const designUrl = ref(VITE_BASE_DESIGN_URL)

const props = defineProps < {
  fileUrl: undefined, // 草图URL
  isView: undefined, // 是否预览模式
} > ()

const createCad = () => {
  let fileUrl = props.fileUrl;
  let isView = props.isView;
  const iframe: any = document.getElementById('Design2D');
  setTimeout(()=>{
    if(isView === '0') {//编辑
      iframe?.contentWindow?.postMessage(
        {
          type:'openWebFile',
          param:{fileUrl:fileUrl}
        },
        '*'
      );
    }
    if(isView === '1') {//预览
      iframe?.contentWindow?.postMessage(
        {
          type:'viewWebFile',
          param:{fileUrl:fileUrl}
        },
        '*'
      );
    }
  },500)
}
//监听url
watch(() =>props.fileUrl ,
  (val) => {
    if (!val) {
      return
    }
    createCad();
  }
);
onMounted(async () => {
  createCad();
})
</script>
