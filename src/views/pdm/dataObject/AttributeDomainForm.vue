<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" v-loading="formLoading" width="1200px" max-height="700px">
    <el-button type="primary" @click="openNewForm('create')">
      <Icon icon="ep:plus" class="mr-5px" />
      新增属性
    </el-button>
    <ContentWrap>
      <el-table :data="attrsDataList" style="height:400px;overflow-y: auto" :ref="formRef">
        <el-table-column align="center" type="index" label="序号" width="100" prop="LAY_TABLE_INDEX" />
        <el-table-column align="center" label="属性英文名称" prop="attr_name" />
        <el-table-column align="center" label="属性中文名称" prop="attr_alias" />
        <el-table-column align="center" label="类型" prop="attr_type" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PDM_DATAOBJECT_TYPE" :value="scope.row.attr_type"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="长度" prop="attr_length" />
        <el-table-column align="center" label="单位" prop="attr_unit" />
        <el-table-column align="center" label="默认值" prop="attr_default" />
        <el-table-column align="center" label="是否多值" prop="is_more_value" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PDM_DATAOBJECT_IS_VALUE" :value="scope.row.is_more_value"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效值组" prop="effective_value" />
        <el-table-column label="操作" width="150" align="center">
          <template #default="{scope,$index}">
            <el-button type="primary" @click="updateAttr(scope.row)" size="small">
              编辑 </el-button>
            <el-button type="danger" @click="deleteAttr($index)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" :disabled="formLoading" type="primary" >确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  <AttributeDomainAddForm ref="editDomainAddForm" @success="getAttrsList" />

  <UpdateAttrForm ref="updateAttrForm" />
</template>
<script setup lang="ts">
import { DataObjectApi, DataObjectVO } from '@/api/pdm/dataObject'
import AttributeDomainAddForm from './AttributeDomainAddForm.vue';
import UpdateAttrForm from './UpdateAttrForm.vue';
import {DICT_TYPE} from "@/utils/dict";
/** 产品数据对象 表单 */
defineOptions({ name: 'DataObjectFormDetail' })
const dialogTitle = ref('') // 弹窗的标题
const attrsDataList = ref([]) // 属性信息
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const dialogVisible = ref(false) // 弹窗的是否展示
const formRef = ref() // 表单 Ref

//操作的编辑按钮
const updateAttrForm = ref()
const updateAttr = (row) => {
  updateAttrForm.value.open(row)
}

//新增属性按钮
const editDomainAddForm = ref()
const openNewForm = (type: string, id?: number) => {
  editDomainAddForm.value.open(type, id)
}


const idattr = ref('')
/** 打开弹窗 */
const open = async (id?: number) => {
      dialogTitle.value = '属性域'
      idattr.value = id
      attrsDataList.value = await DataObjectApi.getSelectOneById(id);
  dialogVisible.value = true
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const submitForm = async () => {
  const data = {}
  data.customizedAttrsList = attrsDataList.value
  data.id = idattr.value
  attrsDataList.value = await DataObjectApi.updateIndex(data)
  dialogVisible.value = false

}



const getAttrsList = async (data) => {
  attrsDataList.value.push(data)
}

/** 删除按钮操作 */
const deleteAttr = async (index) => {
  attrsDataList.value.splice(index, 1)
}

</script>
<style>
/* 添加自定义CSS样式 */
.custom-divider .el-divider__text {
  font-size: 20px;
  /* 调整文本大小 */
}
</style>
