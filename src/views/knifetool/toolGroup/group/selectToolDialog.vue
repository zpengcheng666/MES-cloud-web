<!--
 * @Author: hyj
 * @Description: 
 * @Date: 2024-06-21 10:29:56
 * @LastEditTime: 2024-07-31 11:28:36
 * @FilePath: /cimp-tms-web/src/views/toolGroup/group/selectToolDialog.vue
-->
<template>
  <Dialog v-model="innerVisible" :title="dialogTitle" width="1200px">
    <ContentWrap>
      <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
        <el-form-item prop="toolBrandId">
          <el-select v-model="queryParams.toolBrandId" class="!w-210px" placeholder="请选择品牌">
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.KNIFETOOL_BRAND)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="toolCategoryId">
          <formTreeSelect ref="treeValue" @tree-value="setFormTreeValue" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="刀具名称"
            clearable
            @keyup.enter="handleQuery"
            class="!w-210px"
          />
        </el-form-item>
        <el-form-item prop="spec">
          <el-input
            v-model="queryParams.spec"
            placeholder="刀具通用规格"
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
          <span style="display: flex; align-items: center">
            <Icon icon="ep:info-filled" style="margin-right: 10px" /> 已选择
            {{ multipleSelection.length }} 项
          </span>
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
          <template v-for="c in columns" :key="c.dataIndex">
            <el-table-column
              v-if="c.dataIndex === 'toolBrandId'"
              :prop="c.dataIndex"
              :label="c.title"
              align="center"
            >
              <template #default="scope">
                <dict-tag
                  v-if="scope.row.toolBrandId"
                  :type="DICT_TYPE.KNIFETOOL_BRAND"
                  :value="scope.row.toolBrandId"
                />
              </template>
            </el-table-column>

            <el-table-column v-else :prop="c.dataIndex" :label="c.title" align="center" />
          </template>
          <el-table-column
            v-if="queryParams.queryType === 2"
            prop="toolTypeId"
            label="刀柄规格"
            align="center"
          >
            <template #default="scope">
              <dict-tag
                v-if="scope.row.toolTypeId"
                :type="DICT_TYPE.KNIFETOOL_HILT_AXIS"
                :value="scope.row.toolTypeId"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="queryParams.queryType === 1"
            prop="toolTypeId"
            label="刀具类型"
            align="center"
          >
            <template #default="scope">
              <dict-tag
                v-if="scope.row.toolTypeId"
                :type="DICT_TYPE.KNIFETOOL_CUTTER_TYPE"
                :value="scope.row.toolTypeId"
              />
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
          class="mt-20px"
        />
      </div>
    </ContentWrap>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { getToolInfoPage } from '@/api/knifetool/tool/info'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
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
  name: '',
  code: '',
  spec: '',
  toolBrandId: '',
  toolCategoryId: '',
  queryType: 5
})
const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})
const columns = [
  { title: '刀具名称', dataIndex: 'name', align: 'center', width: '200px' },
  { title: '刀具类码', dataIndex: 'code', align: 'center' },
  { title: '刀具分类', dataIndex: 'toolCategoryValue', width: '200px', align: 'center' },
  { title: '刀具品牌', dataIndex: 'toolBrandId', align: 'center' },
  { title: '通用规格', dataIndex: 'spec', align: 'center' }
]

// 设置选中的刀具分类
const treeValue = ref()
const setFormTreeValue = (val) => {
  console.log(val)
  queryParams.value.toolCategoryId = val
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const toggleSelection = (rows?: User[]) => {
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

// 打开弹窗
const dialogTitle = ref()
const open = async (data: any) => {
  console.log(data)
  dialogTitle.value = [data === 1 ? '刀具' : data === 2 ? '刀柄' : '配件'] + '基本信息'
  queryParams.value.queryType = data
  innerVisible.value = true
  getList()
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
    const data = await getToolInfoPage(queryParams.value)
    console.log(data)
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
  // 清空刀具分类的值
  treeValue.value.toolCategoryValue = ''
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
  console.log(queryParams.value.queryType)
  console.log(multipleSelection.value.length)
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
