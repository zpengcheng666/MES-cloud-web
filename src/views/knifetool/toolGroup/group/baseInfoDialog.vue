<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="65%">
    <!-- 刀具品牌、刀具型号、刀具分类、刀具类型 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="刀具品牌：" required />
        <el-form-item prop="toolBrandId">
          <el-select v-model="formData.toolBrandId" :disabled="!editOrView" placeholder="请选择刀具品牌" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_BRAND)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具型号：" />
        <el-form-item prop="toolModel">
          <el-input v-model="formData.toolModel" :disabled="!editOrView" placeholder="请输入刀具型号" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具分类：" required />
        <el-form-item prop="toolCategoryId">
          <el-tree-select placeholder="请选择刀具分类" check-strictly :props="defaultProps" v-model="formData.toolCategoryId"
            :disabled="!editOrView" :data="treeSelect" :render-after-expand="false" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具类型：" required />
        <el-form-item prop="toolTypeId">
          <el-select v-model="formData.toolTypeId" :disabled="!editOrView" placeholder="请选择刀具类型" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_TYPE)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 刀具名称、刀具材质、刀具涂层、满盒数量 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="刀具名称：" required />
        <el-form-item prop="name">
          <el-input v-model="formData.name" :disabled="!editOrView" placeholder="请输入刀具名称" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具材质：" />
        <el-form-item prop="toolMaterialId">
          <el-select v-model="formData.toolMaterialId" :disabled="!editOrView" placeholder="请选择刀具材质" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_MATERIAL)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具涂层：" />
        <el-form-item prop="toolCoverage">
          <el-input v-model="formData.toolCoverage" :disabled="!editOrView" placeholder="请输入刀具涂层" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="满盒数量：" />
        <el-form-item prop="fullNumber">
          <el-input v-model="formData.fullNumber" :disabled="!editOrView" placeholder="请输入满盒数量" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 重量（Kg）、管理方式、加工材质、刀具类码 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="重量(Kg)：" />
        <el-form-item prop="weight">
          <el-input-number style="width: 100%;" v-model="formData.weight" :min="0.0" :precision="2"
            :disabled="!editOrView" placeholder="请输入重量(Kg)" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="管理方式：" required />
        <el-form-item prop="manageType">
          <el-select v-model="formData.manageType" :disabled="!editOrView" placeholder="请选择管理方式" clearable>
            <el-option v-for="item in manageTypeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="加工材质：" />
        <el-form-item prop="processMaterialId">
          <el-select v-model="formData.processMaterialId" :disabled="!editOrView" placeholder="请选择加工材质" clearable>
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_PROCESS_MATERIAL)" :key="dict.value"
              :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="刀具类码：" />
        <el-form-item prop="code">
          <el-input v-model="formData.code" :disabled="!editOrView" placeholder="请输入刀具类码" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 供应商 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="供应商：" />
        <el-form-item prop="supplier">
          <el-input v-model="formData.supplier" :disabled="!editOrView" placeholder="请输入供应商" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 文件上传 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never" style="height: 100%;">
          <template #header>
            <div class="clearfix">
              <span>图片上传 (支持文件：bmp,jpg,jpeg,png,tif,gif,svg,psd,stl)</span>
            </div>
          </template>
          <div class="text item">
            <el-upload v-model:file-list="picFileList" :action="uploadUrl" list-type="picture-card"
              :on-preview="handlePictureCardPreview" :http-request="httpRequest" :disabled="!editOrView"
              accept=".bmp,.jpg,.jpeg,.png,.tif,.gif,.svg,.psd,.stl">
              <el-icon>
                <Plus />
                <span>上传图片</span>
              </el-icon>
              <br />
              <!-- <span>上传图片</span> -->
            </el-upload>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" style="height: 100%;">
          <template #header>
            <div class="clearfix">
              <span>附件上传 (支持文件：doc,docx,xlsx,xls,txt)</span>
            </div>
          </template>
          <div class="text item">
            <el-upload v-model:file-list="docFileList" class="upload-demo" :action="uploadUrl" :data="data" multiple
              :on-preview="handlePreview" :disabled="!editOrView" :http-request="httpRequest"
              accept=".doc,.docx,.xlsx,.xls,.txt" drag>
              <el-button type="primary">
                <Icon icon="ep:upload" class="mr-5px" /> 上传文件
              </el-button>
            </el-upload>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <!-- 几何参数 -->
    <el-row>
      <el-col>
        <el-card shadow="never">
          <template #header>
            <div class="clearfix">
              <span>几何参数</span>
            </div>
          </template>
          <el-table :data="formData.templateDataList" border style="width: 100%; text-align: center;">
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="abbr" label="缩写" align="center" />
            <el-table-column prop="value" label="值" align="center">
              <template #default="scope">
                <el-input placeholder="请输入" :disabled="!editOrView"
                  v-model="formData.templateDataList[scope.$index].value" :maxLength="64" />
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center" />
            <template #empty>
              <div class="empty">
                <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
              </div>
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <!-- 切削参数 -->
    <el-row>
      <el-col>
        <el-card shadow="never">
          <template #header>
            <div class="clearfix">
              <span>切削参数</span>
            </div>
          </template>
          <el-table :data="formData.cutParamList" border style="width: 100%; text-align: center;">
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="abbr" label="缩写" align="center" />
            <el-table-column prop="value" label="值" align="center">
              <template #default="scope">
                <el-input placeholder="请输入" :disabled="!editOrView" v-model="formData.cutParamList[scope.$index].value"
                  :maxLength="64" />
              </template>
            </el-table-column>
            <el-table-column prop="unit" label="单位" align="center" />
            <template #empty>
              <div class="empty">
                <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
              </div>
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <!-- 适配刀柄 -->
    <el-row>
      <el-col>
        <el-card shadow="never">
          <template #header>
            <div class="clearfix">
              <span>适配刀柄</span>
            </div>
          </template>
          <el-table :data="formData.handle" border style="width: 100%; text-align: center;">
            <el-table-column prop="code" label="刀柄类码" align="center" />
            <el-table-column prop="name" label="刀柄名称" align="center" />
            <el-table-column prop="spec" label="通用规格" align="center" />
            <template #empty>
              <div class="empty">
                <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
              </div>
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="dialogVisible = false" type="primary">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 图片 -->
  <Dialog v-model="imgDialogVisible" :title="options.title" width="1200px">
    <el-image v-show="dialogImageUrl !== ''" :key="dialogImageUrl" :src="dialogImageUrl" lazy alt="Preview Image" />
  </Dialog>
