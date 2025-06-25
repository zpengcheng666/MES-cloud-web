<template>
  <el-row :gutter="10">
    <!-- 左侧结构树 -->
    <el-col :span="3" :xs="28">
      <ContentWrap class="h-1/1">
        <div class="head-container">
          <el-input v-model="queryCodeParams.code" class="mb-20px" clearable placeholder="项目编号" @input="getDataList">
            <template #prefix>
              <Icon icon="ep:search" />
            </template>
          </el-input>
        </div>
        <el-table :data="dataList" style="max-width: 160px;cursor: pointer" highlight-current-row @row-click="projectChange">
          <el-table-column align="center" prop="code" />
        </el-table>
      </ContentWrap>
    </el-col>
    <el-col :span="21" :xs="24">
      <el-row :gutter="10">
        <el-col :span="16" :xs="24">
          <ContentWrap>
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              class="-mb-15px"
              label-width="68px"
            >
              <el-form-item label="零件图号" prop="partNumber">
                <el-input v-model="queryParams.partNumber" class="!w-130px" clearable placeholder="请输入零件图号"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-180px">
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
                <el-button  plain type="primary"
                            @click="submitApproval(selectionList.map((item) => item.id),selectionList.map((item) => item.partVersionId),selectionList.map((item) => item.processVersionId))"
                            :disabled="selectionList.length === 0">
                  工艺任务
                </el-button>
                <el-button type="danger" plain @click="toggleExpandAll">
                  <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
                </el-button>
              </el-form-item>
            </el-form>
          </ContentWrap>
          <ContentWrap>
            <el-table ref="multipleTable" :data="partDataList" :stripe="true" @row-click="partChange" style="cursor: pointer"
                      @selection-change="handleSelectionChange" :row-key="getRowKeys" v-if="refreshTable" :default-expand-all="isExpandAll">
              <el-table-column width="30" label="选择" type="selection" />
              <el-table-column label="节点名称" prop="name" />
              <el-table-column align="center" label="节点类型" prop="typeName" />
              <el-table-column align="center" label="状态"  prop="status" width="100px">
                <template #default="scope" >
                  <dict-tag v-if="scope.row.type==='3'" :type="DICT_TYPE.PDM_PROCESS_TASK_STATUS " :value="scope.row.status" />
                </template>
              </el-table-column>
              <el-table-column label="负责人" prop="reviewer" width="115px" />
              <el-table-column :formatter="dateFormatter" align="center" label="编制截止时间" prop="deadline"  width="110px" />
              <el-table-column label="操作" width="80px" >
                <template #default="scope">
                  <el-button v-if="scope.row.status === '1'" link type="primary" @click="openForm('update',scope.row.taskId, [], queryParams.projectCode, scope.row.status, queryParams.id, queryParams.processVersionId)">
                    编辑
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </ContentWrap>
        </el-col>
        <el-col :span="8" :xs="24">
          <ContentWrap v-show="!showModel">
            <div style="width:320px;height:745px">三维图</div>
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
  <ProcessTaskForm ref="formRef" @success="getPartData" />
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import * as ProductApi from '@/api/pdm/product';
import * as UserApi from "@/api/system/user";
import { dateFormatter } from '@/utils/formatTime'
import { handleTree } from '@/utils/tree'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import ProcessTaskForm from "@/views/pdm/processDetailTask/processTaskForm.vue";
import {ProcessDetailTaskApi,ProcessDetailTaskVO} from "@/api/pdm/processDetailTask";
import threejsModel from '../../threejs/model/index.vue'
import {onUnmounted} from "vue";
import {PartAttachmentApi} from "@/api/pdm/part/partattachment";
const showModel = ref(false) // 三维图显示
const modelUrl = ref('')
const processInfo = ref('')
const isImageFullScreen = ref(false);
const scale = ref(1);
defineOptions({name: 'processTask'});

const dataList = ref<any[]>([]) // 项目列表
const partDataList = ref([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activeNames = ref(['1'])
const reviewerList = ref<any[]>([]); //负责人列表
const statusList=ref([]);//状态列表
const productNumber = ref()
/** 展开/折叠操作 */
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

const queryCodeParams = reactive({
  code: ''
})

const queryParams = reactive({
  id:'',
  taskId: '',
  partVersionId: '',
  projectCode: '',
  partNumber: '',
  reviewedBy:undefined,
  reviewer: undefined,
  processInstanceId:'',
  status: '',
  processVersionId: '',
  procedureId: ''
})



/** 查询负责人列表 */
const getReviewerList = async () => {
  reviewerList.value=await UserApi.getSimpleUserList(reviewerList.reviewedBy);
};

const getStatusList=async ()=>{
  statusList.value = await ProcessDetailTaskApi.getPartListByProcessTaskId(statusList.status);
  const statusSet = new Set(statusList.value.map(item => item.status));
  statusList.value = Array.from(statusSet).map(status => ({ status }));
};
/** 查询项目列表 */
const getList = async () => {
  await getDataList();
  queryParams.projectCode = dataList.value[0].code;
  await getPartData();
  await getReviewerList(); // 获取负责人
  await getStatusList();
};
const projectChange = async (val) => {
  queryParams.projectCode = val.code;
  await getPartData()
}

const getDataList = async () => {
  dataList.value = await ProductApi.getProjectList(queryCodeParams)
}


/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = []
  const data = await ProcessDetailTaskApi.getProjPartBomTreeList(queryParams)
  partDataList.value.push(...handleTree(data))
  statusList.value = await ProcessDetailTaskApi.getPartListByProcessTaskId(statusList.status);
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
const openForm = (type: string, taskId?: string, partVersionIds?: string[], projectCode?: string,status?: string,procedureIds?:string[],processVersionId?:string) => {
  formRef.value.open(type,taskId, partVersionIds,projectCode,status,procedureIds,processVersionId)
}

const submitApproval = async (ids: number[], partVersionIds: string[],processVersionIds:string[]) => {
  const hasAssignedTasks = selectionList.value.some((item) => item.status === '1');
  if (hasAssignedTasks) {
    ElMessage.error('请选择未指派的编制任务')
    return;
  }

  try {
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.partVersionId));
    openForm('add', null, partVersionIds, queryParams.projectCode, ids, processVersionIds);
  } catch (error) {
    console.error('请选择未指派的任务', error);
  }
};

/** 选中操作 */
const selectionList = ref<ProcessDetailTaskVO[]>([])
const handleSelectionChange = (rows: ProcessDetailTaskVO[]) => {
  //过滤工序节点
  rows = rows.filter((item) => item.type ==='3')
  selectionList.value = rows
}

/**时间格式*/
const dateFormatter = (row: any, column: any, cellValue: any) => {
  if (cellValue) {
    const date = new Date(cellValue);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  return '';
};

const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

//选中行数据事件
const partChange = async (val) => {
  let tableData = await PartAttachmentApi.getdatapackageBomId(val.partVersionId);
  //切换三维图
  showModel.value = true;
  let fileData = tableData.filter((item) => item.fileType ==='CATPart')
  if(fileData.length>0) {
    modelUrl.value = await PartAttachmentApi.getModelUrl(fileData[0].fileName, 'obj')
  }
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
