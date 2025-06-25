<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="姓名">
        {{ detailData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="部门">
        {{ detailData.dept }}
      </el-descriptions-item>
      <el-descriptions-item label="岗位">
        {{ detailData.job }}
      </el-descriptions-item>
      <el-descriptions-item label="打卡时间">
        {{ formatDate(detailData.clockTime, 'YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item label="异常缘由">
        {{ detailData.reason }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>


</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { OaClockApi} from '@/api/bpm/oaclock'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

defineOptions({ name: 'OaCloCkDetail' })

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
    detailData.value = await OaClockApi.getOaClock(props.id || queryId)
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
