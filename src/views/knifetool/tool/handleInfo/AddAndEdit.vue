<template>
  <el-form ref="formRef" :model="formData" :rules="formRules">
    <el-card header="刀柄基本信息">
      <!-- 刀具品牌、刀具型号、刀具分类、刀具类型 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="品牌名称" required />
          <el-form-item prop="toolBrandId">
            <el-select v-model="formData.toolBrandId" :disabled="!editOrView" placeholder="请选择品牌名称" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_BRAND)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="刀柄型号：" />
          <el-form-item prop="toolModel">
            <el-input v-model="formData.toolModel" :disabled="!editOrView" placeholder="请输入刀柄型号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="刀柄类别：" required />
          <el-form-item prop="toolCategoryId">
            <el-tree-select placeholder="请选择刀柄分类" check-strictly :props="defaultProps" v-model="formData.toolCategoryId"
              :disabled="!editOrView" :data="treeSelect" :render-after-expand="false" @change="loadTemplate" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="刀柄类型：" required />
          <el-form-item prop="toolTypeId">
            <el-select v-model="formData.toolTypeId" :disabled="!editOrView" placeholder="请选择刀柄规格" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_HILT_AXIS)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 刀具名称、刀具材质、刀具涂层、满盒数量 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="刀柄名称：" required />
          <el-form-item prop="name">
            <el-input v-model="formData.name" :disabled="!editOrView" placeholder="请输入刀柄名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="重量(Kg)：" />
          <el-form-item prop="weight">
            <el-input-number style="width: 100%" v-model="formData.weight" :min="0.0" :precision="2"
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
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_CUTTER_PROCESS_MATERIAL)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 重量（Kg）、管理方式、加工材质、刀具类码 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="刀柄类码：" required />
          <el-form-item prop="code">
            <el-input v-model="formData.code" :disabled="!editOrView" placeholder="请输入刀柄类码" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产线：" />
          <el-form-item prop="productLine">
            <el-select v-model="formData.productLine" :disabled="!editOrView" placeholder="请选择管理方式" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_PRODUCTION_LINE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工位：" />
          <el-form-item prop="workStation">
            <el-select v-model="formData.workStation" :disabled="!editOrView" placeholder="请选择工位" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_WORK_STATION)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="持有者：" />
          <el-form-item prop="owner">
            <formRecipientSelect ref="recipientRef" :value="formData.owner" placeholder="请选择持有者" :disabled="!editOrView"
              @handle-select="(val) => setFormSelectValue(val, 'owner')" />
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
          <el-card shadow="never" style="height: 100%">
            <template #header>
              <div class="clearfix">
                <span>图片上传 (支持文件：bmp,jpg,jpeg,png,tif,gif,svg,psd,stl)</span>
              </div>
            </template>
            <div class="text item">
              <el-upload v-model:file-list="picFileList" :action="uploadUrl" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :http-request="httpRequest" :disabled="!editOrView"
                :on-remove="handlePictureRemove" accept=".bmp,.jpg,.jpeg,.png,.tif,.gif,.svg,.psd,.stl">
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
          <el-card shadow="never" style="height: 100%">
            <template #header>
              <div class="clearfix">
                <span>附件上传 (支持文件：doc,docx,xlsx,xls,txt)</span>
              </div>
            </template>
            <div class="text item">
              <el-upload v-model:file-list="docFileList" class="upload-demo" :action="uploadUrl" :data="data" multiple
                :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove"
                :disabled="!editOrView" :http-request="httpRequest" accept=".doc,.docx,.xlsx,.xls,.txt" drag>
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
            <el-table :data="formData.templateDataList" border style="width: 100%; text-align: center">
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
            <el-table :data="formData.cutParamList" border style="width: 100%; text-align: center">
              <el-table-column prop="name" label="名称" align="center" />
              <el-table-column prop="abbr" label="缩写" align="center" />
              <el-table-column prop="value" label="值" align="center">
                <template #default="scope">
                  <el-input placeholder="请输入" :disabled="!editOrView"
                    v-model="formData.cutParamList[scope.$index].value" :maxLength="64" />
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
                <span>适配刀具</span>
              </div>
            </template>
            <div style="margin-bottom: 10px">
              <el-button v-if="editOrView" type="primary" @click="openToolInfoDialog(1)">选择适配刀具</el-button>
            </div>
            <el-table :data="formData.tool" border style="width: 100%; text-align: center">
              <el-table-column prop="code" label="刀具类码" align="center" />
              <el-table-column prop="name" label="刀具名称" align="center" />
              <el-table-column prop="spec" label="通用规格" align="center" />
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="editOrView">
                  <el-popover :visible="scope.row.visible !== undefined" placement="top" :width="160">
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined">取消</el-button>
                      <el-button size="small" type="primary" @click="handleDelete(2, scope.$index)">
                        确定
                      </el-button>
                    </div>
                    <template #reference>
                      <el-button type="danger" size="small" @click="scope.row.visible = true">
                        删除
                      </el-button>
                    </template>
                  </el-popover>
                </template>
              </el-table-column>
              <template #empty>
                <div class="empty">
                  <img src="@/assets/imgs/no_data.jpg" style="height: 135px; width: 250px" /><br />
                </div>
              </template>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </el-form>
  <!-- 按钮 -->
  <ContentWrap>
    <div class="submit" align="center">
      <el-space>
        <el-button v-if="editOrView" type="primary" :disabled="formLoading" @click="onSumit()">
          提 交
        </el-button>
        <el-button v-if="props.isView == false" @click="onReset()"> 取 消 </el-button>
      </el-space>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <selectToolDialog ref="toolInfoForm" @success="selectToolInfo" />

  <!-- 图片 -->
  <Dialog v-model="dialogVisible" :title="options.title" width="1200px">
    <el-image v-show="dialogImageUrl !== ''" :key="dialogImageUrl" :src="dialogImageUrl" lazy alt="Preview Image" />
  </Dialog>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import selectToolDialog from '@/views/knifetool/toolGroup/group/selectToolDialog.vue'
