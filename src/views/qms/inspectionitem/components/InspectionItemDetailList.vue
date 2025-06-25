<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['qms:inspection-item:create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <!--<el-table-column label="主键" align="center" prop="id" />-->

      <el-table-column label="检测项" align="center" prop="inspectionItemConfigName" />
       <el-table-column label="判断方式" align="center" prop="referenceType" >

         <template #default="scope">
           <dict-tag :type="DICT_TYPE.QMS_REFERENCE_TYPE" :value="scope.row.referenceType" />
         </template>
       </el-table-column>
      <el-table-column label="技术要求" align="center" prop="number" />
      <el-table-column label="上限值" align="center" prop="maxValue" />
      <el-table-column label="下限值" align="center" prop="minValue" />
      <el-table-column label="文本内容" align="center" prop="content" />
      <el-table-column label="判断" align="center" prop="judgement" />

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['qms:inspection-item:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['qms:inspection-item:delete']"
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
    <InspectionItemDetailForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
// import { InspectionItemDetailApi } from '@/api/qms/inspectionitemdetail'
import InspectionItemDetailForm from './InspectionItemDetailForm.vue'
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  inspectionItemId: undefined // 检测项目ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  inspectionItemId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.inspectionItemId,
  (val) => {
    queryParams.inspectionItemId = val
    handleQuery()
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // const data = await InspectionItemDetailApi.getInspectionItemDetailPage(queryParams)
    // list.value = data.list
    // total.value = data.total
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
  if (!props.inspectionItemId) {
    message.error('请选择一个检测项目')
    return
  }
  formRef.value.open(type, id, props.inspectionItemId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    // await InspectionItemDetailApi.deleteInspectionItemDetail(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
</script>
