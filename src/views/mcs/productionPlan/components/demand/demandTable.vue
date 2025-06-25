<template>
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      :stripe="true"
      :show-overflow-tooltip="true"
      :expand-row-keys="expandKey"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <ContentWrap>
            <demand-record-table :demandId="scope.row.id"/>
          </ContentWrap>
        </template>
      </el-table-column>
      <el-table-column label="资源编码" align="center" prop="resourceTypeCode" />
      <el-table-column label="资源类型" align="center" prop="resourceType" >
        <template #default="scope">
          <DictTag :type="'wms_material_type'" :value="scope.row.resourceType" />
        </template>
      </el-table-column>
      <el-table-column label="需求数量" align="center" prop="total" />
      <el-table-column label="齐备状态" align="center" prop="status"  >
        <template #default="scope">
          <DictTag :type="'mcs_ready_status'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="确认人" align="center" prop="confirmedByName" />
      <el-table-column
        label="确认时间"
        align="center"
        prop="confirmedTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openResourceSortingView(scope.row)"
            v-hasPermi="['mcs:order-form:update']"
            v-if="scope.row.status === 0 || scope.row.status === 1"
          >
            分拣
          </el-button>
          <el-button
            link
            type="primary"
            @click="completeConfirm(scope.row)"
            v-hasPermi="['mcs:order-form:update']"
            v-if="scope.row.status === 1 || scope.row.status === 2"
          >
            齐备确认
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['mcs:order-form:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import {ref, inject, onMounted} from "vue";
import {BatchOrderDemandApi} from "@/api/mcs/batchorderdemand";
import DemandRecordTable from "@/views/mcs/productionPlan/components/demand/demandRecordTable.vue";

const props = defineProps<{
  orderId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

const getList = async () => {
  loading.value = true
  try {
    list.value = await BatchOrderDemandApi.getListByOrderId({orderId: props.orderId});
  } finally {
    loading.value = false
  }
}
sharedInfo.demandReload = getList;

const expandKey = ref([]);
const expandChange = (row: any, expandedRows: any[]) => {
  if (expandedRows && expandedRows.length > 0) {
    expandKey.value = [row.id];
  }
  else expandKey.value = [];
}

const openResourceSortingView = (row: any) => {
  if (row.resourceType == 'GJ') {
    sharedInfo.materialSortingOpen(row);
  } else if (row.resourceType == 'GZ') {
    sharedInfo.toolSortingOpen(row);
  } else if (row.resourceType == 'DJ') {
    sharedInfo.cuttingSortingOpen(row);
  }
}

const completeConfirm = async (row: any) => {
  await message.confirm("是否提交备料信息", "齐备确认");
  const data = await BatchOrderDemandApi.demandCompleteConfirm(row.id)
  message.success(data)
  await getList();
}

const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await BatchOrderDemandApi.deleteBatchOrderDemand(id)
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})

</script>

<style scoped>

</style>