</template>

<script setup lang="ts">

import { useUpload } from '@/components/UploadFile/src/useUpload'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as InfoApi from '@/api/knifetool/tool/info'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';
import { handleTree } from '@/utils/tree'
import { getCategoryList } from '@/api/knifetool/tool/category'
import { getInformation } from '@/api/knifetool/tool/info'
import { number } from 'vue-types';

const { uploadUrl, httpRequest } = useUpload()
const picFileList = ref<UploadUserFile[]>([])
const docFileList = ref<UploadUserFile[]>([])
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const { t } = useI18n() // 国际化
const editOrView = ref(false) // 是否显示
const treeSelect = ref<any>([]) // 刀具分类数据
const data = ref({ path: '' })
const manageTypeList = ref([{ id: 1, name: '采购入库赋一物一码' }, { id: 2, name: '出库赋一物一码' }, { id: 3, name: '按数量管理' }])
const formData = ref<{
  id: null,//后台根据id时候为null判断是新增还是修改
  name: "",//刀具名称
  code: "",//刀具类码
  toolMaterialId: undefined,//刀具材质
  toolCoverage: "",//刀具涂层
  fullNumber: undefined,//满盒数量
  weight: undefined,//重量（KG）
  manageType: undefined,//管理方式
  processMaterialId: undefined,//加工材质
  supplier: "",//供应商
  toolBrandId: undefined,//刀具品牌
  toolModel: "",//刀具型号
  toolCategoryId: undefined,//刀具分类
  toolTypeId: undefined,//刀具类型
  remark: "",//备注
  picFileList: [],//图片上传缓存
  imgList: []
  docFileList: [],//文档上传缓存
  fileList: []
  fileListUrl: [],//上传的文件路径
  handle: ChildrenItem[]
  adapterList: ChildrenItem[]
  templateParamList: TemplateItem[]//参数模板
  templateDataList: TemplateItem[]//几何参数模板
  geoParamList: []
  cutParamList: TemplateItem[]//切削参数
  attachmentList: Datal[] //合并后的文件上传
  adapters: string//适配的刀柄/刀具， 多个逗号分开
  type: 1
}>({
  id: null, //后台根据id时候为null判断是新增还是修改
  name: "",
  code: "",
  toolMaterialId: undefined,//刀具材质
  toolCoverage: "",//刀具涂层
  fullNumber: undefined,//满盒数量
  weight: undefined,//重量（KG）
  manageType: undefined,//管理方式
  processMaterialId: undefined,//加工材质
  supplier: "",//供应商
  toolBrandId: undefined,//刀具品牌
  toolModel: "",//刀具型号
  toolCategoryId: undefined,//刀具分类
  toolTypeId: undefined,//刀具类型
  remark: '', //备注s
  picFileList: [],//图片上传缓存
  imgList: [],
  docFileList: [],//文档上传缓存
  fileList: [],
  fileListUrl: [], //上传的文件路径
  handle: [],
  adapterList: [],
  templateParamList: [],//参数模板
  templateDataList: [],//几何参数模板
  geoParamList: [],
  cutParamList: [],//切削参数
  attachmentList: [], //合并后的文件上传
  adapters: "",//适配的刀盘， 多个逗号分开
  type: 1
})

