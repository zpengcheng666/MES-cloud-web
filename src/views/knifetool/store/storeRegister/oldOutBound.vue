<!--
 * @Author: hyj
 * @Description: 旧刀扫码出库
 * @Date: 2024-06-28 10:30:58
 * @LastEditTime: 2024-06-28 15:51:34
 * @FilePath: /cimp-tms-web/src/views/store/storeRegister/oldOutBound.vue
-->
<template>
  <Dialog v-model="dialogVisible" :max-height="600" :scroll="true" :title="dialogTitle">
    <el-input placeholder="请输入物码,系统会自动监测" v-model="outNum" @change="onOutCode" />

    <div class="mt-20px">
      <h4>已添加物码</h4>
      <p v-for="(item, i) in outModelData" :key="i">{{ item }}</p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { getToolInformationByObjectCode } from '@/api/knifetool/store/storeRegister'

const dialogVisible = ref(false) // 弹窗的是否展示
// const detailLoading = ref(false) // 表单的加载中
const dialogTitle = ref('扫码出库')

const outNum = ref()
const currentRow = ref()

const outModelData = computed(() => {
  // let detailCode = this.form.tableData[this.tableIndex].data[this.rowIndex].detailCode
  if (currentRow.value.detailCode === '') {
    return []
  }
  // 将扫码的号拆分为数组
  return currentRow.value.detailCode.split(';').filter((item) => item.trim())
})

const emit = defineEmits(['handleAmount'])
const onOutCode = async () => {
  const dCodeIndex = currentRow.value.detailCode.split(';').indexOf(outNum.value)
  if (outNum.value === '') return
  if (dCodeIndex >= 0) {
    ElNotification({
      title: '警告',
      message: '该码已出库!',
      type: 'warning'
    })
    return
  } else {
    let res = await getToolInformationByObjectCode({ code: outNum.value })
    console.log(res)
    if (res === null) {
      ElNotification({
        title: '警告',
        message: '该物码不存在!',
        type: 'warning'
      })
    } else {
      if (res.code === currentRow.value.code) {
        // 扫码数量
        let thatAmount =
          currentRow.value.detailCode.split(';').filter((item) => item.trim()).length + 1
        if (thatAmount > currentRow.value.storeUse || thatAmount > currentRow.value.storeCount) {
          ElNotification({
            title: '警告',
            message: '出库数量不得大于可用数量!',
            type: 'warning'
          })
          return
        }
        currentRow.value.detailCode += outNum.value + ';'
        outNum.value = ''
        console.log(thatAmount)
        emit('handleAmount', thatAmount)
      } else {
        ElNotification({
          title: '警告',
          message: '该物码与当前库位不匹配，请重新录入!',
          type: 'warning'
        })
        return
      }
    }
  }
}

/** 打开弹窗 */
const open = async (row: any) => {
  dialogVisible.value = true

  console.log(row)
  outNum.value = ''
  currentRow.value = row
}
defineExpose({ open })
</script>

<style scoped></style>
