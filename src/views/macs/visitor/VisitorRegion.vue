<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="区域编码" align="center" prop="regionCode" />
        <el-table-column label="区域名称" align="center" prop="regionName" />
        <el-table-column label="申请编号" align="center" prop="applicationNumber" />
        <el-table-column label="状态" align="center" prop="status" >
          <template #default="{row}">
            <span v-if="row.status === 1" class="el-tag el-tag--success el-tag--default el-tag--light">生效中</span>
            <span v-if="row.status === 0" class="el-tag el-tag--info el-tag--default el-tag--light">未生效</span>
            <span v-if="row.status === 2" class="el-tag el-tag--info el-tag--default el-tag--light">已失效</span>
            <span v-if="row.status === 3" class="el-tag el-tag--info el-tag--default el-tag--light">未通过</span>
          </template>
        </el-table-column>
        <el-table-column label="生效日期" align="center" prop="effectiveDate" width="170" />
        <el-table-column label="失效日期" align="center" prop="invalidDate" width="170" />
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { VisitorApi } from '@/api/macs/visitor'

/** 申请角色 表单 */
defineOptions({ name: 'VisitorForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('访客权限') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const list = ref([])
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  visitorId: '',
})

/** 打开弹窗 */
const open = (id) => {
  dialogVisible.value = true;
  queryParams.visitorId = id;
  getList();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getList = async () => {
  loading.value = true
  try {
    const data = await VisitorApi.getPageByVisitor(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

</script>
<style lang="scss">
.timelineClass{
  max-width: 600px;
  max-height: 600px;
  overflow: auto
}
.timelineClass::-webkit-scrollbar{
  display: none;
}
</style>
