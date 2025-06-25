<template>
  <el-form ref="formRef" :model="formData" :rules="formRules">
    <el-row>
      <el-col :md="12" :sm="24">
        <el-card header="刀组信息">
          <el-form-item label="刀组编码：" />
          <el-form-item prop="groupCode">
            <el-input
              v-model="formData.groupCode"
              :disabled="!editOrView || formData.id !== undefined"
              @click="openToolTypeDialog" 
              placeholder="请输入刀组编码："
            />
          </el-form-item>
          <el-form-item label="最高转速（转／分）：" />
          <el-form-item prop="maxSpeed">
            <el-input-number
              :min="1"
              :max="999999999"
              style="width: 100%"
              v-model="formData.maxSpeed"
              :disabled="!editOrView"
              placeholder="请输入最高转速（转／分）"
            />
          </el-form-item>
          <el-form-item label="刀组描述：" />
          <el-form-item prop="remark">
            <el-input
              v-model="formData.remark"
              :disabled="!editOrView"
              type="textarea"
              placeholder="请输入刀组描述"
            />
          </el-form-item>
          <el-form-item label="装配指导(建议上传配刀视频)：" />
          <el-card shadow="never">
            <template #header>
              <div class="clearfix">
                <span>附件上传 (支持文件：gif,bmp,jpeg,jpg,ico,png,tif,tiff,mp4)</span>
              </div>
            </template>
            <div class="text item">
              <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                :action="uploadUrl"
                :data="data"
                multiple
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :disabled="!editOrView"
                :http-request="httpRequest"
                accept=".gif, .bmp, .jpeg, .jpg, .ico, .png, .tif, .tiff, .mp4"
                drag
              >
                <el-button type="primary">
                  <Icon icon="ep:upload" class="mr-5px" /> 上传文件
                </el-button>
              </el-upload>
            </div>
          </el-card>
          <el-form-item label="刀组参数：" required />
          <el-descriptions border :column="2">
            <el-descriptions-item label="总长上限(mm)">
              <el-form-item prop="lengthUpper">
                <el-input-number
                  :min="0"
                  v-model="formData.lengthUpper"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="刃径上偏差(mm)">
              <el-form-item prop="bladeUpperDeviation">
                <el-input-number
                  v-model="formData.bladeUpperDeviation"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="总长下限(mm)">
              <el-form-item prop="lengthFloor">
                <el-input-number
                  v-model="formData.lengthFloor"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item size="large" label="刃径下偏差(mm)">
              <el-form-item prop="bladeFloorDeviation">
                <el-input-number
                  v-model="formData.bladeFloorDeviation"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="悬长上限(mm)">
              <el-form-item prop="hangingLengthUpper">
                <el-input-number
                  v-model="formData.hangingLengthUpper"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="底R上偏差(mm)">
              <el-form-item prop="rUpperDeviation">
                <el-input-number
                  v-model="formData.rupperDeviation"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="悬长下限(mm)">
              <el-form-item prop="hangingLengthFloor">
                <el-input-number
                  v-model="formData.hangingLengthFloor"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="底R下偏差(mm)">
              <el-form-item prop="rFloorDeviation">
                <el-input-number
                  v-model="formData.rfloorDeviation"
                  :disabled="!editOrView"
                  size="large"
                  controls-position="right"
                  style="width: 100%"
                />
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :md="12" :sm="24">
        <el-card header="刀组装配信息">
          <el-form-item label="刀柄选择：" required />
          <el-form-item prop="handle">
            <div style="margin-left: 85%; margin-bottom: 10px">
              <el-button type="primary" v-if="editOrView" @click="openToolInfoDialog(2)"
                >选择刀柄</el-button
              >
            </div>
            <el-table :data="formData.handle" border style="width: 100%; text-align: center">
              <el-table-column
                prop="code"
                label="刀柄类码"
                style="text-align: center"
                width="180"
              />
              <el-table-column prop="toolCategoryValue" label="刀柄分类" />
              <el-table-column prop="name" label="刀柄名称" />
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="editOrView">
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <template #reference>
                      <el-button
                        type="primary"
                        size="small"
                        @click="viewDetails(2, scope.$index, scope.row)"
                      >
                        查看
                      </el-button>
                    </template>
                  </el-popover>
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined"
                        >取消</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="handleDelete(2, scope.$index, scope.row)"
                      >
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
          </el-form-item>
          <el-form-item label="刀具选择：" required />
          <el-form-item prop="tool">
            <div style="margin-left: 85%; margin-bottom: 10px">
              <el-button v-if="editOrView" type="primary" @click="openToolInfoDialog(1)"
                >选择刀具</el-button
              >
            </div>
            <el-table :data="formData.tool" border style="width: 100%; text-align: center">
              <el-table-column prop="location" label="刀位" width="180">
                <template #default="scope">
                  <el-input
                    type="number"
                    v-model="scope.row.location"
                    @focus="history(scope.row)"
                    @blur="checkLocation(scope.row, scope.$index)"
                    :min="1"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="code" label="刀具类码" />
              <el-table-column prop="name" label="刀具名称" />
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="editOrView">
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <template #reference>
                      <el-button
                        type="primary"
                        size="small"
                        @click="viewDetails(1, scope.$index, scope.row)"
                      >
                        查看
                      </el-button>
                    </template>
                  </el-popover>
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined"
                        >取消</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="handleDelete(1, scope.$index, scope.row)"
                      >
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
          </el-form-item>
          <el-form-item label="配件选择：" />
          <el-form-item prop="accessories">
            <div style="margin-left: 85%; margin-bottom: 10px">
              <el-button v-if="editOrView" type="primary" @click="openToolInfoDialog(3)"
                >选择配件</el-button
              >
            </div>
            <el-table :data="formData.accessories" border style="width: 100%; text-align: center">
              <el-table-column prop="code" label="连接件类码" />
              <el-table-column prop="name" label="连接件名称" />
              <el-table-column label="操作" align="center">
                <template #default="scope" v-if="editOrView">
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <template #reference>
                      <el-button
                        type="primary"
                        size="small"
                        @click="viewDetails(3, scope.$index, scope.row)"
                      >
                        查看
                      </el-button>
                    </template>
                  </el-popover>
                  <el-popover
                    :visible="scope.row.visible !== undefined"
                    placement="top"
                    :width="160"
                  >
                    <p>确定要删除此条数据吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="small" @click="scope.row.visible = undefined"
                        >取消</el-button
                      >
                      <el-button
                        size="small"
                        type="primary"
                        @click="handleDelete(3, scope.$index, scope.row)"
                      >
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
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </el-form>

  <!-- 列表 -->
  <ContentWrap>
    <div class="submit" align="center">
      <el-space>
        <el-button v-if="editOrView" type="primary" :disabled="formLoading" @click="onSumit()">
          提 交
        </el-button>
        <el-button @click="onReset()"> 取 消 </el-button>
      </el-space>
    </div>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <selectToolDialog ref="toolInfoForm" @success="selectToolInfo" />

  <!-- 刀具详情弹窗 -->
  <baseInfoDialog ref="baseInfoForm" />
  <!-- 刀柄详情弹窗 -->
  <handleInfoDialog ref="handleInfoForm" />
  <!-- 配件详情弹窗 -->
  <partsInfoDialog ref="partsInfoForm" />
  <!-- 刀组编码选择弹窗 -->
  <ToolTypeChoose ref="toolTypeChooseRef" @getToolType="getToolType" />


  <!-- 视频播放 -->
  <Dialog v-model="videoVisible" :title="options.title" width="1200px" ref="aaa">
    <vue3VideoPlay
      v-show="videoSource !== ''"
      width="100%"
      :src="videoSource"
      :poster="options.poster"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="onCanplay"
    />
    <el-image v-show="imgSrc !== ''" :key="imgSrc" :src="imgSrc" lazy />
    <template #footer>
      <el-button @click="videoVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import * as GroupListApi from '@/api/knifetool/tool/groupList'