import formRecipientSelect from '@/components/store/formRecipientSelect.vue'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import * as ParamtemplateApi from '@/api/knifetool/tool/paramtemplate'
import * as InfoApi from '@/api/knifetool/tool/info'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { handleTree } from '@/utils/tree'
import { getCategoryList } from '@/api/knifetool/tool/category'

/** 刀具组合新增/修改 */
defineOptions({ name: 'GroupAddAndEdit' })

const { uploadUrl, httpRequest } = useUpload()
const picFileList = ref<UploadUserFile[]>([])
const docFileList = ref<UploadUserFile[]>([])
const tmpList = ref<any>([]) //
const editOrView = ref(false) // 是否显示
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const tagsViewStore = useTagsViewStore() // 页签
const treeSelect = ref<any>([]) // 刀柄分类数据
const data = ref({ path: '' })
const router = useRouter()

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf',
  emitPath: false // 用于 cascader 组件：在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
}

const manageTypeList = ref([
  { id: 1, name: '采购入库赋一物一码' },
  { id: 2, name: '出库赋一物一码' },
  // { id: 3, name: '按数量管理' }
])
const formData = ref<{
  id?: number //后台根据id时候为null判断是新增还是修改
  name: string
  code: string
  toolMaterialId?: number //刀具材质
  workStation?: number //工位
  productLine?: number //生产线
  weight?: number //重量（KG）
  manageType?: number //管理方式
  processMaterialId?: number //加工材质
  owner: string //持有者
  supplier: string //供应商
  toolBrandId?: number //刀具品牌
  toolModel: string //刀具型号
  toolCategoryId?: number //刀具分类
  toolTypeId?: number //刀具类型
  remark: string //备注
  picFileList: [] //图片上传缓存
  imgList: []
  docFileList: [] //文档上传缓存
  fileList: []
  fileListUrl: [] //上传的文件路径
  tool: ChildrenItem[]
  adapterList: ChildrenItem[]
  templateParamList: TemplateItem[] //参数模板
  templateDataList: TemplateItem[] //几何参数模板
  geoParamList: []
  cutParamList: TemplateItem[] //切削参数
  attachmentList: Datal[] //合并后的文件上传
  adapters: string //适配的刀柄/刀具， 多个逗号分开
  type: number
}>({
  id: undefined, //后台根据id时候为null判断是新增还是修改
  name: '',
  code: '',
  toolMaterialId: undefined, //刀具材质
  workStation: undefined, //工位
  productLine: undefined, //生产线
  weight: undefined, //重量（KG）
  manageType: undefined, //管理方式
  processMaterialId: undefined, //加工材质
  owner: '', // 持有者
  supplier: '', //供应商
  toolBrandId: undefined, //刀具品牌
  toolModel: '', //刀具型号
  toolCategoryId: undefined, //刀具分类
  toolTypeId: undefined, //刀具类型
  remark: '', //备注s
  picFileList: [], //图片上传缓存
  imgList: [],
  docFileList: [], //文档上传缓存
  fileList: [],
  fileListUrl: [], //上传的文件路径
  tool: [],
  adapterList: [],
  templateParamList: [], //参数模板
  templateDataList: [], //几何参数模板
  geoParamList: [],
  cutParamList: [], //切削参数
  attachmentList: [], //合并后的文件上传
  adapters: '', //适配的刀盘， 多个逗号分开
  type: 2
})

