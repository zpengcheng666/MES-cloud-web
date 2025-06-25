<template>
  <div style="width: 100%; margin-bottom: 10px">
    <el-row style="width: 100%" :gutter="10">
      <el-col :span="5">
        <el-select-v2
          v-model="moonOptionSelect"
          :options="moonOptionOptions"
          placeholder="请选择月模式"
          @change="moonOptionChange"
        />
      </el-col>
      <el-col :span="13">
        <el-select-v2
          v-model="moonSelect"
          :options="getNumberList(1, 12)"
          placeholder="选择指定月"
          multiple
          @change="change"
          :disabled="moonEnabled"
          collapse-tags
          collapse-tags-tooltip
          clearable
          :max-collapse-tags="5"
        />
      </el-col>
    </el-row>

    <el-row style="width: 100%" :gutter="10">
      <el-col :span="5">
        <el-select-v2
          v-model="dayOptionSelect"
          :options="dayOptionOptions"
          placeholder="请选择天模式"
          @change="dayOptionChange"
        />
      </el-col>
      <el-col :span="13">
        <el-select-v2
          v-model="daySelect"
          :options="getNumberList(1, 31)"
          placeholder="选择指定天"
          multiple
          @change="change"
          :disabled="dayEnabled"
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="5"
        />
      </el-col>
    </el-row>

    <el-time-picker
      v-model="timeSelect"
      value-format="s m H"
      placeholder="触发时间"
      @change="change"
    />
  </div>
</template>
<script setup lang="ts">
/************************月处理********************************/
const moonOptionSelect = ref(1)
const moonOptionOptions = [
  {
    value: 1,
    label: '每月'
  },
  {
    value: 2,
    label: '指定月'
  }
]
function moonOptionChange() {
  if (moonOptionSelect.value == 1) {
    moonEnabled.value = true
    moonSelect.value = []
  } else if (moonOptionSelect.value == 2) {
    moonEnabled.value = false
  }

  change()
}
const moonSelect = ref([])
const moonEnabled = ref(true)

function getMoon() {
  if (moonOptionSelect.value == 1) {
    return '*'
  } else if (moonOptionSelect.value == 2) {
    if (moonSelect.value.length == 0) {
      return '1'
    }
    return moonSelect.value.toString()
  }
}
function setMoon(s) {
  if (s == '*') {
    moonOptionSelect.value = 1
    moonEnabled.value = true
    moonSelect.value = []
  } else {
    moonOptionSelect.value = 2
    moonEnabled.value = false
    moonSelect.value = s.split(',').map((v) => Number.parseInt(v))
  }
}

/***********************天处理***************************/

const dayOptionSelect = ref(1)
const dayOptionOptions = [
  {
    value: 1,
    label: '每天'
  },
  {
    value: 2,
    label: '指定天'
  },
  {
    value: 3,
    label: '最后一天'
  }
]
function dayOptionChange() {
  if (dayOptionSelect.value == 1) {
    dayEnabled.value = true
    daySelect.value = []
  } else if (dayOptionSelect.value == 2) {
    dayEnabled.value = false
  } else if (dayOptionSelect.value == 3) {
    dayEnabled.value = true
    daySelect.value = []
  }

  change()
}
const daySelect = ref([])
const dayEnabled = ref(true)
function getday() {
  if (dayOptionSelect.value == 1) {
    return '*'
  } else if (dayOptionSelect.value == 2) {
    if (daySelect.value.length == 0) {
      return '1'
    }
    return daySelect.value.toString()
  } else if (dayOptionSelect.value == 3) {
    return 'L'
  }
}

function setDay(s) {
  if (s == '*') {
    dayOptionSelect.value = 1
    dayEnabled.value = true
    daySelect.value = []
  } else if (s == 'L') {
    dayOptionSelect.value = 3
    dayEnabled.value = true
    daySelect.value = []
  } else {
    dayOptionSelect.value = 2
    dayEnabled.value = false
    daySelect.value = s.split(',').map((v) => Number.parseInt(v))
  }
}

/*********************时间处理**********************/

const timeSelect = ref()

function getTime() {
  if (isBlank(timeSelect.value)) {
    return '0 0 0'
  } else {
    return timeSelect.value
  }
}

function setTime(s, m, h) {
  timeSelect.value = `${s} ${m} ${h}`
}

/*************************主要处理***************************/
const model = defineModel()
function change() {
  let cronStr = getTime()
  cronStr += ' '
  cronStr += getday()
  cronStr += ' '
  cronStr += getMoon()
  cronStr += ' ? *'
  model.value = cronStr
}

function init() {
  const str: string = model.value as any
  if (isBlank(str)) return
  const array = str.split(' ')
  setTime(array[0], array[1], array[2])
  setDay(array[3])
  setMoon(array[4])
}

function checkDay() {
  for (let v of daySelect.value) {
    if (v == 29 || v == 30 || v == 31) return false
  }
  return true
}
defineExpose({ init, checkDay })

/*********************************工具************************/
function getNumberList(start, end) {
  const array: any[] = []
  for (let i = start; i <= end; i++) {
    array.push({
      value: i,
      label: '' + i
    })
  }
  return array
}

function isBlank(v: any): boolean {
  if (v == undefined || v == null) {
    return true
  }
  if (typeof v?.trim == 'function' && v.trim() == '') {
    return true
  }
  return false
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}

.el-time-picker {
  margin-bottom: 10px;
}
</style>
