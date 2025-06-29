<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="1200" @close="closeDialog">
    <ContentWrap>
      <!-- 搜索工作栏 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="68px"
      >
        <el-form-item label="是否已读" prop="readStatus">
          <el-select
            v-model="queryParams.readStatus"
            placeholder="请选择是否已读"
            clearable
            class="!w-240px"
          >
            <!--<dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.readStatus" />-->
              <el-option
                v-for="dict in getBoolDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap>
      <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
        <el-table-column label="接收人" align="center" prop="userId" />
        <el-table-column label="发送人" align="center" prop="templateNickname" />
        <el-table-column label="模版内容" align="center" prop="templateContent" min-width="300"/>
        <el-table-column label="是否已读" align="center" prop="readStatus">
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.INFRA_BOOLEAN_STRING" :value="scope.row.readStatus" />
          </template>
        </el-table-column>
        <el-table-column
          label="阅读时间"
          align="center"
          prop="readTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
          width="180px"
        />
        <el-table-column label="操作" align="center" width="120px">
          <template #default="scope">
            <el-button
              link
              type="primary"
              v-if = "!scope.row.readStatus"
              @click="updateMessage(scope.row)"
            >
              已读
            </el-button>
            <el-button
              link
              type="primary"
              v-if = "scope.row.readStatus"
              @click="openDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

  </Dialog>

  <MessageDetail ref="messageDetailRef" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { NotifyMessageApi, NotifyMessageVO } from '@/api/pms/notifymessage'
import { getIntDictOptions, getStrDictOptions,getBoolDictOptions, DICT_TYPE } from '@/utils/dict'
import MessageDetail from './MessageDetail.vue'

/** 简易版,项目计划提醒用 列表 */
defineOptions({ name: 'NotifyMessage' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const dialogTitle = ref('通知')
const loading = ref(true) // 列表的加载中
const list = ref<NotifyMessageVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  templateNickname: undefined,
  readStatus: undefined,
  readTime: [],
  createTime: [],
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

const dialogVisible = ref(false)
const messageDetailRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await NotifyMessageApi.getNotifyMessagePage(queryParams)
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
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 打开弹窗 */
const open = async () => {
  getList()
  dialogVisible.value = true

}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await NotifyMessageApi.deleteNotifyMessage(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await NotifyMessageApi.exportNotifyMessage(queryParams)
    download.excel(data, '简易版,项目计划提醒用.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const updateMessage = async (row)=>{
  await NotifyMessageApi.updateNotifyMessage({id:row.id,readStatus:true,readTime:Date.now()})
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const closeDialog = ()=>{
  console.log()
  queryFormRef.value.resetFields()
  dialogVisible.value = false;
}

const openDetail = (row)=>{
  messageDetailRef.value.open(row)
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>
