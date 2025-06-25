<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="物料批次码" align="center" prop="batchNumber" />
      <el-table-column label="资源类型" align="center" prop="resourceType" >
        <template #default="{ row }">
          <dict-tag :type="'wms_material_type'" :value="row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="资源类码" align="center" prop="materialNumber" />
      <el-table-column label="资源条码" align="center" prop="barCode" />
      <el-table-column label="需求数量" align="center" prop="count" />
      <el-table-column label="配送状态" align="center" prop="status" >
        <template #default="scope">
          <dict-Tag :type="'mcs_delivery_record_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="计划开工时间"
        align="center"
        prop="planStartTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" v-if="showOperation">
        <template #default="scope">
<!--          <el-button type="primary" v-if="scope.row.status === 1" link @click="signForReceipt(scope.row)">
            签收
          </el-button>-->
          <el-button type="primary" v-if="scope.row.status === 0 || scope.row.status === 3 || scope.row.status === 5" link @click="distributionRecordRevoke(scope.row)">
            撤销
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
  <TestForm ref="testFormRef" />
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { DistributionApplicationApi } from '@/api/mcs/distributionapplication'
import DictTag from "@/components/DictTag/src/DictTag.vue";
import TestForm from '@/views/mcs/test/TestForm.vue'
import {data} from "autoprefixer";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  applicationId: undefined // 申请id（主表的关联字段）
  showOperation: boolean //可操作?
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await DistributionApplicationApi.listByApplication(props.applicationId)
  } finally {
    loading.value = false
  }
}

const distributionRecordRevoke = async (row: any) => {
  await message.confirm("撤销后不可恢复,是否撤销", "撤销确认")
  const msg = await DistributionApplicationApi.recordRevokeById(row.id);
  message.success(msg);
}

const testFormRef = ref()
const signForReceipt = (row: any) => {
  const data = row.id
  testFormRef.value.doFun("materialReception", data)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
