<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
       <el-table-column label="开始时间" min-width="150">
        <template #default="{ row, $index }">
          <!--<el-form-item :prop="`${$index}.startTime`" :rules="formRules.startTime" class="mb-0px!">-->
            <!--<el-date-picker-->
              <!--v-model="row.startTime"-->
              <!--type="time"-->
              <!--value-format="x"-->
              <!--placeholder="选择开始时间"-->
            <!--/>-->
          <!--</el-form-item>-->
          <el-form-item :prop="`${$index}.startTime`" :rules="formRules.startTime" class="mb-0px!">
            <el-time-picker
              v-model="row.startTime"
              value-format="HH:mm"
              placeholder="选择开始时间"
              format="HH:mm"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.endTime`" :rules="formRules.endTime" class="mb-0px!">
            <el-time-picker
              v-model="row.endTime"
              value-format="HH:mm"
              placeholder="选择结束时间"
              format="HH:mm"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加班次时间</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ShiftTypeApi } from '@/api/pms/calendarshift/shifttype'

const props = defineProps<{
  typeId: undefined // 类型id（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const formRules = reactive({
  typeId: [{ required: true, message: '类型id不能为空', trigger: 'blur' }],
  startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
  endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.typeId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await ShiftTypeApi.getShiftTimeListByTypeId(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    typeId: undefined,
    startTime: undefined,
    endTime: undefined,
  }
  row.typeId = props.typeId
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

/** 表单值 */
const setData = (row) => {
  formData.value = row
}

defineExpose({ validate, getData, setData })
</script>
