<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="头像" align="center" prop="avatar" >
        <template #default="{row}">
          <img v-if="row.avatar" :src="row.avatar" height="23" width="23" />
          <span v-else v-text="row.avatar"></span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
        <template #default="scope">
          <dict-tag :type="'sex2'" :value="scope.row.sex" />
        </template>
      </el-table-column>
      <el-table-column label="公司/组织" align="center" prop="organization" />
      <el-table-column label="部门" align="center" prop="department" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row)">权限</el-button>
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
import { onMounted } from 'vue';
import { AccessApplicationApi } from '@/api/macs/accessapplication'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const emit = defineEmits(['success'])

const props = defineProps<{
  applicationId: undefined // 访客申请id（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationId: undefined,
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.applicationId = props.applicationId;
    const data = await AccessApplicationApi.getVisitorListByApplicationId(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const openForm = (row) => {
  emit('open',row);
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