import selectToolDialog from './selectToolDialog.vue'
import baseInfoDialog from './baseInfoDialog.vue'
import handleInfoDialog from './handleInfoDialog.vue'
import partsInfoDialog from './partsInfoDialog.vue'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { ElMessageBox } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useRouter } from 'vue-router'
import ToolTypeChoose from '@/views/knifetool/tool/toolType/ToolTypeChoose.vue'

const videoSource = ref('')
const imgSrc = ref('')

/** 刀具组合新增/修改 */
defineOptions({ name: 'GroupAddAndEdit' })

const { uploadUrl, httpRequest } = useUpload()
const fileList = ref<UploadUserFile[]>([])
const videoVisible = ref(false) // 视频弹窗
const editOrView = ref(false) // 是否显示
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由跳转
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const data = ref({ path: '' })
const tagsViewStore = useTagsViewStore() // 页签
const router = useRouter()
const queryParams = reactive({
  id: undefined
})
const historyData = ref()
const oid = ref()

interface Datal {
  name: string
  url: string | undefined
  category: number
}

const formData = ref<{
  id?: number //后台根据id时候为null判断是新增还是修改
  groupCode: string //刀组号T1T2.....
  groupNum: string //刀组号T1T2.....
  maxSpeed?: number //最高转速
  remark: string //备注
  lengthUpper?: number //总长上限
  lengthFloor?: number //总长下限
  hangingLengthUpper?: number //玄长上限
  hangingLengthFloor?: number //玄长下限
  bladeUpperDeviation?: number //刃径上偏差
  bladeFloorDeviation?: number //刃径下偏差
  rupperDeviation?: number //底R上偏差
  rfloorDeviation?: number //底R下偏差
  fileList: [] //上传缓存
  fileListUrl: [] //上传的文件路径
  handle: ChildrenItem[]
  tool: ChildrenItem[]
  accessories: ChildrenItem[]
  attachmentList: Datal[] //合并后的文件上传
}>({
  id: undefined, //后台根据id时候为null判断是新增还是修改
  groupNum: '', //刀组号T1T2.....
  maxSpeed: undefined, //最高转速
  remark: '', //备注
  lengthUpper: undefined, //总长上限
  lengthFloor: undefined, //总长下限
  hangingLengthUpper: undefined, //玄长上限
  hangingLengthFloor: undefined, //玄长下限
  bladeUpperDeviation: undefined, //刃径上偏差
  bladeFloorDeviation: undefined, //刃径下偏差
  rupperDeviation: undefined, //底R上偏差
  rfloorDeviation: undefined, //底R下偏差
  fileList: [], //上传图片缓存
  fileListUrl: [], //上传的文件路径
  handle: [],
  tool: [],
  accessories: [],
  attachmentList: [] //合并后的文件上传
})

