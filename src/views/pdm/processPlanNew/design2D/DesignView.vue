<template>
  <div style="width: 100%;height: 93vh; overflow: hidden;">
    <iframe id="Design2D" :src="designUrl" style="width: 100%;height: 100%;border:none"></iframe>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';

const VITE_BASE_DESIGN_URL = import.meta.env.VITE_BASE_DESIGN_URL
const designUrl = ref(VITE_BASE_DESIGN_URL)

const props = defineProps < {
  fileUrl: undefined, // 草图URL
} > ()

const createCad = () => {
  let fileUrl = props.fileUrl;
  const iframe: any = document.getElementById('Design2D');
  setTimeout(()=>{
    iframe?.contentWindow?.postMessage(
      {
        type:'viewWebFile',
        param:{fileUrl:fileUrl}
      },
      '*'
    );
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
