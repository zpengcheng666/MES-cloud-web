<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" :width="'70%'" >
    <door />
    <template #footer>
      <el-button @click="submitEdit" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">

import door from '../door/index.vue'
import { provide } from 'vue'
import { merge } from 'lodash-es'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const regionInfo = reactive({});


/** 打开弹窗 */
const open = async (region) => {
  dialogVisible.value = true
  merge(regionInfo, region)
  dialogTitle.value = regionInfo.name
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
provide("region",regionInfo);

const submitEdit = () => {

}

</script>
