<!--
 * @Author: hyj
 * @Description: 配送管理
 * @Date: 2024-06-17 16:04:35
 * @LastEditTime: 2024-07-10 09:21:55
 * @FilePath: /cimp-tms-web/src/views/toolDelivery/deliveryToolTask/index.vue
-->
<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item prop="deliveryNo">
        <el-input v-model="queryParams.deliveryNo" placeholder="配送单号" class="!w-220px" />
      </el-form-item>

      <el-form-item prop="deliveryState">
        <el-select
          v-model="queryParams.deliveryState"
          placeholder="请选择配送状态"
          class="!w-220px"
        >
          <el-option label="待配送" value="0" />
          <el-option label="配送中" value="1" />
          <el-option label="配送完成" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item prop="deliveryBy">
        <el-select v-model="queryParams.deliveryBy" placeholder="请选择配送人员" class="!w-210px">
          <el-option label="" value="" />
        </el-select>
      </el-form-item>

      <el-form-item prop="deliveryMode">
        <el-select v-model="queryParams.deliveryMode" placeholder="请选择配送方式" class="!w-220px">
          <el-option label="自动配送" value="0" />
          <el-option label="人工配送" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item prop="toolGroupCode">
        <el-input v-model="queryParams.toolGroupCode" placeholder="刀组编码" class="!w-210px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%">
      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column
          :prop="column.dataIndex"
          :label="column.title"
          :align="column.align"
          :width="column.width"
        />
      </template>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button
            v-if="row.deliveryStateValue !== '待配送'"
            link
            type="primary"
            @click="openDetail(row)"
            v-hasPermi="['']"
          >
            详情
          </el-button>
          <el-button
            v-if="row.deliveryStateValue === '待配送'"
            link
            type="primary"
            @click="openScanCodeDelivery(row)"
            v-hasPermi="['']"
          >
            扫码
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

  <viewDetails ref="detailRef" />
  <scanCodeDelivery ref="scanCodeDeliveryRef" @success="getList" />
</template>

<script setup lang="ts">
import { getDeliveryTaskList } from '@/api/knifetool/toolDelivery/deliveryToolTask'
import viewDetails from './viewDetails.vue'
import scanCodeDelivery from './scanCodeDelivery.vue'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive<{
  pageNo: number
  pageSize: number
  deliveryNo: string
  deliveryState?: number
  deliveryBy?: number
  deliveryMode?: number
  toolGroupCode: string
}>({
  pageNo: 1,
  pageSize: 10,
  deliveryNo: '', //配送单号
  deliveryState: undefined, //配送状态
  deliveryBy: undefined, //配送人员
  deliveryMode: undefined, //配送方式
  toolGroupCode: '' //刀组编码
})

const columns = [
  {
    title: '配送单号',
    align: 'center',
    dataIndex: 'deliveryNo',
    width: '160px'
  },
  {
    title: '工单号',
    align: 'center',
    dataIndex: 'workOrderCode',
    width: '160px'
  },
  {
    title: '刀组编码',
    align: 'center',
    dataIndex: 'toolGroupCode'
  },
  {
    title: '刀组数量',
    align: 'center',
    dataIndex: 'deliveryQuantity'
  },
  {
    title: '配送地址',
    align: 'center',
    dataIndex: 'deliveryPosition'
  },
  {
    title: '接收人',
    align: 'center',
    dataIndex: 'receiveByName'
  },
  {
    title: '最晚配送时间',
    align: 'center',
    dataIndex: 'paringDeadline',
    scopedSlots: { customRender: 'paringDeadline' }
  },
  {
    title: '配送方式',
    align: 'center',
    dataIndex: 'deliveryModeValue'
  },
  {
    title: '配送人员',
    align: 'center',
    dataIndex: 'deliveryByValue'
  },
  {
    title: '配送状态',
    align: 'center',
    dataIndex: 'deliveryStateValue'
  }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getDeliveryTaskList(queryParams)
    console.log(data)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // 清空刀具分类的值
  handleQuery()
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any) => {
  detailRef.value.open(data)
}

// 扫码
const scanCodeDeliveryRef = ref()
const openScanCodeDelivery = (data: any) => {
  scanCodeDeliveryRef.value.open(data)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
