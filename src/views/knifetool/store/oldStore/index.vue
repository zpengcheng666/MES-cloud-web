<!--
 * @Author: hyj
 * @Description: 旧刀入库
 * @Date: 2024-06-19 10:24:43
 * @LastEditTime: 2024-07-26 16:30:07
 * @FilePath: /cimp-tms-web/src/views/store/oldStore/index.vue
-->
<template>
  <ContentWrap>
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item prop="date">
        <el-date-picker v-model="queryParams.date" value-format="YYYY-MM-DD" type="daterange" range-separator="至"
          start-placeholder="入库开始日期" end-placeholder="入库结束日期" class="!w-330px" />
      </el-form-item>
      <el-form-item prop="receiptNumber">
        <el-input v-model="queryParams.receiptNumber" placeholder="单据编号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item prop="handover">
        <el-input v-model="queryParams.handover" placeholder="交接人员" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" />查询
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" />重置
        </el-button>
        <!-- <el-button @click="handleDownload"> <Icon icon="ep:download" />模板下载 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:upload" />导入 </el-button> -->
        <el-button @click="openCreate" type="primary">
          <Icon icon="ep:plus" />旧刀入库
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table :data="list" style="width: 100%" :default-expand-all="true" :row-style="{ background: '#ccc' }">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.childrens" :border="false">
            <template v-for="iColumn in subColumns" :key="iColumn.dataIndex">
              <el-table-column :label="iColumn.title" :prop="iColumn.dataIndex" :align="iColumn.align"
                :highlight-current-row="true" />
            </template>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button link type="primary" @click="openDetail(scope.row, '物码详情', 'old')" v-hasPermi="['']">
                  物码详情
                </el-button>
                <br />
                <el-button link type="primary" @click="openDetail(scope.row, '物码详情', 'old')" v-hasPermi="['']">
                  盒码详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <template v-for="column in columns" :key="column.dataIndex">
        <el-table-column v-if="column.dataIndex === 'createTime'" :prop="column.dataIndex" :label="column.title"
          align="center">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column v-else :prop="column.dataIndex" :label="column.title" :align="column.align" />
      </template>
    </el-table>

    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <viewDetails ref="detailRef" />
  <createForm ref="createRef" @success="getList" />
</template>

<script setup lang="ts">
import { getOldGoodPage } from '@/api/knifetool/store/oldStore'
import download from '@/utils/download'
import createForm from './createForm.vue'
import { formatDate } from '@/utils/formatTime'
import viewDetails from '@/views/knifetool/store/newStore/viewDetails.vue'

const loading = ref(true) // 列表的加载中
const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  receiptNumber: '',
  startTime: '',
  endTime: '',
  handover: '',
  date: ''
})

const columns = [
  { title: '单据编号', dataIndex: 'receiptNumber', align: 'center' },
  { title: '采购批次', dataIndex: 'purchaseBatch', align: 'center' },
  { title: '入库数量', dataIndex: 'amount', align: 'center' },
  {
    title: '入库时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    align: 'center'
  },
  { title: '交接人员', dataIndex: 'handover', align: 'center' }
]

const subColumns = [
  { title: '刀具类码', dataIndex: 'code', align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', align: 'center' },
  { title: '刀具名称', dataIndex: 'name', align: 'center' },
  { title: '通用规格', dataIndex: 'spec', align: 'center' },
  { title: '单价', dataIndex: 'price', align: 'center' },
  { title: '仓库名称', dataIndex: 'storeName', align: 'center' },
  { title: '货架名称', dataIndex: 'shelfName', align: 'center' },
  { title: '入库位置', dataIndex: 'location', align: 'center' },
  { title: '入库数量', dataIndex: 'amount', align: 'center' },
  { title: '操作员', dataIndex: 'admin', align: 'center' }
]

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getOldGoodPage(queryParams)
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
  queryParams.startTime = queryParams.date[0]
  queryParams.endTime = queryParams.date[1]
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (data: any, title: string, type: string) => {
  detailRef.value.open(data, title, type)
}

//新刀入库
const createRef = ref()
const openCreate = () => {
  createRef.value.open()
}

// 下载
const handleDownload = async () => {
  const data = await getOldGoodPage(queryParams)
  download.excel(data, '模板.xls')
}

// /** 导出按钮操作 */
// const handleExport = async () => {
//   try {
//     // 导出的二次确认
//     await message.exportConfirm()
//     // 发起导出
//     exportLoading.value = true
//     const data = await OperateLogApi.exportOperateLog(queryParams)
//     download.excel(data, '操作日志.xls')
//   } catch {
//   } finally {
//     exportLoading.value = false
//   }
// }

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

<style scoped></style>
