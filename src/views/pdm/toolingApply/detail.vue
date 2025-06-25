<template>
  <ContentWrap>
    <el-descriptions :column="4" border>
      <el-descriptions-item label="工装编号">
        {{ detailData.toolingCode }}
      </el-descriptions-item>
      <el-descriptions-item label="工装图号">
        {{ detailData.toolingNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="工装名称">
        {{ detailData.toolingName }}
      </el-descriptions-item>
      <el-descriptions-item label="工装分类">
        {{ detailData.name }}
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
      <el-descriptions-item label="申请人">
        {{ detailData.applyName }}
      </el-descriptions-item>
      <el-descriptions-item label="申请数量">
        {{ detailData.quantity }}
      </el-descriptions-item>
      <el-descriptions-item label="申请理由">
        <template #default>
          <dict-tag :type="DICT_TYPE.PDM_TOOLING_APPLY_REASON" :value="detailData.applyReason" />
        </template>
      </el-descriptions-item>
      <el-descriptions-item label="设备名称">
        {{ detailData.equipmentName }}
      </el-descriptions-item>
      <el-descriptions-item label="设备型号">
        {{ detailData.equipmentNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="需求日期" :formatter="dateFormatter">
        {{ formatDate(detailData.requireTime, 'YYYY-MM-DD') }}
      </el-descriptions-item>
      <el-descriptions-item label="技术条件">
        {{ detailData.technicalRequirement }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE } from '@/utils/dict'
import { ToolingApplyApi, ToolingApplyVO } from '@/api/pdm/toolingApply'
import { dateFormatter,formatDate } from '@/utils/formatTime'

defineOptions({ name: 'PDMToolingApply' })

const { query } = useRoute() // 查询参数

const isOperator = ref(false)
const activeName = ref(['1'])
const tableData = ref<ToolingApplyVO[]>([]) // 文件目录列表


// 业务主键id(即id)
const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailData = ref<any>({}) // 详情数据

const queryId = query.id as unknown as number // 从URL传递过来的Id

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
  requireTime: '',
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
  quantity: '',
  toolingStyle: '',
  processType: '',
  applyReason: '',
  requireTime: '',
  equipmentName: '',
  equipmentNumber: '',
  processInstanceId: '',
  approvalStatus: '',
  status: '2'
})

/** 获得数据 */
const getInfo = async () => {
  activeName.value = '1'
  detailData.value = await ToolingApplyApi.getToolingApply(props.id || queryId)

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
/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
