<template>
  <el-row :gutter="20">
    <!-- 左侧数据包结构树 -->
    <el-col :span="5" :xs="24">
      <ContentWrap class="h-1/1">
        <StructureTree @node-click="handleStructureNodeClick" ref="childRefTree" />
      </ContentWrap>
    </el-col>
    <el-col :span="19" :xs="24">
      <ContentWrap>
        <el-button type="primary" v-show="addStructureBtn" @click="openForm('create')" plain
          v-hasPermi="['pdm:structure-definition:create']">
          <Icon icon="ep:plus" /> 新增结构
        </el-button>
        <el-button type="primary" v-show="addFolderBtn" @click="openFormFolder('create')" plain
          v-hasPermi="['pdm:structure-definition:create']">
          <Icon icon="ep:plus" /> 新增文件夹
        </el-button>
        <el-button type="primary" v-show="addFileBtn" @click="openFormFile('create')" plain
          v-hasPermi="['pdm:structure-definition:create']">
          <Icon icon="ep:plus" /> 新增文件
        </el-button>
        <el-button type="danger" v-show="!addStructureBtn" @click="handleDelete()" plain
          v-hasPermi="['pdm:structure-definition:create']">
          <Icon icon="ep:delete" /> 删除节点
        </el-button>
      </ContentWrap>
      <ContentWrap class="h-1/1">
        <el-form ref="formRefUpdate" :model="formData" :rules="formRules" label-width="120px">
          <el-form-item label="节点名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入节点名称" />
          </el-form-item>
          <el-form-item v-show="structureForm" label="压缩包方式" prop="compressType">
            <el-input v-model="formData.compressType" placeholder="厂家名称+年月日.zip" disabled />
          </el-form-item>
          <el-form-item v-show="structureForm" label="编制单位" prop="designUnit">
            <el-input v-model="formData.designUnit" placeholder="沈飞民机" />
          </el-form-item>
          <el-form-item v-show="structureForm" label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value"
                :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="fileForm" label="文件类型" prop="fileType">
            <el-radio-group v-model="formData.fileType">
              <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.PDM_FILE_TYPE)" :key="dict.value"
                :label="dict.value">
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="fileForm" v-if="formData.fileType === 2" label="excel列表起始行" prop="startRow">
            <el-input-number v-model="formData.startRow" :min="1" clearable controls-position="right" />
          </el-form-item>
          <!-- 子表的表单 -->
          <el-tabs v-model="subTabsName" v-show="fileForm" v-if="formData.fileType === 2">
            <el-tab-pane label="excel规则详情" name="structureExcel">
              <StructureExcelForm ref="structureExcelFormRef" :structure-id="formData.id" />
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <el-button @click="submitForm" type="primary" v-show="saveBtn" style="margin-left:120px">确 定</el-button>
      </ContentWrap>
    </el-col>
  </el-row>

  <!-- 数据结构表单弹窗 -->
  <StructureForm ref="formRef" @success="refreshTree" />
  <!-- 文件夹表单弹窗 -->
  <FolderForm ref="formRefFolder" @success="refreshTree" />
  <!-- 文件表单弹窗 -->
  <FileForm ref="formRefFile" @success="refreshTree" />

</template>
<script setup lang="ts">
import StructureTree from './StructureTree.vue'
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { StructureApi } from "@/api/pdm/structureDefinition";
import StructureForm from "./StructureForm.vue";
import FolderForm from "./FolderForm.vue";
import FileForm from "./FileForm.vue";
import StructureExcelForm from "./StructureExcelForm.vue";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const saveBtn = ref(true) //保存按钮显隐
const addStructureBtn = ref(true) //新增结构按钮显隐
const addFolderBtn = ref(true) //新增文件夹按钮显隐
const addFileBtn = ref(true) //新增文件按钮显隐
const structureForm = ref(true) //结构节点表单项显隐
const folderForm = ref(true) //文件夹节点表单项显隐
const fileForm = ref(true) //文件节点表单项显隐

//拿到子组件实例
const childRefTree = ref()

/** 处理数据包结构树被点击 */
const handleStructureNodeClick = async (row) => {
  formData.value = await StructureApi.getStructure(row.id)
  if (row.type === 0) {//根节点
    saveBtn.value = false;
    addStructureBtn.value = true;
    addFolderBtn.value = false;
    addFileBtn.value = false;

    structureForm.value = false;
    folderForm.value = false;
    fileForm.value = false;
  } else {
    saveBtn.value = true;
    addStructureBtn.value = false;
    if (row.type === 1) {//结构节点
      addFolderBtn.value = true;
      addFileBtn.value = true;

      structureForm.value = true;
      folderForm.value = false;
      fileForm.value = false;
    } else if (row.type === 2) {//文件夹节点
      addFolderBtn.value = true;
      addFileBtn.value = true;

      folderForm.value = true
      structureForm.value = false;
      fileForm.value = false
    } else if (row.type === 3) {//文件节点
      addFolderBtn.value = false;
      addFileBtn.value = false;

      fileForm.value = true;
      structureForm.value = false;
      folderForm.value = false;
    }
  }
}
const formData = ref({
  id: undefined,
  name: undefined,
  compressType: '厂家名称+年月日.zip',
  designUnit: '',
  status: undefined,
  fileType: undefined,
  startRow: undefined
})
const formRules = reactive({
  name: [{ required: true, message: '节点名称不能为空', trigger: 'blur' }],
})

/** excel子表的表单 */
const subTabsName = ref('structureExcel')
const structureExcelFormRef = ref()

const formRefUpdate = ref() // 更改表单Ref
const submitForm = async () => {
  // 校验表单
  await formRefUpdate.value.validate()
  if (formData.value.fileType === 2) {//excel
    // 校验excel子表单
    try {
      await structureExcelFormRef.value.validate()
    } catch (e) {
      subTabsName.value = 'structureExcel'
      return
    }
  }
  try {
    const data = formData.value as unknown as StructureApi.StructureVO
    if (formData.value.fileType === 2) {
      // 拼接excel子表的数据
      data.structureExcels = structureExcelFormRef.value.getData()
    }
    await StructureApi.updateStructure(data)
    message.success(t('common.updateSuccess'))
    // 刷新树
    await refreshTree()
  } finally {
  }
}

const formRef = ref() // 数据结构表单 Ref
const openForm = (type: string) => {
  formRef.value.open(type, formData.value.id, 1)
}

const formRefFolder = ref() // 文件夹表单 Ref
const openFormFolder = (type: string) => {
  formRefFolder.value.open(type, formData.value.id, 2, formData.value.absolutePath)
}

const formRefFile = ref() // 文件表单 Ref
const openFormFile = (type: string) => {
  formRefFile.value.open(type, formData.value.id, 3, formData.value.absolutePath)
}

/** 刷新树 */
const refreshTree = async () => {
  if (childRefTree.value) {
    childRefTree.value.getTree();
  }
}

/** 删除按钮操作 */
const handleDelete = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StructureApi.deleteStructure(formData.value.id)
    message.success(t('common.delSuccess'))
    // 刷新树
    await refreshTree()
  } catch { }
}



</script>
