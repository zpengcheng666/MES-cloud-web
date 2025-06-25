<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px" max-height="700px">
    <ContentWrap>
      <el-table ref="multipleTable" :data="attrsDataList" style="height:400px;overflow-y: auto">
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
        <el-table-column label="是否多值" align="center">
          <template #default="scope">
            {{ scope.row.is_more_value == '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效值组" prop="effective_value" />
      </el-table>
    </ContentWrap>
  </Dialog>
</template>
<script setup lang="ts">
import { DataObjectApi } from '@/api/pdm/dataObject'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
/** 产品数据对象 表单 */
defineOptions({ name: 'DataObjectFormDetail' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const attrsDataList = ref([]) // 属性信息

/** 打开弹窗 */
const open = async (id?: number) => {
  //对话框显示
  dialogVisible.value = true
  dialogTitle.value = '查看详细'
  if (id) {
    attrsDataList.value = await DataObjectApi.getSelectOneById(id);
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
