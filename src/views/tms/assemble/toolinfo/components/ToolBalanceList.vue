<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['tms:tool-info:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="平衡质量等级" align="center" prop="balancingQuality" />
      <el-table-column label="操作速度" align="center" prop="serviceSpeed" />
      <el-table-column label="质量单位[KG]" align="center" prop="weight" />
      <el-table-column label="标准值[gmm]" align="center" prop="staticUnbalance" />
      <el-table-column label="动平衡转速" align="center" prop="rpm" />
      <el-table-column label="质量等级结果" align="center" prop="balancingQualityReality" />
      <el-table-column label="允许机床转速" align="center" prop="maxSpeed" />
      <el-table-column label="结果[gmm]" align="center" prop="gmmResult" />
       <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['tms:tool-info:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['tms:tool-info:delete']"
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
    <!-- 表单弹窗：添加/修改 -->
    <ToolBalanceForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import { ToolInfoApi } from '@/api/tms/toolinfo'
import ToolBalanceForm from './ToolBalanceForm.vue'

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
    const data = await ToolInfoApi.getToolBalancePage(queryParams)
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
    await ToolInfoApi.deleteToolBalance(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
</script>