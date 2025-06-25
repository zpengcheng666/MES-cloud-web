<template>
      <el-row>
        <el-col>
          <ContentWrap>
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              class="-mb-15px"
              label-width="68px"
            >
              <el-form-item label="工装编号" prop="toolingCode">
                <el-input v-model="queryParams.toolingCode" clearable placeholder="请输入工装编号" class="!w-170px"/>
              </el-form-item>
              <el-form-item label="工装图号" prop="toolingNumber">
                <el-input v-model="queryParams.toolingNumber" clearable placeholder="请输入工装图号" class="!w-170px"/>
              </el-form-item>
              <el-form-item label="工装名称" prop="toolingName">
                <el-input v-model="queryParams.toolingName" clearable placeholder="请输入工装名称" class="!w-170px"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-170px">
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
                  @click="submitApproval( selectionList.map((item) => item.id))"
                  :disabled="selectionList.length === 0">
                  工装任务
                </el-button>
              </el-form-item>
            </el-form>
          </ContentWrap>
          <ContentWrap>
                <el-table :data="partDataList" style="cursor: pointer;height:220px;overflow-y: auto"
                          @selection-change="handleSelectionChange" :row-key="getRowKeys">
                  <el-table-column width="30" label="选择" type="selection" />
                  <el-table-column align="center" label="工装编号" prop="toolingCode"  />
                  <el-table-column align="center" label="工装图号" prop="toolingNumber" />
                  <el-table-column align="center" label="工装名称" prop="toolingName" />
                  <el-table-column align="center" label="申请人" prop="applyName" />
                  <el-table-column :formatter="dateFormatter" align="center" label="需求日期" prop="requireTime"/>
                  <el-table-column align="center" label="状态"  prop="status" >
                    <template #default="scope" >
                      <dict-tag :type="DICT_TYPE.PDM_PROCESS_TASK_STATUS " :value="scope.row.status" />
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="设计负责人" prop="reviewer"  width="130px" />
                  <el-table-column :formatter="dateFormatter" align="center" label="设计截止时间" prop="deadline"  width="110px" />
                  <el-table-column label="操作" align="center"  width="60px" >
                    <template #default="scope">
                      <el-button v-if="scope.row.status == '1'" link type="primary" @click="openForm('update',scope.row.tid)">
                        编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
          </ContentWrap>
        </el-col>
      </el-row>
<toolingTaskForm ref="formRef" @success="getPartData" />
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { ToolingTaskApi, ToolingTaskVO} from "@/api/pdm/toolingTask";
import * as UserApi from "@/api/system/user";

import {dateFormatter, formatDate} from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import toolingTaskForm from "@/views/pdm/toolingTask/toolingTaskForm.vue";
defineOptions({name: 'toolingTask'});

const dataList = ref<any[]>([]) // 项目列表
const partDataList = ref([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activeNames = ref(['1'])
const partAttrs = ref([]) //零件动态属性
const reviewerList = ref<any[]>([]); //负责人列表
const statusList=ref([]);//状态列表
const productNumber = ref()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  applyCode: undefined,
  productNumber: undefined,
  toolingCode: undefined,
  toolingName: undefined,
  categoryId: undefined,
  applyName: undefined,
  applyDepartment: undefined,
  quantity: undefined,
  applyReason: undefined,
  requireTime: undefined,
  equipmentName: undefined,
  equipmentNumber: undefined,
  toolingStyle: undefined,
  toolingType: undefined,
  processType: undefined,
  technicalRequirement: undefined,
  status: undefined,
  processInstanceId: undefined,
  approvalStatus: undefined,
  applyNameIdArr: [],
  reviewedBy: undefined,
  reviewer: undefined,
  tid: undefined,
  createTime: [],
})


const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  reviewer: '',
  toolingApplyId: '',
  processInstanceId:''
})

/** 查询负责人列表 */
const getReviewerList = async () => {
  reviewerList.value=await UserApi.getSimpleUserList(reviewerList.reviewedBy);
};

const getStatusList=async ()=>{
  statusList.value = await ToolingTaskApi.getToolingTaskDataList(statusList.status);
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
  partDataList.value = await ToolingTaskApi.getToolingTaskDataList(queryParams)
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
const openForm = (type: string, tid?: string, ids?: string[]) => {
  formRef.value.open(type,tid, ids)
}

const submitApproval = async (ids: number[]) => {
  const hasAssignedTasks = selectionList.value.some((item) => item.status == '1');
  if (hasAssignedTasks) {
    ElMessage.error('请选择未指派的工装设计任务')
    return;
  }
  try {
    selectionList.value = selectionList.value.filter((item) => !ids.includes(item.id));
    openForm('add', null, ids);
  } catch (error) {
    console.error('请选择未指派的任务', error);
  }
};

/** 选中操作 */
const selectionList = ref<ToolingTaskVO[]>([])
const handleSelectionChange = (rows: ToolingTaskVO[]) => {
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
  onMounted(async () => {
    await getList()
  })
</script>
