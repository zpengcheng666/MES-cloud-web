<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="任务编码" align="center" prop="batchRecordNumber"/>
      <el-table-column label="资源条码" align="center" prop="barCode"/>
      <el-table-column label="资源批次" align="center" prop="batchNumber"/>
      <el-table-column label="资源类型" align="center" prop="resourceType" width="120">
        <template #default="scope">
          <DictTag :type="'wms_material_type'" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="资源类码" align="center" prop="materialNumber"/>
      <el-table-column label="数量" align="center" prop="totality" width="100" />
      <el-table-column label="需求单元" align="center" prop="unitNumber"/>
      <el-table-column label="需求设备" align="center" prop="deviceNumber"/>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            v-if="props.demandStatus === 1"
          >
            修改
          </el-button>
          <el-button
            link
            type="danger"
            v-if="scope.row.status === 0 || scope.row.status === 1"
            @click="demandRevoke(scope.row)"
          >
            撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { dateFormatter } from '@/utils/formatTime'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import {BatchOrderDemandApi} from "@/api/mcs/batchorderdemand";

/** 生产订单详情 列表 */
defineOptions({ name: 'DemandRecordView' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
})
const queryFormRef = ref() // 搜索的表单
const props = defineProps<{
  demandId: undefined,
  demandStatus: undefined,
}>()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.demandId = props.demandId;
    const data = await BatchOrderDemandApi.getBatchOrderDemandRecordPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const demandRevoke = async (row: any) => {
  await message.confirm("撤销后不可恢复,是否撤销", "撤销确认")
  const msg = await BatchOrderDemandApi.demandRecordRevoke(row.id);
  message.success(msg);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
