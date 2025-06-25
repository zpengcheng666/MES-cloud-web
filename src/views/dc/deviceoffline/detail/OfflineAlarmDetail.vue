<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-form-item>
      <el-input type='textarea' :rows="8" v-model="alarm" disabled/>
    </el-form-item>
  </ContentWrap>
</template>
<script setup lang="ts">

import { dateFormatter } from '@/utils/formatTime'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  itemsCode: undefined // 列表数据
}>()

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 加载列表 */
const getList = async () =>{
  loading.value = true
  try {
    alarm.value = props.itemsCode;
  }finally {
    loading.value = false
  }
}

let alarm = ref({
  itemsCode: undefined
})

/**初始化 */
onMounted(() => {
  getList()
})


</script>
