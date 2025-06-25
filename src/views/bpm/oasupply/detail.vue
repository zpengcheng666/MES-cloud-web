<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="部门">
        {{ detailData.dept }}
      </el-descriptions-item>
      <el-descriptions-item label="申请人">
        {{ detailData.applicant }}
      </el-descriptions-item>
      <el-descriptions-item label="部门领导">
        {{ detailData.leader }}
      </el-descriptions-item>
      <el-descriptions-item label="仓库管理员">
        {{ detailData.warehouseman }}
      </el-descriptions-item>
      <el-descriptions-item label="申请原因">
        {{ detailData.reason }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table :data="detailDataChildren">
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="数量" align="center" prop="amount" />
      <el-table-column label="单元" align="center" prop="unit" />
      <el-table-column label="库存" align="center" prop="inventory" />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
  </ContentWrap>

</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { OaSupplyApi} from '@/api/bpm/oasupply'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

defineOptions({ name: 'OaSupplyDetail' })

const { query } = useRoute() // 查询参数

const props = defineProps({
  id: propTypes.number.def(undefined)
})
const detailLoading = ref(false) // 表单的加载中
const detailData = ref<any>({}) // 详情数据
const detailDataChildren = ref([])//详情数据
const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

/** 获得数据 */
const getInfo = async () => {
  detailLoading.value = true
  try {
    detailData.value = await OaSupplyApi.getOaSupply(props.id || queryId)
    detailDataChildren.value = await OaSupplyApi.getOaSupplyListListBySupplyId(props.id || queryId)
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
