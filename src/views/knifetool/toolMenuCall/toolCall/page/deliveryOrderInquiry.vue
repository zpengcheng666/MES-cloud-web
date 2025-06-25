<!--
 * @Author: hyj
 * @Description: 配送单查询
 * @Date: 2024-07-24 09:29:49
 * @LastEditTime: 2024-07-24 15:21:16
 * @FilePath: /cimp-tms-web/src/views/toolMenuCall/toolCall/page/deliveryOrderInquiry.vue
-->
<template>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <el-table-column label="配送单号" align="center" prop="deliveryNo" />
      <el-table-column label="工单号" align="center" prop="workOrderCode" />
      <el-table-column label="刀组编码" align="center" prop="toolGroupCode" />
      <el-table-column align="center" label="刀组数量" prop="deliveryQuantity" />
      <el-table-column label="配送目的地" align="center" prop="deliveryPosition" />
      <el-table-column label="接收人" align="center" prop="receiveByName" />
      <el-table-column label="最晚配送时间" align="center" prop="paringDeadline">
        <template #default="{ row }">
          {{ formatDate(row.paringDeadline) }}
        </template>
      </el-table-column>
      <el-table-column label="配送方式" align="center" prop="deliveryModeValue" />
      <el-table-column label="配送人员" align="center" prop="deliveryByValue" />
      <el-table-column label="配送状态" align="center" prop="deliveryStateValue">
        <template #default="{ row }">
          <el-tag v-if="row.deliveryStateValue === '待配送'" type="warning">{{
            row.deliveryStateValue
          }}</el-tag>
          <el-tag v-if="row.deliveryStateValue === '配送中'">{{ row.deliveryStateValue }}</el-tag>
          <el-tag v-if="row.deliveryStateValue === '配送完成'" type="success">{{
            row.deliveryStateValue
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button v-if="row.deliveryState === 1" link type="primary" @click="handleConfirm(row)">
            收到刀具确认
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
import { getDeliveryTasklist, updateDeliveryState } from '@/api/knifetool/toolMenuCall/toolCall'
import { formatDate } from '@/utils/formatTime'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})

const getList = async () => {
  loading.value = true
  try {
    const data = await getDeliveryTasklist(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleConfirm = (row) => {
  console.log(row)
  ElMessageBox.confirm('是否确认此操作吗？')
    .then(async () => {
      const data = await updateDeliveryState({
        id: row.id,
        deliveryState: 2
      })
      if (data) {
        ElMessage({ message: '操作成功', type: 'success' })
      } else {
        ElMessage({ message: data.msg, type: 'error' })
      }
      getList()
    })
    .catch(() => {
      // catch error
    })
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
