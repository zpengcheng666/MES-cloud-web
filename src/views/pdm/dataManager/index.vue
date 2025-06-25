<template>
  <el-row :gutter="20">
    <!-- 左侧数据包编号列表 -->
    <el-col :span="3" :xs="24">
      <ContentWrap class="h-1/1">
        <div class="head-container">
          <el-input v-model="queryCodeParams.receiveCode" class="mb-20px" clearable placeholder="数据包编号" @input="getDataList">
            <template #prefix>
              <Icon icon="ep:search" />
            </template>
          </el-input>
        </div>
        <el-table :data="dataList" style="max-width: 160px;cursor: pointer" highlight-current-row @row-click="receiveChange">
          <el-table-column align="center" prop="receiveCode" />
        </el-table>
      </ContentWrap>
    </el-col>
    <el-col :span="21" :xs="24">
      <ContentWrap>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="数据包信息" name="1">
            <el-descriptions :column="4" border>
<!--              <el-descriptions-item label="产品图号" min-width="120">-->
<!--                {{ dataInfo.productNumber }}-->
<!--              </el-descriptions-item>-->
<!--              <el-descriptions-item label="项目编号" min-width="120">-->
<!--                {{ dataInfo.projectCode }}-->
<!--              </el-descriptions-item>-->
              <el-descriptions-item label="厂家" min-width="120">
                {{ dataInfo.companyName }}
              </el-descriptions-item>
              <el-descriptions-item label="数据包编号" min-width="120">
                {{ dataInfo.receiveCode }}
              </el-descriptions-item>
              <el-descriptions-item label="开始时间" min-width="120">
                {{ formatDate(dataInfo.createTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="数据包名称" min-width="120">
                {{ dataInfo.name }}
              </el-descriptions-item>
              <el-descriptions-item label="数据包大小" min-width="120">
                {{ dataInfo.size }}
              </el-descriptions-item>
              <el-descriptions-item label="处理结果" min-width="120">
                {{ dataInfo.status }}
              </el-descriptions-item>
              <el-descriptions-item label="结束时间" min-width="120">
                {{ formatDate(dataInfo.updateTime) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
      </ContentWrap>
      <el-row :gutter="20">
        <el-col :span="12" :xs="24">
          <ContentWrap>
            <el-collapse v-model="activePartName">
              <el-collapse-item title="零件目录" name="1">
                <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="68px">
                  <el-form-item label="零件图号" prop="partNumber">
                    <el-input v-model="queryParams.partNumber" class="!w-240px" clearable placeholder="请输入零件图号"
                              @input="getPartData" />
                  </el-form-item>
                </el-form>
                <el-table :data="partDataList" style="cursor: pointer;height:160px;overflow-y: auto" @row-click="partChange">
                  <el-table-column align="center" label="序号" type="index" width="80px" />
                  <el-table-column align="center" label="零件图号" prop="partNumber" />
                  <el-table-column align="center" label="零件名称" prop="partName" />
                  <el-table-column align="center" label="版次" prop="partVersion" />
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </ContentWrap>
          <ContentWrap v-show="showResult">
            <el-tabs v-model="activeNamePartDetail" class="demo-tabs">
              <el-tab-pane label="零件设计属性" name="1" style="height:200px;overflow-y: auto">
                <el-descriptions :column="1" border>
                  <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index+1">
                    {{ item.attrValue }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
              <el-tab-pane label="文件目录" name="2">
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
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </ContentWrap>
        </el-col>
        <el-col :span="12" :xs="24">
          <ContentWrap v-show="!showModel">
            <div style="width:720px;height:580px">三维图</div>
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
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {DataManagerApi, DataManagerVO} from "@/api/pdm/dataManager";
import {formatDate} from "@/utils/formatTime";
import {PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import { PartMasterApi } from '@/api/pdm/part/partmaster';
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted, ref} from "vue";

const dataList = ref<any[]>([]) // 数据包列表
const dataInfo = ref({} as DataManagerVO)
const partDataList = ref<any[]>([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activeNames = ref(['1'])
const activePartName = ref(['1'])
const activeNamePartDetail = ref(['1'])
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const partAttrs = ref([]) //零件动态属性
const showResult = ref(false) // 零件设计属性显隐
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

const queryCodeParams = reactive({
  receiveCode: ''
})

const queryParams = reactive({
  receiveInfoId: '',
  partNumber: ''
})

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: ''
})

/** 查询数据包列表 */
const getList = async () => {
  await getDataList()
  await getDataInfo(dataList.value[0].id)
  queryParams.receiveInfoId = dataList.value[0].id;
  await getPartData()
}

const getDataList = async () => {
  dataList.value = await DataManagerApi.getDataManagerList(queryCodeParams)
}

const receiveChange = async (val) => {
  showResult.value = false;
  await getDataInfo(val.id)
  queryParams.receiveInfoId = val.id;
  await getPartData()
}

const getDataInfo = async (id) => {
  dataInfo.value = await DataManagerApi.getDataInfo(id)
}

/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = await DataManagerApi.getPartListByReceiveInfoId(queryParams)
}

const partChange = async (val) => {
  showResult.value = true;
  activeNamePartDetail.value = "1";
  queryParamsAttr.rootProductId = val.rootProductId
  queryParamsAttr.customizedIndex = val.customizedIndex
  queryParamsAttr.partVersionId = val.partVersionId
  partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
  tableData.value = await PartAttachmentApi.getdatapackageBomId(val.partVersionId);
  //切换三维图
  showModel.value = true;
  let fileData = tableData.value.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
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

onMounted(async () => {
  await getList()
  document.addEventListener('fullscreenchange', handleFullScreenChange);
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>
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

