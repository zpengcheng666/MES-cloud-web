<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 10:29:56
 * @LastEditTime: 2024-07-16 11:12:18
 * @FilePath: /cimp-tms-web/src/views/paring/paringPlan/selectKnifeGroupDialog.vue
-->
<template>
  <Dialog v-model="innerVisible" title="添加刀组" width="1200px">
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
      <el-form-item prop="groupCode">
        <el-input
          v-model="queryParams.groupCode"
          placeholder="刀组编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-210px"
        />
      </el-form-item>
      <el-form-item prop="spec">
        <el-input
          v-model="queryParams.spec"
          placeholder="刀柄通用规格"
          clearable
          @keyup.enter="handleQuery"
          class="!w-210px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"> <Icon icon="ep:search" />查询 </el-button>
        <el-button @click="resetQuery"> <Icon icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="height: 600px" class="mt-20px">
      <div
        class="el-alert el-alert--success is-light"
        style="display: flex; justify-content: space-between"
      >
        <span style="display: flex; align-items: center"
          ><Icon icon="ep:info-filled" style="margin-right: 10px" /> 已选择
          {{ multipleSelection.length }} 项</span
        >
        <el-button @click="toggleSelection()">清除</el-button>
      </div>

      <el-table
        ref="multipleTableRef"
        :data="list"
        style="width: 100%"
        class="mt-20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column prop="groupCode" label="刀组编码" align="center" />
        <el-table-column prop="spec" label="刀柄通用规格" align="center" />
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
        class="mt-20px"
      />
    </div>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="innerVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { getToolGroup } from '@/api/knifetool/paring/paringPlan'
import { ElTable } from 'element-plus'

const innerVisible = ref(false)
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(true) // 列表的加载中

const total = ref(0)
const list = ref<any>([]) // 列表的数
const queryFormRef = ref() // 搜索的表单
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  groupCode: '',
  spec: ''
})

// 打开弹窗
const open = async () => {
  innerVisible.value = true
  getList()
}
// 暴露 - 提供 open 方法，用于打开弹窗
defineExpose({ open })

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getToolGroup(queryParams)
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

interface group {
  groupCode: string
  spec: string
}
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<group[]>([])
const toggleSelection = (rows?: group[]) => {
  if (rows) {
    rows.forEach((row) => {
      // TODO: improvement typing when refactor table
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      multipleTableRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    multipleTableRef.value!.clearSelection()
  }
}
const handleSelectionChange = (val: group[]) => {
  multipleSelection.value = val
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!multipleSelection.value.length) return
  try {
    innerVisible.value = false

    // 发送选中的对象的事件
    emit('success', { selection: multipleSelection.value })
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped></style>
