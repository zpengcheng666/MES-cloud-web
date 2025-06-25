<template>
  <ContentWrap>
    <el-row :gutter="30">
      <el-col :span="15" :xs="24">
        <el-descriptions :column="2" border>
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
          <el-descriptions-item label="设计员" min-width="120">
            {{ detailData.reviewer }}
          </el-descriptions-item>
          <el-descriptions-item label="设计截止日期" min-width="120">
            {{ formatDate(detailData.deadline , 'YYYY-MM-DD') }}
          </el-descriptions-item>
          <el-descriptions-item label="技术条件" min-width="120">
            {{ detailData.technicalRequirement }}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="9" :xs="24">
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
      </el-col>
    </el-row>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE } from '@/utils/dict'
import { ToolingTaskApi, ToolingTaskVO} from "@/api/pdm/toolingTask";
import {dateFormatter, formatDate} from '@/utils/formatTime'
import {ref} from "vue";

defineOptions({ name: 'PDMToolingDetail' })

const detailData = ref<any>({}) // 详情数据
const { query } = useRoute() // 查询参数
const tableData = ref<ToolingTaskVO[]>([]) // 文件目录数据
const isOperator = ref(false)
const activeName1 = ref(['1'])
const queryId = query.id as unknown as number // 从URL传递过来的Id
const queryCustomizedIndex = query.customizedIndex as unknown as string

// 业务主键id(即id)
const props = defineProps({
  id: propTypes.number.def(undefined),
  customizedIndex: propTypes.string.def(undefined)
})

const formData = ref({
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
  name: '',
  requireTime: '',
  customizedIndex: '',
  equipmentName: '',
  equipmentNumber: '',
  status: '',
  processInstanceId: '',
  approvalStatus: '',
})

const queryParamsResult = reactive({
  id: '',
  categoryId: '',
  toolingCode: '',
  toolingNumber: '',
  toolingName: '',
  toolingVersion: '',
  applyName: '',
  name: '',
  quantity: '',
  customizedIndex: '',
  toolingStyle: '',
  processType: '',
  applyReason: '',
  requireTime: '',
  equipmentName: '',
  equipmentNumber: '',
  processInstanceId: '',
  approvalStatus: '',
  status: '3'
})

/** 获得数据 */
const getInfo = async () => {
  activeName1.value = '1'
  detailData.value = await ToolingTaskApi.getToolingDetail(props.id || queryId)
  tableData.value = await ToolingTaskApi.getFile(detailData.value.customizedIndex );
  queryParamsResult.categoryId = detailData.value.categoryId
  queryParamsResult.toolingCode = detailData.value.toolingCode
  queryParamsResult.toolingNumber = detailData.value.toolingNumber
  queryParamsResult.toolingName = detailData.value.toolingName
  queryParamsResult.toolingVersion = detailData.value.toolingVersion
  queryParamsResult.applyName = detailData.value.applyName
  queryParamsResult.quantity = detailData.value.quantity
  queryParamsResult.toolingStyle = detailData.value.toolingStyle
  queryParamsResult.name = detailData.value.name

}

/** 下载文件 */
const downloadFile = async (vaultUrl: string) => {
  window.open(vaultUrl, '_blank');
}

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
