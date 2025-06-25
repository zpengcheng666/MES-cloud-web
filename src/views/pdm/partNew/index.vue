<template>
  <!-- 左侧树 -->
  <ContentWrap>
    <el-row :gutter="20">
      <!-- 左侧数据包结构树 -->
      <el-col :span="6" :xs="24">
        <ContentWrap>
          <div class="head-container">
            <el-input v-model="name" class="mb-20px" clearable placeholder="请输入节点名称">
              <template #prefix>
                <Icon icon="ep:search" />
              </template>
            </el-input>
          </div>
          <div class="head-container" style="height:680px;overflow-y:auto">
            <span style="font-size:14px;margin-left:10px">展开/折叠：</span>
            <el-switch v-model="menuExpand"
                       @change="updateTreeExpansion" />
            <el-tree ref="treeRef" :data="treeList" :expand-on-click-node="false" :props="defaultProps"
                     highlight-current node-key="id" :current-node-key="0" @node-click="handleStructureNodeClick"
                     :default-expanded-keys="expandedKeys" :filter-node-method="filterNode">
              <template #default="{ data }">
                  <span class="custom-tree-node">
                    <img src="../../../../src/assets/imgs/data.png" class="icon" v-if="data.type === 0" />
                    <img src="../../../../src/assets/imgs/structure.png" class="icon" v-if="data.type === 1" />
                    <img src="../../../../src/assets/imgs/file.png" class="icon" v-if="data.type === 2" />
                    <span>{{ data.name }}</span>
                  </span>
              </template>
            </el-tree>
          </div>
        </ContentWrap>
      </el-col>

      <el-col :span="9" :xs="24">
        <ContentWrap class="h-1/1" v-show="productInfo">
          <el-button type="primary"  @click="openForm('create')" plain >
            <Icon icon="ep:plus" /> 新增零件
          </el-button>

          <el-button type="danger"  plain v-show="deleteP" @click="handleDeletePart">
            删除零件
          </el-button>
          <el-tabs v-model="activeName1" class="demo-tabs" @tab-click="handleClick1">
            <el-tab-pane label="零部件属性" name="second" style="height:620px;overflow-y: auto">
              <div class="node-name">基本属性</div>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="零件图号" min-width="120">
                  {{ detailData.partNumber }}
                </el-descriptions-item>
                <el-descriptions-item label="零件名称">
                  {{ detailData.partName }}
                </el-descriptions-item>
                <el-descriptions-item label="加工状态" min-width="120">
                  {{ detailData.processCondition }}
                </el-descriptions-item>
<!--                <el-descriptions-item label="版本" min-width="120">-->
<!--                  {{ detailData.partVersion }}-->
<!--                </el-descriptions-item>-->
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
                    <el-link :underline="false" style="font-size: 12px;" type="primary"
                             @click="downloadFile(scope.row.vaultUrl)">
                      下载
                    </el-link>&nbsp;&nbsp;&nbsp;
                    <el-button link type="danger" style="font-size: 12px; margin-left: 10px;"
                               v-if="scope.row.fileSource === '1'"
                               @click="handleDeleteFile(scope.row.id)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
<!--            <el-tab-pane label="文档属性" name="fourth" @tab-click="handleClick2">-->
<!--              <div class="node-name">基本属性</div>-->
<!--              <el-descriptions :column="1" border>-->
<!--                <el-descriptions-item label="文档名称" min-width="120">-->
<!--                  {{ documentFile.documentName }}-->
<!--                </el-descriptions-item>-->
<!--                <el-descriptions-item label="类型">-->
<!--                  {{ documentFile.documentType }}-->
<!--                </el-descriptions-item>-->
<!--                <el-descriptions-item label="版本" min-width="120">-->
<!--                  {{ documentFile.documentVersion }}-->
<!--                </el-descriptions-item>-->
<!--              </el-descriptions>-->
<!--            </el-tab-pane>-->
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
  <AddPartForm ref="formRef" @success="getTree()" />
