<template>
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      ref="tableRef"
      :show-overflow-tooltip="true"
      :check-strictly="false"
      row-key="id"
      >
      <el-table-column type="selection" width="55" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="编号" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="设备状态" align="center" prop="status" >
        <template #default="scope">
          <template v-if="scope.row.equipmentStationType">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else type="warning">异常</el-tag>
          </template>
          <template v-else>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="enable" >
        <template #default="scope">
          <dict-tag :type="'enableStatus'" :value="scope.row.enable" />
        </template>
      </el-table-column>

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
      />
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {OrderFormApi} from "@/api/mcs/orderform";
import {inject, onMounted, ref} from "vue";
import ContentWrap from "@/components/ContentWrap/src/ContentWrap.vue";
import { dateFormatter } from '@/utils/formatTime'
import { DictTag } from "@/components/DictTag";

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const sharedInfo = inject("sharedInfo");
const message = useMessage() // 消息弹窗

const getDeviceList = async () => {
  if (sharedInfo.batchOrderIdList) {
    if (!sharedInfo.batchOrderIdList || sharedInfo.batchOrderIdList.length == 0) {
      list.value = []
    } else {
      const params = {orderIds: sharedInfo.batchOrderIdList.join(',')}
      list.value = await OrderFormApi.getDeviceByOrderId(params);
    }
  }
}

const tableRef = ref()
const getScheduleDeviceList = () => {
  const deviceList = [];
  const data = tableRef.value.getSelectionRows()
  if (data.length == 0) {
    for (let item of list.value) {
      deviceList.push(...item.children)
    }
  } else {
    for (let item of data) {
      if (item.type == 1) {
        deviceList.push(item)
      }
    }
  }
  return deviceList;
}
sharedInfo.getScheduleDeviceList = getScheduleDeviceList

onMounted(() => {
  getDeviceList()
})
</script>

<style scoped>

</style>