const formRules = reactive({
  lengthUpper: [{ required: true, message: '请输入总长上限且只能是数字!', trigger: 'blur' }],
  lengthFloor: [{ required: true, message: '请输入总长下限且只能是数字!', trigger: 'blur' }],
  hangingLengthUpper: [{ required: true, message: '请输入悬长上限且只能是数字!', trigger: 'blur' }],
  hangingLengthFloor: [{ required: true, message: '请输入悬长下限且只能是数字!', trigger: 'blur' }],
  bladeUpperDeviation: [
    { required: true, message: '请输入刃径上偏差且只能是数字!', trigger: 'blur' }
  ],
  bladeFloorDeviation: [
    { required: true, message: '请输入刃径下偏差且只能是数字!', trigger: 'blur' }
  ],
  rupperDeviation: [{ required: true, message: '请输入底R上偏差且只能是数字!', trigger: 'blur' }],
  ruloorDeviation: [{ required: true, message: '请输入底R下偏差且只能是数字!', trigger: 'blur' }],
  handle: [{ required: true, message: '刀柄必须选择!', trigger: 'change' }],
  tool: [{ required: true, message: '刀具必须选择!', trigger: 'change' }],
  accessories: [{ required: false, message: '配件必须选择!', trigger: 'change' }]
})

