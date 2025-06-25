<template>
  <ContentWrap>
    <el-table :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="申请单号" align="center" prop="applicationNumber" />
      <el-table-column label="申请代理人" align="center" prop="agent" />
      <el-table-column label="公司/组织" align="center" prop="organization" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="申请状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="'macsApplicationStatus'" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="申请原因/目的" align="center" prop="reason" />
    </el-table>
    <el-tabs model-value="visitorRegion">
      <el-tab-pane label="申请人员" name="visitorRegion">
        <ApplicationVisitor :application-id="props.id" @open="openRegionForm" />
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
  <VisitorRegion ref="regionRef"/>
</template>

<script lang="ts" setup>
import ApplicationVisitor from '../accessapplication/components/ApplicationVisitor.vue'
import VisitorRegion from '../accessapplication/components/VisitorRegion.vue'
import {AccessApplicationApi, AccessApplicationVO} from "@/api/macs/accessapplication";
import {propTypes} from "@/utils/propTypes";

const props = defineProps({
  id: propTypes.number.def(undefined)
})

const list = ref<AccessApplicationVO[]>([]) // 列表的数据

const getList = async () => {
  list.value = [await AccessApplicationApi.getAccessApplication(props.id)]
}

const regionRef = ref();
const openRegionForm = (row) => {
  regionRef.value.open(row, props.id)
}

onMounted(() => {
  getList()
})
</script>
