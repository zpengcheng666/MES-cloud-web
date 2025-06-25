<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="数据" align="center" prop="item"/>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">

import { dateFormatter } from '@/utils/formatTime'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  objs: undefined // 列表数据
}>()

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 加载列表 */
const getList = async () =>{
  loading.value = true
  try {
    list.value = props.objs;
  }finally {
    loading.value = false
    console.log(list.value)
  }
}

/**初始化 */
onMounted(() => {
  getList()
})


</script>
