<template>
  <Dialog v-model="innerVisible" :title="dialogTitle" width="1200px">
    <ContentWrap>
      <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">

        <el-form-item label="物料名称" prop="toolName">
          <el-input
            v-model="queryParams.toolName"
            placeholder="请输入物料名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="物料编号" prop="materialNumber">
          <el-input
            v-model="queryParams.materialNumber"
            placeholder="请输入物料编号"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>

        <el-form-item label="类码" prop="materialTypeCode">
          <el-input
            v-model="queryParams.materialTypeCode"
            placeholder="请输入类码"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
          <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table
        ref="multipleTableRef"
        :data="list"
        style="width: 100%"
        class="mt-20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <template v-for="c in columns" :key="c.dataIndex">
          <el-table-column :prop="c.dataIndex" :label="c.title" align="center" />
        </template>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
        class="mt-20px"
      />
    </ContentWrap>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ToolConfigApi, ToolConfigVO } from '@/api/tms/toolconfig'
import { ElTable } from 'element-plus'
const message = useMessage() // 消息弹窗
const innerVisible = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(true) // 列表的加载中

const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  pageNo: 1,
  pageSize: 10,
  toolName: undefined,
  materialNumber: undefined,
  materialTypeCode: undefined,
  toolCategoryId: '',
  queryType: undefined
})
const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})
const columns = [
  { title: '名称', dataIndex: 'toolName', align: 'center', width: '200px' },
  { title: '编号', dataIndex: 'materialNumber', align: 'center', width: '200px' },
  { title: '类别', dataIndex: 'materialTypeName', align: 'center' },
  { title: '类码', dataIndex: 'materialTypeCode', align: 'center' },
  { title: '型号', dataIndex: 'toolModel', align: 'center' }
]

// 设置选中的刀具分类
const treeValue = ref()
const setFormTreeValue = (val) => {
  queryParams.value.toolCategoryId = val
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])


// 打开弹窗
const dialogTitle = ref()
const open = async (data: any) => {
  dialogTitle.value = [data === 1 || data === 3 ? '刀具' : '刀柄/配件'] + '信息'
  queryParams.value.queryType = data
  innerVisible.value = true
  await getList()
}
// 暴露 - 提供 open 方法，用于打开弹窗
defineExpose({ open })

const close = () => {
  innerVisible.value = false
  resetQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ToolConfigApi.getFitToolConfigPageByType(queryParams.value)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  multipleSelection.value = []
  queryFormRef.value.resetFields()
  handleQuery()
}

interface User {
  date: string
  name: string
  address: string
}

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!multipleSelection.value.length) {
    message.error('请选择数据！')
    return
  }
  try {
    innerVisible.value = false
    // 发送选中的对象的事件
    emit('success', { selection: multipleSelection.value, type: queryParams.value.queryType })
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped></style>