const formRules = reactive({
  toolBrandId: [{ required: true, message: '请选择刀柄品牌', trigger: 'blur' }],
  toolCategoryId: [{ required: true, message: '请选择刀柄分类', trigger: 'blur' }],
  toolTypeId: [{ required: true, message: '请选择刀柄类型', trigger: 'blur' }],
  name: [
    { required: true, message: '请输入刀柄名称', trigger: 'blur' },
    { min: 1, max: 128, message: '刀柄名称长度为1到128位', trigger: 'blur' }
  ],
  manageType: [{ required: true, message: '请选择刀柄管理方式', trigger: 'blur' }],
  code: [{ required: true, message: '请输入刀柄类码', trigger: 'blur' }]
})
/** 刀具分类数据获取 */
const getCategoryTree = async () => {
  const data = await getCategoryList({ type: 2, state: 1 })
  treeSelect.value = handleTree(data, 'id', 'pid')
}

const options = reactive({
  src: '',
  poster: '', //封面,
  title: ''
})

const formRef = ref() // 表单 Ref

interface ChildrenItem {
  id?: number
  toolInformationId: number
  code: string
  toolCategoryValue?: string
  name: string
  spec: string
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
  url: string | undefined
  category: number
}

const loadTemplate = async () => {
  formData.value.templateDataList = []
  formData.value.cutParamList = []

  if (formData.value.toolCategoryId === undefined) return

  try {
    let res = await ParamtemplateApi.getTempleteByCategoryAndType(formData.value.toolCategoryId, -1)

    if (res !== null && res.detailList.length > 0) {
      res.detailList.map((item) => {
        if (item.type === 1) {
          formData.value.templateDataList.push(item)
        }
        if (item.type === 2) {
          formData.value.cutParamList.push(item)
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
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
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return ElMessageBox.confirm(`是否删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}

// 详情查看
const recipientRef = ref()
const onDetails = async (params) => {
  formData.value = await InfoApi.getInformation({ id: params.rowId })

  recipientRef.value.setValueUndefined(formData.value.owner)

  picFileList.value = formData.value.imgList
  docFileList.value = formData.value.fileList
  formData.value.templateDataList = formData.value.geoParamList
  if (null !== formData.value.adapterList) {
    formData.value.tool = formData.value.adapterList
  } else {
    formData.value.tool = []
  }

  console.log(formData.value)
}

// 刀具信息组件
const toolInfoForm = ref()
const openToolInfoDialog = (type: any) => {
  toolInfoForm.value.open(type)
}

// 选中的刀具信息
const selectToolInfo = (json: any) => {
  changeData(json.selection, json.type)
}

const changeData = (arr, type) => {
  console.log(arr, type)
  return arr.map((item) => {
    const { id, code, toolCategoryValue, name, spec } = item
    if (type == 1) {
      const obj = formData.value.tool.find((c) => c.toolInformationId === id)
      if (obj === undefined)
        formData.value.tool.push({
          toolInformationId: id,
          code,
          name,
          spec
        })
      let ids: Array<number | undefined> = []
      formData.value.tool.forEach((item) => {
        ids.push(item.toolInformationId)
        ids.push(item.id)
      })
      ids = Array.from(new Set(ids))
      formData.value.adapters = ids.join(',')
    }
    console.log(formData.value.tool)
  })
}

// 删除选中数据
const handleDelete = (type: number, index: number) => {
  if (type == 2) {
    formData.value.tool.splice(index, 1)
  }
}

// 提交
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const onSumit = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  if (formData.value.attachmentList === null || formData.value.attachmentList === undefined) {
    formData.value.attachmentList = []
  }
  // 图片文件处理
  try {
    picFileList.value.forEach((item: any) => {
      if (item !== undefined && item.response === undefined) {
        formData.value.attachmentList.push(item)
      } else {
        let datal = {
          name: item.name,
          url: item.response?.data,
          category: 1
        }
        formData.value.attachmentList.push(datal)
      }
    })
    picFileList.value = []
    // 文档文件处理
    docFileList.value.forEach((item: any) => {
      if (item !== undefined && item.url !== undefined) {
        formData.value.attachmentList.push(item)
      } else {
        let datal = {
          name: item.name,
          url: item.response?.data,
          category: 2
        }
        formData.value.attachmentList.push(datal)
      }
    })
    docFileList.value = []
    // 合并参数模板
    formData.value.templateParamList = formData.value.templateDataList.concat(
      formData.value.cutParamList
    )

    const list = formData.value.templateParamList.filter((item) => item.value === undefined)

    if (list.length > 0) {
      message.error('操作失败，参数值不可为空')
      formLoading.value = false
      return
    } else {
      if (router.currentRoute.value.path.indexOf('create') !== -1) {
        await InfoApi.createInformation(formData.value)
        message.success(t('common.createSuccess'))
      } else {
        await InfoApi.updateInformation(formData.value)
        message.success(t('common.updateSuccess'))
      }
      onReset()
    }
  } finally {
    formLoading.value = false
  }
}

// 取消
const onReset = () => {
  formLoading.value = false
  // 刷新刀具组合
  push('/knifetool/tool/handleInfo')
  // 关闭当前页签
  const currentTag = router.currentRoute.value
  tagsViewStore.delView(currentTag)
}

const setFormSelectValue = (val: string, prop: string) => {
  console.log(val)
  formData.value[prop] = val

  console.log(formData.value)

  console.log(formData.value[prop])
}
const props = defineProps({ isView: { type: Boolean }, rowID: { type: String } })

/** 初始化 **/
onMounted(() => {
  getCategoryTree()

  const params =
    props.rowID !== undefined ? { rowId: props.rowID } : reactive(router.currentRoute.value.params)
  // 页面路径
  var path = router.currentRoute.value.path
  console.log('页面参数：', params.rowId, path)
  if (params.rowId !== 'undefined' && params.rowId !== undefined) {
    onDetails(params)
  }

  if (props.isView) {
    editOrView.value = false
  } else {
    editOrView.value = path.indexOf('view') != -1 ? false : true
  }
})
</script>
