<template>
  <el-table :data="data" border height="65vh">
    <el-table-column prop="value" label="选择" width="70px">
      <template #default="scope">
        <el-checkbox
          v-model="scope.row.value"
          @change="
            (event) => {
              funChange(event, scope.row)
            }
          "
        />
      </template>
    </el-table-column>
    <el-table-column prop="project" label="检查项目" />
    <el-table-column prop="standard" label="检查标准" />
    <el-table-column prop="time" label="检测时间" />
    <el-table-column prop="user" label="记录人" />
  </el-table>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'

const model = defineModel()
const props = defineProps(['disabled', 'orangedata'])
const useUser = useUserStore()

let isOK = 0
watch(
  () => props.orangedata,
  () => {
    if (props.orangedata && isOK == 0) {
      try {
        reSet()
        isOK = 1
      } catch (e) {}
    }
  }
)

const data = ref<any[]>([])

defineExpose({ reSet })
function reSet() {
  data.value = JSON.parse(props.orangedata as string)
  data.value = data.value.map((v) => {
    return {
      value: v.value == undefined ? null : v.value,
      time: v.time == undefined ? null : v.time,
      user: v.user == undefined ? null : v.user,
      ...v
    }
  })
  model.value = JSON.stringify(data.value)
}

function funChange(e, r) {
  if (props.disabled) {
    r.value = !e
  } else {
    if (e == false) {
      r.time = null
      r.user = null
    } else {
      r.time = formatDate(new Date())
      r.user = useUser.user.nickname
    }
    model.value = JSON.stringify(data.value)
  }
}

function formatDate(date) {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}
</script>
