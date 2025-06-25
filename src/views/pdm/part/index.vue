<template>
    <ContentWrap>
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
            <!-- 搜索工作栏 -->
            <el-form-item label="产品图号" prop="rootProductId">
                <el-select v-model="queryParams.rootProductId" clearable class="!w-240px" placeholder="请选择产品图号">
                    <el-option v-for="product in productList" :key="product.id" :label="product.productNumber"
                        :value="product.id" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="handleQuery">
                    <Icon icon="ep:search" class="mr-5px" /> 搜索
                </el-button>
                <el-button @click="resetQuery">
                    <Icon icon="ep:refresh" class="mr-5px" /> 重置
                </el-button>
            </el-form-item>
        </el-form>
    </ContentWrap>
    <!-- 左侧树 -->
    <ContentWrap>
        <el-row :gutter="20">
            <!-- 左侧数据包结构树 -->
            <el-col :span="5" :xs="24">
                <ContentWrap class="h-1/1">
                    <PartTree @node-click="handleStructureNodeClick" ref="childRefTree"
                        :rootproduct-id="queryParams.rootProductId" />
                </ContentWrap>
            </el-col>
            <el-col :span="10" :xs="24">
                <ContentWrap class="h-1/1" v-show="productInfo">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane label="产品信息" name="first" />
                    </el-tabs>
                    <!-- //rules定义了失焦事件 -->
                    <el-form ref="formRefUpdate" :model="formData" :rules="formRules" label-width="120px">
                        <el-form-item label="产品图号" prop="productNumber">
                            <el-input v-model="formData.productNumber" placeholder="请输入产品图号" />
                        </el-form-item>
                        <el-form-item label="产品名称" prop="productName">
                            <el-input v-model="formData.productName" placeholder="请输入产品名称" />
                        </el-form-item>
                        <el-form-item label="设计单位" prop="designUnit">
                            <el-input v-model="formData.designUnit" placeholder="请输入设计单位" />
                        </el-form-item>
                        <el-form-item label="更新时间" prop="updateTime">
                            <el-input v-model="formData.updateTime" />

                        </el-form-item>
                        <el-form-item label="产品描述" prop="description">
                            <el-input v-model="formData.description" />
                        </el-form-item>
                    </el-form>
                </ContentWrap>
                <ContentWrap class="h-1/1" v-show="!productInfo">
                    <el-tabs v-model="activeName1" class="demo-tabs" @tab-click="handleClick1">
                        <el-tab-pane label="零部件属性" name="second" style="height:580px;overflow-y: auto">
                            <div class="node-name">基本属性</div>
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="零件图号" min-width="120">
                                    {{ detailData.partNumber }}
                                </el-descriptions-item>
                                <el-descriptions-item label="名称">
                                    {{ detailData.partName }}
                                </el-descriptions-item>
                                <el-descriptions-item label="版本" min-width="120">
                                    {{ detailData.partVersion }}
                                </el-descriptions-item>
                            </el-descriptions>
                            <div class="node-name">零件设计属性</div>
                            <el-descriptions :column="1" border>
                              <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index+1">
                                {{ item.attrValue }}
                              </el-descriptions-item>
                            </el-descriptions>
                        </el-tab-pane>
                        <el-tab-pane label="文件目录" name="third">
                          <el-button  @click="openFileForm()" plain type="primary">
                            <Icon class="mr-5px" icon="ep:plus" />上传文件
                          </el-button>
                            <el-table :data="tableData" border>
                                <el-table-column align="center" label="序号" type="index" width="80px" />
                                <el-table-column prop="fileName" label="文件名称" align="center" />
                                <el-table-column prop="fileType" label="文件类型" align="center" />
                                <el-table-column label="操作" align="center">
                                  <template #default="scope">
                                    <el-link :underline="false" style="font-size: 12px; vertical-align: baseline" type="primary"
                                      @click="downloadFile(scope.row.vaultUrl)">
                                      下载
                                    </el-link>
                                    <el-button link type="danger" style="font-size: 12px; margin-left: 10px;"
                                               @click="handleDeleteFile(scope.row.id)">
                                      删除
                                    </el-button>
                                  </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="文档属性" name="fourth" @tab-click="handleClick2">
                            <div class="node-name">基本属性</div>
                            <el-descriptions :column="1" border>
                                <el-descriptions-item label="文档名称" min-width="120">
                                    {{ documentFile.documentName }}
                                </el-descriptions-item>
                                <el-descriptions-item label="类型">
                                    {{ documentFile.documentType }}
                                </el-descriptions-item>
                                <el-descriptions-item label="版本" min-width="120">
                                    {{ documentFile.documentVersion }}
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-tab-pane>
                    </el-tabs>
                </ContentWrap>
            </el-col>
            <el-col :span="9" :xs="24">
              <ContentWrap v-show="!showModel">
                <div style="width:320px;height:640px">三维图</div>
              </ContentWrap>
              <ContentWrap v-show="showModel"
                           :style="{ transform: 'scale(${scaleFactor})' }"
                           :class="{ 'full-screen': isImageFullScreen }">
                <div style="cursor: pointer;position: absolute;top: 5px;right: 17px;">
                  <img src="../../../../src/assets/imgs/fullscreen.png"
                       style="width: 20px;height: 20px"
                       @click="showFullScreen"
                       :style="{ transform: isImageFullScreen ? 'scale(2)' : 'scale(1)' }"/>
                </div>
                <threejsModel :modelUrl="modelUrl" :processInfo="processInfo"/>
              </ContentWrap>
            </el-col>
        </el-row>
    </ContentWrap>
  <FileForm ref="formNewFile" @success="getFileList()" />
