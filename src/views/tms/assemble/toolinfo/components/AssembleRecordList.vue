<template>
  <!-- 列表 -->
  <ContentWrap>
    <!-- <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['tms:tool-info:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button> -->
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!-- <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      /> -->
      <el-table-column label="配刀条码" align="center" prop="appendageBarCode" />
      <el-table-column label="配刀编号" align="center" prop="appendageMaterialNumber" />
      <el-table-column label="配刀类码" align="center" prop="appendageMaterialCode" />
      <el-table-column label="配刀类型" align="center" prop="appendageMaterialName" />
      <el-table-column label="配刀数量" align="center" prop="count" />
      <el-table-column label="配刀刀位" align="center" prop="site" />
      <el-table-column label="记录类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.ASSEMBLE_RECORD_TYPE" :value="scope.row.type" />
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
    <!-- 表单弹窗：添加/修改 -->
    <AssembleRecordForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ToolInfoApi } from '@/api/tms/toolinfo'
import AssembleRecordForm from './AssembleRecordForm.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  toolInfoId: undefined // 成品刀具id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  toolInfoId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.toolInfoId,
  (val) => {
    queryParams.toolInfoId = val
    handleQuery()
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolInfoApi.getAssembleRecordPage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (!props.toolInfoId) {
    message.error('请选择一个刀组信息')
    return
  }
  formRef.value.open(type, id, props.toolInfoId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ToolInfoApi.deleteAssembleRecord(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
</script>