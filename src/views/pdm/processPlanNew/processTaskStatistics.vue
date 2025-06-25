<template>
  <ContentWrap>
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="98px">
      <el-form-item label="负责人" prop="reviewedBy">
        <el-select v-model="queryParams.reviewedBy" placeholder="请选择负责人" clearable class="!w-390px"
                   @change="handleReviewerChange">
          <!-- 从系统用户表取用户<el-option v-for="re in reviewerList" :key="re.id" :label="re.nickname" :value="re.id" />-->
           <el-option v-for="re in reviewerList" :key="re.reviewedBy" :label="re.reviewer" :value="re.reviewedBy" />
        </el-select>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
<!--        <el-date-picker-->
<!--          v-model="queryParams.updateTime"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          class="!w-1/1"-->
<!--        />-->
        <el-date-picker
          v-model="queryParams.updateTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" >
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
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="负责人编号" prop="reviewedBy" />
      <el-table-column align="center" label="负责人" prop="reviewer" />
      <el-table-column align="center" label="待编制" prop="one" />
      <el-table-column align="center" label="已编制" prop="two" />
      <el-table-column align="center" label="审批中" prop="three" />
      <el-table-column align="center" label="已定版" prop="five" />
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import * as UserApi from "@/api/system/user";
import { ProcessTaskStatisticsApi, processTaskStatisticsVO } from "@/api/pdm/processPlanNew";

const { t } = useI18n(); // 国际化
const reviewerList = ref<any[]>([]);
const loading = ref(true); // 列表加载
const list = ref<processTaskStatisticsVO[]>([]); // 列表的数据
const queryParams = reactive({
  reviewedBy: '',
  reviewer: '',
  one: '',
  two: '',
  three: '',
  five: '',
  updateTime: []
});
const formData = ref({
  reviewedBy: '',
  reviewer: '',
  updateTime: []
});
const queryFormRef = ref(); // 搜索的表单

const getReviewerList = async () => {
  //从系统表取用户 const userList = await UserApi.getSimpleUserList();
  // reviewerList.value = userList.map(user => ({ id: user.id, nickname: user.nickname }));
  const userList = await ProcessTaskStatisticsApi.getProcessTaskStatistics();
  reviewerList.value = userList.map(user => ({ reviewedBy: user.reviewedBy, reviewer: user.reviewer }));
};

const handleQuery = () => {
  getList();
};

const handleReviewerChange = (selectedId: string) => {
  getReviewerList()
  const selectedOption = reviewerList.value.find(re => re.reviewedBy === selectedId);
  if (selectedOption) {
    formData.value.reviewer = selectedOption.nickname;
    formData.value.reviewedBy = selectedId;
  }
};

const resetQuery = () => {
  queryFormRef.value.resetFields();
  getList();
};

const getList = async () => {
  loading.value = true;
  try {
    const data = await ProcessTaskStatisticsApi.getProcessTaskStatistics(queryParams);
    console.log(queryParams);
    list.value = data;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getList();
  await getReviewerList();
});
</script>