const options = reactive({
  src: '',
  poster: '', //封面,
  title: ''
})

const onPlay = (ev: any) => {
  console.log('播放')
}

const onPause = (ev) => {
  console.log('暂停')
}

const onTimeupdate = (ev) => {
  // console.log(ev, '时间更新')
}

const onCanplay = (ev) => {
  console.log(ev, '可以播放')
}

const formRef = ref() // 表单 Ref

interface ChildrenItem {
  toolInformationId: number
  code?: string
  toolCategoryValue?: string
  name: string
  location?: number
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
  let index = uploadFile.name.lastIndexOf('.')
  let suffix = uploadFile.name.substring(index)
  if (uploadFile.url) {
    if (suffix == '.mp4' || suffix == '.rmvb' || suffix == '.avi') {
      imgSrc.value = ''
      videoSource.value = ''
      videoSource.value = uploadFile.url
      console.log(videoSource.value)
      options.title = uploadFile.name.split('.')[0].trim()
      videoVisible.value = true
    } else if (
      suffix == '.bmp' ||
      suffix == '.png' ||
      suffix == '.gif' ||
      suffix == '.jpg' ||
      suffix == '.jpeg'
    ) {
      videoSource.value = ''
      imgSrc.value = ''
      imgSrc.value = uploadFile.url
      console.log(imgSrc.value)
      options.title = uploadFile.name.split('.')[0].trim()
      videoVisible.value = true
    } else {
      downloadFunc(uploadFile.url, uploadFile.name)
    }
  } else {
    if (suffix == '.mp4' || suffix == '.rmvb' || suffix == '.avi') {
      imgSrc.value = ''
      videoSource.value = ''
      console.log(uploadFile.response.data)
      videoSource.value = uploadFile.response.data
      console.log(videoSource.value)
      options.title = uploadFile.name.split('.')[0].trim()
      videoVisible.value = true
    } else if (
      suffix == '.bmp' ||
      suffix == '.png' ||
      suffix == '.gif' ||
      suffix == '.jpg' ||
      suffix == '.jpeg'
    ) {
      videoSource.value = ''
      imgSrc.value = ''
      imgSrc.value = uploadFile.response.data
      console.log(imgSrc.value)
      options.title = uploadFile.name.split('.')[0].trim()
      videoVisible.value = true
    } else {
      downloadFunc(uploadFile.response.data, uploadFile.name)
    }
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

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return ElMessageBox.confirm(`是否删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}

// 详情查看
const onDetails = async (params) => {
  formData.value = await GroupListApi.getGroupDetail({ id: params.rowId })
  fileList.value = formData.value.fileList
  console.log(formData.value)
}

// 刀具信息组件
const toolInfoForm = ref()
const openToolInfoDialog = (type: any) => {
  console.log(toolInfoForm.value)
  toolInfoForm.value.open(type)
}

// 选中的刀具信息
const selectToolInfo = (json: any) => {
  changeData(json.selection, json.type)
}

const changeData = (arr, type) => {
  console.log(arr)
  if (type === 2) {
    if (arr.length > 1) {
      message.notifyError('只能选择一个刀柄！')
      return
    }
    if (formData.value.handle.length > 0) {
      message.notifyError('刀柄已经选择，重新选择请先清空刀柄！')
      return
    }
  }
  return arr.map((item) => {
    const { id, code, toolCategoryValue, name, location } = item
    if (type == 1) {
      const obj = formData.value.tool.find((c) => c.toolInformationId === id)
      if (obj === undefined)
        formData.value.tool.push({
          toolInformationId: id,
          code,
          toolCategoryValue: undefined,
          name,
          location: formData.value.tool.length + 1
        })
    }

    if (type == 2) {
      const obj = formData.value.handle.find((c) => c.toolInformationId === id)
      if (obj === undefined)
        formData.value.handle.push({
          toolInformationId: id,
          code,
          toolCategoryValue,
          name,
          location: undefined
        })
    }

    if (type == 3) {
      const obj = formData.value.accessories.find((c) => c.toolInformationId === id)
      if (obj === undefined)
        formData.value.accessories.push({
          toolInformationId: id,
          code,
          toolCategoryValue: undefined,
          name,
          location: undefined
        })
    }
  })
}

const toolTypeChooseRef = ref()
const openToolTypeDialog = () => {
  toolTypeChooseRef.value.open('1825795946634801153')
}

//选择刀具编码
const getToolType = (toolType: MaterialConfigVO) => {
  formData.value.groupCode = toolType.materialNumber
}

// 刀具详情组件
const baseInfoForm = ref()

// 刀柄详情组件
const handleInfoForm = ref()

// 配件详情组件
const partsInfoForm = ref()

// 查看选中数据
const viewDetails = (type: number, index: number, row: any) => {
  oid.value = row.id
  console.log(index, row)
  console.log(oid.value)
  if (type == 1) {
    console.log(baseInfoForm.value)
    baseInfoForm.value.open({ type: type, id: row.toolInformationId })
  }

  if (type == 2) {
    handleInfoForm.value.open({ type: type, id: row.toolInformationId })
  }

  if (type == 3) {
    partsInfoForm.value.open({ type: type, id: row.toolInformationId })
  }
}

// 删除选中数据
const handleDelete = (type: number, index: number, row: any) => {
  console.log(index, row)
  if (type == 1) {
    formData.value.tool.splice(index, 1)
  }

  if (type == 2) {
    formData.value.handle.splice(index, 1)
  }

  if (type == 3) {
    formData.value.accessories.splice(index, 1)
  }
}

//校验刀具位置是否重复
const checkLocation = (row: any, _index: number) => {
  if (row.location == undefined) {
    return
  }
  const dataSource = [...formData.value.tool]
  let data = dataSource.filter((item, i) => i !== _index)
  for (let j = 0; j < data.length; j++) {
    if (data[j].location == row.location) {
      message.notifyError('刀具位置不能重复！')
      for (let i = 0; i < formData.value.tool.length; i++) {
        if (i == _index) {
          formData.value.tool[i].location = historyData.value
          return
        }
      }
    }
  }
}

const history = (row: any) => {
  historyData.value = row.location
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
  if (formData.value.attachmentList === null) {
    formData.value.attachmentList = []
  }
  try {
    fileList.value.forEach((item: any) => {
      console.log(item)
      if (item !== undefined && item.url !== undefined) {
        formData.value.attachmentList.push(item)
      } else {
        formData.value.attachmentList.push({
          name: item.name,
          url: item.response.data,
          category: 2
        })
      }
    })
    fileList.value = []
    console.log('Form表单提交', formData.value)
    await GroupListApi.subToolGroup(formData.value)
    if (router.currentRoute.value.path.indexOf('create') === 1) {
      message.success(t('common.createSuccess'))
    } else {
      message.success(t('common.updateSuccess'))
    }
    onReset()
  } finally {
    formLoading.value = false
  }
}

// 取消
const onReset = () => {
  formLoading.value = false
  // 刷新刀具组合
  push('/knifetool/toolGroup/groupList')

  // 关闭当前页签
  const currentTag = router.currentRoute.value
  tagsViewStore.delView(currentTag)
}

/** 初始化 **/
onMounted(() => {
  const params = reactive(router.currentRoute.value.params)
  // 页面路径
  var path = router.currentRoute.value.path
  console.log('页面参数：', params.rowId, path)
  console.log(params.rowId)
  if (params.rowId != '') {
    onDetails(params)
  }
  editOrView.value = path.indexOf('view') != -1 ? false : true
})
</script>
