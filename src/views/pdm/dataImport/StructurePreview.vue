<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-row :gutter="20">
      <!-- 左侧数据包结构树 -->
      <el-col :span="8" :xs="24">
        <ContentWrap class="h-1/1">
          <StructureTree @node-click="handleStructureNodeClick" ref="childRefTree" :structure-id="parentStructureId" />
        </ContentWrap>
      </el-col>
      <el-col :span="16" :xs="24">
        <ContentWrap class="h-1/1">
          <el-form
            ref="formRefUpdate"
            :model="formData"
            label-width="120px"
          >
            <el-form-item label="节点名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入节点名称" disabled />
            </el-form-item>
            <el-form-item v-show="structureForm" label="压缩包方式" prop="compressType">
              <el-input v-model="formData.compressType" placeholder="zip" disabled />
            </el-form-item>
            <el-form-item v-show="structureForm" label="编制单位" prop="designUnit">
              <el-input v-model="formData.designUnit" placeholder="沈飞民机" disabled />
            </el-form-item>
            <el-form-item v-show="structureForm" label="状态" prop="status">
              <el-radio-group v-model="formData.status" disabled>
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="fileForm" label="文件类型" prop="fileType">
              <el-radio-group v-model="formData.fileType" disabled>
                <el-radio
                  v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FILE_TYPE)"
                  :key="dict.value"
                  :label="dict.value"
                >
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="fileForm" v-if="formData.fileType===2" label="excel列表起始行" prop="startRow">
              <el-input-number v-model="formData.startRow" :min="1" clearable controls-position="right" disabled />
            </el-form-item>
            <!-- 子表的表单 -->
            <el-tabs v-model="subTabsName" v-show="fileForm" v-if="formData.fileType===2">
              <el-tab-pane label="excel规则详情" name="structureExcel">
                <StructureExcelForm ref="structureExcelFormRef" :structure-id="formData.id" />
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </ContentWrap>
      </el-col>
    </el-row>
  </Dialog>
</template>
<script setup lang="ts">
import StructureTree from './StructureTree.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {StructureApi} from "@/api/pdm/structureDefinition";
import StructureExcelForm from "./StructureExcelForm.vue";

/** PDM 数据包结构 表单 */
defineOptions({ name: 'StructurePreview' })

const structureForm = ref(true) //结构节点表单项显隐
const folderForm = ref(true) //文件夹节点表单项显隐
const fileForm = ref(true) //文件节点表单项显隐

//拿到子组件实例
const childRefTree = ref()

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const parentStructureId = ref() // 数据包结构预览时传递的结构id

/** 打开弹窗 */
const open = async (structureId: number) => {
  dialogVisible.value = true
  dialogTitle.value = '预览'
  parentStructureId.value = structureId;
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 处理数据包结构树被点击 */
const handleStructureNodeClick = async (row) => {
  formData.value = await StructureApi.getStructure(row.id)
  if(row.type===0) {//根节点
    structureForm.value = false;
    folderForm.value = false;
    fileForm.value = false;
  } else {
    if(row.type===1) {//结构节点
      structureForm.value = true;
      folderForm.value = false;
      fileForm.value = false;
    } else if(row.type===2) {//文件夹节点
      folderForm.value = true
      structureForm.value = false;
      fileForm.value = false
    } else if(row.type===3) {//文件节点
      fileForm.value = true;
      structureForm.value = false;
      folderForm.value = false;
    }
  }
}
const formData = ref({
  id: undefined,
  name: undefined,
  compressType: 'zip',
  designUnit: '',
  status: undefined,
  fileType: undefined,
  startRow: undefined
})

/** excel子表的表单 */
const subTabsName = ref('structureExcel')
const structureExcelFormRef = ref()


</script>
