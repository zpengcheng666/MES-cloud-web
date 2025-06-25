<template>
  <ContentWrap style="width: 100%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :inline="true"
      style="margin-bottom: 20px"
      v-if="props.disabled != true"
    >
      <el-form-item label="备件选择" prop="partId">
        <el-select-v2
          v-model="formData.partId"
          :options="spareparList.filter((v) => v.number != 0)"
          filterable
          clearable
          placeholder="选择备件"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="使用数量" prop="number">
        <el-input-number v-model="formData.number" :min="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="handleAddData">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data" style="width: 100%">
      <el-table-column label="备件编码" align="center">
        <template #default="scope">
          {{ getSparePart(scope.row.partId)?.code }}
        </template>
      </el-table-column>
      <el-table-column label="备件名称" align="center">
        <template #default="scope">
          {{ getSparePart(scope.row.partId)?.name }}
        </template>
      </el-table-column>
      <el-table-column label="备件类型" align="center">
        <template #default="scope">
          {{ getSparePart(scope.row.partId)?.type }}
        </template>
      </el-table-column>
      <el-table-column prop="number" label="数量" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="danger" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
defineOptions({ name: 'SparePartSelect' })

const message = useMessage() // 消息弹窗

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
}) //属性

/**************************************初始化***********************************/

onMounted(async () => {
  await getSparePartList() //加载备件数据
  resetForm() //重置新增表单
  getModelToData() //初始化数据
})

/**************************************双向绑定相关********************************/

const model = defineModel() //双向绑定
let monitor_data_modification = true //是否监听数据修改

const data: any = ref([])
//显示数据

watch(
  () => model.value,
  () => {
    getModelToData()
  },
  { deep: true }
)
//监听绑定值修改

function getModelToData() {
  if (monitor_data_modification == true) {
    if (model.value != undefined && model.value != null) {
      data.value = model.value
    } else {
      data.value = []
      pushDataToModel()
    }
  }
}
//从双向绑定获得数据

function pushDataToModel() {
  monitor_data_modification = false
  model.value = data.value
  monitor_data_modification = true
}
//将数据转移到绑定值

/**********************************************新增表单******************************/

const formData = ref({
  partId: undefined, //备件id
  number: undefined //使用数量
})
//表单数据
const formRef = ref() //表单ref
const formRules = reactive({
  partId: [{ required: true, message: '请选择备件', trigger: 'blur' }],
  number: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
})
//表单规则

function resetForm() {
  formData.value = {
    partId: undefined, //备件id
    number: undefined //使用数量
  }
}
//重置表单

async function handleAddData() {
  await formRef.value.validate()

  if (getSparePart(formData.value.partId)?.number < formData.value.number) {
    message.error('备件数量不足')
    return
  }
  if (data.value.some((v) => v.partId == formData.value.partId)) {
    message.error('重复备件')
    return
  }

  data.value.push(formData.value)
  pushDataToModel()
  resetForm()
}
//新增操作

/*********************************************表格操作*******************************/

//删除操作
function handleDelete(scope) {
  data.value.splice(scope.$index, 1)
  pushDataToModel()
}

/**********************************************备件/备品数据***************************/

import { SparePartApi, SparePartVO } from '@/api/dms/sparepart'

const spareparList = ref<any[]>([])
const getSparePartList = async () => {
  const data = await SparePartApi.getSparePartList()
  spareparList.value = []
  for (let v of data) {
    spareparList.value.push({
      label: v.code + ' - ' + v.name,
      value: v.id,
      key: v.id,
      ...v
    })
  }
}
const getSparePart = (value) => {
  return spareparList.value.find((v) => v.value == value)
}
</script>
