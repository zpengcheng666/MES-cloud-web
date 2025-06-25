<template>
  <ContentWrap>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="部门">
        {{ detailData.dept }}
      </el-descriptions-item>
      <el-descriptions-item label="申请人">
        {{ detailData.applicant }}
      </el-descriptions-item>
      <el-descriptions-item label="采购人">
        {{ detailData.purchaseAgent }}
      </el-descriptions-item>
      <!--<el-descriptions-item label="开始时间">-->
        <!--{{ formatDate(detailData.startTime, 'YYYY-MM-DD') }}-->
      <!--</el-descriptions-item>-->
      <!--<el-descriptions-item label="结束时间">-->
        <!--{{ formatDate(detailData.endTime, 'YYYY-MM-DD') }}-->
      <!--</el-descriptions-item>-->
      <el-descriptions-item label="供应商">
        {{ detailData.supplier }}
      </el-descriptions-item>
      <el-descriptions-item label="供应商编码">
        {{ detailData.supplyCode }}
      </el-descriptions-item>
      <el-descriptions-item label="联系人">
        {{ detailData.contact }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ detailData.tel }}
      </el-descriptions-item>
    </el-descriptions>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table :data="detailDataChildren">
      <el-table-column label="品名规格" align="center" prop="nameSpe" />
      <el-table-column label="用途" align="center" prop="intention" />
      <el-table-column label="数量" align="center" prop="amount" />
      <el-table-column
        label="需求时间"
        align="center"
        prop="requireTime"
        width="180"
        :formatter="dateFormatter2"
      />
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>
  </ContentWrap>

</template>
<script lang="ts" setup>
import { DICT_TYPE } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'
import { OaPurchaseApi} from '@/api/bpm/oapurchase'
import { dateFormatter,dateFormatter2 } from '@/utils/formatTime'

defineOptions({ name: 'OaPurchaseDetail' })

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
    detailData.value = await OaPurchaseApi.getOaPurchase(props.id || queryId)
    detailDataChildren.value = await OaPurchaseApi.getOaPurchaseListListByPurchaseId(props.id || queryId)
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
