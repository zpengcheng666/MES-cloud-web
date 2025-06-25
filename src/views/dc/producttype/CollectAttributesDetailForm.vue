<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
    :disabled="formType == 'detail'"
  >
    <el-table :data="formData" class="mt-10px">
      <el-table-column label="序号" type="index" align="center" width="60" />

      <el-table-column label="采集属性名称" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.collectAttributesName`" :rules="formRules.collectAttributesName" class="mb-0px!" >
            <el-input v-model="row.collectAttributesName" maxlength="10" placeholder="请输入采集属性"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采集属性值" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.collectAttributesValue`" :rules="formRules.collectAttributesValue" class="mb-0px!" >
            <el-input v-model="row.collectAttributesValue" maxlength="20" placeholder="请输入采集属性值"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="单位" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.unit`" :rules="formRules.unit" class="mb-0px!" >
            <el-input v-model="row.unit" maxlength="10" placeholder="请输入单位"/>
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="采集参数类型" min-width="100">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.collectAttributesIlk`" :rules="formRules.collectAttributesIlk" class="mb-0px!" >
            <el-select-v2
              v-model="row.collectAttributesIlk"
              :options="getIntDictOptions(DICT_TYPE.COLLECT_ATTRIBUTES_ILK)"
              placeholder="选择采集参数类型"
              clearable
              class="!w-240px"
              @change="collectAttributesIlk(row,$index)"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column label="标准值" min-width="150">
        <template  #default="{ row, $index }">

          <div v-if="row.collectAttributesIlk === 1" style="display: flex;">
            <el-form-item style="flex: 1;" :prop="`${$index}.collectAttributesFloor`" :rules="formRules.collectAttributesFloor" class="mb-0px!" >
              <el-input v-model="row.collectAttributesFloor" type="number" placeholder="下限值" />
            </el-form-item>
          <span>&ensp;—&ensp;</span>
            <el-form-item style="flex: 1;" :prop="`${$index}.collectAttributesUpper`" :rules="formRules.collectAttributesUpper" class="mb-0px!" >
              <el-input v-model="row.collectAttributesUpper" type="number" placeholder="上限值" />
            </el-form-item>
          </div>

          <el-form-item v-if="row.collectAttributesIlk === 2 || row.collectAttributesIlk === undefined" :prop="`${$index}.collectAttributesNorm`" :rules="formRules.collectAttributesNorm" class="mb-0px!" >
            <el-input v-model="row.collectAttributesNorm" placeholder="请输入标准值" />
          </el-form-item>

          <el-form-item
            v-if="row.collectAttributesIlk === 3"
            :prop="`${$index}.collectAttributesEnum`"
            :rules="formRules.collectAttributesEnum"
            class="mb-0px!" >
            <el-input
              v-model="row.collectAttributesEnum"
              placeholder="请输入枚举值 枚举值之间使用空格分割"
              type="textarea"
            />
          </el-form-item>

        </template>
      </el-table-column>



<!--      <el-table-column label="标准上限" min-width="150">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.collectAttributesUpper`" :rules="formRules.collectAttributesUpper" class="mb-0px!" >-->
<!--            <el-input v-model="row.collectAttributesUpper" type="number" placeholder="请输入标准上限值" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="标准下限" min-width="150">-->
<!--        <template #default="{ row, $index }">-->
<!--          <el-form-item :prop="`${$index}.collectAttributesFloor`" :rules="formRules.collectAttributesFloor" class="mb-0px!" >-->
<!--            <el-input v-model="row.collectAttributesFloor" type="number" placeholder="请输入标准下限值" @input="validateInput" />-->
<!--          </el-form-item>-->
<!--        </template>-->
<!--      </el-table-column>-->


      <el-table-column align="center" fixed="right" label="操作" width="60" v-if="formType != 'detail'">
        <template #default="{ $index }">
          <el-button type="danger" @click="handleDelete($index)" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

  <el-row justify="center" class="mt-3" v-if="formType != 'detail'">
    <el-button @click="handleAdd" round>+ 添加 </el-button>
  </el-row>
</template>
<script setup lang="ts">

import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

const props = defineProps<{
  productTypeId: string
  formType: string
  collectAttributesDetails: undefined
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([]) as any
const {t} = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const formRules = reactive({
  collectAttributesName: [{ required: true, message: '采集属性名称不能为空', trigger: 'blur' }],
  collectAttributesValue: [{ required: true, message: '采集属性值不能为空', trigger: 'blur' }],
  collectAttributesIlk: [{ required: true, message: '采集属性类型不能为空', trigger: 'blur' }],
  collectAttributesCycle: [{ required: true, message: '采集周期不能为空', trigger: 'blur' }],
  collectAttributesUpper: [{ required: true, message: '标准上限值不能为空', trigger: 'blur' }],
  collectAttributesFloor: [{ required: true, message: '标准下限值不能为空', trigger: 'blur' }],
  collectAttributesEnum: [{ required: true, message: '枚举值不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const isValid = ref(true);
// /** 初始化设置产品项 */
watch(
  () => props.collectAttributesDetails,
  async (val) => {
    formData.value = val
  },
  // { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    productTypeId: undefined,
    collectAttributesName: undefined,
    collectAttributesValue: undefined,
    collectAttributesType: undefined,
    collectAttributesTopic: undefined,
    collectAttributesCycle: undefined,
    collectAttributesUpper: undefined,
    collectAttributesFloor: undefined,
    collectAttributesNorm: undefined,
    collectAttributesEnum: undefined,
    unit: undefined
  }
  row.productTypeId = props.productTypeId
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

const collectAttributesIlk = (row,index)=>{
  row.collectAttributesUpper = undefined
  row.collectAttributesFloor = undefined
  row.collectAttributesNorm = undefined
  row.collectAttributesEnum = undefined

}

defineExpose({ validate, getData })

</script>

<style>
.center-both {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