const options = reactive({
  src: "",
  poster: '', //封面,
  title: ''
})

// 打开弹窗
const open = async (data: any) => {
  console.log(data)
  dialogVisible.value = true
  dialogTitle.value = "刀具信息详情"
  getCategoryTree()
  getData({ id: data.id })
}

// 暴露 - 提供 open 方法，用于打开弹窗
defineExpose({ open })

/** 刀具分类数据获取 */
const getCategoryTree = async () => {
  const data = await getCategoryList({ type: 1, state: 1 })
  treeSelect.value = handleTree(data, 'id', 'pid')
}

/** 刀具详情获取 */
const getData = async (id: any) => {
  const data = await getInformation(id)
  formData.value = data;
  picFileList.value = formData.value.imgList
  docFileList.value = formData.value.fileList
  formData.value.templateDataList = formData.value.geoParamList
  if (null !== formData.value.adapterList) {
    formData.value.handle = formData.value.adapterList
  } else {
    formData.value.handle = []
  }
  console.log(formData.value)
}
const dialogImageUrl = ref('')
const imgDialogVisible = ref(false)
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
  dialogImageUrl.value = uploadFile.url!
  imgDialogVisible.value = true
}

const handlePreview = (uploadFile) => {

  console.log(uploadFile)
  if (uploadFile.url) {
    downloadFunc(uploadFile.url, uploadFile.name)
  } else {
    downloadFunc(uploadFile.response.data, uploadFile.name)
  }

  // 文件下载方法
  function downloadFunc(href, filename) {
    if (href && filename) {
      let a = document.createElement('a')
      a.download = filename //指定下载的文件名
      a.href = href //  URL对象
      a.click() // 模拟点击
      URL.revokeObjectURL(a.href) // 释放URL 对象
    }
  }
}

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const formRef = ref() // 表单 Ref

interface ChildrenItem {
  toolInformationId: number
  code?: string
  toolCategoryValue?: string
  name: string
  location?: number
}

interface TemplateItem {
  name: string
  abbr: string
  unit: string
  value: string
  type: number
}

interface Datal {
  name: string
  url: string
  category: number
}
</script>