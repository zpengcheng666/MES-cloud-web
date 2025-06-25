<template>
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
                v-for="dict in getIntDictOptions(DICT_TYPE.PDM_TOOLING_TASK_STATUS)"
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
          </el-form-item>
        </el-form>
      </ContentWrap>
      <ContentWrap>
        <el-row :gutter="30">
          <el-col :span="16" :xs="24">
            <ContentWrap>
              <el-table :data="partDataList" style="cursor: pointer;height:580px"
                        @row-click="handleStructureNodeClick" v-model="activeName1" :row-key="getRowKeys">
                <el-table-column align="center" label="工装编号" prop="toolingCode" />
                <el-table-column align="center" label="工装图号" prop="toolingNumber" />
                <el-table-column align="center" label="工装名称" prop="toolingName" />
                <el-table-column align="center" label="申请人" prop="applyName" />
                <el-table-column :formatter="dateFormatter" align="center" label="需求日期" prop="requireTime"/>
                <el-table-column align="center" label="状态"  prop="status" >
                  <template #default="scope" >
                    <dict-tag :type="DICT_TYPE.PDM_TOOLING_TASK_STATUS " :value="scope.row.status" />
                  </template>
                </el-table-column>
                <el-table-column align="center" label="设计负责人" prop="reviewer"  width="130px" />
                <el-table-column :formatter="dateFormatter" align="center" label="设计截止时间" prop="deadline"  width="110px" />
                <el-table-column label="操作" align="center"  width="110px" >
                <template #default="scope">
                  <el-button  v-if="(scope.row.status === 2 || scope.row.status === 4) && (userId + '' === scope.row.reviewedBy)"
                             link type="primary" @click="startDetailInstance(scope.row.tid)">发起</el-button>
                  <el-button
                    v-if="(scope.row.status === 3 || scope.row.status === 4 || scope.row.status === 5) && (userId + '' === scope.row.reviewedBy)"
                    link type="primary" @click="handleToolingDetail(scope.row.processInstanceId)">进度</el-button>
                </template>
                </el-table-column>
              </el-table>
            </ContentWrap>
          </el-col>
          <el-col :span="8" :xs="24">
            <ContentWrap>
              <el-tabs v-model="activeName1" class="demo-tabs" @tab-click="handleClick1">
                <el-tab-pane label="工装属性" name="second" style="height:580px;overflow-y: auto">
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="工装分类">
                      {{ detailData.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="工装编号" min-width="120">
                      {{ detailData.toolingCode }}
                    </el-descriptions-item>
                    <el-descriptions-item label="工装图号" min-width="120">
                      {{ detailData.toolingNumber }}
                    </el-descriptions-item>
                    <el-descriptions-item label="工装名称" min-width="120">
                      {{ detailData.toolingName }}
                    </el-descriptions-item>
                    <el-descriptions-item label="申请人" min-width="120">
                    {{ detailData.applyName }}
                  </el-descriptions-item>
                    <el-descriptions-item label="申请数量" min-width="120">
                    {{ detailData.quantity }}
                  </el-descriptions-item>
                    <el-descriptions-item label="工装形式">
                      <template #default>
                        <dict-tag :type="DICT_TYPE.PDM_TOOLING_STYLE" :value="detailData.toolingStyle" />
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item label="加工类型">
                      <template #default>
                        <dict-tag :type="DICT_TYPE.PDM_TOOLING_APPLY_PROCESS_TYPE" :value="detailData.processType" />
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item label="申请理由">
                      <template #default>
                        <dict-tag :type="DICT_TYPE.PDM_TOOLING_APPLY_REASON" :value="detailData.applyReason" />
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item label="需求日期" min-width="120">
                      {{ formatDate(detailData.requireTime , 'YYYY-MM-DD') }}
                  </el-descriptions-item>
                    <el-descriptions-item label="设备名称" min-width="120">
                    {{ detailData.equipmentName }}
                  </el-descriptions-item>
                    <el-descriptions-item label="设备型号" min-width="120">
                    {{ detailData.equipmentNumber }}
                  </el-descriptions-item>
                    <el-descriptions-item label="技术条件" min-width="120">
                      {{ detailData.technicalRequirement }}
                    </el-descriptions-item>
                    <el-descriptions-item label="设计员" min-width="120">
                      {{ detailData.reviewer }}
                    </el-descriptions-item>
                    <el-descriptions-item label="设计截止日期" min-width="120">
                      {{ formatDate(detailData.deadline , 'YYYY-MM-DD') }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="文件目录" name="third">
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
        </el-row>
  </ContentWrap>
  <toolingTaskForm ref="formRef" @success="getPartData" />
</template>
<script setup lang="ts">
import { ToolingTaskApi, ToolingTaskVO} from "@/api/pdm/toolingTask";
import {dateFormatter, formatDate} from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {ref} from "vue";
import {useUserStore} from "@/store/modules/user";
defineOptions({name: 'toolingTask'});

const { push } = useRouter() // 路由
const activeName1 = ref('second')
const dataList = ref<any[]>([]) // 项目列表
const partDataList = ref([]) // 零件目录列表
const queryFormRef = ref() // 搜索的表单
const activeNames = ref(['1'])
const detailData = ref({} as ToolingTaskVO)
const partAttrs = ref([]) //零件动态属性
const tableData = ref<ToolingTaskVO[]>([]) // 文件目录数据
const productNumber = ref()
const message = useMessage(); // 消息弹窗
const userStore = useUserStore();
const userId = userStore.getUser.id; // 当前登录用户id
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: undefined,
  applyCode: undefined,
  productNumber: undefined,
  toolingCode: undefined,
  toolingVersion: undefined,
  toolingName: undefined,
  toolingNumber: undefined,
  categoryId: undefined,
  applyId: '',
  customizedIndex: undefined,
  applyName: undefined,
  applyDepartment: undefined,
  quantity: undefined,
  name: undefined,
  applyReason: undefined,
  requireTime: undefined,
  equipmentName: undefined,
  equipmentNumber: undefined,
  toolingStyle: undefined,
  toolingType: undefined,
  processType: undefined,
  technicalRequirement: undefined,
  status: '',
  customizedIndex: undefined,
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
  partVersionId: '',
  reviewer: '',
  toolingApplyId: '',
  processInstanceId:''
})

/** 查询项目列表 */
const getList = async () => {
  await getPartData();
};

/** 搜索按钮操作 */
const getPartData = async () => {
  partDataList.value = await ToolingTaskApi.getToolingDetailList(queryParams)
}

const getRowKeys= (row) => {
  return row.id
}

/** 发起流程 */
const startDetailInstance = async (id: number) => {
  startApplyParams.id = id
  await ToolingTaskApi.startDetailInstance(startApplyParams)
  console.log("传入的id为:",startApplyParams.id)
  message.success('发起成功')
  // 刷新零件目录状态
  await getList()
}

/** 查看流程进度 */
const handleToolingDetail = async (id: number) => {
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: id
    }
  })
}

/**
 * 点击行事件
 * @param val
 */
const handleStructureNodeClick = async (val) => {
  detailData.value = await ToolingTaskApi.getToolingDetailById(val.id)
  tableData.value = await ToolingTaskApi.getFile(val.customizedIndex);
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getPartData()
}

const startApplyParams = reactive({
  status: '3',
  id: ''
})

/** 指派/编辑操作 */
const formRef=ref()
const openForm = (type: string, tid?: string, ids?: string[]) => {
  formRef.value.open(type,tid, ids)
}

/** 选中操作 */
const selectionList = ref<ToolingTaskVO[]>([])

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
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
