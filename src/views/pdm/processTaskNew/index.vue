<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="项目号" prop="projectCode">
        <el-input v-model="queryParams.projectCode" class="!w-160px" clearable placeholder="请输入项目号"/>
      </el-form-item>
      <el-form-item label="零件图号" prop="partNumber">
        <el-input v-model="queryParams.partNumber" class="!w-160px" clearable placeholder="请输入零件图号"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-160px">
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.PDM_PROCESS_TASK_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="getPartData">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button
          plain
          type="primary"
          @click="submitApproval( selectionList.map((item) => item.id),
                  selectionList.map((item) => item.taskId),
                  selectionList.map((item) => item.processPreparationTime))"
          :disabled="selectionList.length === 0">
          工艺任务
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <el-row :gutter="10">
    <el-col :span="16" :xs="24">
      <ContentWrap>
        <el-collapse v-model="activePartName">
          <el-collapse-item title="编制任务目录" name="1">
            <el-table ref="multipleTable" :data="partDataList" style="cursor: pointer;height:220px;overflow-y: auto" @row-click="partChange"
                      @selection-change="handleSelectionChange" :row-key="getRowKeys">
              <el-table-column width="30" label="选择" type="selection" />
              <el-table-column align="center" label="序号" type="index" width="55px" />
              <el-table-column align="center" label="项目号" prop="projectCode" width="130px"/>
              <el-table-column align="center" label="零件图号" prop="partNumber"/>
              <el-table-column align="center" label="零件名称" prop="partName" />
              <el-table-column align="center" label="加工状态" prop="processCondition" width="100px"/>
              <el-table-column :formatter="dateFormatter" align="center" label="工艺准备完成时间" prop="processPreparationTime"  width="140px" />
              <el-table-column align="center" label="状态"  prop="status" width="80px">
                <template #default="scope" >
                  <dict-tag :type="DICT_TYPE.PDM_PROCESS_TASK_STATUS " :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="编制负责人" prop="reviewer"  width="115px" />
              <el-table-column :formatter="dateFormatter" align="center" label="编制截止时间" prop="deadline"  width="110px" />
              <el-table-column label="操作" align="center"  width="60px" >
                <template #default="scope">
                  <el-button v-if="scope.row.status === '1'" link type="primary" @click="openForm('update',scope.row.taskId)">
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </ContentWrap>
      <ContentWrap v-show="showResult">
        <el-tabs v-model="activeNamePartDetail" class="demo-tabs">
          <el-tab-pane label="零件设计属性" name="1" style="height:300px;overflow-y: auto">
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
    <el-col :span="8" :xs="24">
      <ContentWrap v-show="!showModel">
        <div style="width:320px;height:680px">三维图</div>
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
<ProcessTaskForm ref="formRef" @success="getPartData" />
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {PartAttachmentApi, PartAttachmentVO} from "@/api/pdm/part/partattachment";
import { PartMasterApi } from '@/api/pdm/part/partmaster';
import { ProcessTaskApi, ProcessTaskVO} from "@/api/pdm/processTask";
import * as ProductApi from '@/api/pdm/product';
import * as UserApi from "@/api/system/user";
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import ProcessTaskForm from "@/views/pdm/processTaskNew/processTaskForm.vue";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);

defineOptions({name: 'processTask'});

const partDataList = ref([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activeNames = ref(['1'])
const activePartName = ref(['1'])
const activeNamePartDetail = ref(['1'])
const tableData = ref<PartAttachmentVO[]>([]) // 文件目录列表
const partAttrs = ref([]) //零件动态属性
const reviewerList = ref<any[]>([]); //负责人列表
const statusList=ref([]);//状态列表
const showResult = ref(false)
const productNumber = ref()
const queryCodeParams = reactive({
  code: ''
})

const queryParams = reactive({
  id:'',
  taskId: '',
  taskIds:'',
  partVersionId: '',
  projectCode: '',
  partNumber: '',
  reviewedBy:undefined,
  reviewer: undefined,
  processInstanceId:'',
  status: ''
})

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: '',
  processInstanceId:''
})

/** 查询负责人列表 */
const getReviewerList = async () => {
  reviewerList.value=await UserApi.getSimpleUserList(reviewerList.reviewedBy);
};

const getStatusList=async ()=>{
  statusList.value = await ProcessTaskApi.getPartListByProcessTaskId(statusList.status);
  const statusSet = new Set(statusList.value.map(item => item.status));
  statusList.value = Array.from(statusSet).map(status => ({ status }));
};
/** 查询项目列表 */
const getList = async () => {
  await getPartData();
  await getReviewerList(); // 获取负责人
  await getStatusList();
};

/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = await ProcessTaskApi.getPartListByProjectCode(queryParams)
}

const getRowKeys= (row) => {
   return row.id
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getPartData()
}

/** 指派/编辑操作 */
const formRef=ref()
const openForm = (type: string, taskId?: string, taskIds?: string[], processPreparationTime?: Date) => {
  formRef.value.open(type,taskId, taskIds, processPreparationTime)
}

const submitApproval = async (ids: number[],taskIds?: string[], processPreparationTimes: Date[]) => {

  const hasAssignedTasks = selectionList.value.some((item) => item.status === '1');
  if (hasAssignedTasks) {
    ElMessage.error('请选择未指派的编制任务')
    return;
  }
  try {
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.partVersionId));
    openForm('add', null, taskIds, processPreparationTimes[0]);
  } catch (error) {
    console.error('请选择未指派的任务', error);
  }
};

/** 选中操作 */
const selectionList = ref<ProcessTaskVO[]>([])
const handleSelectionChange = (rows: ProcessTaskVO[]) => {
  selectionList.value = rows
}

const partChange = async (val) => {
  showResult.value = true;
  activeNamePartDetail.value = "1";
  productNumber.value = val.productNumber
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
/**时间格式*/
const dateFormatter = (row: any, column: any, cellValue: any) => {
  if (cellValue) {
    const date = new Date(cellValue);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  return '';
};
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
  /** 下载文件 */
  const downloadFile = async (vaultUrl: string) => {
    window.open(vaultUrl, '_blank');
  }
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