</template>
<script setup lang="ts">
import FileForm from './FileForm.vue';
import { PartMasterApi, PartMasterVO } from '@/api/pdm/part/partmaster';
import { PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import { PartDocumentVersionApi, PartDocumentVersionVO } from '@/api/pdm/part/partdocument'
import AddPartForm from './AddPartForm.vue';
import { ref } from 'vue'
import { onMounted, onUnmounted } from 'vue';
import {ElTree, TabsPaneContext} from 'element-plus'
import threejsModel from '../../threejs/model/index.vue'
import {defaultProps, handleTree} from "@/utils/tree";
import {PartNewApi} from "@/api/pdm/partNew";
import {useUserStore} from "@/store/modules/user";
import {ToolingApplyApi} from "@/api/pdm/toolingApply";

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由
const activeName = ref('first')
const activeName1 = ref('second')
const tableData = ref<PartAttachmentVO[]>([]) // 列表的数据
const partAttrs = ref([]) //零件动态属性
const name = ref('')
const userStore = useUserStore()
const userId = userStore.getUser.id // 当前登录用户id
const treeRef = ref();
const menuExpand = ref(true) // 展开/折叠
const expandedKeys = ref([]);
const treeList = ref<Tree[]>([]) // 树形结构
const detailData = ref({} as PartMasterVO)
const documentFile = ref({} as PartDocumentVersionVO)
const dialogVisible = ref(false) // 弹窗的是否展示
const deleteP = ref(false) // 删除弹窗的是否展示
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

const productInfo = ref(true) //产品信息或零部件信息显隐

/** 获得结构树 */
const getTree = async () => {
  treeList.value = []
  const data = await PartNewApi.getNewPartBomTreeList(queryParams)
  treeList.value.push(...handleTree(data))
  expandedKeys.value = getAllNodeIds(treeList.value);
}
// 获取整个树的节点
const getAllNodeIds = (nodeOrNodes) => {
  let nodes = nodeOrNodes;
  if (!Array.isArray(nodes)) {
    nodes = [nodes]; // 如果传入的是单个节点，将其转换为数组
  }
  return nodes.reduce((acc, node) => {
    acc.push(node.id);
    if (node.children && node.children.length > 0) {
      acc.push(...getAllNodeIds(node.children));
    }
    return acc;
  }, []);
};
/** 左侧结构树的展开/折叠全部 */
const updateTreeExpansion = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
  }
}

/** 处理数据包结构树被点击 */
const handleStructureNodeClick = async (row) => {
  let parentId = row.parentId;
  if (parentId == '0') {
    productInfo.value = true;
  } else if(parentId == '1') {}
  else {
    showModel.value = true;
    productInfo.value = true;
    detailData.value = await PartMasterApi.getAll(row.partVersionId)
console.log('出来吧',detailData.value)
    if(detailData.value.source == '1') {
      deleteP.value = true;
    }else{
      deleteP.value = false;
    }
    queryParamsResource.partVersionId = row.partVersionId
    await getFileList()
    documentFile.value = await PartDocumentVersionApi.getDocumentVersion(row.partVersionId)
    queryParamsAttr.rootProductId = row.rootproductId
    queryParamsAttr.customizedIndex = row.customizedIndex
    queryParamsAttr.partVersionId = row.partVersionId
    queryParamsResource.datapackageBomId = row.datapackageBomId
    partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)

    //切换三维图
    let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
    if(fileData.length>0) {
      modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
      console.log(modelUrl.value)
      let txtUrl = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'txt')
      console.log(txtUrl)
    }
  }
}

const queryParamsResource = reactive({
  id: '',
  fileType: '',
  fileName: '',
  vaultUrl: '',
  datapackageBomId: '',
  fileSource :'1',
  creator: '',
  updater: '',
  fileId: '',
  partVersionId: '',
})

const formRules = reactive({
  name: [{ required: true, message: '产品图号不能为空', trigger: 'blur' }],
})

const queryParams = reactive({
  rootProductId: ''
})

const productParams = reactive({
  status: 0,
  productType: 0
})

const queryFormRef = ref() // 搜索的表单


/** 初始化 **/
onMounted(() => {
  getTree()
})

/** 监听name */
watch(name, (val) => {
  treeRef.value!.filter(val)
})

/** 基于名字过滤 */
const filterNode = (name: string, data: Tree) => {
  if (!name) return true
  return data.name.includes(name)
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/**上传文件弹窗 */
const formNewFile = ref()
const openFileForm = () => {
  try {
    // 手动录入零件信息时无bomId，取PVID
    let datapackageBomId = queryParamsResource.datapackageBomId;
    if(datapackageBomId == null || datapackageBomId == '') {
      datapackageBomId = queryParamsResource.partVersionId
    }
    formNewFile.value.openFile(datapackageBomId);
  } catch { }
}

//删除文件数据
const handleDeleteFile = async (id) => {
  try {
    //删除的二次确认
    await message.delConfirm()
    queryParamsResource.id = id
    await PartAttachmentApi.deleteNewFile(queryParamsResource)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getFileList()
  } catch {

  }
}

/** 删除零件 */
const handleDeletePart = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    const data = detailData.value as unknown as PartMasterVO
    console.log("数据",data)
    // 发起删除
    await PartMasterApi.deletePart(data);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getTree()
  } catch {}
}

/** 刷新文件目录列表 */
const getFileList = async () => {
  tableData.value = await PartAttachmentApi.getdatapackageBomId(queryParamsResource.partVersionId);
}

/** 新增零件 */
const formRef = ref() // 新增零件表单 Ref
const openForm = (rootProductId:string ) => {
  rootProductId = '97e734f8f5fe4e068f38c7be046b3537';
  formRef.value.open(rootProductId)
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

.icon {
  width: 16px;
  height: 16px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  padding-top: 5px;
  padding-right: 3px;
  box-sizing: content-box;
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
