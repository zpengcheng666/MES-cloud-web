<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="90px">
      <!-- 搜索工作栏 -->
      <el-form-item label="工装编号" prop="toolingCode">
          <el-input
            v-model="queryParams.toolingCode" placeholder="请输入工装编号" clearable @keyup.enter="search" class="!w-240px"/>
      </el-form-item>

      <el-form-item label="工装图号" prop="toolingNumber">
          <el-input v-model="queryParams.toolingNumber" placeholder="请输入工装图号" clearable @keyup.enter="search" class="!w-240px"/>
      </el-form-item>

      <el-form-item label="工装名称" prop="toolingName">
        <el-input v-model="queryParams.toolingName" placeholder="请输入工装名称" clearable @keyup.enter="search" class="!w-240px"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-110px">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_STATUS)" :key="dict.value"
                     :label="dict.label" :value="dict.value" />
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="search">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['pdm:tooling-category:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" @row-click="partChange">
      <el-table-column align="center" label="工装编号" prop="toolingCode" />
      <el-table-column align="center" label="工装图号" prop="toolingNumber" />
      <el-table-column align="center" label="工装名称" prop="toolingName" />
      <el-table-column align="center" label="工装分类" prop="name" />
      <el-table-column align="center" label="工装形式" prop="toolingStyle">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_TOOLING_STYLE" :value="scope.row.toolingStyle" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="加工类型" prop="processType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_TOOLING_APPLY_PROCESS_TYPE" :value="scope.row.processType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="申请人" prop="applyName" />
      <el-table-column align="center" label="申请数量" prop="quantity" />
      <el-table-column :formatter="dateFormatter" align="center" label="需求日期" prop="requireTime" />
      <el-table-column align="center" label="状态" prop="status" >
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.PDM_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="(scope.row.status === 0 || scope.row.status === 2) && (userId + '' === scope.row.applyId)"
            @click="openForm('update', scope.row.id, scope.row.toolingCode,scope.row.toolingNumber,scope.row.toolingName)"
            v-hasPermi="['pdm:tooling-category:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            v-if="(scope.row.status === 0 || scope.row.status === 2) && (userId + '' === scope.row.applyId)"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['pdm:tooling-category:delete']"
          >
            删除
          </el-button>
          <el-button v-if="(scope.row.status === 0 || scope.row.status === 2) && (userId + '' === scope.row.applyId)"
                     link type="primary" @click="startApplyInstance(scope.row.id)">发起</el-button>
          <el-button
            v-if="(scope.row.status === 1 || scope.row.status === 2 || scope.row.status === 3) && (userId + '' === scope.row.applyId)"
            link type="primary" @click="handleApplyDetail(scope.row.processInstanceId)">进度</el-button>
        </template>
      </el-table-column>
    </el-table>

  </ContentWrap>
  <!-- 分页 -->
  <Pagination
    :total="total"
    v-model:page="queryParams.pageNo"
    v-model:limit="queryParams.pageSize"
    @pagination="getList"
  />
  <ToolingApplyForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { dateFormatter } from '@/utils/formatTime'
import { onMounted } from 'vue';
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { ToolingApplyApi, ToolingApplyVO } from '@/api/pdm/toolingApply'
import ToolingApplyForm from "./ToolingApply.vue";
import {useUserStore} from "@/store/modules/user";
import {ToolingCategoryApi} from "@/api/pdm/toolingCategory";

const isOperator = ref(false)
const userStore = useUserStore();
const userId = userStore.getUser.id; // 当前登录用户id
const userName = userStore.getUser.nickname;
const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化
const loading = ref(true); // 列表的加载中
const total=ref(0)//列表总页数
const list = ref<ToolingApplyVO[]>([]); // 列表的数据
const applyList = ref([]);
const categoryNameList = ref([]); //工装分类名称
const { push } = useRouter() // 路由

// 新增的三个列表
const toolingCodeList = ref([]); // 工装编号列表
const toolingNumberList = ref([]); // 工装图号列表
const toolingNameList = ref([]); // 工装名称列表

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: '',
  categoryId: '',
  toolingCode: '',
  toolingNumber: '',
  toolingName: '',
  toolingVersion: '',
  applyName: '',
  quantity: '',
  toolingStyle: '',
  processType: '',
  applyReason: '',
  requireTime: '',
  equipmentName: '',
  equipmentNumber: '',
  technicalRequirement: '',
  customizedIndex: '',
  status: '',
  processInstanceId: '',
  approvalStatus: '',
  name:'',
  applyId: '',
  parentId:''
});
const queryFormRef = ref(); // 搜索的表单

const startApplyParams = reactive({
  status: '1',
  id: ''
})

/** 查看流程进度 */
const handleApplyDetail = async (id: number) => {
  console.log(id)
  push({
    name: 'BpmProcessInstanceDetail',
    query: {
      id: id
    }
  })
}
/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    applyList.value = await ToolingCategoryApi.getProductCategoryList(queryParams);
    const data = await ToolingApplyApi.getToolingApplyPage(queryParams);
    list.value=data.list
    total.value=data.total
    list.value.forEach(item => {
      const applyItem = applyList.value.find(apply => apply.id === item.categoryId);
      if (applyItem) {
        item.name = applyItem.name;
      }
    });
    categoryNameList.value = await ToolingCategoryApi.getToolingCategoryPage(queryParams);
    toolingCodeList.value = applyList.value.map(item => item.toolingCode);
    toolingNumberList.value = applyList.value.map(item => item.toolingNumber);
    toolingNameList.value = applyList.value.map(item => item.toolingName);
  } finally {
    loading.value = false;
  }
};

/** 发起流程 */
const startApplyInstance = async (id: number) => {
  startApplyParams.id = id
  await ToolingApplyApi.startApplyInstance(startApplyParams)
  message.success('发起成功')
  // 刷新零件目录状态
  await getList()
}

/**时间格式*/
const dateFormatter = (row: any, column: any, cellValue: any) => {
  if (cellValue) {
    const date = new Date(cellValue);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  return '';
};
//搜索
const search = async () => {
  queryParams.pageNo=1
  // await ToolingApplyApi.getToolingApplyList(queryParams);
  getList();
}

/** 添加/修改操作 */
const formRef = ref();
const openForm = (type: string, id?: number,toolingCode:string,toolingNumber:string,toolingName:string) => {

  formRef.value.open(type, id,toolingCode,toolingNumber,toolingName);
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm();
    // 发起删除
    await ToolingApplyApi.deleteToolingApply(id);
    message.success(t('common.delSuccess'));
    // 刷新列表
    await getList();
  } catch {}
}

const emit = defineEmits(['success']);

/** 重置按钮操作 */
const resetQuery = () => {
  nextTick(() => {
    queryFormRef.value.resetFields();
    getList();
  });
}


/** 初始化 **/
onMounted(() => {
  getList();
});
</script>