</template>
<script setup lang="ts">
import PartTree from './PartTree.vue'
import FileForm from './FileForm.vue'
import { formatDate } from '@/utils/formatTime'
import * as ProductApi from '@/api/pdm/product';
import { PartMasterApi, PartMasterVO } from '@/api/pdm/part/partmaster';
import {PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import { PartDocumentVersionApi, PartDocumentVersionVO } from '@/api/pdm/part/partdocument'
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import threejsModel from '../../threejs/model/index.vue'

const activeName = ref('first')
const activeName1 = ref('second')
const tableData = ref<PartAttachmentVO[]>([]) // 列表的数据
const partAttrs = ref([]) //零件动态属性
const isOperator = ref(false) // 是否可操作按钮(负责人为当前登录者且状态为1待评估或2评估中时可操作)

const detailData = ref({} as PartMasterVO)
const documentFile = ref({} as PartDocumentVersionVO)
const dialogVisible = ref(false) // 弹窗的是否展示
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: ''
})

// 零部件属性按钮
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}

//文件目录按钮
const handleClick1 = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}

//文档属性按钮
const handleClick2 = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}

const formRefUpdate = ref() // 更改表单Ref
const productInfo = ref(true) //产品信息或零部件信息显隐

//拿到子组件实例
const childRefTree = ref()

/** 处理数据包结构树被点击 */
const handleStructureNodeClick = async (row) => {
    let parentId = row.parentId;
    if (parentId == '0') {
        productInfo.value = true;
        formData.value = await ProductApi.getProduct(row.rootproductId)
        formData.value.updateTime = formatDate(formData.value.updateTime)
    } else {
        showModel.value = true;
        productInfo.value = false;
        detailData.value = await PartMasterApi.getAll(row.partVersionId)
        tableData.value = await PartAttachmentApi.getdatapackageBomId(row.partVersionId);
        documentFile.value = await PartDocumentVersionApi.getDocumentVersion(row.partVersionId)
        queryParamsAttr.rootProductId = row.rootproductId
        queryParamsAttr.customizedIndex = row.customizedIndex
        queryParamsAttr.partVersionId = row.partVersionId
        //queryParamsResource.datapackageBomId = PartAttachmentApi.getNewFile(row.id)
        partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)

        //切换三维图
        let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
        if(fileData.length>0) {
          // let url = import.meta.env.VITE_APP_VAULT_URL;
          modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
          console.log(modelUrl.value)
          let txtUrl = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'txt')
        }
    }
}

const formData = ref({
    id: undefined,
    productName: undefined,
    productNumber: undefined,
    designUnit: undefined,
    status: undefined,
    description: undefined,
    productTypeId: undefined,
    createTime: undefined,
    updateTime: undefined,
    rootproductId: undefined,
})
const formRules = reactive({
    name: [{ required: true, message: '产品图号不能为空', trigger: 'blur' }],
})
/** 刷新树 */
const refreshTree = async () => {
    if (childRefTree.value) {
        childRefTree.value.getTree();
    }
}
const productList = ref<any[]>([]) // 产品列表
const queryParams = reactive({
    rootProductId: ''
})
const productParams = reactive({
  status: 0,
  productType: 0
})
const queryParamsResource = reactive({
  id: '',
  fileType: '',
  fileName: '',
  vaultUrl: '',
  datapackageBomId: '',
  fileSource :'1',
  creator: '',
  updater: '',
  fileId: ''
})
const queryFormRef = ref() // 搜索的表单
/** 查询列表 */
const getList = async () => {
    try {
        productList.value = await ProductApi.getProductList(productParams)
    } finally {
    }
}
/** 搜索按钮操作 */
const handleQuery = () => {
    getList()
    refreshTree();
}

/** 重置按钮操作 */
const resetQuery = () => {
    queryFormRef.value.resetFields()
    handleQuery()
}
/** 初始化 **/
onMounted(() => {
    handleQuery()
})

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');

}
//文件列表
const getFileList = async () => {
  tableData.value = await PartAttachmentApi.getdatapackageBomId(queryParamsResource)
}
//删除文件数据
const handleDeleteFile = async () => {
  try {
    //删除的二次确认
    await message.delConfirm()
    await PartAttachmentApi.deleteNewFile(queryParamsResource.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getFileList()
  } catch {

  }
}

/**上传文件弹窗 */
const formNewFile = ref()
const openFileForm = () => {
  try {
    formNewFile.value.openFile(queryParamsResource.datapackageBomId);
  } catch { }
}


/** 三维图最大化 */
const showFullScreen = () => {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    el.requestFullscreen().catch((err) => console.error(err));
  } else {
    document.exitFullscreen();
  }
  isImageFullScreen.value = !isImageFullScreen.value;
}

const handleFullScreenChange = () =>{
  isImageFullScreen.value = document.fullscreenElement !== null;
}
// 生命周期钩子
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullScreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>

<style lang="scss">
.node-name {
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
    color: #444;
    display: flex;
}

.node-name::before {
    content: "";
    width: 6px;
    height: 15px;
    background-color: rgb(2, 167, 240);
    margin-right: 5px;
    margin-top: 2px;
    border-radius: 8px;
}

</style>

<!--三维图-->
<style scoped>
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  overflow: auto;
}
</style>
