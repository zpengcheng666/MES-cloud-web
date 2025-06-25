<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="会议主题">
        {{ detailData.title }}
      </el-descriptions-item>
      <el-descriptions-item label="参会人员">
        {{ detailData.staff }}
      </el-descriptions-item>
      <el-descriptions-item label="会议室">
        <dict-tag :type="DICT_TYPE.BPM_OA_MEETING_ROOM" :value="detailData.mroom" />
        <!--{{ detailData.mroom }}-->
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ formatDate(detailData.startTime, 'YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="结束时间">
        {{ formatDate(detailData.endTime, 'YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="描述">
        {{ detailData.description }}
      </el-descriptions-item>
      <el-descriptions-item label="会议材料">
        {{ detailData.document }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>


</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { OaMeetingApi} from '@/api/bpm/oameeting'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

defineOptions({ name: 'OaMeetingDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据

const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await OaMeetingApi.getOaMeeting(props.id || queryId)
  } finally {
    detailLoading.value = false
  }
}
defineExpose({ open: getInfo }) // 提供 open 方法，用于打开弹窗

/** 初始化 **/
onMounted(() => {
  getInfo()
})
</script>
