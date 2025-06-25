<template>
  <div>
    <el-card shadow="never">
          <div class="container1" v-loading="loading">
            <iframe id="modle_iframe" :key="ikey" ref="Iframe" :src="url" width="100%" height="100%" frameborder="0" allowfullscreen ></iframe>
          </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
const ikey = new Date().getTime() // 使用时间戳
const Iframe = ref()
const loading = ref(false)

function iframeLoad() {
  loading.value = true
  const iframe = Iframe.value
  // 兼容处理
  if (iframe.attachEvent) {
    // IE
    iframe.attachEvent('onload', () => {
      loading.value = false
    })
  } else {
    // 非IE
    iframe.onload = () => {
      loading.value = false
    }
  }
}
const url = ref()
const fetchData = () => {
  if (!url.value) {
    // ikey.value = new Date().getTime() // 使用时间戳
    url.value = 'http://localhost:8087/goto/jHcDVejSR?orgId=1&theme=light&kiosk'
  }
  iframeLoad()
};

onMounted(() => {
  fetchData();
});
</script>

<script lang="ts">
export default {
  name: 'Model',
};
</script>

<style scoped lang="scss">
.container1 {
  //position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}

#modle_iframe {
  width: 100%;
  height: 100%;
}
</style>
