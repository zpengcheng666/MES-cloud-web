<template>
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" >
      <el-table-column label="工具名称" align="center" prop="toolName" />
      <el-table-column
        label="送检日期"
        align="center"
        prop="verificationDateBegin"
        :formatter="dateFormatter2"
        width="120px"
      />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_INSPECTION_TOOL_VERIFICATION_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id, 1)"
            v-hasPermi="['qms:inspection-tool-verification-record:update']"
            v-if="scope.row.status==0"
          >
            送检
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id, 2)"
            v-hasPermi="['qms:inspection-tool-verification-record:update']"
            v-else-if="scope.row.status==1"
          >
            完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <PaginationSmall
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <InspectionToolVerificationRecordForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {InspectionHomeApi} from "@/api/qms/home";
import InspectionToolVerificationRecordForm
  from "@/views/qms/inspectiontoolverificationrecord/InspectionToolVerificationRecordForm.vue";

/** 检验工具校准记录 列表 */
defineOptions({ name: 'InspectionToolVerificationRecord' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<InspectionToolVerificationRecordVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 4,
})
const queryFormRef = ref() // 搜索的表单

const formRef = ref()
const openForm = (type: string, id?: number, status: number) => {
  formRef.value.open(type, id, status)
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await InspectionHomeApi.getToolVerificationTask(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
