<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-17 17:24:24
 * @LastEditTime: 2024-07-26 16:30:39
 * @FilePath: /cimp-tms-web/src/views/store/newStore/viewDetails.vue
-->
<template>
  <Dialog v-model="dialogVisible" :scroll="true" :title="dialogTitle" width="800">
    <div v-for="item in modalData" :key="item" class="list success">
      <div class="box">{{ item ? item : '暂无数据' }}</div>
    </div>
    <template #footer v-if="currentType === 'new'">
      <el-button type="primary" @click="isShowBig = true">生成(大码)</el-button>
      <el-button type="primary" @click="isShowSmall = true">生成(小码)</el-button>
    </template>
  </Dialog>

  <Dialog v-model="isShowBig" :scroll="true" title="生成二维码" width="800">
    <div id="printB">
      <Qrcode v-for="item in modalData" :key="item" :text="item" />
    </div>
    <template #footer>
      <el-button type="primary" v-print="printObjBig">打印</el-button>
    </template>
  </Dialog>

  <Dialog v-model="isShowSmall" :scroll="true" title="生成二维码" width="800">
    <div id="printS">
      <Qrcode v-for="item in modalData" :key="item" :text="item" :width="100" />
    </div>
    <template #footer>
      <el-button type="primary" v-print="printObjSmall">打印</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { getCodeDetail, getBoxCodeDetail } from '@/api/knifetool/store/newStore'

const dialogVisible = ref(false) // 弹窗的是否展示
const detailLoading = ref(false) // 表单的加载中
const dialogTitle = ref('')

const formData = ref({
  id: undefined
})
const isShowBig = ref(false)
const isShowSmall = ref(false)
const modalData = ref()

const printObjBig = {
  id: 'printB',
  url: '',
  popTitle: '',
  extraCss: '',
  extraHead: ''
  // beforeOpenCallback(vue) {
  //   console.log(vue)
  //   console.log('打开之前')
  // },
  // openCallback(vue) {
  //   console.log('执行了打印')
  // },
  // closeCallback(vue) {
  //   console.log('关闭了打印工具')
  // }
}
const printObjSmall = {
  id: 'printS',
  url: '',
  popTitle: '',
  extraCss: '',
  extraHead: ''
}

/** 查询列表 */
const getData = async () => {
  detailLoading.value = true

  try {
    if (dialogTitle.value === '物码详情') {
      const res = await getCodeDetail(formData.value)
      console.log(res)
      modalData.value = res
    } else {
      const res = await getBoxCodeDetail(formData.value)
      console.log(res)
    }
  } finally {
    detailLoading.value = false
  }
}

/** 打开弹窗 */
const currentType = ref()
const open = async (row: any, title: string, type: string) => {
  console.log(row)
  dialogVisible.value = true
  currentType.value = type
  try {
    detailLoading.value = true
    dialogTitle.value = title
    formData.value.id = row.id
    getData()
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
<style lang="scss" scoped>
.list {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  float: left;
}
.box {
  width: 100%;
  text-align: center;
  word-wrap: break-word;
}
.success {
  background: rgb(135, 208, 104);
}
</style>
