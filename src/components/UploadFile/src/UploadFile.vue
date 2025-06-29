<template>
  <div class="upload-file">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="uploadUrl"
      :auto-upload="autoUpload"
      :before-upload="beforeUpload"
      :drag="drag"
      :limit="props.limit"
      :multiple="props.limit > 1"
      :on-error="excelUploadError"
      :on-exceed="handleExceed"
      :on-success="handleFileSuccess"
      :show-file-list="true"
      :http-request="httpRequest"
      class="upload-file-uploader"
      name="file"
      :data="uploadObjs"
    >
      <slot name="button" v-if="formType!='detail'">
        <el-button type="primary">选取文件</el-button>
      </slot>
      <template v-if="isShowTip" #tip>
        <div style="font-size: 8px">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
        </div>
        <div style="font-size: 8px">
          格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b> 的文件
        </div>
      </template>
      <template #file="{ file }">
        <ul class="el-upload-list el-upload-list--text" style="display: flex; flex-direction: row">
          <li class="el-upload-list__item is-success">
            <div class="el-upload-list__item-info">
              <a class="el-upload-list__item-name">
                <i class="el-icon el-icon--document">
                  <Icon icon="fa:file-text-o" />
                </i>
                <span class="el-upload-list__item-file-name" :title="file.name" @click="handleDownload(file)">{{file.name}}</span>
              </a>
            </div>
            <label class="el-upload-list__item-status-label" v-if="formType!='detail'">
              <i class="el-icon el-icon--upload-success el-icon--circle-check">
                <Icon icon="ep:circle-check" />
              </i>
            </label>
            <i class="el-icon el-icon--close" @click="handleRemove(file)" v-if="formType!='detail'">
              <Icon icon="ep:close-bold" />
            </i>
          </li>
          <li style="width: 50px; margin-left: 10px; cursor: pointer;" v-if="isShowPreview">
            <el-button link type="primary" @click="handlePreview(file)"><span style="font-weight: bold">预览</span></el-button>
          </li>
        </ul>
      </template>
    </el-upload>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { isString } from '@/utils/is'
import { useUpload } from '@/components/UploadFile/src/useUpload'
import { UploadFile } from 'element-plus/es/components/upload/src/upload'

defineOptions({ name: 'UploadFile' })

const message = useMessage() // 消息弹窗
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: propTypes.oneOfType<string | string[]>([String, Array<String>]).isRequired,
  title: propTypes.string.def('文件上传'),
  fileType: propTypes.array.def(['doc', 'xls', 'ppt', 'txt', 'pdf']), // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileSize: propTypes.number.def(5), // 大小限制(MB)
  limit: propTypes.number.def(5), // 数量限制
  autoUpload: propTypes.bool.def(true), // 自动上传
  drag: propTypes.bool.def(false), // 拖拽上传
  isShowTip: propTypes.bool.def(true), // 是否显示提示
  formType: propTypes.string,
  bucket: propTypes.string,
  formType: propTypes.string,
  isShowPreview: propTypes.string
})

// ========== 上传相关 ==========
const uploadRef = ref<UploadInstance>()
const uploadList = ref<UploadUserFile[]>([])
const fileList = ref<UploadUserFile[]>([])
const uploadNumber = ref<number>(0)
const uploadObjs = ref({bucket:''})

const { uploadUrl, httpRequest } = useUpload()

// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
    uploadObjs.value.bucket = props.bucket?props.bucket:'';
  if (fileList.value.length >= props.limit) {
    message.error(`上传文件数量不能超过${props.limit}个!`)
    return false
  }
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  const isImg = props.fileType.some((type: string) => {
    if (file.type.indexOf(type) > -1) return true
    return !!(fileExtension && fileExtension.indexOf(type) > -1)
  })
  const isLimit = file.size < props.fileSize * 1024 * 1024
  if (!isImg) {
    message.error(`文件格式不正确, 请上传${props.fileType.join('/')}格式!`)
    return false
  }
  if (!isLimit) {
    message.error(`上传文件大小不能超过${props.fileSize}MB!`)
    return false
  }
  message.success('正在上传文件，请稍候...')
  uploadNumber.value++
}
// 处理上传的文件发生变化
// const handleFileChange = (uploadFile: UploadFile): void => {
//   uploadRef.value.data.path = uploadFile.name
// }
// 文件上传成功
const handleFileSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
  // 删除自身
  const index = fileList.value.findIndex((item) => item.response?.data === res.data)
  fileList.value.splice(index, 1)
  uploadList.value.push({ name: res.data, url: res.data, })
  if (uploadList.value.length == uploadNumber.value) {
    fileList.value.push(...uploadList.value)
    uploadList.value = []
    uploadNumber.value = 0
    emitUpdateModelValue()
  }
}
// 文件数超出提示
const handleExceed: UploadProps['onExceed'] = (): void => {
  message.error(`上传文件数量不能超过${props.limit}个!`)
}
// 上传错误提示
const excelUploadError: UploadProps['onError'] = (): void => {
  message.error('导入数据失败，请您重新上传！')
}
// 删除上传文件
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.map((f) => f.name).indexOf(file.name)
  if (index > -1) {
    fileList.value.splice(index, 1)
    emitUpdateModelValue()
  }
}

// 下载
const handleDownload = async (uploadFile) => {
  const a = document.createElement('a');
  a.download = uploadFile.name ?? String(new Date().getTime())
  // a.target = '_blank'
  a.href = uploadFile.url
  a.click()
}


import {Base64} from 'js-base64'
// 预览
const handlePreview = async (uploadFile) => {
  var _url = uploadFile.url
  var b64Encoded = Base64.encode(_url);
  // window.open(await FileApi.previewFile(b64Encoded))
  window.open('http://localhost:8012/onlinePreview?url=' + encodeURIComponent(b64Encoded));
}

// 监听模型绑定值变动
watch(
  () => props.modelValue,
  (val: string | string[]) => {
    if (!val) {
      fileList.value = [] // fix：处理掉缓存，表单重置后上传组件的内容并没有重置
      return
    }

    fileList.value = [] // 保障数据为空
    // 情况1：字符串
    if (isString(val)) {
      fileList.value.push(
        ...val.split(',').map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url }))
      )
      return
    }
    // 情况2：数组
    fileList.value.push(
      ...(val as string[]).map((url) => ({ name: url.substring(url.lastIndexOf('/') + 1), url }))
    )
  },
  { immediate: true, deep: true }
)
// 发送文件链接列表更新
const emitUpdateModelValue = () => {
  // 情况1：数组结果
  let result: string | string[] = fileList.value.map((file) => file.url!)
  // 情况2：逗号分隔的字符串
  if (props.limit === 1 || isString(props.modelValue)) {
    result = result.join(',')
  }
  emit('update:modelValue', result)
}
</script>
<style lang="scss" scoped>
.upload-file-uploader {
  margin-bottom: 5px;
}

:deep(.upload-file-list .el-upload-list__item) {
  position: relative;
  margin-bottom: 10px;
  line-height: 2;
  border: 1px solid #e4e7ed;
}

:deep(.el-upload-list__item-file-name) {
  max-width: 250px;
}

:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}


.upload-file-uploader .el-upload-list__item.is-success:focus:not(:hover){
  display: none !important;
}

</style>
