<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="65%">
    <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['macs:region:create']">
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
    <ContentWrap>
      <el-table highlight-current-row @current-change="handleCurrentChange" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
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
        <el-table-column label="电话" align="center" prop="phone" />
        <el-table-column label="状态" align="center" prop="status" >
          <template #default="scope">
            <dict-tag :type="'macsVisitorStatus'" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="公司组织" align="center" prop="organization" />
        <el-table-column label="部门" align="center" prop="department" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
    <VisitorForm ref="formRef" @success="getList" />
  </Dialog>
</template>
<script setup lang="ts">
import { AccessApplicationApi } from '@/api/macs/accessapplication'
import {VisitorApi} from "@/api/macs/visitor";
import VisitorForm from './VisitorForm.vue'

/** 申请角色 表单 */
defineOptions({ name: 'Visitor' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('访客') // 弹窗的标题
const loading = ref(true) // 列表的加载中
const formLoading = ref(false)
const list = ref([])
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
})

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true;
  await getList();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const formRef = ref();
const openForm = (type: string, id?: string) =>{
  formRef.value.open(type, id)
}
const getList = async () => {
  loading.value = true
  try {
    const data = await AccessApplicationApi.getVisitorPage(queryParams);
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const currentRow = ref({});
const handleCurrentChange = (val) => {
  currentRow.value = val
}

const emit = defineEmits(['success'])
const submitForm = async () => {
  emit('success',currentRow.value);
  dialogVisible.value = false
}
</script>
