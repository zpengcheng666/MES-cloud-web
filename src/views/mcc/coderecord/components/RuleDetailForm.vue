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

      <el-table-column v-for="(item, index) in tableData" :key="index" :label="item.title" :prop="item.value">

        <template #default="scope">
        <el-input v-model="scope.row[scope.column.property]" :disabled="scope.column.property.indexOf('column')>-1" v-if="scope.column.property!='materialTypeCode'"/>


          <el-tree-select
                  v-model="scope.row[scope.column.property]"
                  :data="standardList"
                  :props="defaultProps"
                  check-strictly
                  default-expand-all
                  placeholder="请选择父类型id"
                  @change="getRow"
                  v-if="scope.column.property=='materialTypeCode'"
          />
          </template>

      </el-table-column>

    </el-table>
  </el-form>

</template>
<script setup lang="ts">
import { getIntDictOptions, getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { EncodingRuleApi } from '@/api/mcc/encodingrule'
import { MaterialTypeApi, MaterialTypeVO } from '@/api/mcc/materialtype'
import { defaultProps, handleTree } from '@/utils/tree'
const props = defineProps<{
  encodingRuleId: undefined, // 编码规则表ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref([])
const tableData = ref([])
const formRules = reactive({
  type: [{ required: true, message: '编码位类型不能为空', trigger: 'change' }],
  encodingRuleId: [{ required: true, message: '编码规则表ID不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  bitNumber: [{ required: true, message: '位数不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '描述名不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref
const standardList = ref<Tree[]>([]) // 树形结构
const standardList1 = ref([]) // 树形结构
const message = useMessage() // 消息弹窗


/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.encodingRuleId,
  async (val) => {
    // 1. 重置表单
    formData.value = []
      tableData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
        debugger
      formLoading.value = true
     const value  = await EncodingRuleApi.getRuleDetail(val)
        formData.value = value.dataList
        tableData.value = value.headTableAtts.map(column => {
            let temp = { title: column.columnLabel, value: column.columnName,type: column.columnType}
            return temp
        })


        const data = await MaterialTypeApi.getMaterialTypeList()

        data.forEach((item, index) => {
            standardList1.value.push(item)
        })
        standardList.value = handleTree(data, 'id', 'parentId')
        // const root: Tree = { id: '0', name: '总类别', children: [] }
        // root.children = handleTree(data, 'id', 'parentId')
        // standardList.value.push(root)

        //tandardList.value = handleTree(data, 'id', 'parentId')

    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}


const  getRow = async (id)=>{
    if (id=='0'){
        //formData.value.bitNumber = undefined;
        message.error("总类别不能选择")
        return
    }else{
        const row=  standardList1.value.find((item) => item.id == id)

        formData.value[0].materialTypeCode = row.code
    }


}

defineExpose({ validate, getData })
</script>